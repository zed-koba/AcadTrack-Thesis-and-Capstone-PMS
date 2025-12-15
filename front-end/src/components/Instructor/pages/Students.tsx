import StudentTable from '../StudentComponents/StudentTable';

const Students = () => {
	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col justify-start">
					<span className="text-2xl text-white">Student List</span>
					<span className="text-sm text-white">
						Manage students records and approval status
					</span>
				</div>
			</div>
			<StudentTable />
		</>
	);
};

export default Students;
