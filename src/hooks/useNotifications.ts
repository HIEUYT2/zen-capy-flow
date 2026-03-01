import { useEffect } from 'react';
import { useStore } from '../store/useStore';

const LS_KEYS = {
  taskToday: 'capyflow-reminder-task-today',
  taskTomorrow: 'capyflow-reminder-task-tomorrow',
  streak: 'capyflow-reminder-streak',
  review: 'capyflow-reminder-review',
};

function sendBrowserNotification(title: string, body: string, tag: string) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  new Notification(title, { body, tag });
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseYMD(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function dayDiffFromToday(targetDate: string) {
  const now = startOfDay(new Date());
  const target = startOfDay(parseYMD(targetDate));
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

export function useNotifications() {
  const { notificationsEnabled, tasks, currentStreak, focusHistory, addToast } = useStore();

  useEffect(() => {
    if (!notificationsEnabled || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkReminders = () => {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toISOString().split('T')[0];
      const todaySessions = focusHistory[today] || 0;

      const dueToday = tasks.filter((task) => !task.completed && task.dueDate && dayDiffFromToday(task.dueDate) === 0);
      const dueTomorrow = tasks.filter((task) => !task.completed && task.dueDate && dayDiffFromToday(task.dueDate) === 1);

      if (dueToday.length > 0 && localStorage.getItem(LS_KEYS.taskToday) !== today) {
        sendBrowserNotification('CapyFlow 📋', `${dueToday.length} task đến hạn hôm nay.`, `task-${today}`);
        addToast({
          emoji: '📌',
          message: `Hôm nay có ${dueToday.length} task đến hạn.`,
          duration: 3800,
        });
        localStorage.setItem(LS_KEYS.taskToday, today);
      }

      if (hour >= 19 && dueTomorrow.length > 0 && localStorage.getItem(LS_KEYS.taskTomorrow) !== today) {
        sendBrowserNotification(
          'CapyFlow ⏳',
          `${dueTomorrow.length} task đến hạn ngày mai. Chuẩn bị nhẹ từ tối nay nhé.`,
          `task-next-${today}`,
        );
        addToast({
          emoji: '⏳',
          message: `${dueTomorrow.length} task sẽ đến hạn ngày mai.`,
          duration: 3800,
        });
        localStorage.setItem(LS_KEYS.taskTomorrow, today);
      }

      if (hour >= 21 && todaySessions === 0 && currentStreak >= 2 && localStorage.getItem(LS_KEYS.streak) !== today) {
        sendBrowserNotification(
          'CapyFlow 🔥',
          `Streak ${currentStreak} ngày đang nguy hiểm. Làm 1 phiên ngắn để giữ nhịp.`,
          `streak-${today}`,
        );
        addToast({
          emoji: '🔥',
          message: `Streak ${currentStreak} ngày sắp đứt, làm 1 phiên ngắn nhé.`,
          duration: 4200,
        });
        localStorage.setItem(LS_KEYS.streak, today);
      }

      if (hour >= 20 && todaySessions > 0 && localStorage.getItem(LS_KEYS.review) !== today) {
        addToast({
          emoji: '🌙',
          message: 'Đến giờ tổng kết ngày học. Mở Daily Review nhé.',
          duration: 3800,
        });
        localStorage.setItem(LS_KEYS.review, today);
      }
    };

    checkReminders();
    const interval = window.setInterval(checkReminders, 15 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [notificationsEnabled, tasks, currentStreak, focusHistory, addToast]);
}
