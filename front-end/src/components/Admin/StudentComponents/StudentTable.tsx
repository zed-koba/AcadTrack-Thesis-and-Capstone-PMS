import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { apiUrl } from '@/components/Routes/http';
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
	ArrowUpDown,
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

import type { StudentProps } from '../interface/student';
import StudentAdd from './StudentAdd';
import StudentEdit from './StudentEdit';
import StudentDetails from './StudentDetails';
import StudentDelete from './StudentDelete';

type SortField = keyof StudentProps;
type SortDirection = 'asc' | 'desc';
const ITEMS_PER_PAGE = 10;
const SortButton = ({
	field,
	label,
	onSort,
}: {
	field: SortField;
	label: string;
	onSort: (field: SortField) => void;
}) => (
	<Button
		variant="ghost"
		size="sm"
		className="-ml-3 h-8 font-semibold text-muted-foreground"
		onClick={() => onSort(field)}
	>
		{label}
		<ArrowUpDown size={12} className="w-3.5! h-3.5! text-sm" />
	</Button>
);

const StudentTable = () => {
	const [students, setAccounts] = useState<StudentProps[]>([]);
	const [selectedStudent, setSelectedStudent] = useState<StudentProps | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [studentId, setStudentId] = useState<number | null>(null);
	const [clickedButton, setClickedButton] = useState<string | null>(null);
	const [sortField, setSortField] = useState<SortField>('created_at');
	const [sortDirection, setSortDrection] = useState<SortDirection>('desc');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [open, setOpen] = useState(false);

	const fetchStudents = async () => {
		try {
			const res = await fetch(`${apiUrl}/students`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const data = await res.json();
			setAccounts(data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchStudents();
	}, []);
	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDrection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDrection('asc');
		}
	};

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
			stud.id.toString().includes(searchLower) ||
			stud.name.toLowerCase().includes(searchLower) ||
			stud.student_id.toLowerCase().includes(searchLower) ||
			stud.mobile_num.toLowerCase().includes(searchLower) ||
			stud.role.toLowerCase().includes(searchLower) ||
			stud.program.toLowerCase().includes(searchLower) ||
			stud.section.toLowerCase().includes(searchLower) ||
			semesterLabel.toLowerCase().includes(searchLower) ||
			stud.facebook_profile.toLowerCase().includes(searchLower) ||
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
						<StudentAdd onSuccess={fetchStudents} />
					</div>
				</div>
				<div className="mb-4 flex items-center justify-between">
					<p className="text-muted-foreground ">
						Total Students: {students.length}
					</p>
				</div>
				<div className="rounded-lg border bg-card">
					<div className="w-auto overflow-x-auto">
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead className="text-left">
										<SortButton
											label="Student ID"
											field="student_id"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead>
										<SortButton label="Name" field="name" onSort={handleSort} />
									</TableHead>
									<TableHead className="text-center">
										<SortButton label="Role" field="role" onSort={handleSort} />
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Thesis Title"
											field="thesis_title"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Program"
											field="program"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Section"
											field="section"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-center">
										<SortButton
											label="Mobile Number"
											field="mobile_num"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-center">
										<SortButton
											label="Semester"
											field="semester"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-center">
										<SortButton
											label="Year Level"
											field="year_level"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead>
										<SortButton
											label="Created At"
											field="created_at"
											onSort={handleSort}
										/>
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
										<TableRow key={student.id} className="text-white">
											<TableCell className="text-left">
												{student.student_id}
											</TableCell>
											<TableCell>{student.name}</TableCell>
											<TableCell className="text-center capitalize">
												<div
													className={`text-base ${
														student.role == 'programmer'
															? 'bg-destructive'
															: student.role == 'database'
															? 'bg-green-400'
															: student.role == 'user interface'
															? 'bg-amber-400'
															: student.role == 'system analyst'
															? 'bg-blue-400'
															: 'bg-pending'
													} px-2 py-0.5 border-none rounded-4xl text-sm text-white font-semibold flex items-center justify-center `}
												>
													{student.role}
												</div>
											</TableCell>
											<TableCell className="text-left">
												{student.thesis_title}
											</TableCell>
											<TableCell className="text-left">
												{student.program}
											</TableCell>
											<TableCell className="text-left">
												{student.section}
											</TableCell>

											<TableCell>{student.mobile_num}</TableCell>
											<TableCell>
												{student.semester === 1
													? '1st Semester'
													: '2nd Semester'}
											</TableCell>
											<TableCell>
												{student.year_level === 3 ? '3rd Year' : '4th Year'}
											</TableCell>
											<TableCell>{formatDate(student.created_at)}</TableCell>
											<TableCell className="text-right flex gap-2 justify-end items-center">
												<Button
													className="p-3 cursor-pointer hover:bg-green-600 bg-card text-green-600 hover:text-white flex justify-center items-center"
													aria-label="Edit"
													title="Edit"
													onClick={() => {
														setSelectedStudent(student);
														setOpen(true);
														setClickedButton('edit');
													}}
												>
													<PencilRuler size={16} />
												</Button>
												<Button
													className="p-3 cursor-pointer hover:bg-blue-500 bg-card text-blue-500 hover:text-white flex justify-center items-center"
													aria-label="Details"
													title="Details"
													onClick={() => {
														setSelectedStudent(student);
														setOpen(true);
														setClickedButton('details');
													}}
												>
													<ReceiptText size={16} />
												</Button>
												<Button
													className="p-2 cursor-pointer hover:bg-red-600 bg-card text-red-600 hover:text-white flex justify-center items-center"
													aria-label="Delete"
													title="Delete"
													onClick={() => {
														setSelectedStudent(student);
														setStudentId(student.id);
														setOpen(true);
														setClickedButton('delete');
													}}
												>
													<Trash size={24} />
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
								{selectedStudent &&
									(clickedButton === 'edit' ? (
										<StudentEdit
											student={selectedStudent}
											open={open}
											setOpen={setOpen}
											onSuccess={fetchStudents}
										/>
									) : clickedButton === 'details' ? (
										<StudentDetails
											student={selectedStudent}
											open={open}
											setOpen={setOpen}
										/>
									) : (
										<StudentDelete
											student_id={studentId}
											open={open}
											setOpen={setOpen}
											onSuccess={fetchStudents}
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
