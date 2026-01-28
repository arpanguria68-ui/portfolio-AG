import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(helmet());
app.use(compression());
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || false // Fail if not set in production
        : '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- Multer Configuration ---
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

// --- Zod Schemas ---
const MessageSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1)
});

const ProjectSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    year: z.string(),
    tags: z.array(z.string()),
    image: z.string().url(),
    link: z.string().optional(),
    sections: z.array(z.any()).optional()
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

app.post('/api/messages', async (req, res) => {
    try {
        const result = MessageSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const { name, email, message } = result.data;
        const newMessage = await prisma.message.create({
            data: { name, email, message }
        });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create message' });
    }
});

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

app.post('/api/projects', async (req, res) => {
    try {
        // Handle tags as array -> string transformation for DB manually or via schema refinement?
        // Zod validates the input (array), Prisma needs string.
        const result = ProjectSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const { title, description, year, tags, image, link, sections } = result.data;

        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                year,
                tags: JSON.stringify(tags),
                image,
                link: link || null,
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

app.put('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = ProjectSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const { title, description, year, tags, image, link, sections } = result.data;

        const updatedProject = await prisma.project.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                year,
                tags: JSON.stringify(tags),
                image,
                link: link || null,
                sections: JSON.stringify(sections || [])
            }
        });
        res.json({
            ...updatedProject,
            tags: JSON.parse(updatedProject.tags),
            sections: JSON.parse(updatedProject.sections)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.project.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
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
