import { cn } from '@/lib/utils';
import {
	Calendar,
	Clock,
	Download,
	Eye,
	File,
	FileText,
	MessageCircle,
	MoreVertical,
	User,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
	chapterStatusIcon,
	downloadDocument,
	formatDate,
	formatDateWithTime,
	statusColor,
} from '@/components/functions/functions';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import DocumentViewDialog from './DocumentViewDialog';
import type { ChapterItemProps, DocumentProps } from '../interface/document';

const ChapterItem = ({
	currentDocument,
	projectAdviser,
	refresh,
}: ChapterItemProps) => {
	const [showVersions, setShowVersions] = useState(true);
	const [selectedDocument, setSelectedDocument] =
		useState<DocumentProps | null>(null);
	const [open, setOpen] = useState(false);
	const checkVersion =
		currentDocument.versions.length > 0
			? currentDocument.versions[0]
			: currentDocument;
	const handleDialogChange = (isOpen: boolean) => {
		setOpen(isOpen);

		if (!isOpen) {
			setSelectedDocument(null);
		}
	};
	const checkIfVersionLatest = selectedDocument === checkVersion;
	return (
		<div className="space-y-1">
			<div
				className={cn(
					'flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer',
					checkVersion.version &&
						checkVersion.id === selectedDocument?.id &&
						'bg-primary/20 border border-primary/50 hover:bg-primary/30 ',
				)}
				onClick={() => {
					setSelectedDocument(checkVersion);
					setOpen(true);
				}}
			>
				<FileText className="h-4 w-4 text-muted-foreground shrink-0" />
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium truncate">
							{checkVersion.title_name}
						</span>
						<Badge variant="outline" className="text-[10px] px-1.5 py-0">
							v{checkVersion.version}
						</Badge>
					</div>
					<div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
						<span className="flex gap-1 items-center">
							{checkVersion.original_name}
						</span>
						<span className="flex gap-1 items-center">
							<MessageCircle className="w-3.5 h-3.5" />{' '}
							{checkVersion.comments.length} comment{' '}
							{checkVersion.comments.length > 1 ? 's' : ''}
						</span>
						<span className="flex gap-1 items-center">
							<Calendar className="w-3.5 h-3.5" />{' '}
							{formatDate(checkVersion.created_at)}
						</span>
						<span className="flex gap-1 items-center">
							<User className="w-3.5 h-3.5" /> {checkVersion.student.name}
						</span>
					</div>
				</div>

				<Badge
					className={cn(
						'gap-1 shrink-0 capitalize',
						statusColor[checkVersion.status],
					)}
				>
					{chapterStatusIcon[checkVersion.status] || (
						<FileText className="h-3 w-3" />
					)}
					{checkVersion.status}
				</Badge>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="z-50">
						<DropdownMenuItem>
							<Eye className="h-4 w-4 mr-2" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								downloadDocument(
									currentDocument.id,
									checkVersion.original_name,
								);
							}}
						>
							<Download className="h-4 w-4 mr-2" />
							Download
						</DropdownMenuItem>
						{currentDocument.versions.length > 0 && (
							<DropdownMenuItem
								onClick={(e) => {
									setShowVersions(!showVersions);
									e.stopPropagation();
								}}
							>
								<Clock className="h-4 w-4 mr-2" />
								{showVersions ? 'Hide' : 'Show'} Version History (
								{currentDocument.versions.length})
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Version History */}
			{showVersions && currentDocument.versions.length > 0 && (
				<div className="ml-8 pl-4 border-l-2 border-border space-y-1 cursor-pointer">
					{currentDocument.versions.slice(1).map((version) => {
						const vStatus = statusColor[version.status];
						const VStatusIcon = chapterStatusIcon[version.status];

						return (
							<div
								key={version.id}
								className={cn(
									'flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors text-sm pr-4',
									version.id === selectedDocument?.id &&
										'bg-primary/20 border border-primary/50 hover:bg-primary/30 ',
								)}
								onClick={() => {
									setSelectedDocument(version);
									setOpen(true);
								}}
							>
								<FileText className="h-3 w-3 text-muted-foreground shrink-0" />
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span
											className={cn(
												'text-muted-foreground truncate',
												version.id === selectedDocument?.id && 'text-white',
											)}
										>
											{version.original_name}
										</span>
										<Badge variant="outline" className="text-[10px] px-1 py-0">
											v{version.version}
										</Badge>
									</div>
									<span className="text-xs text-muted-foreground flex items-center gap-3">
										<span className="flex gap-1 items-center">
											{formatDateWithTime(version.created_at)}
										</span>
										<span className="flex gap-1 items-center">
											<MessageCircle className="w-3.5 h-3.5" />
											{version.comments.length} comment
											{version.comments.length > 1 ? 's' : ''}
										</span>
										<span className="flex gap-1 items-center">
											<User className="w-3.5 h-3.5" />{' '}
											{checkVersion.student.name}
										</span>
									</span>
								</div>
								<Badge className={cn('gap-1 text-xs capitalize', vStatus)}>
									{VStatusIcon}
									{version.status}
								</Badge>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6"
									onClick={() =>
										downloadDocument(version.id, version.original_name)
									}
								>
									<Download className="h-3 w-3" />
								</Button>
							</div>
						);
					})}
					<div
						className={cn(
							'flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors text-sm pr-4',
							currentDocument.id === selectedDocument?.id &&
								'bg-primary/20 border border-primary/50 hover:bg-primary/30 ',
						)}
						onClick={() => {
							setSelectedDocument(currentDocument);
							setOpen(true);
						}}
					>
						<FileText className="h-3 w-3 text-muted-foreground shrink-0" />
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<span
									className={cn(
										'text-muted-foreground truncate',
										currentDocument.id === selectedDocument?.id && 'text-white',
									)}
								>
									{currentDocument.original_name}
								</span>
								<Badge variant="outline" className="text-[10px] px-1 py-0">
									v{currentDocument.version}
								</Badge>
							</div>
							<span className="text-xs text-muted-foreground flex items-center gap-3">
								<span className="flex gap-1 items-center">
									{formatDateWithTime(currentDocument.created_at)}
								</span>
								<span className="flex gap-1 items-center">
									<MessageCircle className="w-3.5 h-3.5" />
									{currentDocument.comments.length} comment
									{currentDocument.comments.length > 1 ? 's' : ''}
								</span>
								<span className="flex gap-1 items-center">
									<User className="w-3.5 h-3.5" />{' '}
									{currentDocument.student.name}
								</span>
							</span>
						</div>
						<Badge
							className={cn(
								'gap-1 text-xs capitalize',
								statusColor[currentDocument.status],
							)}
						>
							{chapterStatusIcon[currentDocument.status]}
							{currentDocument.status}
						</Badge>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={() =>
								downloadDocument(
									currentDocument.id,
									currentDocument.original_name,
								)
							}
						>
							<Download className="h-3 w-3" />
						</Button>
					</div>
				</div>
			)}
			{selectedDocument && (
				<DocumentViewDialog
					document={selectedDocument}
					open={open}
					projectAdviser={projectAdviser}
					setOpen={handleDialogChange}
					selectedDocumentId={1}
					refresh={refresh}
					checkIfLatestVersion={checkIfVersionLatest}
				/>
			)}
		</div>
	);
};

export default ChapterItem;
