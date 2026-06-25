const express = require('express');
const cors = require('cors');
const appRouter = require('./modules/static-data/routes/static-data.routes');

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

app.use(cors());

app.use(appRouter);

app.listen(PORT, () => {
  console.log(`ecom-experts API running on http://localhost:${PORT}`);
});
