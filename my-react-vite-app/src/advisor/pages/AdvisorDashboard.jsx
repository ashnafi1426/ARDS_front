import AdvisorStatsOverview from '../components/dashboard/AdvisorStatsCard';
import RiskOverviewChart from '../components/dashboard/RiskOverviewChart';
import HighRiskStudents from '../components/dashboard/HighRiskStudents';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import AssessmentCompliance from '../components/dashboard/AssessmentCompliance';

const AdvisorDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your assigned students and track their academic progress</p>
      </div>

      {/* Stats Overview */}
      <section>
        <AdvisorStatsOverview />
      </section>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Takes 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <RiskOverviewChart />
          </section>
          
          <section>
            <HighRiskStudents />
          </section>
        </div>

        {/* Right Column - Takes 1/3 width on large screens */}
        <div className="space-y-6">
          <section>
            <RecentAlerts />
          </section>
          
          <section>
            <AssessmentCompliance />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;