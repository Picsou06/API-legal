import express from 'express';
import { getMangas, isUpdated } from '../controllers/mangaController.js';
import pool from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Route pour récupérer la liste des mangas
router.get('/listmanga/', getMangas);

// Route pour vérifier si la base de données est à jour
router.get('/isupdated/:count', isUpdated);

router.get('/:id/picture', async (req, res) => {
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query(`SELECT placement FROM ${process.env.DB_TABLE} WHERE id = ?`, [req.params.id]);
        let placement = rows.placement;

        if (placement) {
            placement = path.join(__dirname, '..', placement, 'cover.jpg');
            res.sendFile(placement);
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
