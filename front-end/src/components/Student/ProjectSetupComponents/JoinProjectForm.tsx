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

import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Check, Loader2, Search } from 'lucide-react';

import { toast } from 'sonner';
import { apiStudentUrl } from '@/Routes/http';
import { getInformation, getUser } from '@/components/functions/functions';
import type { ProjectDetails } from '../interface/project-setup';

interface JoinProjectFormProps {
	onBack: () => void;
	onSuccess: () => void;
	projects: ProjectDetails[];
}

export default function JoinProjectForm({
	onBack,
	onSuccess,
	projects,
}: JoinProjectFormProps) {
	const [code, setCode] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [found, setFound] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const [joined, setJoined] = useState(false);
	const [requested, setRequested] = useState(false);
	const [foundProject, setFoundProject] = useState<
		ProjectDetails | undefined
	>();

	const handleSearch = () => {
		if (code.trim().length < 4) return;
		setIsSearching(true);
		const findProject = projects.find(
			(project) => project.proponents_id === code,
		);
		setTimeout(() => {
			setIsSearching(false);
		}, 1000);
		if (findProject) {
			setFound(true);
			setFoundProject(findProject);
			setNotFound(false);
		} else {
			setFound(false);
			setNotFound(true);
		}
	};
	const handleJoinGroup = async () => {
		const information = getInformation();
		setRequested(true);
		try {
			setIsSearching(true);
			const payLoad = {
				foreign_proponents_id: foundProject?.proponents_id,
				project_id: foundProject?.id,
			};
			const res = await fetch(
				`${apiStudentUrl}/project-setup/joinProject/${information.id}`,
				{
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify(payLoad),
				},
			);
			const result = await res.json();
			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => toast.error(message)),
				);
				return;
			}
			if (!res.ok) {
				console.log('Failed to fetch data ' + JSON.stringify(payLoad));
				return JSON.stringify(payLoad);
			}
			if (result.status === 200) {
				toast.success(result.message);
				setJoined(true);
				const newUser = getUser();
				const updatedUser = {
					...newUser,
					new_user: 0,
				};
				localStorage.setItem('user', JSON.stringify(updatedUser));
				localStorage.setItem('project', JSON.stringify(foundProject));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsSearching(false);
		}
		toast.success('Join request sucessfully sent');
		setTimeout(onSuccess, 2000);
	};
	if (joined) {
		return (
			<Card>
				<CardHeader className="text-center">
					<div className="mx-auto p-3 rounded-full bg-green-500/10 w-fit mb-2">
						<Check className="h-8 w-8 text-green-500" />
					</div>
					<CardTitle>Sucessfully joined a group!</CardTitle>
					<CardDescription>You can proceed to dashboard</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
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
				{notFound && (
					<div className="space-y-4 animate-in fade-in slide-in-from-top-2">
						<div className="flex flex-col gap-2 items-center justify-center">
							<BookOpen className="w-12 h-12 text-muted-foreground" />
							<p className="text-base text-muted-foreground font-medium">
								No matching group found.
							</p>
						</div>
					</div>
				)}
				{found && foundProject && (
					<div className="space-y-4 animate-in fade-in slide-in-from-top-2">
						<Separator />
						<div className="p-4 rounded-lg border bg-card">
							<div className="flex items-center justify-between mb-3">
								<h3 className="font-semibold">{foundProject.title}</h3>
							</div>
							<div className="grid grid-cols-2 gap-3 text-sm">
								<div>
									<span className="text-muted-foreground">Adviser:</span>
									<p className="font-medium">{foundProject.adviser.name}</p>
								</div>
								<div>
									<span className="text-muted-foreground">Instructor:</span>
									<p className="font-medium">
										{foundProject.group_leader.instructor.name}
									</p>
								</div>
								<div>
									<span className="text-muted-foreground">Leader:</span>
									<p className="font-medium">
										{foundProject.group_leader.name}
									</p>
								</div>
								<div>
									<span className="text-muted-foreground">Members:</span>
									<p className="font-medium">
										{foundProject.details.length + 1} member
										{foundProject.details.length + 1 > 1 ? 's' : ''}
									</p>
								</div>
							</div>
						</div>

						<Button
							className="w-full"
							onClick={handleJoinGroup}
							disabled={requested}
						>
							{requested ? (
								<>
									<Check className="h-4 w-4 mr-2" /> Joining Group
								</>
							) : (
								'Join the group'
							)}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
