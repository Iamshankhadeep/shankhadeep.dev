"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt } from "react-icons/fa";
import { motion } from "motion/react";

const ContactSection = () => {
	return (
		<section id="contact" className="py-16 md:py-24 text-center">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="text-3xl md:text-4xl font-bold mb-12"
			>
				Get In Touch
			</motion.h2>

			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
				className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto"
			>
				I&apos;m always open to discussing new projects, creative ideas, or
				opportunities to be part of an amazing team. Feel free to schedule a
				30-minute meeting with me.
			</motion.p>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
			>
				<Button asChild size="lg">
					<Link
						href="https://cal.com/iamshankhadeep/30min"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FaCalendarAlt className="mr-2 h-5 w-5" />
						Schedule a meeting
					</Link>
				</Button>
			</motion.div>
		</section>
	);
};

export default ContactSection;