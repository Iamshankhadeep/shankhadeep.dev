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
  /** Proficiency level (1-100) */
  level?: number;
  /** Years of experience */
  experience?: string;
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
      { name: 'TypeScript', level: 95, experience: '4+ years' },
      { name: 'JavaScript', level: 98, experience: '5+ years' },
      { name: 'HTML5', level: 95, experience: '5+ years' },
      { name: 'CSS3', level: 90, experience: '5+ years' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    skills: [
      { name: 'React', level: 95, experience: '4+ years' },
      { name: 'React Native', level: 85, experience: '3+ years' },
      { name: 'Node.js', level: 90, experience: '4+ years' },
      { name: 'Express.js', level: 85, experience: '3+ years' },
      { name: 'Redux', level: 80, experience: '3+ years' },
      { name: 'Remotion', level: 90, experience: '3+ years' },
      { name: 'GraphQL', level: 85, experience: '2+ years' },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { name: 'MongoDB', level: 80, experience: '3+ years' },
      { name: 'PostgreSQL', level: 75, experience: '2+ years' },
      { name: 'Redis', level: 70, experience: '2+ years' },
    ],
  },
  {
    title: 'Tools & Platforms',
    skills: [
      { name: 'Git & GitHub', level: 95, experience: '5+ years' },
      { name: 'AWS Services', level: 85, experience: '3+ years' },
      { name: 'Hasura', level: 80, experience: '2+ years' },
      { name: 'Stripe', level: 75, experience: '2+ years' },
      { name: 'Deepgram', level: 70, experience: '1+ years' },
      { name: 'Modal', level: 70, experience: '1+ years' },
      { name: 'MQTT', level: 75, experience: '2+ years' },
    ],
  },
];
