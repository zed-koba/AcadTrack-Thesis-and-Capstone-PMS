import { to12HourTime } from '@/components/Adviser/interface/consultation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ConsultationCardProps } from '../interface/consultation';
import {
	consultationIcon,
	getDateLabel,
	statusColor,
} from '@/components/functions/functions';
import { User } from 'lucide-react';
const ConsultationCard = ({ weekly, project }: ConsultationCardProps) => {
	const compact = false;
	return (
		<>
			<Card
				className={cn(
					'border-border transition-all hover:border-primary/50 p-0',
					compact && 'bg-muted/30',
				)}
			>
				<CardContent className={cn('p-6', compact && 'p-3')}>
					<div className="flex gap-4">
						{/* Time Block */}
						<div
							className={cn(
								'text-center rounded-lg bg-muted shrink-0',
								compact ? 'py-2 px-3 min-w-[70px]' : 'py-3 px-4 min-w-[90px]',
							)}
						>
							<p
								className={cn(
									'font-bold font-mono text-primary',
									compact ? 'text-base' : 'text-xl',
								)}
							>
								{to12HourTime(weekly.start_time)}
							</p>
							<p className="text-xs text-muted-foreground mt-0.5">
								{project?.adviser.duration} min
							</p>
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<Badge
											variant="outline"
											className={cn(
												'text-xs capitalize',
												statusColor[weekly.status],
											)}
										>
											{consultationIcon[weekly.status]}
											{weekly.status}
										</Badge>
										<span className="text-xs text-muted-foreground">
											{getDateLabel(weekly.date)}
										</span>
									</div>
									<h4
										className={cn(
											'font-medium truncate',
											compact ? 'text-sm' : 'text-base',
										)}
									>
										{weekly.purpose}
									</h4>
									{!compact && (
										<p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
											<User className="h-3 w-3" />
											{project?.adviser.name}
										</p>
									)}
								</div>
							</div>

							{/* Notes */}
							{/* {consultation.notes && !compact && (
								<div className="mt-3 p-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
									{consultation.notes}
								</div>
							)} */}

							{/* Feedback Display */}
							{/* {consultation.feedback && !compact && (
								<div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
									<div className="flex items-center gap-2 mb-1">
										<div className="flex">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={cn(
														'h-4 w-4',
														star <= consultation.feedback!.rating
															? 'fill-amber-400 text-amber-400'
															: 'text-muted',
													)}
												/>
											))}
										</div>
										<span className="text-xs text-muted-foreground">
											Your rating
										</span>
									</div>
									{consultation.feedback.comment && (
										<p className="text-sm text-muted-foreground italic">
											"{consultation.feedback.comment}"
										</p>
									)}
								</div>
							)} */}

							{/* Actions */}
							{/* {!compact && (canLeaveFeedback || canModify) && (
								<div className="flex gap-2 mt-3">
									{canLeaveFeedback && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleOpenFeedback(consultation)}
										>
											<MessageSquare className="h-4 w-4 mr-2" />
											Leave Feedback
										</Button>
									)}
									{canModify && (
										<>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleOpenReschedule(consultation)}
											>
												<RefreshCcw className="h-4 w-4 mr-2" />
												Reschedule
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleOpenCancel(consultation)}
												className="text-destructive hover:text-destructive"
											>
												<X className="h-4 w-4" />
											</Button>
										</>
									)}
								</div>
							)} */}
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default ConsultationCard;
