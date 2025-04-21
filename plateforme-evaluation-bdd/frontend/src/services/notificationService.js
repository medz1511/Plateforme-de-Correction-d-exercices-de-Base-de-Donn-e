// src/services/notificationService.js
import API from './api';

export const fetchNotifications = userId =>
  API.get(`/notifications/user/${userId}`);

export const markNotificationRead = id =>
  API.put(`/notifications/${id}/read`);
