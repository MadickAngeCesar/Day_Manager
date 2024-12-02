/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../App.css";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const saveSetting = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving setting to localStorage:", error);
  }
};

const loadSetting = (key, defaultValue) => {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue !== null ? JSON.parse(savedValue) : defaultValue;
  } catch (error) {
    console.error("Error loading setting from localStorage:", error);
    return defaultValue;
  }
};

function SettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(() => ({
    language: loadSetting("language", "en"),
    darkMode: loadSetting("darkMode", false),
    textSize: loadSetting("textSize", "medium"),
    autoLaunch: loadSetting("autoLaunchEnabled", false),
  }));

  const updateSetting = (key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  useEffect(() => {
    saveSetting("language", settings.language);
    i18n.changeLanguage(settings.language);
  }, [settings.language]);

  useEffect(() => {
    saveSetting("darkMode", settings.darkMode);
    document.body.classList.toggle("dark-mode", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    saveSetting("autoLaunchEnabled", settings.autoLaunch);
  }, [settings.autoLaunch]);

  useEffect(() => {
    saveSetting("textSize", settings.textSize);
    const rootElement = document.documentElement;
    rootElement.style.fontSize =
      settings.textSize === "small"
        ? "14px"
        : settings.textSize === "large"
        ? "18px"
        : "16px";
  }, [settings.textSize]);

  return (
    <div className="settings">
      <h2 className="settings-title">{t("settings")}</h2>
      <div className="settings-content">
        <div className="setting-item">
          <span className="setting-label">{t("darkMode")}:</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => updateSetting("darkMode", !settings.darkMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">{t("autoLaunch")}:</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.autoLaunch}
              onChange={() => updateSetting("autoLaunch", !settings.autoLaunch)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">{t("textSize")}:</span>
          <select
            className="setting-select"
            value={settings.textSize}
            onChange={(e) => updateSetting("textSize", e.target.value)}
          >
            <option value="small">{t("small")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="large">{t("large")}</option>
          </select>
        </div>
        <div className="setting-item">
          <span className="setting-label">{t("language")}:</span>
          <select
            className="setting-select"
            value={settings.language}
            onChange={(e) => updateSetting("language", e.target.value)}
          >
            <option value="fr">{t("french")}</option>
            <option value="en">{t("english")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
