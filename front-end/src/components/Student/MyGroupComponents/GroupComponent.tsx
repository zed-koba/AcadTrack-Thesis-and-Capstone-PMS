import {
	Card,
	CardHeader,
	CardDescription,
	CardContent,
	CardTitle,
} from '@/components/ui/card';
import type { GroupComponentProps } from '../interface/my-group';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	ArrowRightLeft,
	Check,
	Copy,
	Crown,
	LogOut,
	Mail,
	Shield,
	User,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { information, userToken } from '@/components/functions/functions';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { DetailsDocumentsProps } from '@/components/Adviser/interface/adviserdocument';
import TransferLeadership from './TransferLeadership';
import LeaveGroupComponent from './LeaveGroupComponent';
import { apiStudentUrl } from '@/Routes/http';

const GroupComponents = ({ project, roles, refresh }: GroupComponentProps) => {
	const [copied, setCopied] = useState(false);
	const [transferOpen, setTransferOpen] = useState(false);
	const [members] = useState<DetailsDocumentsProps[]>(
		project ? project.details : [],
	);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	if (!project) return;
	const handleCopyCode = () => {
		navigator.clipboard.writeText(project?.proponents_id);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
		toast.info('Copied');
	};
	const isLeader = project?.student_id === information.id;
	const filterRoles = roles.filter(
		(role) =>
			role.department_id === project.group_leader.department_id ||
			(role.department_id === null && role.globalRole === 1),
	);
	// const filterTakenRoles = filterRoles.filter(
	// 	(role) =>
	// 		project.group_leader.role_id !== role.id ||
	// 		project.details.map((d) => d.student.role_id).includes(role.id),
	// );
	console.log(project.group_leader.department_id);
	const handleRole = async (student_id: number, role_id: number) => {
		try {
			const res = await fetch(
				`${apiStudentUrl}/my-group/updateRole/${student_id}`,
				{
					method: 'PUT',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
					body: JSON.stringify({ role_id: role_id }),
				},
			);
			const result = await res.json();
			if (!res.ok) {
				console.log('Failed to fetch data');
				return;
			}
			if (result.status === 200) {
				toast.success(result.message);
				refresh?.();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Card className="mt-6">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg">{project?.title}</CardTitle>
							<CardDescription className="flex items-center gap-2 mt-1">
								<span>
									{project.details.length + 1} active member
									{project.details.length + 1 !== 1 ? 's' : ''}
								</span>
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
						<div className="flex-1">
							<p className="text-xs text-muted-foreground mb-1">Invite Code</p>
							<p className="font-mono font-bold tracking-widest text-lg">
								{project.proponents_id}
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleCopyCode}
							className="gap-2"
						>
							{copied ? (
								<Check className="h-4 w-4 text-green-500" />
							) : (
								<Copy className="h-4 w-4" />
							)}
							{copied ? 'Copied' : 'Copy'}
						</Button>
					</div>
				</CardContent>
			</Card>
			<Card className="mt-6">
				<CardHeader className="pb-0">
					<div className="flex justify-between items-center">
						<div className="flex flex-col gap-1">
							<CardTitle className="text-base flex items-center gap-2">
								<Shield className="h-4 w-4 text-primary" />
								Group Members
							</CardTitle>
							<CardDescription>
								{isLeader
									? 'Assign capstone roles to each member'
									: 'Your group members and their roles'}
							</CardDescription>
						</div>
						<div className="flex gap-2">
							{isLeader && (
								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() => setTransferOpen(true)}
								>
									<ArrowRightLeft className="h-4 w-4" />
									Transfer Leadership
								</Button>
							)}
							<Button
								variant="outline"
								size="sm"
								className="gap-2 text-destructive hover:text-destructive"
								onClick={() => {
									if (isLeader && project.details.length > 1) {
										toast.error(
											'Transfer leadership first before leaving the group.',
										);
									} else {
										setSelectedId(information.id);
									}
								}}
							>
								<LogOut className="h-4 w-4" />
								Leave Group
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div>
							<div className="flex items-center gap-4">
								<div className="h-10 w-10 relative flex shrink-0 overflow-hidden rounded-full">
									<span
										className="text-sm bg-primary/10 text-primary flex h-full w-full items-center justify-center rounded-full 
                                    "
									>
										<User />
									</span>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<p className="font-medium text-sm truncate">
											{project.group_leader.name}
										</p>

										<Badge
											variant="default"
											className="gap-1 text-[10px] px-1.5 py-0"
										>
											<Crown className="h-2.5 w-2.5" /> Leader
										</Badge>
									</div>
									<p className="text-xs text-muted-foreground flex items-center gap-1">
										<Mail className="h-3 w-3" />{' '}
										{project.group_leader.account.email}
									</p>
								</div>
								<div className="w-44 shrink-0">
									<Select
										value={String(
											project.group_leader.role_id
												? project.group_leader.role_id
												: 0,
										)}
										disabled={!isLeader}
										onValueChange={(val) =>
											handleRole(project.group_leader.id, Number(val))
										}
									>
										<SelectTrigger className="h-8 text-xs w-full">
											<SelectValue placeholder="Assign role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="0">Not Assigned</SelectItem>
											{filterRoles.map((r) => (
												<SelectItem
													key={r.id}
													value={String(r.id)}
													className="text-xs"
												>
													{r.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
						{project.details.length > 0 && <Separator className="my-3" />}
						{project.details.map((member, idx) => (
							<div key={member.student_id}>
								{idx > 0 && <Separator className="my-3" />}
								<div className="flex items-center gap-4">
									<div className="h-10 w-10 relative flex shrink-0 overflow-hidden rounded-full">
										<span
											className="text-sm bg-primary/10 text-primary flex h-full w-full items-center justify-center rounded-full 
                                    "
										>
											<User />
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="font-medium text-sm truncate">
												{member.student.name}
											</p>
										</div>
										<p className="text-xs text-muted-foreground flex items-center gap-1">
											<Mail className="h-3 w-3" />{' '}
											{member.student.account.email}
										</p>
									</div>
									<div className="w-44 shrink-0">
										<Select
											value={String(
												member.student.role_id ? member.student.role_id : 0,
											)}
											onValueChange={(val) =>
												handleRole(member.student.id, Number(val))
											}
										>
											<SelectTrigger
												className="h-8 text-xs w-full"
												disabled={!isLeader}
											>
												<SelectValue placeholder="Assign role" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="0">Not Assigned</SelectItem>
												{filterRoles.map((r) => (
													<SelectItem
														key={r.id}
														value={String(r.id)}
														className="text-xs"
													>
														{r.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
			{transferOpen && (
				<TransferLeadership
					members={members}
					refresh={refresh}
					open={transferOpen}
					setOpen={setTransferOpen}
				/>
			)}
			{selectedId && (
				<LeaveGroupComponent
					selectedId={selectedId}
					open={!!selectedId}
					setOpen={() => setSelectedId(null)}
					refresh={refresh}
				/>
			)}
		</>
	);
};

export default GroupComponents;
