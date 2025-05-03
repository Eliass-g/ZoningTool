import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet.pattern";

import "leaflet/dist/leaflet.css";

import "./ZoningMap.css";
import * as turf from "@turf/turf";
import { useDispatch } from "react-redux";
import {
  deleteZoningType,
  updateZoningType,
} from "../../features/zoning/zoningSlice";

const ZoningMap = ({ parcels }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isZoningFilterOpen, setIsZoningFilterOpen] = useState(false);
  const [isParcelSelectionOpen, setIsParcelSelectionOpen] = useState(false);
  const menuControlRef = useRef(null);
  const mapRef = useRef(null);
  const parcelLayerRef = useRef(null);
  const [selectedZoningTypes, setSelectedZoningTypes] = useState({
    Residential: true,
    Commercial: true,
    Planned: true,
    Updated: true,
  });
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [selectedParcelsForDelete, setSelectedParcelsForDelete] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showStatsBox, setShowStatsBox] = useState(false);
  const [newZoningType, setNewZoningType] = useState("");
  const dispatch = useDispatch();

  const toggleSelectionMode = () => {
    const newMode = !isSelectionMode;
    setIsSelectionMode(newMode);
    setShowStatsBox(newMode);
    setSelectedParcels([]);
    setSelectedParcelsForDelete([]);
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

    if (parcel.orgZoningTyp !== null) {
      setSelectedParcelsForDelete((prev) => {
        const exists = prev.some((p) => p.id === parcel.id);
        if (exists) {
          return prev.filter((p) => p.id !== parcel.id);
        } else {
          return [...prev, parcel.id];
        }
      });
    }
  };

  const selectAllParcels = () => {
    const selected = [];
    const selectedForDelete = [];

    parcels.forEach((parcel) => {
      const zoningType = parcel.zoningTyp;
      const isUpdated = parcel.orgZoningTyp !== null;

      const matchesZoning = selectedZoningTypes[zoningType];
      const updatedSelected = selectedZoningTypes.Updated;

      if (matchesZoning || updatedSelected) {
        selected.push(parcel);
      }

      if (isUpdated && (matchesZoning || updatedSelected)) {
        selectedForDelete.push(parcel.id);
      }
    });

    setSelectedParcels(selected);
    setSelectedParcelsForDelete(selectedForDelete);
  };

  const unselectAllParcels = () => {
    setSelectedParcels([]);
    setSelectedParcelsForDelete([]);
  };

  const renderFilteredParcels = (
    parcels,
    map,
    zoningTypes,
    isInitialLoad = false
  ) => {
    const layer = L.featureGroup();

    parcels.forEach((parcel) => {
      const zoningType = parcel.zoningTyp;
      const isUpdated = parcel.orgZoningTyp !== null;
      if (
        (!isUpdated && zoningTypes[zoningType]) ||
        (zoningTypes.Updated && isUpdated) // OR if Updated is checked AND item is updated
      ) {
        const geoJson = {
          type: "Feature",
          geometry: parcel.geom,
          properties: {
            id: parcel.id,
            address: parcel.mailadd,
            zoning: zoningType,
            orgZoningTyp: parcel.orgZoningTyp,
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

        const isUpdated = parcel.orgZoningTyp !== null;

        if (isUpdated) {
          const centroid = turf.centroid(geoJson).geometry.coordinates;
          L.circle([centroid[1], centroid[0]], {
            radius: 5, // Small radius for an indicator dot
            fillColor: "purple",
            color: "purple",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(layer);
        }
      }
    });

    layer.addTo(map);
    if (isInitialLoad && layer.getLayers().length > 0) {
      map.fitBounds(layer.getBounds());
    }
    return layer;
  };

  useEffect(() => {
    const map = L.map("map", {
      zoomControl: false,
    }).setView([32.971, -96.797], 14);

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    createLegend(map);
    parcelLayerRef.current = renderFilteredParcels(
      parcels,
      map,
      selectedZoningTypes,
      true
    );
    addResetZoomControl(map, parcelLayerRef);

    mapRef.current = map;
    menuControlRef.current = addMenuControl(map, setIsPanelOpen);

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
      orgZoningTyp: parcel.orgZoningTyp ?? parcel.zoningTyp, // Set original zoning type
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

  const handleDeleteZoning = async () => {
    if (selectedParcelsForDelete.length === 0) return;

    try {
      await dispatch(deleteZoningType(selectedParcelsForDelete)).unwrap();

      // Reset selection and zoning type
      setSelectedParcelsForDelete([]);
    } catch (error) {
      console.error("Failed to delete zoning types:", error);
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
        <div className="menu-position">
          <div className="zoning-filter">
            <hr className="section-divider" />
            <h3
              className="menu-item"
              onClick={() => setIsZoningFilterOpen(!isZoningFilterOpen)}
            >
              Filter
              <span
                style={{
                  marginBottom: "3px",
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderLeft: "2px solid black",
                  borderBottom: "2px solid black",
                  transform: isZoningFilterOpen
                    ? "rotate(135deg)"
                    : "rotate(315deg)",
                  transition: "transform 0.1s ease",
                }}
              />
            </h3>
            {isZoningFilterOpen &&
              Object.keys(ZONING_COLORS)
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
            <hr className="section-divider" />
            <h3
              className="menu-item"
              onClick={() => setIsParcelSelectionOpen(!isParcelSelectionOpen)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              Select/Edit
              <span
                style={{
                  marginBottom: "3px",
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderLeft: "2px solid black",
                  borderBottom: "2px solid black",
                  transform: isParcelSelectionOpen
                    ? "rotate(135deg)"
                    : "rotate(315deg)",
                  transition: "transform 0.1s ease",
                }}
              />
            </h3>
            {isParcelSelectionOpen && (
              <div className="parcel-selection-container">
                <button
                  onClick={toggleSelectionMode}
                  className={`selection-mode-button ${
                    isSelectionMode ? "selection-active" : ""
                  }`}
                >
                  {isSelectionMode ? "Exit Selection Mode" : "Select Parcels"}
                </button>

                {isSelectionMode && (
                  <>
                    <div className="selection-actions-row">
                      <button
                        onClick={selectAllParcels}
                        className="selection-button"
                      >
                        Select All
                      </button>
                      <button
                        onClick={unselectAllParcels}
                        className="selection-button"
                      >
                        Unselect All
                      </button>
                    </div>

                    <p className="selected-count">
                      Selected: {selectedParcels.length} parcels
                    </p>

                    {selectedParcels.length > 0 && (
                      <div className="selected-parcels-list">
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
                    <div className="zoning-type-select">
                      <label htmlFor="zoningType">New Zoning Type:</label>
                      <select
                        id="zoningType"
                        value={newZoningType}
                        onChange={(e) => setNewZoningType(e.target.value)}
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
                      className="update-button"
                    >
                      Update Zoning Type
                    </button>

                    <button
                      onClick={handleDeleteZoning}
                      disabled={selectedParcelsForDelete.length === 0}
                      className="delete-button"
                    >
                      Delete Zoning Type
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <hr className="section-divider" />
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
            fontSize: "15px",
          }}
        >
          <h3 style={{ marginTop: 0, fontWeight: "500", fontSize: "17px" }}>
            Selection Stats
          </h3>
          <p>
            <strong style={{ fontWeight: "500" }}>Total Selected:</strong>{" "}
            {selectedParcels.length}
          </p>
          <p>
            <strong style={{ fontWeight: "500" }}>Total Area:</strong>{" "}
            {getSelectionStats().totalArea} acres
          </p>
          <div style={{ marginBottom: "5px" }}>
            <strong style={{ fontWeight: "500" }}>By Zoning Type:</strong>
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
  Updated: "purple",
  default: "#ccc",
};

const getColorByZoning = (zoning) =>
  ZONING_COLORS[zoning] || ZONING_COLORS.default;

const createLegend = (map) => {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "info legend");

    // Create a header container with title and minimize button
    const header = L.DomUtil.create("div", "legend-header", div);
    const title = L.DomUtil.create("h4", "", header);
    title.textContent = "Zoning Types";

    // Add minimize button
    const minimizeBtn = L.DomUtil.create("span", "minimize-btn", header);
    minimizeBtn.innerHTML = "−";
    minimizeBtn.style.cssText = `
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
    `;

    // Create content container
    const content = L.DomUtil.create("div", "legend-content", div);

    Object.entries(ZONING_COLORS).forEach(([type, color]) => {
      if (type !== "default") {
        content.innerHTML += `
          <div class="legend-item">
            <i style="background:${color}"></i>
            <span>${type}</span>
          </div>
        `;
      }
    });

    // Add click handler for minimize button
    L.DomEvent.on(minimizeBtn, "click", function () {
      if (content.style.display === "none") {
        content.style.display = "block";
        minimizeBtn.innerHTML = "−";
        div.classList.remove("minimized");
      } else {
        content.style.display = "none";
        minimizeBtn.innerHTML = "+";
        div.classList.add("minimized");
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
    ${
      parcel.orgZoningTyp
        ? `<p><strong>Original Zoning:</strong> ${parcel.orgZoningTyp}</p>`
        : ""
    }
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
