import express from 'express';
import { API_getPages } from '../controllers/pageController.js';
import path from 'path';
import pool from '../config/db.js';

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

router.get('/images/:id/:chapterid/:filename', async (req, res) => {
    const conn = await pool.getConnection();
    const { id, chapterid, filename } = req.params;

    try {
        const [rows] = await conn.query(`SELECT placement FROM ${process.env.DB_TABLE} WHERE id = ?`, [id]);
        console.log(rows.placement);
        let placement = rows.placement;

        if (placement) {
            const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));
            const imagePath = path.join(__dirname, `../mangas/${placement}/${chapterid}/${filename}`);
            res.sendFile(imagePath);
        } else {
            res.status(404).send('Manga not found');
        }
    } catch (error) {
        res.status(500).send('Failed to fetch manga' + error);
    } finally {
        conn.release();
    }
});

export default router;