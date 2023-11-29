
// MapComponent.tsx
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface MarkerData {
  coords: [number, number];
  issue: string;
}

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [issueDescription, setIssueDescription] = useState('');

  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([50.775, 6.083], 10);

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add existing markers
    markers.forEach((marker, index) => {
      const { coords, issue } = marker;
      L.marker(coords)
        .addTo(map)
        .bindPopup(`<h1>Issue ${index + 1}</h1><p>${issue}</p><img src="/pathole.jpg" style="width:150px">`);
    });

    // Event listener for adding markers on click
    map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      const newMarkers: MarkerData[] = [...markers, { coords: [lat, lng], issue: issueDescription }];
      setMarkers(newMarkers);
      setIssueDescription('');

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<h1>Issue ${newMarkers.length}</h1><p>${issueDescription}</p><img src="/pathole.jpg" style="width:150px">`);

      // Prevent Leaflet from zooming out on click
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();
    });

    // Cleanup function
    return () => {
      map.remove(); // Remove the map when the component is unmounted
    };
  }, [markers, issueDescription]);

  return (
    <div>
      <div id="map" style={{ height: '400px' }}></div>
      <input
        type="text"
        placeholder="Enter issue description"
        value={issueDescription}
        onChange={(e) => setIssueDescription(e.target.value)}
      />
    </div>
  );
};

export default MapComponent;

