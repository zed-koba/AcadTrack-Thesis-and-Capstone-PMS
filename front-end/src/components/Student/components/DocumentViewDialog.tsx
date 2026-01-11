import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { DocumentViewDialogProps } from '../interface/document';
import { FileText, MessageSquare, History, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDate } from '@/components/functions/functions';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const DocumentViewDialog = ({
	document,
	open,
	setOpen,
}: DocumentViewDialogProps) => {
	if (!document) return;
	const commentsColorType = {
		general: 'bg-primary/10 text-primary',
		'revision-request': 'bg-red-500/10 text-red-500',
		approval: 'bg-green-500/10 text-green-500',
	};
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="text-white sm:max-w-[700px] max-h-[85vh]">
					<DialogHeader>
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-primary/10">
								<FileText className="h-5 w-5 text-primary" />
							</div>
							<div>
								<DialogTitle>{document.title_name}</DialogTitle>
								<p className="text-sm text-muted-foreground">
									Version 1 | Last Updated {formatDate(document.updated_at)}
								</p>
							</div>
						</div>
					</DialogHeader>
					<Tabs defaultValue="comments" className="mt-4">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="comments" className="gap-2">
								<MessageSquare className="h-4 w-4" />
								Comments (1)
							</TabsTrigger>
							<TabsTrigger value="versions" className="gap-2">
								<History className="h-4 w-4" />
								Versions (2)
							</TabsTrigger>
						</TabsList>
						<ScrollArea className="h-[400px] mt-4">
							<TabsContent value="comments" className="space-y-4 m-0">
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="font-medium text-sm">
													Romnick Reyes
												</span>
												<div
													className={cn(
														'py-0.5 px-3 flex gap-1 items-center text-primary bg-primary/20  rounded-full',
														commentsColorType['general']
													)}
												>
													<p className="text-xs font-medium capitalize">
														General
													</p>
												</div>
											</div>
											<span className="text-xs text-muted-foreground">
												{formatDate(document.created_at)}
											</span>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-sm">asdsda</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="font-medium text-sm">
													Romnick Reyes
												</span>
												<div
													className={cn(
														'py-0.5 px-3 flex gap-1 items-center text-primary  rounded-full',
														commentsColorType['revision-request']
													)}
												>
													<p className="text-xs font-medium capitalize">
														Need Revision
													</p>
												</div>
											</div>
											<span className="text-xs text-muted-foreground">
												{formatDate(document.created_at)}
											</span>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-sm">Revise</p>
									</CardContent>
								</Card>
							</TabsContent>
						</ScrollArea>
					</Tabs>
					<Separator className="my-1" />

					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Close
						</Button>
						<Button>
							<Download className="h-4 w-4 mr-2" />
							Download Latest
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DocumentViewDialog;
