"use client";

import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
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
				ease: "easeOut",
			},
		},
	};

	return (
		<motion.section
			className="flex items-center justify-center text-center py-20 md:py-32 lg:py-40 px-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 min-h-[calc(100vh-80px)]"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<div className="max-w-3xl mx-auto">
				{/* Responsive Text Sizes with Animation */}
				<motion.h1
					className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-gray-900 dark:text-white"
					variants={itemVariants}
				>
					Shankhadeep Dey
				</motion.h1>
				<motion.p
					className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 md:mb-12"
					variants={itemVariants}
				>
					Full Stack Developer | Building Scalable Web & Mobile Applications
				</motion.p>
				{/* Responsive Button Layout with Animation */}
				<motion.div
					className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
					variants={itemVariants}
				>
					{/* CTA Buttons as Links */}
					<Link
						href="/projects"
						className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
					>
						View Projects
					</Link>
					<Link
						href="/contact"
						className="w-full sm:w-auto bg-gray-200 text-gray-800 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-900 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
					>
						Contact Me
					</Link>
				</motion.div>
			</div>
		</motion.section>
	);
};

export default HeroSection;
