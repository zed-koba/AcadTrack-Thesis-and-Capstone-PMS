import { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button } from '../ui/button';
import { Bell, CheckCheck, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { NotificationProps } from '../interface/type';
import { api } from '../Routes/http';
import { ScrollArea } from '../ui/scroll-area';
import { Spinner } from '../ui/spinner';
import { format } from 'date-fns';

const NotificationBell = () => {
	const [open, setOpen] = useState(false);
	const [notifications, setNotifications] = useState<NotificationProps[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchNotifications = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${api}/notifications`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});

			const result = await res.json();
			if (!res.ok) throw new Error('Failed to fetch data');
			if (result.status === 200) {
				await setNotifications(result.notifications);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchNotifications();
	}, []);
	const readNotificationUpdate = async (id: number) => {
		try {
			const res = await fetch(`${api}/notifications/read/${id}`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					Accepts: 'application/json',
				},
			});
			const result = await res.json();
			if (result.status === 500) {
				console.log(result.message);
				console.log(result.error);
				return;
			}
			if (result.status === 200) {
				console.log('Updated');
				fetchNotifications();
			}
		} catch (error) {
			console.log(error);
		}
	};
	const unreadCount = notifications.filter(
		(notif) => notif.read_at === null,
	).length;
	return (
		<>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" size="icon" className="relative">
						<Bell className="h-4 w-4" />
						{unreadCount > 0 && (
							<Badge
								className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
								variant="destructive"
							>
								{unreadCount > 9 ? '9+' : unreadCount}
							</Badge>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80 p-0" align="end">
					<div className="flex items-center justify-between p-4 border-b border-border">
						<h4 className="font-semibold">Notifications</h4>
						{unreadCount > 0 && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-7"
							//onClick={onMarkAllAsRead}
							>
								<CheckCheck className="h-3 w-3 mr-1" />
								Mark all read
							</Button>
						)}
					</div>
					<ScrollArea className="max-h-[400px]">
						{loading && (
							<div className="w-full h-full flex justify-center items-center text-muted-foreground">
								<Spinner className="size-8" />
							</div>
						)}
						{!loading && notifications.length === 0 ? (
							<div className="p-8 text-center text-muted-foreground">
								<Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
								<p>No notifications</p>
							</div>
						) : (
							<div className="divide-y divide-border">
								{notifications.map((notification) => {
									// const config = notificationTypeConfig[notification.type];
									// const Icon = config.icon;

									return (
										<div
											key={notification.id}
											className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read_at ? 'bg-primary/5' : ''
												}`}
											onClick={() => readNotificationUpdate(notification.id)}
										>
											<div className="flex gap-3">
												<div
													className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-blue-500/10`}
												>
													<User className={`h-4 w-4`} />
												</div>
												<div className="flex-1 min-w-0">
													<p
														className={`text-sm ${!notification.read_at ? 'font-medium' : ''
															}`}
													>
														{`${notification.project.title} ${notification.message}`}
													</p>

													<p className="text-xs text-muted-foreground mt-1">
														{format(
															new Date(notification.created_at),
															'MMM d, h:mm a',
														)}
													</p>
												</div>
												{!notification.read_at && (
													<div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
												)}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</ScrollArea>
				</PopoverContent>
			</Popover>
		</>
	);
};

export default NotificationBell;
