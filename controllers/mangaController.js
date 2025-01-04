import pool from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// Récupérer la liste des mangas
export const getMangas = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `SELECT * FROM ${process.env.DB_TABLE}`;
        const rows = await conn.query(query);
        
        // Assurez-vous que rows est un tableau
        if (!Array.isArray(rows)) {
            return res.status(500).json({ error: 'Invalid data format from the database' });
        }

        // Assurez-vous que le tableau contient des objets
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No mangas found' });
        }

        const results = rows.map(row => ({
            id: row.id,
            title: row.title,
            picture: 'http://' + process.env.WEBSITE + ':' + process.env.PORT + '/manga/' + row.id + '/picture',
            website: "local",
            language: row.language
        }));
        res.json(results);
    } catch (err) {
        console.error('Erreur de base de données:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    } finally {
        if (conn) conn.release();
    }
};

// Vérifier si la base de données est à jour
export const isUpdated = async (req, res) => {
    let conn;
    try {
        // Validation et conversion du paramètre count en BigInt
        const countParam = req.params.count;
        let count;

        if (/^\d+$/.test(countParam)) {
            count = BigInt(countParam);
        } else {
            return res.status(400).json({ error: 'Invalid count parameter' });
        }

        conn = await pool.getConnection();
        const query = `SELECT COUNT(title) AS totalCount FROM ${process.env.DB_TABLE}`;
        const [rows] = await conn.query(query);

        if (!rows || rows.length === 0) {
            return res.status(500).json({ error: 'No data returned from the database' });
        }

        const totalCount = BigInt(rows.totalCount);
        const isUpdated = totalCount === count;

        res.json({ updated: isUpdated });
    } catch (err) {
        console.error('Erreur de base de données:', err);
        res.status(500).json({ error: 'Erreur de base de données' });
    } finally {
        if (conn) conn.release();
    }
};
