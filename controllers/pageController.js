import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

export async function API_getPages(mangaId, chapterId) {
    try {
        const conn = await pool.getConnection();
        const query = `SELECT location FROM ${process.env.DB_TABLE} WHERE id = ?`;
        const rows = await conn.query(query, [mangaId]);

        const location = rows[0].location;
        const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));
        const chapterDir = path.join(__dirname, `../mangas/${location}/${chapterId}`);

        const files = fs.readdirSync(chapterDir)
            .filter(file => file.endsWith('.jpg'));

        const pages = files.map(file => `http://${process.env.WEBSITE}:${process.env.PORT}/page/images/${location}${chapterId}/${file}`);

        return pages;
    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
}