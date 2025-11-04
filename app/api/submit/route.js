// app/api/submit-registration/route.js
import { google } from "googleapis";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    // === Validate required env vars ===
    const requiredEnvs = [
      "GOOGLE_CLIENT_EMAIL",
      "GOOGLE_PRIVATE_KEY",
      "GOOGLE_SHEET_ID",
    ];

    const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);

    if (missingEnvs.length > 0) {
      console.error(
        `Missing environment variable(s): ${missingEnvs.join(", ")}`
      );

      return new Response(
        JSON.stringify({
          error: `Server configuration error: Missing environment variable(s): ${missingEnvs.join(
            ", "
          )}.`,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } =
      process.env;

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

    // === More helpful error handling ===
    if (error.message.includes("invalid_grant")) {
      return new Response(
        JSON.stringify({
          error:
            "Authentication failed. Check your Google service account credentials.",
        }),
        { status: 500 }
      );
    }

    if (error.message.includes("Permission denied")) {
      return new Response(
        JSON.stringify({
          error:
            "Permission denied. Ensure the Google Sheet is shared with the service account email.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
