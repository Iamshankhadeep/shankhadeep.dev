import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="mt-16 pt-8 border-t border-border">
			<div className="text-center text-sm text-muted-foreground">
				<p>
					&copy; {new Date().getFullYear()} Shankhadeep Dey. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
