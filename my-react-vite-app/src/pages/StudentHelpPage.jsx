import { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const StudentHelpPage = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const faqs = [
        {
            question: "How is my Risk Level calculated?",
            answer: "Your Risk Level is calculated based on your GPA, Attendance, and weekly Self-Check submissions. If your GPA drops below 2.0 or attendance below 80%, your risk level may increase to 'High'."
        },
        {
            question: "How do I schedule a meeting with my advisor?",
            answer: "Go to your Dashboard and click 'Schedule Advisor Meeting' in the Recommended Actions card, or navigate directly via the 'Schedule Meeting' page from the dashboard buttons."
        },
        {
            question: "Can I edit my profile information?",
            answer: "Yes. Navigate to the 'Profile' section, click the 'Edit Profile' button. You can update your Name, Email, Program, Year, and GPA."
        },
        {
            question: "What should I do if my risk is HIGH?",
            answer: "Don't panic! A High Risk status is an alert to help you. We recommend scheduling an immediate meeting with your advisor and utilizing the Study Resources provided in the portal."
        },
        {
            question: "How do I upload a resource?",
            answer: "Go to the 'Academic Resources' page and click the '+ Add Resource' button at the top right. You can upload PDFs, Videos, or links."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <DashboardLayout>
            <div className="p-4 lg:p-10 space-y-10 bg-white">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Intelligence Header */}
                <div className="relative">
                    <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] opacity-50" />
                    <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-2">Support Center</h1>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-[0.4em] opacity-80">Knowledge Base & Tactical Support Request</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* FAQ Section */}
                    <div className="bg-gray-50 backdrop-blur-3xl rounded-[48px] p-10 border border-gray-300 shadow-3xl">
                        <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-10">Protocols FAQ</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white border border-gray-300 rounded-3xl overflow-hidden transition-all group hover:border-blue-500/20">
                                    <button
                                        className="w-full flex justify-between items-center p-6 hover:bg-gray-100 transition-colors text-left"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <span className="font-black text-xs text-gray-700 uppercase tracking-tight group-hover:text-black transition-colors">{faq.question}</span>
                                        <svg
                                            className={`w-6 h-6 text-blue-600 transform transition-transform duration-500 ${openFaq === index ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFaq === index && (
                                        <div className="p-8 bg-gray-100 text-gray-700 text-sm font-bold leading-relaxed border-t border-gray-300 italic animate-in slide-in-from-top-4 duration-500">
                                            "{faq.answer}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact & Support Section */}
                    <div className="space-y-10">
                        {/* Contact Support Card */}
                        <div className="bg-gray-50 backdrop-blur-3xl rounded-[48px] p-10 border border-gray-300 shadow-3xl">
                            <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-4">Support Channels</h2>
                            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 opacity-60">Authorize direct transmission to operational support.</p>

                            <div className="space-y-6">
                                <SupportChannel icon="📧" label="Protocol Email" value="support@academyrisk.edu" color="indigo" />
                                <SupportChannel icon="📱" label="Secure Line" value="+251-XXX-XXX-XXX" color="blue" />
                                <SupportChannel icon="📍" label="Physical Station" value="Student Hub, Sector 04" color="purple" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-[48px] p-12 text-center border border-blue-300 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-gray-300 group-hover:scale-110 transition-transform duration-700">
                                    <span className="text-4xl">👨‍🏫</span>
                                </div>
                                <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-3">Advisor Bridge</h3>
                                <p className="text-gray-700 text-xs font-bold uppercase tracking-widest mb-10 opacity-70">Initialize direct comms with your academic case manager.</p>
                                <button
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-[0.4em] rounded-[24px] shadow-3xl shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    Schedule Node Session
                                </button>
                            </div>
                            <div className="absolute inset-0 bg-blue-600/[0.02] blur-[100px] pointer-events-none" />
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const SupportChannel = ({ icon, label, value, color }) => {
    const themes = {
        indigo: 'bg-indigo-50 border-indigo-300 text-indigo-600',
        blue: 'bg-blue-50 border-blue-300 text-blue-600',
        purple: 'bg-purple-50 border-purple-300 text-purple-600'
    };

    return (
        <div className={`flex items-center gap-6 p-6 rounded-[32px] border group transition-all hover:bg-gray-100 ${themes[color]}`}>
            <div className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-3xl shadow-inner border border-gray-300">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">{label}</p>
                <p className="font-black text-black uppercase tracking-tight group-hover:text-black transition-colors">{value}</p>
            </div>
        </div>
    );
};

export default StudentHelpPage;
