/* eslint-disable prettier/prettier */
// utils/useAlarms.js
import { useRef, useState } from "react";
import alarm from "../../assets/sounds/alarm.wav";

export function useAlarms() {
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const alarmSoundRef = useRef(null);

  const playAlarm = (message) => {
    if (!alarmSoundRef.current) {
      alarmSoundRef.current = new Audio(alarm);
    }

    alarmSoundRef.current.loop = true;
    alarmSoundRef.current.play().catch((error) => {
      console.error("Error playing alarm sound:", error);
    });
    setIsAlarmPlaying(true);

    if (window.Notification && Notification.permission !== "denied") {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Alarm", { body: message });
          }
        });
      } else {
        new Notification("Alarm", { body: message });
      }
    } // Commented out to avoid using the Notification API
  };

  const stopAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
      alarmSoundRef.current.loop = false;
      setIsAlarmPlaying(false);
    }
  };

  return { playAlarm, stopAlarm, isAlarmPlaying };
}
