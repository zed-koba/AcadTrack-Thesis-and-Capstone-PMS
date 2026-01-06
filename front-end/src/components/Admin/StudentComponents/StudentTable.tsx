import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
} from '@/components/ui/input-group';
import {
	Search,
	PencilRuler,
	ReceiptText,
	Trash,
	MoreHorizontal,
	PowerOff,
} from 'lucide-react';

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { formatDate } from '@/components/functions/functions';

import {
	type DepartmentStudentsProps,
	type ProgramsStudentsProps,
	type RolesStudentsProps,
	type StudentProps,
	type StudentsTableProps,
} from '../interface/student';
import StudentAdd from './StudentAdd';
import StudentEdit from './StudentEdit';
import StudentDetails from './StudentDetails';
import StudentDelete from './StudentDelete';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

type SortField = keyof StudentProps;
type SortDirection = 'asc' | 'desc';
type SelectedType = 'role' | 'program' | 'department';
const ITEMS_PER_PAGE = 10;

const StudentTable = ({
	students,
	departments,
	roles,
	programs,
	loading,
	refresh,
}: StudentsTableProps) => {
	const [selectedStudent, setSelectedStudent] = useState<StudentProps | null>(
		null
	);
	const [selectedDepartment, setSelectedDepartment] =
		useState<DepartmentStudentsProps | null>(null);
	const [selectedRole, setSelectedRole] = useState<RolesStudentsProps | null>(
		null
	);
	const [selectedProgram, setSelectedProgram] =
		useState<ProgramsStudentsProps | null>(null);
	const [studentId, setStudentId] = useState<number | null>(null);
	const [clickedButton, setClickedButton] = useState<string | null>(null);
	const [sortField, setSortField] = useState<SortField>('created_at');
	const [sortDirection, setSortDrection] = useState<SortDirection>('desc');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [open, setOpen] = useState(false);
	//console.log(students);
	const filteredStudents = students.filter((stud) => {
		const searchLower = searchTerm.toLowerCase();
		const yearLevelLabel = stud.year_level === 3 ? '3rd Year' : '4th Year';
		const semesterLabel =
			stud.semester === 1
				? '1st Semester'
				: stud.semester === 2
					? '2nd Semester'
					: '';
		return (
			stud.name.toLowerCase().includes(searchLower) ||
			stud.student_id.toLowerCase().includes(searchLower) ||
			stud.section.toLowerCase().includes(searchLower) ||
			semesterLabel.toLowerCase().includes(searchLower) ||
			yearLevelLabel.toLowerCase().includes(searchLower) ||
			stud.thesis_title.toLowerCase().includes(searchLower) ||
			formatDate(stud.created_at).toLowerCase().includes(searchLower) ||
			formatDate(stud.updated_at).toLowerCase().includes(searchLower)
		);
	});

	const sortedAccounts = [...filteredStudents].sort((a, b) => {
		const aValue = a[sortField];
		const bValue = b[sortField];

		if (aValue === undefined || bValue === undefined) return 0;

		const comparison = aValue.toString().localeCompare(bValue.toString());
		return sortDirection === 'asc' ? comparison : -comparison;
	});

	const totalPage = Math.ceil(sortedAccounts.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginationProps = sortedAccounts.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	const getBadges = (id: number, type: string) => {
		const findRole = roles.find((r) => r.id === id);
		const findProgram = programs.find((p) => p.id === id);
		const findDepartment = departments.find((d) => d.id === id);
		console.log(findRole);
		if (type === 'role')
			return <Badge variant="outline">{findRole === undefined ? "Not Assigned" : findRole?.name}</Badge>;
		if (type === 'program')
			return <Badge variant="outline">{findProgram?.code}</Badge>;
		if (type === 'department')
			return <Badge variant="outline">{findDepartment?.code}</Badge>;


	};

	const getSelectedInfo = (
		id: number,
		type: SelectedType
	):
		| RolesStudentsProps
		| ProgramsStudentsProps
		| DepartmentStudentsProps
		| null => {
		switch (type) {
			case 'role':
				return roles.find((r) => r.id === id) ?? null;

			case 'program':
				return programs.find((p) => p.id === id) ?? null;

			case 'department':
				return departments.find((d) => d.id === id) ?? null;

			default:
				return null;
		}
	};
	return (
		<>
			<div className="rounded-lg border bg-card p-6 mt-5 shadow-sm">
				<div className="flex items-center justify-between">
					<div className="space-y-6 text-white">
						<InputGroup>
							<InputGroupInput
								placeholder="Search...."
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<InputGroupAddon>
								<Search />
							</InputGroupAddon>
							<InputGroupAddon align="inline-end">
								{searchTerm.length > 1 ? filteredStudents.length : 0} results
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div className="space-y-6 text-white">
						<StudentAdd
							roles={roles}
							departments={departments}
							programs={programs}
							onSuccess={refresh}
						/>
					</div>
				</div>
				<div className="mb-4 flex items-center justify-between">
					<p className="text-muted-foreground ">
						Total Students: {students.length}
					</p>
				</div>
				<div className="rounded-lg border bg-card mt-3 shadow-sm">
					<div className="w-auto overflow-x-auto">
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead className="text-left text-muted-foreground pl-4">
										Student ID
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Name
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Role
									</TableHead>
									<TableHead className="text-muted-foreground text-left max-w-[300px]">
										Thesis Title
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Department
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Program
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Section
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Semester
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Year Level
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Created At
									</TableHead>
									<TableHead className="text-center text-muted-foreground">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell
											colSpan={9}
											className="-ml-3 h-8 text-white text-center"
										>
											Loading...
										</TableCell>
									</TableRow>
								) : paginationProps.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={9}
											className="-ml-3 h-8 text-white text-center"
										>
											No students found
										</TableCell>
									</TableRow>
								) : (
									paginationProps.map((student) => (
										<TableRow
											key={student.id}
											className="text-muted-foreground"
										>
											<TableCell className="text-left pl-3 text-white">
												{student.student_id}
											</TableCell>
											<TableCell className="text-white">
												{student.name}
											</TableCell>
											<TableCell className="text-white text-center capitalize">
												{getBadges(student.role_id, 'role')}
											</TableCell>
											<TableCell className="text-left text-white">
												{student.thesis_title}
											</TableCell>
											<TableCell className="text-left text-white">
												{getBadges(student.department_id, 'department')}
											</TableCell>
											<TableCell className="text-left text-white">
												{getBadges(student.program_id, 'program')}
											</TableCell>
											<TableCell className="text-left text-white">
												{student.section}
											</TableCell>
											<TableCell className="text-white">
												{student.semester === 1
													? '1st Semester'
													: '2nd Semester'}
											</TableCell>
											<TableCell className="text-white">
												{student.year_level === 3 ? '3rd Year' : '4th Year'}
											</TableCell>
											<TableCell>{formatDate(student.created_at)}</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="text-white">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => {
																setSelectedStudent(student);
																setOpen(true);
																setClickedButton('edit');
															}}
														>
															<PencilRuler className="h-4 w-4 mr-2" /> Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => {
																setSelectedStudent(student);
																setOpen(true);
																setClickedButton('details');
																setSelectedDepartment(
																	getSelectedInfo(
																		student.department_id,
																		'department'
																	) as DepartmentStudentsProps | null
																);
																setSelectedRole(
																	getSelectedInfo(
																		student.role_id,
																		'role'
																	) as RolesStudentsProps | null
																);
																setSelectedProgram(
																	getSelectedInfo(
																		student.program_id,
																		'program'
																	) as ProgramsStudentsProps | null
																);
															}}
														>
															<ReceiptText className="h-4 w-4 mr-2" /> Details
														</DropdownMenuItem>
														{/* <DropdownMenuItem>
															<PowerOff className="h-4 w-4 mr-2" /> Deactivate
														</DropdownMenuItem> */}
														<DropdownMenuItem
															onClick={() => {
																setSelectedStudent(student);
																setStudentId(student.id);
																setOpen(true);
																setClickedButton('delete');
															}}
														>
															<Trash className="h-4 w-4 mr-2" /> Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
								{selectedStudent &&
									(clickedButton === 'edit' ? (
										<StudentEdit
											student={selectedStudent}
											roles={roles}
											departments={departments}
											programs={programs}
											open={open}
											setOpen={setOpen}
											onSuccess={refresh}
										/>
									) : clickedButton === 'details' ? (
										<StudentDetails
											student={selectedStudent}
											program={selectedProgram}
											role={selectedRole}
											department={selectedDepartment}
											open={open}
											setOpen={setOpen}
										/>
									) : (
										<StudentDelete
											student_id={studentId}
											open={open}
											setOpen={setOpen}
											onSuccess={refresh}
										/>
									))}
							</TableBody>
						</Table>
					</div>
				</div>
				{totalPage > 0 && (
					<div className="flex justify-between items-center pt-3">
						<p className="text-muted-foreground text-base font-semibold w-full">
							Showing {startIndex + 1} to{' '}
							{Math.min(startIndex + ITEMS_PER_PAGE, sortedAccounts.length)} of{' '}
							{sortedAccounts.length} proponents
						</p>
						<Pagination className="justify-end">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											setCurrentPage((prev) => Math.max(1, prev - 1))
										}
										disabled={currentPage === 1}
										className="hover:bg-blue-600"
									/>
								</PaginationItem>
								{Array.from({ length: totalPage }, (_, i) => i + 1).map(
									(page) => (
										<PaginationItem>
											<PaginationLink
												key={page}
												onClick={() => setCurrentPage(page)}
												isActive={currentPage === page ? true : false}
												className="cursor-pointer"
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									)
								)}
								<PaginationItem>
									<PaginationNext
										onClick={() =>
											setCurrentPage((prev) => Math.min(totalPage, prev + 1))
										}
										disabled={currentPage === totalPage}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</div>
		</>
	);
};

export default StudentTable;
