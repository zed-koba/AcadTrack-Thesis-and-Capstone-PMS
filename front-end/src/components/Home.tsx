import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	GraduationCap,
	Users,
	CalendarClock,
	FileText,
	Shield,
	BarChart3,
} from 'lucide-react';

const features = [
	{
		icon: Users,
		title: 'Student Management',
		description:
			'Track and manage student groups, approvals, and academic progress in one place.',
	},
	{
		icon: FileText,
		title: 'Document Tracking',
		description:
			'Monitor thesis document submissions, revisions, and feedback cycles seamlessly.',
	},
	{
		icon: CalendarClock,
		title: 'Consultation Scheduling',
		description:
			'Book, reschedule, and manage adviser consultations with an integrated calendar.',
	},
	{
		icon: BarChart3,
		title: 'Analytics & Reports',
		description:
			'Gain insights into group performance, submission trends, and milestone completion.',
	},
	{
		icon: Shield,
		title: 'Role-Based Access',
		description:
			'Dedicated portals for admins, instructors, advisers, and students.',
	},
	{
		icon: GraduationCap,
		title: 'Progress Monitoring',
		description:
			'Gantt charts, deadlines, and milestone tracking to keep every group on track.',
	},
];

const Home = () => {
	return (
		<div className="min-h-screen bg-background">
			{/* Nav */}
			<header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
				<div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
					<div className="flex items-center gap-2">
						<GraduationCap className="h-7 w-7 text-primary" />
						<span className="text-xl font-bold text-foreground">AcadTrack</span>
					</div>
					<div className="flex items-center gap-3">
						<Button variant="ghost" asChild>
							<Link to="/Login">Sign In</Link>
						</Button>
						<Button asChild>
							<Link to="/Registration">Get Started</Link>
						</Button>
					</div>
				</div>
			</header>

			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />
				<div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
					<div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
						<Shield className="h-3.5 w-3.5" />
						Capstone & Thesis Project Management System
					</div>
					<h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
						Streamline Your
						<span className="text-primary block">
							Thesis & Capstone Journey
						</span>
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
						A unified platform for students, advisers, and instructors to manage
						capstone and thesis projects.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button size="lg" className="px-8 text-base" asChild>
							<Link to="/register">Create Account</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="px-8 text-base"
							asChild
						>
							<Link to="/login">Sign In</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="max-w-6xl mx-auto px-6 py-20">
				<div className="text-center mb-14">
					<h2 className="text-3xl font-bold text-foreground mb-3">
						Everything You Need
					</h2>
					<p className="text-muted-foreground text-lg max-w-xl mx-auto">
						Tools designed for every role in the thesis process.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((f) => (
						<Card
							key={f.title}
							className="border-border/50 hover:border-primary/30 transition-colors"
						>
							<CardContent className="p-6">
								<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
									<f.icon className="h-5 w-5 text-primary" />
								</div>
								<h3 className="font-semibold text-foreground mb-2">
									{f.title}
								</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{f.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="max-w-4xl mx-auto px-6 py-20">
				<Card className="bg-primary/5 border-primary/20">
					<CardContent className="p-10 text-center">
						<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Ready to Get Started?
						</h2>
						<p className="text-muted-foreground mb-8 max-w-lg mx-auto">
							Join your institution's thesis management system and stay on top
							of every milestone.
						</p>
						<Button size="lg" className="px-8" asChild>
							<Link to="/register">Create Your Account</Link>
						</Button>
					</CardContent>
				</Card>
			</section>

			{/* Footer */}
			<footer className="border-t border-border/50 py-8">
				<div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<GraduationCap className="h-4 w-4" />
						<span>AcadTrack © 2026</span>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
