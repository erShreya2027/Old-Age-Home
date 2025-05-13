const express = require('express');
const router = express.Router();
// Helper to check if ID exists
function checkIfExists(table, idField, idValue, callback) {
  db.query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [idValue], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
}

const db = require('../db'); // MySQL connection

// Fetch all residents
router.get('/resident', (req, res) => {
  db.query('SELECT * FROM Resident', (err, results) => {
    if (err) {
      console.error('Error fetching residents:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results); // Make sure this sends back the data correctly
  });
});

// Fetch all staff
router.get('/staff', (req, res) => {
  db.query('SELECT * FROM Staff', (err, results) => {
    if (err) {
      console.error('Error fetching staff:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
});

// Fetch all guardians
router.get('/guardian', (req, res) => {
  db.query('SELECT * FROM Guardian', (err, results) => {
    if (err) {
      console.error('Error fetching guardians:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results); // Make sure this sends back the data correctly
  });
});

router.post('/add-resident', (req, res) => {
  const {
    resident_id,
    resident_name,
    resident_gender,
    resident_age,
    admission_date,
    caretaker_id,
    resident_username,
    resident_password
  } = req.body;

  const sql = `
    INSERT INTO Resident 
    (resident_id, resident_name, resident_gender, resident_age, admission_date, caretaker_id, resident_username, resident_password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    resident_id,
    resident_name,
    resident_gender,
    resident_age,
    admission_date,
    caretaker_id,
    resident_username,
    resident_password
  ], (err, result) => {
    if (err) {
      console.error('Error inserting resident:', err);
      res.status(500).json({ message: 'Failed to add resident.' });
    } else {
      res.status(200).json({ message: 'Resident added successfully.' });
    }
  });
});



// UPDATE Resident



// DELETE Resident
// Delete resident by ID
router.delete('/resident/:id', (req, res) => {
  const residentId = req.params.id;

  const sql = 'DELETE FROM Resident WHERE resident_id = ?';
  db.query(sql, [residentId], (err, result) => {
    if (err) {
      console.error('Error deleting resident:', err);
      res.status(500).send('Failed to delete resident');
    } else {
      res.status(200).send('Resident deleted successfully');
    }
  });
});


// ADD Staff
router.post('/staff', (req, res) => {
  const {
    staff_id,
    staff_name,
    role,
    Staff_Salary,
    shift,
    Staff_gender,
    Staff_username,
    Staff_password,
    manager_id
  } = req.body;

  const sql = `
    INSERT INTO Staff 
    (staff_id, staff_name, role, Staff_Salary, shift, Staff_gender, Staff_username, Staff_password, manager_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    staff_id,
    staff_name,
    role,
    Staff_Salary,
    shift,
    Staff_gender,
    Staff_username,
    Staff_password,
    manager_id
  ], (err, result) => {
    if (err) {
      console.error('Error inserting staff:', err);
      res.status(500).send('Failed to add staff.');
    } else {
      res.status(200).send('Staff added successfully.');
    }
  });
});


// UPDATE Staff


// DELETE Staff
router.delete('/staff/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Staff WHERE staff_id = ?', [id], (err) => {
    if (err) return res.status(500).send('Error deleting staff');
    res.send('Staff deleted');
  });
});

// ADD Guardian
// Add or update guardian
router.post('/guardians', (req, res) => {
  const {
    guardian_id,
    guardian_name,
    relation,
    guardian_contactNo,
    guardian_address,
    guardian_username,
    guardian_password,
    resident_id
  } = req.body;

  const sql = `
    INSERT INTO Guardian 
    (guardian_id, guardian_name, relation, guardian_contactNo, guardian_address, guardian_username, guardian_password, resident_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    guardian_id,
    guardian_name,
    relation,
    guardian_contactNo,
    guardian_address,
    guardian_username,
    guardian_password,
    resident_id
  ], (err, result) => {
    if (err) {
      console.error('Error inserting guardian:', err);
      res.status(500).send('Failed to add guardian.');
    } else {
      res.status(200).send('Guardian added successfully.');
    }
  });
});




// UPDATE Guardian


// DELETE Guardian
// Delete guardian by ID
router.delete('/guardian/:id', (req, res) => {
  const guardianId = req.params.id;

  const sql = 'DELETE FROM Guardian WHERE guardian_id = ?';
  db.query(sql, [guardianId], (err, result) => {
    if (err) {
      console.error('Error deleting guardian:', err);
      res.status(500).send('Failed to delete guardian');
    } else {
      res.status(200).send('Guardian deleted successfully');
    }
  });
});

// GET all donations
router.get('/donations', (req, res) => {
  const query = 'SELECT * FROM donation';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching donations:', err);
      return res.status(500).send('Error fetching donations');
    }
    res.json(results);
  });
});



// Accept donation (POST)
router.post('/donations/accept', (req, res) => {
  const { donation_id } = req.body;
  const query = 'UPDATE donation SET status = "accepted" WHERE donation_id = ?';
  db.query(query, [donation_id], (err, result) => {
    if (err) {
      console.error('Error accepting donation:', err);
      return res.status(500).json({ message: 'Error accepting donation' });
    }
    res.json({ message: 'Donation accepted successfully' });
  });
});

router.get('/inventory', (req, res) => {
  const query = 'SELECT * FROM Inventory';
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch inventory' });
    }
    res.json(result);
  });
});

// 2. Add a new inventory item
// In manager.js or server.js
router.post('/api/manager/inventory', (req, res) => {
  const { category, quantity, inventory_name, manager_id } = req.body;

  // Check if all necessary fields are present
  if (!category || !quantity || !inventory_name || !manager_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // SQL query to insert new inventory item
  const query = `INSERT INTO Inventory (category, quantity, inventory_name, manager_id) 
                 VALUES (?, ?, ?, ?)`;

  db.query(query, [category, quantity, inventory_name, manager_id], (err, result) => {
    if (err) {
      console.error('Error adding inventory:', err); // Log the error for debugging
      return res.status(500).json({ error: 'Error adding inventory item' });
    }
    return res.status(200).json({ message: 'Inventory item added successfully' });
  });
});

// 3. Update an existing inventory item
router.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { category, quantity, inventory_name } = req.body;
  const query = 'UPDATE Inventory SET category = ?, quantity = ?, inventory_name = ? WHERE inventory_id = ?';
  db.query(query, [category, quantity, inventory_name, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update inventory' });
    }
    res.json({ message: 'Inventory item updated successfully' });
  });
});

// 4. Delete an inventory item
router.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Inventory WHERE inventory_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete inventory item' });
    }
    res.json({ message: 'Inventory item deleted successfully' });
  });
});



// Update resident details



// Add a new medical record (POST)
router.post('/medical-records', (req, res) => {
  const { record_id, resident_id, diagnosis, checkup_date, doctor_id } = req.body;

  const query = 'INSERT INTO Medical_Record (record_id, resident_id, diagnosis, checkup_date, doctor_id) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [record_id, resident_id, diagnosis, checkup_date, doctor_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding record', error: err });
    res.status(200).json({ message: 'Record added successfully', result });
  });
});


// **Get All Medical Records**
router.get('/medical-records', (req, res) => {
  db.query('SELECT * FROM Medical_Record', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching records', error: err });
    res.status(200).json(results);
  });
});

// **Update Medical Record**
router.put('/medical-records/:id', (req, res) => {
  const { id } = req.params;
  const { diagnosis, checkup_date, doctor_id } = req.body;

  const query = 'UPDATE Medical_Record SET diagnosis = ?, checkup_date = ?, doctor_id = ? WHERE record_id = ?';
  db.query(query, [diagnosis, checkup_date, doctor_id, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating record', error: err });
    res.status(200).json({ message: 'Record updated successfully', result });
  });
});

// **Delete Medical Record**
router.delete('/medical-records/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Medical_Record WHERE record_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting record', error: err });
    res.status(200).json({ message: 'Record deleted successfully', result });
  });
});

// Update resident information
// Update resident info
router.put('/residents/:id', (req, res) => {
  const residentId = req.params.id;
  const {
    resident_name,
    resident_gender,
    resident_age,
    admission_date,
    caretaker_id,
    resident_username,
    resident_password
  } = req.body;

  // Debug log - log data being updated
  console.log('Updating resident with data:', {
    resident_name,
    resident_gender,
    resident_age,
    admission_date,
    caretaker_id,
    resident_username,
    resident_password
  });

  const updateQuery = `
    UPDATE Resident
    SET 
      resident_name = ?, 
      resident_gender = ?, 
      resident_age = ?, 
      admission_date = ?, 
      caretaker_id = ?, 
      resident_username = ?, 
      resident_password = ?
    WHERE resident_id = ?
  `;

  db.query(
    updateQuery,
    [
      resident_name,
      resident_gender,
      resident_age,
      admission_date,
      caretaker_id,
      resident_username,
      resident_password,
      residentId
    ],
    (err, result) => {
      if (err) {
        // Log the MySQL error for debugging
        console.error('MySQL error during update:', err);
        return res.status(500).json({ success: false, message: 'Error updating resident.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Resident not found.' });
      }

      res.json({ success: true, message: 'Resident updated successfully.' });
    }
  );
});

// Update Guardian
router.put('/guardians/:id', (req, res) => {
  const guardianId = req.params.id;
  const {
    guardian_name,
    relation,
    guardian_contactNo,
    guardian_address,
    guardian_username,
    guardian_password
  } = req.body;

  const sql = `
    UPDATE Guardian
    SET 
      guardian_name = ?, 
      relation = ?, 
      guardian_contactNo = ?, 
      guardian_address = ?, 
      guardian_username = ?, 
      guardian_password = ?
    WHERE guardian_id = ?
  `;

  db.query(sql, [
    guardian_name,
    relation,
    guardian_contactNo,
    guardian_address,
    guardian_username,
    guardian_password,
    guardianId
  ], (err, result) => {
    if (err) {
      console.error('Error updating guardian:', err);
      return res.status(500).json({ success: false, message: 'Error updating guardian.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Guardian not found.' });
    }

    res.json({ success: true, message: 'Guardian updated successfully.' });
  });
});

// Update Staff
// Update Staff Info
router.put('/staff/update', (req, res) => {
  const {
    staff_id,
    staff_name,
    role,
    Staff_Salary,
    shift,
    Staff_gender,
    Staff_username,
    Staff_password
  } = req.body;

  const sql = `
    UPDATE Staff SET 
      staff_name = ?, 
      role = ?, 
      Staff_Salary = ?, 
      shift = ?, 
      Staff_gender = ?, 
      Staff_username = ?, 
      Staff_password = ?
    WHERE staff_id = ?
  `;

  db.query(
    sql,
    [staff_name, role, Staff_Salary, shift, Staff_gender, Staff_username, Staff_password, staff_id],
    (err, result) => {
      if (err) {
        console.error('Error updating staff:', err);
        return res.status(500).json({ message: 'Error updating staff.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Staff ID not found.' });
      }

      res.json({ message: 'Staff information updated successfully.' });
    }
  );
});



module.exports = router;
