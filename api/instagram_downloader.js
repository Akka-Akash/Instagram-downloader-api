const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.body;

  if (!url || !url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Invalid Instagram URL' });
  }

  try {
    const response = await axios.get('https://instadl.app/api/v1/download', {
      params: { url: url, format: 'json' },
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const result = response.data;

    if (!result || !result.media) {
      return res.status(500).json({ error: 'No media found in response' });
    }

    const formattedResponse = {
      success: true,
      data: {
        url: result.media[0].url,
        type: result.media[0].type,
        thumbnail: result.media[0].thumbnail
      }
    };

    res.status(200).json(formattedResponse);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Server Error',
      details: err.message,
      response: err.response?.data
    });
  }
};
