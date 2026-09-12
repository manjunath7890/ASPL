import { mappls } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const mapplsClassObject = new mappls();

const PolylineComponent = ({ map, user, date, fetchTrigger }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const polylineRef = useRef(null);
  const markerRef = useRef(null);
  const hasCenteredMap = useRef(false);
  const [path, setPath] = useState([]);

  // Fetch initial historical path data once
  const fetchInitialData = async () => {
    if (!user || user === "undefined") return;

    try {
      const response = await fetch(
        `${colors.palette[50]}/analytics/${user}/map?startDate=${date}`
      );
      const jsonData = await response.json();

      if (Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].mapRoutes) {
        // ✅ Filter out invalid or 0,0 coordinates from pre-calculated mapRoutes
        const filteredPath = jsonData[0].mapRoutes
          .filter(
            (point) =>
              point.lat &&
              point.lng &&
              !(parseFloat(point.lat) === 0 && parseFloat(point.lng) === 0) &&
              (String(point.lat).split(".")[1] || "").length >= 4 &&
              (String(point.lng).split(".")[1] || "").length >= 4
          )
          .map((point) => ({
            lat: parseFloat(point.lat),
            lng: parseFloat(point.lng),
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

  useEffect(() => {

    if (!fetchTrigger) return; // prevent initial unwanted call
    fetchInitialData();
    console.log("Fetching data due to fetchTrigger change:", fetchTrigger);

  }, [fetchTrigger]);


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
  height = "24rem",
  width = "100%",
  fetch,
  fetchTrigger,
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
          fetchTrigger={fetchTrigger}
        />
      )}
    </div>
  );
};

export default MapleMaps;
