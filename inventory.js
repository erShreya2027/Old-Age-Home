// routes/inventory.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a database connection

// Fetch all inventory items
router.get('/inventory', (req, res) => {
  const query = 'SELECT * FROM inventory';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching inventory');
    }
    res.json(results);
  });
});

// Add a new item to the inventory
// POST route to add inventory item
router.post('/inventory', (req, res) => {
  const { category, quantity, inventory_name, manager_id } = req.body;

  if (!category || !quantity || !inventory_name || !manager_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO Inventory (category, quantity, inventory_name, manager_id) VALUES (?, ?, ?, ?)';
  db.query(query, [category, quantity, inventory_name, manager_id], (err, result) => {
    if (err) {
      console.error('Error adding inventory:', err);
      return res.status(500).json({ error: 'Failed to add inventory' });
    }
    res.status(200).send('Inventory item added successfully');
  });
});


// Update an existing inventory item
router.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { inventory_name, category, quantity } = req.body;
  const query = 'UPDATE inventory SET inventory_name = ?, category = ?, quantity = ? WHERE inventory_id = ?';
  db.query(query, [inventory_name, category, quantity, id], (err, results) => {
    if (err) {
      return res.status(500).send('Error updating inventory item');
    }
    res.send('Item updated successfully');
  });
});

// Delete an inventory item
router.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM inventory WHERE inventory_id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send('Error deleting inventory item');
    }
    res.send('Item deleted successfully');
  });
});

module.exports = router;
