const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch resident details (for logged-in resident)
// GET resident info with guardian details
router.get('/info', (req, res) => {
    const residentId = req.session.resident_id;
    if (!residentId) return res.status(401).send('Unauthorized');
  
    const query = `
      SELECT 
        r.resident_id, r.resident_name, r.resident_gender, r.resident_age, r.admission_date,
        g.guardian_name, g.relation, g.guardian_contactNo, g.guardian_address
      FROM Resident r
      LEFT JOIN Guardian g ON r.resident_id = g.resident_id
      WHERE r.resident_id = ?
    `;
  
    db.query(query, [residentId], (err, results) => {
      if (err) return res.status(500).send('Error fetching resident details');
      if (results.length === 0) return res.status(404).send('Resident not found');
      res.json(results[0]);
    });
  });
  
  

// In routes/resident.js or wherever you manage resident routes
// GET medical records for the logged-in resident
// GET medical records for logged-in resident
router.get('/info/medical-records', (req, res) => {
  const residentId = req.session.resident_id;

  console.log('Session Resident ID:', residentId);

  if (!residentId) {
    console.log('Resident not logged in');
    return res.status(401).json({ message: 'Unauthorized - resident not logged in' });
  }

  const sql = 'SELECT * FROM Medical_Record WHERE resident_id = ?';
  db.query(sql, [residentId], (err, results) => {
    if (err) {
      console.error('Error fetching medical records:', err);
      return res.status(500).json({ message: 'Failed to get medical records' });
    }

    console.log('Medical Records Fetched:', results); // Debug
    res.json(results);
  });
});




module.exports = router;
