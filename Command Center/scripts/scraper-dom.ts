import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'research', 'arjuna-2026-materials');
const CHROME_PROFILE = path.join(process.env.HOME || '~', 'pw_chrome_profile');

const TARGETS = [
    { name: 'PYQ Practice Sheet', id: 'SM - 01' },
    { name: 'Mind Maps', id: 'SM - 02' },
    { name: 'Short Notes', id: 'SM - 03' },
    { name: 'Formula Sheet', id: 'SM - 08' },
    { name: 'SKC by Saleem Sir', id: 'SM - 15' }
];

async function main() {
    console.log('🚀 Starting PW Live Scraper...');
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await context.newPage();
    let allPdfs: Record<string, { chapter: string, url: string }[]> = {};
    TARGETS.forEach(t => allPdfs[t.name] = []);

    try {
        console.log('🔑 Injecting auth tokens...');
        await page.goto('https://www.pw.live', { waitUntil: 'commit' });
        await page.evaluate(() => {
            const tokenJson = '{"randomId":"d7ee13f2-e9a7-44fe-b983-8cad907d3e95","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzM1NzkxNjIuOTUxLCJkYXRhIjp7Il9pZCI6IjYzMTBjZTg3MGJiZjEwMDAxMWIwNWZiOSIsInVzZXJuYW1lIjoiOTk3OTc5MTc5OCIsImZpcnN0TmFtZSI6IlJpY2t5IiwibGFzdE5hbWUiOiJQYXJtYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBXIn0sImVtYWlsIjoicmlja3lncGFybWFyMjlAZ21haWwuY29tIiwicGhvbmUiOnsiY291bnRyeUNvZGUiOiIrOTEiLCJudW1iZXIiOjk5Nzk3OTE3OTh9LCJjb3VudHJ5Q29kZSI6IklOIiwiYWN0aXZlQmF0Y2hJZCI6IjY3NzkzNDVjMjBmYTA3NTZlNGE3ZmQwOCJ9fQ.wEfCVQh7dPF6nQ3AhRVkpAP4oAGJLWfBJf_QSUfG3AQ"}';
            localStorage.setItem('TOKEN_CONTEXT', tokenJson);
        });
        await context.addCookies([{
            name: 'TOKEN_CONTEXT',
            value: '{"randomId":"d7ee13f2-e9a7-44fe-b983-8cad907d3e95","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzM1NzkxNjIuOTUxLCJkYXRhIjp7Il9pZCI6IjYzMTBjZTg3MGJiZjEwMDAxMWIwNWZiOSIsInVzZXJuYW1lIjoiOTk3OTc5MTc5OCIsImZpcnN0TmFtZSI6IlJpY2t5IiwibGFzdE5hbWUiOiJQYXJtYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBXIn0sImVtYWlsIjoicmlja3lncGFybWFyMjlAZ21haWwuY29tIiwicGhvbmUiOnsiY291bnRyeUNvZGUiOiIrOTEiLCJudW1iZXIiOjk5Nzk3OTE3OTh9LCJjb3VudHJ5Q29kZSI6IklOIiwiYWN0aXZlQmF0Y2hJZCI6IjY3NzkzNDVjMjBmYTA3NTZlNGE3ZmQwOCJ9fQ.wEfCVQh7dPF6nQ3AhRVkpAP4oAGJLWfBJf_QSUfG3AQ"}',
            domain: '.pw.live',
            path: '/'
        }]);

        const baseUrl = 'https://www.pw.live/study-v2/batches/arjuna-jee-2026-700192/subjects/Physics/subject-topics/topics';
        console.log('📡 Navigating to study materials...');
        await page.goto(baseUrl, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(5000);

        // Track open PDFs in a new tab event
        context.on('page', async newPage => {
            const url = newPage.url();
            if (url.includes('pdf=')) {
                await newPage.close();
            }
        });

        for (const target of TARGETS) {
            console.log(`\n📂 Processing Category: ${target.name} (${target.id})`);

            // 1. Click sidebar category
            const clicked = await page.evaluate(({ id, name }) => {
                const els = Array.from(document.querySelectorAll('div, li, span'));
                const el = els.find(e => e.textContent?.includes(name) || e.textContent?.includes(id));
                if (el) {
                    const actionable = el.closest('li, [class*="item"]') || el;
                    (actionable as HTMLElement).click();
                    return true;
                }
                return false;
            }, target);

            if (!clicked) {
                console.log(`⚠️ Could not find category sidebar item: ${target.name}`);
                continue;
            }
            await page.waitForTimeout(4000);

            // 2. Look for "View" buttons and click them to open the modal
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button, [class*="btn"]'));
                const viewBtn = buttons.find(b => b.textContent?.includes('View'));
                if (viewBtn) (viewBtn as HTMLElement).click();
            });
            await page.waitForTimeout(3000);

            // 3. We are now in a modal with PDFs. Grab their info from the DOM.
            const pdfs = await page.evaluate(() => {
                const results: { chapter: string, url: string }[] = [];
                // Look for links with static.pw.live
                const links = Array.from(document.querySelectorAll('a[href*="static.pw.live"]'));
                for (let link of links) {
                    results.push({
                        chapter: link.textContent?.trim().replace(/[^a-zA-Z0-9 -]/g, '') || 'Unknown',
                        url: (link as HTMLAnchorElement).href
                    });
                }

                // If no direct links, extract React internal Fiber from the modal body
                if (results.length === 0) {
                    const modal = document.querySelector('[class*="modal"], [class*="dialog"]') || document.body;
                    let text = modal.innerHTML || '';
                    const urls = [...text.matchAll(/https:\/\/static\.pw\.live[^\s"'>]+\.pdf/g)];
                    urls.forEach((u, i) => results.push({ chapter: `Chapter_${i + 1}`, url: u[0] }));
                }

                // Look for sibling text node for better chapter names if it's an icon link
                if (results.length > 0 && results[0].chapter === 'Unknown') {
                    const items = document.querySelectorAll('[class*="item"]');
                    items.forEach((item, i) => {
                        const link = item.querySelector('a[href*="static.pw.live"]');
                        if (link && results[i]) {
                            results[i].chapter = item.textContent?.replace('View', '')?.trim().replace(/[^a-zA-Z0-9 -]/g, '') || `Chapter_${i + 1}`;
                        }
                    });
                }
                return results;
            });

            // Clean up URLs if they are inside a PW viewer link
            pdfs.forEach(p => {
                if (p.url.includes('pdf=')) {
                    p.url = new URL(p.url).searchParams.get('pdf') || p.url;
                }
                if (p.url && !allPdfs[target.name].find(exist => exist.url === p.url)) {
                    allPdfs[target.name].push(p);
                }
            });

            console.log(`✅ Found ${pdfs.length} PDFs for ${target.name}`);

            // 4. Close the modal
            await page.evaluate(() => {
                const closeBtns = document.querySelectorAll('button[aria-label="Close"], .close, [class*="close"]');
                if (closeBtns.length > 0) (closeBtns[0] as HTMLElement).click();
                else document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' })); // Try escape key
            });
            await page.waitForTimeout(1000);
        }

        // Final save
        const outPath = path.join(OUT_DIR, 'pdf-urls.json');
        fs.writeFileSync(outPath, JSON.stringify(allPdfs, null, 2));

        // Generate download shell script
        let shContent = '#!/bin/bash\n\n';
        let total = 0;
        for (const [cat, items] of Object.entries(allPdfs)) {
            if (items.length === 0) continue;
            total += items.length;
            const catSlug = cat.replace(/\s+/g, '-').toLowerCase();
            shContent += `mkdir -p "downloads/${catSlug}"\n`;
            let i = 1;
            for (const pdf of items) {
                const fname = `${i.toString().padStart(2, '0')}-${pdf.chapter.replace(/\s+/g, '_')}.pdf`;
                shContent += `curl -sL "${pdf.url}" -o "downloads/${catSlug}/${fname}"\n`;
                i++;
            }
            shContent += '\n';
        }
        fs.writeFileSync(path.join(OUT_DIR, 'download.sh'), shContent);
        fs.chmodSync(path.join(OUT_DIR, 'download.sh'), 0o755);

        console.log(`\n🎉 Success! Found ${total} total PDFs. Generated download.sh script.`);

    } catch (e) {
        console.error(e);
    } finally {
        await context.close();
    }
}

main();
