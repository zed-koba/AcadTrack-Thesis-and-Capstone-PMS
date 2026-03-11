import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import type { DevelopmentMonitoringContentProps } from '../interface/development-process';
import { Progress } from '@/components/ui/progress';
import {
	AlertTriangle,
	Check,
	CheckCircle2,
	Circle,
	CircleCheck,
	CircleX,
	Clock,
} from 'lucide-react';
import DevelopmentGanttChart from '@/components/Student/DevelopmentProcess.tsx/DevelopmentGanttChart';
import {
	getDevelopmentHealth,
	type DevelopmentProcessProps,
} from '@/components/Student/interface/developmentprocess';
import { differenceInDays, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiInstructorUrl } from '@/Routes/http';
import { getUserToken } from '@/components/functions/functions';

const DPMonitoringContent = ({
	project,
	developments,
	refresh,
}: DevelopmentMonitoringContentProps) => {
	const userToken = getUserToken();
	const progress = developments.filter(
		(development) =>
			development.status === 'checked' || development.status === 'completed',
	).length;
	const checkedDevelopmentProcess = developments.filter(
		(development) => development.status === 'checked',
	);

	const notStarted = developments.filter(
		(development) => development.status === 'not-started',
	).length;
	const overdue = developments.filter(
		(development) => development.status === 'overdue',
	).length;
	const inProgress = developments.filter(
		(development) => development.status === 'in-progress',
	).length;
	const completionPct =
		developments.length > 0
			? Math.round((progress / developments.length) * 100)
			: 0;
	const statusInfo: Record<
		string,
		{
			label: string;
			icon: React.ComponentType<{ className?: string }>;
			classes: string;
		}
	> = {
		completed: {
			label: 'Completed',
			icon: Check,
			classes: 'bg-green-500/15 text-green-500 border-green-500/30',
		},
		'completed-late': {
			label: 'Completed Late',
			icon: Check,
			classes: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
		},
		checked: {
			label: 'Checked ',
			icon: CircleCheck,
			classes: 'bg-emerald-600/15 text-emerald-600 border-green-600/30',
		},
		'in-progress': {
			label: 'In Progress',
			icon: Clock,
			classes: 'bg-primary/15 text-primary border-primary/30',
		},
		'not-started': {
			label: 'Not Started',
			icon: Circle,
			classes: 'bg-muted text-muted-foreground border-border',
		},
	};
	const handleMarkasComplete = async (development: DevelopmentProcessProps) => {
		const checkStatus =
			development.status === 'completed' ||
				development.status === 'completed-late'
				? 'checked'
				: development.status === 'checked'
					? 'completed'
					: '';
		try {
			const res = await fetch(
				`${apiInstructorUrl}/development-process/update/${development.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
					body: JSON.stringify({ status: checkStatus }),
				},
			);
			const result = await res.json();
			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => toast.error(message)),
				);
				return;
			}
			if (!res.ok) {
				console.log('Failed to fetch data');
				return;
			}
			if (result.status === 200) {
				toast.success(result.message);

				refresh?.();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Card className="p-0 mb-6 mt-2">
				<CardContent className="pt-5 pb-4">
					<div className="flex items-center justify-between mb-3">
						<div>
							<p className="text-sm font-medium">Overall Progress</p>
							<p className="text-2xl font-bold">{completionPct}%</p>
						</div>
						<div className="flex gap-6 text-center">
							<div>
								<p className="text-xl font-bold text-green-500">
									{checkedDevelopmentProcess.length}
								</p>
								<p className="text-[11px] text-muted-foreground">Checked</p>
							</div>
							<div>
								<p className="text-xl font-bold text-emerald-600">{progress}</p>
								<p className="text-[11px] text-muted-foreground">Completed</p>
							</div>
							<div>
								<p className="text-xl font-bold text-primary">{inProgress}</p>
								<p className="text-[11px] text-muted-foreground">In Progress</p>
							</div>
							<div>
								<p className="text-xl font-bold text-muted-foreground">
									{notStarted}
								</p>
								<p className="text-[11px] text-muted-foreground">Not Started</p>
							</div>
							{overdue > 0 && (
								<div>
									<p className="text-xl font-bold text-destructive">
										{overdue}
									</p>
									<p className="text-[11px] text-muted-foreground">Overdue</p>
								</div>
							)}
						</div>
					</div>
					<Progress value={completionPct} className="h-2" />
					<p className="text-[11px] text-muted-foreground mt-1.5">
						{progress} of {developments.length} features completed
					</p>
				</CardContent>
			</Card>
			<Card className="mb-6">
				<CardHeader className="pb-2 flex justify-between">
					<div className="flex flex-col">
						<CardTitle className="text-lg">
							{project?.title} - Development Timeline
						</CardTitle>
						<CardDescription>
							Visual overview of all features. Hover on bars for details. The
							vertical line marks today.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<DevelopmentGanttChart developments={developments} />
				</CardContent>
			</Card>
			{/* Feature List */}
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg">Feature List</CardTitle>
						<p className="text-xs text-muted-foreground">
							{developments.length} features
						</p>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{developments.length === 0 && (
							<div className="text-center py-12">
								<Circle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
								<p className="text-muted-foreground">No features added yet.</p>
							</div>
						)}
						{developments.map((f) => {
							const health = getDevelopmentHealth(f);
							const isOverdue = health === 'overdue';
							const isComplete = health === 'completed';
							const inProgress = f.status === 'in-progress';
							const isChecked = f.status === 'checked';
							const isCompletedLate = health === 'completed-late';
							const si = statusInfo[health];
							const Icon = si.icon;
							const daysLeft = differenceInDays(f.end_date, new Date());

							return (
								<div
									key={f.id}
									className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${isOverdue
											? 'border-destructive/30 bg-destructive/5'
											: 'border-border bg-card hover:bg-accent/5'
										} ${isChecked && 'border-emerald-600/30 bg-emerald-600/5'}`}
								>
									<div
										className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${isComplete
												? 'bg-green-500/15'
												: isOverdue
													? 'bg-destructive/15'
													: inProgress
														? 'bg-primary/15'
														: isChecked
															? 'bg-emerald-600/15'
															: 'bg-muted'
											}`}
									>
										{isComplete ? (
											<Check className="h-4 w-4 text-green-500" />
										) : isOverdue ? (
											<AlertTriangle className="h-4 w-4 text-destructive" />
										) : inProgress ? (
											<Clock className="h-4 w-4 text-primary" />
										) : isChecked ? (
											<CircleCheck className="h-4 w-4 text-emerald-600" />
										) : (
											<Icon className="h-4 w-4 text-muted-foreground" />
										)}
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p
												className={`font-medium text-sm truncate ${isComplete || isCompletedLate ? 'line-through text-muted-foreground' : ''}`}
											>
												{f.feature}
											</p>
											<Badge
												variant="outline"
												className={`text-[10px] ${si.classes}`}
											>
												{isOverdue ? 'Overdue' : si.label}
											</Badge>
										</div>

										<div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
											<span>
												{format(f.start_date, 'MMM dd')} →{' '}
												{format(f.end_date, 'MMM dd, yyyy')}
											</span>
											{f.completed_date && (
												<span className="text-green-500">
													✓ Done {format(f.completed_date, 'MMM dd')}
												</span>
											)}
											{!isComplete && !isOverdue && !isChecked && daysLeft >= 0 && (
												<span>{daysLeft}d left</span>
											)}
											{isOverdue && (
												<span className="text-destructive font-medium">
													{Math.abs(daysLeft)}d overdue
												</span>
											)}
										</div>
									</div>
									{isComplete && (
										<div className="flex items-center gap-1 shrink-0">
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8 hover:bg-transparent"
														onClick={() => handleMarkasComplete(f)}
													>
														{f.status === 'checked' ? (
															<CircleX className="h-4 w-4 text-red-500" />
														) : (
															<CheckCircle2 className="h-4 w-4 text-green-500" />
														)}
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													{f.status === 'checked'
														? 'Mark as uncheck'
														: 'Mark as checked'}
												</TooltipContent>
											</Tooltip>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default DPMonitoringContent;
