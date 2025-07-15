// src/data/projects.ts

/**
 * Represents a project showcased on the portfolio.
 */
export interface Project {
  /** Unique identifier for the project */
  id: string | number;
  /** The title or name of the project */
  title: string;
  /** A brief description of the project */
  description: string;
  /** URL or path to the project's preview image or screenshot */
  imageUrl?: string;
  /** List of key technologies, frameworks, or languages used */
  technologies: string[];
  /** Optional URL to the live demo or deployment */
  liveUrl?: string;
  /** Optional URL to the source code repository (e.g., GitHub) */
  repoUrl?: string;
  /** Optional list of key features or achievements */
  features?: string[];
  /** Optional category for filtering (e.g., 'Web App', 'AI/ML', 'Tooling') */
  category?: string;
}

/**
 * Array containing all the project data.
 */
export const projects: Project[] = [
  {
    id: 'ccseva',
    title: 'CCSeva - Claude Code Usage Tracker',
    description: 'A beautiful macOS menu bar app for tracking Claude Code usage in real-time. Features 30-second updates, smart plan detection, 7-day analytics, and elegant glass morphism design.',
    technologies: ['Electron', 'React', 'TypeScript', 'Tailwind CSS', 'Radix UI'],
    liveUrl: 'https://github.com/iamshankhadeep/ccseva/releases',
    repoUrl: 'https://github.com/iamshankhadeep/ccseva',
    features: ['Real-time Token Monitoring', 'Smart Plan Detection', '7-day Analytics', 'Cost Tracking', 'Smart Notifications', 'Glass Morphism UI'],
    category: 'Desktop Application',
  },
  {
    id: 'claudecode-directory',
    title: 'Claude Code Directory',
    description: 'The ultimate resource hub for Claude developers. A community-driven platform featuring 1000+ curated tools, prompts, and resources with smart search and voting system.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://claudecode.directory',
    repoUrl: 'https://github.com/iamshankhadeep/claudecode-directory',
    features: ['1000+ Curated Resources', 'Community Voting', 'Smart Search & Filters', 'Resource Submission', 'Claude.md Config Hub', 'CLI Commands Directory'],
    category: 'Web Platform',
  },
  {
    id: 'portfolio-website',
    title: 'Personal Portfolio Website',
    description: 'My personal corner of the internet, showcasing my skills, experience, and projects. Built with Next.js, Tailwind CSS, and TypeScript.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://shankhadeep.dev',
    repoUrl: 'https://github.com/Iamshankhadeep/shankhadeep.dev',
    features: ['Responsive Design', 'Project Showcase', 'Interactive UI', 'Dark Mode'],
    category: 'Web Development',
  },
  {
    id: 'remotion-contributions',
    title: 'Remotion Open Source Contributions',
    description: 'Significant contributions to Remotion, a framework for creating videos programmatically using React. Added support for various features that improved the developer experience.',
    technologies: ['TypeScript', 'React', 'Node.js', 'FFmpeg'],
    liveUrl: 'https://www.remotion.dev/',
    repoUrl: 'https://github.com/remotion-dev/remotion',
    features: ['Puppeteer-core Support', 'Apple M1 Compatibility', 'H265/VP8/VP9 Codec Support', 'Custom CRF in FFmpeg'],
    category: 'Open Source',
  },
  {
    id: 'messaging-center',
    title: 'Real-time Messaging Center',
    description: 'Developed a high-scale messaging platform for 50,000+ users that enables real-time communication between service providers and customers.',
    technologies: ['React', 'TypeScript', 'Hasura', 'GraphQL', 'AWS'],
    features: ['Real-time Updates via GraphQL Subscriptions', 'Message Threading', 'User Presence Indicators', 'Notification System'],
    category: 'Web Application',
  },
  {
    id: 'iot-control-system',
    title: 'IoT Control System',
    description: 'A comprehensive IoT solution that includes a mobile app and web dashboard to monitor and control connected hardware devices.',
    technologies: ['React Native', 'Redux', 'MQTT', 'MongoDB', 'React'],
    features: ['Real-time Device Status', 'Remote Control Capabilities', 'Data Visualization', 'User Authentication'],
    category: 'IoT & Mobile',
  },
];
