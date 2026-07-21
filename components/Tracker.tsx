'use client';

import { useEffect } from 'react';

export default function Tracker() {
  useEffect(() => {
    async function logVisit(
      geoCoords?: { latitude: number; longitude: number; accuracy: number }
    ) {
      await fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          color_scheme: window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...geoCoords,
        }),
      });
    }

    async function startTracking() {
      // Request notification permission first
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          console.log('Notification permission:', permission);
        } catch (err) {
          console.error('Notification permission failed:', err);
        }
      }

      // Keep your geolocation logic untouched
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('SUCCESS', pos.coords);

          logVisit({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          console.log('ERROR', err);

          logVisit();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    startTracking();
  }, []);

  return null;
}