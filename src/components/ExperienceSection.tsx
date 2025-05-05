import React from 'react';
import { experiences } from '@/data/experience'; // Assuming experiences are manually sorted newest first
import ExperienceCard from './ExperienceCard';

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Work Experience
        </h2>

        <div className="max-w-3xl mx-auto">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">No experience data available yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
