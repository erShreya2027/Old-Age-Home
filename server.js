// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db'); // MySQL connection
const path = require('path');

const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',  // Use a strong secret key here
  resave: false,
  saveUninitialized: true,
}));

const residentRoutes = require('./routes/resident'); // Adjust the path to where your resident.js file is
app.use('/api/resident', residentRoutes);

// Manager routes
const managerRoutes = require('./routes/manager'); 
app.use('/api/manager', managerRoutes);

app.use('/api/manager', require('./routes/manager'));

const cors = require('cors');
app.use(cors());

// Route for login (existing code)
app.post('/login', (req, res) => {
  const { role, username, password } = req.body;

  const tableMap = {
    manager: { table: 'Manager', userField: 'manager_username', passField: 'manager_password' },
    staff: { table: 'Staff', userField: 'Staff_username', passField: 'Staff_password' },
    resident: { table: 'Resident', userField: 'resident_username', passField: 'resident_password' },
    guardian: { table: 'Guardian', userField: 'guardian_username', passField: 'guardian_password' }
  };

  const roleData = tableMap[role];
  if (!roleData) {
    return res.json({ success: false, message: 'Invalid role selected.' });
  }

  const query = `SELECT * FROM ${roleData.table} WHERE ${roleData.userField} = ? AND ${roleData.passField} = ?`;

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.json({ success: false, message: 'Something went wrong. Please try again later.' });
    }

    if (results.length > 0) {
      if (role === 'resident') {
        req.session.resident_id = results[0].resident_id;
        res.redirect('/resident-dashboard');  // Redirect to resident dashboard
      } else if (role === 'guardian') {
        req.session.guardian_id = results[0].guardian_id; // Store guardian info
        req.session.resident_id = results[0].resident_id; // Link to resident
        req.session.role = 'guardian';
        res.redirect('/guardian-dashboard');  // Redirect to guardian dashboard
      } else if (role === 'staff') {
        req.session.staff_id = results[0].staff_id;
        return res.redirect('/staff-dashboard');
      } else {
        return res.redirect(`/${role}-dashboard`);
      }
    } else {
      return res.send('<h2>Invalid username or password.</h2>');
    }
  });
});


// Static page routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

app.get('/manager-dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/manager-dashboard.html');
});

// server.js

// Serve view-residents page
app.get('/view-residents', (req, res) => {
  res.sendFile(__dirname + '/public/view-residents.html');
});

// Serve view-staff page
app.get('/view-staff', (req, res) => {
  res.sendFile(__dirname + '/public/view-staff.html');
});

// Serve view-guardians page
app.get('/view-guardians', (req, res) => {
  res.sendFile(__dirname + '/public/view-guardians.html');
});

app.get('/resident-dashboard', (req, res) => {
  console.log('Resident Dashboard Loaded | Session ID:', req.session.resident_id);
  res.sendFile(__dirname + '/public/resident-dashboard.html');
});


// Fetch all residents from the database
// Fetch all residents from the database
app.get('/api/manager/residents', (req, res) => {
  const query = 'SELECT * FROM Resident'; // Query to get all residents from the database
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching residents:', err);
      return res.status(500).send('Error fetching residents');
    }
    console.log('Results from database:', results);  // Log to verify data
    res.json(results);  // Send data as JSON to frontend
  });
});

// Repeat for staff and guardians if needed
// Fetch all staff from the database
app.get('/api/manager/staff', (req, res) => {
  const query = 'SELECT * FROM Staff'; // Query to get all staff from the database
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching staff:', err);
      return res.status(500).send('Error fetching staff');
    }
    console.log('Results from  database:', results); // Log the results to verify
    res.json(results);  // Send data as JSON to frontend
  });
});

// Fetch all guardians from the database
app.get('/api/manager/guardians', (req, res) => {
  const query = 'SELECT * FROM Guardian'; // Query to get all guardians from the database
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching guardians:', err);
      return res.status(500).send('Error fetching guardians');
    }
    console.log('Results from database (guardians):', results);  // Log to verify data
    res.json(results);  // Send data as JSON to frontend
  });
});

app.get('/manage-users', (req, res) => {
  res.sendFile(__dirname + '/public/manage-users.html');
});


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Example route to view the guardians page
app.get('/view-guardians', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view-guardians.html'));
});

