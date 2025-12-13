
import nodemailer from 'nodemailer';

// Configure transporter
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST || 'smtp.gmail.com',
	port: parseInt(process.env.EMAIL_PORT || '587'),
	secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

interface ReservationDetails {
	name: string;
	email: string;
	phone: string;
	guests: number;
	date: Date;
	packName?: string;
}

export const sendReservationNotification = async (toEmail: string, details: ReservationDetails) => {
	if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
		console.warn("Email credentials not set. Skipping email notification.");
		return;
	}

	const dateStr = new Date(details.date).toLocaleDateString('fr-FR', {
		weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
		hour: '2-digit', minute: '2-digit'
	});

	const subject = `New Reservation: ${details.name} - ${dateStr}`;

	const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #d4af37;">New Reservation Received</h2>
      <p><strong>Name:</strong> ${details.name}</p>
      <p><strong>Date:</strong> ${dateStr}</p>
      <p><strong>Guests:</strong> ${details.guests}</p>
      <p><strong>Pack:</strong> ${details.packName || 'None'}</p>
      <br />
      <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Contact Details</h3>
      <p><strong>Email:</strong> <a href="mailto:${details.email}">${details.email}</a></p>
      <p><strong>Phone:</strong> <a href="tel:${details.phone}">${details.phone}</a></p>
    </div>
  `;

	console.log(`[Email] Preparing to send reservation notification to: ${toEmail}`);
	try {
		const info = await transporter.sendMail({
			from: `"Huqqa Praia System" <${process.env.EMAIL_USER}>`,
			to: toEmail,
			subject,
			html,
		});
		console.log(`[Email] Notification sent successfully! Message ID: ${info.messageId}`);
	} catch (error) {
		console.error(`[Email] FAILED to send notification to ${toEmail}. Error:`, error);
		// Don't throw, just log. We don't want to fail the reservation request if email fails.
	}
};
