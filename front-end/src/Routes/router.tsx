import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '@/components/Layout/HomeLayout';
import Home from '@/components/Home';
import Registration from '@/components/Registration';
import AdminStudents from '@/components/Admin/pages/Students';
import AdminProponents from '@/components/Admin/pages/Proponents';
import { default as AdminDashboard } from '../components/Admin/pages/Dashboard';
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
			{ index: true, element: <AdminDashboard /> },
			{ path: 'Projects', element: <AdminProponents /> },
			{ path: 'Proponents', element: <AdminStudents /> },
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
		],
	},
	{
		path: '/Student/Project-Setup',
		element: <StudentProjectSetup />,
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
			{ path: 'Consultation', element: <StudentConsultation /> },
			{ path: 'Document', element: <StudentDocument /> },
		],
	},
	{
		path: '/Instructor',
		element: <InstructorLayout />,
		children: [
			{
				index: true,
				element: <InstructorDashboard />,
			},
			{ path: 'Groups', element: <StudentGroups /> },
			{ path: 'Deadlines', element: <DocumentDeadlines /> },
		],
	},
	{
		path: '/unauthorized',
		element: <div>403 - Unauthorized</div>,
	},
]);
