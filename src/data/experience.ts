import type { StaticImageData } from "next/image";

// Defines the structure for a single work experience entry
export interface WorkExperience {
  id: number;
  company: string;
  logoUrl?: string | StaticImageData; // Optional company logo
  title: string;
  startDate: string; // e.g., "Jan 2020"
  endDate: string; // e.g., "Present" or "Dec 2021"
  responsibilities: string[];
  achievements?: string[]; // Optional
  technologies: string[];
}

// Array to hold all work experience entries
export const experiences: WorkExperience[] = [
  {
    id: 1,
    company: 'Camcorder.Ai',
    title: 'Full Stack Developer',
    startDate: 'Aug 2023',
    endDate: 'Jun 2025',
    responsibilities: [
      'Integrated Remotion player and Remotion lambda as their video pipeline.',
      'Added transcript editor and support for deleting and editing words in the transcript.',
      'Added support for multiple videos and transcript on a single remotion composition.',
      'Integrated S3 for storage related to image, video, audio and attachment upload, cloudfront as a content delivery network, deepgram for transcription generation, modal to process video on the fly, lambda for serverless compution.',
    ],
    technologies: ['Remotion', 'TypeScript', 'JavaScript', 'React', 'S3', 'CloudFront', 'Deepgram', 'Modal', 'Lambda'],
  },
  {
    id: 2,
    company: 'Funnel Rolodex (ClickFunnels sister company)',
    title: 'Full Stack Developer',
    startDate: 'May 2021',
    endDate: 'Jul 2023',
    responsibilities: [
      'Integrated Stripe for end to end payment infrastructure, with webhook to support realtime update.',
      'Design and Implemented a Real Time messaging center for 50k users, using hasura and graphql subscription.',
      'Cut down our render time of service listing page from over 3sec to under 1sec.',
      'Integrated aws ebs for micro services, s3 for storage related to image and attachment upload, cognito for authentication, cloudwatch to collect monitoring and operational data, lambda for serverless compution.',
    ],
    technologies: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Hasura', 'GraphQL', 'Stripe', 'AWS EBS', 'S3', 'Cognito', 'CloudWatch', 'Lambda'],
  },
  {
    id: 3,
    company: 'Remotion',
    title: 'Lead Collaborator',
    startDate: 'Feb 2021',
    endDate: 'Present',
    responsibilities: [
      'Added support for puppeteer-core, Apple M1.',
      'Supported H265, VP8/VP9 codecs, customized CRF in FFmpeg.',
      'Worked on @remotion/player to play React components as videos in-browser.',
    ],
    technologies: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'FFmpeg', 'Puppeteer'],
  },
  {
    id: 4,
    company: 'Technixia Automation',
    title: 'Full Stack Developer',
    startDate: 'Nov 2020',
    endDate: 'Mar 2021',
    responsibilities: [
      'Built an IoT mobile app using React Native, Redux, MQTT.',
      'Implemented MQTT server backend connected to MongoDB.',
      'Created dashboard web app to control IoT hardware.',
    ],
    technologies: ['React Native', 'Redux', 'JavaScript', 'MQTT', 'MongoDB', 'React'],
  },
  {
    id: 5,
    company: 'Delivast',
    title: 'Frontend Developer',
    startDate: 'Apr 2020',
    endDate: 'Nov 2020',
    responsibilities: [
      'Developed the delivast.co.za demo website.',
      'Added user-operator messaging service.',
      'Built a dashboard web app.',
      'Optimized React app load time (1.3s → 450ms).',
    ],
    technologies: ['React', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 6,
    company: 'Software Heritage',
    title: 'Open Source Contributor',
    startDate: 'Jan 2020',
    endDate: 'Mar 2020',
    responsibilities: [
      'Implemented Web API (URL, URLSearchParams).',
      'Added missing checkboxes for specific URLs.',
      'Created frontend algorithm to reduce backend requests.',
    ],
    technologies: ['JavaScript', 'HTML', 'CSS'],
  },
];
