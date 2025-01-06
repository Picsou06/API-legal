import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

export async function API_getPages(mangaId, chapterId) {
    try {
        const conn = await pool.getConnection();
        const query = `SELECT placement FROM ${process.env.DB_TABLE} WHERE id = ?`;
        const rows = await conn.query(query, [mangaId]);

        const placement = rows[0].placement;
        const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));
        const chapterDir = path.join(__dirname, `../mangas${placement}/${chapterId}`);

        const files = fs.readdirSync(chapterDir)
            .filter(file => file.endsWith('.jpg'));

        const pages = files.map(file => `http://${process.env.WEBSITE}:${process.env.PORT}/page/images/${mangaId}/${chapterId}/${file}`);

        console.log(pages);
        return pages;
    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
}