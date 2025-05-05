import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

type ResponseData = {
    message: string;
    success: boolean;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Validate the form data
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: 'Missing required fields',
                success: false
            });
        }

        // Get credentials from environment variables
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ]
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Get the spreadsheet ID from environment variables
        const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

        if (!spreadsheetId) {
            throw new Error('Google Sheets spreadsheet ID is not defined');
        }

        // Format the date
        const timestamp = new Date().toISOString();

        // Append data to the spreadsheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'A1', // Assuming we're starting from cell A1
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [timestamp, name, email, subject, message]
                ]
            }
        });

        // Success response
        return res.status(200).json({
            message: 'Form submitted successfully',
            success: true
        });

    } catch (error) {
        console.error('Error submitting form to Google Sheets:', error);
        return res.status(500).json({
            message: 'Error submitting form',
            success: false
        });
    }
} 