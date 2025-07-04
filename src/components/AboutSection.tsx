"use client";

import type React from "react";
import { motion } from "motion/react";

const AboutSection: React.FC = () => {
	return (
		<section id="about" className="py-16 md:py-24">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="text-3xl md:text-4xl font-bold mb-12"
			>
				About Me
			</motion.h2>

			<div className="flex flex-col space-y-4">
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
					className="text-lg text-muted-foreground"
				>
					Hello! I&apos;m Shankhadeep, a passionate Software Engineer. I
					specialize in building performant and scalable web applications and
					have a strong interest in AI and machine learning.
				</motion.p>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
					className="text-lg text-muted-foreground"
				>
					When I&apos;m not coding, you can find me exploring new
					technologies, hiking, or reading tech blogs.
				</motion.p>
			</div>
		</section>
	);
};

export default AboutSection;
