
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { faculty, type Faculty } from '@/lib/faculty';
import { students, type Student } from '@/lib/students';
import { departments, type Department, type DepartmentStatus } from '@/components/department-checklist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';

type StudentWithStatus = Student & { status: DepartmentStatus };

export default function FacultyDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentFaculty, setCurrentFaculty] = useState<Faculty | null>(null);
  const [departmentName, setDepartmentName] = useState<string>('');
  const [pendingStudents, setPendingStudents] = useState<StudentWithStatus[]>([]);

  useEffect(() => {
    const facultyId = localStorage.getItem('facultyId');
    if (!facultyId) {
      router.push('/faculty/login');
      return;
    }
    const fac = faculty.find(f => f.id === facultyId);
    setCurrentFaculty(fac || null);
    if (fac) {
        const dept = departments.find(d => d.id === fac.departmentId);
        setDepartmentName(dept?.name || 'your department');
    }
  }, [router]);

  useEffect(() => {
    if (currentFaculty) {
      const studentsWithStatus: StudentWithStatus[] = [];
      students.forEach(student => {
        const storageKey = `departmentStatusState_${student.id}`;
        try {
          const storedState = localStorage.getItem(storageKey);
          if (storedState) {
            const departmentStates: Record<string, DepartmentStatus> = JSON.parse(storedState);
            const status = departmentStates[currentFaculty.departmentId];
            if (status === 'applied') {
              studentsWithStatus.push({ ...student, status });
            }
          }
        } catch (error) {
          console.error(`Failed to parse status for student ${student.id}`, error);
        }
      });
      setPendingStudents(studentsWithStatus);
    }
  }, [currentFaculty]);

  const handleApprove = (studentId: string) => {
    if (!currentFaculty) return;

    const storageKey = `departmentStatusState_${studentId}`;
    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState) {
        const departmentStates: Record<string, DepartmentStatus> = JSON.parse(storedState);
        departmentStates[currentFaculty.departmentId] = 'approved';
        localStorage.setItem(storageKey, JSON.stringify(departmentStates));

        setPendingStudents(prev => prev.filter(s => s.id !== studentId));
        toast({
          title: 'Success',
          description: 'Student clearance has been approved.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve clearance.',
      });
      console.error(`Failed to update status for student ${studentId}`, error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyId');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/faculty/login');
  };
  
  return (
    <div className="min-h-screen text-foreground">
       <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
      <AppHeader/>
      <main className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Faculty Dashboard</CardTitle>
            <CardDescription>
              Welcome, {currentFaculty?.name} ({currentFaculty?.position}). Here are the pending clearance requests for {departmentName}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Enrollment No.</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingStudents.length > 0 ? (
                  pendingStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleApprove(student.id)}>Approve</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No pending requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
