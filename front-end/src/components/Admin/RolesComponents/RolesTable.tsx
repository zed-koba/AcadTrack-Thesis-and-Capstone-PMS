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
	ArrowUpDown,
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
import type { RolesProps, RolesTableProps } from '../interface/roles';

type SortField = keyof RolesProps;
type SortDirection = 'asc' | 'desc';
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

const ITEMS_PER_PAGE = 10;
const RolesTable = ({ roles, loading, refresh }: RolesTableProps) => {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [sortField, setSortField] = useState<SortField>('created_at');
	const [sortDirection, setSortDrection] = useState<SortDirection>('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedRole, setSelectedRole] = useState<RolesProps | null>(null);
	const [open, setOpen] = useState(false);
	const [clickedButton, setClickedButton] = useState<string>('');
	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDrection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDrection('asc');
		}
	};

	const filteredRoles = roles.filter((role) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			role.name.toLowerCase().includes(searchLower) ||
			formatDate(role.created_at).toLowerCase().includes(searchLower) ||
			formatDate(role.updated_at).toLowerCase().includes(searchLower)
		);
	});

	const sortedRoles = [...filteredRoles].sort((a, b) => {
		const aValue = a[sortField];
		const bValue = b[sortField];

		if (aValue === undefined || bValue === undefined) return 0;
		const comparison = aValue.toString().localeCompare(bValue.toString());
		return sortDirection === 'asc' ? comparison : -comparison;
	});

	const totalPage = Math.ceil(sortedRoles.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginationProps = sortedRoles.slice(
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
								{searchTerm.length > 1 ? filteredRoles.length : 0} results
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div className="space-y-6 text-white">
						{/* <DepartmentAdd onSuccess={refresh} /> */}
					</div>
				</div>
				<div className="rounded-lg border bg-card mt-3 shadow-sm">
					<div className="w-auto overflow-x-auto">
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead className="text-left pl-4">
										<SortButton
											label="Role Name"
											field="name"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Description"
											field="description"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Scope"
											field="globalRole"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Assigned"
											field="assigned"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Status"
											field="status"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Created At"
											field="created_at"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton
											label="Updated At"
											field="updated_at"
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
											No departments found
										</TableCell>
									</TableRow>
								) : (
									paginationProps.map((role) => (
										<TableRow key={role.id} className="text-muted-foreground">
											<TableCell className="text-left pl-3 text-white font-medium">
												{role.name}
											</TableCell>
											<TableCell className="text-left max-w-[200px] truncate">
												{role.description === null
													? '-'
													: role.description.trim() === ''
													? '-'
													: role.description}
											</TableCell>
											<TableCell className="text-left">
												<Badge variant="outline">{role.globalRole}</Badge>
											</TableCell>
											<TableCell className="text-left">
												{role.assigned}
											</TableCell>
											<TableCell className="text-left">
												{getStatusBadge(role.status)}
											</TableCell>
											<TableCell className="text-left">
												{formatDate(role.created_at)}
											</TableCell>
											<TableCell className="text-left">
												{formatDate(role.updated_at)}
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
																setSelectedRole(role);
																setClickedButton('edit');
															}}
														>
															<PencilRuler className="h-4 w-4 mr-2" /> Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => {
																setOpen(true);
																setSelectedRole(role);
																setClickedButton('details');
															}}
														>
															<ReceiptText className="h-4 w-4 mr-2" /> Details
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-red-500"
															onClick={() => {
																setOpen(true);
																setSelectedRole(role);
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
								{/* {selectedDepartment &&
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
									))} */}
							</TableBody>
						</Table>
					</div>
				</div>
				{totalPage > 0 && (
					<div className="flex justify-between items-center pt-3">
						<p className="text-muted-foreground text-base font-semibold w-full">
							Showing {startIndex + 1} to{' '}
							{Math.min(startIndex + ITEMS_PER_PAGE, sortedRoles.length)} of{' '}
							{sortedRoles.length} departments
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

export default RolesTable;
