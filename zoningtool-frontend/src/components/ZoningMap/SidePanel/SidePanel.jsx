import React from "react";
import FilterSection from "./FilterSection";
import SelectionSection from "./SelectionSection";
import "../styles/ZoningMap.css";

const SidePanel = ({
  isPanelOpen,
  setIsPanelOpen,
  selectedZoningTypes,
  handleZoningTypeChange,
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
  return (
    <div className={`side-panel ${isPanelOpen ? "open" : ""}`}>
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
        <hr className="section-divider" />
        <FilterSection
          selectedZoningTypes={selectedZoningTypes}
          handleZoningTypeChange={handleZoningTypeChange}
        />
        <hr className="section-divider" />
        <SelectionSection
          isSelectionMode={isSelectionMode}
          toggleSelectionMode={toggleSelectionMode}
          selectedParcels={selectedParcels}
          selectAllParcels={selectAllParcels}
          unselectAllParcels={unselectAllParcels}
          newZoningType={newZoningType}
          setNewZoningType={setNewZoningType}
          handleUpdateZoning={handleUpdateZoning}
          handleDeleteZoning={handleDeleteZoning}
          selectedParcelsForDelete={selectedParcelsForDelete}
        />
        <hr className="section-divider" />
      </div>
    </div>
  );
};

export default SidePanel;
