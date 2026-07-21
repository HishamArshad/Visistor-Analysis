'use client';

import { useEffect } from 'react';

type GeoCoords = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export default function Tracker() {
  useEffect(() => {
    async function logVisit(geoCoords?: GeoCoords) {
           // Ask notification permission first
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        console.log("🔔 Notification Permission:", permission);
      } catch (err) {
        console.error("Notification permission failed:", err);
      }
    } else {
      console.log("❌ Notifications not supported");
    }
      const payload = {
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        color_scheme: window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...geoCoords,
      };

      console.log("📦 Payload being sent:");
      console.table(payload);

      try {
        const res = await fetch('/api/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        console.log("✅ API Response:", data);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
      }
    }

    console.log("🚀 Tracker started");
    // Ask notification permission first
    if ("Notification" in window) {
      try {
        const permission = Notification.requestPermission();
        console.log("🔔 Notification Permission:", permission);
      } catch (err) {
        console.error(err);
      }
    }
    if (!navigator.geolocation) {
      console.log("❌ Geolocation not supported");
      logVisit();
      return;
    }

    console.log("📍 Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("✅ LOCATION RECEIVED");

        console.table({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
        });

        logVisit({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },

      (err) => {
        console.error("❌ Geolocation Error");
        console.log("Code:", err.code);
        console.log("Message:", err.message);

        logVisit();
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return null;
}