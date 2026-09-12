import { mappls } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const mapplsClassObject = new mappls();

const PolylineComponent = ({ map, user, fetchData, date }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const polylineRef = useRef(null);
  const markerRef = useRef(null);
  const hasCenteredMap = useRef(false);
  const [path, setPath] = useState([]);

  // Fetch initial historical path data once
  const fetchInitialData = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${colors.palette[50]}/api/brush?fileName=${date}&userName=${user}`
      );
      const jsonData = await response.json();

      if (Array.isArray(jsonData)) {
        // ✅ Filter out invalid or 0,0 coordinates
        const filteredPath = jsonData
          .filter(
            (point) =>
              point.v49 &&
              point.v50 &&
              !(parseFloat(point.v49) === 0 && parseFloat(point.v50) === 0) &&
              (String(point.v49).split(".")[1] || "").length >= 4 &&
              (String(point.v50).split(".")[1] || "").length >= 4
          )
          .map((point) => ({
            lat: parseFloat(point.v49),
            lng: parseFloat(point.v50),
          }));

        setPath(filteredPath);

        // Center map on last valid point
        if (filteredPath.length && map) {
          const lastPoint = filteredPath[filteredPath.length - 1];
          map.setCenter(lastPoint);
          hasCenteredMap.current = true;

          if (!markerRef.current) {
            markerRef.current = new mapplsClassObject.Marker({
              position: lastPoint,
              map: map,
              icon: `${window.location.origin}/assets/map-icon.png`,
            });
          } else {
            markerRef.current.setPosition(lastPoint);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching initial path data:", error);
    }
  };

  // Fetch real-time location every second
  useEffect(() => {
    fetchInitialData(); // Initial load only once

    const fetchVehicleData = async () => {
      try {
        const response = await fetch(
          `${colors.palette[50]}/getdata?user=${user}`
        );
        const data = await response.json();
        console.log("location", data.v49, data.v50);

        // ✅ Ignore update if coordinates are 0,0 or invalid
        if (
          data &&
          data.v49 &&
          data.v50 && // ensures not null or undefined
          !(parseFloat(data.v49) === 0 && parseFloat(data.v50) === 0)
        ) {
          const newPoint = {
            lat: data.v49,
            lng: data.v50,
          };

          setPath((prevPath) => [...prevPath, newPoint]);

          if (markerRef.current) {
            markerRef.current.setPosition(newPoint);
          } else {
            markerRef.current = new mapplsClassObject.Marker({
              position: newPoint,
              map: map,
              icon: `${window.location.origin}/assets/map-icon.png`,
            });
          }

          if (!hasCenteredMap.current) {
            map.setCenter(newPoint);
            hasCenteredMap.current = true;
          }
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    if (fetchData) {
      const intervalId = setInterval(fetchVehicleData, 3000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  // Update or create polyline when path changes
  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = mapplsClassObject.Polyline({
        map: map,
        path: path,
        strokeColor: "#089d77",
        strokeWeight: 7,
        strokeOpacity: 1.0,
      });
    } else {
      polylineRef.current.setPath(path);
    }
  }, [path, map]);

  return null;
};

const MapleMaps = ({
  token,
  user,
  height = "23rem",
  width = "100%",
  fetch,
  date = new Date().toISOString().slice(0, 10),
}) => {
  const map = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        mapplsClassObject.initialize(token, { map: true }, () => {
          if (map.current) {
            map.current.remove();
          }
          map.current = mapplsClassObject.Map({
            id: "map",
            properties: {
              center: [latitude, longitude], // 🌍 Use user location
              zoom: 14,
              geolocation: true,
            },
          });
          map.current.on("load", () => {
            setIsMapLoaded(true);
          });
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Fallback to default location if user denies permission
        mapplsClassObject.initialize(token, { map: true }, () => {
          if (map.current) {
            map.current.remove();
          }
          map.current = mapplsClassObject.Map({
            id: "map",
            properties: {
              center: [13.061672, 77.509245], // 📍 Fallback location
              zoom: 15,
              geolocation: true,
            },
          });
          map.current.on("load", () => {
            setIsMapLoaded(true);
          });
        });
      }
    );
  }, [token]);

  return (
    <div
      id="map"
      style={{ width: width, height: height, display: "inline-block" }}
    >
      {isMapLoaded && (
        <PolylineComponent
          map={map.current}
          user={user}
          fetchData={fetch}
          date={date}
        />
      )}
    </div>
  );
};

export default MapleMaps;
