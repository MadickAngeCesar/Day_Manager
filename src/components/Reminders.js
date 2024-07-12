import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

// Check for Notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

const Reminders = () => {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState(() => {
    // Load reminders from localStorage
    const savedReminders = localStorage.getItem("reminders");
    return savedReminders ? JSON.parse(savedReminders) : [];
  });
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const alarmSoundRef = useRef(null);

  useEffect(() => {
    // Save reminders to localStorage
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const checkReminders = () => {
      const currentTime = new Date().getTime();
      reminders.forEach((reminder) => {
        const reminderTime = new Date(reminder.time).getTime();
        if (reminderTime <= currentTime) {
          new Notification(reminder.title, {
            body: `It's time for ${reminder.title}!`,
          });
          playAlarm();
          deleteReminder(reminder.id); // Optionally delete the reminder after notification
        } else {
          // Set a precise timeout for the reminder
          setTimeout(() => {
            new Notification(reminder.title, {
              body: `It's time for ${reminder.title}!`,
            });
            playAlarm();
            deleteReminder(reminder.id); // Optionally delete the reminder after notification
          }, reminderTime - currentTime);
        }
      });
    };

    // Check reminders initially and set a check interval
    checkReminders();
    const interval = setInterval(checkReminders, 1000); // Check every second

    return () => clearInterval(interval);
  }, [reminders]);

  const playAlarm = () => {
    if (!alarmSoundRef.current) {
      alarmSoundRef.current = new Audio("/alarm.wav");
    }
    alarmSoundRef.current.play().catch((error) => {
      console.error("Error playing alarm sound:", error);
    });
    setIsAlarmPlaying(true);
  };

  const stopAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
      setIsAlarmPlaying(false);
    }
  };

  const addReminder = (newReminder) => {
    setReminders([...reminders, newReminder]);
  };

  const deleteReminder = (reminderId) => {
    const updatedReminders = reminders.filter(
      (reminder) => reminder.id !== reminderId
    );
    setReminders(updatedReminders);
  };

  return (
    <div>
      <h2>{t('reminders')}</h2>
      <ReminderList reminders={reminders} deleteReminder={deleteReminder} />
      <AddReminderForm addReminder={addReminder} />
      {isAlarmPlaying && <button onClick={stopAlarm}>{t('stopAlarm')}</button>}
    </div>
  );
};

// Component to display a list of reminders
function ReminderList({ reminders, deleteReminder }) {
  const { t } = useTranslation();
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>{t('event')}</th>
            <th>{t('date')} {t('time')}</th>
            <th>{t('description')}</th>
            <th>{t('operations')}</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder) => (
            <tr key={reminder.id}>
              <td>{reminder.title}</td>
              <td>{new Date(reminder.time).toLocaleString()}</td>
              <td>{reminder.frequency}</td>
              <td>
                <button onClick={() => deleteReminder(reminder.id)}>
                  {t('delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/> <br/>
    </div>
  );
}

// Component for adding a new reminder
function AddReminderForm({ addReminder }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReminder = {
      id: new Date().getTime(), // Use timestamp as ID (for simplicity)
      title,
      time,
      frequency,
    };
    addReminder(newReminder);
    setTitle("");
    setTime("");
    setFrequency("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('event')}
        required
      />
      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <input
        type="text"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        placeholder={t('description')}
      />
      <button type="submit">{t('addReminder')}</button>
    </form>
  );
}

export default Reminders;
