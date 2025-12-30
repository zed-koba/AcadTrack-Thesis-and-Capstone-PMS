import { Button } from '@/components/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import {
	Table,
	TableHead,
	TableHeader,
	TableCell,
	TableBody,
	TableRow,
} from '@/components/ui/table';
import {
	MoreHorizontal,
	PencilRuler,
	ReceiptText,
	Search,
	Trash,
} from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/components/functions/functions';
import { Badge } from '@/components/ui/badge';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type {
	DepartmentProgramsProps,
	ProgramsProps,
	ProgramsTableProps,
} from '../interface/programs';
import ProgramAdd from './ProgramAdd';
import ProgramEdit from './ProgramsEdit';

type SortField = keyof ProgramsProps;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;
const ProgramsTable = ({
	departments,
	programs,
	loading,
	refresh,
}: ProgramsTableProps) => {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [sortField, setSortField] = useState<SortField>('created_at');
	const [sortDirection, setSortDrection] = useState<SortDirection>('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedProgram, setSelectedProgram] = useState<ProgramsProps | null>(
		null
	);
	const [open, setOpen] = useState(false);
	const [clickedButton, setClickedButton] = useState<string>('');
	const [programDepartment, setProgramDepartment] =
		useState<DepartmentProgramsProps | null>(null);

	const filteredPrograms = programs.filter((prog) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			prog.name.toLowerCase().includes(searchLower) ||
			formatDate(prog.created_at).toLowerCase().includes(searchLower) ||
			formatDate(prog.updated_at).toLowerCase().includes(searchLower)
		);
	});

	const sortedPrograms = [...filteredPrograms].sort((a, b) => {
		const aValue = a[sortField];
		const bValue = b[sortField];

		if (aValue === undefined || bValue === undefined) return 0;
		const comparison = aValue.toString().localeCompare(bValue.toString());
		return sortDirection === 'asc' ? comparison : -comparison;
	});

	const totalPage = Math.ceil(sortedPrograms.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginationProps = sortedPrograms.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);
	const getStatusBadge = (status: string) => {
		return status === 'active' ? (
			<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
				Active
			</Badge>
		) : (
			<Badge variant="secondary" className="bg-muted text-muted-foreground">
				Inactive
			</Badge>
		);
	};
	const getCodeBadge = (id: number) => {
		const findCode = departments.find((c) => c.id === id);

		return findCode ?? { id: 0, name: 'Unknown', code: '' };
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
								{searchTerm.length > 1 ? filteredPrograms.length : 0} results
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div className="space-y-6 text-white">
						<ProgramAdd departments={departments} onSuccess={refresh} />
					</div>
				</div>
				<div className="rounded-lg border bg-card mt-3 shadow-sm">
					<div className="w-auto overflow-x-auto">
						<Table className="w-full">
							<TableHeader>
								<TableRow className="text-muted-foreground">
									<TableHead className="text-muted-foreground text-left pl-4">
										Program Name
									</TableHead>
									<TableHead className="text-muted-foreground text-left max-w-[300px]">
										Description
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Code
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Department
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Students
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Status
									</TableHead>
									<TableHead className="text-muted-foreground text-left w-[150px]">
										Created At
									</TableHead>
									<TableHead className="text-muted-foreground text-left w-[150px]">
										Updated At
									</TableHead>
									<TableHead className="text-center text-muted-foreground w-[70px]">
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
											No departments found
										</TableCell>
									</TableRow>
								) : (
									paginationProps.map((prog) => (
										<TableRow key={prog.id} className="text-muted-foreground">
											<TableCell className="text-left pl-3 text-white font-medium">
												{prog.name}
											</TableCell>
											<TableCell className="text-left max-w-[200px] truncate">
												{prog.description === null
													? '-'
													: prog.description.trim() === ''
													? '-'
													: prog.description}
											</TableCell>
											<TableCell className="text-left">
												<Badge variant="outline">{prog.code}</Badge>
											</TableCell>
											<TableCell className="text-left text-white">
												{getCodeBadge(prog.department_id).name}
											</TableCell>
											<TableCell className="text-left text-white">
												{prog.students_count}
											</TableCell>
											<TableCell className="text-left">
												{getStatusBadge(prog.status)}
											</TableCell>
											<TableCell className="text-left">
												{formatDate(prog.created_at)}
											</TableCell>
											<TableCell className="text-left">
												{formatDate(prog.updated_at)}
											</TableCell>
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
																setOpen(true);
																setSelectedProgram(prog);
																setClickedButton('edit');
															}}
														>
															<PencilRuler className="h-4 w-4 mr-2" /> Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => {
																setOpen(true);
																setSelectedProgram(prog);
																setProgramDepartment(
																	getCodeBadge(prog.department_id)
																);
																setClickedButton('details');
															}}
														>
															<ReceiptText className="h-4 w-4 mr-2" /> Details
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-red-500"
															onClick={() => {
																setOpen(true);
																setSelectedProgram(prog);
																setClickedButton('delete');
															}}
														>
															<Trash className="h-4 w-4 mr-2 group-hover:text-white" />{' '}
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
								{selectedProgram &&
									(clickedButton === 'edit' ? (
										<ProgramEdit
											program={selectedProgram}
											departments={departments}
											open={open}
											setOpen={setOpen}
											onSuccess={refresh}
										/>
									) : (
										// ) : clickedButton === 'details' ? (
										// 	<RoleDetails
										// 		role={selectedRole}
										// 		department={roleDepartment}
										// 		open={open}
										// 		setOpen={setOpen}
										// 	/>
										''
									))}
							</TableBody>
						</Table>
					</div>
				</div>
				{totalPage > 0 && (
					<div className="flex justify-between items-center pt-3">
						<p className="text-muted-foreground text-base font-semibold w-full">
							Showing {startIndex + 1} to{' '}
							{Math.min(startIndex + ITEMS_PER_PAGE, sortedPrograms.length)} of{' '}
							{sortedPrograms.length} programs
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

export default ProgramsTable;
