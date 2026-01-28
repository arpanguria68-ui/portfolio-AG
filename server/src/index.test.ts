import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock the db module
vi.mock('./db', () => ({
  default: {
    message: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    project: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    socialLink: {
        findMany: vi.fn(),
    }
  }
}));

import prisma from './db';
import app from './index';

describe('Backend API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Messages API', () => {
    it('GET /api/messages returns all messages', async () => {
      const mockMessages = [{ id: 1, name: 'Test', email: 'test@test.com', message: 'Hello', date: '2024-01-01T12:00:00.000Z', read: false }];
      (prisma.message.findMany as any).mockResolvedValue(mockMessages);

      const res = await request(app).get('/api/messages');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Test');
    });

    it('POST /api/messages creates a new message', async () => {
      const newMessage = { name: 'New', email: 'new@test.com', message: 'Hi' };
      (prisma.message.create as any).mockResolvedValue({ id: 2, ...newMessage, date: new Date().toISOString(), read: false });

      const res = await request(app)
        .post('/api/messages')
        .send(newMessage);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('New');
    });

    it('PATCH /api/messages/:id/read marks message as read', async () => {
      (prisma.message.update as any).mockResolvedValue({ id: 1, read: true });

      const res = await request(app).patch('/api/messages/1/read');

      expect(res.status).toBe(200);
      expect(res.body.read).toBe(true);
    });

    it('DELETE /api/messages/:id deletes a message', async () => {
      (prisma.message.delete as any).mockResolvedValue({});

      const res = await request(app).delete('/api/messages/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Projects API', () => {
    it('GET /api/projects returns all projects with parsed tags', async () => {
      const mockProjects = [{
        id: 1,
        title: 'Project 1',
        tags: JSON.stringify(['Tag1', 'Tag2']),
        createdAt: new Date().toISOString()
      }];
      (prisma.project.findMany as any).mockResolvedValue(mockProjects);

      const res = await request(app).get('/api/projects');

      expect(res.status).toBe(200);
      expect(res.body[0].tags).toEqual(['Tag1', 'Tag2']);
    });

    it('POST /api/projects creates a new project', async () => {
        const newProject = { title: 'New', description: 'Desc', year: '2024', tags: ['Tag1'], image: 'img.jpg', link: '/link' };
        (prisma.project.create as any).mockResolvedValue({
            ...newProject,
            id: 1,
            tags: JSON.stringify(['Tag1']),
            createdAt: new Date().toISOString()
        });

        const res = await request(app)
            .post('/api/projects')
            .send(newProject);

        expect(res.status).toBe(201);
        expect(res.body.title).toBe('New');
        expect(res.body.tags).toEqual(['Tag1']);
    });
  });

  describe('Socials API', () => {
    it('GET /api/socials returns all social links', async () => {
      const mockSocials = [{ id: 1, platform: 'LinkedIn', handle: 'handle', url: 'url', icon: 'icon', visible: true }];
      (prisma.socialLink.findMany as any).mockResolvedValue(mockSocials);

      const res = await request(app).get('/api/socials');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].platform).toBe('LinkedIn');
    });
  });
});
