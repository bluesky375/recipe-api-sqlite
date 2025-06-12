const express = require('express');
const app = express();
const recipeRoutes = require('./routes/recipes');
require('dotenv').config();

app.use(express.json());
app.use('/recipes', recipeRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "404 Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
