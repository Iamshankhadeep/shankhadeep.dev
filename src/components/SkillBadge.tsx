// src/components/SkillBadge.tsx
import React from "react";
import { Skill } from "@/data/skills";

interface SkillBadgeProps {
	skill: Skill;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
	return (
		<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-300">
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-medium text-gray-900">{skill.name}</h3>
				{skill.level && (
					<span className="text-sm font-bold text-gray-700">
						{skill.level}%
					</span>
				)}
			</div>
			
			{skill.level && (
				<div className="w-full bg-gray-200 rounded-full h-2 mb-2">
					<div
						className="h-2 rounded-full bg-gray-600"
						style={{ width: `${skill.level}%` }}
					/>
				</div>
			)}
			
			{skill.experience && (
				<p className="text-xs text-gray-500">{skill.experience}</p>
			)}
		</div>
	);
};

export default SkillBadge;
