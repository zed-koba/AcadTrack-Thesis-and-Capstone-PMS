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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, Copy, Crown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AdviserProps } from '@/components/Admin/interface/adviser';
import type { InstructorProps } from '@/components/Admin/interface/instructor';

interface CreateProjectFormProps {
	onBack: () => void;
	onSuccess: () => void;
	advisers: AdviserProps[];
	instructors: InstructorProps[];
}

export default function CreateProjectForm({
	onBack,
	onSuccess,
	advisers,
	instructors,
}: CreateProjectFormProps) {
	const [projectName, setProjectName] = useState('');
	const [adviserId, setAdviserId] = useState('');
	const [instructorId, setInstructorId] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [created, setCreated] = useState(false);
	const [generatedCode] = useState(() => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		return Array.from(
			{ length: 8 },
			() => chars[Math.floor(Math.random() * chars.length)],
		).join('');
	});
	const [copied, setCopied] = useState(false);

	const canSubmit = projectName.trim() && adviserId && instructorId;

	const handleCreate = () => {
		if (!canSubmit) return;
		setIsSubmitting(true);
		setTimeout(() => {
			setIsSubmitting(false);
			setCreated(true);
			toast.success('Sucessfully created thesis group');
		}, 1200);
	};

	const handleCopyCode = () => {
		navigator.clipboard.writeText(generatedCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
		toast.info('Copied');
	};

	if (created) {
		return (
			<Card>
				<CardHeader className="text-center">
					<div className="mx-auto p-3 rounded-full bg-green-500/10 w-fit mb-2">
						<Check className="h-8 w-8 text-green-500" />
					</div>
					<CardTitle>Project Created Successfully!</CardTitle>
					<CardDescription>
						Share this code with your group members so they can join
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-muted">
						<span className="text-2xl font-mono font-bold tracking-widest">
							{generatedCode}
						</span>
						<Button variant="ghost" size="icon" onClick={handleCopyCode}>
							{copied ? (
								<Check className="h-4 w-4 text-green-500" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>
					<Button className="w-full" onClick={onSuccess}>
						Go to Dashboard
					</Button>
				</CardContent>
			</Card>
		);
	}

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
						<CardTitle>Create New Project</CardTitle>
						<CardDescription>
							Fill in your project details to get started
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-5">
				<div className="space-y-2">
					<Label>Project Name</Label>
					<Input
						placeholder="e.g., Student Progress Tracking System"
						value={projectName}
						onChange={(e) => setProjectName(e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label>Proposed Adviser</Label>
					<Select value={adviserId} onValueChange={setAdviserId}>
						<SelectTrigger>
							<SelectValue placeholder="Select adviser" />
						</SelectTrigger>
						<SelectContent>
							{advisers.map((a) => (
								<SelectItem key={a.id} value={String(a.id)}>
									{a.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>Assigned Instructor</Label>
					<Select value={instructorId} onValueChange={setInstructorId}>
						<SelectTrigger>
							<SelectValue placeholder="Select instructor" />
						</SelectTrigger>
						<SelectContent>
							{instructors.map((i) => (
								<SelectItem key={i.id} value={String(i.id)}>
									{i.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Separator />

				<div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
					<p className="flex items-center gap-2">
						<Crown className="h-4 w-4 text-primary" />
						You will be assigned as the{' '}
						<strong className="text-foreground">Group Leader</strong>
					</p>
				</div>

				<Button
					className="w-full"
					onClick={handleCreate}
					disabled={!canSubmit || isSubmitting}
				>
					{isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
					Create Project
				</Button>
			</CardContent>
		</Card>
	);
}
