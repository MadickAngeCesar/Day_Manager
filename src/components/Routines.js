import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { useTranslation } from 'react-i18next';

function Routines() {
  const { t } = useTranslation();
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({
    startTime: '',
    endTime: '',
    reminder: false,
    activity: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const alarmSoundRef = useRef(null);
  const currentAlarmRef = useRef(null);

  useEffect(() => {
    const savedRoutines = JSON.parse(localStorage.getItem('routines')) || [];
    setRoutines(savedRoutines);
  }, []);

  useEffect(() => {
    const alarms = [];
    routines.forEach((routine) => {
      if (routine.reminder) {
        const now = new Date();
        const startTime = new Date(now.toDateString() + ' ' + routine.startTime);
        const endTime = new Date(now.toDateString() + ' ' + routine.endTime);

        if (startTime > now) {
          const startAlarm = setTimeout(() => {
            playAlarm();
            alert(`Starting: ${routine.activity}`);
          }, startTime - now);
          alarms.push(startAlarm);
        }

        if (endTime > now) {
          const endAlarm = setTimeout(() => {
            playAlarm();
            alert(`Ending: ${routine.activity}`);
          }, endTime - now);
          alarms.push(endAlarm);
        }
      }
    });

    return () => alarms.forEach(alarm => clearTimeout(alarm));
  }, [routines]);

  const playAlarm = () => {
    if (!alarmSoundRef.current) {
      alarmSoundRef.current = new Audio('/alarm.wav');
    }
    alarmSoundRef.current.play().catch(error => console.log('Error playing sound:', error));
    setIsAlarmPlaying(true);
  };

  const stopAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
      setIsAlarmPlaying(false);
    }
  };

  const addOrUpdateRoutine = () => {
    if (editingIndex !== null) {
      const updatedRoutines = routines.map((routine, index) =>
        index === editingIndex ? newRoutine : routine
      );
      setRoutines(updatedRoutines);
      localStorage.setItem('routines', JSON.stringify(updatedRoutines));
      setEditingIndex(null);
    } else {
      const updatedRoutines = [...routines, newRoutine];
      setRoutines(updatedRoutines);
      localStorage.setItem('routines', JSON.stringify(updatedRoutines));
    }
    setNewRoutine({ startTime: '', endTime: '', reminder: false, activity: '' });
  };

  const editRoutine = (index) => {
    setNewRoutine(routines[index]);
    setEditingIndex(index);
  };

  const deleteRoutine = (index) => {
    const updatedRoutines = routines.filter((_, i) => i !== index);
    setRoutines(updatedRoutines);
    localStorage.setItem('routines', JSON.stringify(updatedRoutines));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRoutine({
      ...newRoutine,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="routines">
      <h2>Routines</h2>
      <table>
        <thead>
          <tr>
            <th>{t('startTime')}</th>
            <th>{t('endTime')}</th>
            <th>{t('reminder')}</th>
            <th>{t('activity')}</th>
            <th>{t('operations')}</th>
          </tr>
        </thead>
        <tbody>
          {routines.map((routine, index) => (
            <tr key={index}>
              <td>{routine.startTime}</td>
              <td>{routine.endTime}</td>
              <td>
                <input
                  type="checkbox"
                  checked={routine.reminder}
                  onChange={(e) => {
                    const updatedRoutines = [...routines];
                    updatedRoutines[index].reminder = e.target.checked;
                    setRoutines(updatedRoutines);
                    localStorage.setItem('routines', JSON.stringify(updatedRoutines));
                  }}
                />
              </td>
              <td>{routine.activity}</td>
              <td>
                <button onClick={() => editRoutine(index)}>{t('update')}</button>
                <button onClick={() => deleteRoutine(index)}>{t('delete')}</button>
              </td>
            </tr>
          ))}
          <tr>
            <td><input type="time" name="startTime" value={newRoutine.startTime} onChange={handleInputChange} /></td>
            <td><input type="time" name="endTime" value={newRoutine.endTime} onChange={handleInputChange} /></td>
            <td><input type="checkbox" name="reminder" checked={newRoutine.reminder} onChange={handleInputChange} /></td>
            <td><input type="text" name="activity" value={newRoutine.activity} onChange={handleInputChange} /></td>
            <td><button onClick={addOrUpdateRoutine}>{editingIndex !== null ? t('update') : t('addRoutine')}</button></td>
          </tr>
        </tbody>
      </table>
      {isAlarmPlaying && <button onClick={stopAlarm}>{t('stopAlarm')}</button>}
    </div>
  );
}

export default Routines;
