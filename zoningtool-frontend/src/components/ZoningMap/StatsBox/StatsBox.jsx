import React from "react";
import { ZONING_COLORS } from "../utils/constants";
import "../styles/ZoningMap.css";

const StatsBox = ({ selectedParcels, getSelectionStats }) => {

  return (
    <>
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
          {getSelectionStats(selectedParcels).totalArea} acres
        </p>
        <div style={{ marginBottom: "5px" }}>
          <strong style={{ fontWeight: "500" }}>By Zoning Type:</strong>
          {Object.entries(getSelectionStats(selectedParcels).zoningCounts).map(
            ([type, count]) =>
              count > 0 && (
                <div key={type} style={{ marginLeft: "10px" }}>
                  {type}: {count}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
};

export default StatsBox;
