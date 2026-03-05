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
	type AdvisersProponentProps,
	type ProponentsProps,
	type ProponentsTableProps,
	type StudentsProponentsProps,
} from '../interface/proponent';

import {
	Search,
	PencilRuler,
	ReceiptText,
	Trash,
	MoreHorizontal,
} from 'lucide-react';
import ProponentsAdd from './ProponentsAdd';
import ProponetsEdit from './ProponentsEdit';
import ProponentDetails from './ProponentDetails';
import ProponentDelete from './ProponentDelete';
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
type SortField = keyof ProponentsProps;
type SortDirection = 'asc' | 'desc';
const ITEMS_PER_PAGE = 10;
const ProponentsTable = ({
	students,
	proponents,
	advisers,
	roles,
	loading,
	refresh,
}: ProponentsTableProps) => {
	const [selectedProponent, setSelectedProponent] =
		useState<ProponentsProps | null>(null);
	const [open, setOpen] = useState(false);
	const [proponentId, setProponetId] = useState<number | null>(null);
	const [clickedButton, setClickedButton] = useState<string | null>(null);
	const [sortField, setSortField] = useState<SortField>('created_at');
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedAdviser, setSelectedAdviser] =
		useState<AdvisersProponentProps | null>(null);
	const [selectedStudents, setSelectedStudents] = useState<
		StudentsProponentsProps[]
	>([]);
	const filteredProponents = proponents.filter((props) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			props.proponents_id.toLowerCase().includes(searchLower) ||
			props.academic_yr.toLowerCase().includes(searchLower) ||
			props.title.toLowerCase().includes(searchLower) ||
			formatDate(props.created_at).toLowerCase().includes(searchLower) ||
			formatDate(props.updated_at).toLowerCase().includes(searchLower)
		);
	});
	//console.log(filteredProponents);
	const sortedProponents = [...filteredProponents].sort((a, b) => {
		const aValue = a[sortField];
		const bValue = b[sortField];

		if (aValue === undefined || bValue === undefined) return 0;

		const comparison = aValue.toString().localeCompare(bValue.toString());
		return sortDirection === 'asc' ? comparison : -comparison;
	});

	const totalPage = Math.ceil(sortedProponents.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginationProps = sortedProponents.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE,
	);

	const getAdviser = (id: number) => {
		const findAdviser = advisers.find((adv) => adv.id === id);

		return findAdviser ?? { id: 0, name: '' };
	};

	const getStudentsIds = (proponent: ProponentsProps) => {
		const findIds = new Set<number>(
			proponent.details
				.filter((d) => d.foreign_proponents_id === proponent.proponents_id)
				.map((d) => d.student_id)
				.filter((id): id is number => id !== undefined),
		);

		const findStudents = students.filter((student) => findIds.has(student.id));
		return findStudents;
	};
	return (
		<>
			<div className="rounded-lg border bg-card p-6 mt-5 shadow-sm">
				<div className="flex items-center justify-between">
					<div className="space-y-6 text-white">
						<InputGroup>
							<InputGroupInput
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setCurrentPage(1);
								}}
								placeholder="Search...."
							/>
							<InputGroupAddon>
								<Search />
							</InputGroupAddon>
							<InputGroupAddon align="inline-end">
								{searchTerm.length > 1 ? sortedProponents.length : 0} results
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div className="space-y-6 text-white">
						<ProponentsAdd
							students={students}
							proponents={proponents}
							advisers={advisers}
							roles={roles}
							refresh={refresh}
						/>
					</div>
				</div>
				<div className="mb-4 flex items-center justify-between">
					<p className="text-muted-foreground ">
						Total Proponents: {proponents.length}
					</p>
				</div>
				<div className="rounded-lg border bg-card">
					<div className="w-auto overflow-x-auto">
						<Table className="w-full">
							<TableHeader>
								<TableRow className="text-muted-foreground">
									<TableHead className="text-left pl-4 text-muted-foreground">
										Proponent ID
									</TableHead>
									<TableHead className="text-left text-muted-foreground">
										Title
									</TableHead>
									<TableHead className="text-left text-muted-foreground">
										Academic Year
									</TableHead>
									<TableHead className="text-left text-muted-foreground">
										Adviser
									</TableHead>
									<TableHead className="text-left text-muted-foreground">
										Created At
									</TableHead>
									<TableHead className="text-left text-muted-foreground">
										Updated At
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
											No proponents are found
										</TableCell>
									</TableRow>
								) : (
									paginationProps.map((proponent) => (
										<TableRow
											key={proponent.proponents_id}
											className="text-white"
										>
											<TableCell className="text-left pl-5">
												{proponent.proponents_id}
											</TableCell>
											<TableCell className="">{proponent.title}</TableCell>
											<TableCell className="text-left">
												{proponent.academic_yr}
											</TableCell>

											<TableCell className="text-left">
												{getAdviser(proponent.adviser_id).name}
											</TableCell>
											<TableCell>{formatDate(proponent.created_at)}</TableCell>
											<TableCell>{formatDate(proponent.updated_at)}</TableCell>
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
																setSelectedProponent(proponent);
																setOpen(true);
																setClickedButton('edit');
															}}
														>
															<PencilRuler className="h-4 w-4 mr-2" /> Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => {
																setSelectedProponent(proponent);
																setSelectedAdviser(
																	getAdviser(proponent.adviser_id),
																);
																setSelectedStudents(getStudentsIds(proponent));
																setOpen(true);
																setClickedButton('details');
															}}
														>
															<ReceiptText className="h-4 w-4 mr-2" /> Details
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => {
																setSelectedProponent(proponent);
																setProponetId(proponent.id);
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
								{selectedProponent &&
									(clickedButton === 'edit' ? (
										<ProponetsEdit
											students={students}
											advisers={advisers}
											roles={roles}
											open={open}
											proponents={proponents}
											setOpen={setOpen}
											proponent={selectedProponent}
											onSuccess={refresh}
										/>
									) : clickedButton === 'details' ? (
										<ProponentDetails
											open={open}
											setOpen={setOpen}
											proponent={selectedProponent}
											advisers={selectedAdviser}
											students={selectedStudents}
											roles={roles}
										/>
									) : (
										<ProponentDelete
											open={open}
											setOpen={setOpen}
											proponent_id={proponentId}
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
							{Math.min(startIndex + ITEMS_PER_PAGE, sortedProponents.length)}{' '}
							of {sortedProponents.length} proponents
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
									),
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

export default ProponentsTable;
