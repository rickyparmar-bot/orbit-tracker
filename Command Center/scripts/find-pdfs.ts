import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '..', 'src', 'research', 'arjuna-2026-materials', 'next-data.json');

function findPdfs(obj: any, pathStr = '') {
    if (typeof obj === 'string') {
        if (obj.toLowerCase().includes('.pdf')) {
            console.log(`Found PDF at ${pathStr}: ${obj}`);
        }
    } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => findPdfs(item, `${pathStr}[${index}]`));
    } else if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
            findPdfs(obj[key], `${pathStr}.${key}`);
        }
    }
}

function main() {
    console.log("Reading data...");
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log("Searching for PDFs...");
    findPdfs(data, 'root');
    console.log("Done.");
}

main();
