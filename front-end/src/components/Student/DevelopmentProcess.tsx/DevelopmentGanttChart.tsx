import { ScrollArea } from '@/components/ui/scroll-area';
import {
	getDevelopmentHealth,
	type DevelopmentGanttChartProps,
} from '../interface/developmentprocess';
import { AlertTriangle, Check, Circle, Clock } from 'lucide-react';
import {
	addDays,
	differenceInDays,
	endOfMonth,
	format,
	max,
	min,
	startOfMonth,
} from 'date-fns';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const statusConfig = {
	completed: {
		label: 'Completed',
		icon: Check,
		barClass: 'bg-green-500',
		bgClass: 'bg-green-500/15',
		textClass: 'text-green-500',
	},
	checked: {
		label: 'Checked',
		icon: Check,
		barClass: 'bg-emerald-600',
		bgClass: 'bg-emerald-600/15',
		textClass: 'text-emerald-500',
	},

	overdue: {
		label: 'Overdue',
		icon: AlertTriangle,
		barClass: 'bg-destructive',
		bgClass: 'bg-destructive/15',
		textClass: 'text-destructive',
	},
	'in-progress': {
		label: 'In Progress',
		icon: Clock,
		barClass: 'bg-primary',
		bgClass: 'bg-primary/15',
		textClass: 'text-primary',
	},
	'not-started': {
		label: 'Not Started',
		icon: Circle,
		barClass: 'bg-muted-foreground/40',
		bgClass: 'bg-muted/30',
		textClass: 'text-muted-foreground',
	},
};
function getConfig(health: string, status: string) {
	if (health === 'in-progress' && status === 'not-started')
		return statusConfig['not-started'];
	return (
		statusConfig[health as keyof typeof statusConfig] ||
		statusConfig['not-started']
	);
}
const DevelopmentGanttChart = ({
	developments,
}: DevelopmentGanttChartProps) => {
	if (developments.length === 0) {
		return (
			<div className="text-center py-16 text-muted-foreground">
				<GitBranchPlaceholder />
				<p className="mt-3 text-sm">
					No features added yet. Add your first feature to see the timeline.
				</p>
			</div>
		);
	}
	const allDates = developments.flatMap((f) => {
		const dates = [f.start_date, f.end_date];
		if (f.completed_date) dates.push(f.completed_date);
		return dates;
	});
	allDates.push(new Date());
	const rawStart = min(allDates);
	const rawEnd = max(allDates);
	const chartStart = addDays(startOfMonth(rawStart), 0);
	const chartEnd = endOfMonth(rawEnd);
	const totalDays = Math.max(differenceInDays(chartEnd, chartStart), 1);
	const months: { label: string; pos: number; width: number }[] = [];
	const cur = new Date(chartStart);
	const getPos = (date: Date) =>
		Math.max(
			0,
			Math.min(100, (differenceInDays(date, chartStart) / totalDays) * 100),
		);
	const getWidth = (s: Date, e: Date) =>
		Math.max(0.5, (differenceInDays(e, s) / totalDays) * 100);
	cur.setDate(1);
	while (cur <= chartEnd) {
		const monthEnd = endOfMonth(cur);
		const clampedStart = cur < chartStart ? chartStart : cur;
		const clampedEnd = monthEnd > chartEnd ? chartEnd : monthEnd;
		const pos = getPos(clampedStart);
		const endPos = getPos(clampedEnd);
		months.push({ label: format(cur, 'MMMM yyyy'), pos, width: endPos - pos });
		cur.setMonth(cur.getMonth() + 1);
		cur.setDate(1);
	}
	const weeks: { label: string; pos: number; width: number }[] = [];
	const todayPos = getPos(new Date());
	for (const month of months) {
		// Find the actual month start from the label
		const monthDate = new Date(month.label.replace(' ', ' 1, '));
		const mStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
		const mEnd = endOfMonth(mStart);
		const weekStarts = [1, 8, 15, 22];
		for (let wi = 0; wi < weekStarts.length; wi++) {
			const wStart = new Date(
				mStart.getFullYear(),
				mStart.getMonth(),
				weekStarts[wi],
			);
			const wEnd =
				wi < weekStarts.length - 1
					? new Date(
							mStart.getFullYear(),
							mStart.getMonth(),
							weekStarts[wi + 1] - 1,
						)
					: mEnd;
			if (wStart > chartEnd || wEnd < chartStart) continue;
			const clampedWStart = wStart < chartStart ? chartStart : wStart;
			const clampedWEnd = wEnd > chartEnd ? chartEnd : wEnd;
			const wPos = getPos(clampedWStart);
			const wEndPos = getPos(addDays(clampedWEnd, 1));
			weeks.push({
				label: `W${wi + 1}`,
				pos: wPos,
				width: Math.max(0, wEndPos - wPos),
			});
		}
	}
	return (
		<>
			<ScrollArea className="w-full">
				<div className="min-w-[700px]">
					{/* Legend */}
					<div className="flex flex-wrap gap-4 text-xs mb-5 pb-3 border-b border-border">
						{Object.entries(statusConfig).map(([key, cfg]) => (
							<div key={key} className="flex items-center gap-1.5">
								<div className={`w-3 h-3 rounded-full ${cfg.barClass}`} />
								<span className="text-muted-foreground">{cfg.label}</span>
							</div>
						))}
						<div className="flex items-center gap-1.5 ml-auto">
							<div className="w-px h-3 bg-primary" />
							<span className="text-primary text-[10px] font-medium">
								Today
							</span>
						</div>
					</div>

					{/* Month header */}
					<div className="ml-[200px] relative h-7 border-b border-border">
						{months.map((m, i) => (
							<div
								key={i}
								className="absolute flex items-center text-xs font-semibold justify-center text-foreground border-l border-border pl-2 h-full"
								style={{ left: `${m.pos}%`, width: `${m.width}%` }}
							>
								{m.label}
							</div>
						))}
					</div>

					{/* Week header */}
					<div className="ml-[200px] relative h-6 mb-1 border-b border-border/50">
						{weeks.map((w, i) => (
							<div
								key={i}
								className="absolute flex items-center justify-center text-[10px] font-medium text-muted-foreground border-l border-border/40 h-full"
								style={{ left: `${w.pos}%`, width: `${w.width}%` }}
							>
								{w.label}
							</div>
						))}
					</div>

					{/* Feature rows */}
					<div className="space-y-1">
						{developments.map((f, idx) => {
							const health = getDevelopmentHealth(f);
							const cfg = getConfig(health, f.status);
							const Icon = cfg.icon;
							const left = getPos(f.start_date);
							const end =
								f.status === 'completed' && f.completed_date
									? f.completed_date
									: f.end_date;
							const barWidth = getWidth(f.start_date, end);

							// Progress fill for in-progress items
							let fillWidth = barWidth;
							if (f.status === 'in-progress') {
								const elapsed = differenceInDays(new Date(), f.start_date);
								const total = differenceInDays(f.end_date, f.start_date);
								const pct = Math.min(1, Math.max(0, elapsed / total));
								fillWidth = barWidth * pct;
							}

							const daysLeft = differenceInDays(f.end_date, new Date());
							const tooltipText =
								f.status === 'completed'
									? `Completed ${f.completed_date ? format(f.completed_date, 'MMM dd, yyyy') : ''}`
									: health === 'overdue'
										? `${Math.abs(daysLeft)} days overdue`
										: f.status === 'not-started'
											? `Starts ${format(f.start_date, 'MMMM dd')} | ${daysLeft} days until deadline`
											: `${daysLeft} days remaining`;

							return (
								<div
									key={f.id}
									className={`flex items-center gap-0 rounded-lg transition-colors ${idx % 2 === 0 ? 'bg-muted/20' : ''}`}
								>
									{/* Feature label */}
									<div className="w-[200px] shrink-0 px-3 py-2.5">
										<div className="flex items-center gap-2">
											<div
												className={`flex items-center justify-center w-5 h-5 rounded-full ${cfg.bgClass}`}
											>
												<Icon className={`h-3 w-3 ${cfg.textClass}`} />
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-sm font-medium truncate">
													{f.feature}
												</p>
												<p className="text-[11px] text-muted-foreground">
													{format(f.start_date, 'MMM dd')} →{' '}
													{format(f.end_date, 'MMM dd')}
												</p>
											</div>
										</div>
									</div>

									{/* Chart area */}
									<div className="flex-1 relative h-10 py-1">
										{/* Week grid lines */}
										{weeks.map((w, i) => (
											<div
												key={`w-${i}`}
												className="absolute top-0 bottom-0 w-px bg-border/20"
												style={{ left: `${w.pos}%` }}
											/>
										))}
										{/* Month grid lines */}
										{months.map((m, i) => (
											<div
												key={i}
												className="absolute top-0 bottom-0 w-px bg-border/50"
												style={{ left: `${m.pos}%` }}
											/>
										))}

										{/* Today marker */}
										<div
											className="absolute top-0 bottom-0 w-0.5 bg-primary/70 z-10"
											style={{ left: `${todayPos}%` }}
										/>

										{/* Background track */}
										<Tooltip>
											<TooltipTrigger asChild>
												<div
													className="absolute top-1.5 h-5 cursor-pointer"
													style={{ left: `${left}%`, width: `${barWidth}%` }}
												>
													{/* Track bg */}
													<div
														className={`absolute inset-0 rounded-md ${cfg.barClass} border border-border/20`}
													/>
													{/* Fill */}
													<div
														className={`absolute top-0 left-0 h-full rounded-md ${cfg.barClass} transition-all duration-500`}
														style={{
															width:
																f.status === 'in-progress'
																	? `${(fillWidth / barWidth) * 100}%`
																	: '100%',
														}}
													/>
													{/* Label inside bar */}
													{barWidth > 8 && (
														<span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white drop-shadow-sm z-10">
															{f.status === 'completed'
																? 'Done'
																: f.status === 'in-progress'
																	? `${Math.round((fillWidth / barWidth) * 100)}%`
																	: 'Not Started'}
														</span>
													)}
												</div>
											</TooltipTrigger>
											<TooltipContent
												side="top"
												className="text-xs max-w-[200px]"
											>
												<p className="font-medium text-white">{f.feature}</p>
												<p className="text-muted-foreground">{tooltipText}</p>
											</TooltipContent>
										</Tooltip>

										{/* Overdue extension */}
										{health === 'overdue' && (
											<div
												className="absolute top-1.5 h-5 rounded-r-md bg-destructive/20 border-r-2 border-destructive border-dashed"
												style={{
													left: `${getPos(f.end_date)}%`,
													width: `${getWidth(f.end_date, new Date())}%`,
												}}
											/>
										)}
									</div>
								</div>
							);
						})}
					</div>

					{/* Today label */}
					<div className="relative h-5 mt-0.5 ml-[200px]">
						<span
							className="absolute text-[10px] text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded-sm"
							style={{ left: `${todayPos}%`, transform: 'translateX(-50%)' }}
						>
							Today · {format(new Date(), 'MMM dd')}
						</span>
					</div>
				</div>
			</ScrollArea>
		</>
	);
};

const GitBranchPlaceholder = () => {
	return (
		<div className="flex justify-center">
			<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
				<Clock className="h-8 w-8 text-muted-foreground" />
			</div>
		</div>
	);
};

export default DevelopmentGanttChart;
