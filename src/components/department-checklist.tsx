
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import {
  BookOpen,
  FlaskConical,
  Banknote,
  UserCheck,
  GraduationCap,
  PartyPopper,
  Download,
  User,
  Award,
  Lightbulb,
} from 'lucide-react';
import { DepartmentCard } from '@/components/department-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Student, students } from '@/lib/students';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  contact: {
    email: string;
    phone: string;
  };
  dues: number;
  requiresUpload?: boolean;
}

export const departments: Department[] = [
  {
    id: 'library',
    name: 'Library',
    description: 'Clearance for all borrowed books and library fees.',
    icon: BookOpen,
    contact: { email: 'library@college.edu', phone: '123-456-7890' },
    dues: 25,
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    description: 'Clearance for any lab dues or equipment.',
    icon: FlaskConical,
    contact: { email: 'lab@college.edu', phone: '123-456-7891' },
    dues: 50,
  },
  {
    id: 'academic_dept',
    name: 'Academic Department',
    description: 'Final clearance from your academic department.',
    icon: GraduationCap,
    contact: { email: 'hod@college.edu', phone: '123-456-7894' },
    dues: 0,
  },
  {
    id: 'program_coordinator',
    name: 'Program Coordinator',
    description: 'Clearance from your program coordinator.',
    icon: UserCheck,
    contact: { email: 'coordinator@college.edu', phone: '123-456-7893' },
    dues: 0,
  },
  {
    id: 'accounts',
    name: 'Accounts Department',
    description: 'Clearance for tuition fees and other financial dues.',
    icon: Banknote,
    contact: { email: 'accounts@college.edu', phone: '123-456-7892' },
    dues: 150,
  },
  {
    id: 'coursera',
    name: 'Coursera',
    description: 'Submit your Coursera course completion certificate.',
    icon: Award,
    contact: { email: 'support@coursera.org', phone: '123-456-7895' },
    dues: 0,
    requiresUpload: true,
  },
  {
    id: 'lt_program',
    name: 'L/T Program',
    description: 'Submit your L/T Program completion certificate.',
    icon: Lightbulb,
    contact: { email: 'support@ltprogram.org', phone: '123-456-7896' },
    dues: 0,
    requiresUpload: true,
  },
];

export type DepartmentStatus =
  | 'pending_dues'
  | 'pending_upload'
  | 'ready_to_apply'
  | 'applied'
  | 'approved';

const STORAGE_KEY_PREFIX = 'departmentStatusState_';

export function DepartmentChecklist() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [storageKey, setStorageKey] = useState<string>('');
  
  const [departmentStates, setDepartmentStates] = useState<
    Record<string, DepartmentStatus>
  >({});
  
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      const currentStudent = students.find(s => s.id === studentId);
      setStudent(currentStudent || null);
      setStorageKey(`${STORAGE_KEY_PREFIX}${studentId}`);
    } else {
      router.push('/');
    }
  }, [router]);

  const getInitialState = useCallback(() => {
    if (typeof window === 'undefined') {
      return {};
    }
    return departments.reduce((acc, dept) => {
        // Randomly decide if a department with dues actually has them
        if (dept.dues > 0 && Math.random() < 0.5) {
          acc[dept.id] = 'pending_dues';
        } else if (dept.requiresUpload) {
          acc[dept.id] = 'pending_upload';
        } else {
          acc[dept.id] = 'ready_to_apply';
        }
        return acc;
    }, {} as Record<string, DepartmentStatus>)
  }, []);

  useEffect(() => {
    if (!storageKey) return;

    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        const hasApprovedStatus = Object.values(parsedState).includes('approved');
        
        if (hasApprovedStatus) {
            const initialState = getInitialState();
            const finalState = { ...initialState };
            
            Object.keys(parsedState).forEach(key => {
                if (parsedState[key] === 'approved') {
                    finalState[key] = 'approved';
                }
            });

            setDepartmentStates(finalState);
        } else {
            setDepartmentStates(parsedState);
        }
      } else {
        setDepartmentStates(getInitialState());
      }
    } catch (error) {
       console.error("Failed to access localStorage, resetting state.", error);
       setDepartmentStates(getInitialState());
    }
    setIsInitialized(true);
  }, [storageKey, getInitialState]);

  useEffect(() => {
    if (isInitialized && storageKey && Object.keys(departmentStates).length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(departmentStates));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [departmentStates, isInitialized, storageKey]);

  const handleStatusChange = useCallback((id: string, newStatus: DepartmentStatus) => {
    setDepartmentStates(prevState => {
        if (newStatus === 'approved') {
          return prevState;
        }
        return { ...prevState, [id]: newStatus };
    });
  }, []);

  const allCompleted = useMemo(() => {
    if (departments.length === 0 || Object.keys(departmentStates).length === 0) return false;
    return departments.every(dept => departmentStates[dept.id] === 'approved');
  }, [departmentStates]);

  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (allCompleted) {
      const timer = setTimeout(() => setShowCompletion(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowCompletion(false);
    }
  }, [allCompleted]);

  const resetProgress = () => {
    if (storageKey) {
        localStorage.removeItem(storageKey);
    }
    setDepartmentStates(getInitialState());
  }
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }


  if (!isInitialized || !student) {
    return (
        <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-4 w-1/4 mb-6" />
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Student Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 border-2 border-primary">
                    <AvatarImage src={student.photoUrl} alt={student.name} data-ai-hint="student photo" />
                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                    <div>
                        <p className="text-muted-foreground">Student Name</p>
                        <p className="font-semibold">{student.name}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Enrollment No.</p>
                        <p className="font-semibold">{student.id}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Batch Year</p>
                        <p className="font-semibold">{student.batchYear}</p>
                    </div>
                </div>
            </div>
           
            <Separator/>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-semibold">{student.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Program</p>
                  <p className="font-semibold">{student.program}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Father's Name</p>
                  <p className="font-semibold">{student.fatherName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mother's Name</p>
                  <p className="font-semibold">{student.motherName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mobile Number</p>
                  <p className="font-semibold">{student.mobile}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-semibold">{student.dob}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Examination</p>
                  <p className="font-semibold">{student.examination}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Semester</p>
                  <p className="font-semibold">{student.semester}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email ID</p>
                  <p className="font-semibold">{student.email}</p>
                </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mb-6">
        <Button variant="outline" onClick={resetProgress} className="hidden">Reset Progress</Button>
      </div>

      {showCompletion && (
        <Alert className="mb-8 border-accent-foreground bg-accent/10 animate-in fade-in zoom-in-95 duration-500">
          <PartyPopper className="h-5 w-5 text-accent-foreground" />
          <AlertTitle className="font-bold text-accent-foreground">
            All Clear!
          </AlertTitle>
          <AlertDescription className="text-foreground flex items-center justify-between">
            <span>Congratulations! You have successfully completed all your clearances.</span>
            <div className='flex items-center gap-2'>
              <Button asChild>
                <Link href="/acknowledgement">
                  <Download className="mr-2 h-4 w-4" />
                  Download Acknowledgement
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {departments.map(dept => (
            <div key={dept.id}>
              <DepartmentCard
                department={dept}
                status={departmentStates[dept.id]}
                onStatusChange={newStatus => handleStatusChange(dept.id, newStatus)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
