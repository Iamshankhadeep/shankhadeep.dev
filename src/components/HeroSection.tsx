"use client";

import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
					{/* CTA Buttons using shadcn/ui Button */}
					<Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg hover:shadow-xl">
						<Link href="/projects">
							View Projects
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-md hover:shadow-lg">
						<Link href="/contact">
							Contact Me
						</Link>
					</Button>
				</motion.div>
			</div>
		</motion.section>
	);
};

export default HeroSection;
