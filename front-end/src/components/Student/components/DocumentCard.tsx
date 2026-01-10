import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, MessageSquare } from 'lucide-react';

const DocumentCard = () => {
	return (
		<>
			<Card className="hover:shadow-md transition-shadow">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-primary/10">
								<FileText className="h-5 w-5 text-primary" />
							</div>
							<div>
								<CardTitle className="text-base">Thesis Chapter 1</CardTitle>
								<p className="text-xs text-muted-foreground mt-1">
									Version 1 • Submitted Jan 9, 2026
								</p>
							</div>
						</div>
						<div className="py-0.5 px-3 flex gap-1 items-center text-amber-500 bg-amber-500/20  rounded-full">
							<Clock className="h-3 w-3" />
							<p className="text-xs font-medium">Pending</p>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
						asdaas
					</p>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<span className="flex items-center gap-1">
								<MessageSquare className="h-4 w-4" />5 comments
							</span>
							<span className="flex items-center gap-1"></span>
						</div>
						<Button variant="outline" size="sm">
							View Details
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default DocumentCard;
