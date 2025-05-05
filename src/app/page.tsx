import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import EducationSection from "@/components/EducationSection";

export default function Home() {
	return (
		<>
			<HeroSection />
			<ProjectsSection />
			<SkillsSection />
			<EducationSection />
			{/* Other page sections will go here - ContactSection next */}
		</>
	);
}
