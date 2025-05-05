// src/components/EducationCard.tsx
import React from 'react';
import Image from 'next/image';
import { EducationEntry } from '@/data/education'; // Import the interface

interface EducationCardProps {
  entry: EducationEntry;
}

const EducationCard: React.FC<EducationCardProps> = ({ entry }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 transition-shadow duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          {/* Optional Logo */}
          {entry.logoUrl && (
            <div className="flex-shrink-0">
              <Image
                src={entry.logoUrl}
                alt={`${entry.institution} logo`}
                width={48} // Adjust size as needed
                height={48}
                className="rounded-full object-contain bg-white p-1 border border-gray-200 dark:border-gray-600"
              />
            </div>
          )}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{entry.institution}</h3>
            <p className="text-md font-medium text-blue-600 dark:text-blue-400">{entry.degree}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{entry.fieldOfStudy}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {entry.startDate} - {entry.endDate || 'Present'}
            </p>
          </div>
        </div>

        {/* Optional Description/Details */}
        {entry.description && entry.description.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {entry.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationCard;
