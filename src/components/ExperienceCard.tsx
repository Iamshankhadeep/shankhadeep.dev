"use client";

import type React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WorkExperience } from "../data/experience"; // Adjusted path alias

interface ExperienceCardProps {
	experience: WorkExperience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
	return (
		<Card className="mb-8">
			<CardHeader>
				{/* Header: Company Logo (Optional), Title, Company, Dates */}
				<div className="flex flex-col sm:flex-row justify-between items-start">
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
							<CardTitle className="text-xl">
								{experience.title}
							</CardTitle>
							<p className="text-md font-medium text-primary">
								{experience.company}
							</p>
						</div>
					</div>
					<p className="text-sm text-muted-foreground whitespace-nowrap mt-1 sm:mt-0">
						{experience.startDate} – {experience.endDate}
					</p>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Responsibilities */}
				<div>
					<h4 className="text-sm font-semibold mb-2">
						Responsibilities:
					</h4>
					<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
						{experience.responsibilities.map((resp, index) => (
							<li key={`resp-${experience.id}-${index}`}>{resp}</li>
						))}
					</ul>
				</div>

				{/* Achievements (Optional) */}
				{experience.achievements && experience.achievements.length > 0 && (
					<div>
						<h4 className="text-sm font-semibold mb-2">
							Achievements:
						</h4>
						<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
							{experience.achievements.map((ach, index) => (
								<li key={`ach-${experience.id}-${index}`}>{ach}</li>
							))}
						</ul>
					</div>
				)}

				{/* Technologies */}
				<div>
					<h4 className="text-sm font-semibold mb-2">
						Technologies:
					</h4>
					<div className="flex flex-wrap gap-2">
						{experience.technologies.map((tech, index) => (
							<Badge
								key={`tech-${experience.id}-${index}`}
								variant="secondary"
								className="text-xs"
							>
								{tech}
							</Badge>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ExperienceCard;
