/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

function Sidebar() {
  const { t } = useTranslation();
  return (
    <div className="sidebar">
      <div className="header">
        <h1 className="app-name">Day Manager</h1>
      </div>
      <NavLink to="/routine" activeclassname="active">
        {t("routine")}{" "}
      </NavLink>
      <NavLink to="/freeday" activeclassname="active">
        {t("freeday")}{" "}
      </NavLink>
      <NavLink to="/tasks" activeclassname="active">
        {" "}
        {t("tasks")}{" "}
      </NavLink>
      <NavLink to="/reminders" activeclassname="active">
        {" "}
        {t("calendar")}{" "}
      </NavLink>
      <NavLink to="/resume" activeclassname="active">
        {" "}
        {t("resume")}{" "}
      </NavLink>
      {/*<NavLink to="/activities" activeclassname="active">{t('activity')}</NavLink>*/}
      <NavLink to="/" activeclassname="active">
        {t("settings")}
      </NavLink>
      <div className="footer">
        <p>© 2024 Madick A.C.</p>
      </div>
    </div>
  );
}

export default Sidebar;
