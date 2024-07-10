import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import Head from "next/head";
import { useEffect } from "react";

const MapComponent = ({ userLocations }) => {
  useEffect(() => {
    const map = L.map("map").setView([22.577152, 88.3720192], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markers = L.markerClusterGroup();
    // Define marker icon
    const markerIcon = L.icon({
      iconUrl: "/_next/static/media/marker-icon.d577052a.png", // Ensure this path matches the actual location
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    Object.keys(userLocations).forEach((userId) => {
      const { latitude, longitude } = userLocations[userId];
      const marker = L.marker([latitude, longitude], {
        icon: markerIcon,
      }).bindPopup(`User: ${userId}`);

      markers.addLayer(marker);
    });

    map.addLayer(markers);

    return () => {
      map.remove();
    };
  }, [userLocations]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"
        />
      </Head>
      <div id="map" style={{ height: "100vh", width: "100%" }} />
    </>
  );
};

export default MapComponent;
