// src/components/ProjectsSection.tsx
"use client";

import type React from "react";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import { motion } from "motion/react";

const ProjectsSection: React.FC = () => {
	return (
		<section id="projects" className="py-16 md:py-24">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="text-3xl md:text-4xl font-bold mb-12"
			>
				Projects
			</motion.h2>

			<div className="flex flex-col space-y-8">
				{projects.map((project, index) => (
					<motion.div
						key={project.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.2 * (index + 1), ease: "easeOut" }}
					>
						<ProjectCard project={project} />
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default ProjectsSection;
