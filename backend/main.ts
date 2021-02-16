import express from 'express';
import { AppService } from './service';

const PORT = process.env.PORT || 8000;

const app = express();
const app_service = new AppService();

app.get('/guild_vault/:realm_slug/:guild_slug', async (req, res) => {
    try {
        const { realm_slug, guild_slug } = req.params;
        const response = await app_service.loadGuildVault(realm_slug, guild_slug);
        res.json(response);
    }
    catch (e) {
        console.error(e)
        res.status(e?.response?.status || 500).json({ error: e?.response?.statusText || 'Server error.' })
    }
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

