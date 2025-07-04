// src/components/ContactSection.tsx
"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa"; // Import email icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { personalInfo } from "@/data/personalInfo"; // Import personal info
import { motion } from "motion/react";

// Define interface for form data
interface FormData {
	name: string;
	email: string;
	subject: string;
	message: string;
}

const ContactSection = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>();

	// State for submission status
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionStatus, setSubmissionStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	// Updated submit handler to use our API endpoint for Google Sheets
	const onSubmit: SubmitHandler<FormData> = async (data) => {
		setIsSubmitting(true);
		setSubmissionStatus("idle"); // Reset status on new submission

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				setSubmissionStatus("success");
				reset(); // Clear the form fields on success
				console.log("Form submitted successfully to Google Sheets!");
			} else {
				throw new Error("Form submission failed");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setSubmissionStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="contact" className="py-16 md:py-24">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="text-3xl md:text-4xl font-bold mb-12"
			>
				Get In Touch
			</motion.h2>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
			>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm font-medium">
							Name
						</Label>
						<Input
							type="text"
							id="name"
							placeholder="Your Name"
							className={errors.name ? "border-destructive" : ""}
							{...register("name", { required: "Name is required" })}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm font-medium">
							Email
						</Label>
						<Input
							type="email"
							id="email"
							placeholder="your.email@example.com"
							className={errors.email ? "border-destructive" : ""}
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Invalid email address",
								},
							})}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="subject" className="text-sm font-medium">
							Subject
						</Label>
						<Input
							type="text"
							id="subject"
							placeholder="Reason for contacting"
							className={errors.subject ? "border-destructive" : ""}
							{...register("subject", { required: "Subject is required" })}
						/>
						{errors.subject && (
							<p className="text-sm text-destructive">
								{errors.subject.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="message" className="text-sm font-medium">
							Message
						</Label>
						<Textarea
							id="message"
							rows={5}
							placeholder="Your message details..."
							className={errors.message ? "border-destructive" : ""}
							{...register("message", { required: "Message is required" })}
						/>
						{errors.message && (
							<p className="text-sm text-destructive">
								{errors.message.message}
							</p>
						)}
					</div>

					<div className="text-center">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full sm:w-auto"
						>
							{isSubmitting ? "Sending..." : "Send Message"}
						</Button>
					</div>
				</form>
				{submissionStatus === "success" && (
					<p className="text-center text-green-500 mt-4">
						Message sent successfully!
					</p>
				)}
				{submissionStatus === "error" && (
					<p className="text-center text-destructive mt-4">
						Failed to send message. Please try again later.
					</p>
				)}
			</motion.div>

			{/* Alternative Contact Methods */}
			<div className="mt-12 text-center">
				<Separator className="mb-8" />
				<h3 className="text-lg font-medium mb-4">
					Or Reach Out Directly
				</h3>
				<div className="flex justify-center items-center space-x-6">
					{/* Email Link */}
					<Button variant="ghost" size="icon" asChild>
						<a
							href={`mailto:${personalInfo.email}`}
							className="text-muted-foreground hover:text-foreground"
							aria-label="Email"
							title={personalInfo.email}
						>
							<FaEnvelope className="w-5 h-5" />
						</a>
					</Button>

					{/* Social Links */}
					{personalInfo.socialLinks.map((link) => (
						<Button key={link.name} variant="ghost" size="icon" asChild>
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground"
								aria-label={link.name}
								title={link.name}
							>
								<link.icon className="w-5 h-5" />
							</a>
						</Button>
					))}
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
