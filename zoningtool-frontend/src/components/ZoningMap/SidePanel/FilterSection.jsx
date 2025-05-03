import React, { useState } from "react";
import { ZONING_COLORS } from "../utils/constants";
import "../styles/ZoningMap.css";

const FilterSection = ({ selectedZoningTypes, handleZoningTypeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h3 className="menu-item" onClick={() => setIsOpen(!isOpen)}>
        Filter
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
        <div className="filter-options">
          {Object.keys(ZONING_COLORS)
            .filter((type) => type !== "default")
            .map((type) => (
              <div key={type} className="filter-option">
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
      )}
    </>
  );
};

export default FilterSection;
