import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeNotebookLM } from './scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Paths
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');

// Initialize tasks file if it doesn't exist
if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([]));
}

// Helper: Read Tasks
const getTasks = () => JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));

// Helper: Write Tasks
const saveTasks = (tasks) => fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));

// ==========================================
// ROUTES
// ==========================================

// 1. NotebookLM Summary Route
app.get('/api/summary', async (req, res) => {
    try {
        console.log('Scraping NotebookLM...');
        const summary = await scrapeNotebookLM();
        res.json({ success: true, summary });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch summary from NotebookLM.', details: error.message });
    }
});

// 2. Get Daily Tasks
app.get('/api/tasks', (req, res) => {
    try {
        const tasks = getTasks();
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to load tasks.' });
    }
});

// 3. AI Agent Integration: Update Tasks
// Expects an array of task objects or an action structure (e.g., add, delete, update).
app.post('/api/tasks/update', (req, res) => {
    try {
        const { action, task } = req.body;
        // Action: 'add', 'update', 'delete', or 'replace_all'
        let tasks = getTasks();

        if (action === 'add') {
            const newTask = { id: Date.now().toString(), completed: false, ...task };
            tasks.push(newTask);
        } else if (action === 'update') {
            const index = tasks.findIndex(t => t.id === task.id);
            if (index !== -1) tasks[index] = { ...tasks[index], ...task };
        } else if (action === 'delete') {
            tasks = tasks.filter(t => t.id !== task.id);
        } else if (action === 'replace_all') {
            tasks = req.body.tasks || [];
        }

        saveTasks(tasks);
        res.json({ success: true, message: 'Tasks updated successfully.', tasks });
    } catch (error) {
        console.error('Error updating tasks:', error);
        res.status(500).json({ success: false, error: 'Failed to update tasks.' });
    }
});

app.listen(PORT, () => {
    console.log(`Orbit Backend running on http://localhost:${PORT}`);
});
