import { formatDate, information } from '@/components/functions/functions';
import type { Deadlines } from '@/components/Instructor/interface/deadlines';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { apiStudentUrl } from '@/Routes/http';
import { differenceInDays, format } from 'date-fns';
import {
	BookOpen,
	CalendarIcon,
	Check,
	CircleCheck,
	Copy,
	ListChecks,
	Plus,
	Timer,
	User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
	ProjectProps,
	StudentDetailsProps,
	TaskList,
} from '../interface/dashboard';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

import { Spinner } from '@/components/ui/spinner';

const Dashboard = () => {
	const [project, setProject] = useState<ProjectProps | undefined>();
	const [loading, setLoading] = useState(false);
	const [deadlines, setDeadlines] = useState<Deadlines[] | []>([]);
	const [student, setStudent] = useState<StudentDetailsProps | undefined>();
	const [tasks, setTasks] = useState<TaskList[]>([]);
	const [newTaskText, setNewTaskText] = useState('');
	const [newTaskDeadline, setNewTaskDeadline] = useState<Date | undefined>();
	const [copied, setCopied] = useState(false);

	const fetchDeadlines = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${apiStudentUrl}/tasks/${information.id}`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});
			const data = await res.json();
			await setDeadlines(data.deadlines);
			await setTasks(data.tasks);
			await setProject(data.project);
			await setStudent(data.student);
		} catch (error) {
			console.error('Error fetching deadlines:', error);
		} finally {
			setLoading(false);
		}
	};
	const getDaysLabel = (dueDate: Date) => {
		const days = differenceInDays(dueDate, new Date());
		if (days < 0)
			return {
				text: `${Math.abs(days)} days overdue`,
				className: 'text-destructive font-medium',
			};
		if (days === 0)
			return { text: 'Due today', className: 'text-amber-500 font-medium' };
		if (days <= 3)
			return { text: `${days} days left`, className: 'text-amber-500' };
		return { text: `${days} days left`, className: 'text-muted-foreground' };
	};
	const addTask = async () => {
		if (!newTaskText.trim() && newTaskDeadline) return;
		const payLoad = {
			proponents_id: project?.proponents_id,
			task: newTaskText,
			deadline: format(newTaskDeadline?.toISOString() ?? '', 'yyyy-MM-dd'),
		};
		const res = await fetch(`${apiStudentUrl}/tasks/add`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(payLoad),
		});
		const result = await res.json();
		if (result.status == 422) {
			const errors = result.errors as Record<string, string[]>;
			Object.values(errors).forEach((errorMessages) =>
				errorMessages.forEach((message) => toast.error(message)),
			);
			return;
		} else if (result.status == 500) {
			toast.error(result.message);
			console.log(result.error);
			return;
		}
		if (!res.ok) {
			console.log(result.status);
			console.log('Failed to fetch data ' + JSON.stringify(payLoad));
			return;
		}
		if (result.status === 201) {
			toast.success(result.message);
			setNewTaskText('');
			setNewTaskDeadline(undefined);

			setTasks((prev) => [
				...prev,
				{
					id: tasks[tasks.length - 1]?.id + 1 || 1,
					task: newTaskText.trim(),
					is_completed: 0,
					deadline: newTaskDeadline || new Date(),
					foreign_proponents_id: project?.proponents_id || '',
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
			]);
		}
	};
	const toggleTask = async (id: number) => {
		const res = await fetch(`${apiStudentUrl}/tasks/update/${id}`, {
			method: 'PUT',
		});
		const result = await res.json();
		if (result.status == 422) {
			const errors = result.errors as Record<string, string[]>;
			Object.values(errors).forEach((errorMessages) =>
				errorMessages.forEach((message) => console.log(message)),
			);
			return;
		} else if (result.status == 500) {
			toast.error(result.message);
			console.log(result.error);
			return;
		}
		if (!res.ok) {
			console.log(result.status);
			return;
		}
		if (result.status === 200) {
			setTasks((prev) =>
				prev.map((t) =>
					t.id === id
						? { ...t, is_completed: t.is_completed === 1 ? 0 : 1 }
						: t,
				),
			);
		}
	};
	const handleCopyCode = () => {
		navigator.clipboard.writeText(project?.proponents_id ?? 'N/A');
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
		toast.info('Copied');
	};
	useEffect(() => {
		fetchDeadlines();
	}, []);

	const completedCount = tasks?.filter((d) => d.is_completed === 1).length;
	const progressPercent =
		tasks?.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
	return (
		<>
			<main className="flex-1 p-6 h-full">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div>
							<h1 className="text-2xl font-bold">Welcome Back, Student!</h1>
							<p className="text-muted-foreground">
								Here's an overview of your academic progress
							</p>
						</div>
					</div>
				</div>
				{loading && (
					<div className="w-full h-full flex justify-center items-center text-muted-foreground">
						<Spinner className="size-8" />
					</div>
				)}
				{!loading && !project && (
					<div className="flex flex-col justify-center items-center opacity-50 h-full">
						<BookOpen className="h-24 w-24 text-muted-foreground" />
						<p className="text-mb text-muted-foreground font-medium">
							You’re not part of any thesis or capstone group yet. Join an
							existing group or create one to continue.
						</p>
					</div>
				)}
				{!loading && project && (
					<>
						<Card className="mb-6">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-xl flex gap-2 items-center justify-center">
											<BookOpen className="w-4.5 h-4.5" />
											{project?.title ?? 'N/A'}
										</CardTitle>
										<CardDescription className="mt-1">
											<span className="text-xs">
												Created{' '}
												{project?.created_at
													? formatDate(project.created_at)
													: 'N/A'}
											</span>
										</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground font-mono">
											{project?.proponents_id}
										</span>
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7"
											onClick={handleCopyCode}
										>
											{copied ? (
												<Check className="h-3.5 w-3.5 text-green-500" />
											) : (
												<Copy className="h-3.5 w-3.5" />
											)}
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="space-y-1">
										<div className="flex gap-1 items-center">
											<User className="text-xs text-muted-foreground h-3 w-3" />
											<p className="text-xs text-muted-foreground">Adviser</p>
										</div>
										<p className="text-sm font-medium">
											{project?.adviser.name}
										</p>
									</div>
									<div className="space-y-1">
										<div className="flex gap-1 items-center">
											<User className="text-xs text-muted-foreground h-3 w-3" />
											<p className="text-xs text-muted-foreground">
												Instructor
											</p>
										</div>
										<p className="text-sm font-medium margin-left">
											{student?.instructor.name}
										</p>
									</div>
									<div className="space-y-1">
										<div className="flex gap-1 items-center">
											<User className="text-xs text-muted-foreground h-3 w-3" />
											<p className="text-xs text-muted-foreground">
												Group Leader
											</p>
										</div>
										<p className="text-sm font-medium">
											{project.group_leader.name}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs text-muted-foreground">
											Total Members
										</p>
										<p className="text-sm font-medium">
											{project.details.length} active
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<div className="grid gap-6 lg:grid-cols-2 h-auto">
							{/* Deadlines from Instructor/Adviser */}
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<Timer className="h-5 w-5" />
										Deadlines
									</CardTitle>
									<Badge variant="default">{deadlines.length} active</Badge>
								</CardHeader>
								<CardContent className="space-y-3">
									{deadlines.length === 0 && (
										<div className="flex flex-col gap-2 items-center justify-center pt-5">
											<CircleCheck className="text-muted-foreground w-8 h-8" />
											<p className="text-sm text-muted-foreground font-medium">
												There's no upcoming deadlines in next 14 days.
											</p>
										</div>
									)}
									{deadlines.length > 0 &&
										deadlines.map((deadline) => {
											const daysInfo = getDaysLabel(deadline.deadline);
											return (
												<div
													key={deadline.id}
													className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
												>
													<div className="flex-1 min-w-0">
														<p className="font-medium text-sm truncate">
															{deadline.document_title}
														</p>
														<p className="text-xs text-muted-foreground mt-0.5">
															{deadline.instructor.name}
														</p>
														<p className="text-xs text-muted-foreground mt-0.5">
															Due: {format(deadline.deadline, 'MMM d, yyyy')}
														</p>
													</div>
													<div className="text-right ml-3 shrink-0">
														<p className={`text-xs ${daysInfo.className}`}>
															{daysInfo.text}
														</p>
													</div>
												</div>
											);
										})}
								</CardContent>
							</Card>

							{/* Task Checklist / To-Do List */}
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											<ListChecks className="h-5 w-5" />
											Task Checklist
										</CardTitle>
										<span className="text-sm text-muted-foreground">
											{completedCount}/{tasks.length} done
										</span>
									</div>
									<Progress value={progressPercent} className="h-2 mt-2" />
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex gap-2 mb-3">
										<Input
											placeholder="Add a new task..."
											value={newTaskText}
											onChange={(e) => setNewTaskText(e.target.value)}
											onKeyDown={(e) => e.key === 'Enter' && addTask()}
											className="h-8 text-sm"
										/>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													className={cn(
														'h-8 px-2 text-xs gap-1',
														newTaskDeadline
															? 'text-foreground'
															: 'text-muted-foreground',
													)}
												>
													<CalendarIcon className="h-3.5 w-3.5" />
													{newTaskDeadline
														? format(newTaskDeadline, 'MMM d')
														: 'Date'}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="end">
												<Calendar
													mode="single"
													selected={newTaskDeadline}
													onSelect={setNewTaskDeadline}
													initialFocus
													className={cn('p-3 pointer-events-auto')}
												/>
											</PopoverContent>
										</Popover>
										<Button
											size="sm"
											variant="outline"
											onClick={addTask}
											className="h-8 px-2"
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									<div className="space-y-1 max-h-[280px] overflow-y-auto">
										{tasks.map((task) => (
											<div
												key={task.id}
												className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
												onClick={() => toggleTask(task.id)}
											>
												<Checkbox
													checked={task.is_completed === 1 ? true : false}
													onCheckedChange={() => toggleTask(task.id)}
												/>
												<div className="flex-1 min-w-0">
													<p
														className={`text-sm ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}
													>
														{task.task}
													</p>
												</div>
												<Badge
													variant="outline"
													className="text-[10px] shrink-0"
												>
													{/* task.deadline */}
													No Due
												</Badge>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</>
				)}

				{/* Recent Documents */}
				{/*<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Recent Documents
							</CardTitle>
							<Link to="/Student/documents">
								<Button variant="ghost" size="sm">
									View All
								</Button>
							</Link>
						</CardHeader>
						<CardContent className="space-y-4">
							{recentDocuments.map((doc) => (
								<div
									key={doc.id}
									className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
								>
									<div className="flex items-center gap-3">
										<div className="p-2 rounded bg-primary/10">
											<FileText className="h-4 w-4 text-primary" />
										</div>
										<div>
											<p className="font-medium text-sm">{doc.title}</p>
											<p className="text-xs text-muted-foreground">
												{format(doc.date, 'MMM d, yyyy')}
											</p>
										</div>
									</div>
									<Badge className={statusConfig[doc.status].className}>
										{statusConfig[doc.status].label}
									</Badge>
								</div>
							))}
						</CardContent>
					</Card> */}

				{/* Upcoming Consultations */}
				{/* <Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<CalendarClock className="h-5 w-5" />
								Upcoming Consultations
							</CardTitle>
							<Link to="/student/consultations">
								<Button variant="ghost" size="sm">
									View All
								</Button>
							</Link>
						</CardHeader>
						<CardContent>
							{upcomingConsultations.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									<CalendarClock className="h-10 w-10 mx-auto mb-3 opacity-50" />
									<p>No upcoming consultations</p>
									<Link to="/student/consultations">
										<Button variant="outline" size="sm" className="mt-3">
											Request Consultation
										</Button>
									</Link>
								</div>
							) : (
								<div className="space-y-4">
									{upcomingConsultations.map((consultation) => (
										<div
											key={consultation.id}
											className="p-4 rounded-lg bg-muted/50"
										>
											<div className="flex items-center justify-between mb-2">
												<p className="font-medium">{consultation.purpose}</p>
												<Badge
													className={
														statusConfig[consultation.status].className
													}
												>
													{statusConfig[consultation.status].label}
												</Badge>
											</div>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<span className="flex items-center gap-1">
													<CalendarClock className="h-4 w-4" />
													{format(consultation.date, 'MMM d, yyyy')}
												</span>
												<span>{consultation.time}</span>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card> */}
			</main>
		</>
	);
};

export default Dashboard;
