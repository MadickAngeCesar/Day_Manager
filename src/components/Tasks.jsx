/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../App.css";
import { useTranslation } from "react-i18next";
import { useAlarms } from "./utils/useAlarms"; // Adjust the import path as needed

function Tasks() {
  const { t } = useTranslation();
  const { playAlarm, stopAlarm, isAlarmPlaying } = useAlarms();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    startTime: "",
    reminder: false,
    activity: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    const alarms = [];
    tasks.forEach((task) => {
      if (task.reminder) {
        const now = new Date();
        const startTime = new Date(now.toDateString() + " " + task.startTime);

        if (startTime > now) {
          const startAlarm = setTimeout(() => {
            playAlarm(`Starting: ${task.activity}`);
          }, startTime - now);
          alarms.push(startAlarm);
        }
      }
    });

    return () => alarms.forEach((alarm) => clearTimeout(alarm));
  }, [tasks, playAlarm]);

  const addOrUpdateTask = () => {
    const updatedTasks =
      editingIndex !== null
        ? tasks.map((task, index) => (index === editingIndex ? newTask : task))
        : [...tasks, newTask];

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setEditingIndex(null);
    setNewTask({ startTime: "", reminder: false, activity: "" });
  };

  const editTask = (index) => {
    setNewTask(tasks[index]);
    setEditingIndex(index);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask({
      ...newTask,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="tasks">
      <h2>{t("tasks")}</h2>
      <table>
        <thead>
          <tr>
            <th>{t("startTime")}</th>
            <th>{t("reminder")}</th>
            <th>{t("activity")}</th>
            <th>{t("operations")}</th>
          </tr>
        </thead>
        <tbody>
          {[...tasks]
            .map((task, index) => ({ ...task, originalIndex: index }))
            .sort(
              (a, b) =>
                new Date(`1970-01-01T${a.startTime}`) -
                new Date(`1970-01-01T${b.startTime}`)
            )
            .map((task) => (
              <tr key={task.originalIndex}>
                <td>{task.startTime}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={task.reminder}
                    onChange={(e) => {
                      const updatedTasks = [...tasks];
                      updatedTasks[task.originalIndex].reminder =
                        e.target.checked;
                      setTasks(updatedTasks);
                      localStorage.setItem(
                        "tasks",
                        JSON.stringify(updatedTasks)
                      );
                    }}
                  />
                </td>
                <td>{task.activity}</td>
                <td>
                  <button onClick={() => editTask(task.originalIndex)}>
                    {t("update")}
                  </button>
                  <button onClick={() => deleteTask(task.originalIndex)}>
                    {t("done")}
                  </button>
                </td>
              </tr>
            ))}
          <tr>
            <td>
              <input
                type="time"
                name="startTime"
                value={newTask.startTime}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="checkbox"
                name="reminder"
                checked={newTask.reminder}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="activity"
                value={newTask.activity}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <button onClick={addOrUpdateTask}>
                {editingIndex !== null ? t("update") : t("addTask")}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {isAlarmPlaying && <button onClick={stopAlarm}>{t("stopAlarm")}</button>}
    </div>
  );
}

export default Tasks;
