const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your React frontend to access this server
app.use(express.json());

const PORT = 5000;

app.post('/genius/artist/songs', async (req, res) => {
    const { url, method, headers = {}, body } = req.body;

    if (!url) return res.status(400).json({ error: 'Missing target URL' });

    try {
        const proxyRes = await axios({
            url,
            method,
            headers,
            data: body
        });
        res.json(proxyRes.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/genius/artist', async (req, res) => {
    const { url, method, headers = {}, body } = req.body;

    if (!url) return res.status(400).json({ error: 'Missing target URL' });

    try {
        const proxyRes = await axios({
            url,
            method,
            headers,
            data: body
        });
        res.json(proxyRes.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});

//start the proxy server with:
//node src/proxy-server.js