// Budget API

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');



app.use(express.json());
app.use('/', express.static('public'));
app.use(cors());


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