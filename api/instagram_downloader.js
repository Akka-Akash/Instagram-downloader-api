const axios = require('axios');
const cheerio = require('cheerio');

// Allow CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).set(corsHeaders).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).set(corsHeaders).json({ success: false, message: 'Missing URL' });
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(response.data);
    const videoUrl = $('meta[property="og:video"]').attr('content');

    if (!videoUrl) {
      return res.status(404).set(corsHeaders).json({ success: false, message: 'Video not found' });
    }

    return res.status(200).set(corsHeaders).json({ success: true, videoUrl });

  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).set(corsHeaders).json({ success: false, message: 'Server Error' });
  }
};
