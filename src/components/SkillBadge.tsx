// src/components/SkillBadge.tsx
import React from 'react';
import { Skill } from '@/data/skills'; // Import the Skill interface

interface SkillBadgeProps {
  skill: Skill;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  const IconComponent = skill.icon;

  return (
    <span 
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 
                 border border-blue-300 dark:border-blue-700 shadow-sm"
    >
      {IconComponent && <IconComponent className="w-4 h-4 mr-1.5" aria-hidden="true" />}
      {skill.name}
    </span>
  );
};

export default SkillBadge;
