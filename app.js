const express = require('express');
const morgan = require('morgan');
const healthRoutes = require('./routes');
const classifyRoutes = require('./routes');

const app = express();

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', healthRoutes);
app.use('/api/', classifyRoutes);

app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
