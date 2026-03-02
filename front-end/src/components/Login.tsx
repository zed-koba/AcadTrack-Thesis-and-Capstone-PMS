import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { api as apiLink } from '@/Routes/http';
import api from '@/lib/api';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error('Please fill in all fields');
			return;
		}
		setLoading(true);
		try {
			const response = await api.post(`${apiLink}/login`, {
				email,
				password,
			});
			const { token, user } = response.data;
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			console.log(token, user);
			switch (user.role) {
				case 'admin':
					navigate('/Admin');
					break;
				case 'student':
					navigate('/Student');
					break;
				case 'adviser':
					navigate('/Adviser');
					break;
				case 'instructor':
					navigate('/Instructor');
					break;
				default:
					navigate('/');
			}
		} catch (error) {
			console.log(error);
			setPassword('');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4">
			<Toaster position="top-center" />
			<div className="w-full max-w-md">
				<Link to="/" className="flex items-center justify-center gap-2 mb-8">
					<GraduationCap className="h-8 w-8 text-primary" />
					<span className="text-2xl font-bold text-foreground">AcadTrack</span>
				</Link>

				<Card className="border-border/50">
					<CardHeader className="text-center pb-4">
						<CardTitle className="text-2xl">Sign In</CardTitle>
						<CardDescription>
							Enter your credentials to access your portal
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleLogin} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@university.edu"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete="email"
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
								</div>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>
							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? 'Signing in...' : 'Sign In'}
							</Button>
						</form>
						<p className="text-center text-sm text-muted-foreground mt-6">
							Don't have an account?{' '}
							<Link
								to="/register"
								className="text-primary hover:underline font-medium"
							>
								Create one
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Login;
