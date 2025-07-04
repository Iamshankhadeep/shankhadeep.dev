// src/components/ProjectCard.tsx
import React from "react";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Project } from "../data/projects";

interface ProjectCardProps {
	project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
	const { title, description, technologies, repoUrl, liveUrl } = project;

	return (
		<div className="border border-border rounded-lg p-6 transition-all duration-300 hover:bg-neutral-50">
			<div className="flex flex-col space-y-4">
				<div className="flex justify-between items-start">
					<h3 className="text-xl font-semibold">{title}</h3>
					<div className="flex space-x-4">
						{repoUrl && (
							<Link
								href={repoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<FaGithub className="h-5 w-5" />
							</Link>
						)}
						{liveUrl && (
							<Link
								href={liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<FaExternalLinkAlt className="h-5 w-5" />
							</Link>
						)}
					</div>
				</div>
				<p className="text-muted-foreground line-clamp-3">{description}</p>
				<div className="flex flex-wrap gap-2">
					{technologies.map((tech, index) => (
						<Badge key={index} variant="secondary" className="text-xs">
							{tech}
						</Badge>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProjectCard;
