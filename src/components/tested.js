import React, { useState, useEffect } from "react";
import "../App.css";

function Activities() {
  const [reminders, setReminders] = useState([]);
  const [newTask, setNewTask] = useState({
    startTime: '',
    endTime: '',
    reminder: false,
    activity: ''
  });

  useEffect(() => {
    // Load reminders (dummy data for example)
    const storedReminders = [];
    setReminders(storedReminders);
  }, []);

  const addReminder = (newReminder) => {
    setReminders([...reminders, newReminder]);
  };

  const deleteReminder = (reminderId) => {
    const updatedReminders = reminders.filter(
      (reminder) => reminder.id !== reminderId
    );
    setReminders(updatedReminders);
  };

  const previewReminder = (reminderId, reminderFile) => {
  };

  return (
    <div>
      <h2>Reminders</h2>
      <ReminderList reminders={reminders} deleteReminder={deleteReminder} previewReminder={previewReminder} />
      <AddReminderForm addReminder={addReminder} />
    </div>
  );
}

// Component to display a list of reminders
function ReminderList({ reminders, deleteReminder, previewReminder }) {
  return (
    <ul>
      {reminders.map((reminder) => (
        <li key={reminder.id}>
          {reminder.title} - {reminder.time} - {reminder.file}
          <button onClick={() => previewReminder(reminder.id, reminder.file)}>Preview</button>
          <button onClick={() => deleteReminder(reminder.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// Component for adding a new reminder
function AddReminderForm({ addReminder }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [file, setFile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReminder = {
      id: new Date().getTime(), // Use timestamp as ID (for simplicity)
      title,
      time,
      file,
    };
    addReminder(newReminder);
    setTitle("");
    setTime("");
    setFile("");
  };

  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedReminder = JSON.parse(localStorage.getItem('activities')) || [];
    setReminders(savedReminder);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Activity Title"
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input
        type="file"
        value={file}
        onChange={(e) => setFile(e.target.value)}
        required
      />
      <button type="submit">Add Activity</button>
    </form>
  );
}

export default Activities;
