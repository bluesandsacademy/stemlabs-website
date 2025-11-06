"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { config } from "@/lib/config";
export default function RegistrationForm() {
  const [registrationType, setRegistrationType] = useState("individual");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Individual fields
    fullName: "",
    gender: "",
    role: "",
    school: "",
    email: "",
    phone: "",
    location: "",
    notes: "",
    // School/Group fields
    schoolName: "",
    schoolType: "",
    schoolEmail: "",
    schoolPhone: "",
    contactPerson: "",
    designation: "",
    studentsAttending: "",
    teachersAttending: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Submitting your registration...");

    try {
      // Get environment variables (must be prefixed with NEXT_PUBLIC_)
      const FORMBRICKS_API_HOST = config.NEXT_PUBLIC_FORMBRICKS_API_HOST;
      const FORMBRICKS_ENVIRONMENT_ID =
        config.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID;
      const SURVEY_ID_INDIVIDUAL =
        config.NEXT_PUBLIC_FORMBRICKS_SURVEY_ID_INDIVIDUAL;
      const SURVEY_ID_SCHOOL = config.NEXT_PUBLIC_FORMBRICKS_SURVEY_ID_SCHOOL;

      // Validate environment variables
      if (
        !FORMBRICKS_API_HOST ||
        !FORMBRICKS_ENVIRONMENT_ID ||
        !SURVEY_ID_INDIVIDUAL ||
        !SURVEY_ID_SCHOOL
      ) {
        throw new Error(
          "Missing required configuration. Please contact support."
        );
      }

      // Select the appropriate survey ID based on registration type
      const surveyId =
        registrationType === "individual"
          ? SURVEY_ID_INDIVIDUAL
          : SURVEY_ID_SCHOOL;

      // Prepare response data based on registration type
      let responseData;

      if (registrationType === "individual") {
        responseData = {
          surveyId,
          userId: formData.email || `individual_${Date.now()}`,
          finished: true,
          data: {
            "Full-name": formData.fullName,
            Gender: formData.gender,
            Role: formData.role,
            School: formData.school,
            Email: formData.email,
            Phone: formData.phone,
            Location: formData.location,
            Notes: formData.notes || "",
          },
        };
      } else {
        responseData = {
          surveyId,
          userId: formData.schoolEmail || `school_${Date.now()}`,
          finished: true,
          data: {
            "School-name": formData.schoolName,
            Type: formData.schoolType,
            Email: formData.schoolEmail,
            Phone: formData.schoolPhone,
            "Contact-person": formData.contactPerson,
            Designation: formData.designation,
            "Student-count": formData.studentsAttending.toString(),
            "Teacher-count": formData.teachersAttending.toString(),
          },
        };
      }

      // Submit directly to Formbricks
      const response = await fetch(
        `${FORMBRICKS_API_HOST}/api/v1/client/${FORMBRICKS_ENVIRONMENT_ID}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(responseData),
        }
      );

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        console.error("API Error:", result);
        throw new Error(
          result.message || `Submission failed with status ${response.status}`
        );
      }

      toast.success(
        "Thank you! Your registration has been successfully submitted.",
        {
          id: toastId,
          duration: 5000,
        }
      );

      // Reset form
      setFormData({
        fullName: "",
        gender: "",
        role: "",
        school: "",
        email: "",
        phone: "",
        location: "",
        notes: "",
        schoolName: "",
        schoolType: "",
        schoolEmail: "",
        schoolPhone: "",
        contactPerson: "",
        designation: "",
        studentsAttending: "",
        teachersAttending: "",
      });
      setRegistrationType("individual");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err.message ||
          "Network error. Please check your connection and try again.",
        {
          id: toastId,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-blue-50/30 to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            ASEE 2025 Registration
          </h1>
          <p className="text-gray-600 text-lg mb-1">
            Africa STEM EdTech Expo | November 14, 2025
          </p>
          <p className="text-secondary font-semibold">
            Hosted by Blue Sands STEM Labs
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Registration Type */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-4">
                Registration Type
              </label>
              <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRegistrationType("individual")}
                  disabled={loading}
                  className={`py-3.5 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    registrationType === "individual"
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/40 scale-[1.02]"
                      : "bg-transparent text-gray-700 hover:bg-white/50"
                  } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setRegistrationType("school")}
                  disabled={loading}
                  className={`py-3.5 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    registrationType === "school"
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/40 scale-[1.02]"
                      : "bg-transparent text-gray-700 hover:bg-white/50"
                  } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  School / Group
                </button>
              </div>
            </div>

            {/* Individual Registration Fields */}
            {registrationType === "individual" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Role/Designation */}
                  <div className="space-y-2">
                    <label
                      htmlFor="role"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Role / Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="Student/Teacher/Parent"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* School/Organization */}
                  <div className="space-y-2">
                    <label
                      htmlFor="school"
                      className="block text-sm font-bold text-gray-900"
                    >
                      School / Organization{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="school"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      placeholder="Name of school or organization"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+2348139622583"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-bold text-gray-900"
                  >
                    Location (City / State){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Lagos, Nigeria"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-bold text-gray-900"
                  >
                    Special Needs or Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter any special requests, accessibility needs, or additional information..."
                    rows="4"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none bg-gray-50 focus:bg-white"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* School/Group Registration Fields */}
            {registrationType === "school" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b-2 border-primary/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    School / Group Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name of School */}
                  <div className="space-y-2">
                    <label
                      htmlFor="schoolName"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Name of School <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      placeholder="Name of School"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Type of School */}
                  <div className="space-y-2">
                    <label
                      htmlFor="schoolType"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Type of School <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="schoolType"
                      name="schoolType"
                      value={formData.schoolType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    >
                      <option value="">Select Type</option>
                      <option value="primary">Primary School</option>
                      <option value="secondary">Secondary School</option>
                      <option value="tertiary">Tertiary Institution</option>
                      <option value="private">Private School</option>
                      <option value="public">Public School</option>
                    </select>
                  </div>

                  {/* School Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="schoolEmail"
                      className="block text-sm font-bold text-gray-900"
                    >
                      School Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="schoolEmail"
                      name="schoolEmail"
                      value={formData.schoolEmail}
                      onChange={handleInputChange}
                      placeholder="school@example.com"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* School Phone */}
                  <div className="space-y-2">
                    <label
                      htmlFor="schoolPhone"
                      className="block text-sm font-bold text-gray-900"
                    >
                      School Phone Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="schoolPhone"
                      name="schoolPhone"
                      value={formData.schoolPhone}
                      onChange={handleInputChange}
                      placeholder="+234XXXXXXXXX"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contactPerson"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Contact Person Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Designation */}
                  <div className="space-y-2">
                    <label
                      htmlFor="designation"
                      className="block text-sm font-bold text-gray-900"
                    >
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g., Principal, Teacher"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Students Attending */}
                  <div className="space-y-2">
                    <label
                      htmlFor="studentsAttending"
                      className="block text-sm font-bold text-gray-900"
                    >
                      No. of Students Attending{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="studentsAttending"
                      name="studentsAttending"
                      value={formData.studentsAttending}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      min="0"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Teachers Attending */}
                  <div className="space-y-2">
                    <label
                      htmlFor="teachersAttending"
                      className="block text-sm font-bold text-gray-900"
                    >
                      No. of Teachers Attending{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="teachersAttending"
                      name="teachersAttending"
                      value={formData.teachersAttending}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
                      min="0"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gradient-to-r from-primary/70 to-blue-600/70 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-2xl hover:shadow-primary/40"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Registration
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl p-6 text-center border border-blue-100">
              <p className="text-sm text-gray-700 mb-2 font-semibold">
                Need help? Contact us:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <a
                  href="mailto:event@bluesandstemlabs.com"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  event@bluesandstemlabs.com
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="tel:+2348139622583"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +2348139622583
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
