"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaEnvelope, FaPlus, FaTimes } from "react-icons/fa";
import { personalInfo } from "@/data/personalInfo";

const FloatingContactButton: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{/* Social links menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.2 }}
						className="absolute bottom-16 right-0 flex flex-col gap-3"
					>
						{personalInfo.socialLinks.map((link, index) => (
							<motion.a
								key={link.name}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg text-gray-600 transition-all duration-300 border border-gray-200"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<link.icon className="h-5 w-5" />
							</motion.a>
						))}
						<motion.a
							href={`mailto:${personalInfo.email}`}
							className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg text-gray-600 transition-all duration-300 border border-gray-200"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: personalInfo.socialLinks.length * 0.1 }}
						>
							<FaEnvelope className="h-5 w-5" />
						</motion.a>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Main floating button */}
			<button
				onClick={toggleMenu}
				className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300"
			>
				{isOpen ? <FaTimes className="h-6 w-6" /> : <FaPlus className="h-6 w-6" />}
			</button>
		</div>
	);
};

export default FloatingContactButton;