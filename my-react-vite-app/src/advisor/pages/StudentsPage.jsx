import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentFilters from '../components/students/StudentFilters';
import AssignedStudentsTable from '../components/students/AssignedStudentsTable';
import { FiUsers, FiDownload, FiRefreshCw } from 'react-icons/fi';

const StudentsPage = () => {
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock students data
  const mockStudents = [
    {
      id: 'STU001',
      name: 'John Doe',
      department: 'Computer Science',
      yearOfStudy: 3,
      riskLevel: 'critical',
      riskScore: 85,
      assessmentStatus: 'overdue',
      lastAssessment: '2024-01-22',
      riskTrend: 'up',
      avatar: null
    },
    {
      id: 'STU002',
      name: 'Sarah Johnson',
      department: 'Engineering',
      yearOfStudy: 2,
      riskLevel: 'high',
      riskScore: 72,
      assessmentStatus: 'completed',
      lastAssessment: '2024-01-28',
      riskTrend: 'stable',
      avatar: null
    },
    {
      id: 'STU003',
      name: 'Mike Chen',
      department: 'Computer Science',
      yearOfStudy: 4,
      riskLevel: 'high',
      riskScore: 68,
      assessmentStatus: 'pending',
      lastAssessment: '2024-01-25',
      riskTrend: 'down',
      avatar: null
    },
    {
      id: 'STU004',
      name: 'Emily Davis',
      department: 'Business',
      yearOfStudy: 1,
      riskLevel: 'medium',
      riskScore: 55,
      assessmentStatus: 'completed',
      lastAssessment: '2024-01-29',
      riskTrend: 'stable',
      avatar: null
    },
    {
      id: 'STU005',
      name: 'Alex Thompson',
      department: 'Mathematics',
      yearOfStudy: 3,
      riskLevel: 'medium',
      riskScore: 48,
      assessmentStatus: 'overdue',
      lastAssessment: '2024-01-20',
      riskTrend: 'up',
      avatar: null
    },
    {
      id: 'STU006',
      name: 'Jessica Wilson',
      department: 'Psychology',
      yearOfStudy: 2,
      riskLevel: 'low',
      riskScore: 32,
      assessmentStatus: 'completed',
      lastAssessment: '2024-01-29',
      riskTrend: 'down',
      avatar: null
    },
    {
      id: 'STU007',
      name: 'David Brown',
      department: 'Engineering',
      yearOfStudy: 4,
      riskLevel: 'low',
      riskScore: 28,
      assessmentStatus: 'completed',
      lastAssessment: '2024-01-28',
      riskTrend: 'stable',
      avatar: null
    },
    {
      id: 'STU008',
      name: 'Lisa Garcia',
      department: 'Business',
      yearOfStudy: 1,
      riskLevel: 'low',
      riskScore: 25,
      assessmentStatus: 'pending',
      lastAssessment: '2024-01-27',
      riskTrend: 'stable',
      avatar: null
    }
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    // Apply initial filter from URL params
    const filterParam = searchParams.get('filter');
    if (filterParam === 'high-risk') {
      handleFiltersChange({
        search: '',
        riskLevel: 'high',
        department: 'all',
        assessmentStatus: 'all',
        yearOfStudy: 'all'
      });
    }
  }, [searchParams]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    let filtered = [...students];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm)
      );
    }

    // Apply risk level filter
    if (filters.riskLevel !== 'all') {
      if (filters.riskLevel === 'high') {
        filtered = filtered.filter(student => 
          student.riskLevel === 'high' || student.riskLevel === 'critical'
        );
      } else {
        filtered = filtered.filter(student => 
          student.riskLevel === filters.riskLevel
        );
      }
    }

    // Apply department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(student =>
        student.department?.toLowerCase().replace(/\s+/g, '-') === filters.department
      );
    }

    // Apply assessment status filter
    if (filters.assessmentStatus !== 'all') {
      filtered = filtered.filter(student =>
        student.assessmentStatus === filters.assessmentStatus
      );
    }

    // Apply year of study filter
    if (filters.yearOfStudy !== 'all') {
      filtered = filtered.filter(student =>
        student.yearOfStudy?.toString() === filters.yearOfStudy
      );
    }

    setFilteredStudents(filtered);
  };

  const handleRefresh = () => {
    loadStudents();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting student data...');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Students</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center space-x-2 text-3xl font-bold text-gray-900">
            <FiUsers className="w-8 h-8" />
            <span>My Students</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor your assigned students</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            disabled={filteredStudents.length === 0}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <StudentFilters
        onFiltersChange={handleFiltersChange}
        totalCount={students.length}
        filteredCount={filteredStudents.length}
      />

      {/* Students Table */}
      <AssignedStudentsTable
        students={filteredStudents}
        loading={loading}
      />
    </div>
  );
};

export default StudentsPage;