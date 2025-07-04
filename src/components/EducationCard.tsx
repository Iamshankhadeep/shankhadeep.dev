// src/components/EducationCard.tsx
import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationEntry } from '@/data/education'; // Import the interface

interface EducationCardProps {
  entry: EducationEntry;
}

const EducationCard: React.FC<EducationCardProps> = ({ entry }) => {
  return (
    <Card className="mb-6 transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start space-x-4">
          {/* Optional Logo */}
          {entry.logoUrl && (
            <div className="flex-shrink-0">
              <Image
                src={entry.logoUrl}
                alt={`${entry.institution} logo`}
                width={48} // Adjust size as needed
                height={48}
                className="rounded-full object-contain bg-white p-1 border border-border"
              />
            </div>
          )}
          <div className="flex-grow">
            <CardTitle className="text-xl">{entry.institution}</CardTitle>
            <p className="text-md font-medium text-primary">{entry.degree}</p>
            <p className="text-sm text-muted-foreground mb-1">{entry.fieldOfStudy}</p>
            <p className="text-xs text-muted-foreground">
              {entry.startDate} - {entry.endDate || 'Present'}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Optional Description/Details */}
      {entry.description && entry.description.length > 0 && (
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {entry.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
};

export default EducationCard;
