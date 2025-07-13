
'use client';

import { useRef } from 'react';
import type { Department, DepartmentStatus } from './department-checklist';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Phone, Mail, CheckCircle2, Upload, Check, IndianRupee } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface DepartmentCardProps {
  department: Department;
  status: DepartmentStatus;
  onStatusChange: (status: DepartmentStatus) => void;
}

export function DepartmentCard({
  department,
  status,
  onStatusChange,
}: DepartmentCardProps) {

  const isApproved = status === 'approved';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) { 
        alert("File size exceeds 5MB limit.");
        return;
      }
      onStatusChange('ready_to_apply');
    }
  };

  return (
    <Card
      className={`transition-all duration-300 flex flex-col h-full ${
        isApproved ? 'border-blue-500 shadow-lg' : 'shadow-sm'
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-accent/10">
            <department.icon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-medium">
            {department.name}
          </CardTitle>
        </div>
        {isApproved && (
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <CheckCircle2 className="h-6 w-6" />
                <span>Approved</span>
            </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-grow">
        <div>
          <p className="text-muted-foreground mb-4 min-h-[40px]">
            {department.description}
          </p>
          <Separator className="my-4" />
        </div>
        <div className="flex items-center justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" disabled={isApproved}>
                  <Phone className="mr-2 h-4 w-4" /> Contact
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto" side="top" align="start">
                <div className="space-y-3 p-2">
                  <p className="text-sm font-semibold">Contact Info</p>
                  <a
                    href={`mailto:${department.contact.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" /> {department.contact.email}
                  </a>
                  <a
                    href={`tel:${department.contact.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" /> {department.contact.phone}
                  </a>
                </div>
              </PopoverContent>
            </Popover>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="application/pdf,image/*"
          />

          <div className="flex items-center space-x-2">
            {status === 'pending_dues' && (
              <Button asChild size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                <Link href={`/dues/${department.id}`}>
                  <IndianRupee className="mr-2 h-4 w-4" /> View Dues
                </Link>
              </Button>
            )}
            {status === 'pending_upload' && (
              <div className="flex flex-col items-end gap-2">
                 <Button size="sm" variant="outline" onClick={handleUploadClick}>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
              </div>
            )}
            {status === 'ready_to_apply' && (
              <Button size="sm" onClick={() => onStatusChange('applied')}>
                {department.requiresUpload ? <Check className="mr-2 h-4 w-4"/> : null}
                Apply for Clearance
              </Button>
            )}
            {status === 'applied' && (
              <p className="text-sm font-medium text-muted-foreground">
                Applied. Pending approval.
              </p>
            )}
            {status === 'approved' && (
               <p className="text-sm font-medium text-blue-400">Clearance Approved!</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
