import { user } from '@/components/functions/functions';
import type { Deadlines } from '@/components/Instructor/interface/deadlines';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { apiStudentUrl } from '@/Routes/http';
import { differenceInDays, format } from 'date-fns';
import { ListChecks, Plus, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
	const [loading, setLoading] = useState(false);
	const [deadlines, setDeadlines] = useState<Deadlines[]>([]);
	const fetchDeadlines = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`${apiStudentUrl}/deadlines/${user.instructor_id}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
				},
			);
			const data = await res.json();
			await setDeadlines(data.deadlines);
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

	useEffect(() => {
		fetchDeadlines();
	}, []);

	return (
		<>
			<main className="flex-1 p-6">
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

				{/* Stats Grid */}
				{/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
					{stats.map((stat) => (
						<Card key={stat.title}>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									{stat.title}
								</CardTitle>
								<stat.icon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="text-xs text-muted-foreground">
									{stat.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div> */}

				<div className="grid gap-6 lg:grid-cols-2">
					{/* Deadlines from Instructor/Adviser */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Timer className="h-5 w-5" />
								Deadlines
							</CardTitle>
							<Badge variant="secondary">{deadlines.length} active</Badge>
						</CardHeader>
						<CardContent className="space-y-3">
							{deadlines.map((deadline) => {
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
											checked={task.completed}
											onCheckedChange={() => toggleTask(task.id)}
										/>
										<div className="flex-1 min-w-0">
											<p
												className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
											>
												{task.text}
											</p>
										</div>
										<Badge variant="outline" className="text-[10px] shrink-0">
											{task.milestone}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Recent Documents */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Recent Documents
							</CardTitle>
							<Link to="/student/documents">
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
					</Card>

					{/* Upcoming Consultations */}
					<Card>
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
					</Card>
				</div>
			</main>
		</>
	);
};

export default Dashboard;
