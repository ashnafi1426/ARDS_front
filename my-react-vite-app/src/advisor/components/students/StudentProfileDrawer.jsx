import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBook } from 'react-icons/fi';

const StudentProfileDrawer = ({ student }) => {
  if (!student) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          {student.avatar ? (
            <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <FiUser className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
          <p className="text-sm text-gray-600">{student.id}</p>
          <div className="mt-1">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              student.status?.toLowerCase() === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {student.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiMail className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <span className="text-sm text-gray-600 block">Email</span>
                <span className="text-sm text-gray-900">{student.email || 'Not provided'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <span className="text-sm text-gray-600 block">Phone</span>
                <span className="text-sm text-gray-900">{student.phone || 'Not provided'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiMapPin className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <span className="text-sm text-gray-600 block">Address</span>
                <span className="text-sm text-gray-900">{student.address || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiBook className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <span className="text-sm text-gray-600 block">Department</span>
                <span className="text-sm text-gray-900">{student.department || 'Not specified'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiCalendar className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <span className="text-sm text-gray-600 block">Year of Study</span>
                <span className="text-sm text-gray-900">
                  {student.yearOfStudy ? `Year ${student.yearOfStudy}` : 'Not specified'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiCalendar className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <span className="text-sm text-gray-600 block">Enrollment Date</span>
                <span className="text-sm text-gray-900">
                  {student.enrollmentDate 
                    ? new Date(student.enrollmentDate).toLocaleDateString()
                    : 'Not available'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Performance</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <span className="text-sm text-gray-600 block">GPA</span>
              <span className="text-lg font-semibold text-gray-900">{student.gpa || 'N/A'}</span>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600 block">Credits</span>
              <span className="text-lg font-semibold text-gray-900">{student.credits || 'N/A'}</span>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600 block">Attendance</span>
              <span className="text-lg font-semibold text-gray-900">{student.attendanceRate || 'N/A'}%</span>
            </div>
          </div>
        </div>

        {student.emergencyContact && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiUser className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <span className="text-sm text-gray-600 block">Name</span>
                  <span className="text-sm text-gray-900">{student.emergencyContact.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <span className="text-sm text-gray-600 block">Phone</span>
                  <span className="text-sm text-gray-900">{student.emergencyContact.phone}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4"></div>
                <div className="flex-1">
                  <span className="text-sm text-gray-600 block">Relationship</span>
                  <span className="text-sm text-gray-900">{student.emergencyContact.relationship}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfileDrawer;