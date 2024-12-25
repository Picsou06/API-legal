// app.js
import express from 'express';
import mangaRoutes from './routes/manga.js';
import chapterRoutes from './routes/chapter.js';
import pageRoutes from './routes/page.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/manga', mangaRoutes);
app.use('/chapter', chapterRoutes);
app.use('/page', pageRoutes);

app.listen(port, () => {
    console.log(`Serveur démarré sur http://Picsou06.fr:${port}`);
});
