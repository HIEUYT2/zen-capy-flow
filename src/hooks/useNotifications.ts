import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

/**
 * useNotifications - handles requesting permission and scheduling
 * streak-about-to-break and task due date reminders via browser Notification API.
 *
 * Session complete and break-over notifications are handled inline in the store's
 * completeSession action for precise timing.
 */
export function useNotifications() {
  const { notificationsEnabled, tasks, currentStreak } = useStore();
  const streakReminderSent = useRef(false);

  // Request notification permission on mount if enabled
  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  // Streak reminder: if user hasn't done a session today by 9 PM, remind
  useEffect(() => {
    if (!notificationsEnabled || streakReminderSent.current) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (currentStreak < 2) return; // Only remind if they have a streak worth keeping

    const checkStreakReminder = () => {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toISOString().split('T')[0];
      const todaySessions = useStore.getState().focusHistory[today] || 0;

      if (hour >= 21 && todaySessions === 0 && !streakReminderSent.current) {
        new Notification('CapyFlow 🦫', {
          body: `Streak ${currentStreak} ngày sắp đứt! Làm 1 phiên để giữ streak nhé 🔥`,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="24" font-size="24">🔥</text></svg>',
        });
        streakReminderSent.current = true;
      }
    };

    // Check every 30 minutes
    const interval = setInterval(checkStreakReminder, 30 * 60 * 1000);
    checkStreakReminder(); // Check immediately

    return () => clearInterval(interval);
  }, [notificationsEnabled, currentStreak]);

  // Task due date reminders
  useEffect(() => {
    if (!notificationsEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const today = new Date().toISOString().split('T')[0];
    const dueTasks = tasks.filter(
      (t) => !t.completed && t.dueDate && t.dueDate === today
    );

    if (dueTasks.length > 0) {
      const lastReminder = localStorage.getItem('capyflow-task-reminder-date');
      if (lastReminder !== today) {
        new Notification('CapyFlow 📋', {
          body: `${dueTasks.length} công việc đến hạn hôm nay!`,
        });
        localStorage.setItem('capyflow-task-reminder-date', today);
      }
    }
  }, [notificationsEnabled, tasks]);
}
