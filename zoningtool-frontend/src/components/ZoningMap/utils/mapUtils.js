import L from "leaflet";
import { ZONING_COLORS } from "./constants";

export const createLegend = (map) => {
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

export const addResetZoomControl = (map, parcelLayerRef) => {
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

export const addMenuControl = (map, setIsPanelOpen) => {
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
