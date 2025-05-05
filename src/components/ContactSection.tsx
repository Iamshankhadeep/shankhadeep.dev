// src/components/ContactSection.tsx
"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa"; // Import email icon
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

				<div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
					{/* Use handleSubmit to wrap the form submission */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Name
							</label>
							<input
								type="text"
								id="name"
								placeholder="Your Name"
								className={`w-full px-4 py-2 border ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
								// Register the input with validation
								{...register("name", { required: "Name is required" })}
								aria-invalid={errors.name ? "true" : "false"} // Add aria-invalid
								aria-describedby={errors.name ? "name-error" : undefined} // Link to error message
							/>
							{errors.name && (
								<p
									id="name-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
								>
									{" "}
									{/* Add ID */}
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								placeholder="your.email@example.com"
								className={`w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
								// Register with required and email pattern validation
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Invalid email address",
									},
								})}
								aria-invalid={errors.email ? "true" : "false"} // Add aria-invalid
								aria-describedby={errors.email ? "email-error" : undefined} // Link to error message
							/>
							{errors.email && (
								<p
									id="email-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
								>
									{" "}
									{/* Add ID */}
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Subject Field */}
						<div>
							<label
								htmlFor="subject"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Subject
							</label>
							<input
								type="text"
								id="subject"
								placeholder="Reason for contacting"
								className={`w-full px-4 py-2 border ${errors.subject ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
								// Register with required validation
								{...register("subject", { required: "Subject is required" })}
								aria-invalid={errors.subject ? "true" : "false"} // Add aria-invalid
								aria-describedby={errors.subject ? "subject-error" : undefined} // Link to error message
							/>
							{errors.subject && (
								<p
									id="subject-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
								>
									{" "}
									{/* Add ID */}
									{errors.subject.message}
								</p>
							)}
						</div>

						{/* Message Field */}
						<div>
							<label
								htmlFor="message"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Message
							</label>
							<textarea
								id="message"
								rows={5}
								placeholder="Your message details..."
								className={`w-full px-4 py-2 border ${errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
								// Register with required validation
								{...register("message", { required: "Message is required" })}
								aria-invalid={errors.message ? "true" : "false"} // Add aria-invalid
								aria-describedby={errors.message ? "message-error" : undefined} // Link to error message
							/>
							{errors.message && (
								<p
									id="message-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
								>
									{" "}
									{/* Add ID */}
									{errors.message.message}
								</p>
							)}
						</div>

						{/* Submit Button - disabled during submission */}
						<div className="text-center">
							<button
								type="submit"
								disabled={isSubmitting} // Disable button when submitting
								className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white 
                          ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
							>
								{isSubmitting ? "Sending..." : "Send Message"}
							</button>
						</div>

						{/* Submission status messages */}
						<div className="mt-4 text-center h-6">
							{" "}
							{/* Reserve space for messages */}
							{submissionStatus === "success" && (
								<p className="text-green-600 dark:text-green-400">
									Message sent successfully!
								</p>
							)}
							{submissionStatus === "error" && (
								<p className="text-red-600 dark:text-red-400">
									Failed to send message. Please try again later.
								</p>
							)}
						</div>
					</form>
				</div>

				{/* Alternative Contact Methods */}
				<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						Or Reach Out Directly
					</h3>
					<div className="flex justify-center items-center space-x-6">
						{/* Email Link */}
						<a
							href={`mailto:${personalInfo.email}`}
							className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition duration-150 ease-in-out"
							aria-label="Email"
							title={personalInfo.email} // Show email on hover
						>
							<FaEnvelope className="w-6 h-6" />
						</a>

						{/* Social Links */}
						{personalInfo.socialLinks.map((link) => (
							<a
								key={link.name}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition duration-150 ease-in-out"
								aria-label={link.name}
								title={link.name} // Show platform name on hover
							>
								<link.icon className="w-6 h-6" />
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
