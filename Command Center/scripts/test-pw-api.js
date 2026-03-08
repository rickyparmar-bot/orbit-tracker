const fs = require('fs');
const https = require('https');

const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzM1NzkxNjIuOTUxLCJkYXRhIjp7Il9pZCI6IjYzMTBjZTg3MGJiZjEwMDAxMWIwNWZiOSIsInVzZXJuYW1lIjoiOTk3OTc5MTc5OCIsImZpcnN0TmFtZSI6IlJpY2t5IiwibGFzdE5hbWUiOiJQYXJtYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBXIn0sImVtYWlsIjoicmlja3lncGFybWFyMjlAZ21haWwuY29tIiwicGhvbmUiOnsiY291bnRyeUNvZGUiOiIrOTEiLCJudW1iZXIiOjk5Nzk3OTE3OTh9LCJjb3VudHJ5Q29kZSI6IklOIiwiYWN0aXZlQmF0Y2hJZCI6IjY3NzkzNDVjMjBmYTA3NTZlNGE3ZmQwOCJ9fQ.wEfCVQh7dPF6nQ3AhRVkpAP4oAGJLWfBJf_QSUfG3AQ";
const CLIENT_ID = "5eb393ee95fab7468a79d189";
const BATCH_ID = "6779345c20fa0756e4a7fd08";

function fetchAPI(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.penpencil.co',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'client-id': CLIENT_ID,
                'user-agent': 'Mozilla/5.0'
            }
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    const categories = [
        { name: 'PYQ Practice Sheet', id: '6770003d9a9e5556f0698a2e' },
        { name: 'Mind Maps', id: '67700059e4516f66ad31cd73' }
    ];

    for (const cat of categories) {
        console.log(`Fetching ${cat.name}...`);
        // PenPencil API to get contents by topic/tag ID
        // Often it's v1/batches/<batchId>/topics/<topicId>/contents
        // Or v3/batches/<batchId>/subjects/<subjectId>/topics/<topicId>/contents
        // Let's try the subagent's hint: batch-service/v3/batch-subject-schedules/.../contents
        // It's usually /v1/batches/<batchId>/topics/<topicId>

        // Let's try finding the subjects of the batch first
        const batchDetails = await fetchAPI(`/v1/batches/${BATCH_ID}/details`);
        console.log('Batch Details keys:', Object.keys(batchDetails));

        const subjects = await fetchAPI(`/v3/batches/${BATCH_ID}/subjects`);
        console.log('Subjects:', subjects.data?.map(s => ({ name: s.subjectName, id: s._id })));

        // Physics subject ID would be needed to get its topics. We assume the TagIDs given by subagent are topic IDs.
        const res = await fetchAPI(`/v1/batches/${BATCH_ID}/topics/${cat.id}/contents`);
        console.log(`Topic contents for ${cat.name}:`, JSON.stringify(res).substring(0, 500));
        break; // Let's test the first one
    }
}
main().catch(console.error);
