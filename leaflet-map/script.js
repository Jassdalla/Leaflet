// Initialize the map and set its view
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add Leaflet Draw controls
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false
    }
});
map.addControl(drawControl);

// Event listener for when a polygon is drawn
map.on('draw:created', function(event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);

    // When a polygon is drawn, show a popup form to enter details
    layer.bindPopup(`
        <h3>Enter Details</h3>
        <form id="polygonForm">
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" required><br><br>
            <label for="description">Description:</label><br>
            <textarea id="description" name="description" required></textarea><br><br>
            <input type="submit" value="Submit">
        </form>
    `).openPopup();

    // Handle the form submission
    document.getElementById('polygonForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting normally

        // Get form data
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;

        // Update the popup with the entered data
        layer.setPopupContent(`
            <b>Polygon Name:</b> ${name}<br>
            <b>Description:</b> ${description}
        `);

        // Optionally, save the data in a variable or database here

        // Close the popup after submission
        layer.closePopup();
    });
});
