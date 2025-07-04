// src/components/ContactSection.tsx
"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa"; // Import email icon
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { personalInfo } from "@/data/personalInfo"; // Import personal info

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
		<section
			id="contact"
			className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900"
		>
			<div className="container mx-auto px-4">
				<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
					Get In Touch
				</h2>

				<Card className="max-w-3xl mx-auto">
					<CardHeader>
						<CardTitle className="text-center">Send me a message</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Name Field */}
							<div className="space-y-2">
								<Label
									htmlFor="name"
									className="text-sm font-medium"
								>
									Name
								</Label>
								<Input
									type="text"
									id="name"
									placeholder="Your Name"
									className={errors.name ? "border-destructive" : ""}
									{...register("name", { required: "Name is required" })}
									aria-invalid={errors.name ? "true" : "false"}
									aria-describedby={errors.name ? "name-error" : undefined}
								/>
								{errors.name && (
									<p
										id="name-error"
										className="text-sm text-destructive"
									>
										{errors.name.message}
									</p>
								)}
							</div>

							{/* Email Field */}
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="text-sm font-medium"
								>
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
									aria-invalid={errors.email ? "true" : "false"}
									aria-describedby={errors.email ? "email-error" : undefined}
								/>
								{errors.email && (
									<p
										id="email-error"
										className="text-sm text-destructive"
									>
										{errors.email.message}
									</p>
								)}
							</div>

							{/* Subject Field */}
							<div className="space-y-2">
								<Label
									htmlFor="subject"
									className="text-sm font-medium"
								>
									Subject
								</Label>
								<Input
									type="text"
									id="subject"
									placeholder="Reason for contacting"
									className={errors.subject ? "border-destructive" : ""}
									{...register("subject", { required: "Subject is required" })}
									aria-invalid={errors.subject ? "true" : "false"}
									aria-describedby={errors.subject ? "subject-error" : undefined}
								/>
								{errors.subject && (
									<p
										id="subject-error"
										className="text-sm text-destructive"
									>
										{errors.subject.message}
									</p>
								)}
							</div>

							{/* Message Field */}
							<div className="space-y-2">
								<Label
									htmlFor="message"
									className="text-sm font-medium"
								>
									Message
								</Label>
								<Textarea
									id="message"
									rows={5}
									placeholder="Your message details..."
									className={errors.message ? "border-destructive" : ""}
									{...register("message", { required: "Message is required" })}
									aria-invalid={errors.message ? "true" : "false"}
									aria-describedby={errors.message ? "message-error" : undefined}
								/>
								{errors.message && (
									<p
										id="message-error"
										className="text-sm text-destructive"
									>
										{errors.message.message}
									</p>
								)}
							</div>

							{/* Submit Button */}
							<div className="text-center">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="px-8 py-2"
									size="lg"
								>
									{isSubmitting ? "Sending..." : "Send Message"}
								</Button>
							</div>

							{/* Submission status messages */}
							<div className="text-center h-6">
								{submissionStatus === "success" && (
									<p className="text-sm text-success">
										Message sent successfully!
									</p>
								)}
								{submissionStatus === "error" && (
									<p className="text-sm text-destructive">
										Failed to send message. Please try again later.
									</p>
								)}
							</div>
						</form>
					</CardContent>
				</Card>

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
			</div>
		</section>
	);
};

export default ContactSection;
