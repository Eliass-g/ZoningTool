import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ZoningMap.css";
import * as turf from "@turf/turf";
import { useDispatch } from "react-redux";
import { updateZoningType } from "../features/zoning/zoningSlice";

const ZoningMap = ({ parcels }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const menuControlRef = useRef(null);
  const mapRef = useRef(null);
  const parcelLayerRef = useRef(null);
  const [selectedZoningTypes, setSelectedZoningTypes] = useState({
    Residential: true,
    Commercial: true,
    Planned: true,
  });
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showStatsBox, setShowStatsBox] = useState(false);
  const [newZoningType, setNewZoningType] = useState("");
  const dispatch = useDispatch();

  const buttonStyle = {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "8px 16px",
    margin: "4px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const toggleSelectionMode = () => {
    const newMode = !isSelectionMode;
    setIsSelectionMode(newMode);
    setShowStatsBox(newMode);
    setSelectedParcels([]);
  };

  const getSelectionStats = () => {
    let totalArea = 0;
    const zoningCounts = {
      Residential: 0,
      Commercial: 0,
      Planned: 0,
      Other: 0,
    };

    selectedParcels.forEach((parcel) => {
      // Calculate area using turf.js
      if (parcel.geom && parcel.geom.type === "Polygon") {
        const polygon = turf.polygon(parcel.geom.coordinates);
        const area = turf.area(polygon); // in square meters
        totalArea += area;
      }

      // Count zoning types
      const zoning = parcel.zoningTyp || "Other";
      if (zoningCounts[zoning] !== undefined) {
        zoningCounts[zoning]++;
      } else {
        zoningCounts.Other++;
      }
    });

    // Convert area to acres (1 sq meter = 0.000247105 acres)
    const areaInAcres = totalArea * 0.000247105;

    return {
      totalArea: areaInAcres.toFixed(2),
      zoningCounts,
    };
  };

  const handleParcelClick = (parcel) => {
    if (!isSelectionMode) return;

    setSelectedParcels((prev) => {
      const exists = prev.some((p) => p.id === parcel.id);
      if (exists) {
        return prev.filter((p) => p.id !== parcel.id);
      } else {
        return [...prev, parcel];
      }
    });
  };

  const selectAllParcels = () => {
    setSelectedParcels(
      parcels.filter((parcel) => {
        const zoningType = parcel.zoningTyp;
        return !zoningType || selectedZoningTypes[zoningType];
      })
    );
  };

  const unselectAllParcels = () => {
    setSelectedParcels([]);
  };

  const renderFilteredParcels = (
    parcels,
    map,
    zoningTypes,
    isInitialLoad = false
  ) => {
    const layer = L.featureGroup();

    layer.clearLayers();

    parcels.forEach((parcel) => {
      const zoningType = parcel.zoningTyp;
      if (!zoningType || zoningTypes[zoningType]) {
        const geoJson = {
          type: "Feature",
          geometry: parcel.geom,
          properties: {
            id: parcel.id,
            address: parcel.mailadd,
            zoning: zoningType,
          },
        };

        const featureLayer = L.geoJSON(geoJson, {
          style: (feature) => {
            const isSelected = selectedParcels.some((p) => p.id === parcel.id);
            return {
              fillColor: getColorByZoning(feature.properties.zoning),
              weight: isSelected ? 3 : 1,
              opacity: 1,
              color: isSelected ? "#FFFF00" : "white",
              fillOpacity: 0.7,
            };
          },
        })
          .bindPopup(createParcelPopup(parcel))
          .on("click", () => handleParcelClick(parcel));

        featureLayer.addTo(layer);
      }
    });

    layer.addTo(map);
    if (isInitialLoad && layer.getLayers().length > 0) {
      map.fitBounds(layer.getBounds());
    }
    return layer;
  };

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      const map = L.map("map", {
        zoomControl: false,
      }).setView([32.971, -96.797], 14);

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      mapRef.current = map;
      createLegend(map);
      menuControlRef.current = addMenuControl(map, setIsPanelOpen);
    }

    if (mapRef.current && !parcelLayerRef.current) {
      parcelLayerRef.current = renderFilteredParcels(
        parcels,
        map,
        selectedZoningTypes,
        true
      );
      addResetZoomControl(map, parcelLayerRef);
    }

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && parcelLayerRef.current) {
      mapRef.current.removeLayer(parcelLayerRef.current);
      parcelLayerRef.current = renderFilteredParcels(
        parcels,
        mapRef.current,
        selectedZoningTypes,
        false // Not initial load
      );
    }
  }, [selectedZoningTypes, parcels, selectedParcels]);

  useEffect(() => {
    const map = mapRef.current;
    const menuControl = menuControlRef.current;

    if (!map || !menuControl) return;

    if (isPanelOpen) {
      map.removeControl(menuControl);
    } else {
      menuControl.addTo(map);
    }
  }, [isPanelOpen]);

  const handleZoningTypeChange = (zoningType) => {
    setSelectedZoningTypes((prev) => ({
      ...prev,
      [zoningType]: !prev[zoningType],
    }));
  };

  const handleUpdateZoning = async () => {
    if (!newZoningType || selectedParcels.length === 0) return;

    // Prepare the update data
    const updateData = selectedParcels.map((parcel) => ({
      id: parcel.id,
      orgZoningTyp: parcel.zoningTyp, // Set original zoning type
      zoningTyp: newZoningType, // Set new zoning type
      geom: null,
      mailadd: null,
    }));

    try {
      // Dispatch your update action
      await dispatch(updateZoningType(updateData)).unwrap();

      // Reset selection and zoning type
      setSelectedParcels([]);
      setNewZoningType("");

      // Refresh the parcels data if needed
      // dispatch(fetchParcels()); // Uncomment if you need to refresh
    } catch (error) {
      console.error("Failed to update zoning types:", error);
      alert("Failed to update zoning types");
    }
  };

  return (
    <>
      {/* Side panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: isPanelOpen ? 0 : "-340px",
          width: "300px",
          height: "100vh",
          backgroundColor: "#fff",
          boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
          zIndex: 999,
          padding: "20px",
          transition: "left 0.3s ease-in-out",
          boxSizing: "border-box",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setIsPanelOpen(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
          aria-label="Close menu"
        >
          ✕
        </button>
        <h2>Menu</h2>
        <div className="zoning-filter">
          <h3>Filter by Zoning Type</h3>
          {Object.keys(ZONING_COLORS)
            .filter((type) => type !== "default")
            .map((type) => (
              <div key={type} style={{ marginBottom: "8px" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedZoningTypes[type]}
                    onChange={() => handleZoningTypeChange(type)}
                    style={{ marginRight: "8px" }}
                  />
                  {type}
                </label>
              </div>
            ))}
        </div>
        <div className="selection-controls">
          <h3>Parcel Selection</h3>
          <button
            onClick={toggleSelectionMode}
            style={{
              backgroundColor: isSelectionMode ? "#4CAF50" : "#f44336",
              color: "white",
              padding: "8px 16px",
              margin: "8px 0",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isSelectionMode ? "Exit Selection Mode" : "Select Parcels"}
          </button>
          {isSelectionMode && (
            <>
              <button onClick={selectAllParcels} style={buttonStyle}>
                Select All
              </button>
              <button onClick={unselectAllParcels} style={buttonStyle}>
                Unselect All
              </button>
              <p>Selected: {selectedParcels.length} parcels</p>
              {selectedParcels.length > 0 && (
                <div
                  style={{
                    marginTop: "10px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  <h4>Selected Parcels:</h4>
                  <ul>
                    {selectedParcels.map((parcel) => (
                      <li key={parcel.id} style={{ margin: "4px 0" }}>
                        {parcel.id} - {parcel.mailadd}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Zoning Type Dropdown */}
              <div style={{ margin: "10px 0" }}>
                <label
                  htmlFor="zoningType"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  <strong>New Zoning Type:</strong>
                </label>
                <select
                  id="zoningType"
                  value={newZoningType}
                  onChange={(e) => setNewZoningType(e.target.value)}
                  style={{ width: "100%", padding: "5px" }}
                >
                  <option value="">Select Zoning Type</option>
                  {Object.keys(ZONING_COLORS)
                    .filter((type) => type !== "default")
                    .map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                </select>
              </div>
              {/* Update Button */}
              <button
                onClick={handleUpdateZoning}
                disabled={!newZoningType || selectedParcels.length === 0}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  opacity:
                    !newZoningType || selectedParcels.length === 0 ? 0.5 : 1,
                }}
              >
                Update Zoning Type
              </button>
            </>
          )}
        </div>
      </div>

      {showStatsBox && (
        <div
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            width: "200px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Selection Stats</h3>
          <p>
            <strong>Total Selected:</strong> {selectedParcels.length}
          </p>
          <p>
            <strong>Total Area:</strong> {getSelectionStats().totalArea} acres
          </p>
          <div>
            <strong>By Zoning Type:</strong>
            {Object.entries(getSelectionStats().zoningCounts).map(
              ([type, count]) =>
                count > 0 && (
                  <div key={type} style={{ marginLeft: "10px" }}>
                    {type}: {count}
                  </div>
                )
            )}
          </div>
        </div>
      )}
      <div id="map" style={{ width: "100%", height: "100vh" }} />
    </>
  );
};