// Fetch all donations from the database
app.get('/donations', (req, res) => {
  const query = 'SELECT * FROM donation'; // Query to get all donations from the database
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching donations:', err);
      return res.status(500).send('Error fetching donations');
    }
    res.json(results);  // Send data as JSON to frontend
  });
});

app.get('/view-donation', (req, res) => {
  res.sendFile(__dirname + '/public/view-donation.html');
});


app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});

const inventoryRoutes = require('./routes/inventory');
app.use('/api/manager', inventoryRoutes); // Assuming the routes are in 'routes/inventory.js'

app.get('/track-inventory', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'track-inventory.html'));
});
app.get('/api/manager/inventory', (req, res) => {
  const query = 'SELECT * FROM Inventory';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching inventory:', err);
      return res.status(500).json({ error: 'Failed to fetch inventory' });
    }
    res.status(200).json(results);
  });
});

app.get('/api/manager/inventory', (req, res) => {
  const query = 'SELECT * FROM Inventory';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching inventory:', err);
      return res.status(500).json({ error: 'Failed to fetch inventory' });
    }
    res.status(200).json(results);
  });
});
app.delete('/api/manager/inventory/:id', (req, res) => {
  const inventoryId = req.params.id;
  const query = 'DELETE FROM Inventory WHERE inventory_id = ?';
  db.query(query, [inventoryId], (err, result) => {
    if (err) {
      console.error('Error deleting inventory item:', err);
      return res.status(500).json({ error: 'Error deleting inventory item' });
    }
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  });
});

app.get('/resident-dashboard', (req, res) => {
  if (!req.session.resident_id) {
    return res.redirect('/login');
  }
  res.sendFile(__dirname + '/public/resident-dashboard.html');
});
app.get('/api/resident/info', (req, res) => {
  const residentId = req.session.resident_id;
  if (!residentId) return res.status(401).send('Unauthorized');

  // SQL query to fetch resident and guardian details
  const query = `
    SELECT 
      r.resident_id, 
      r.resident_name, 
      r.resident_gender, 
      r.resident_age, 
      r.admission_date, 
      g.guardian_name, 
      g.relation, 
      g.guardian_contactNo, 
      g.guardian_address
    FROM Resident r
    LEFT JOIN Guardian g ON g.resident_id = r.resident_id
    WHERE r.resident_id = ?
  `;
  
  db.query(query, [residentId], (err, results) => {
    if (err) return res.status(500).send('Error fetching resident details');
    if (results.length === 0) return res.status(404).send('Resident not found');

    // Send both resident and guardian details as JSON
    res.json(results[0]);  // Send the first result (resident + guardian info)
  });
});


// Serve the Guardian Dashboard page
app.get('/guardian-dashboard', (req, res) => {
  if (!req.session.guardian_id) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
  res.sendFile(path.join(__dirname, 'public', 'guardian-dashboard.html')); // Serve the file
});


app.use('/api/resident', require('./routes/resident'));


app.get('/resident-dashboard', (req, res) => {
  if (!req.session.resident_id) {
    return res.redirect('/login');
  }
  res.sendFile(__dirname + '/public/resident-dashboard.html');
});

// Fetch staff data
app.get('/api/staff/info', (req, res) => {
  const staffId = req.session.staff_id;
  if (!staffId) return res.status(401).send('Unauthorized');

  const query = `
    SELECT 
      s.staff_id, 
      s.staff_name, 
      s.role, 
      s.Staff_Salary, 
      s.shift, 
      s.Staff_gender, 
      s.Staff_username
    FROM Staff s
    WHERE s.staff_id = ?
  `;

  db.query(query, [staffId], (err, results) => {
    if (err) return res.status(500).send('Error fetching staff details');
    if (results.length === 0) return res.status(404).send('Staff not found');

    res.json(results[0]);  // Send the first result (staff data)
  });
});
app.get('/staff-dashboard', (req, res) => {
  if (!req.session.staff_id) {
    return res.redirect('/login');  // Redirect to login if no staff_id session exists
  }
  res.sendFile(__dirname + '/public/staff-dashboard.html');  // Serve the staff dashboard page
});




// More routes...
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
