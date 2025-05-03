import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet.pattern";
import "leaflet/dist/leaflet.css";
import "./ZoningMap.css";
import { useDispatch } from "react-redux";
import {
  deleteZoningType,
  updateZoningType,
} from "../../features/zoning/zoningSlice";
import SidePanel from "./SidePanel/SidePanel";
import StatsBox from "./StatsBox/StatsBox";
import {
  createLegend,
  addResetZoomControl,
  addMenuControl,
} from "./utils/mapUtils";
import { renderFilteredParcels, getSelectionStats } from "./utils/zoningUtils";

const ZoningMap = ({ parcels }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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

  //Initial map creation and layer render
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
      selectedParcels,
      handleParcelClick,
      true
    );
    addResetZoomControl(map, parcelLayerRef);
    mapRef.current = map;
    menuControlRef.current = addMenuControl(map, setIsPanelOpen);
    return () => {
      map.remove();
    };
  }, []);

  //Re-render when filtered, selected, updated or deleted
  useEffect(() => {
    if (mapRef.current && parcelLayerRef.current) {
      mapRef.current.removeLayer(parcelLayerRef.current);
      parcelLayerRef.current = renderFilteredParcels(
        parcels,
        mapRef.current,
        selectedZoningTypes,
        selectedParcels,
        handleParcelClick,
        false
      );
    }
  }, [selectedZoningTypes, parcels, selectedParcels]);

  //Add and remove top right menu button depending on side panel state
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

  //Set Select mode
  const toggleSelectionMode = () => {
    const newMode = !isSelectionMode;
    setIsSelectionMode(newMode);
    setShowStatsBox(newMode);
    setSelectedParcels([]);
    setSelectedParcelsForDelete([]);
  };

  //Add selected parcels to selected parcels state for updating/deleting
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

  //Check whether parcel can be updated and/or deleted when select all is hit
  const selectAllParcels = () => {
    const selected = [];
    const selectedForDelete = [];
    parcels.forEach((parcel) => {
      const zoningType = parcel.zoningTyp;
      const isUpdated = parcel.orgZoningTyp !== null;
      const matchesZoning = selectedZoningTypes[zoningType];
      const updatedSelected = selectedZoningTypes.Updated;
      if (matchesZoning || (updatedSelected && isUpdated)) {
        selected.push(parcel);
      }
      if (isUpdated && (matchesZoning || updatedSelected)) {
        selectedForDelete.push(parcel.id);
      }
    });
    setSelectedParcels(selected);
    setSelectedParcelsForDelete(selectedForDelete);
  };

  //Reset select parcel state when unselect all is hit
  const unselectAllParcels = () => {
    setSelectedParcels([]);
    setSelectedParcelsForDelete([]);
  };

  //Set state for which zoning type filter options are being used
  const handleZoningTypeChange = (zoningType) => {
    setSelectedZoningTypes((prev) => ({
      ...prev,
      [zoningType]: !prev[zoningType],
    }));
  };

  //Update parcel zoning type with backend request and update state on frontend
  const handleUpdateZoning = async () => {
    if (!newZoningType || selectedParcels.length === 0) return;
    const updateData = selectedParcels.map((parcel) => ({
      id: parcel.id,
      orgZoningTyp: parcel.orgZoningTyp ?? parcel.zoningTyp,
      zoningTyp: newZoningType,
      geom: null,
      mailadd: null,
    }));
    try {
      await dispatch(updateZoningType(updateData)).unwrap();
      setSelectedParcels([]);
      setNewZoningType("");
    } catch (error) {
      console.error("Failed to update zoning types:", error);
      alert("Failed to update zoning types");
    }
  };

  //Delete parcel zoning type with backend request and update state on frontend
  const handleDeleteZoning = async () => {
    if (selectedParcelsForDelete.length === 0) return;
    try {
      await dispatch(deleteZoningType(selectedParcelsForDelete)).unwrap();
      setSelectedParcelsForDelete([]);
    } catch (error) {
      console.error("Failed to delete zoning types:", error);
      alert("Failed to update zoning types");
    }
  };

  return (
    <>
      {/* Render Side Panel */}
      <SidePanel
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        selectedZoningTypes={selectedZoningTypes}
        handleZoningTypeChange={handleZoningTypeChange}
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

      {/* Render Stats Box */}
      {showStatsBox && (
        <StatsBox
          selectedParcels={selectedParcels}
          getSelectionStats={getSelectionStats}
        />
      )}
      {/* Render Map */}
      <div id="map" style={{ width: "100%", height: "100vh" }} />
    </>
  );
};

export default ZoningMap;
