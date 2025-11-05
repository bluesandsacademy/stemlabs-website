export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required environment variables
    const requiredEnvs = [
      "FORMBRICKS_API_HOST",
      "FORMBRICKS_ENVIRONMENT_ID",
      "FORMBRICKS_API_KEY",
    ];

    const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);

    if (missingEnvs.length > 0) {
      console.error(
        `Missing environment variable(s): ${missingEnvs.join(", ")}`
      );
      return new Response(
        JSON.stringify({
          error: `Server configuration error: Missing ${missingEnvs.join(
            ", "
          )}`,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const {
      FORMBRICKS_API_HOST,
      FORMBRICKS_ENVIRONMENT_ID,
      FORMBRICKS_API_KEY,
    } = process.env;

    // Prepare response data for Formbricks
    const responseData = {
      surveyId: "your-survey-id-here", // Replace with your actual survey ID
      userId: body.email || `user_${Date.now()}`,
      finished: true,
      data: {
        // Common fields
        registrationType: body.registrationType,
        timestamp: new Date().toISOString(),
        specialNeeds: body.specialNeeds || "None",
      },
    };

    // Add individual or school-specific fields
    if (body.registrationType === "individual") {
      responseData.data = {
        ...responseData.data,
        fullName: body.fullName,
        gender: body.gender,
        role: body.role,
        school: body.school,
        email: body.email,
        phone: body.phone,
        location: body.location,
      };
    } else if (body.registrationType === "school") {
      responseData.data = {
        ...responseData.data,
        schoolName: body.schoolName,
        schoolType: body.schoolType,
        schoolEmail: body.schoolEmail,
        schoolPhone: body.schoolPhone,
        contactPerson: body.contactPerson,
        designation: body.designation,
        studentsAttending: body.studentsAttending,
        teachersAttending: body.teachersAttending,
        photoConsent: body.photoConsent ? "Yes" : "No",
      };
    }

    // Submit to Formbricks
    const formbricksResponse = await fetch(
      `${FORMBRICKS_API_HOST}/api/v1/client/${FORMBRICKS_ENVIRONMENT_ID}/responses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": FORMBRICKS_API_KEY,
        },
        body: JSON.stringify(responseData),
      }
    );

    if (!formbricksResponse.ok) {
      const errorData = await formbricksResponse.json();
      console.error("Formbricks API Error:", errorData);
      throw new Error(errorData.message || "Failed to submit to Formbricks");
    }

    const result = await formbricksResponse.json();

    return new Response(
      JSON.stringify({
        message: "Registration successful!",
        responseId: result.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Registration Error:", error);

    return new Response(
      JSON.stringify({
        error:
          error.message || "An unexpected error occurred. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
