const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/leaflet', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema and model for polygons
const polygonSchema = new mongoose.Schema({
    name: String,
    description: String,
    coordinates: [[Number]], // Array of latitude/longitude pairs
});

const Polygon = mongoose.model('Polygon', polygonSchema);

// API endpoint to save polygon data
app.post('/api/savePolygon', async (req, res) => {
    try {
        const { name, description, coordinates } = req.body;

        // Validate data
        if (!name || !description || !coordinates) {
            return res.status(400).send({ error: 'Invalid data' });
        }

        // Save to MongoDB
        const polygon = new Polygon({ name, description, coordinates });
        await polygon.save();

        res.status(201).send({ message: 'Polygon saved successfully!', data: polygon });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save polygon' });
    }
});

// API endpoint to retrieve saved polygons
app.get('/api/polygons', async (req, res) => {
    try {
        const polygons = await Polygon.find();
        res.status(200).send(polygons);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch polygons' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
