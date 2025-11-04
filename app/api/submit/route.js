// app/api/submit-registration/route.js
import { google } from "googleapis";

export async function POST(request) {
  try {
    const body = await request.json();

    // === Validate required env vars ===
    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } =
      process.env;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      console.error("Missing Google credentials in environment");
      return new Response(
        JSON.stringify({ error: "Server configuration error." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // === Fix private key line breaks ===
    const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

    // === Initialize auth ===
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // === Prepare row data ===
    const row = [
      new Date().toISOString(), // ISO timestamp
      body.registrationType || "individual",
      body.fullName || "",
      body.gender || "",
      body.role || "",
      body.school || "",
      body.email || "",
      body.phone || "",
      body.location || "",
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

    // === Append to sheet ===
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    return new Response(
      JSON.stringify({ message: "Registration successful!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Google Sheets Error:", error.message);

    // More helpful error messages
    if (error.message.includes("invalid_grant")) {
      return new Response(
        JSON.stringify({
          error: "Authentication failed. Check Google service account key.",
        }),
        { status: 500 }
      );
    }

    if (error.message.includes("Permission denied")) {
      return new Response(
        JSON.stringify({
          error:
            "Bot does not have access to the Google Sheet. Share the sheet with the service account email.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to submit. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
