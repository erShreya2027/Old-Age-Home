const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // 👈 use your MySQL username
  password: 'Shreya@123',           // 👈 enter your MySQL password (if any)
  database: 'Old_Age_Home'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL as ID ' + connection.threadId);
});

module.exports = connection;
