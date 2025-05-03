import React, { useState } from "react";
import { ZONING_COLORS } from "../utils/constants";
import "../styles/ZoningMap.css";

const SelectionSection = ({
  isSelectionMode,
  toggleSelectionMode,
  selectedParcels,
  selectAllParcels,
  unselectAllParcels,
  newZoningType,
  setNewZoningType,
  handleUpdateZoning,
  handleDeleteZoning,
  selectedParcelsForDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="selection-controls">
      <h3
        className="menu-item"
        onClick={() => setIsOpen(!isOpen)}
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
            transform: isOpen ? "rotate(135deg)" : "rotate(315deg)",
            transition: "transform 0.1s ease",
          }}
        />
      </h3>

      {isOpen && (
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
                <button onClick={selectAllParcels} className="selection-button">
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

              <div className="zoning-type-select">
                <label htmlFor="zoningType">New Zoning Type:</label>
                <select
                  id="zoningType"
                  value={newZoningType}
                  onChange={(e) => setNewZoningType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  {Object.keys(ZONING_COLORS)
                    .filter((type) => type !== "default")
                    .map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                </select>
              </div>

              <button
                onClick={handleUpdateZoning}
                disabled={!newZoningType || selectedParcels.length === 0}
                className="update-button"
              >
                Update Zoning
              </button>
              <button
                onClick={handleDeleteZoning}
                disabled={selectedParcelsForDelete.length === 0}
                className="delete-button"
              >
                Delete Zoning
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectionSection;
