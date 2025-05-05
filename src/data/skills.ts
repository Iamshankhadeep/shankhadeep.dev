// src/data/skills.ts
import type { IconType } from 'react-icons'; // We might use icons later

/**
 * Represents a single skill.
 */
export interface Skill {
  /** The name of the skill */
  name: string;
  /** Optional icon component (e.g., from react-icons) */
  icon?: IconType;
  // We can add proficiency level later if needed: level?: number (e.g., 1-5 or percentage)
}

/**
 * Represents a category of skills.
 */
export interface SkillCategory {
  /** The title of the category (e.g., 'Programming Languages') */
  title: string;
  /** List of skills belonging to this category */
  skills: Skill[];
}

/**
 * Array containing all the skill data, organized by category.
 * Populate this array with your actual skills.
 */
export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'HTML5' },
      { name: 'CSS3' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    skills: [
      { name: 'React' },
      { name: 'React Native' },
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'Redux' },
      { name: 'Remotion' },
      { name: 'GraphQL' },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'MongoDB' },
      { name: 'PostgreSQL' },
      { name: 'Redis' },
    ],
  },
  {
    title: 'Tools & Platforms',
    skills: [
      { name: 'Git & GitHub' },
      { name: 'AWS (S3, CloudFront, Lambda, EBS, Cognito, CloudWatch)' },
      { name: 'Hasura' },
      { name: 'Stripe' },
      { name: 'Deepgram' },
      { name: 'Modal' },
      { name: 'MQTT' },
    ],
  },
];
