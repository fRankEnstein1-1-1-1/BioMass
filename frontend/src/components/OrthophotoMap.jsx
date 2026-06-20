import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

const GeoTIFFLayer = ({ url }) => {
  const map = useMap();
  const [layerAdded, setLayerAdded] = useState(false);

  useEffect(() => {
    if (!url || layerAdded) return;

    // We assume the backend runs on port 5000 and url is relative
    const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;

    fetch(fullUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => parseGeoraster(arrayBuffer))
      .then(georaster => {
        const layer = new GeoRasterLayer({
          georaster,
          opacity: 1,
          resolution: 512
        });
        layer.addTo(map);
        map.fitBounds(layer.getBounds());
        setLayerAdded(true);
      })
      .catch(err => console.error("Error loading GeoTIFF:", err));

  }, [url, map, layerAdded]);

  return null;
};

const OrthophotoMap = ({ orthophotoUrl }) => {
  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 relative z-10">
      <MapContainer 
        center={[0, 0]} 
        zoom={2} 
        maxZoom={26}
        style={{ width: '100%', height: '100%', minHeight: '500px', backgroundColor: '#0f172a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxNativeZoom={19}
          maxZoom={26}
        />
        {orthophotoUrl && <GeoTIFFLayer url={orthophotoUrl} />}
      </MapContainer>
    </div>
  );
};

export default OrthophotoMap;
