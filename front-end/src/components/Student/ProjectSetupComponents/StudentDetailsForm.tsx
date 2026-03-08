import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { UserCircle, ArrowRight } from 'lucide-react';
import type { StudentDetails } from '../interface/project-setup';
import type { DepartmentProps } from '@/components/Admin/interface/department';
import type { ProgramsProps } from '@/components/Admin/interface/programs';

interface StudentDetailsFormProps {
	onComplete: (details: StudentDetails) => void;
	departments: DepartmentProps[];
	programs: ProgramsProps[];
}

const StudentDetailsForm = ({
	onComplete,
	departments,
	programs,
}: StudentDetailsFormProps) => {
	const [yearLevel, setYearLevel] = useState('');
	const [semester, setSemester] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [facebookProfile, setFacebookProfile] = useState('');
	const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
		null,
	);
	const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

	const filteredPrograms = programs.filter(
		(p) => p.department_id === selectedDepartment,
	);

	const canProceed =
		selectedDepartment && selectedProgram && yearLevel && semester;

	const handleSubmit = () => {
		if (!canProceed) return;
		onComplete({
			department_id: selectedDepartment,
			program_id: selectedProgram,
			yearLevel,
			semester,
			mobileNumber: mobileNumber || undefined,
			facebookProfile: facebookProfile || undefined,
		});
	};

	return (
		<Card>
			<CardHeader className="text-center pb-4">
				<div className="mx-auto p-3 rounded-xl bg-primary/10 w-fit mb-2">
					<UserCircle className="h-8 w-8 text-primary" />
				</div>
				<CardTitle className="text-xl">Complete Your Profile</CardTitle>
				<CardDescription>
					Fill in your academic details before setting up your project
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label>
							Department <span className="text-destructive">*</span>
						</Label>
						<Select
							value={selectedDepartment?.toString() || ''}
							onValueChange={(v) => {
								setSelectedDepartment(Number(v));
								setSelectedProgram(null);
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select department" />
							</SelectTrigger>
							<SelectContent>
								{departments.map((d) => (
									<SelectItem key={d.id} value={d.id.toString()}>
										{d.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>
							Program <span className="text-destructive">*</span>
						</Label>
						<Select
							value={selectedProgram?.toString() || ''}
							onValueChange={(v) => setSelectedProgram(Number(v))}
							disabled={!selectedDepartment}
						>
							<SelectTrigger className="w-full">
								<SelectValue
									placeholder={
										selectedDepartment
											? 'Select program'
											: 'Select department first'
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{filteredPrograms.map((p) => (
									<SelectItem key={p.id} value={p.id.toString()}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>
							Year Level <span className="text-destructive">*</span>
						</Label>
						<Select value={yearLevel} onValueChange={setYearLevel}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select year level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="3">3rd Year</SelectItem>
								<SelectItem value="4">4th Year</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>
							Semester <span className="text-destructive">*</span>
						</Label>
						<Select value={semester} onValueChange={setSemester}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select semester" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">1st Semester</SelectItem>
								<SelectItem value="2">2nd Semester</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>
							Mobile Number{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</Label>
						<Input
							placeholder="e.g., 09171234567"
							value={mobileNumber}
							onChange={(e) => setMobileNumber(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label>
							Facebook Profile{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</Label>
						<Input
							placeholder="e.g., Juan Dela Cruz"
							value={facebookProfile}
							onChange={(e) => setFacebookProfile(e.target.value)}
						/>
					</div>
				</div>

				<Button
					className="w-full mt-2"
					onClick={handleSubmit}
					disabled={!canProceed}
				>
					Continue <ArrowRight className="h-4 w-4 ml-2" />
				</Button>
			</CardContent>
		</Card>
	);
};

export default StudentDetailsForm;
