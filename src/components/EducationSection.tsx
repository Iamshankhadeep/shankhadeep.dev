// src/components/EducationSection.tsx
import React from 'react';
import EducationCard from './EducationCard';
import { educationHistory } from '@/data/education';

const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Education
        </h2>

        <div className="max-w-4xl mx-auto">
          {/* Map over education history and render cards */}
          {educationHistory.map((entry) => (
            <EducationCard key={entry.id} entry={entry} />
          ))}
          
          {/* Add message if history is empty */}
          {educationHistory.length === 0 && (
             <p className="text-center text-gray-600 dark:text-gray-400">Education details coming soon.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
