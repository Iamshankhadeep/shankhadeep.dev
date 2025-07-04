// src/components/SkillsSection.tsx
"use client";

import type React from "react";
import { skillCategories } from "@/data/skills";
import SkillBadge from "./SkillBadge";
import { motion } from "motion/react";

const SkillsSection: React.FC = () => {
	return (
		<section id="skills" className="py-16 md:py-24">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="text-3xl md:text-4xl font-bold mb-12"
			>
				Skills
			</motion.h2>

			<div className="flex flex-col space-y-8">
				{skillCategories.map((category, index) => (
					<motion.div
						key={category.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.7,
							delay: 0.2 * (index + 1),
							ease: "easeOut",
						}}
					>
						<h3 className="text-xl font-semibold mb-4">{category.title}</h3>
						<div className="flex flex-wrap gap-2">
							{category.skills.map((skill) => (
								<SkillBadge key={skill.name} skill={skill} />
							))}
						</div>
					</motion.div>
				))}
			</div>

			{/* Optional: Add a note about continuously learning */} 
			{/* <p className="text-center text-gray-600 dark:text-gray-400 mt-16">
				...and I'm always eager to learn more!
			</p> */}
		</section>
	);
};

export default SkillsSection;
