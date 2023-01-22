require('dotenv').config({ path: './config/.env' });
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
