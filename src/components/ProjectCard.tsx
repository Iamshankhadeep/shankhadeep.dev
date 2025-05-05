// src/components/ProjectCard.tsx
import React from 'react';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, imageUrl, technologies } = project;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700"> {/* Fixed height container */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${title} screenshot`}
            layout="fill" // Fill the container
            objectFit="cover" // Cover the area, cropping if needed
            className="transition-opacity duration-300 ease-in-out"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Technologies Section */}
        <div className="mb-4 flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              <FaExternalLinkAlt className="mr-1.5 h-4 w-4" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <FaGithub className="mr-1.5 h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
