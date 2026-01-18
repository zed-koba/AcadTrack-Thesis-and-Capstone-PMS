import { cn } from '@/lib/utils';
import {
	CircleCheckBig,
	Clock,
	Download,
	Eye,
	FileExclamationPoint,
	FileText,
	MoreVertical,
} from 'lucide-react';
import { useState, type JSX } from 'react';
import type { DocumentItemProps } from '../../interface/adviserdocument';
import { Badge } from '@/components/ui/badge';
import {
	downloadDocument,
	formatDate,
	formatDateWithTime,
	formatFileSize,
} from '@/components/functions/functions';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const DocumentItem = ({
	currentDocument,
	onSelectDocument,
	refresh,
}: DocumentItemProps) => {
	const [showVersions, setShowVersions] = useState(true);
	const statusColor: Record<string, string> = {
		pending: 'bg-amber-500/20 border-amber-500/40 text-amber-500',
		'under review': 'bg-success/20 border-success/40 text-success',
		'need revision': 'bg-red-500/20 border-red-500/40 text-red-500',
		'approved': 'bg-green-500/20 border-green-500/40 text-green-500',
	};
	const chapterStatusIcon: Record<string, JSX.Element> = {
		pending: <Clock />,
		'under review': <Eye />,
		'need revision': <FileExclamationPoint />,
		'approved': <CircleCheckBig />,
	};

	const checkVersion =
		currentDocument.versions.length > 0
			? currentDocument.versions[0]
			: currentDocument;
	return (
		<div className="space-y-1">
			<div
				className={cn(
					'flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors',
					checkVersion.version &&
						'bg-primary/20 border border-primary/50 hover:bg-primary/30 cursor-pointer',
				)}
				onClick={() => onSelectDocument(checkVersion)}
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
						<span>{checkVersion.original_name}</span>
						<span>{formatFileSize(checkVersion.size)}</span>
						<span>{formatDate(currentDocument.created_at)}</span>
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
							onClick={() =>
								downloadDocument(currentDocument.id, checkVersion.original_name)
							}
						>
							<Download className="h-4 w-4 mr-2" />
							Download
						</DropdownMenuItem>
						{currentDocument.versions.length > 0 && (
							<DropdownMenuItem onClick={() => setShowVersions(!showVersions)}>
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
								className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors text-sm pr-4"
								onClick={() => onSelectDocument(version)}
							>
								<FileText className="h-3 w-3 text-muted-foreground shrink-0" />
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground truncate">
											{version.original_name}
										</span>
										<Badge variant="outline" className="text-[10px] px-1 py-0">
											v{version.version}
										</Badge>
									</div>
									<span className="text-xs text-muted-foreground">
										{formatDateWithTime(version.created_at)}
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
						className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors text-sm pr-4"
						onClick={() => onSelectDocument(currentDocument)}
					>
						<FileText className="h-3 w-3 text-muted-foreground shrink-0" />
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground truncate">
									{currentDocument.original_name}
								</span>
								<Badge variant="outline" className="text-[10px] px-1 py-0">
									v{currentDocument.version}
								</Badge>
							</div>
							<span className="text-xs text-muted-foreground">
								{formatDateWithTime(currentDocument.created_at)}
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
		</div>
	);
};

export default DocumentItem;
