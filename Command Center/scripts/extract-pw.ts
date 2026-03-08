import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'research', 'arjuna-2026-materials');

const CHROME_PROFILE = path.join(process.env.HOME || '~', 'pw_chrome_profile');

const TARGETS = [
    'PYQ Practice Sheet',
    'Mind Maps',
    'Short Notes',
    'Formula Sheet',
    'SKC by Saleem Sir'
];

async function main() {
    console.log('🚀 Starting PW Live Data Interception...');
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
        headless: true, // we can run headless
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await context.newPage();
    let allPdfs: Record<string, { chapter: string, url: string }[]> = {};
    TARGETS.forEach(t => allPdfs[t] = []);

    let activeCategory = '';

    // Inject Auth before navigating
    console.log('🔑 Injecting auth tokens...');
    await page.goto('https://www.pw.live', { waitUntil: 'commit' });
    await page.evaluate(() => {
        localStorage.setItem('TOKEN', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzM1NzkxNjIuOTUxLCJkYXRhIjp7Il9pZCI6IjYzMTBjZTg3MGJiZjEwMDAxMWIwNWZiOSIsInVzZXJuYW1lIjoiOTk3OTc5MTc5OCIsImZpcnN0TmFtZSI6IlJpY2t5IiwibGFzdE5hbWUiOiJQYXJtYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBXIn0sImVtYWlsIjoicmlja3lncGFybWFyMjlAZ21haWwuY29tIiwicGhvbmUiOnsiY291bnRyeUNvZGUiOiIrOTEiLCJudW1iZXIiOjk5Nzk3OTE3OTh9LCJjb3VudHJ5Q29kZSI6IklOIiwiYWN0aXZlQmF0Y2hJZCI6IjY3NzkzNDVjMjBmYTA3NTZlNGE3ZmQwOCJ9fQ.wEfCVQh7dPF6nQ3AhRVkpAP4oAGJLWfBJf_QSUfG3AQ');
        localStorage.setItem('TOKEN_CONTEXT', JSON.stringify({
            "randomId": "d7ee13f2-e9a7-44fe-b983-8cad907d3e95",
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzM1NzkxNjIuOTUxLCJkYXRhIjp7Il9pZCI6IjYzMTBjZTg3MGJiZjEwMDAxMWIwNWZiOSIsInVzZXJuYW1lIjoiOTk3OTc5MTc5OCIsImZpcnN0TmFtZSI6IlJpY2t5IiwibGFzdE5hbWUiOiJQYXJtYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBXIn0sImVtYWlsIjoicmlja3lncGFybWFyMjlAZ21haWwuY29tIiwicGhvbmUiOnsiY291bnRyeUNvZGUiOiIrOTEiLCJudW1iZXIiOjk5Nzk3OTE3OTh9LCJjb3VudHJ5Q29kZSI6IklOIiwiYWN0aXZlQmF0Y2hJZCI6IjY3NzkzNDVjMjBmYTA3NTZlNGE3ZmQwOCJ9fQ.wEfCVQh7dPF6nQ3AhRVkpAP4oAGJLWfBJf_QSUfG3AQ"
        }));
    });
    const cookie = {
        name: 'TOKEN_CONTEXT',
        value: '{"randomId":"d7ee13f2-e9a7-44fe-b983-8cad907d3e95","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzM1NzkxNjIuOTUxLCJkYXRhIjp7Il9pZCI6IjYzMTBjZTg3MGJiZjEwMDAxMWIwNWZiOSIsInVzZXJuYW1lIjoiOTk3OTc5MTc5OCIsImZpcnN0TmFtZSI6IlJpY2t5IiwibGFzdE5hbWUiOiJQYXJtYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBXIn0sImVtYWlsIjoicmlja3lncGFybWFyMjlAZ21haWwuY29tIiwicGhvbmUiOnsiY291bnRyeUNvZGUiOiIrOTEiLCJudW1iZXIiOjk5Nzk3OTE3OTh9LCJjb3VudHJ5Q29kZSI6IklOIiwiYWN0aXZlQmF0Y2hJZCI6IjY3NzkzNDVjMjBmYTA3NTZlNGE3ZmQwOCJ9fQ.wEfCVQh7dPF6nQ3AhRVkpAP4oAGJLWfBJf_QSUfG3AQ"}',
        domain: '.pw.live',
        path: '/'
    };
    await context.addCookies([cookie]);

    // Intercept all API responses
    page.on('response', async (response) => {
        const url = response.url();
        // Usually PW returns attachments via schedule-details or contents
        if (url.includes('schedule') || url.includes('contents') || url.includes('attachment')) {
            try {
                const json = await response.json();
                const data = json.data;
                if (!data) return;

                // Parse the payload looking for attachments
                // Can be array of items, or object with attachments
                const items = Array.isArray(data) ? data : (data.scheduleDetails || data.attachments || [data]);

                items.forEach((item: any) => {
                    // Sometimes it's nested
                    const name = item.name || item.topicName || item.customName || item.scheduleName || 'Unknown Chapter';
                    let fileUrl = item.url || item.fileUrl || item.attachmentUrl || item.key;

                    if (!fileUrl && item.attachmentIds && item.attachmentIds.length > 0) {
                        const att = item.attachmentIds[0];
                        fileUrl = att.url || att.key || att.baseUrl;
                    }

                    if (fileUrl && fileUrl.includes('.pdf')) {
                        if (!fileUrl.startsWith('http')) fileUrl = `https://static.pw.live/${fileUrl}`;
                        if (activeCategory && !allPdfs[activeCategory].find(p => p.url === fileUrl)) {
                            allPdfs[activeCategory].push({ chapter: name.replace(/[^a-zA-Z0-9 -]/g, '').trim(), url: fileUrl });
                            console.log(`✅ Found: [${activeCategory}] ${name}`);
                        }
                    }
                });
            } catch (e) {
                // Not JSON or other error, ignore
            }
        }
    });

    try {
        const baseUrl = 'https://www.pw.live/study-v2/batches/arjuna-jee-2026-700192/subjects/Physics/subject-topics/topics';
        console.log('📡 Navigating to study materials...');
        await page.goto(baseUrl, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(5000);

        for (const catName of TARGETS) {
            console.log(`\n📂 Processing Category: ${catName}`);
            activeCategory = catName;

            // Click on the sidebar item using Playwright text locators
            let success = false;
            try {
                // Find by "SM-XX" (the prefix), since that's stable
                const targetPrefix = catName === 'PYQ Practice Sheet' ? 'SM - 01' :
                    catName === 'Mind Maps' ? 'SM - 02' :
                        catName === 'Short Notes' ? 'SM - 03' :
                            catName === 'Formula Sheet' ? 'SM - 08' :
                                catName === 'SKC by Saleem Sir' ? 'SM - 15' : '';

                // Try multiple locators
                let locator = targetPrefix ? page.getByText(targetPrefix, { exact: false }).first() : page.getByText(catName, { exact: false }).first();
                if (await locator.count() === 0 && !targetPrefix) {
                    // Fallback to SM without spaces if needed
                }

                await locator.waitFor({ state: 'visible', timeout: 5000 });
                await locator.click();
                success = true;
            } catch (e) {
                console.log(`⚠️ Could not click category: ${catName}`);
            }

            if (!success) {
                continue;
            }

            await page.waitForTimeout(3000); // wait for category API to load

            // Now click "View" or scroll to trigger more APIs
            await page.evaluate(() => {
                document.querySelectorAll('button').forEach(b => {
                    if (b.textContent?.includes('View')) b.click();
                });
            });
            await page.waitForTimeout(3000);

            // Close modal just in case
            await page.evaluate(() => {
                document.querySelectorAll('button[aria-label="Close"], .close').forEach(b => (b as HTMLElement).click());
            });
            await page.waitForTimeout(1000);
        }

        console.log('\n📊 Summary:');
        let total = 0;
        for (const [cat, pdfs] of Object.entries(allPdfs)) {
            console.log(`- ${cat}: ${pdfs.length} PDFs`);
            total += pdfs.length;
        }

        const outPath = path.join(OUT_DIR, 'pdf-urls.json');
        fs.writeFileSync(outPath, JSON.stringify(allPdfs, null, 2));
        console.log(`\n💾 Saved ${total} PDF URLs to ${outPath}`);

        // Generate download curl script
        let shContent = '#!/bin/bash\n\n';
        for (const [cat, pdfs] of Object.entries(allPdfs)) {
            if (pdfs.length === 0) continue;
            const catSlug = cat.replace(/\s+/g, '-').toLowerCase();
            shContent += `mkdir -p "downloads/${catSlug}"\n`;
            let i = 1;
            for (const pdf of pdfs) {
                const fname = `${i.toString().padStart(2, '0')}-${pdf.chapter.replace(/\s+/g, '_')}.pdf`;
                shContent += `curl -sL "${pdf.url}" -o "downloads/${catSlug}/${fname}"\n`;
                i++;
            }
        }
        fs.writeFileSync(path.join(OUT_DIR, 'download.sh'), shContent);
        fs.chmodSync(path.join(OUT_DIR, 'download.sh'), 0o755);

    } catch (e) {
        console.error(e);
    } finally {
        await context.close();
    }
}

main();
