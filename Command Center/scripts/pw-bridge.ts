#!/usr/bin/env npx tsx
/**
 * ═══════════════════════════════════════════════════════════════
 *   🌉 ORBIT BRIDGE — PW Live → Orbit Tracker Data Sync
 *   Electric Purple Terminal Vibe (#8e44ad)
 * ═══════════════════════════════════════════════════════════════
 */

import 'dotenv/config';
import { chromium, type Page, type BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// ─── PURPLE LOGGER ───────────────────────────────────────────
const PURPLE = '\x1b[38;2;142;68;173m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[38;2;46;204;113m';
const RED = '\x1b[38;2;231;76;60m';
const YELLOW = '\x1b[38;2;241;196;15m';

const log = {
    bridge: (msg: string) =>
        console.log(`${PURPLE}${BOLD}[BRIDGE]${RESET} ${PURPLE}${msg}${RESET}`),
    success: (msg: string) =>
        console.log(`${PURPLE}${BOLD}[BRIDGE]${RESET} ${GREEN}✅ ${msg}${RESET}`),
    error: (msg: string) =>
        console.log(`${PURPLE}${BOLD}[BRIDGE]${RESET} ${RED}❌ ${msg}${RESET}`),
    warn: (msg: string) =>
        console.log(`${PURPLE}${BOLD}[BRIDGE]${RESET} ${YELLOW}⚠️  ${msg}${RESET}`),
    info: (msg: string) =>
        console.log(`${PURPLE}${BOLD}[BRIDGE]${RESET} ${DIM}${msg}${RESET}`),
    header: (msg: string) => {
        const bar = '═'.repeat(50);
        console.log(`\n${PURPLE}${BOLD}${bar}${RESET}`);
        console.log(`${PURPLE}${BOLD}  🌉 ${msg}${RESET}`);
        console.log(`${PURPLE}${BOLD}${bar}${RESET}\n`);
    },
    sync: (chapter: string, pct: number) =>
        console.log(
            `${PURPLE}${BOLD}[BRIDGE]${RESET} ${PURPLE}Syncing ${chapter}: ${BOLD}${pct}%${RESET} ${PURPLE}Complete...${RESET} ${pct === 100 ? `${GREEN}DONE${RESET}` : `${YELLOW}IN PROGRESS${RESET}`}`
        ),
    dpp: (chapter: string, link: string) =>
        console.log(
            `${PURPLE}${BOLD}[BRIDGE]${RESET} ${PURPLE}📚 New DPP detected for ${BOLD}${chapter}${RESET}${PURPLE} → Ingesting...${RESET}`
        ),
};

// ─── TYPES ───────────────────────────────────────────────────
interface ScrapedChapter {
    chapterName: string;
    completionPercentage: number;
    dppLinks: string[];
}

interface Mission {
    id: string;
    chapter: string;
    status: string;
    completionPercentage: number;
    dppLinks?: string[];
    revisions: any[];
    accuracyHistory: any[];
    dependencies: string[];
}

// ─── CONFIG ──────────────────────────────────────────────────
const __script_dir = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__script_dir, '..');
const MISSIONS_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'missions.json');
const RESEARCH_PATH = path.join(PROJECT_ROOT, 'src', 'research');
const PW_LOGIN_URL = 'https://www.physicswallah.live/login';
const PW_BATCHES_URL = 'https://www.pw.live/study/batches';
const CHROME_PROFILE = path.join(process.env.HOME || '~', 'pw_chrome_profile');
const DRY_RUN = process.argv.includes('--dry-run');

// Target chapters to scrape
const TARGET_CHAPTERS: Record<string, { subject: string; matchTerms: string[] }> = {
    'solutions': {
        subject: 'Chemistry',
        matchTerms: ['solutions', 'solution'],
    },
    'electrostatics': {
        subject: 'Physics',
        matchTerms: ['electrostatics', 'electrostatic', 'electric charges'],
    },
    'relations-and-functions': {
        subject: 'Maths',
        matchTerms: ['relations & functions', 'relations and functions', 'relation and function'],
    },
};

// ─── MOCK DATA (DRY-RUN) ────────────────────────────────────
const MOCK_SCRAPED_DATA: ScrapedChapter[] = [
    {
        chapterName: 'Solutions',
        completionPercentage: 100,
        dppLinks: [
            'https://pw.live/dpp/solutions-01.pdf',
            'https://pw.live/dpp/solutions-02.pdf',
            'https://pw.live/dpp/solutions-03.pdf', // new one!
        ],
    },
    {
        chapterName: 'Electrostatics',
        completionPercentage: 72,
        dppLinks: [
            'https://pw.live/dpp/electrostatics-01.pdf',
            'https://pw.live/dpp/electrostatics-02.pdf',
        ],
    },
    {
        chapterName: 'Relations & Functions',
        completionPercentage: 45,
        dppLinks: [
            'https://pw.live/dpp/relations-functions-01.pdf',
        ],
    },
];

