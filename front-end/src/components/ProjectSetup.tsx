import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AdviserProps } from './Admin/interface/adviser';
import type { InstructorProps } from './Admin/interface/instructor';
import type { DepartmentProps } from './Admin/interface/department';
import type { ProgramsProps } from './Admin/interface/programs';
import type { StudentDetails } from './Student/interface/project-setup';
import { apiStudentUrl } from '@/Routes/http';
import StudentDetailsForm from './Student/ProjectSetupComponents/StudentDetailsForm';
import ModeSelector from './Student/ProjectSetupComponents/ModeSelector';
import CreateProjectForm from './Student/ProjectSetupComponents/CreateProjectForm';
import JoinProjectForm from './Student/ProjectSetupComponents/JoinProjectForm';
import type { ProponentsProps } from './Admin/interface/proponent';
const StudentProjectSetup = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState<'details' | 'select' | 'create' | 'join'>(
		'details',
	);
	const [advisers, setAdvisers] = useState<AdviserProps[]>([]);
	const [instructors, setInstructors] = useState<InstructorProps[]>([]);
	const [departments, setDepartments] = useState<DepartmentProps[]>([]);
	const [programs, setPrograms] = useState<ProgramsProps[]>([]);
	const [projects, setProjects] = useState<ProponentsProps[]>([]);

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
	const [, setStudentDetails] = useState<StudentDetails | null>(null);

	const handleDetailsComplete = (details: StudentDetails) => {
		setStudentDetails(details);
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
					/>
				)}
				{step === 'select' && <ModeSelector onSelect={handleModeSelect} />}
				{step === 'create' && (
					<CreateProjectForm
						onBack={() => setStep('select')}
						onSuccess={() => navigate('/student')}
						advisers={advisers}
						instructors={instructors}
					/>
				)}
				{step === 'join' && (
					<JoinProjectForm
						onBack={() => setStep('select')}
						onSuccess={() => navigate('/student')}
						projects={projects}
					/>
				)}
			</div>
		</div>
	);
};

export default StudentProjectSetup;
