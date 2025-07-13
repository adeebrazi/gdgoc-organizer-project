
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { departments, type Department } from '@/components/department-checklist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/app-header';

export default function DuesPage() {
  const params = useParams();
  const departmentId = params.departmentId as string;

  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dept = departments.find(d => d.id === departmentId) || null;
    setDepartment(dept);
    setIsLoading(false);
  }, [departmentId]);
  
  if (isLoading || !department) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AppHeader />
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const hasDues = department.dues > 0;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AppHeader />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <department.icon className="w-6 h-6 text-primary" />
            {department.name} Dues
          </CardTitle>
          <CardDescription>
            Check and clear any outstanding dues for the {department.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasDues ? (
            <div>
              <p className="text-lg font-semibold text-red-500">Outstanding Dues: ₹{department.dues.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-2">Please clear your dues to proceed with the clearance process.</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-primary">No Outstanding Dues</p>
              <p className="text-sm text-muted-foreground mt-2">You are all clear from the {department.name}. You can now apply for clearance.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          {hasDues && (
            <Button asChild>
              <Link href={`/payment?departmentId=${department.id}&amount=${department.dues}`}>
                <CreditCard className="mr-2 h-4 w-4" />
                Clear Dues
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