// ─── CHAPTER MATCHING ────────────────────────────────────────
function matchChapterToMission(
    scrapedName: string,
    missions: Mission[]
): Mission | null {
    const normalized = scrapedName.toLowerCase().trim();

    // Direct match on chapter field
    for (const mission of missions) {
        if (mission.chapter.toLowerCase() === normalized) {
            return mission;
        }
    }

    // Fuzzy match using target config
    for (const [key, config] of Object.entries(TARGET_CHAPTERS)) {
        for (const term of config.matchTerms) {
            if (normalized.includes(term) || term.includes(normalized)) {
                // Find mission by key or similar
                const found = missions.find(
                    (m) =>
                        m.chapter.toLowerCase().includes(key) ||
                        m.id.toLowerCase().includes(key) ||
                        config.matchTerms.some((t) => m.chapter.toLowerCase().includes(t))
                );
                if (found) return found;
            }
        }
    }

    return null;
}

// ─── AUTH MODULE ─────────────────────────────────────────────
async function authenticate(): Promise<BrowserContext> {
    log.bridge('🔐 Initializing PW Live authentication...');

    const email = process.env.PW_EMAIL;
    const password = process.env.PW_PASSWORD;

    if (!email || !password) {
        log.error('PW_EMAIL and PW_PASSWORD must be set in .env');
        log.info('Copy .env.example to .env and fill in your credentials');
        process.exit(1);
    }

    // Use persistent context so OTP is only needed once
    const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
        headless: false, // Must be visible for OTP entry
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    try {
        log.bridge('📡 Navigating to PW Live login...');
        await page.goto(PW_LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });

        // Check if already logged in (redirected away from login)
        if (!page.url().includes('login')) {
            log.success('Already authenticated (session restored)');
            await page.close();
            return context;
        }

        // Enter credentials
        log.bridge('📧 Entering email...');
        await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', email);

        log.bridge('🔑 Entering password...');
        await page.fill('input[type="password"], input[name="password"]', password);

        // Click login button
        await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
        log.bridge('⏳ Waiting for login response...');

        // Wait for potential OTP screen or redirect
        await page.waitForTimeout(3000);

        // If OTP is required, wait for manual entry
        const isOtpRequired = await page.$('input[type="tel"], input[placeholder*="OTP" i], input[name="otp"]');
        if (isOtpRequired) {
            log.warn('🔢 OTP Required — Enter it in the browser window');
            log.bridge('⏳ Waiting up to 30 seconds for OTP entry...');

            // Wait for navigation away from OTP page (max 30s)
            try {
                await page.waitForURL((url) => !url.toString().includes('login') && !url.toString().includes('otp'), {
                    timeout: 30000,
                });
                log.success('OTP accepted! Authenticated successfully.');
            } catch {
                log.error('OTP timeout — could not authenticate within 30 seconds.');
                log.info('Try running the script again. Your session may be partially saved.');
                await context.close();
                process.exit(1);
            }
        } else {
            // Wait for redirect to dashboard
            try {
                await page.waitForURL((url) => !url.toString().includes('login'), { timeout: 15000 });
                log.success('Authenticated successfully!');
            } catch {
                log.warn('Login redirect not detected — proceeding anyway...');
            }
        }

        await page.close();
        return context;
    } catch (err) {
        log.error(`Authentication failed: ${err}`);
        await page.close();
        await context.close();
        process.exit(1);
    }
}

