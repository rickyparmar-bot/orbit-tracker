import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const PURPLE = '\x1b[38;2;142;68;173m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[38;2;46;204;113m';
const log = (msg: string) => console.log(`${PURPLE}${BOLD}[DOWNLOAD]${RESET} ${PURPLE}${msg}${RESET}`);
const done = (msg: string) => console.log(`${PURPLE}${BOLD}[DOWNLOAD]${RESET} ${GREEN}✅ ${msg}${RESET}`);

const CHROME_PROFILE = path.join(process.env.HOME || '~', 'pw_chrome_profile');
const OUT_DIR = path.resolve(import.meta.dirname || '.', '..', 'src', 'research', 'arjuna-2026');

// The 5 target study material categories
const TARGETS = [
  { name: 'pyq-practice-sheet', label: 'PYQ Practice Sheet || Only PDF', smIndex: 0 },
  { name: 'mind-maps', label: 'Mind Maps || Only PDF', smIndex: 1 },
  { name: 'short-notes', label: 'Short Notes || Only PDF', smIndex: 2 },
  { name: 'formula-sheet', label: 'Formula Sheet || Only PDF', smIndex: 7 },
  { name: 'skc-saleem-sir', label: 'SKC by Saleem Sir || Only PDF', smIndex: 14 },
];

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirect = response.headers.location;
        if (redirect) {
          downloadFile(redirect, dest).then(resolve).catch(reject);
          return;
        }
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

async function main() {
  log('🚀 Starting bulk PDF download from PW Live Arjuna 2026...');
  
  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await context.newPage();
  const allPdfs: Record<string, Array<{chapter: string, url: string}>> = {};

  try {
    // Navigate to study materials
    const baseUrl = 'https://www.pw.live/study-v2/batches/arjuna-jee-2026-700192/subjects/Physics/subject-topics/topics';
    log('📡 Navigating to Arjuna 2026 study materials...');
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Get study material topic IDs from sidebar
    log('🔍 Finding study material categories...');
    
    // Click on each study material category and extract PDFs
    for (const target of TARGETS) {
      log(`📂 Opening ${target.label}...`);
      
      // Click the category in sidebar
      const sidebarItems = await page.$$('[class*="topic-list"] > div, [class*="sidebar"] li, [class*="sm-"] , [class*="study-material"] > div');
      
      if (sidebarItems.length > target.smIndex) {
        await sidebarItems[target.smIndex].click();
        await page.waitForTimeout(2000);
      } else {
        // Try clicking by text
        const textEl = await page.$(`text="${target.label}"`) || await page.$(`text="${target.label.split('||')[0].trim()}"`);
        if (textEl) {
          await textEl.click();
          await page.waitForTimeout(2000);
        }
      }

      // Click View button
      const viewBtn = await page.$('text="View"') || await page.$('[class*="view"]');
      if (viewBtn) {
        await viewBtn.click();
        await page.waitForTimeout(2000);
      }

      // Extract PDF URLs from the attachments modal
      const pdfData = await page.evaluate(() => {
        const results: Array<{chapter: string, url: string}> = [];
        
        // Method 1: Look for download links/buttons in modal
        const modal = document.querySelector('[class*="modal"], [class*="attachment"], [class*="dialog"]');
        if (modal) {
          const items = modal.querySelectorAll('[class*="item"], [class*="row"], [class*="attachment"]');
          items.forEach(item => {
            const text = item.textContent?.trim() || '';
            const link = item.querySelector('a[href*="static.pw.live"], a[href*="pdf"]');
            if (link) {
              results.push({ chapter: text.substring(0, 80), url: (link as HTMLAnchorElement).href });
            }
          });
        }
        
        // Method 2: Find all static.pw.live links on page
        if (results.length === 0) {
          document.querySelectorAll('a[href*="static.pw.live"]').forEach(a => {
            results.push({ 
              chapter: a.textContent?.trim().substring(0, 80) || 'unknown', 
              url: (a as HTMLAnchorElement).href 
            });
          });
        }

        // Method 3: Check React internal state for attachment URLs
        if (results.length === 0) {
          const allText = document.body.innerText;
          const urlMatches = allText.match(/https:\/\/static\.pw\.live[^\s"')]+\.pdf/g);
          if (urlMatches) {
            urlMatches.forEach((url, i) => results.push({ chapter: `chapter-${i+1}`, url }));
          }
        }
        
        return results;
      });

      // Also intercept via network - look at recent API responses
      if (pdfData.length === 0) {
        // Try getting from page URL pattern  
        const newPages = context.pages();
        for (const p of newPages) {
          const pUrl = p.url();
          if (pUrl.includes('pdf=https://static.pw.live')) {
            const pdfUrl = new URL(pUrl).searchParams.get('pdf');
            if (pdfUrl) {
              pdfData.push({ chapter: target.name, url: pdfUrl });
            }
          }
        }
      }

      allPdfs[target.name] = pdfData;
      log(`  Found ${pdfData.length} PDFs for ${target.name}`);

      // Close modal if open
      const closeBtn = await page.$('[class*="close"], button[aria-label="Close"]');
      if (closeBtn) await closeBtn.click().catch(() => {});
      await page.waitForTimeout(500);
    }

    // Save all URLs to JSON
    const urlsPath = path.join(OUT_DIR, 'pdf-urls.json');
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(urlsPath, JSON.stringify(allPdfs, null, 2));
    done(`Saved PDF URL index to ${urlsPath}`);

    // Download all PDFs
    let totalDownloads = 0;
    for (const [category, pdfs] of Object.entries(allPdfs)) {
      for (const pdf of pdfs) {
        const sanitized = pdf.chapter.replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '-').substring(0, 60);
        const filename = `${sanitized || 'chapter-' + totalDownloads}.pdf`;
        const destPath = path.join(OUT_DIR, category, filename);
        
        try {
          log(`⬇️  Downloading: ${filename}`);
          await downloadFile(pdf.url, destPath);
          totalDownloads++;
        } catch (err) {
          log(`⚠️  Failed: ${filename} - ${err}`);
        }
      }
    }

    done(`Downloaded ${totalDownloads} PDFs total!`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await context.close();
  }

  // Print summary
  log('');
  log('📊 DOWNLOAD SUMMARY:');
  for (const [cat, pdfs] of Object.entries(allPdfs)) {
    log(`  ${cat}: ${pdfs.length} PDFs`);
  }
}

main();
