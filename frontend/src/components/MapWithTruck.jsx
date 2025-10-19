import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYmxpbWRhdWciLCJhIjoiY2swN2s5cHRoMDh6dzNkcXd5NzdjczZseiJ9.Jg9vWABHueLxSlucUQ4rMQ"; // Leave empty if you’re using OSM tiles
const MapWithTrucks = () => {
  const mapContainerRef = useRef(null);

  const trucks = [
    { city: "Los Angeles", coords: [-118.2437, 34.0522] },
    { city: "Houston", coords: [-95.3698, 29.7604] },
    { city: "Toronto", coords: [-79.3832, 43.6532] },
    { city: "New York", coords: [-74.006, 40.7128] },
    { city: "Vancouver", coords: [-123.1216, 49.2827] },
  ];

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
   style: 'mapbox://styles/mapbox/light-v11',
     center: [-98.5795, 39.8283],
      zoom: 3.5,
      projection: "globe", // enables round-earth effect
    });

    map.on("style.load", () => {
      // Set globe color
      map.setFog({}); // keeps subtle atmospheric glow

      // This changes the ocean/sky color
      if (map.getLayer("background")) {
        map.setPaintProperty("background", "background-color", "#e0e0e0"); // light grey
      }
      if (map.getLayer("sky")) {
        map.setPaintProperty("background", "background-color", "#e0e0e0");
        map.setPaintProperty("background", "background-color", "#e0e0e0"); // light grey globe
      }

      trucks.forEach((truck) => {
        const el = document.createElement("div");
        el.className = "truck-marker";
        el.innerHTML = "🚚";

        el.style.fontSize = "24px";
        el.style.background = "rgb(34 197 94)";
        el.style.padding = "8px";
        el.style.borderRadius = "10px";
        el.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
        el.style.color = "white";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";

        new mapboxgl.Marker(el)
          .setLngLat(truck.coords)
          .setPopup(new mapboxgl.Popup().setText(truck.city))
          .addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100vh", borderRadius: "12px" }}
    />
  );
};

export default MapWithTrucks;