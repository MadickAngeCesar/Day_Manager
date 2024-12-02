/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.css'

function Activities() {
  const { t } = useTranslation()
  const [activities, setActivities] = useState([])
  const [newActivity, setNewActivity] = useState({
    title: '',
    time: '',
    file: null
  })
  const [editingIndex, setEditingIndex] = useState(null)
  const [notificationPermission, setNotificationPermission] = useState('default')

  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activities')) || []
    setActivities(savedActivities)
    requestNotificationPermission()
  }, [])

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)
  }

  const addOrUpdateActivity = async () => {
    try {
      if (!newActivity.title || !newActivity.time || !newActivity.file) {
        alert('Please enter title, time, and upload a file.')
        return
      }

      const existingActivity = activities.find((activity) => activity.title === newActivity.title)
      if (existingActivity && editingIndex === null) {
        alert(`Activity with title "${newActivity.title}" already exists.`)
        return
      }

      let updatedActivities = [...activities]
      if (editingIndex !== null) {
        updatedActivities[editingIndex] = newActivity
      } else {
        updatedActivities.push(newActivity)
      }

      setActivities(updatedActivities)
      localStorage.setItem('activities', JSON.stringify(updatedActivities))

      if (newActivity.file) {
        await uploadMediaFile(newActivity.file)
      }

      setNewActivity({ title: '', time: '', file: null })
      setEditingIndex(null)
    } catch (error) {
      console.error('Error adding or updating activity:', error)
    }
  }

  const deleteActivity = async (index) => {
    const activityToDelete = activities[index]
    const updatedActivities = activities.filter((_, i) => i !== index)
    setActivities(updatedActivities)
    localStorage.setItem('activities', JSON.stringify(updatedActivities))

    if (activityToDelete.file) {
      await deleteMediaFile(activityToDelete.file.name)
    }
  }

  const uploadMediaFile = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload media file.')
      }

      console.log('Media file uploaded successfully.')
    } catch (error) {
      console.error('Error uploading media file:', error)
    }
  }

  const deleteMediaFile = async (filename) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${filename}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete media file.')
      }

      console.log('Media file deleted successfully.')
    } catch (error) {
      console.error('Error deleting media file:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'file') {
      setNewActivity({
        ...newActivity,
        file: files[0]
      })
    } else {
      setNewActivity({
        ...newActivity,
        [name]: value
      })
    }
  }

  const previewActivity = (filename) => {
    window.open(`http://localhost:5000/media/${encodeURIComponent(filename)}`, '_blank')
  }

  const editActivity = (index) => {
    setNewActivity(activities[index])
    setEditingIndex(index)
  }

  const scheduleNotification = (activity) => {
    const [hours, minutes] = activity.time.split(':')
    const notificationTime = new Date()
    notificationTime.setHours(hours)
    notificationTime.setMinutes(minutes)
    notificationTime.setSeconds(0)

    const now = new Date()
    const timeUntilNotification = notificationTime - now

    if (timeUntilNotification > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          const title = 'Activity Reminder'
          const options = {
            body: `Don't forget your activity: ${activity.title}`,
            icon: '/logo.png'
          }
          new Notification(title, options)
        }
      }, timeUntilNotification)
    }
  }

  useEffect(() => {
    activities.forEach(scheduleNotification)
  }, [activities])

  return (
    <div className="activities">
      <h2>{t('activitiesDescription')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('title')}</th>
            <th>{t('time')}</th>
            <th>{t('preview')}</th>
            <th>{t('operations')}</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.title}</td>
              <td>{activity.time}</td>
              <td>
                {activity.file && (
                  <button onClick={() => previewActivity(activity.file.name)}>
                    {t('preview')}
                  </button>
                )}
              </td>
              <td>
                <button onClick={() => editActivity(index)}>{t('edit')}</button>
                <button onClick={() => deleteActivity(index)}>{t('delete')}</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                name="title"
                value={newActivity.title}
                onChange={handleInputChange}
                placeholder={t('activityTitle')}
              />
            </td>
            <td>
              <input
                type="time"
                name="time"
                value={newActivity.time}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input type="file" name="file" onChange={handleInputChange} />
            </td>
            <td>
              <button onClick={addOrUpdateActivity}>
                {editingIndex !== null ? t('updateActivity') : t('addActivity')}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Activities
