import {
	AlertTriangle,
	CalendarClock,
	CheckCircle2,
	ChevronRight,
	FileText,
	GitBranch,
	Users,
} from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { differenceInDays, format } from 'date-fns';

import type { InstructorDashboardProps } from '@/components/Instructor/interface/dashboard';

const AdviserDashboardComponent = ({
	deadlines,
	projects,
	documents,
}: InstructorDashboardProps) => {
	const widgets = [
		{
			label: 'Total Groups',
			value: projects.length,
			icon: Users,
			color: 'bg-primary/10 text-primary',
		},
		{
			label: 'Deadlines',
			value: `${deadlines.length}`,
			icon: FileText,
			color: 'bg-blue-500/10 text-blue-500',
		},
		{
			label: 'Docs Submitted',
			value: `${documents.length}`,
			icon: CheckCircle2,
			color: 'bg-green-500/10 text-green-500',
		},
		{
			label: 'Upcoming (14d)',
			value: deadlines.length,
			icon: CalendarClock,
			color: 'bg-amber-500/10 text-amber-500',
		},
	];
	const navigate = useNavigate();
	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
				{widgets.map((w) => (
					<Card key={w.label} className="p-0">
						<CardContent className="p-3">
							<div className="flex items-center gap-2">
								<div className={`p-1.5 rounded-lg ${w.color}`}>
									<w.icon className="h-4 w-4" />
								</div>
								<div>
									<p className="text-xl font-bold">{w.value}</p>
									<p className="text-[10px] text-muted-foreground leading-tight">
										{w.label}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Upcoming Deadlines */}
				<Card>
					<CardHeader className="pb-2 flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-lg flex items-center gap-2">
								<CalendarClock className="h-5 w-5" />
								Upcoming Deadlines
							</CardTitle>
							<CardDescription>
								Groups with deadlines in the next 14 days
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<ScrollArea className="max-h-[300px]">
							<div className="space-y-2">
								{deadlines.length > 0 ? (
									deadlines.map((g) => {
										const days = differenceInDays(g.deadline, new Date());
										return (
											<div
												key={g.id}
												className={`flex items-center justify-between p-3 rounded-lg border ${days <= 3 ? 'bg-amber-500/5 border-amber-500/30' : 'bg-muted/20'}`}
											>
												<div className="min-w-0">
													<p className="font-medium text-sm truncate">
														{g.document_title}
													</p>
												</div>
												<div className="flex items-center gap-2 shrink-0">
													<div className="text-right">
														<p className="text-xs font-medium">
															{format(g.deadline, 'MMM dd')}
														</p>
														<p
															className={`text-[10px] font-medium ${days <= 3 ? 'text-amber-500' : 'text-muted-foreground'}`}
														>
															{days === 0 ? 'Due today' : `${days}d left`}
														</p>
													</div>
												</div>
											</div>
										);
									})
								) : (
									<div className="text-center py-8 text-muted-foreground">
										<CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
										<p className="text-sm">
											No upcoming deadlines in the next 14 days
										</p>
									</div>
								)}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2 flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-lg flex items-center gap-2">
								<GitBranch className="h-5 w-5" />
								Development Features to Check
							</CardTitle>
							<CardDescription>
								Features approaching or past their target dates
							</CardDescription>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate('/Adviser/Development-Monitoring')}
						>
							View All <ChevronRight className="h-4 w-4 ml-1" />
						</Button>
					</CardHeader>
					<CardContent>
						<ScrollArea className="max-h-[300px]">
							{projects.length > 0 ? (
								<div className="space-y-2">
									{projects.map((project) =>
										project.features
											.sort(
												(a, b) =>
													new Date(a.end_date).getTime() -
													new Date(b.end_date).getTime(),
											)
											.map((item, i) => {
												const days = differenceInDays(
													item.end_date,
													new Date(),
												);
												const isOverdue = days < 0;
												return (
													<div
														key={i}
														className={`flex items-center justify-between p-3 rounded-lg border ${isOverdue ? 'bg-destructive/5 border-destructive/30' : days <= 3 ? 'bg-amber-500/5 border-amber-500/30' : 'bg-muted/20'}`}
													>
														<div className="min-w-0">
															<p className="font-medium text-sm truncate">
																{item.feature}
															</p>
															<p className="text-[10px] text-muted-foreground">
																{project.title}
															</p>
														</div>
														<div className="flex items-center gap-2 shrink-0">
															<div className="text-right">
																<p className="text-xs font-medium">
																	{format(item.end_date, 'MMM dd')}
																</p>
																<p
																	className={`text-[10px] font-medium ${isOverdue ? 'text-destructive' : days <= 3 ? 'text-amber-500' : 'text-muted-foreground'}`}
																>
																	{isOverdue
																		? `${Math.abs(days)}d overdue`
																		: days === 0
																			? 'Due today'
																			: `${days}d left`}
																</p>
															</div>
															{isOverdue && (
																<AlertTriangle className="h-4 w-4 text-destructive" />
															)}
														</div>
													</div>
												);
											}),
									)}
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									<CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
									<p className="text-sm">No features added yet.</p>
								</div>
							)}
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default AdviserDashboardComponent;
