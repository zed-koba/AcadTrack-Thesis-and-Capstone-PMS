import { Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';

const UserNav = () => {
	return (
		<>
			<div className="border-b border-muted w-full p-2 transition-all duration-300 flex justify-between h-16 items-center px-10">
				<div className="text-white py-2">
					<Menu className="w-5 h-5" />
				</div>
				<div className="flex gap-3">
					<NotificationBell />
				</div>
			</div>
		</>
	);
};

export default UserNav;
