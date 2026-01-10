import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '@/components/Layout/HomeLayout';
import Home from '@/components/Home';
import Registration from '@/components/Registration';
import AdminStudents from '@/components/Admin/pages/Students';
import AdminProponents from '@/components/Admin/pages/Proponents';
import { default as AdminDashboard } from '../Admin/pages/Dashboard';
import { default as AdviserDashboard } from '../Adviser/pages/Dashboard';
import { default as StudentDashboard } from '../Student/pages/Dashboard';
import { default as StudentDocument } from '../Student/pages/Document';
import AdminLayout from '../Layout/AdminLayout';
import AdviserLayout from '../Layout/AdviserLayout';
import AdviserConsultation from '../Adviser/pages/AdviserConsultation';
import Adviser from '../Admin/pages/Adviser';
import Departments from '../Admin/pages/Departments';
import Roles from '../Admin/pages/Roles';
import Programs from '../Admin/pages/Programs';
import Instructors from '../Admin/pages/Instructor';
import StundentLayout from '../Layout/StudentLayout';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'Registration', element: <Registration /> },
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
		element: <AdviserLayout />,
		children: [
			{
				index: true,
				element: <AdviserDashboard />,
			},
			{ path: 'Consultation', element: <AdviserConsultation /> },
		],
	},
	{
		path: '/Student',
		element: <StundentLayout />,
		children: [
			{
				index: true,
				element: <StudentDashboard />,
			},
			{ path: 'Document', element: <StudentDocument /> },
		],
	},
]);
