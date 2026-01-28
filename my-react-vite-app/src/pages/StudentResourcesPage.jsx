import { useState, useEffect } from 'react';
import PageLayout from '../components/layouts/PageLayout';

const StudentResourcesPage = () => {
    const [resources, setResources] = useState([
        {
            id: 1,
            title: 'Student Handbook 2025-2026',
            description: 'Complete guide to campus life, academic policies, and student rights.',
            type: 'pdf',
            link: '#',
            isExample: true
        },
        {
            id: 2,
            title: 'Study Skills Workshop',
            description: 'Video series on effective time management and note-taking strategies.',
            type: 'video',
            link: '#',
            isExample: true
        },
        {
            id: 3,
            title: 'Tutoring Center Schedule',
            description: 'Walk-in hours for Math, Science, and Writing labs.',
            type: 'link',
            link: '#',
            isExample: true
        }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', description: '', type: 'pdf', file: null, url: '' });

    useEffect(() => {
        return () => {
            resources.forEach(res => {
                if (res.isBlob) {
                    URL.revokeObjectURL(res.link);
                }
            });
        };
    }, [resources]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024 * 1024) {
                alert('File is too large. Max size is 10GB.');
                e.target.value = '';
                return;
            }
            setNewResource({ ...newResource, file: file });
        }
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        let resourceLink = '#';
        let isBlob = false;
        if (newResource.type === 'link') {
            resourceLink = newResource.url;
        } else if (newResource.file) {
            resourceLink = URL.createObjectURL(newResource.file);
            isBlob = true;
        }

        const added = {
            id: Date.now(),
            title: newResource.title,
            description: newResource.description,
            type: newResource.type,
            link: resourceLink,
            isBlob: isBlob,
            dateAdded: new Date().toLocaleDateString()
        };

        setResources([added, ...resources]);
        setShowAddForm(false);
        setNewResource({ title: '', description: '', type: 'pdf', file: null, url: '' });
        alert('Resource uploaded successfully!');
    };

    const handleOpen = (res) => {
        if (res.link && res.link !== '#') {
            window.open(res.link, '_blank');
        } else {
            alert('Example resource: Logic restricted in mock environment.');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Purge this resource?')) {
            setResources(resources.filter(r => r.id !== id));
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'pdf': return '📄';
            case 'video': return '🎥';
            case 'image': return '🖼️';
            default: return '🔗';
        }
    };

    return (
        <PageLayout title="Resources">
            <div className="p-4 lg:p-10 space-y-10 bg-white">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                    <div className="absolute -left-10 bottom-0 w-1.5 h-full bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] opacity-50" />
                    <div>
                        <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-2">Knowledge Registry</h1>
                        <p className="text-gray-600 text-sm font-bold uppercase tracking-[0.4em] opacity-80">Institutional Resources & Investigative Assets</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl border border-blue-400/30 active:scale-95 flex items-center gap-3"
                    >
                        <span>+</span> Upload Asset
                    </button>
                </div>

                {showAddForm && (
                    <div className="bg-slate-900 border border-white/10 p-10 rounded-[48px] shadow-3xl animate-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-xl text-white uppercase tracking-tighter">Initialize Knowledge Node</h3>
                            <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-white text-2xl">✕</button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Resource Designation</label>
                                    <input required type="text" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Node Classification</label>
                                    <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={newResource.type} onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}>
                                        <option value="pdf">PDF Forensic DOC</option>
                                        <option value="video">AV Telemetry</option>
                                        <option value="link">Secure Web Node</option>
                                        <option value="image">Optical Scan</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Telemetry Description</label>
                                <textarea className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" rows="2" value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-3xl transition-all shadow-xl active:scale-95">Finalize Node Upload</button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {resources.map(res => (
                        <div key={res.id} className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] p-8 border border-white/5 shadow-3xl group hover:bg-slate-900 transition-all flex items-start gap-8">
                            <div className="w-20 h-20 rounded-[30px] bg-slate-950 flex flex-shrink-0 items-center justify-center text-4xl shadow-inner border border-white/5 transform group-hover:rotate-6 transition-transform">
                                {getIcon(res.type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-blue-400 transition-colors uppercase">{res.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed italic mb-6">"{res.description}"</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">{res.type}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpen(res)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Extract</button>
                                        {!res.isExample && <button onClick={() => handleDelete(res.id)} className="w-10 h-10 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center">🗑️</button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </PageLayout>
    );
};

export default StudentResourcesPage;
