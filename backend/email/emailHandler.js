import { resendClient, sender } from "../lib/resend";
import { createWelcomeEmailTemplate } from "./emailTemplate";

export const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: 'Welcome to Chatify!',
        html: createWelcomeEmailTemplate(name, email, clientURL),
    });

    if (error) {
        console.error("Error sending welcome email:", email);
        throw new Error("Failed to send resend email");
    }
    console.log("Welcome Email sent successfully", data);
}