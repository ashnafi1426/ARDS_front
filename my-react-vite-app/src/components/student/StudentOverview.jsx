import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GPATrendChart from './GPATrendChart';
import ErrorMessage from '../ErrorMessage';

const StudentOverview = ({ studentData, riskData, onRefresh }) => {
    const navigate = useNavigate();
    const [showSelfCheckModal, setShowSelfCheckModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);

    // Mock data for immediate operational status
    const getMockEvents = () => [
        { id: 1, type: 'study', title: 'Study Group Session', date: 'Jan 25', time: '05:27 PM', icon: '⏰' },
        { id: 2, type: 'assignment', title: 'Assignment Due: Math 101', date: 'Jan 26', time: '3 days', icon: '📝' },
        { id: 3, type: 'exam', title: 'Midterm Exams', date: 'Jan 30', time: '09:00 AM', icon: '🎫' }
    ];

    useEffect(() => {
        setCalendarEvents(getMockEvents());
    }, []);

    const currentRisk = studentData?.currentRiskLevel || 'low';
    const riskColor = currentRisk === 'high' ? 'bg-red-600/20 text-red-400 border-red-500/30' : currentRisk === 'medium' ? 'bg-orange-600/20 text-orange-400 border-orange-500/30' : 'bg-green-600/20 text-green-400 border-green-500/30';
    const riskTitle = currentRisk === 'high' ? 'Critical Alpha' : currentRisk === 'medium' ? 'Medium Warning' : 'Safe Baseline';

    return (
        <div className="min-h-screen bg-[#1e1b4b] p-4 lg:p-10 space-y-10">
            {/* Dynamic Executive Header */}
            <div className="relative mb-12">
                <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-teal-500 rounded-full shadow-[0_0_20px_#14b8a6] opacity-50" />
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Welcome, {studentData?.firstName || 'Student'}</h1>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.4em] opacity-80 mt-2">Personal Academic Performance Telemetry</p>
            </div>

            {/* Intelligence Matrix Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Risk Node */}
                <div className={`backdrop-blur-3xl rounded-[40px] p-10 border ${riskColor} shadow-3xl relative overflow-hidden group`}>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center text-3xl shadow-inner border border-white/[0.03]">
                            🛡️
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{riskTitle}</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Current Sector Health</p>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/[0.02] rounded-full group-hover:bg-white/[0.05] transition-all" />
                </div>

                {/* Performance Node (GPA) */}
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/5 shadow-3xl relative overflow-hidden group">
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center text-3xl shadow-inner border border-white/[0.03] text-indigo-400">
                            🎓
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter">{studentData?.gpa?.toFixed(2) || '3.20'}</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Accumulated Perf IQ</p>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/[0.02] rounded-full group-hover:scale-110 transition-all" />
                </div>

                {/* Engagement Node (Attendance) */}
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/5 shadow-3xl relative overflow-hidden group">
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center text-3xl shadow-inner border border-white/[0.03] text-teal-400">
                            📊
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter">{studentData?.attendance || 100}%</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">System Engagement Ratio</p>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-teal-500/[0.02] rounded-full group-hover:scale-110 transition-all" />
                </div>
            </div>

            {/* Strategy Hub Tabs */}
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[32px] p-4 border border-white/5 shadow-3xl flex gap-4 overflow-x-auto items-center">
                <button className="px-8 py-3 bg-teal-600 border border-teal-400 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl scale-105 transition-all">Overview Hub</button>
                <button onClick={() => navigate('/student/self-check')} className="px-8 py-3 bg-white/5 border border-white/5 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Self-Assessment</button>
                <button onClick={() => navigate('/student/notifications')} className="px-8 py-3 bg-white/5 border border-white/5 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Risk Reports</button>
                <button onClick={() => navigate('/student/profile')} className="px-8 py-3 bg-white/5 border border-white/5 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Identity Registry</button>
                <button onClick={() => navigate('/student/help')} className="px-8 py-3 bg-white/5 border border-white/5 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all">Guideline Portal</button>
            </div>

            {/* Achievement Matrix & Compliance Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-8 border border-white/5 shadow-3xl flex items-center gap-8">
                    <div className="hidden sm:block">
                        <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-2 text-center">Current Rank</div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 p-1">
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl shadow-inner">💎</div>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <BadgeNode icon="🎯" label="Consistent Assess" active={true} />
                        <BadgeNode icon="📚" label="Knowledge Seeker" active={true} />
                        <BadgeNode icon="🔥" label="7 Day Streak" active={false} />
                        <BadgeNode icon="🛡️" label="Risk Deflector" active={true} />
                    </div>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-8 border border-white/5 shadow-3xl flex flex-col justify-center text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Compliance Status</div>
                    <div className="text-3xl font-black text-emerald-400 tracking-tighter">100%</div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase mt-1">All Quotas Met</div>
                </div>
            </div>

            {/* Primary Data Experience Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Analytic Curves (Left Column) */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/5 shadow-3xl">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Academic Performance IQ Curve</h3>
                            <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest bg-teal-500/5 px-4 py-2 rounded-xl border border-teal-500/20">6 Month Cycle</span>
                        </div>
                        <GPATrendChart studentId={studentData?.id} riskData={riskData} />
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/5 shadow-3xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Actionable Intelligence</h3>
                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest bg-teal-500/5 px-4 py-2 rounded-xl border border-teal-500/20">Advisor Recommendations</span>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <RecommendationCard
                                title="Engage Social Support"
                                desc="Based on your recent stress scores, we recommend attending the Peer Mentor session this Thursday."
                                icon="🤝"
                            />
                            <RecommendationCard
                                title="Optimize Study Windows"
                                desc="Your engagement velocity is highest in early mornings. Shift core assignments to 8 AM - 10 AM."
                                icon="⚡"
                            />
                        </div>
                        <div className="absolute -left-20 -top-20 w-64 h-64 bg-teal-500/[0.03] blur-[80px]" />
                    </div>
                </div>

                {/* Tactical Modules (Right Column) */}
                <div className="space-y-10">
                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/5 shadow-3xl">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Quick Protocols</h3>
                        <div className="space-y-4">
                            <ProtocolButton onClick={() => navigate('/student/self-check')} icon="📝" label="Submit Weekly telemetry" accent="teal" />
                            <ProtocolButton onClick={() => navigate('/student/profile')} icon="👤" label="Access Identity Registry" accent="indigo" />
                            <ProtocolButton onClick={() => navigate('/student/schedule-meeting')} icon="👨‍🏫" label="Open advisor Comms" accent="orange" />
                            <ProtocolButton onClick={() => {
                                alert('Generating Forensic Telemetry Package...');
                                setTimeout(() => alert('Data Export Protocol Complete: academic_report_v1.zip downloaded.'), 1000);
                            }} icon="📥" label="Export Forensic Data" accent="blue" />
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/5 shadow-3xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Intel Feed</h3>
                            <button onClick={() => navigate('/student/notifications')} className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">View All Cache</button>
                        </div>
                        <div className="p-8 bg-red-500/5 rounded-3xl border border-red-500/10 flex items-center gap-4">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="text-xs text-red-400 font-black uppercase tracking-widest">Registry Latency</p>
                                <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Zero active intel packets detected.</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-600/[0.02] blur-[80px] pointer-events-none" />
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/5 shadow-3xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Temporal Grid</h3>
                            <button className="h-8 px-4 bg-teal-600/10 hover:bg-teal-600 text-teal-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-teal-500/20">+</button>
                        </div>
                        <div className="space-y-6">
                            {calendarEvents.map((ev, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] p-2 rounded-2xl transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[18px] bg-slate-950 flex items-center justify-center text-xl shadow-inner border border-white/[0.03] group-hover:scale-110 transition-transform">
                                            {ev.icon}
                                        </div>
                                        <div>
                                            <div className="font-black text-xs text-white uppercase tracking-tight group-hover:text-teal-400 transition-colors">{ev.title}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{ev.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-[9px] font-black bg-slate-950 px-3 py-1.5 rounded-xl text-slate-400 border border-white/5 group-hover:border-teal-500/30 group-hover:text-white transition-all">{ev.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Components matching elite UI suite
const BadgeNode = ({ icon, label, active }) => (
    <div className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${active ? 'bg-teal-500/10 border-teal-500/30' : 'bg-slate-950 border-white/5 grayscale opacity-40'}`}>
        <span className="text-2xl">{icon}</span>
        <span className={`text-[8px] font-black uppercase tracking-tighter text-center ${active ? 'text-teal-400' : 'text-slate-600'}`}>{label}</span>
    </div>
);

const RecommendationCard = ({ title, desc, icon }) => (
    <div className="bg-slate-950/40 p-6 rounded-[32px] border border-white/5 flex items-start gap-6 group hover:bg-slate-950 transition-all cursor-pointer">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex-shrink-0 flex items-center justify-center text-2xl border border-teal-500/20 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <h4 className="text-xs font-black text-white uppercase tracking-tight mb-2 group-hover:text-teal-400 transition-colors">{title}</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">{desc}</p>
        </div>
    </div>
);

const ProtocolButton = ({ onClick, icon, label, accent }) => {
    const themes = {
        teal: 'bg-teal-500/10 hover:bg-teal-600 text-teal-400 hover:text-white border-teal-500/20 hover:border-teal-400',
        indigo: 'bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border-indigo-500/20 hover:border-indigo-400',
        orange: 'bg-orange-500/10 hover:bg-orange-600 text-orange-400 hover:text-white border-orange-500/20 hover:border-orange-400',
        blue: 'bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white border-blue-500/20 hover:border-blue-400'
    };

    return (
        <button onClick={onClick} className={`w-full p-5 rounded-3xl flex items-center gap-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border duration-500 shadow-xl group active:scale-[0.98] ${themes[accent]}`}>
            <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{icon}</span>
            {label}
        </button>
    );
};

export default StudentOverview;
