import { useState, useEffect } from 'react';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import PageLayout from '../components/layouts/PageLayout';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const isAdvisor = user?.role === 'advisor';

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      let data = [];
      if (res.data.status === 'success' && res.data.data) {
        data = res.data.data.notifications || [];
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data.notifications) {
        data = res.data.notifications;
      }

      if (filter === 'unread') {
        data = data.filter(n => !(n.is_read || n.isRead));
      } else if (filter === 'read') {
        data = data.filter(n => (n.is_read || n.isRead));
      }
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      const mockNotifications = [
        {
          id: 1,
          title: 'Welcome to the Portal',
          message: 'You have successfully logged in to the Academic Risk Detection System.',
          type: 'info',
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Risk Alert',
          message: 'Your risk assessment shows a medium risk level. Please review your academic performance.',
          type: 'risk_alert',
          is_read: false,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      let filteredMock = mockNotifications;
      if (filter === 'unread') filteredMock = mockNotifications.filter(n => !n.is_read);
      else if (filter === 'read') filteredMock = mockNotifications.filter(n => n.is_read);
      setNotifications(filteredMock);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) { console.error(error); }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (error) { console.error(error); }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) { console.error(error); }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      risk_alert: '🚨',
      assignment: '📝',
      success: '✅',
      info: 'ℹ️',
      system: '⚙️'
    };
    return <span className="text-2xl">{icons[type] || '🔔'}</span>;
  };

  const getNotificationColor = (type) => {
    const colors = {
      risk_alert: 'border-red-500 bg-red-500/10 text-red-400',
      assignment: 'border-blue-500 bg-blue-500/10 text-blue-400',
      success: 'border-green-500 bg-green-500/10 text-green-400',
      info: 'border-indigo-500 bg-indigo-500/10 text-indigo-400',
      system: 'border-slate-500 bg-slate-500/10 text-slate-400'
    };
    return colors[type] || colors.info;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <PageLayout title="Notifications">
      <div className={`p-4 lg:p-10 space-y-10 bg-white`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-indigo-600 rounded-full shadow-[0_0_20px_#4f46e5] opacity-50" />
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-2 text-black">Alert Registry</h1>
          <p className="text-sm font-bold uppercase tracking-[0.4em] opacity-80 text-gray-600">System Communication Logs & Status Updates</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl border active:scale-95 bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/30"
        >
          Authorize All Read
        </button>
      </div>

      <div className="backdrop-blur-3xl rounded-[40px] p-8 border shadow-3xl flex items-center gap-4 bg-gray-50 border-gray-300">
        {['all', 'unread', 'read'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filter === t
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl scale-105'
              : 'bg-white border-gray-300 text-black hover:bg-gray-100'
              }`}
          >
            {t} Nodes
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {notifications.length === 0 ? (
          <div className="rounded-[64px] p-24 border border-dashed text-center bg-gray-50 border-gray-300">
            <div className="text-6xl mb-6 opacity-30">📭</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-700">Registry Empty</h3>
            <p className="text-gray-600 text-xs font-black uppercase tracking-[0.3em] mt-2">Zero active communication logs found for this sector.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isRead = notif.is_read || notif.isRead;
            const colorStyle = getNotificationColor(notif.type || notif.notification_type);

            return (
              <div
                key={notif.id}
                className="backdrop-blur-3xl rounded-[40px] p-8 border transition-all duration-500 group relative overflow-hidden bg-gray-50 border-gray-300 hover:bg-white hover:border-indigo-500/30"
              >
                <div className="flex items-start gap-8 relative z-10">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg border transition-transform duration-700 group-hover:rotate-6 bg-white border-gray-300">
                    {getNotificationIcon(notif.type || notif.notification_type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <h3 className="font-black text-xl tracking-tighter uppercase text-black group-hover:text-indigo-600">
                        {notif.title}
                        {!isRead && <span className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black tracking-[0.2em] shadow-lg animate-pulse">Unprocessed</span>}
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                        {new Date(notif.created_at || notif.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-base leading-relaxed font-bold mb-8 text-gray-700 opacity-80 group-hover:text-black">
                      {notif.message}
                    </p>

                    <div className="flex gap-3">
                      {!isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border group-hover:bg-red-500/10 bg-white border-gray-300 text-red-600 hover:text-red-700 hover:border-red-500/30"
                      >
                        Purge Log
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/[0.01] pointer-events-none" />
              </div>
            );
          })
        )}
      </div>
      </div>
    </PageLayout>
  );
};

export default NotificationsPage;
