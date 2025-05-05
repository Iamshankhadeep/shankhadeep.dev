"use client";

import type React from "react";
import Image from "next/image";
import type { WorkExperience } from "../data/experience"; // Adjusted path alias

interface ExperienceCardProps {
	experience: WorkExperience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
	return (
		<div className="mb-8 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
			{/* Header: Company Logo (Optional), Title, Company, Dates */}
			<div className="flex flex-col sm:flex-row justify-between items-start mb-4">
				<div className="flex items-center mb-2 sm:mb-0">
					{experience.logoUrl && (
						<Image
							src={experience.logoUrl}
							alt={`${experience.company} logo`}
							width={40}
							height={40}
							className="mr-4 rounded-full object-contain"
						/>
					)}
					<div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
							{experience.title}
						</h3>
						<p className="text-md font-medium text-blue-600 dark:text-blue-400">
							{experience.company}
						</p>
					</div>
				</div>
				<p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap mt-1 sm:mt-0">
					{experience.startDate} – {experience.endDate}
				</p>
			</div>

			{/* Responsibilities */}
			<div className="mb-4">
				<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
					Responsibilities:
				</h4>
				<ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
					{experience.responsibilities.map((resp, index) => (
						<li key={`resp-${experience.id}-${index}`}>{resp}</li>
					))}
				</ul>
			</div>

			{/* Achievements (Optional) */}
			{experience.achievements && experience.achievements.length > 0 && (
				<div className="mb-4">
					<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
						Achievements:
					</h4>
					<ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
						{experience.achievements.map((ach, index) => (
							<li key={`ach-${experience.id}-${index}`}>{ach}</li>
						))}
					</ul>
				</div>
			)}

			{/* Technologies */}
			<div>
				<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
					Technologies:
				</h4>
				<div className="flex flex-wrap gap-2">
					{experience.technologies.map((tech, index) => (
						<span
							key={`tech-${experience.id}-${index}`}
							className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200"
						>
							{tech}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default ExperienceCard;
