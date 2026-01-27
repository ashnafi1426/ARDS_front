import { useState } from 'react';
import AdvisorLayout from '../components/layouts/AdvisorLayout';

const AdvisorHelpPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      icon: '🚀',
      content: (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Welcome to the Advisor Portal</h2>
          <p className="text-slate-400 leading-relaxed mb-6">This guide will help you navigate and use the Academic Risk Detection System effectively through our new high-fidelity interface.</p>

          <h3 className="text-lg font-bold text-indigo-400 mb-3 uppercase tracking-widest">Quick Start Commands</h3>
          <ul className="space-y-3 text-slate-300">
            <li><strong className="text-white">Dashboard:</strong> Real-time telemetry and risk distribution matrix.</li>
            <li><strong className="text-white">Students:</strong> Centralized student entity management and roster.</li>
            <li><strong className="text-white">Reports:</strong> High-density data analytics and CSV auditing.</li>
            <li><strong className="text-white">Interventions:</strong> Case-by-case academic support strategy builder.</li>
            <li><strong className="text-white">Notifications:</strong> Critical system alerts and risk updates.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: '🏠 Dashboard',
      icon: '🏠',
      content: (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Understanding the Intelligence Hub</h2>

          <h3 className="text-lg font-bold text-indigo-400 mb-3 uppercase tracking-widest">Statistics Matrix</h3>
          <p className="text-slate-400 mb-4">The header matrix displays real-time student health clusters:</p>
          <ul className="space-y-2 text-slate-300">
            <li><strong className="text-red-500">Critical:</strong> Priority 1 cases requiring immediate authorization.</li>
            <li><strong className="text-orange-500">High:</strong> Operational hazards showing significant performance decline.</li>
            <li><strong className="text-white">Status IQ:</strong> GPA and Attendance averages across your cohort.</li>
          </ul>

          <h3 className="text-lg font-bold text-indigo-400 mt-6 mb-3 uppercase tracking-widest">Student Roster</h3>
          <p className="text-slate-400">Entities are prioritized by risk gradient. Click any node to view performance telemetry.</p>
        </div>
      )
    },
    {
      id: 'students',
      title: '👥 Roster Management',
      icon: '👥',
      content: (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Entity Roster Controls</h2>

          <h3 className="text-lg font-bold text-indigo-400 mb-3 uppercase tracking-widest">Strategy Plane</h3>
          <p className="text-slate-400 mb-4">The Student Portfolio provides advanced search and filtering protocols:</p>
          <ul className="space-y-2 text-slate-300">
            <li><strong className="text-white">ID Identify:</strong> Find entities by system UUID or name.</li>
            <li><strong className="text-white">Gradient Filter:</strong> Isolate specific risk segments.</li>
            <li><strong className="text-white">Metric Sort:</strong> Order by GPA IQ or Engagement ratio.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'risk-levels',
      title: '🚨 Risk Logic',
      icon: '🚨',
      content: (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">System Risk Logics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
              <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-2">Critical Alpha</h4>
              <p className="text-xs text-slate-400">Triggered by GPA &lt; 2.0 or Attendance &lt; 60%. Highly unstable entity.</p>
            </div>
            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
              <h4 className="text-orange-400 font-black uppercase text-xs tracking-widest mb-2">High Alert</h4>
              <p className="text-xs text-slate-400">GPA 2.0-2.5. Requires scheduled intervention within 7 days.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interventions',
      title: '📝 Support Strategy',
      icon: '📝',
      content: (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Strategy Building</h2>

          <h3 className="text-lg font-bold text-indigo-400 mb-3 uppercase tracking-widest">Authorized Protocols</h3>
          <ul className="space-y-3 text-slate-300">
            <li><strong className="text-white">Academic Node:</strong> Specialized tutoring and resource allocation.</li>
            <li><strong className="text-white">Counseling Bridge:</strong> Support for socio-economic or mental stressors.</li>
            <li><strong className="text-white">Advisor Node:</strong> Direct tactical meetings to resolve barriers.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'reports',
      title: '📊 Audit & Analytics',
      icon: '📊',
      content: (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Performance Auditing</h2>

          <h3 className="text-lg font-bold text-indigo-400 mb-3 uppercase tracking-widest">Data Extraction</h3>
          <p className="text-slate-400 mb-6">Use the Performance Audit hub to extract CSV analytics for administrative review.</p>

          <div className="p-6 bg-slate-950/50 border border-indigo-500/20 rounded-3xl">
            <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">Export Protocol: CSV / Excel / PDF System Standard</p>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: '❓ Protocols FAQ',
      icon: '❓',
      content: (
        <div className="prose prose-invert max-w-none space-y-6">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Core Protocols FAQ</h2>

          <div>
            <h4 className="text-white font-bold mb-1">How often does telemetry update?</h4>
            <p className="text-slate-400 text-sm">Student Performance data is re-calculated daily based on the latest academic inputs.</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-1">Are assessments retroactive?</h4>
            <p className="text-slate-400 text-sm">Yes, historical risk logs are maintained to show performance trends over the semester cycles.</p>
          </div>
        </div>
      )
    },
    {
      id: 'support',
      title: '💬 System Support',
      icon: '💬',
      content: (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Technical Assistance</h2>

          <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Support Email</span>
              <span className="text-white font-bold">ops@academic-risk.edu</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Emergency Line</span>
              <span className="text-red-400 font-bold">+251-XXX-XXX-XXX</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const activeContent = sections.find(s => s.id === activeSection);

  return (
    <AdvisorLayout>
      <div className="min-h-screen bg-[#020617] p-4 lg:p-10 space-y-10">
        {/* Header */}
        <div className="relative">
          <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] opacity-50" />
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Help Center</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.4em] opacity-80">Documentation & System Protocols</p>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-6 border border-white/5 shadow-3xl sticky top-28">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 px-4">Registry Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-left
                      ${activeSection === section.id
                        ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-400/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }
                    `}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="text-xs font-black uppercase tracking-widest truncate">
                      {section.title.replace(/^[^\s]+\s/, '')}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Documentation Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/20 backdrop-blur-3xl rounded-[48px] p-10 lg:p-16 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-[600px]">
              {/* Header Icon Decoration */}
              <div className="absolute -right-10 -top-10 text-[200px] opacity-[0.03] select-none pointer-events-none rotate-12">
                {activeContent?.icon}
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-[32px] flex items-center justify-center text-4xl mb-10 border border-indigo-500/20 shadow-inner">
                  {activeContent?.icon}
                </div>
                {activeContent?.content}
              </div>

              {/* Ambient Mesh Gradient */}
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </AdvisorLayout>
  );
};

export default AdvisorHelpPage;
