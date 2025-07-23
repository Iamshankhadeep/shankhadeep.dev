import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";

export default function Home() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
			<Header />
			<HeroSection />
			<ExperienceSection />
			<ProjectsSection />
			<SkillsSection />
			<Footer />
		</div>
	);
}
