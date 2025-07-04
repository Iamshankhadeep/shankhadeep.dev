// src/components/ProjectCard.tsx
import React from 'react';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, imageUrl, technologies } = project;

  return (
    <Card className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${title} screenshot`}
            fill
            className="object-cover transition-opacity duration-300 ease-in-out"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground">No Image Available</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Technologies Section */}
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="pt-4">
          <Separator className="mb-4" />
          <div className="flex justify-end space-x-2">
            {project.liveUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  <FaExternalLinkAlt className="h-3 w-3" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  <FaGithub className="h-3 w-3" />
                  GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
