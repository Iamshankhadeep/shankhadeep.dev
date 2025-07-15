import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InteractiveResume from "@/components/InteractiveResume";

export default function Resume() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<Header />
			<div className="py-16 md:py-24">
				<InteractiveResume />
			</div>
			<Footer />
		</div>
	);
}
