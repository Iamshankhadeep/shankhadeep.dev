// src/data/personalInfo.ts
import type { IconType } from 'react-icons';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

export interface SocialLink {
  name: string;
  url: string;
  icon: IconType;
}

export interface PersonalInfo {
  email: string;
  socialLinks: SocialLink[];
}

// Replace placeholders with your actual information
export const personalInfo: PersonalInfo = {
  email: 'shankhadeepdey99@gmail.com',
  socialLinks: [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/iamshankhadeep',
      icon: FaLinkedin,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Iamshankhadeep',
      icon: FaGithub,
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/Iamshankhadeep',
      icon: FaTwitter,
    },
    // Add other social links here if needed
  ],
};
