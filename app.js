import express from 'express';
import mangaRoutes from './routes/manga.js';
import chapterRoutes from './routes/chapter.js';
import pageRoutes from './routes/page.js';
import dotenv from 'dotenv';
import pool from './config/db.js';
import fs from 'fs';
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/manga', mangaRoutes);
app.use('/chapter', chapterRoutes);
app.use('/page', pageRoutes);

async function initializeDatabase() {
    let conn;
    console.log('Initialisation de la base de données...');
    try {
        conn = await pool.getConnection();
        await conn.query(`CREATE TABLE IF NOT EXISTS ${process.env.DB_TABLE} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            placement VARCHAR(255),
            language VARCHAR(10)
        )`);
        console.log('Table créée.');
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) conn.end();
    }
}

async function scanAndFillDatabase() {
    const mangaDir = './mangas';
    const mangaFolders = fs.readdirSync(mangaDir);
    let mangaCount = 0;
    console.log('Scan des dossiers de mangas...');
    const promises = mangaFolders.map(async (folder) => {
        const folderPath = path.join(mangaDir, folder);
        if (fs.lstatSync(folderPath).isDirectory()) {
            const [title, language] = folder.split(/-(?=[^-]+$)/);
            const lang = (language !== 'en' && language !== 'fr') ? 'en' : language;
            const files = fs.readdirSync(folderPath);

            const filePromises = files.map(async (file) => {
                const filePath = path.join(folderPath, file);
                if (fs.lstatSync(filePath).isDirectory()) {
                    let conn;
                    try {
                        conn = await pool.getConnection();
                        await conn.query(`INSERT INTO ${process.env.DB_TABLE} (title, placement, language) VALUES (?, ?, ?)`, [title.trim(), filePath, lang.trim()]);
                        mangaCount++;
                    } catch (err) {
                        console.error(err);
                    } finally {
                        if (conn) conn.end();
                    }
                }
            });
            await Promise.all(filePromises);
        }
    });
    await Promise.all(promises);
    return mangaCount;
}

initializeDatabase().then(async () => {
    const mangaCount = await scanAndFillDatabase();
    console.log(`${mangaCount} mangas added to the database.`);
    app.listen(port, () => {
        console.log(`Serveur démarré sur http://${process.env.WEBSITE}:${port}`);
    });
});
