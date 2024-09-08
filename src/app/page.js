"use client";
import dynamic from "next/dynamic";
import { socket } from "../app/socket";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("./component/map"), {
  ssr: false,
});

export default function Home() {
  const [userLocations, setUserLocations] = useState({});
  const [currentUserLocation, setCurrentUserLocation] = useState(null); // State to hold current user's location

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        socket.connect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentUserLocation({ latitude, longitude }); // Update current user's location
          socket.emit("location", { latitude, longitude });
        },
        (err) => {
          console.error(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    socket.on("recieve-location", (data) => {
      console.log(data);
      setUserLocations((prevLocations) => {
        const updatedLocations = { ...prevLocations, [data.id]: data };
        if (
          JSON.stringify(prevLocations) !== JSON.stringify(updatedLocations)
        ) {
          return updatedLocations;
        }
        return prevLocations;
      });
    });

    socket.on("user-disconnected", (id) => {
      console.log("User disconnected: ", id);
      setUserLocations((prevLocations) => {
        const updatedLocations = { ...prevLocations };
        delete updatedLocations[id];
        return updatedLocations;
      });
    });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Map
        userLocations={userLocations}
        currentUserLocation={currentUserLocation}
      />
    </div>
  );
}
