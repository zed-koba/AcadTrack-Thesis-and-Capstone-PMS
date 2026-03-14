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
import type { ProgramsProps } from '@/components/Admin/interface/programs';
import { getInformation } from '@/components/functions/functions';

interface StudentDetailsFormProps {
	onComplete: (details: StudentDetails) => void;

	programs: ProgramsProps[];
	loading: boolean;
}

const StudentDetailsForm = ({
	onComplete,
	programs,
	loading,
}: StudentDetailsFormProps) => {
	const [yearLevel, setYearLevel] = useState<number>();
	const [semester, setSemester] = useState<number>();
	const [mobileNumber, setMobileNumber] = useState('');
	const [facebookProfile, setFacebookProfile] = useState('');
	const information = getInformation();
	const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
	const filteredPrograms = programs.filter(
		(prog) => prog.department_id === information.department_id,
	);
	const canProceed = selectedProgram && yearLevel && semester;

	const handleSubmit = () => {
		if (!canProceed) return;
		onComplete({
			program_id: selectedProgram,
			yearLevel: yearLevel,
			semester,
			mobile_num: mobileNumber || undefined,
			facebook_profile: facebookProfile || undefined,
		});
		const informationOld = getInformation();
		const updatedData = {
			...informationOld,

			program_id: selectedProgram,
			year_level: yearLevel,
			semester: semester,
			mobile_num: mobileNumber || undefined,
			facebook_profile: facebookProfile || undefined,
		};

		localStorage.setItem('data', JSON.stringify(updatedData));
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setMobileNumber(value);
		//const regex = /^09\d{9}$/
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
				<div className="grid gap-4 sm:grid-cols-1">
					<div className="space-y-2">
						<Label>
							Program <span className="text-destructive">*</span>
						</Label>
						<Select
							value={selectedProgram?.toString() || ''}
							onValueChange={(v) => setSelectedProgram(Number(v))}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select program" />
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
						<Select
							value={undefined}
							onValueChange={(v) => setYearLevel(Number(v))}
						>
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
						<Select
							value={undefined}
							onValueChange={(v) => setSemester(Number(v))}
						>
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
							type="tel"
							onChange={handleChange}
							maxLength={11}
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
					disabled={!canProceed || loading}
				>
					{loading ? 'Continuing...' : `Continue`}
					{loading ? '' : <ArrowRight className="h-4 w-4 ml-2" />}
				</Button>
			</CardContent>
		</Card>
	);
};

export default StudentDetailsForm;
