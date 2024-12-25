import express from 'express';
import { API_getPages } from '../controllers/pageController.js';
import path from 'path';

const router = express.Router();

router.get('/:chapterId', async (req, res) => {
    const { chapterId } = req.params;
    const { mangaId } = req.query;
    try {
        const pages = await API_getPages(mangaId, chapterId);
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pages' });
    }
});

router.get('/images/:location/:chapterId/:filename', (req, res) => {
    const { location, chapterId, filename } = req.params;
    const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));
    const imagePath = path.join(__dirname, `../mangas/${location}/${chapterId}/${filename}`);
    res.sendFile(imagePath);
});

export default router;