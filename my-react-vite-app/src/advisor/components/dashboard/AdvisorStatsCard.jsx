import { FiUsers, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';

const AdvisorStatsCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
            <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
          </div>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className={`flex items-center font-medium ${trendColors[trend.direction]}`}>
            {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
          </span>
          <span className="text-gray-500">{trend.period}</span>
        </div>
      )}
    </div>
  );
};

const AdvisorStatsOverview = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '24',
      icon: FiUsers,
      color: 'blue',
      trend: { direction: 'up', value: '+2', period: 'this semester' }
    },
    {
      title: 'High Risk',
      value: '3',
      icon: FiAlertTriangle,
      color: 'red',
      trend: { direction: 'down', value: '-1', period: 'this week' }
    },
    {
      title: 'Assessments Complete',
      value: '18/24',
      icon: FiCheckCircle,
      color: 'green',
      trend: { direction: 'up', value: '+5', period: 'this week' }
    },
    {
      title: 'Pending Actions',
      value: '7',
      icon: FiClock,
      color: 'orange',
      trend: { direction: 'up', value: '+2', period: 'today' }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <AdvisorStatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default AdvisorStatsOverview;