// ─── SCRAPER MODULE ──────────────────────────────────────────
async function scrapeChapterData(context: BrowserContext): Promise<ScrapedChapter[]> {
    log.bridge('🔭 Navigating to My Batches → Lakshya JEE 2026...');

    const page = await context.newPage();
    const chapters: ScrapedChapter[] = [];

    try {
        await page.goto(PW_BATCHES_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // Look for Lakshya JEE 2026 batch
        log.bridge('🎯 Searching for Lakshya JEE 2026 batch...');
        const batchCard = await page.$('text=Lakshya JEE 2026') ||
            await page.$('[class*="batch"]:has-text("Lakshya")');

        if (batchCard) {
            await batchCard.click();
            await page.waitForTimeout(3000);
            log.success('Found and opened Lakshya JEE 2026 batch');
        } else {
            log.warn('Could not find Lakshya batch card — trying direct navigation...');
            // Try known batch URL patterns
            await page.goto('https://www.pw.live/study/batches/lakshya-jee-2026', {
                waitUntil: 'networkidle',
                timeout: 15000,
            }).catch(() => { });
        }

        // Scrape each target chapter
        for (const [key, config] of Object.entries(TARGET_CHAPTERS)) {
            log.bridge(`🔍 Searching for ${config.matchTerms[0]} (${config.subject})...`);

            try {
                // Try to find chapter via subject tabs + chapter listing
                const subjectTab = await page.$(`text=${config.subject}`) ||
                    await page.$(`[class*="tab"]:has-text("${config.subject}")`);
                if (subjectTab) {
                    await subjectTab.click();
                    await page.waitForTimeout(2000);
                }

                // Find the specific chapter
                let chapterName = config.matchTerms[0];
                let completionPct = 0;
                const dppLinks: string[] = [];

                // Try various selectors for chapter cards/items
                const chapterElements = await page.$$('[class*="chapter"], [class*="topic"], [class*="subject-content"] li');

                for (const el of chapterElements) {
                    const text = await el.textContent();
                    if (text && config.matchTerms.some((t) => text.toLowerCase().includes(t))) {
                        chapterName = text.trim().split('\n')[0].trim();

                        // Try to extract percentage
                        const pctEl = await el.$('[class*="progress"], [class*="percent"], [class*="completion"]');
                        if (pctEl) {
                            const pctText = await pctEl.textContent();
                            const match = pctText?.match(/(\d+)%?/);
                            if (match) completionPct = parseInt(match[1], 10);
                        }

                        // Try to find DPP/PDF links
                        const links = await el.$$('a[href*="pdf"], a[href*="dpp"], a[href*="download"]');
                        for (const link of links) {
                            const href = await link.getAttribute('href');
                            if (href) dppLinks.push(href);
                        }

                        break;
                    }
                }

                chapters.push({
                    chapterName: chapterName.charAt(0).toUpperCase() + chapterName.slice(1),
                    completionPercentage: completionPct,
                    dppLinks,
                });

                log.sync(chapterName, completionPct);
            } catch (err) {
                log.warn(`Could not scrape ${config.matchTerms[0]}: ${err}`);
                chapters.push({
                    chapterName: config.matchTerms[0],
                    completionPercentage: 0,
                    dppLinks: [],
                });
            }
        }

        await page.close();
        return chapters;
    } catch (err) {
        log.error(`Scraping failed: ${err}`);
        await page.close();
        return chapters;
    }
}

// ─── LOCAL INTEGRATION ───────────────────────────────────────
function updateMissions(scrapedData: ScrapedChapter[]): {
    updatedCount: number;
    newDpps: Array<{ chapter: string; link: string }>;
} {
    log.bridge('📝 Reading missions.json...');

    let missions: Mission[] = [];
    if (fs.existsSync(MISSIONS_PATH)) {
        missions = JSON.parse(fs.readFileSync(MISSIONS_PATH, 'utf-8'));
        log.info(`Loaded ${missions.length} existing missions`);
    } else {
        log.warn('missions.json not found — creating new file');
    }

    let updatedCount = 0;
    const newDpps: Array<{ chapter: string; link: string }> = [];

    for (const scraped of scrapedData) {
        const mission = matchChapterToMission(scraped.chapterName, missions);

        if (mission) {
            log.bridge(`🔗 Matched "${scraped.chapterName}" → ${mission.id}`);

            // Update completion percentage
            const oldPct = mission.completionPercentage;
            mission.completionPercentage = scraped.completionPercentage;

            // Update status
            if (scraped.completionPercentage === 100) {
                mission.status = 'Completed';
            } else if (scraped.completionPercentage > 0) {
                mission.status = 'In Progress';
            }

            // Detect new DPP links
            const existingLinks = new Set(mission.dppLinks || []);
            const newLinks = scraped.dppLinks.filter((link) => !existingLinks.has(link));

            if (newLinks.length > 0) {
                mission.dppLinks = [...(mission.dppLinks || []), ...newLinks];
                for (const link of newLinks) {
                    newDpps.push({ chapter: scraped.chapterName, link });
                    log.dpp(scraped.chapterName, link);
                }
            }

            if (oldPct !== scraped.completionPercentage || newLinks.length > 0) {
                updatedCount++;
            }

            log.sync(scraped.chapterName, scraped.completionPercentage);
        } else {
            log.warn(`No matching mission found for "${scraped.chapterName}" — creating new entry`);

            // Create a new mission entry
            const newId = `pw-${scraped.chapterName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-01`;
            const newMission: Mission = {
                id: newId,
                chapter: scraped.chapterName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                status: scraped.completionPercentage === 100 ? 'Completed' : scraped.completionPercentage > 0 ? 'In Progress' : 'Not Started',
                completionPercentage: scraped.completionPercentage,
                dppLinks: scraped.dppLinks,
                revisions: [],
                accuracyHistory: [],
                dependencies: [],
            };

            missions.push(newMission);
            updatedCount++;

            for (const link of scraped.dppLinks) {
                newDpps.push({ chapter: scraped.chapterName, link });
            }

            log.sync(scraped.chapterName, scraped.completionPercentage);
        }
    }

    // Write updated missions
    log.bridge('💾 Writing updated missions.json...');
    const dir = path.dirname(MISSIONS_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MISSIONS_PATH, JSON.stringify(missions, null, 4) + '\n');
    log.success(`missions.json updated (${updatedCount} changes)`);

    return { updatedCount, newDpps };
}

// ─── NOTEBOOKLM INGEST HOOK ─────────────────────────────────
function ingestDpps(newDpps: Array<{ chapter: string; link: string }>) {
    if (newDpps.length === 0) {
        log.info('No new DPPs to ingest');
        return;
    }

    log.bridge(`📚 Ingesting ${newDpps.length} new DPP(s) into NotebookLM...`);

    for (const { chapter, link } of newDpps) {
        const chapterPath = chapter.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const destDir = path.join(RESEARCH_PATH, chapterPath);
        const cmd = `notebooklm-py ingest --source "${link}" --dest "${destDir}/"`;

        if (DRY_RUN) {
            log.info(`[DRY-RUN] Would execute: ${cmd}`);
        } else {
            try {
                // Ensure research directory exists
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }
                log.bridge(`Executing: ${cmd}`);
                execSync(cmd, { stdio: 'pipe' });
                log.success(`Ingested DPP for ${chapter}`);
            } catch (err) {
                log.warn(`NotebookLM ingest failed for ${chapter}: ${err}`);
                log.info('You can retry manually with:');
                log.info(`  ${cmd}`);
            }
        }
    }
}

