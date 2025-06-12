const express = require('express');
const router = express.Router();
const getDB = require('../db/connection');

// POST /recipes
router.post('/', async (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;

  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(200).json({
      message: "Recipe creation failed!",
      required: "title, making_time, serves, ingredients, cost"
    });
  }

  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = await getDB();
    const stmt = await db.run(
      `INSERT INTO recipes (title, making_time, serves, ingredients, cost, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, making_time, serves, ingredients, cost, now, now]
    );

    const recipe = await db.get(`SELECT * FROM recipes WHERE id = ?`, [stmt.lastID]);

    res.status(200).json({
      message: "Recipe successfully created!",
      recipe: [recipe]
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating recipe", error: err.message });
  }
});

// GET /recipes
router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const recipes = await db.all(`SELECT id, title, making_time, serves, ingredients, cost FROM recipes`);
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes", error: err.message });
  }
});

// GET /recipes/:id
router.get('/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    const db = await getDB();
    const recipe = await db.get(
      `SELECT id, title, making_time, serves, ingredients, cost FROM recipes WHERE id = ?`,
      [recipeId]
    );

    if (!recipe) {
      return res.status(200).json({ message: "No Recipe found" });
    }

    res.status(200).json({
      message: "Recipe details by id",
      recipe: [recipe]
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipe", error: err.message });
  }
});

// PATCH /recipes/:id
router.patch('/:id', async (req, res) => {
  const recipeId = req.params.id;
  const { title, making_time, serves, ingredients, cost } = req.body;

  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(200).json({
      message: "Recipe update failed!",
      required: "title, making_time, serves, ingredients, cost"
    });
  }

  try {
    const db = await getDB();
    const result = await db.run(
      `UPDATE recipes SET title = ?, making_time = ?, serves = ?, ingredients = ?, cost = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, making_time, serves, ingredients, cost, recipeId]
    );

    if (result.changes === 0) {
      return res.status(200).json({ message: "No Recipe found" });
    }

    res.status(200).json({
      message: "Recipe successfully updated!",
      recipe: [{
        title, making_time, serves, ingredients, cost
      }]
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating recipe", error: err.message });
  }
});

// DELETE /recipes/:id
router.delete('/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    const db = await getDB();
    const result = await db.run(
      `DELETE FROM recipes WHERE id = ?`,
      [recipeId]
    );

    if (result.changes === 0) {
      return res.status(200).json({ message: "No recipe found" });
    }

    res.status(200).json({ message: "Recipe successfully removed!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting recipe", error: err.message });
  }
});

module.exports = router;
