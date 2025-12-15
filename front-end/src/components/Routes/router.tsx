import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '@/components/Layout/HomeLayout';
import Home from '@/components/Home';
import Registration from '@/components/Registration';
import AdminStudents from '@/components/Admin/pages/Students';
import AdminProponents from '@/components/Admin/pages/Proponents';
import { default as AdminDashboard } from '../Admin/pages/Dashboard';
import { default as AdviserDashboard } from '../Adviser/pages/Dashboard';
import AdminLayout from '../Layout/AdminLayout';
import AdviserLayout from '../Layout/AdviserLayout';
import AdviserConsultation from '../Adviser/pages/AdviserConsultation';
import Adviser from '../Admin/pages/Adviser';

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
			{ path: 'Proponents', element: <AdminProponents /> },
			{ path: 'Students', element: <AdminStudents /> },
			{ path: 'Adviser', element: <Adviser /> },
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
