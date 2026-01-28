import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Stitch API Server is running');
});

// --- Messages API ---

// Get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { date: 'desc' }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Create a message
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = await prisma.message.create({
            data: { name, email, message }
        });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create message' });
    }
});

// Mark as read
app.patch('/api/messages/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma.message.update({
            where: { id: Number(id) },
            data: { read: true }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update message' });
    }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.message.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

// --- Projects API ---

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' } // Note: Schema uses 'createdAt', but UI might sort by 'year'.
        });
        // Frontend expects tags as array, DB has string.
        // We can parse here or on frontend. Let's parse JSON on frontend or store simple string.
        // For simplicity, let's treat tags as JSON string in DB.
        const parsedProjects = projects.map(p => ({
            ...p,
            tags: JSON.parse(p.tags) // Assuming we store valid JSON
        }));
        res.json(parsedProjects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Create project
app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, year, tags, image, link } = req.body;
        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                year,
                tags: JSON.stringify(tags), // Store array as JSON string
                image,
                link
            }
        });
        res.status(201).json({ ...newProject, tags: JSON.parse(newProject.tags) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// --- Socials API ---
app.get('/api/socials', async (req, res) => {
    try {
        const socials = await prisma.socialLink.findMany();
        res.json(socials);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch socials' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
