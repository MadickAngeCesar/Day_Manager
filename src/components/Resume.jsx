/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import '../App.css';
import { useTranslation } from 'react-i18next';

function Resume() {
  const { t } = useTranslation();
  const [summaries, setSummaries] = useState(() => {
    const savedSummaries = localStorage.getItem('summaries');
    return savedSummaries ? JSON.parse(savedSummaries) : [];
  });
  const [newSummary, setNewSummary] = useState({
    date: '',
    summary: '',
    type: 'day',
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDayOfWeek = currentDate.getDay();

    let type = 'day';
    if (currentDayOfWeek === 0) {
      type = 'week';
    }
    if (currentDay === new Date(currentYear, currentMonth + 1, 0).getDate()) {
      type = 'month';
    }
    if (currentDay === 31 && currentMonth === 11) {
      type = 'year';
    }

    setNewSummary((prevSummary) => ({
      ...prevSummary,
      date: currentDate.toISOString().split('T')[0],
      type: type,
    }));
  }, []);

  const addOrUpdateSummary = () => {
    if (!newSummary.date || !newSummary.summary) return;

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
    localStorage.setItem('summaries', JSON.stringify(updatedSummaries));
    setNewSummary({ date: '', summary: '', type: 'day' });
  };

  const editSummary = (index) => {
    setNewSummary(summaries[index]);
    setEditingIndex(index);
  };

  const deleteSummary = (index) => {
    const updatedSummaries = summaries.filter((_, i) => i !== index);
    setSummaries(updatedSummaries);
    localStorage.setItem('summaries', JSON.stringify(updatedSummaries));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSummary((prevSummary) => ({
      ...prevSummary,
      [name]: value,
    }));
  };

  const cleanupSummaries = (type) => {
    let updatedSummaries = summaries.filter((summary) => {
      if (type === 'week') return summary.type !== 'day';
      if (type === 'month') return summary.type !== 'week';
      if (type === 'year') return summary.type !== 'month';
      return true;
    });

    setSummaries(updatedSummaries);
    localStorage.setItem('summaries', JSON.stringify(updatedSummaries));
  };

  useEffect(() => {
    if (newSummary.type !== 'day') {
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
        placeholder={t('enterYourSummary')}
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={addOrUpdateSummary}>
        {editingIndex !== null ? t('update') : t('addSummary')}
      </button>
      <table>
        <thead>
          <tr>
            <th>{t('date')}</th>
            <th>{t('resume')}</th>
            <th>{t('summaryType')}</th>
            <th>{t('operations')}</th>
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
