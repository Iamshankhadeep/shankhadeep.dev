"use client";

import type React from "react";
import { motion } from "motion/react";
import { FaDownload } from "react-icons/fa";
import { personalInfo } from "@/data/personalInfo";

const HeroSection: React.FC = () => {
	return (
		<section className="py-24 md:py-32 lg:py-40">
			<div className="flex flex-col space-y-8">
				{/* Main heading */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
					className="space-y-4"
				>
					<motion.h1
						className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						Shankhadeep Dey
					</motion.h1>

					{/* Static role text */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.6 }}
						className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-medium"
					>
						Full Stack Developer
					</motion.div>

					{/* Subtitle */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.8 }}
						className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed"
					>
						I design, build, and ship software that makes a difference. 
						Passionate about creating elegant solutions to complex problems.
					</motion.p>
				</motion.div>

				{/* Action buttons */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1 }}
					className="flex flex-wrap gap-4 items-center"
				>
					<a
						href="/resume_shankhadeep.pdf"
						download
						className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-300"
					>
						<FaDownload className="h-4 w-4" />
						Download Resume
					</a>
					
					<a
						href="#projects"
						className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300"
					>
						View Projects
						<span>→</span>
					</a>
				</motion.div>

				{/* Social links */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.2 }}
					className="flex gap-4"
				>
					{personalInfo.socialLinks.map((link, index) => (
						<motion.a
							key={link.name}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md text-gray-600 transition-all duration-300"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
						>
							<link.icon className="h-5 w-5" />
						</motion.a>
					))}
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 1.5 }}
					className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
				>
					<div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
						<div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default HeroSection;
