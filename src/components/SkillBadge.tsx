// src/components/SkillBadge.tsx
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Skill } from '@/data/skills'; // Import the Skill interface

interface SkillBadgeProps {
  skill: Skill;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  const IconComponent = skill.icon;

  return (
    <Badge 
      variant="secondary" 
      className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium shadow-sm"
    >
      {IconComponent && <IconComponent className="w-4 h-4" aria-hidden="true" />}
      {skill.name}
    </Badge>
  );
};

export default SkillBadge;
