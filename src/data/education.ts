// src/data/education.ts

export interface EducationEntry {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // Format like 'YYYY' or 'Month YYYY'
  endDate?: string; // Format like 'YYYY' or 'Month YYYY', or 'Present'
  description?: string[]; // Optional list for achievements, coursework, etc.
  logoUrl?: string; // Optional path or URL to institution logo
}

// Education data for Shankhadeep Dey
export const educationHistory: EducationEntry[] = [
  {
    id: 1,
    institution: 'Siliguri Institute of Technology',
    degree: 'Bachelor of Technology (B.Tech)',
    fieldOfStudy: 'Electronics and Communication Engineering',
    startDate: 'July 2016',
    endDate: 'June 2020',
    description: [
      'CGPA: 8.32',
      'Awarded the Swami Vivekananda Scholarship by West Bengal government (for meritorious and economically backward students).',
      'Winner – Codersbit 2018 (College Campus) – Siliguri, India',
      '2nd Runner-Up – Inspiria Coder of the Campus 2018 – Siliguri, India',
      '94th/2914 – HackerRank HourRank26 competitive programming contest',
    ],
    // logoUrl: '/logos/siliguri-institute-logo.png', // Add logo path if available
  },
];
