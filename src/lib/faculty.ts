
export interface Faculty {
    id: string;
    password: string;
    name: string;
    position: string;
    email: string;
    mobile: string;
    departmentId: 'library' | 'laboratory' | 'academic_dept' | 'program_coordinator' | 'accounts' | 'coursera' | 'lt_program';
}
export const faculty: Faculty[] = [
    {
        id: 'prof.rashid',
        password: 'AJU@rashid',
        name: 'Syed Rashid Anwar',
        position: 'Professor',
        email: 'syed.r@arkajainuniversity.ac.in',
        mobile: '9876543210',
        departmentId: 'coursera' ,
    },
    {
        id: 'asstdean',
        password: 'AJU@asstdean',
        name: 'Dr. Ashwini Kumar',
        position: 'Assistant Dean',
        email: 'dr.ashwini@arkajainuniversity.ac.in',
        mobile: '9876543211',
        departmentId: 'program_coordinator',
    },
    {
        id: 'ashishjha',
        password: 'AJU@ashish.j',
        name: 'Ashish Jha',
        position: 'Administration Dept',
        email: 'ashish.j@arkajainuniversity.ac.in',
        mobile: '9876543212',
        departmentId: 'academic_dept',
    },
    {
        id: 'nidhidua',
        password: 'AJU@n.dua',
        name: 'Dr. Nidhi Dua',
        position: 'Professor',
        email: 'dr.nidhi@arkajainuniversity.ac.in',
        mobile: '9876543213',
        departmentId: 'lt_program',
    },
    {
        id: 'sonalpandey',
        password: 'AJU@s.pandey',
        name: 'Sonal Pandey',
        position: 'Chief Accountant',
        email: 'sonal.pandeya@arkajain.ac.in',
        mobile: '9876543214',
        departmentId: 'accounts',
    },
    {
        id: 'mamathav',
        password: 'AJU@mamatha.v',
        name: 'Mamatha Vayelapelli',
        position: 'Assistant Professor',
        email: 'mamatha.v@arkajain.ac.in',
        mobile: '9876543213',
        departmentId: 'laboratory',
    },
    {
        id: 'aditikeshri',
        password: 'AJU@a.keshri',
        name: 'Aditi Keshri',
        position: 'Head Librarian',
        email: 'a.keshri@arkajain.ac.in',
        mobile: '9876543214',
        departmentId: 'library',
    }
];
