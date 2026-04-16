
const healthCheck = (req, res) => {
  res.status(200).json({ status: 'success' });
}

module.exports = { healthCheck };