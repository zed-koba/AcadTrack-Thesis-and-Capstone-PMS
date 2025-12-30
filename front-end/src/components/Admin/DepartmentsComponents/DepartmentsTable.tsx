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
import type {
	DepartmentProps,
	DepartmentTableProps,
} from '../interface/department';
import DepartmentAdd from './DepartmentAdd';
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
import DepartmentEdit from './DepartmentEdit';
import DepartmentDelete from './DepartmentDelete';
import DepartmentDetails from './DepartmentDetails';

type SortField = keyof DepartmentProps;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;
const DepartmentsTable = ({
	departments,
	loading,
	refresh,
}: DepartmentTableProps) => {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [sortField, setSortField] = useState<SortField>('created_at');
	const [sortDirection, setSortDrection] = useState<SortDirection>('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedDepartment, setSelectedDepartment] =
		useState<DepartmentProps | null>(null);
	const [open, setOpen] = useState(false);
	const [clickedButton, setClickedButton] = useState<string>('');

	const filteredDepartments = departments.filter((department) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			department.name.toLowerCase().includes(searchLower) ||
			department.code.toLowerCase().includes(searchLower) ||
			department.status.toLowerCase().includes(searchLower) ||
			formatDate(department.created_at).toLowerCase().includes(searchLower) ||
			formatDate(department.updated_at).toLowerCase().includes(searchLower)
		);
	});

	const sortedDepartments = [...filteredDepartments].sort((a, b) => {
		const aValue = a[sortField];
		const bValue = b[sortField];

		if (aValue === undefined || bValue === undefined) return 0;
		const comparison = aValue.toString().localeCompare(bValue.toString());
		return sortDirection === 'asc' ? comparison : -comparison;
	});

	const totalPage = Math.ceil(sortedDepartments.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginationProps = sortedDepartments.slice(
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
								{searchTerm.length > 1 ? filteredDepartments.length : 0} results
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div className="space-y-6 text-white">
						<DepartmentAdd onSuccess={refresh} />
					</div>
				</div>
				<div className="rounded-lg border bg-card mt-3 shadow-sm">
					<div className="w-auto overflow-x-auto">
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead className="text-muted-foreground text-left pl-4">
										Department Name
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Code
									</TableHead>
									<TableHead className="text-muted-foreground text-left max-w-[300px]">
										Description
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Dependencies
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Status
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Created At
									</TableHead>
									<TableHead className="text-muted-foreground text-left">
										Updated At
									</TableHead>
									<TableHead className="text-muted-foreground text-center">
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
									paginationProps.map((department) => (
										<TableRow
											key={department.id}
											className="text-muted-foreground"
										>
											<TableCell className="text-left pl-3 text-white font-medium">
												{department.name}
											</TableCell>
											<TableCell className="text-left">
												<Badge variant="outline">{department.code}</Badge>
											</TableCell>
											<TableCell className="text-left max-w-[200px] truncate">
												{department.description === null
													? '-'
													: department.description.trim() === ''
													? '-'
													: department.description}
											</TableCell>
											<TableCell className="text-left">
												{department.programs_count} programs,{' '}
												{department.advisers_count} advisers,{' '}
												{department.roles_count} roles
											</TableCell>
											<TableCell className="text-left">
												{getStatusBadge(department.status)}
											</TableCell>
											<TableCell className="text-left">
												{formatDate(department.created_at)}
											</TableCell>
											<TableCell className="text-left">
												{formatDate(department.updated_at)}
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
																setSelectedDepartment(department);
																setClickedButton('edit');
															}}
														>
															<PencilRuler className="h-4 w-4 mr-2" /> Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => {
																setOpen(true);
																setSelectedDepartment(department);
																setClickedButton('details');
															}}
														>
															<ReceiptText className="h-4 w-4 mr-2" /> Details
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-red-500"
															onClick={() => {
																setOpen(true);
																setSelectedDepartment(department);
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
								{selectedDepartment &&
									(clickedButton === 'edit' ? (
										<DepartmentEdit
											department={selectedDepartment}
											open={open}
											setOpen={setOpen}
											onSuccess={refresh}
										/>
									) : clickedButton === 'details' ? (
										<DepartmentDetails
											department={selectedDepartment}
											open={open}
											setOpen={setOpen}
										/>
									) : clickedButton === 'delete' ? (
										<DepartmentDelete
											department={selectedDepartment}
											open={open}
											setOpen={setOpen}
											onSuccess={refresh}
										/>
									) : (
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
							{Math.min(startIndex + ITEMS_PER_PAGE, sortedDepartments.length)}{' '}
							of {sortedDepartments.length} departments
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

export default DepartmentsTable;
