import { useState, useEffect } from 'react';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PageLayout from '../components/layouts/PageLayout';

const StudentCalendarPage = () => {
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '',
        type: 'study'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const eventsRes = await api.get('/events/upcoming', { params: { limit: 20 } });
            if (eventsRes.data.status === 'success' && eventsRes.data.data.length > 0) {
                setCalendarEvents(eventsRes.data.data.map(mapEvent));
            } else {
                setCalendarEvents(getMockEvents());
            }
        } catch (e) {
            setCalendarEvents(getMockEvents());
        } finally {
            setLoading(false);
        }
    };

    const mapEvent = (event) => {
        let dateStr = event.event_date;
        try {
            if (dateStr) {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                }
            }
        } catch (e) { /* ignore */ }

        return {
            id: event.id,
            type: event.event_type,
            title: event.title,
            date: dateStr,
            time: event.event_time ? event.event_time.substring(0, 5) : 'All Day',
            icon: event.icon || '📅',
            description: event.description || 'No additional details.'
        };
    };

    const getMockEvents = () => [
        { id: 1, type: 'study', title: 'Study Group Session', date: 'January 25, 2026', time: '05:27 PM', icon: '⏰', description: 'Group study for Math 101.' },
        { id: 2, type: 'assignment', title: 'Assignment Due: Math 101', date: 'January 26, 2026', time: '11:59 PM', icon: '📝', description: 'Chapter 5 problems.' },
        { id: 3, type: 'exam', title: 'Midterm Exams', date: 'January 30, 2026', time: '09:00 AM', icon: '🎫', description: 'Testing all covered chapters.' },
    ];

    const handleAddEventSubmit = (e) => {
        e.preventDefault();
        const eventToAdd = {
            id: Date.now(),
            title: newEvent.title,
            date: new Date(newEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            time: newEvent.time,
            icon: newEvent.type === 'exam' ? '🎫' : newEvent.type === 'assignment' ? '📝' : '⏰',
            type: newEvent.type,
            description: 'User added event'
        };
        setCalendarEvents([eventToAdd, ...calendarEvents]);
        setShowAddEventModal(false);
        setNewEvent({ title: '', date: '', time: '', type: 'study' });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <PageLayout title="Calendar">
            <div className="p-4 lg:p-10 space-y-10 bg-white">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
                    <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] opacity-50" />
                    <div>
                        <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-2">Temporal Grid</h1>
                        <p className="text-gray-600 text-sm font-bold uppercase tracking-[0.4em] opacity-80">Cycle Schedule & Deployment Matrix</p>
                    </div>
                    <button
                        onClick={() => setShowAddEventModal(true)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl border border-blue-400/30 active:scale-95 flex items-center gap-3"
                    >
                        <span>+</span> Authorize Entry
                    </button>
                </div>

                <div className="bg-gray-50 backdrop-blur-3xl rounded-[48px] p-8 border border-gray-300 shadow-3xl overflow-hidden">
                    <div className="divide-y divide-gray-300">
                        {calendarEvents.length > 0 ? (
                            calendarEvents.map((ev, i) => (
                                <div key={i} className="p-8 hover:bg-gray-100 transition-all flex items-start gap-8 group">
                                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl shadow-inner border border-gray-300 transition-transform group-hover:rotate-6
                                        ${ev.type === 'exam' ? 'bg-red-50 text-red-600' :
                                            ev.type === 'assignment' ? 'bg-indigo-50 text-indigo-600' :
                                                'bg-blue-50 text-blue-600'}`}>
                                        {ev.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="font-black text-xl text-black uppercase tracking-tighter group-hover:text-blue-600 transition-colors uppercase">{ev.title}</h3>
                                            <span className="bg-white text-gray-700 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-gray-300">
                                                {ev.time}
                                            </span>
                                        </div>
                                        <div className="text-gray-600 font-bold text-xs uppercase tracking-widest mt-2 mb-4">
                                            {ev.date}
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                                            "{ev.description}"
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-24 text-center text-gray-600 font-black uppercase tracking-[0.3em]">
                                No active intervals detected.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showAddEventModal && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-xl transition-all duration-500">
                    <div className="bg-slate-900 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] w-full max-w-[400px] border border-white/10 overflow-hidden relative">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                            <h3 className="text-xl font-black text-white tracking-tighter uppercase">Initialize Node</h3>
                            <button onClick={() => setShowAddEventModal(false)} className="text-slate-500 hover:text-white text-3xl font-light transition-colors">×</button>
                        </div>
                        <form onSubmit={handleAddEventSubmit} className="p-10 space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Entity Description</label>
                                <input required type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Target objective..." />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Cycle Date</label>
                                    <input required type="date" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">Phase Time</label>
                                    <input required type="time" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full h-16 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-3xl shadow-3xl shadow-teal-500/20 transition-all active:scale-95">Finalize Entry</button>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </PageLayout>
    );
};

export default StudentCalendarPage;
