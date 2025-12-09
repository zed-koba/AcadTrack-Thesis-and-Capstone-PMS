import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '@/components/Layout/HomeLayout';
import Home from '@/components/Home';
import Registration from '@/components/Registration';
import AdminStudents from '@/components/Instructor/pages/Students';
import AdminProponents from '@/components/Instructor/pages/Proponents';
import { default as AdminDashboard } from '../Instructor/pages/Dashboard';
import { default as AdviserDashboard } from '../Adviser/pages/Dashboard';
import AdminLayout from '../Layout/InstructorLayout';
import AdviserLayout from '../Layout/AdviserLayout';
import AdviserConsultation from '../Adviser/pages/AdviserConsultation';

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
		path: '/Instructor',
		element: <AdminLayout />,
		children: [
			{ index: true, element: <AdminDashboard /> },
			{ path: 'Proponets', element: <AdminProponents /> },
			{ path: 'Students', element: <AdminStudents /> },
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
]);
