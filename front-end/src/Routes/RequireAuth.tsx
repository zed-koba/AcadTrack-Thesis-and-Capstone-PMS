import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
	children: JSX.Element;
	allowedRoles?: string[];
}

const RequireAuth = ({ children, allowedRoles }: Props) => {
	const token = localStorage.getItem('token');
	const user = localStorage.getItem('user');

	if (!token || !user) {
		return <Navigate to="/Login" replace />;
	}

	const parsedUser = JSON.parse(user);

	if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
		return <Navigate to="/unauthorized" replace />;
	}

	if (parsedUser.role === 'student' && parsedUser.new_user === 1) {
		return <Navigate to="/Student/Project-Setup" replace />;
	}

	return children;
};

export default RequireAuth;
