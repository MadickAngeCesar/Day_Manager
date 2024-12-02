/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Reminders = () => {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem('reminders');
    return savedReminders ? JSON.parse(savedReminders) : [];
  });

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (newReminder) => {
    setReminders([...reminders, newReminder]);
  };

  const deleteReminder = (reminderId) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
  };

  return (
    <div className="reminders-container">
      <h2>{t('reminders')}</h2>
      <ReminderList reminders={reminders} deleteReminder={deleteReminder} />
      <AddReminderForm addReminder={addReminder} />
    </div>
  );
};

const ReminderList = ({ reminders, deleteReminder }) => {
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
          {reminders.map(reminder => (
            <tr key={reminder.id}>
              <td>{reminder.title}</td>
              <td>{reminder.time}</td>
              <td>{reminder.description}</td>
              <td>
                <button onClick={() => deleteReminder(reminder.id)}>{t('delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddReminderForm = ({ addReminder }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReminder = {
      id: new Date().getTime(),
      title,
      time,
      description
    };
    addReminder(newReminder);
    setTitle('');
    setTime('');
    setDescription('');
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
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t('description')}
      />
      <button type="submit">{t('add')}</button>
    </form>
  );
};

export default Reminders;
