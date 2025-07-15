"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaDownload, FaPrint, FaEye, FaBriefcase, FaTools, FaAward } from "react-icons/fa";
import { experiences } from "@/data/experience";
import { skillCategories } from "@/data/skills";
import { Badge } from "@/components/ui/badge";

type ResumeSection = "overview" | "experience" | "skills" | "achievements";

const InteractiveResume: React.FC = () => {
	const [activeSection, setActiveSection] = useState<ResumeSection>("overview");
	const [showPDF, setShowPDF] = useState(false);

	const sections = [
		{ id: "overview" as const, label: "Overview", icon: FaEye },
		{ id: "experience" as const, label: "Experience", icon: FaBriefcase },
		{ id: "skills" as const, label: "Skills", icon: FaTools },
		{ id: "achievements" as const, label: "Achievements", icon: FaAward },
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	const renderOverview = () => (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="space-y-6"
		>
			<motion.div variants={itemVariants} className="text-center">
				<h2 className="text-4xl font-bold text-gray-900 mb-2">Shankhadeep Dey</h2>
				<p className="text-xl text-gray-600 mb-4">Full Stack Developer</p>
				<div className="flex justify-center gap-4 mb-6">
					<Badge variant="secondary">5+ Years Experience</Badge>
					<Badge variant="secondary">Full Stack</Badge>
					<Badge variant="secondary">Open Source</Badge>
				</div>
			</motion.div>

			<motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
				<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-3 text-blue-900">Professional Summary</h3>
					<p className="text-gray-700 leading-relaxed">
						Experienced Full Stack Developer with expertise in modern web technologies. 
						Passionate about creating scalable solutions and contributing to open source projects.
					</p>
				</div>
				<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-3 text-purple-900">Key Highlights</h3>
					<ul className="text-gray-700 space-y-2">
						<li>• 5+ years of full-stack development experience</li>
						<li>• Significant open source contributions</li>
						<li>• Led development of high-scale applications</li>
						<li>• Expertise in modern React ecosystem</li>
					</ul>
				</div>
			</motion.div>
		</motion.div>
	);

	const renderExperience = () => (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="space-y-6"
		>
			{experiences.map((exp) => (
				<motion.div
					key={exp.id}
					variants={itemVariants}
					className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="flex justify-between items-start mb-4">
						<div>
							<h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
							<p className="text-lg text-blue-600 font-medium">{exp.company}</p>
							<p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
						</div>
						<div className="flex flex-wrap gap-1">
							{exp.technologies.slice(0, 3).map((tech, i) => (
								<Badge key={i} variant="outline" className="text-xs">
									{tech}
								</Badge>
							))}
						</div>
					</div>
					<div className="space-y-2">
						{exp.responsibilities.map((resp, i) => (
							<p key={i} className="text-gray-700 text-sm">• {resp}</p>
						))}
					</div>
				</motion.div>
			))}
		</motion.div>
	);


	const renderSkills = () => (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="space-y-6"
		>
			{skillCategories.map((category) => (
				<motion.div
					key={category.title}
					variants={itemVariants}
					className="bg-white border border-gray-200 rounded-lg p-6"
				>
					<h3 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h3>
					<div className="flex flex-wrap gap-2">
						{category.skills.map((skill, i) => (
							<motion.div
								key={skill.name}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: i * 0.05 }}
								whileHover={{ scale: 1.05 }}
							>
								<Badge variant="secondary" className="cursor-default">
									{skill.name}
								</Badge>
							</motion.div>
						))}
					</div>
				</motion.div>
			))}
		</motion.div>
	);

	const renderAchievements = () => (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="space-y-6"
		>
			<motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
				<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-3 text-yellow-900">Awards & Recognition</h3>
					<ul className="text-yellow-800 space-y-2">
						<li>• Winner – Codersbit 2018 (College Campus)</li>
						<li>• 2nd Runner-Up – Inspiria Coder of the Campus 2018</li>
						<li>• 94th/2914 – HackerRank HourRank26</li>
						<li>• Swami Vivekananda Scholarship recipient</li>
					</ul>
				</div>
				<div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg">
					<h3 className="text-lg font-semibold mb-3 text-pink-900">Open Source Impact</h3>
					<ul className="text-pink-800 space-y-2">
						<li>• Key contributor to Remotion framework</li>
						<li>• Created CCSeva - Claude Code tracker</li>
						<li>• Built claudecode.directory platform</li>
						<li>• Active in developer community</li>
					</ul>
				</div>
			</motion.div>
		</motion.div>
	);

	const renderContent = () => {
		switch (activeSection) {
			case "overview":
				return renderOverview();
			case "experience":
				return renderExperience();
			case "skills":
				return renderSkills();
			case "achievements":
				return renderAchievements();
			default:
				return renderOverview();
		}
	};

	return (
		<div className="max-w-5xl mx-auto">
			{/* Header with actions */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
				<motion.h1
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className="text-3xl md:text-4xl font-bold text-gray-900"
				>
					Resume
				</motion.h1>
				<div className="flex gap-3">
					<motion.button
						onClick={() => setShowPDF(!showPDF)}
						className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<FaEye className="h-4 w-4" />
						{showPDF ? "Hide" : "View"} PDF
					</motion.button>
					<motion.a
						href="/resume_shankhadeep.pdf"
						download
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<FaDownload className="h-4 w-4" />
						Download
					</motion.a>
					<motion.button
						onClick={() => window.print()}
						className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<FaPrint className="h-4 w-4" />
						Print
					</motion.button>
				</div>
			</div>

			{/* PDF Viewer */}
			<AnimatePresence>
				{showPDF && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "600px" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="mb-8 border border-gray-200 rounded-lg overflow-hidden"
					>
						<iframe
							src="/resume_shankhadeep.pdf"
							className="w-full h-full"
							title="Shankhadeep Dey Resume"
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Navigation */}
			<div className="flex flex-wrap gap-2 mb-8">
				{sections.map((section) => (
					<motion.button
						key={section.id}
						onClick={() => setActiveSection(section.id)}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
							activeSection === section.id
								? "bg-blue-600 text-white shadow-lg"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<section.icon className="h-4 w-4" />
						{section.label}
					</motion.button>
				))}
			</div>

			{/* Content */}
			<AnimatePresence mode="wait">
				<motion.div
					key={activeSection}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="min-h-[400px]"
				>
					{renderContent()}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default InteractiveResume;