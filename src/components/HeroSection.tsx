"use client";

import type React from "react";
import { motion } from "motion/react";

const HeroSection: React.FC = () => {
	return (
		<section className="py-24 md:py-32 lg:py-40">
			<div className="flex flex-col space-y-4">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
					className="text-4xl sm:text-5xl md:text-6xl font-bold"
				>
					Shankhadeep Dey
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
					className="text-lg sm:text-xl text-muted-foreground"
				>
					I design, build, and ship software.
				</motion.p>
			</div>
		</section>
	);
};

export default HeroSection;
