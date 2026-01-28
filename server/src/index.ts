import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

app.get('/', (req, res) => {
    res.send('Stitch API Server is running');
});

// --- Upload API ---
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
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
            orderBy: { createdAt: 'desc' }
        });
        const parsedProjects = projects.map(p => ({
            ...p,
            tags: JSON.parse(p.tags),
            sections: JSON.parse(p.sections)
        }));
        res.json(parsedProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Create project
app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, year, tags, image, link, sections } = req.body;
        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                year,
                tags: JSON.stringify(tags),
                image,
                link,
                sections: JSON.stringify(sections || [])
            }
        });
        res.status(201).json({
            ...newProject,
            tags: JSON.parse(newProject.tags),
            sections: JSON.parse(newProject.sections)
        });
    } catch (error) {
        console.error(error);
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
