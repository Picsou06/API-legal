import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getChapters = async (req, res) => {
    const { mangaId } = req.params;
    const { language } = req.query;

    if (!mangaId || !language) {
        return res.status(400).json({ error: 'mangaId and language are required' });
    }

    try {
        const conn = await pool.getConnection();
        const query = `SELECT placement FROM ${process.env.DB_TABLE} WHERE id = ? AND language = ?`;
        const [rows] = await conn.query(query, [mangaId, language]);


        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Manga not found' });
        }

        const placement = rows.placement;
        const mangaDir = path.join(__dirname, `../mangas/${placement}`);

        const directories = fs.readdirSync(mangaDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const chapterList = directories.map(dir => {
            return { itemid: dir, type: 'chapter', title: dir };
        });

        return res.status(200).json(chapterList);
    } catch (error) {
        console.error("Error fetching chapters:", error);
        return res.status(500).json({ error: 'Failed to fetch chapters' });
    }
};