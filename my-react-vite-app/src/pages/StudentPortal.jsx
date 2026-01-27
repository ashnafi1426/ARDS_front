import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentLayout from '../components/layouts/StudentLayout';

// Sub-Views
import StudentOverviewRedesigned from '../components/student/StudentOverviewRedesigned';
import SelfCheckForm from './SelfCheckForm';
import NotificationsPage from './NotificationsPage';
import StudentCalendarPage from './StudentCalendarPage';
import StudentResourcesPage from './StudentResourcesPage';
import StudentHelpPage from './StudentHelpPage';

const StudentPortal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Persistent State for Portal
    const [portalData, setPortalData] = useState(() => {
        try {
            const saved = localStorage.getItem('last_student_perf_data');
            return saved ? JSON.parse(saved) : null;
        } catch (e) { return null; }
    });
    const [riskData, setRiskData] = useState([]);
    const { tab } = useParams();
    const [activeTab, setActiveTab] = useState(tab || 'dashboard');

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab('dashboard');
        }
        fetchTelemetry();
    }, [tab, location.pathname]);

    const fetchTelemetry = async () => {
        if (!portalData) setLoading(true);
        try {
            const profileRes = await api.get('/students/profile');
            if (profileRes.data.status === 'success') {
                const data = profileRes.data.data;
                setPortalData(data);
                localStorage.setItem('last_student_perf_data', JSON.stringify(data));
            }

            const riskRes = await api.get('/risks/student');
            if (riskRes.data.status === 'success') {
                setRiskData(riskRes.data.data || []);
            }
        } catch (err) {
            console.warn('Telemetry partial failure:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
            case 'overview':
                return <StudentOverviewRedesigned studentData={portalData} riskData={riskData} onRefresh={fetchTelemetry} />;
            case 'profile':
                // Navigate to dedicated profile page
                setTimeout(() => navigate('/student/profile'), 0);
                return null;
            case 'self-check':
                return <SelfCheckForm />;
            case 'notifications':
                return <NotificationsPage />;
            case 'calendar':
                return <StudentCalendarPage />;
            case 'resources':
                return <StudentResourcesPage />;
            case 'help':
                return <StudentHelpPage />;
            default:
                return <StudentOverviewRedesigned studentData={portalData} riskData={riskData} onRefresh={fetchTelemetry} />;
        }
    };

    if (loading && !portalData) return <LoadingSpinner />;

    return (
        <StudentLayout>
            <div key={activeTab} className="duration-500">
                {renderContent()}
            </div>
        </StudentLayout>
    );
};

export default StudentPortal;
