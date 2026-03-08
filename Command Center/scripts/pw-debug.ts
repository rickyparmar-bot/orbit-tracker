import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PROFILE = path.join(process.env.HOME || '~', 'pw_chrome_profile');

async function main() {
    const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await context.newPage();
    try {
        const baseUrl = 'https://www.pw.live/study-v2/batches/arjuna-jee-2026-700192/subjects/Physics/subject-topics/topics';
        console.log('📡 Navigating...');
        await page.goto(baseUrl, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(5000);

        await page.screenshot({ path: path.join(__dirname, '..', 'pw_screenshot.png'), fullPage: true });
        console.log('📸 Screenshot saved to pw_screenshot.png');

        // Dump HTML
        fs.writeFileSync(path.join(__dirname, '..', 'pw_dom.html'), await page.content());
        console.log('💾 DOM dumped');
    } catch (e) {
        console.error(e);
    } finally {
        await context.close();
    }
}
main();
