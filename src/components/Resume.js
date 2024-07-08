import React, { useState, useEffect } from "react";
import "../App.css";
import { useTranslation } from 'react-i18next';

function Resume() {
  const { t } = useTranslation();
  const [summaries, setSummaries] = useState([]);
  const [newSummary, setNewSummary] = useState({
    date: "",
    summary: "",
    type: "day",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedSummaries = JSON.parse(localStorage.getItem("summaries")) || [];
    console.log("Loaded summaries from localStorage:", savedSummaries);
    setSummaries(savedSummaries);
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDayOfWeek = currentDate.getDay();

    let type = "day";
    if (currentDayOfWeek === 0) { // Sunday
      type = "week";
    }
    if (currentDay === new Date(currentYear, currentMonth + 1, 0).getDate()) { // Last day of the month
      type = "month";
    }
    if (currentDay === 31 && currentMonth === 11) { // December 31st
      type = "year";
    }

    setNewSummary((prevSummary) => ({
      ...prevSummary,
      date: currentDate.toISOString().split("T")[0],
      type: type,
    }));
    console.log("Set initial summary type:", type);
  }, []);

  const addOrUpdateSummary = () => {
    console.log("Adding or updating summary:", newSummary);
    if (!newSummary.date || !newSummary.summary) {
      console.log("Date or summary is missing");
      return;
    }

    let updatedSummaries;
    if (editingIndex !== null) {
      updatedSummaries = summaries.map((summary, index) =>
        index === editingIndex ? newSummary : summary
      );
      setEditingIndex(null);
    } else {
      updatedSummaries = [...summaries, newSummary];
    }

    setSummaries(updatedSummaries);
    localStorage.setItem("summaries", JSON.stringify(updatedSummaries));
    console.log("Updated summaries:", updatedSummaries);

    setNewSummary({ date: "", summary: "", type: "day" });
  };

  const editSummary = (index) => {
    setNewSummary(summaries[index]);
    setEditingIndex(index);
  };

  const deleteSummary = (index) => {
    const updatedSummaries = summaries.filter((_, i) => i !== index);
    setSummaries(updatedSummaries);
    localStorage.setItem("summaries", JSON.stringify(updatedSummaries));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSummary((prevSummary) => ({
      ...prevSummary,
      [name]: value,
    }));
    console.log("Updated newSummary state:", {
      ...newSummary,
      [name]: value,
    });
  };

  const cleanupSummaries = (type) => {
    let updatedSummaries = [...summaries];
    if (type === "week") {
      updatedSummaries = updatedSummaries.filter((summary) => summary.type !== "day");
    } else if (type === "month") {
      updatedSummaries = updatedSummaries.filter((summary) => summary.type !== "week");
    } else if (type === "year") {
      updatedSummaries = updatedSummaries.filter((summary) => summary.type !== "month");
    }
    setSummaries(updatedSummaries);
    localStorage.setItem("summaries", JSON.stringify(updatedSummaries));
    console.log("Cleaned up summaries based on type:", updatedSummaries);
  };

  useEffect(() => {
    if (newSummary.type !== "day") {
      cleanupSummaries(newSummary.type);
    }
  }, [newSummary.type]);

  return (
    <div className="summaries">
      <h2>{t('resume')}</h2>
      <textarea
        name="summary"
        value={newSummary.summary}
        onChange={handleInputChange}
        placeholder="Enter your summary"
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={addOrUpdateSummary}>
        {editingIndex !== null ? "Update Summary" : "Add Summary"}
      </button>
      <table>
        <thead>
          <tr>
            <th>{t('date')}</th>
            <th>{t('resume')}</th>
            <th>Type</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((summary, index) => (
            <tr key={index}>
              <td>{summary.date}</td>
              <td>{summary.summary}</td>
              <td>{summary.type}</td>
              <td>
                <button onClick={() => editSummary(index)}>{t('update')}</button>
                <button onClick={() => deleteSummary(index)}>{t('delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Resume;
