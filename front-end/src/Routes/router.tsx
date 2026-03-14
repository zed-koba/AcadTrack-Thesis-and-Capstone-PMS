import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '@/components/Layout/HomeLayout';
import Home from '@/components/Home';
import Registration from '@/components/Registration';
import AdminStudents from '@/components/Admin/pages/Students';
import AdminProponents from '@/components/Admin/pages/Proponents';
import { default as AdviserDashboard } from '../components/Adviser/pages/Dashboard';
import { default as StudentDashboard } from '../components/Student/pages/Dashboard';
import { default as AdviserStudentDocument } from '../components/Adviser/pages/StudentDocument';
import { default as StudentDocument } from '../components/Student/pages/Document';
import AdminLayout from '../components/Layout/AdminLayout';
import AdviserLayout from '../components/Layout/AdviserLayout';
import AdviserConsultation from '../components/Adviser/pages/AdviserConsultation';
import Adviser from '../components/Admin/pages/Adviser';
import Departments from '../components/Admin/pages/Departments';
import Roles from '../components/Admin/pages/Roles';
import Programs from '../components/Admin/pages/Programs';
import Instructors from '../components/Admin/pages/Instructor';
import StundentLayout from '../components/Layout/StudentLayout';
import { default as StudentConsultation } from '../components/Student/pages/Consultation';
import InstructorLayout from '../components/Layout/InstructorLayout';
import StudentGroups from '../components/Instructor/pages/StudentGroups';
import DocumentDeadlines from '../components/Instructor/pages/DocumentDeadlines';
import InstructorDashboard from '../components/Instructor/pages/InstructorDashboard';
import Login from '../components/Login';
import RequireAuth from './RequireAuth';
import PublicRoute from './PublicRoutes';
import StudentProjectSetup from '@/components/ProjectSetup';
import StudentNotifications from '@/components/Student/pages/StudentNotifications';
import InstructorNotifications from '@/components/Instructor/pages/InstructorNotifications';
import AdviserNotifications from '@/components/Adviser/pages/AdviserNotifications';
import StudentDevelopmentProcess from '@/components/Student/pages/DevelopmentProcess';
import InstructorDevelopmentProcess from '@/components/Instructor/pages/InstructorDevelopmentProcess';
import MyGroups from '@/components/Student/pages/MyGroups';
import AdviserDevelopmentProcess from '@/components/Adviser/pages/AdviserDevelopmentProcess';
import AdviserReports from '@/components/Adviser/pages/AdviserReports';
import InstructorArchiving from '@/components/Instructor/pages/InstructorArchiving';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'Registration', element: <Registration /> },
			{
				path: 'Login',
				element: (
					<PublicRoute>
						<Login />
					</PublicRoute>
				),
			},
		],
	},
	{
		path: '/Admin',
		element: <AdminLayout />,
		children: [
			{ index: true, element: <AdminStudents /> },
			{ path: 'Projects', element: <AdminProponents /> },
			{ path: 'Adviser', element: <Adviser /> },
			{ path: 'Instructor', element: <Instructors /> },
			{ path: 'Departments', element: <Departments /> },
			{ path: 'Roles', element: <Roles /> },
			{ path: 'Programs', element: <Programs /> },
		],
	},
	{
		path: '/Adviser',
		element: (
			<RequireAuth allowedRoles={['adviser']}>
				<AdviserLayout />
			</RequireAuth>
		),
		children: [
			{
				index: true,
				element: <AdviserDashboard />,
			},
			{ path: 'Consultation', element: <AdviserConsultation /> },
			{ path: 'Documents', element: <AdviserStudentDocument /> },
			{ path: 'Notifications', element: <AdviserNotifications /> },
			{
				path: 'Development-Monitoring',
				element: <AdviserDevelopmentProcess />,
			},
			{
				path: 'Reports',
				element: <AdviserReports />,
			},
		],
	},
	{
		path: '/Student/Project-Setup',
		element: (
			<RequireAuth allowedRoles={['student']}>
				<StudentProjectSetup />
			</RequireAuth>
		),
	},
	{
		path: '/Student',
		element: (
			<RequireAuth allowedRoles={['student']}>
				<StundentLayout />
			</RequireAuth>
		),
		children: [
			{
				index: true,
				element: <StudentDashboard />,
			},
			{ path: 'MyGroup', element: <MyGroups /> },
			{ path: 'Consultation', element: <StudentConsultation /> },
			{ path: 'Document', element: <StudentDocument /> },
			{ path: 'Notifications', element: <StudentNotifications /> },
			{ path: 'Development-Process', element: <StudentDevelopmentProcess /> },
		],
	},
	{
		path: '/Instructor',
		element: (
			<RequireAuth allowedRoles={['instructor']}>
				<InstructorLayout />
			</RequireAuth>
		),
		children: [
			{
				index: true,
				element: <InstructorDashboard />,
			},
			{ path: 'Groups', element: <StudentGroups /> },
			{ path: 'Deadlines', element: <DocumentDeadlines /> },
			{ path: 'Notifications', element: <InstructorNotifications /> },
			{
				path: 'Development-Monitoring',
				element: <InstructorDevelopmentProcess />,
			},
			{
				path: 'Archives',
				element: <InstructorArchiving />,
			},
		],
	},
	{
		path: '/unauthorized',
		element: <div>403 - Unauthorized</div>,
	},
]);
