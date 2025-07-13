'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { faculty } from '@/lib/faculty';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';

export default function FacultyLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const currentFaculty = faculty.find(
        (f) => f.id === facultyId && f.password === password
      );

      if (currentFaculty) {
        localStorage.setItem('facultyId', currentFaculty.id);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${currentFaculty.name}!`,
        });
        router.push('/faculty/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid Faculty ID or password.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AppHeader />
       <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-8 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
          No Dues Approval Portal
        </h2>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Faculty Login</CardTitle>
          <CardDescription>Enter your credentials to access the faculty portal.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facultyId">Faculty ID</Label>
              <Input
                id="facultyId"
                type="text"
                placeholder="Username / ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
             <Button variant="link" asChild className="text-xs">
              <Link href="/">Student Login</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
      <footer className="text-center py-6 mt-4 text-sm text-black">
        © {new Date().getFullYear()} Student's Dues/No Dues Certificate. All Rights Reserved.
      </footer>
    </div>
  );
}
