import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, MessageSquare, User } from 'lucide-react';
import type { DocumentCommentsProps } from '../../interface/adviserdocument';
import CommentAddDialog from './CommentAddDialog';
import {
	chapterStatusIcon,
	formatDateWithTime,
	statusColor,
} from '@/components/functions/functions';
import { Spinner } from '@/components/ui/spinner';

const DocumentsComments = ({
	document,
	refresh,
	loading,
}: DocumentCommentsProps) => {
	return (
		<>
			<Card className="border-border">
				<CardHeader className="pb-4 border-b border-border">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-md bg-primary/10">
								<BookOpen className="h-5 w-5 text-primary" />
							</div>
							<div>
								<CardTitle className="text-lg">
									{document?.title_name}
								</CardTitle>
								<p className="text-sm text-muted-foreground mt-0.5">
									v{document?.version} •{' '}
									<Calendar className="h-3 w-3 inline-block mb-0.5" />{' '}
									{formatDateWithTime(document?.created_at as string)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<CommentAddDialog document={document} refresh={refresh} />
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<ScrollArea className="h-[670px] p-4 pb-0">
						{/* Existing Comments */}
						{document?.comments.length === 0 ? (
							<div className="flex flex-col justify-center items-center h-48 text-center text-muted-foreground">
								<MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
								No comments yet. Add the first comment for documentation.
							</div>
						) : (
							<Card className="border-none shadow-none py-0 pb-3">
								<CardHeader className="pr-0 pl-0">
									<CardTitle className="text-base">Comment History</CardTitle>
								</CardHeader>
								<CardContent className="pr-0 pl-0 flex flex-col gap-3">
									{loading && (
										<div className="text-center flex justify-center items-center text-muted-foreground py-8">
											<Spinner className="h-8 w-8" />
										</div>
									)}
									{!loading && (
										<div className="space-y-4">
											{document?.comments
												.slice()
												.reverse()
												.map((com) => (
													<div className="p-4 rounded-lg border border-border bg-muted/30">
														<div className="flex items-start justify-between mb-2">
															<div className="flex items-center gap-2">
																<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
																	<User className="h-4 w-4 text-primary" />
																</div>
																<div>
																	<p className="text-sm font-medium">
																		Romnick Reyes
																	</p>
																	<p className="text-xs text-muted-foreground">
																		{formatDateWithTime(com.created_at)}
																	</p>
																</div>
															</div>
															<Badge
																variant="outline"
																className={cn(
																	'text-xs capitalize',
																	statusColor[document.status || 'pending'],
																)}
															>
																{
																	chapterStatusIcon[
																		document.status || 'pending'
																	]
																}
																{document.status}
															</Badge>
														</div>
														<p className="text-sm pl-10">{com.comment}</p>
													</div>
												))}
										</div>
									)}
								</CardContent>
							</Card>
						)}
					</ScrollArea>
				</CardContent>
			</Card>
		</>
	);
};

export default DocumentsComments;
