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
import { ArrowUpDown, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DepartmentProps } from '../interface/department';
import DepartmentAdd from './DepartmentAdd';
import { formatDate } from '@/components/functions/functions';
import { apiUrl } from '@/components/Routes/http';
import { Badge } from '@/components/ui/badge';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

type SortField = keyof DepartmentProps;
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
const DepartmentsTable = () => {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [sortField, setSortField] = useState<SortField>('created_at');
	const [sortDirection, setSortDrection] = useState<SortDirection>('asc');
	const [loading, setLoading] = useState(true);
	const [departments, setDepartments] = useState<DepartmentProps[]>([]);
	const [currentPage, setCurrentPage] = useState(1);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDrection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDrection('asc');
		}
	};

	const fetchDepartments = async () => {
		try {
			const res = await fetch(`${apiUrl}/departments`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const result = await res.json();
			if (result.status === 200) {
				setDepartments(result.data);
			}
			// Handle the fetched data as needed
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDepartments();
	}, []);

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
						<DepartmentAdd onSuccess={fetchDepartments} />
					</div>
				</div>
				<div className="rounded-lg border bg-card mt-3 shadow-sm">
					<div className="w-auto overflow-x-auto">
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead className="text-left pl-4">
										<SortButton
											label="Department Name"
											field="name"
											onSort={handleSort}
										/>
									</TableHead>
									<TableHead className="text-left">
										<SortButton label="Code" field="code" onSort={handleSort} />
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
											label="Dependencies"
											field="dependencies"
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
										</TableRow>
									))
								)}
								;
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
