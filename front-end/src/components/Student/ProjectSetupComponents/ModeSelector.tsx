import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Check, Crown, FolderPlus, Search, Users } from 'lucide-react';

interface ModeSelectorProps {
	onSelect: (mode: 'create' | 'join') => void;
}

const ModeSelector = ({ onSelect }: ModeSelectorProps) => {
	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card
				className="cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all group"
				onClick={() => onSelect('create')}
			>
				<CardHeader className="text-center pb-3">
					<div className="mx-auto p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit">
						<FolderPlus className="h-8 w-8 text-primary" />
					</div>
					<CardTitle className="text-lg">Create New Project</CardTitle>
					<CardDescription>
						Start a new thesis or capstone project and invite your group members
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="space-y-2 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Crown className="h-3.5 w-3.5 text-primary" />
							<span>You become the Group Leader</span>
						</div>
						<div className="flex items-center gap-2">
							<Users className="h-3.5 w-3.5 text-primary" />
							<span>Invite members via code or email</span>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card
				className="cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all group"
				onClick={() => onSelect('join')}
			>
				<CardHeader className="text-center pb-3">
					<div className="mx-auto p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit">
						<Users className="h-8 w-8 text-primary" />
					</div>
					<CardTitle className="text-lg">Join Existing Project</CardTitle>
					<CardDescription>
						Enter a project code to join your group's existing project
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="space-y-2 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Search className="h-3.5 w-3.5 text-primary" />
							<span>Enter project code to find group</span>
						</div>
						<div className="flex items-center gap-2">
							<Check className="h-3.5 w-3.5 text-primary" />
							<span>Leader approves your request</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ModeSelector;
