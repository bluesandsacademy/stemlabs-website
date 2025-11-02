// app/api/submit-registration/route.js
import { google } from "googleapis";

export async function POST(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    // Initialize Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Map form data to spreadsheet columns (A to Q = 17 columns)
    const row = [
      new Date().toLocaleString(), // Timestamp
      body.registrationType,
      body.fullName,
      body.gender,
      body.role,
      body.school,
      body.email,
      body.phone,
      body.location,
      body.schoolName || "",
      body.schoolType || "",
      body.schoolEmail || "",
      body.schoolPhone || "",
      body.contactPerson || "",
      body.designation || "",
      body.studentsAttending || "",
      body.teachersAttending || "",
      body.photoConsent ? "Yes" : "No",
      body.specialNeeds || "",
    ];

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A1", // Will auto-append to next row
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    return new Response(
      JSON.stringify({ message: "Registration successful!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to submit registration. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
