import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CHROME_EXEC_PATH = '/usr/bin/google-chrome-stable';
const USER_DATA_DIR = path.join(__dirname, 'chrome-profile'); // Persistent directory to bypass 2FA

export async function scrapeNotebookLM() {
    console.log(`Launching Puppeteer with userDataDir: ${USER_DATA_DIR}`);
    const browser = await puppeteer.launch({
        executablePath: CHROME_EXEC_PATH,
        headless: false, // Set to true after you complete the first manual login
        userDataDir: USER_DATA_DIR,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled' // Helps bypass bot detection
        ]
    });

    const page = await browser.newPage();
    
    // Attempting to mask WebDriver
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    try {
        // Go to NotebookLM
        await page.goto('https://notebooklm.google.com/', { waitUntil: 'networkidle2' });

        console.log("Waiting for user to login if necessary. If it's your first time, solve the 2FA in the open browser.");
        
        // Wait for the main dashboard to load (adjust selector based on actual NotebookLM DOM)
        // E.g., looking for the notebook cards container or title
        await page.waitForSelector('main', { timeout: 60000 }); 

        console.log("Dashboard loaded. Looking for 'JEE Prep' notebook...");
        
        // Find and click the "JEE Prep" notebook. 
        // Note: NotebookLM changes its UI rapidly, so these selectors might need fine-tuning.
        const notebooks = await page.$$('div[role="button"]'); // Hypothetical selector for notebooks
        let clicked = false;
        
        for (const notebook of notebooks) {
            const title = await page.evaluate(el => el.textContent, notebook);
            if (title && title.includes('JEE Prep')) {
                await notebook.click();
                clicked = true;
                break;
            }
        }

        if (!clicked) {
            throw new Error("Could not find the 'JEE Prep' notebook.");
        }

        // Wait for Notebook interface to open
        console.log("Opened 'JEE Prep'. Looking for Notebook Guide Summary...");
        await page.waitForTimeout(3000); // give it a moment to load
        
        // Hypothetical selector for the "Notebook Guide" or summary text
        // You'll likely need to inspect NotebookLM's DOM specifically for this element
        const summarySelector = 'div.summary-content'; // REPLACE with actual class
        
        try {
            await page.waitForSelector(summarySelector, { timeout: 10000 });
            const summaryText = await page.$eval(summarySelector, el => el.innerText);
            console.log("Summary extracted.");
            return summaryText;
        } catch (e) {
            console.log("Could not find summary element. Returning dummy text for now. You'll need to update the `summarySelector` in scraper.js.");
            return "Latest NotebookLM Summary: Make sure to review kinematics formulas and practice more integration questions. [Replace selector in scraper.js to fetch real text]";
        }

    } catch (error) {
        console.error("Scraping failed:", error);
        throw error;
    } finally {
        // Close browser after extraction
        await browser.close();
    }
}
