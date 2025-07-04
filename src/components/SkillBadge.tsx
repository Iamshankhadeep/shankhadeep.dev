// src/components/SkillBadge.tsx
import React from "react";
import { Skill } from "@/data/skills";

interface SkillBadgeProps {
	skill: Skill;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
	return (
		<div className="border border-border rounded-md px-3 py-1 text-sm text-muted-foreground">
			{skill.name}
		</div>
	);
};

export default SkillBadge;
