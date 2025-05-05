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
    endDate: 'Present',
    responsibilities: [
      'Integrated Remotion player and lambda for video pipelines.',
      'Built transcript editor with word-level editing and deletion.',
      'Supported multiple videos/transcripts per Remotion composition.',
    ],
    technologies: ['Remotion', 'TypeScript', 'JavaScript', 'React', 'S3', 'CloudFront', 'Deepgram', 'Modal', 'Lambda'],
  },
  {
    id: 2,
    company: 'Funnel Rolodex (ClickFunnels sister company)',
    title: 'Full Stack Developer',
    startDate: 'May 2021',
    endDate: 'Present',
    responsibilities: [
      'Integrated Stripe with webhooks for real-time payments.',
      'Built a real-time messaging center for 50k+ users using Hasura and GraphQL subscriptions.',
      'Improved service listing page load time (3s → <1s).',
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
