import DepartmentsDashboard from '../DepartmentsComponents/DepartmentsDashboard';
import DepartmentsTable from '../DepartmentsComponents/DepartmentsTable';

const Departments = () => {
	return (
		<>
			<div className="flex items-center justify-between text-white text-base">
				<div className="flex items-start flex-col justify-start">
					<span className="text-2xl text-white">Deparments Management</span>
					<span className="text-sm text-white">
						Manage departments as master data for the system
					</span>
				</div>
			</div>
			<DepartmentsDashboard />
			<DepartmentsTable />
		</>
	);
};

export default Departments;
