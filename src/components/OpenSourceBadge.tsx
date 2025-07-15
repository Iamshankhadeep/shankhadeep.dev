"use client";

import React from "react";
import { motion } from "motion/react";
import { FaGithub, FaStar, FaCodeBranch } from "react-icons/fa";

interface OpenSourceBadgeProps {
	type: "contributor" | "maintainer" | "creator";
	project: string;
	description?: string;
	stats?: {
		stars?: number;
		forks?: number;
		commits?: number;
	};
}

const OpenSourceBadge: React.FC<OpenSourceBadgeProps> = ({
	type,
	project,
	description,
	stats,
}) => {
	const getBadgeColor = (type: string) => {
		switch (type) {
			case "creator":
				return "bg-gradient-to-r from-purple-500 to-pink-500";
			case "maintainer":
				return "bg-gradient-to-r from-blue-500 to-cyan-500";
			case "contributor":
				return "bg-gradient-to-r from-green-500 to-teal-500";
			default:
				return "bg-gradient-to-r from-gray-500 to-gray-600";
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "creator":
				return "🚀";
			case "maintainer":
				return "🔧";
			case "contributor":
				return "⭐";
			default:
				return "👨‍💻";
		}
	};

	return (
		<motion.div
			className="relative overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
			whileHover={{ scale: 1.02, y: -2 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Badge header */}
			<div className={`${getBadgeColor(type)} px-4 py-2 text-white`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-lg">{getTypeIcon(type)}</span>
						<span className="font-semibold capitalize">{type}</span>
					</div>
					<FaGithub className="h-4 w-4" />
				</div>
			</div>

			{/* Content */}
			<div className="p-4">
				<h3 className="font-semibold text-gray-900 mb-2">{project}</h3>
				{description && (
					<p className="text-sm text-gray-600 mb-3">{description}</p>
				)}

				{/* Stats */}
				{stats && (
					<div className="flex items-center gap-4 text-sm text-gray-500">
						{stats.stars && (
							<div className="flex items-center gap-1">
								<FaStar className="h-3 w-3" />
								<span>{stats.stars}</span>
							</div>
						)}
						{stats.forks && (
							<div className="flex items-center gap-1">
								<FaCodeBranch className="h-3 w-3" />
								<span>{stats.forks}</span>
							</div>
						)}
						{stats.commits && (
							<div className="flex items-center gap-1">
								<span>📝</span>
								<span>{stats.commits} commits</span>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Shine effect */}
			<div className="absolute inset-0 -top-2 -left-2 w-8 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform rotate-12 animate-pulse" />
		</motion.div>
	);
};

export default OpenSourceBadge;