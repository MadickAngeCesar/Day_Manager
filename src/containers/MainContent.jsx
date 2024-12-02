/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import '../App.css'

const Routines = React.lazy(() => import('../components/Routines'))
const Freeday = React.lazy(() => import('../components/Freeday'))
const Tasks = React.lazy(() => import('../components/Tasks'))
const Reminders = React.lazy(() => import('../components/Reminders'))
const Resume = React.lazy(() => import('../components/Resume'))
const SettingsPage = React.lazy(() => import('../components/Settings'))
// const Activities = React.lazy(() => import('../components/Activities'));

function MainContent() {
  return (
    <div className="main-content">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/routine" element={<Routines />} />
          <Route path="/freeday" element={<Freeday />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/resume" element={<Resume />} />
          {/*<Route path="/activities" element={<Activities />} />*/}
          <Route path="/" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default MainContent
