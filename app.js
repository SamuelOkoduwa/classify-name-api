const express = require('express');
const morgan = require('morgan');
const healthRoutes = require('./routes');

const app = express();

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', healthRoutes);

app.get('/api/classify', async (req, res) => {
  const { name } = req.query;

  if (typeof name === 'undefined') {
    return res.status(400).json({ status: 'error', message: 'Missing or empty name parameter' });
  }

  if (typeof name !== 'string') {
    return res.status(422).json({ status: 'error', message: 'name must be a string' });
  }

  const normalizedName = name.trim();
  if (!normalizedName) {
    return res.status(400).json({ status: 'error', message: 'Missing or empty name parameter' });
  }

  try {
    const upstreamResponse = await fetch(`https://api.genderize.io?name=${encodeURIComponent(normalizedName)}`);

    if (!upstreamResponse.ok) {
      return res.status(502).json({ status: 'error', message: 'Failed to fetch prediction from upstream API' });
    }

    const payload = await upstreamResponse.json();

    const gender = payload.gender;
    const probability = Number(payload.probability);
    const sampleSize = Number(payload.count);

    if (gender === null || sampleSize === 0) {
      return res.status(422).json({ status: 'error', message: 'No prediction available for the provided name' });
    }

    const isConfident = probability >= 0.7 && sampleSize >= 100;

    return res.status(200).json({
      status: 'success',
      data: {
        name: normalizedName.toLowerCase(),
        gender,
        probability,
        sample_size: sampleSize,
        is_confident: isConfident,
        processed_at: new Date().toISOString()
      }
    });
  } catch (_error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
