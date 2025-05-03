import L from "leaflet";
import * as turf from "@turf/turf";
import { ZONING_COLORS } from "./constants";

const getColorByZoning = (zoning) =>
  ZONING_COLORS[zoning] || ZONING_COLORS.default;

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

export const renderFilteredParcels = (
  parcels,
  map,
  zoningTypes,
  selectedParcels,
  handleParcelClick,
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

export const getSelectionStats = (selectedParcels) => {
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
