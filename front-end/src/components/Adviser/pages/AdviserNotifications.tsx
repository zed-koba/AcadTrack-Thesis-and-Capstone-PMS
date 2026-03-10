import {
	getInformation,
	getProjectId,
	getUser,
} from '@/components/functions/functions';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { api } from '@/Routes/http';
import {
	AlertCircle,
	Bell,
	CalendarClock,
	CheckCircle2,
	Clock,
	FileText,
	MessageSquare,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import type { NotificationProps } from '@/components/Student/interface/notification';

const AdviserNotifications = () => {
	const [loading, setLoading] = useState(false);
	const [notifications, setNotifications] = useState<NotificationProps[]>([]);
	const information = getInformation();
	const user = getUser();
	const projectId = getProjectId();
	const fetchNotifications = async () => {
		try {
			const res = await fetch(
				`${api}/notifications/${user.role === 'student' ? projectId.proponents_id : information.id}/${user.role}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
				},
			);
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			await setNotifications(result.notifications);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchNotifications();
	}, []);

	const typeConfig: Record<
		string,
		{
			icon: React.ComponentType<{ className?: string }>;
			color: string;
			bg: string;
		}
	> = {
		document: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
		consultation: {
			icon: CalendarClock,
			color: 'text-emerald-500',
			bg: 'bg-emerald-500/10',
		},
		deadline: {
			icon: AlertCircle,
			color: 'text-amber-500',
			bg: 'bg-amber-500/10',
		},
		general: {
			icon: MessageSquare,
			color: 'text-primary',
			bg: 'bg-primary/10',
		},
	};
	const unreadNotification = notifications.filter(
		(notif) => notif.read_at === null,
	);
	const markAllAsRead = () => {
		setNotifications((prev) =>
			prev.map((n) => ({ ...n, read_at: new Date() })),
		);
		unreadNotification.map((notif) => markAsRead(notif.id));
	};
	const markAsRead = async (id: number) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read_at: new Date() } : n)),
		);
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
				window.location.reload();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col w-full justify-start">
					<span className="text-2xl text-white">Notifications</span>
					<span className="text-sm text-white">
						Stay updated on your project activities
					</span>
				</div>
			</div>
			{loading ? (
				<div className="w-full h-full flex justify-center items-center text-muted-foreground">
					<Spinner className="size-8" />
				</div>
			) : (
				<>
					<div className="flex items-center justify-between mt-4">
						<div className="flex items-center gap-2">
							<Bell className="h-5 w-5" />
							<span className="text-sm font-medium">
								{unreadNotification.length} unread
							</span>
						</div>
						{unreadNotification.length > 0 && (
							<Button variant="outline" size="sm" onClick={markAllAsRead}>
								<CheckCircle2 className="h-4 w-4 mr-1" /> Mark all as read
							</Button>
						)}
					</div>
					<ScrollArea className="max-h-[600px] mt-2">
						<div className="space-y-2">
							{notifications.map((n) => {
								const config = typeConfig[n.type];
								const Icon = config.icon;
								return (
									<Card
										key={n.id}
										className={`p-0 cursor-pointer transition-colors ${!n.read_at ? 'border-primary/30 bg-primary/5' : ''}`}
										onClick={() => markAsRead(n.id)}
									>
										<CardContent className="p-4 flex items-start gap-3">
											<div className={`p-2 rounded-lg ${config.bg} mt-0.5`}>
												<Icon className={`h-4 w-4 ${config.color}`} />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<p
														className={`text-sm font-medium ${!n.read_at ? '' : 'text-muted-foreground'}`}
													>
														{n.title}
													</p>
													<div className="flex items-center gap-2">
														{!n.read_at && (
															<div className="w-2 h-2 rounded-full bg-primary" />
														)}
														<span className="text-[10px] text-muted-foreground flex items-center gap-1">
															<Clock className="h-3 w-3" />
															{format(n.created_at, 'MMM d, h:mm a')}
														</span>
													</div>
												</div>
												<p className="text-xs text-muted-foreground mt-1">
													{n.message}
												</p>
											</div>
										</CardContent>
									</Card>
								);
							})}
							{notifications.length === 0 && (
								<div className="text-center py-12 text-muted-foreground">
									<Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
									<p className="text-sm">No notifications</p>
								</div>
							)}
						</div>
					</ScrollArea>
				</>
			)}
		</>
	);
};

export default AdviserNotifications;
