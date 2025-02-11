let map;
let geofenceRadius = 1000;  // 1 km geofencing radius

// Function to load and parse CSV data (same as before)

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 29.3963359, lng: 76.8817195 },
        zoom: 7
    });

    // Load and mark terminal and RO locations from CSV
    loadCSVData('IOCL-Terminal to RO Distance.csv').then(rows => {
        const geofences = [];

        rows.slice(1).forEach(row => {
            const [terminalName, terminalLat, terminalLng, roName, roLat, roLng] = row;

            // Mark terminal
            if (!isNaN(terminalLat) && !isNaN(terminalLng)) {
                let terminalMarker = new google.maps.Marker({
                    position: { lat: parseFloat(terminalLat), lng: parseFloat(terminalLng) },
                    map: map,
                    title: `Terminal: ${terminalName}`,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
                });

                // Create geofence (circle) around terminal
                geofences.push(new google.maps.Circle({
                    center: terminalMarker.getPosition(),
                    radius: geofenceRadius,
                    map: map
                }));
            }

            // Mark RO
            if (!isNaN(roLat) && !isNaN(roLng)) {
                let roMarker = new google.maps.Marker({
                    position: { lat: parseFloat(roLat), lng: parseFloat(roLng) },
                    map: map,
                    title: `RO: ${roName}`,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                });

                // Create geofence (circle) around RO
                geofences.push(new google.maps.Circle({
                    center: roMarker.getPosition(),
                    radius: geofenceRadius,
                    map: map
                }));
            }
        });

        // Load vehicle halts after geofences are set
        loadHalts(geofences);
    });
}

// Load and mark vehicle halts with geofencing logic and Places API
function loadHalts(geofences) {
    loadCSVData('vehicle_halts_map_portal.csv').then(rows => {
        rows.slice(1).forEach(row => {
            const [tripId, vehicleNumber, lat, lng, haltStartTime, haltEndTime, haltDuration] = row;
            if (!isNaN(lat) && !isNaN(lng)) {
                const haltPosition = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

                // Check if halt is within any geofence
                let isInsideGeofence = geofences.some(geofence => {
                    return google.maps.geometry.spherical.computeDistanceBetween(haltPosition, geofence.getCenter()) < geofenceRadius;
                });

                if (!isInsideGeofence) {
                    // Halt is outside geofenced areas, proceed with marking halt and analyzing nearby locations
                    markHalt(haltPosition, haltStartTime, haltEndTime, haltDuration);
                    analyzeNearbyPlaces(haltPosition);  // Analyze nearby tea shops, restaurants, etc.
                }
            }
        });
    });
}

// Mark halt location on the map
function markHalt(position, startTime, endTime, duration) {
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: `Halt from ${startTime} to ${endTime}. Duration: ${duration} minutes`,
        icon: 'http://maps.google.com/mapfiles/kml/paddle/red-square.png',
        animation: google.maps.Animation.drop
    });

    // Create InfoWindow for halt details
    const contentString = `
        <div class="custom-info-window">
            <div class="custom-info-title">Halt Information</div>
            <div><strong>From:</strong> ${startTime}</div>
            <div><strong>To:</strong> ${endTime}</div>
            <div class="custom-info-duration"><strong>Duration:</strong> ${duration} minutes</div>
        </div>
    `;
    const infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', () => {
        infowindow.open(map, marker);
    });
}

// Analyze nearby places using Google Places API
function analyzeNearbyPlaces(position) {
    const service = new google.maps.places.PlacesService(map);
    
    const request = {
        location: position,
        radius: 1000,  // Search within 1 km radius
        keyword: ['tea shop', 'restaurant', 'rest area']
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                // Mark nearby places on the map
                new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                });

                // You can analyze or log the results further
                console.log(`Nearby place: ${place.name}`);
            });
        }
    });
}

// Load the Google Maps script and initialize the map
window.onload = function () {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry,places&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);
};
