import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'research', 'arjuna-2026-materials');

const CHROME_PROFILE = path.join(process.env.HOME || '~', 'pw_chrome_profile');

async function main() {
    console.log('🚀 Extracting React State via Playwright...');
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await context.newPage();

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

    try {
        const baseUrl = 'https://www.pw.live/study-v2/batches/arjuna-jee-2026-700192/subjects/Physics/subject-topics/topics';
        console.log('📡 Navigating to study materials...');
        await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(5000);

        // Let's click down the categories from the React fiber array
        await page.evaluate(async () => {
            const items = document.querySelectorAll('div[class*="content"], li[class*="item"]');
            for (let i = 0; i < items.length; i++) {
                (items[i] as HTMLElement).click();
                await new Promise(r => setTimeout(r, 1000));
                document.querySelectorAll('button').forEach(b => {
                    if (b.textContent?.includes('View')) b.click();
                });
                await new Promise(r => setTimeout(r, 1000));
                document.querySelectorAll('button[aria-label="Close"], .close').forEach(b => (b as HTMLElement).click());
            }
        });

        console.log('🧠 Extracting React State...');
        const result = await page.evaluate(() => {
            const rootEl = document.getElementById('root') || document.getElementById('__next') || document.querySelector('[id*="app"]');
            if (!rootEl) return { error: 'No root element found' };

            const fiberKey = Object.keys(rootEl).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
            if (!fiberKey) return { error: 'No React Fiber found' };

            const fiber = (rootEl as any)[fiberKey];

            const stores: any[] = [];
            let foundPdfs = 0;

            function walkState(node: any, d: number) {
                if (!node || d > 60) return;
                if (node.memoizedState) {
                    let s = node.memoizedState;
                    while (s) {
                        if (s.queue?.lastRenderedState && typeof s.queue.lastRenderedState === 'object') {
                            const str = JSON.stringify(s.queue.lastRenderedState);
                            if (str.includes('.pdf') || str.includes('static.pw.live')) {
                                stores.push(s.queue.lastRenderedState);
                                foundPdfs++;
                            }
                        }
                        s = s.next;
                    }
                }
                if (node.child) walkState(node.child, d + 1);
                if (node.sibling) walkState(node.sibling, d + 1);
            }

            walkState(fiber, 0);

            // Custom stringify to handle circular refs
            function safeStringify(obj: any) {
                const cache = new Set();
                return JSON.stringify(obj, (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.has(value)) return '[Circular]';
                        cache.add(value);
                    }
                    return value;
                });
            }

            return { msg: `Extracted ${stores.length} state objects with PDFs`, stores: safeStringify(stores) };
        });

        console.log(result.msg);
        if (!result.error) {
            fs.writeFileSync(path.join(OUT_DIR, 'react-state.json'), result.stores);
            console.log(`💾 Saved React state to react-state.json`);
        }

        // Capture XHR data too by looking at window._pwData or similar if present
        const networkData = await page.evaluate(() => {
            // Find all JSON responses wrapped in performance entries
            const p = performance.getEntriesByType('resource');
            return p.map(e => e.name).filter(n => n.includes('api.penpencil.co'));
        });
        fs.writeFileSync(path.join(OUT_DIR, 'network-urls.json'), JSON.stringify(networkData, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await context.close();
    }
}

main();
