/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../App.css";
import { useTranslation } from "react-i18next";
import { useAlarms } from "./utils/useAlarms"; // Adjust the import path as needed

function Routines() {
  const { t } = useTranslation();
  const { playAlarm, stopAlarm, isAlarmPlaying } = useAlarms();
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({
    startTime: "",
    endTime: "",
    reminder: false,
    activity: "",
    interval: 0,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [nonWorkingDays, setNonWorkingDays] = useState(
    JSON.parse(localStorage.getItem("WorkingDays")) || {}
  );

  useEffect(() => {
    const savedRoutines = JSON.parse(localStorage.getItem("routines")) || [];
    setRoutines(savedRoutines);
  }, []);

  useEffect(() => {
    const alarms = [];
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Check if today is a non-working day
    const isNonWorkingDay = nonWorkingDays[currentDay] === true;

    if (isNonWorkingDay) {
      routines.forEach((routine) => {
        if (routine.reminder) {
          const startTime = new Date(
            now.toDateString() + " " + routine.startTime
          );
          const endTime = new Date(now.toDateString() + " " + routine.endTime);

          if (startTime > now) {
            const startAlarm = setTimeout(() => {
              playAlarm(`Starting: ${routine.activity}`);
            }, startTime - now);
            alarms.push(startAlarm);
          }

          if (routine.interval > 0) {
            let snoozeTime = new Date(
              startTime.getTime() + routine.interval * 60000
            );
            while (snoozeTime < endTime) {
              if (snoozeTime > now) {
                const snoozeAlarm = setTimeout(() => {
                  playAlarm(`Snooze: ${routine.activity}`);
                }, snoozeTime - now);
                alarms.push(snoozeAlarm);
              }
              snoozeTime = new Date(
                snoozeTime.getTime() + routine.interval * 60000
              );
            }
          }
        }
      });
    }

    return () => alarms.forEach((alarm) => clearTimeout(alarm));
  }, [routines, playAlarm, nonWorkingDays]);

  const addOrUpdateRoutine = () => {
    const updatedRoutines =
      editingIndex !== null
        ? routines.map((routine, index) =>
            index === editingIndex ? newRoutine : routine
          )
        : [...routines, newRoutine];

    setRoutines(updatedRoutines);
    localStorage.setItem("routines", JSON.stringify(updatedRoutines));
    setEditingIndex(null);
    setNewRoutine({
      startTime: "",
      endTime: "",
      reminder: false,
      activity: "",
      interval: 0,
    });
  };

  const editRoutine = (index) => {
    setNewRoutine(routines[index]);
    setEditingIndex(index);
  };

  const deleteRoutine = (index) => {
    const updatedRoutines = routines.filter((_, i) => i !== index);
    setRoutines(updatedRoutines);
    localStorage.setItem("routines", JSON.stringify(updatedRoutines));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRoutine({
      ...newRoutine,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNonWorkingDayChange = (e) => {
    const { value, checked } = e.target;
    setNonWorkingDays((prev) => {
      const newDays = { ...prev, [value]: checked };
      localStorage.setItem("WorkingDays", JSON.stringify(newDays));
      return newDays;
    });
  };

  return (
    <div className="routines">
      <h2>{t("routines")}</h2>
      <div className="non-working-days">
        <h3>{t("workingDays")}</h3>
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={index}
              checked={nonWorkingDays[index] || false}
              onChange={handleNonWorkingDayChange}
            />
            {t(day.toLowerCase())}
          </label>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>{t("startTime")}</th>
            <th>{t("endTime")}</th>
            <th>{t("reminder")}</th>
            <th>{t("activity")}</th>
            <th>{t("interval")}</th>
            <th>{t("operations")}</th>
          </tr>
        </thead>
        <tbody>
          {[...routines]
            .map((routine, index) => ({ ...routine, originalIndex: index }))
            .sort(
              (a, b) =>
                new Date(`1970-01-01T${a.startTime}`) -
                new Date(`1970-01-01T${b.startTime}`)
            )
            .map((routine) => (
              <tr key={routine.originalIndex}>
                <td>{routine.startTime}</td>
                <td>{routine.endTime}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={routine.reminder}
                    onChange={(e) => {
                      const updatedRoutines = [...routines];
                      updatedRoutines[routine.originalIndex].reminder =
                        e.target.checked;
                      setRoutines(updatedRoutines);
                      localStorage.setItem(
                        "routines",
                        JSON.stringify(updatedRoutines)
                      );
                    }}
                  />
                </td>
                <td>{routine.activity}</td>
                <td>
                  {routine.interval === 0 ? "None" : `${routine.interval} mins`}
                </td>
                <td>
                  <button onClick={() => editRoutine(routine.originalIndex)}>
                    {t("update")}
                  </button>
                  <button onClick={() => deleteRoutine(routine.originalIndex)}>
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          <tr>
            <td>
              <input
                type="time"
                name="startTime"
                value={newRoutine.startTime}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="time"
                name="endTime"
                value={newRoutine.endTime}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="checkbox"
                name="reminder"
                checked={newRoutine.reminder}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="activity"
                value={newRoutine.activity}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="interval"
                value={newRoutine.interval}
                onChange={handleInputChange}
                min="0"
                placeholder="Interval in mins"
              />
            </td>
            <td>
              <button onClick={addOrUpdateRoutine}>
                {editingIndex !== null ? t("update") : t("addRoutine")}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {isAlarmPlaying && <button onClick={stopAlarm}>{t("stopAlarm")}</button>}
    </div>
  );
}

export default Routines;
