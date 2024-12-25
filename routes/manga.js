import express from 'express';
import { getMangas, isUpdated } from '../controllers/mangaController.js';

const router = express.Router();

// Route pour récupérer la liste des mangas
router.get('/listmanga/', getMangas);

// Route pour vérifier si la base de données est à jour
router.get('/isupdated/:count', isUpdated);

export default router;
