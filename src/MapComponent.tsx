
// MapComponent.tsx
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';

interface MarkerData {
  id: number;
  coords: [number, number];
  issue: string;
  description: string;
}

const getColorForIssue = (issue: string): string => {
  switch (issue) {
    case 'Road':
      return 'red';
    case 'Light':
      return 'yellow';
    case 'Float':
      return 'blue';
    case 'Maintenance':
      return 'green';
    default:
      return 'black';
  }
};

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { Overlay } = LayersControl;

  useEffect(() => {
    const map = L.map('map').setView([50.775, 6.083], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const roadLayer = L.layerGroup();
    const lightLayer = L.layerGroup();
    const floatLayer = L.layerGroup();
    const maintenanceLayer = L.layerGroup();

    const issueLayers: { [key: string]: L.LayerGroup } = {
      Road: roadLayer,
      Light: lightLayer,
      Float: floatLayer,
      Maintenance: maintenanceLayer,
    };

    const updateLayers = () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.LayerGroup) {
          layer.clearLayers();
        }
      });

      markers.forEach((marker) => {
        const { id, coords, issue, description } = marker;
        const markerColor = getColorForIssue(issue);

        L.marker(coords, {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="${markerColor}" fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          }),
        })
          .addTo(issueLayers[issue])
          .bindPopup(`<h1>Issue ${id}</h1><p>${description}</p>`)
          .on('click', () => {
            setSelectedIssue(issue);
          });
      });
    };

    map.addLayer(roadLayer);
    map.addLayer(lightLayer);
    map.addLayer(floatLayer);
    map.addLayer(maintenanceLayer);

    updateLayers();

    map.on('click', (event) => {
      if (selectedIssue && description) {
        const { lat, lng } = event.latlng;
        const newMarkers: MarkerData[] = [
          ...markers,
          { id: markers.length + 1, coords: [lat, lng], issue: selectedIssue, description },
        ];
        setMarkers(newMarkers);
        setSelectedIssue('');
        setDescription('');

        const markerColor = getColorForIssue(selectedIssue);
        L.marker(L.latLng(lat, lng), {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="${markerColor}" fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          }),
        })
          .addTo(issueLayers[selectedIssue])
          .bindPopup(`<h1>Issue ${newMarkers.length}</h1><p>${description}</p>`)
          .on('click', () => {
            setSelectedIssue(selectedIssue);
          });

        updateLayers();

        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
      }
    });

    return () => {
      map.remove();
    };
  }, [markers, selectedIssue, description]);

  return (
    <div>
         <div id="map" style={{ height: '400px' }}></div>
     <select value={selectedIssue} onChange={(e) => setSelectedIssue(e.target.value)}>
       <option value="">Select Issue</option>
       <option value="Road">Road</option>
       <option value="Light">Light</option>
       <option value="Float">Float</option>
       <option value="Maintenance">Maintenance</option>
     </select>
     <input
       type="text"
       placeholder="Enter issue description"
       value={description}
       onChange={(e) => setDescription(e.target.value)}
     />
   </div>
 );
};


export default MapComponent;
