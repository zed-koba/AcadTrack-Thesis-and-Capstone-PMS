import { useEffect, useRef, useState } from 'react';
import type {
	ProponentsAutoCompleteProps,
	StudentsProponentsProps,
} from '../interface/proponent';
import { Search, User, UserIcon, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const ProponentsAutoComplete = ({
	students,
	selectedStudentsIds,
	initialStudents,
	onSelectionChange,
	placeholder = 'Search students...',
	disabled = false,
	onRemovedIdsChange,
}: ProponentsAutoCompleteProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [removedStudentIds, setRemovedStudentIds] = useState<number[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const filteredStudents = students.filter((stud) => {
		const searchLower = searchQuery.toLowerCase();
		return (
			stud.name.toLowerCase().includes(searchLower) ||
			stud.student_id.toLowerCase().includes(searchLower)
		);
	});

	const selectedStudents = students.filter((s) =>
		selectedStudentsIds.includes(s.id)
	);
	const availableStudents = filteredStudents.filter(
		(s) => !selectedStudentsIds.includes(s.id)
	);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (student: StudentsProponentsProps) => {
		if (!selectedStudentsIds.includes(student.id)) {
			onSelectionChange([...selectedStudentsIds, student.id]);
		}
		if (
			removedStudentIds.includes(student.id) &&
			initialStudents.includes(student.id)
		) {
			const updatedRemoved = removedStudentIds.filter(
				(id) => id !== student.id
			);
			setRemovedStudentIds(updatedRemoved);
			onRemovedIdsChange?.(updatedRemoved);
		}
		setSearchQuery('');
		setOpen(false);
		inputRef.current?.focus();
	};
	const handleRemove = (studentId: number) => {
		onSelectionChange(selectedStudentsIds.filter((id) => id !== studentId));
		if (
			initialStudents.includes(studentId) &&
			!removedStudentIds.includes(studentId)
		) {
			const updatedRemoved = [...removedStudentIds, studentId];
			setRemovedStudentIds(updatedRemoved);
			onRemovedIdsChange?.(updatedRemoved);
		}
	};
	return (
		<div ref={containerRef} className="relative space-y-2">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					ref={inputRef}
					type="text"
					placeholder={placeholder}
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						setOpen(true);
					}}
					onFocus={() => setOpen(true)}
					className="pl-10"
					disabled={disabled}
				/>
			</div>
			{open && searchQuery.length > 0 && (
				<div className="absolute z-50 w-full bg-popover rounded-md shadow-lg">
					<ScrollArea className="max-h-[200px]">
						{availableStudents.length === 0 ? (
							<div className="p-3 text-sm text-muted-foreground text-center">
								{searchQuery.length > 0
									? 'No matching students found'
									: 'Type to search students'}
							</div>
						) : (
							<ul className="py-1">
								{availableStudents.map((student) => (
									<li key={student.id}>
										<button
											type="button"
											onClick={() => handleSelect(student)}
											className={cn(
												'w-full text-left px-3 py-2 hover:bg-card/20 transition-colors',
												'flex items-center justify-between gap-2'
											)}
										>
											<div className="flex items-center gap-2">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/30">
													<User className="h-4 w-4 text-blue-600" />
												</div>
												<div>
													<p className="text-sm font-medium">{student.name}</p>
													<p className="text-xs text-muted-foreground">
														{student.student_id}
													</p>
												</div>
											</div>
										</button>
									</li>
								))}
							</ul>
						)}
					</ScrollArea>
				</div>
			)}
			{selectedStudents.length > 0 && (
				<div className="grid gap-3">
					<h2 className="text-white font-medium text-lg">Members: </h2>
					{selectedStudents.map((student) => (
						<div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
							<div className="flex items-center gap-3 justify-center">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
									<UserIcon className="h-4 w-4" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-muted-foreground ">
										Member
									</p>
									<div className="text-sm font-medium">{student.name}</div>
								</div>
							</div>
							<button
								type="button"
								onClick={() => handleRemove(student.id)}
								className="ml-1 transition-colors"
								disabled={disabled}
							>
								<X className="h-4 w-4 hover:text-destructive text-muted-foreground cursor-pointer" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProponentsAutoComplete;
