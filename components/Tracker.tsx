'use client';

import { useEffect } from 'react';

type GeoCoords = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export default function Tracker() {
  useEffect(() => {
    async function logVisit(
      geoCoords?: GeoCoords,
      notificationPermission?: NotificationPermission
    ) {
      const payload = {
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        color_scheme: window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notification_permission: notificationPermission,
        ...geoCoords,
      };

      console.table(payload);

      await fetch('/api/visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }

    async function start() {
      let notificationPermission: NotificationPermission | undefined;

      // Request notification permission first
      if ('Notification' in window) {
        try {
          notificationPermission = await Notification.requestPermission();
          console.log(
            'Notification permission:',
            notificationPermission
          );
        } catch (err) {
          console.error(err);
        }
      }

      // Then request location
      if (!navigator.geolocation) {
        logVisit(undefined, notificationPermission);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          logVisit(
            {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            },
            notificationPermission
          );
        },
        () => {
          logVisit(undefined, notificationPermission);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    start();
  }, []);

  return null;
}
