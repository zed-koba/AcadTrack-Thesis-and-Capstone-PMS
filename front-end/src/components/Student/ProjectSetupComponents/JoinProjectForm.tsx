import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, Loader2, Search } from 'lucide-react';
import type { ProponentsProps } from '@/components/Admin/interface/proponent';
import { toast } from 'sonner';

interface JoinProjectFormProps {
	onBack: () => void;
	onSuccess: () => void;
	projects: ProponentsProps[];
}

export default function JoinProjectForm({
	onBack,
	onSuccess,
	projects,
}: JoinProjectFormProps) {
	const [code, setCode] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [found, setFound] = useState(false);
	const [requested, setRequested] = useState(false);

	const handleSearch = () => {
		if (code.trim().length < 4) return;
		setIsSearching(true);
		setTimeout(() => {
			setIsSearching(false);
			setFound(true);
		}, 1000);
	};

	const handleRequestJoin = () => {
		setRequested(true);
		toast.success('Join request sucessfully sent');
		setTimeout(onSuccess, 2000);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={onBack}
						className="h-8 w-8"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<CardTitle>Join Existing Project</CardTitle>
						<CardDescription>
							Enter the project code shared by your Group Leader
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-5">
				<div className="space-y-2">
					<Label>Project Code</Label>
					<div className="flex gap-2">
						<Input
							placeholder="e.g., P-0000001"
							value={code}
							onChange={(e) => {
								setCode(e.target.value.toUpperCase());
								setFound(false);
								setRequested(false);
							}}
							className="font-mono tracking-wider"
						/>
						<Button
							onClick={handleSearch}
							disabled={code.trim().length < 4 || isSearching}
						>
							{isSearching ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Search className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				{found && (
					<div className="space-y-4 animate-in fade-in slide-in-from-top-2">
						<Separator />
						<div className="p-4 rounded-lg border bg-card">
							<div className="flex items-center justify-between mb-3">
								<h3 className="font-semibold">
									AcadTrack: Academic Progress Tracking System
								</h3>
								<Badge variant="secondary">Capstone</Badge>
							</div>
							<div className="grid grid-cols-2 gap-3 text-sm">
								<div>
									<span className="text-muted-foreground">Adviser:</span>
									<p className="font-medium">Dr. Maria Rodriguez</p>
								</div>
								<div>
									<span className="text-muted-foreground">Instructor:</span>
									<p className="font-medium">Prof. Carlos Garcia</p>
								</div>
								<div>
									<span className="text-muted-foreground">Leader:</span>
									<p className="font-medium">Juan Dela Cruz</p>
								</div>
								<div>
									<span className="text-muted-foreground">Members:</span>
									<p className="font-medium">3 members</p>
								</div>
							</div>
						</div>

						<Button
							className="w-full"
							onClick={handleRequestJoin}
							disabled={requested}
						>
							{requested ? (
								<>
									<Check className="h-4 w-4 mr-2" /> Request Sent
								</>
							) : (
								'Request to Join'
							)}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
