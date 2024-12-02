import { useState, useEffect } from "react";

export const useNotification = () => {
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    const checkPermission = async () => {
      if (!("Notification" in window)) {
        console.error("This browser does not support notifications");
        return;
      }

      const currentPermission = await Notification.requestPermission();
      setPermission(currentPermission);
    };

    checkPermission();
  }, []);

  const scheduleNotification = (title, options, delay) => {
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        new Notification(title, options);
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  };

  return {
    permission,
    scheduleNotification,
  };
};
