// src/components/ProjectsSection.tsx
"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { projects } from "../data/projects"; // Import only projects
import ProjectCard from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const ProjectsSection: React.FC = () => {
	const [selectedTag, setSelectedTag] = useState<string | null>(null); // null means 'All'

	// 1. Get unique technologies
	const uniqueTags = useMemo(() => {
		const tags = new Set<string>();
		for (const project of projects) {
			for (const tech of project.technologies) {
				tags.add(tech);
			}
		}
		return ["All", ...Array.from(tags).sort()]; // Add 'All' and sort
	}, []); // Calculate only once

	// 4. Implement Filtering Logic
	const filteredProjects = useMemo(() => {
		if (!selectedTag || selectedTag === "All") {
			return projects;
		}
		return projects.filter((project) =>
			project.technologies.includes(selectedTag),
		);
	}, [selectedTag]);

	const handleTagClick = (tag: string) => {
		setSelectedTag(tag === "All" ? null : tag);
	};

	return (
		<section
			id="projects"
			className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900"
		>
			<div className="container mx-auto px-4">
				<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
					My Projects
				</h2>

				{/* 3. Create Filter Buttons */}
				{projects.length > 0 && (
					<div className="flex flex-wrap justify-center gap-2 mb-12">
						{uniqueTags.map((tag) => (
							<button
								type="button"
								key={tag}
								onClick={() => handleTagClick(tag)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                  ${
										selectedTag === tag ||
										(selectedTag === null && tag === "All")
											? "bg-blue-600 text-white"
											: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
									}
                `}
							>
								{tag}
							</button>
						))}
					</div>
				)}

				{/* 5. Render Filtered Projects with Animation */}
				<motion.div
					layout // Animate layout changes
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					<AnimatePresence>
						{filteredProjects.length > 0 ? (
							filteredProjects.map((project) => (
								<motion.div
									key={project.id} // Ensure key is on the motion component for AnimatePresence
									layout // Animate position changes
									initial={{ opacity: 0, scale: 0.9 }} // Initial animation state
									animate={{ opacity: 1, scale: 1 }} // Animate to this state
									exit={{ opacity: 0, scale: 0.9 }} // Animate out to this state
									transition={{ duration: 0.3 }}
								>
									<ProjectCard project={project} />
								</motion.div>
							))
						) : (
							// This part might not be reached if 'All' always shows projects,
							// but good fallback if projects array itself could be empty initially.
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-center text-gray-600 dark:text-gray-400 md:col-span-2 lg:col-span-3"
							>
								No projects match the selected filter.
							</motion.p>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Message if the initial projects array is empty */}
				{projects.length === 0 && (
					<p className="text-center text-gray-600 dark:text-gray-400">
						No projects to display yet. Check back soon!
					</p>
				)}
			</div>
		</section>
	);
};

export default ProjectsSection;
