import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          About Me
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center md:items-start gap-12"
        >
          {/* Image Column */}
          <div className="w-full md:w-1/3 flex justify-center">
            {/* Updated Image container */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg border-4 border-blue-500 bg-gray-200 dark:bg-gray-700">
              <Image
                // IMPORTANT: Replace this with the actual path to your profile picture!
                src="https://picsum.photos/seed/shankhadeep/256/256" // Placeholder image
                alt="Shankhadeep Dey profile picture"
                width={256} // Corresponds to md:w-64 * 4 (pixels)
                height={256} // Corresponds to md:h-64 * 4 (pixels)
                className="object-cover" // Ensures the image covers the area without distortion
                priority // Preload the image if it's above the fold
              />
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full md:w-2/3 text-center md:text-left">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Hello! I&apos;m Shankhadeep, a passionate Software Engineer based in [Your Location, e.g., Silicon Valley]. I specialize in building performant and scalable web applications and have a strong interest in AI and machine learning.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              [Add another paragraph about your journey, interests, or professional philosophy here. Mention key skills or areas you enjoy working in.]
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              When I&apos;m not coding, you can find me [mention a hobby or two, e.g., exploring new technologies, hiking, reading tech blogs].
            </p>
            {/* Optional: Skills/Interests subsection */}
            {/* <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Key Interests</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>Artificial Intelligence & Machine Learning</li>
                <li>Full-Stack Development</li>
                <li>Cloud Infrastructure (AWS)</li>
                <li>Open Source Contribution</li>
              </ul>
            </div> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
