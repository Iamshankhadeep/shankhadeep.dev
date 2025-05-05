export default function Resume() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">Resume</h1>
			<div className="flex flex-col items-center">
				<a
					href="/resume_shankhadeep.pdf"
					target="_blank"
					rel="noopener noreferrer"
					className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mb-6"
				>
					Download Resume
				</a>
				<div className="w-full max-w-4xl h-[800px] border border-gray-300 rounded-lg overflow-hidden">
					<iframe
						src="/resume_shankhadeep.pdf"
						className="w-full h-full"
						title="Shankhadeep Dey Resume"
					/>
				</div>
			</div>
		</div>
	);
}
