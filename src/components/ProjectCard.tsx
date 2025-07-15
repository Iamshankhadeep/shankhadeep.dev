// src/components/ProjectCard.tsx
import React from "react";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt, FaStar, FaCode } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Project } from "../data/projects";

interface ProjectCardProps {
	project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
	const { title, description, technologies, repoUrl, liveUrl, features, category } = project;

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all duration-300">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						{category && (
							<Badge variant="outline" className="text-xs px-2 py-1">
								{category}
							</Badge>
						)}
						<div className="h-2 w-2 rounded-full bg-green-500" />
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">
						{title}
					</h3>
				</div>
				<div className="flex space-x-3">
					{repoUrl && (
						<Link
							href={repoUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 transition-all duration-300"
						>
							<FaGithub className="h-5 w-5" />
						</Link>
					)}
					{liveUrl && (
						<Link
							href={liveUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 transition-all duration-300"
						>
							<FaExternalLinkAlt className="h-4 w-4" />
						</Link>
					)}
				</div>
			</div>

			{/* Description */}
			<p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
				{description}
			</p>

			{/* Features */}
			{features && features.length > 0 && (
				<div className="space-y-2 mb-4">
					<div className="flex items-center gap-2 text-sm text-gray-500">
						<FaStar className="h-3 w-3" />
						<span>Key Features:</span>
					</div>
					<div className="flex flex-wrap gap-1">
						{features.slice(0, 3).map((feature, index) => (
							<span
								key={index}
								className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
							>
								{feature}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Technologies */}
			<div className="flex flex-wrap gap-2 mb-4">
				{technologies.map((tech, index) => (
					<Badge 
						key={index}
						variant="secondary" 
						className="text-xs font-medium bg-gray-100 text-gray-700"
					>
						{tech}
					</Badge>
				))}
			</div>

			{/* Bottom section */}
			<div className="flex items-center justify-between pt-4 border-t border-gray-200">
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<FaCode className="h-3 w-3" />
					<span>{technologies.length} technologies</span>
				</div>
				<div className="text-sm text-blue-600 font-medium">
					Explore →
				</div>
			</div>
		</div>
	);
};

export default ProjectCard;
