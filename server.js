// Budget API

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');

const mysql = require ('mysql');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use('/', express.static('public'));
app.use(cors());

var connection = mysql.createConnection({
    host     : 'sql5.freemysqlhosting.net',
    user     : 'sql5738418',
    password : 'hneifDyTnB',
    database : 'sql5738418'
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const pwd = await encryptPassword(password); // Encrypt
    const signedup = transformDate(new Date()); // transform to MySQL date format
    connection.connect();
    connection.query('INSERT INTO user (username, password, signedup) VALUES (?, ?, ?)', [username, pwd, signedup], function (error, results) {
        connection.end();
        if (error) throw error;
        res.json({ success: true, results });
    });
});

app.get('/signup', async (req, res) => {
    connection.connect( err => {
        if (err) { console.error('Database connection failed:', err); }
        else { console.log('Connected to MySQL database.'); }
    });
    connection.query('SELECT * FROM user', function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

function transformDate(date) {    return date.toISOString().slice(0, 19).replace('T', ' ');    }

async function encryptPassword(password) {    return await bcrypt.hash(password, 10);    }







// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/personal-budget', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Mongoose Schema and Model
const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    budget: { type: Number, required: true },
    color: { 
        type: String, 
        required: true, 
        match: /^#[0-9A-F]{6}$/i  // Enforce hex color format
    }
});
const Budget = mongoose.model('Budget', budgetSchema);

// Endpoint - Fetch Budget Data
app.get('/budget', async (req, res) => {
    try {
        const budgetData = await Budget.find();
        res.json(budgetData);
    } catch (error) {
        console.error('Error fetching budget data:', error);
        res.status(500).send('Server Error');
    }
});

// Endpoint - Add New Budget Data
app.post('/budget', async (req, res) => {
    const { title, budget, color } = req.body;
    try {
        const newBudgetItem = await Budget.create({ title, budget, color });
        res.status(201).json(newBudgetItem);
    } catch (error) {
        console.error('Error adding budget item:', error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});