// ─── SUMMARY REPORT ─────────────────────────────────────────
function printSummary(
    scrapedData: ScrapedChapter[],
    updatedCount: number,
    newDpps: Array<{ chapter: string; link: string }>
) {
    log.header('ORBIT BRIDGE — SYNC REPORT');

    const timeStr = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    console.log(`${PURPLE}  📅 Sync Time:    ${BOLD}${timeStr}${RESET}`);
    console.log(`${PURPLE}  🔧 Mode:         ${BOLD}${DRY_RUN ? 'DRY RUN (Mock Data)' : 'LIVE'}${RESET}`);
    console.log(`${PURPLE}  📊 Chapters:     ${BOLD}${scrapedData.length}${RESET}`);
    console.log(`${PURPLE}  ✏️  Updated:      ${BOLD}${updatedCount}${RESET}`);
    console.log(`${PURPLE}  📚 New DPPs:     ${BOLD}${newDpps.length}${RESET}`);
    console.log('');

    for (const ch of scrapedData) {
        const bar = '█'.repeat(Math.floor(ch.completionPercentage / 5));
        const empty = '░'.repeat(20 - Math.floor(ch.completionPercentage / 5));
        const status = ch.completionPercentage === 100 ? `${GREEN}DONE${RESET}` : `${YELLOW}${ch.completionPercentage}%${RESET}`;
        console.log(`${PURPLE}  ${bar}${DIM}${empty}${RESET} ${PURPLE}${ch.chapterName}${RESET} ${status}`);
    }

    console.log(`\n${PURPLE}${BOLD}${'═'.repeat(50)}${RESET}\n`);
}

// ─── MAIN ────────────────────────────────────────────────────
async function main() {
    log.header('ORBIT BRIDGE — PW Live → Orbit Tracker');

    if (DRY_RUN) {
        log.warn('Running in DRY-RUN mode — using mock data');
        log.info('No browser will be launched. No external connections made.\n');
    }

    let scrapedData: ScrapedChapter[];

    if (DRY_RUN) {
        // Use mock data
        scrapedData = MOCK_SCRAPED_DATA;
        for (const ch of scrapedData) {
            log.sync(ch.chapterName, ch.completionPercentage);
        }
    } else {
        // Live scraping
        const context = await authenticate();
        scrapedData = await scrapeChapterData(context);
        await context.close();

        if (scrapedData.length === 0) {
            log.error('No data scraped — aborting without modifying missions.json');
            process.exit(1);
        }
    }

    // Update local missions.json
    const { updatedCount, newDpps } = updateMissions(scrapedData);

    // Ingest new DPPs into NotebookLM
    ingestDpps(newDpps);

    // Print summary report
    printSummary(scrapedData, updatedCount, newDpps);

    log.success('Orbit Bridge sync complete! 🚀');
}

main().catch((err) => {
    log.error(`Fatal error: ${err}`);
    process.exit(1);
});
