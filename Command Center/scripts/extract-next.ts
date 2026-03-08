import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'research', 'arjuna-2026-materials');

function main() {
    const html = fs.readFileSync(path.join(__dirname, '..', 'pw_dom.html'), 'utf8');
    const startObj = html.indexOf('<script id="__NEXT_DATA__" type="application/json">') + '<script id="__NEXT_DATA__" type="application/json">'.length;
    let endObj = html.indexOf('</script>', startObj);

    if (startObj < '<script id="__NEXT_DATA__" type="application/json">'.length) {
        console.error('Could not find __NEXT_DATA__');
        return;
    }

    const jsonStr = html.substring(startObj, endObj);
    const data = JSON.parse(jsonStr);

    fs.writeFileSync(path.join(OUT_DIR, 'next-data.json'), JSON.stringify(data, null, 2));
    console.log('✅ Extracted next-data.json');
}

main();
