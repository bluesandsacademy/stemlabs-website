export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { registrationType } = body;

    // Validate required environment variables
    const requiredEnvs = [
      "FORMBRICKS_API_HOST",
      "FORMBRICKS_ENVIRONMENT_ID",
      "FORMBRICKS_API_KEY",
      "FORMBRICKS_SURVEY_ID_INDIVIDUAL",
      "FORMBRICKS_SURVEY_ID_SCHOOL",
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
      FORMBRICKS_SURVEY_ID_INDIVIDUAL,
      FORMBRICKS_SURVEY_ID_SCHOOL,
    } = process.env;

    // Select the appropriate survey ID based on registration type
    const surveyId =
      registrationType === "individual"
        ? FORMBRICKS_SURVEY_ID_INDIVIDUAL
        : FORMBRICKS_SURVEY_ID_SCHOOL;

    // Prepare response data based on registration type
    let responseData;

    if (registrationType === "individual") {
      // Individual payload structure
      responseData = {
        surveyId,
        userId: body.email || `individual_${Date.now()}`,
        finished: true,
        data: {
          "Full-name": body.fullName,
          Gender: body.gender,
          Role: body.role,
          School: body.school,
          Email: body.email,
          Phone: body.phone,
          Location: body.location,
          Notes: body.notes || "",
        },
      };
    } else if (registrationType === "school") {
      // School/Group payload structure
      responseData = {
        surveyId,
        userId: body.schoolEmail || `school_${Date.now()}`,
        finished: true,
        data: {
          "School-name": body.schoolName,
          Type: body.schoolType,
          Email: body.schoolEmail,
          Phone: body.schoolPhone,
          "Contact-person": body.contactPerson,
          Designation: body.designation,
          "Student-count": body.studentsAttending.toString(),
          "Teacher-count": body.teachersAttending.toString(),
        },
      };
    } else {
      return new Response(
        JSON.stringify({
          error: "Invalid registration type",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
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

    const responseText = await formbricksResponse.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Formbricks response:", responseText);
      throw new Error("Invalid response from Formbricks");
    }

    if (!formbricksResponse.ok) {
      console.error("Formbricks API Error:", result);
      throw new Error(
        result.message || `Formbricks error: ${formbricksResponse.status}`
      );
    }

    return new Response(
      JSON.stringify({
        message: "Registration successful!",
        responseId: result.id || result.data?.id,
        registrationType,
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
