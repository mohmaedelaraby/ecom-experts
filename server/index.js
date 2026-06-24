const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/api/products', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'products.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  res.json(JSON.parse(raw));
});

app.listen(PORT, () => {
  console.log(`ecom-experts API running on http://localhost:${PORT}`);
});
