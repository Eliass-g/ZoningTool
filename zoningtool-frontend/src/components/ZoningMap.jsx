import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ZoningMap = ({ parcels }) => {
  useEffect(() => {
    const map = L.map('map').setView([32.971, -96.797], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a feature group for performance
    const parcelLayer = L.featureGroup().addTo(map);
    
    // Add parcels to the map
    parcels.forEach(parcel => {
      const geoJson = {
        type: 'Feature',
        geometry: parcel.geom,
        properties: {
          id: parcel.id,
          address: parcel.mailadd,
          zoning: parcel.zoningTyp
        }
      };
      
      L.geoJSON(geoJson, {
        style: (feature) => ({
          fillColor: getColorByZoning(feature.properties.zoning),
          weight: 1,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7
        })
      }).addTo(parcelLayer);
    });

    // Fit map to parcels
    map.fitBounds(parcelLayer.getBounds());

    return () => {
      map.remove();
    };
  }, [parcels]);

  function getColorByZoning(zoning) {
    switch(zoning) {
      case 'Residential': return '#3bb2d0';
      case 'Commercial': return '#f2a25c';
      case 'Planned': return '#e55e5e';
      default: return '#ccc';
    }
  }

  return <div id="map" style={{ width: '100%', height: '100vh' }} />;
};

export default ZoningMap;

/*
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { getParcels } from "../features/zoning/zoningSlice";

const ZoningMap = () => {
  const dispatch = useDispatch();
  const { parcels, status } = useSelector((state) => state.zoning);

  useEffect(() => {
    if (status.parcels === "idle") {
      dispatch(getParcels());
    }
  }, [dispatch, status.parcels]);

  // Default center (Dallas area based on your coords)
  const center = [32.9719, -96.7976];

  return (
    <MapContainer center={center} zoom={16} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {status.parcels === "succeeded" &&
        parcels.map((parcel) => (
          <Polygon
            key={parcel.id}
            positions={parcel.geom.coordinates} // Leaflet uses [lat, lng]
            pathOptions={{ color: "blue", weight: 2 }}
          >
            <Popup>
              <div>
                <strong>ID:</strong> {parcel.id} <br />
                <strong>Address:</strong> {parcel.mailadd} <br />
                <strong>Zoning:</strong> {parcel.zoningTyp}
              </div>
            </Popup>
          </Polygon>
        ))}
    </MapContainer>
  );
};

export default ZoningMap; */