"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";

const Header: React.FC = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
			<nav className="container mx-auto flex justify-between items-center">
				<div className="text-xl font-bold">
					<Link href="/">Shankhadeep Dey</Link>
				</div>
				{/* Desktop Navigation Links */}
				<div className="hidden md:flex space-x-6 items-center">
					<Link href="/about" className="hover:text-gray-300">
						About
					</Link>
					<Link href="/projects" className="hover:text-gray-300">
						Projects
					</Link>
					<Link href="/resume" className="hover:text-gray-300">
						Resume
					</Link>
					<Link href="/contact" className="hover:text-gray-300">
						Contact
					</Link>
				</div>
				{/* Mobile Menu Button */}
				<div className="md:hidden">
					<button
						type="button"
						onClick={toggleMobileMenu}
						className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						aria-label="Toggle menu"
						aria-expanded={isMobileMenuOpen}
					>
						{/* Hamburger Icon (SVG) */}
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							{isMobileMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
				</div>
			</nav>

			{/* Mobile Menu Panel */}
			{isMobileMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 p-4 shadow-md">
					<div className="flex flex-col space-y-4">
						<Link
							href="/about"
							className="hover:text-gray-300 block"
							onClick={toggleMobileMenu}
						>
							About
						</Link>
						<Link
							href="/projects"
							className="hover:text-gray-300 block"
							onClick={toggleMobileMenu}
						>
							Projects
						</Link>
						<Link
							href="/resume"
							className="hover:text-gray-300 block"
							onClick={toggleMobileMenu}
						>
							Resume
						</Link>
						<Link
							href="/contact"
							className="hover:text-gray-300 block"
							onClick={toggleMobileMenu}
						>
							Contact
						</Link>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
