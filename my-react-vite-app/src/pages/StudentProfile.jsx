import PageLayout from '../components/layouts/PageLayout';
import StudentProfileTab from '../components/student/StudentProfileTab';

const StudentProfile = () => {
  return (
    <PageLayout title="Profile">
      <StudentProfileTab />
    </PageLayout>
  );
};

export default StudentProfile;
