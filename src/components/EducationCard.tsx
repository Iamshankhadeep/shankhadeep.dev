// src/components/EducationCard.tsx
import React from "react";
import { EducationEntry } from "@/data/education";

interface EducationCardProps {
	entry: EducationEntry;
}

const EducationCard: React.FC<EducationCardProps> = ({ entry }) => {
	const { institution, degree, fieldOfStudy, startDate, endDate, description } =
		entry;

	return (
		<div className="border border-border rounded-lg p-6 transition-all duration-300 hover:bg-neutral-50">
			<div className="flex flex-col space-y-2">
				<div className="flex justify-between items-start">
					<div className="flex flex-col">
						<h3 className="text-xl font-semibold">{institution}</h3>
						<p className="text-md font-medium text-muted-foreground">
							{degree}
						</p>
					</div>
					<p className="text-sm text-muted-foreground">
						{startDate} - {endDate || "Present"}
					</p>
				</div>
				<p className="text-sm text-muted-foreground">{fieldOfStudy}</p>
				{description && description.length > 0 && (
					<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
						{description.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default EducationCard;
