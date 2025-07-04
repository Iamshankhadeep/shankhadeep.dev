// src/components/EducationSection.tsx
"use client";

import type React from "react";
import { educationHistory } from "@/data/education";
import EducationCard from "./EducationCard";
import { motion } from "motion/react";

const EducationSection: React.FC = () => {
	return (
		<section id="education" className="py-16 md:py-24">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="text-3xl md:text-4xl font-bold mb-12"
			>
				Education
			</motion.h2>

			<div className="flex flex-col space-y-8">
				{educationHistory.map((entry, index) => (
					<motion.div
						key={entry.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.7,
							delay: 0.2 * (index + 1),
							ease: "easeOut",
						}}
					>
						<EducationCard entry={entry} />
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default EducationSection;
