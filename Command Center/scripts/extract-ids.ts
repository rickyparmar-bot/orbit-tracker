import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '..', 'src', 'research', 'arjuna-2026-materials', 'next-data.json');

function main() {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Attempt to find the batch ID and subject IDs from the parsed page data
    const findIds = (obj: any, label: string) => {
        let results: any[] = [];
        const search = (o: any) => {
            if (o && typeof o === 'object') {
                if (o._id || o.id || o.batchId || o.subjectId) {
                    if (JSON.stringify(o).toLowerCase().includes('arjuna')) {
                        results.push({ type: 'potential_batch', data: o });
                    }
                    if (JSON.stringify(o).toLowerCase().includes('physics') ||
                        JSON.stringify(o).toLowerCase().includes('chemistry') ||
                        JSON.stringify(o).toLowerCase().includes('math')) {
                        results.push({ type: 'potential_subject', data: o });
                    }
                }
                for (const key in o) {
                    search(o[key]);
                }
            } else if (Array.isArray(o)) {
                o.forEach(search);
            }
        }
        search(obj);
        return results;
    }

    const ids = findIds(data, 'ids');
    fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'research', 'arjuna-2026-materials', 'extracted-ids.json'), JSON.stringify(ids, null, 2));
    console.log(`Extracted ${ids.length} potential IDs`);
}

main();
