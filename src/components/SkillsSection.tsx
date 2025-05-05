// src/components/SkillsSection.tsx
import React from 'react';
import { skillCategories } from '@/data/skills'; // Import categorized skills data
import SkillBadge from './SkillBadge';         // Import the SkillBadge component

const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-16 md:py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          My Skills
        </h2>

        <div className="space-y-12"> {/* Add space between categories */}
          {skillCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-l-4 border-blue-500 pl-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3"> {/* Use flex-wrap for badges */}
                {category.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Optional: Add a note about continuously learning */} 
        {/* <p className="text-center text-gray-600 dark:text-gray-400 mt-16">
          ...and I'm always eager to learn more!
        </p> */}
      </div>
    </section>
  );
};

export default SkillsSection;
