import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AdviserProps } from './Admin/interface/adviser';
import type { InstructorProps } from './Admin/interface/instructor';
import type { DepartmentProps } from './Admin/interface/department';
import type { ProgramsProps } from './Admin/interface/programs';
import type {
	ProjectDetails,
	StudentDetails,
} from './Student/interface/project-setup';
import { api as apiUrl, apiStudentUrl } from '@/Routes/http';
import StudentDetailsForm from './Student/ProjectSetupComponents/StudentDetailsForm';
import ModeSelector from './Student/ProjectSetupComponents/ModeSelector';
import CreateProjectForm from './Student/ProjectSetupComponents/CreateProjectForm';
import JoinProjectForm from './Student/ProjectSetupComponents/JoinProjectForm';
import { toast } from 'sonner';
import { getInformation } from './functions/functions';
import { Toaster } from './ui/sonner';
import api from '@/lib/api';
import { Button } from './ui/button';

const StudentProjectSetup = () => {
	const navigate = useNavigate();
	const information = getInformation();
	const [step, setStep] = useState<'details' | 'select' | 'create' | 'join'>(
		!information.department_id ? 'details' : 'select',
	);
	const [advisers, setAdvisers] = useState<AdviserProps[]>([]);
	const [instructors, setInstructors] = useState<InstructorProps[]>([]);
	const [departments, setDepartments] = useState<DepartmentProps[]>([]);
	const [programs, setPrograms] = useState<ProgramsProps[]>([]);
	const [projects, setProjects] = useState<ProjectDetails[]>([]);
	const [loading, setLoading] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);
	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			await api.post(`${apiUrl}/logout`);
		} catch (error) {
			console.log(error);
		} finally {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			localStorage.removeItem('data');
			localStorage.removeItem('project');
			navigate('/Login');
			setLoggingOut(false);
		}
	};
	const fetchData = async () => {
		try {
			const res = await fetch(`${apiStudentUrl}/project-setup`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to fetch data');
			const response = await res.json();
			if (response.status === 200) {
				setAdvisers(response.advisers);
				setInstructors(response.instructors);
				setPrograms(response.programs);
				setDepartments(response.departments);
				setProjects(response.projects);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDetailsComplete = async (details: StudentDetails) => {
		setLoading(true);
		try {
			console.log(information.id);
			const res = await fetch(
				`${apiStudentUrl}/project-setup/updateStudent/${information.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify(details),
				},
			);
			const result = await res.json();
			if (result.status === 422) {
				const errors = result.errors as Record<string, string[]>;
				Object.values(errors).forEach((errorMessages) =>
					errorMessages.forEach((message) => toast.error(message)),
				);
				return;
			}
			if (!res.ok) {
				console.log('Failed to fetch data ' + JSON.stringify(details));
				return JSON.stringify(details);
			}
			if (result.status === 200) {
				toast.success(result.message);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
		setStep('select');
	};

	const handleModeSelect = (mode: 'create' | 'join') => {
		setStep(mode);
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Toaster position="top-center" />
			<div className="w-full max-w-2xl">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mx-auto mb-4">
						<span className="text-primary-foreground font-bold text-lg">A</span>
					</div>
					<h1 className="text-3xl font-bold tracking-tight">
						Welcome to AcadTrack
					</h1>
					<p className="text-muted-foreground mt-2">
						{step === 'details'
							? 'Complete your profile to get started'
							: 'Set up your project to get started'}
					</p>
				</div>

				{/* Step indicators */}
				<div className="flex items-center justify-center gap-2 mb-6">
					<div
						className={`h-2 w-12 rounded-full transition-colors ${step === 'details' ? 'bg-primary' : 'bg-primary/30'}`}
					/>
					<div
						className={`h-2 w-12 rounded-full transition-colors ${step !== 'details' ? 'bg-primary' : 'bg-muted'}`}
					/>
				</div>

				{step === 'details' && (
					<StudentDetailsForm
						onComplete={handleDetailsComplete}
						departments={departments}
						programs={programs}
						loading={loading}
					/>
				)}
				{step === 'select' && <ModeSelector onSelect={handleModeSelect} />}
				{step === 'create' && (
					<CreateProjectForm
						onBack={() => setStep('select')}
						onSuccess={() => navigate('/Student')}
						advisers={advisers}
						instructors={instructors}
					/>
				)}
				{step === 'join' && (
					<JoinProjectForm
						onBack={() => setStep('select')}
						onSuccess={() => navigate('/Student')}
						projects={projects}
					/>
				)}
				<div className="flex items-center justify-center">
					<Button variant="ghost" className="text-center mt-8 cursor-pointer" onClick={handleLogout} disabled={loggingOut}>
						<p className="text-muted-foreground font-medium text-lg underline">
							{loggingOut ? "Logging Out..." : "Logout"}
						</p>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default StudentProjectSetup;
