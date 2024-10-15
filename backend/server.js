// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const cardRoutes = require('./routes/cardRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use('/api', cardRoutes); // Mount card routes under /api

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
