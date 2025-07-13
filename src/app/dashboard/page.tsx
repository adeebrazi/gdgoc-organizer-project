
'use client';

import { useRouter } from 'next/navigation';
import { DepartmentChecklist } from '@/components/department-checklist';
import { Chatbot } from '@/components/chatbot';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <div className="absolute top-4 right-4 print:hidden">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
      
      <AppHeader />

      <main className="container mx-auto px-4 pb-8 md:pb-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-red-600 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            Student's Dues/No Dues Certificate
          </h1>
          <p className="mt-3 text-lg text-black max-w-2xl mx-auto [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
            Streamline your college clearance process. Track your progress with ease for every department.
          </p>
        </header>

        <div className="grid grid-cols-1">
          <div className="lg:col-span-2">
            <DepartmentChecklist />
          </div>
        </div>
      </main>

      <Chatbot />

      <footer className="text-center py-6 text-sm text-black">
        © {new Date().getFullYear()} Student's Dues/No Dues Certificate. All Rights Reserved.
      </footer>
    </div>
  );
}
