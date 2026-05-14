import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
	title: "Blog - Shankhadeep Dey",
	description:
		"Technical notes, benchmarks, and engineering write-ups by Shankhadeep Dey.",
	openGraph: {
		title: "Blog - Shankhadeep Dey",
		description:
			"Technical notes, benchmarks, and engineering write-ups by Shankhadeep Dey.",
		url: "https://shankhadeep.dev/blog",
		type: "website",
	},
};

export default function Blog() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
			<Header />
			<main className="py-12">
				<p className="text-sm text-muted-foreground mb-3">Writing</p>
				<h1 className="text-3xl sm:text-4xl font-bold mb-4">Blog</h1>
				<p className="text-muted-foreground leading-7 mb-10">
					Benchmarks, implementation notes, and concise technical write-ups.
				</p>

				<div className="space-y-6">
					{blogPosts.map((post) => (
						<Link
							key={post.slug}
							href={post.href}
							className="block border border-border rounded-md p-5 hover:border-primary transition-colors"
						>
							<p className="text-sm text-muted-foreground mb-2">{post.date}</p>
							<h2 className="text-xl font-semibold mb-2">{post.title}</h2>
							<p className="text-muted-foreground leading-7">
								{post.description}
							</p>
						</Link>
					))}
				</div>
			</main>
			<Footer />
		</div>
	);
}
