const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzM1NzkxNjIuOTUxLCJkYXRhIjp7Il9pZCI6IjYzMTBjZTg3MGJiZjEwMDAxMWIwNWZiOSIsInVzZXJuYW1lIjoiOTk3OTc5MTc5OCIsImZpcnN0TmFtZSI6IlJpY2t5IiwibGFzdE5hbWUiOiJQYXJtYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBXIn0sImVtYWlsIjoicmlja3lncGFybWFyMjlAZ21haWwuY29tIiwicGhvbmUiOnsiY291bnRyeUNvZGUiOiIrOTEiLCJudW1iZXIiOjk5Nzk3OTE3OTh9LCJjb3VudHJ5Q29kZSI6IklOIiwiYWN0aXZlQmF0Y2hJZCI6IjY3NzkzNDVjMjBmYTA3NTZlNGE3ZmQwOCJ9fQ.wEfCVQh7dPF6nQ3AhRVkpAP4oAGJLWfBJf_QSUfG3AQ";
const CLIENT_ID = "5eb393ee95fab7468a79d189";
const BATCH_ID = "6779345c20fa0756e4a7fd08";

async function fetchAPI(path: string) {
    const url = `https://api.penpencil.co${path}`;
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'client-id': CLIENT_ID,
            'user-agent': 'Mozilla/5.0'
        }
    });
    return res.json().catch(() => res.text());
}

async function main() {
    const categories = [
        { name: 'PYQ Practice Sheet', id: '6770003d9a9e5556f0698a2e' },
        { name: 'Mind Maps', id: '67700059e4516f66ad31cd73' }
    ];

    try {
        const subjects = await fetchAPI(`/v3/batches/${BATCH_ID}/subjects`);
        console.log('Subjects:', JSON.stringify(subjects.data?.map((s: any) => ({ name: s.subjectName, id: s._id }))));

        // Test fetching contents for a specific topic (TagID)
        const cat = categories[0];
        const res = await fetchAPI(`/v1/batches/${BATCH_ID}/topics/${cat.id}/contents`);
        console.log(`Contents for ${cat.name}:`, JSON.stringify(res).substring(0, 1000));
    } catch (e) {
        console.error(e);
    }
}

main();
