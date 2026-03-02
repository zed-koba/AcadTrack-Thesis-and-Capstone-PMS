import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }: { children: JSX.Element }) => {
	const token = localStorage.getItem('token');
	const userString = localStorage.getItem('user');

	if (token && userString) {
		let destination = '/';

		try {
			const user = JSON.parse(userString);

			switch (user.role) {
				case 'admin':
					destination = '/Admin';
					break;
				case 'student':
					destination = '/Student';
					break;
				case 'adviser':
					destination = '/Adviser';
					break;
				case 'instructor':
					destination = '/Instructor';
					break;
				default:
					destination = '/';
			}
		} catch (error) {
			localStorage.clear();
			destination = '/Login';
			console.log(error);
		}

		return <Navigate to={destination} replace />;
	}

	return children;
};

export default PublicRoute;
