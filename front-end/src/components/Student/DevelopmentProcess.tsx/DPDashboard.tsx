import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const StudentDPDashboard = () => {
	return (
		<>
			{/* Progress Overview */}
			<Card className="mb-6">
				<CardContent className="pt-5 pb-4">
					<div className="flex items-center justify-between mb-3">
						<div>
							<p className="text-sm font-medium">Overall Progress</p>
							<p className="text-2xl font-bold">{completionPct}%</p>
						</div>
						<div className="flex gap-6 text-center">
							<div>
								<p className="text-xl font-bold text-green-500">{completed}</p>
								<p className="text-[11px] text-muted-foreground">Done</p>
							</div>
							<div>
								<p className="text-xl font-bold text-primary">{inProgress}</p>
								<p className="text-[11px] text-muted-foreground">Active</p>
							</div>
							<div>
								<p className="text-xl font-bold text-muted-foreground">
									{notStarted}
								</p>
								<p className="text-[11px] text-muted-foreground">Pending</p>
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
						{completed} of {features.length} features completed
					</p>
				</CardContent>
			</Card>
		</>
	);
};

export default StudentDPDashboard;