const ZONING_COLORS = {
  Residential: "#3bb2d0",
  Commercial: "#f2a25c",
  Planned: "#e55e5e",
  default: "#ccc",
};

const getColorByZoning = (zoning) =>
  ZONING_COLORS[zoning] || ZONING_COLORS.default;

const createLegend = (map) => {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "info legend");
    div.innerHTML = "<h4>Zoning Types</h4>";

    Object.entries(ZONING_COLORS).forEach(([type, color]) => {
      if (type !== "default") {
        div.innerHTML += `
          <div class="legend-item">
            <i style="background:${color}"></i>
            <span>${type}</span>
          </div>
        `;
      }
    });

    return div;
  };

  legend.addTo(map);
};

const createParcelPopup = (parcel) => `
  <div class="parcel-popup">
    <h4>Parcel ID: ${parcel.id}</h4>
    <p><strong>Address:</strong> ${parcel.mailadd}</p>
    <p><strong>Zoning:</strong> ${parcel.zoningTyp || "Not specified"}</p>
  </div>
`;

const addResetZoomControl = (map, parcelLayerRef) => {
  const resetControl = L.control({ position: "topright" });

  resetControl.onAdd = () => {
    const container = L.DomUtil.create(
      "button",
      "leaflet-bar leaflet-control leaflet-control-custom"
    );
    container.innerHTML = "⤾";
    container.title = "Reset Zoom";
    container.style.backgroundColor = "white";
    container.style.width = "34px";
    container.style.height = "34px";
    container.style.fontSize = "18px";
    container.style.lineHeight = "34px";
    container.style.textAlign = "center";
    container.style.cursor = "pointer";

    container.onclick = () => {
      if (parcelLayerRef.current?.getLayers().length > 0) {
        map.fitBounds(parcelLayerRef.current.getBounds());
      }
    };

    return container;
  };

  resetControl.addTo(map);
};

const addMenuControl = (map, setIsPanelOpen) => {
  const menuControl = L.control({ position: "topleft" });

  menuControl.onAdd = () => {
    const container = L.DomUtil.create(
      "button",
      "leaflet-bar leaflet-control leaflet-control-custom"
    );
    container.innerHTML = "☰";
    container.title = "Open Menu";
    container.style.backgroundColor = "white";
    container.style.width = "34px";
    container.style.height = "34px";
    container.style.fontSize = "18px";
    container.style.textAlign = "center";
    container.style.cursor = "pointer";

    container.onclick = () => {
      setIsPanelOpen(true);
    };

    return container;
  };

  menuControl.addTo(map);
  return menuControl;
};

export default ZoningMap;
