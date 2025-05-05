import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Shankhadeep Dey. All rights reserved.</p>
        {/* Add social links or other footer content here */}
      </div>
    </footer>
  );
};

export default Footer;
