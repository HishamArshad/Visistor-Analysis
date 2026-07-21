'use client';

import { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function NotificationPermission({ children }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If notifications aren't supported, continue.
    if (!('Notification' in window)) {
      setReady(true);
      return;
    }

    // Permission was already decided previously.
    if (Notification.permission !== 'default') {
      setReady(true);
    }
  }, []);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();

    console.log('Notification permission:', permission);

    // Render Tracker regardless of allow/deny.
    setReady(true);
  };

  if (ready) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center">
        <h2 className="text-lg font-semibold">
          Enable Notifications
        </h2>

        <p className="mt-2 text-gray-600">
          We would like to send you notifications.
        </p>

        <button
          onClick={requestPermission}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}