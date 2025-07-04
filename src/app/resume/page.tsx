import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "motion/react";

export default function Resume() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
			<Header />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="py-16 md:py-24"
			>
				<h1 className="text-3xl md:text-4xl font-bold mb-12">Resume</h1>
				<div className="w-full h-[800px] border border-border rounded-lg overflow-hidden">
					<iframe
						src="/resume_shankhadeep.pdf"
						className="w-full h-full"
						title="Shankhadeep Dey Resume"
					/>
				</div>
			</motion.div>
			<Footer />
		</div>
	);
}
