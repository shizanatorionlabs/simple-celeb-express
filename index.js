const { Pool } = require('pg');
const express = require('express');
const app = express();
const PORT = 3000;


const pool = new Pool({
    user: 'admin',
    host: 'dpg-cji6ce0cfp5c738nmssg-a',
    database: 'orioncmsbs',
    password: 'GqtvjFhbQ77MYuTsQgzX2WTjalyP8kHu',
    port: 5432, // Default PostgreSQL port
});


// Test the connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL at:', res.rows[0].now);
    }
});


// Create Table If Not Exists
app.get('/create-table', (req, res) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS students (
        id serial PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      )
    `;

    pool.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            res.status(500).send('Error creating table');
        } else {
            console.log('Table "users" created or already exists');
            res.send('Table "users" created or already exists');
        }
    });
});

// Create User With Username and Email Parameters
app.get('/create-user', (req, res) => {
    const { username, email } = req.query

    const createUserQuery = `
    INSERT INTO students (username, email) VALUES ($1, $2)
    `;

    pool.query(createUserQuery, [username, email], (err, result) => {
        if (err) {
            console.error('Error creating user: ', err)
            res.status(500).send('Error Creating User')
        } else {
            console.log("User Added")
            console.log("User Added")
        }
    })
})



// Get All Users
app.get('/users', (req, res) => {
    const query = `SELECT * FROM students`;

    pool.query(query, (err, result) => {
        if (err) {
            console.log('Error Fetching Users', err);
            res.status(500).send('Error fetching users');
        } else {
            const usernames = result.rows.map(row => row.username);
            res.send(usernames.map(username => username)); // Sending all usernames as a single string
        }
    });
});



// Listen to Port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
