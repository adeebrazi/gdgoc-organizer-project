
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { departments } from '@/components/department-checklist';
import { useEffect, useState } from 'react';
import { Student, students } from '@/lib/students';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/app-header';

export default function AcknowledgementPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      const currentStudent = students.find(s => s.id === studentId);
      setStudent(currentStudent || null);
    } else {
      router.push('/');
    }
  }, [router]);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };
  
  if (!student) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <AppHeader />
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-4 w-full" />
                    <div className="border rounded-lg p-4">
                        <Skeleton className="h-6 w-1/3 mb-4" />
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                    </div>
                     <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 print:bg-white print:text-black">
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="w-full max-w-2xl">
        <AppHeader />
      </div>

      <div className="absolute top-4 left-4 print:hidden">
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <div className="absolute top-4 right-4 print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print / Download
        </Button>
      </div>

      <Card className="w-full max-w-2xl print:shadow-none print:border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-black">Clearance Acknowledgement</CardTitle>
          <p className="text-muted-foreground">Issued on: {today}</p>
        </CardHeader>
        <CardContent className="text-base sm:text-lg">
          <div className="space-y-6">
            <p>
              This is to certify that <span className="font-semibold">{student.name}</span> has successfully cleared all outstanding dues and obligations from the following departments as of the date mentioned above.
            </p>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-xl">Cleared Departments:</h3>
              <ul className="space-y-2">
                {departments.map((dept) => (
                  <li key={dept.id} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span>{dept.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p>
              This acknowledgement confirms that the student is eligible to proceed with the end sem examination.
            </p>
            
            <div className="mt-12 pt-8 text-right">
                <div className="inline-block text-center">
                    <div className="w-48 h-px bg-foreground mb-1"></div>
                    <p className="text-sm">Signature of Assistant Dean</p>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
