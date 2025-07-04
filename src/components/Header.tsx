"use client";
import type React from "react";
import Link from "next/link";
import { motion } from "motion/react";

const navItems = [
	{ name: "About", href: "/about" },
	{ name: "Projects", href: "/projects" },
	{ name: "Resume", href: "/resume" },
	{ name: "Contact", href: "/contact" },
];

const Header: React.FC = () => {
	return (
		<header className="py-8">
			<nav className="flex justify-between items-center">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Link
						href="/"
						className="text-lg font-semibold hover:text-muted-foreground transition-colors"
					>
						Shankhadeep Dey
					</Link>
				</motion.div>
				<div className="flex space-x-6 items-center">
					{navItems.map((item, index) => (
						<motion.div
							key={item.name}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
						>
							<Link
								href={item.href}
								className="text-base text-muted-foreground hover:text-foreground transition-colors"
							>
								{item.name}
							</Link>
						</motion.div>
					))}
				</div>
			</nav>
		</header>
	);
};

export default Header;
