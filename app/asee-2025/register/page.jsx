"use client";

import { useState } from "react";
import toast from "react-hot-toast";

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
      // Prepare payload based on registration type
      let payload;

      if (registrationType === "individual") {
        payload = {
          registrationType: "individual",
          fullName: formData.fullName,
          gender: formData.gender,
          role: formData.role,
          school: formData.school,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          notes: formData.notes || "",
        };
      } else {
        payload = {
          registrationType: "school",
          schoolName: formData.schoolName,
          schoolType: formData.schoolType,
          schoolEmail: formData.schoolEmail,
          schoolPhone: formData.schoolPhone,
          contactPerson: formData.contactPerson,
          designation: formData.designation,
          studentsAttending: formData.studentsAttending,
          teachersAttending: formData.teachersAttending,
        };
      }

      // Submit to API
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
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
      } else {
        toast.error(data.error || "Submission failed. Please try again.", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">
            ASEE 2025 Registration Form
          </h1>
          <p className="text-gray-600 text-lg">
            Africa STEM EdTech Expo | November 14, 2025
          </p>
          <p className="text-secondary font-medium mt-1">
            Hosted by <span className="font-bold">Blue Sands STEM Labs</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Registration Type */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-4">
                Registration Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRegistrationType("individual")}
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    registrationType === "individual"
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setRegistrationType("school")}
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    registrationType === "school"
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
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
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Role / Designation
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="Student/Teacher/Parent"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* School/Organization */}
                  <div>
                    <label
                      htmlFor="school"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      School / Organization
                    </label>
                    <input
                      type="text"
                      id="school"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      placeholder="Name of school or organization"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+2348139622583"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Location (City / State)
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Lagos, Nigeria"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-semibold text-gray-900 mb-2"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* School/Group Registration Fields */}
            {registrationType === "school" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary mb-6">
                  School / Group Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name of School */}
                  <div>
                    <label
                      htmlFor="schoolName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Name of School
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      placeholder="Name of School"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Type of School */}
                  <div>
                    <label
                      htmlFor="schoolType"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Type of School
                    </label>
                    <select
                      id="schoolType"
                      name="schoolType"
                      value={formData.schoolType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
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
                  <div>
                    <label
                      htmlFor="schoolEmail"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      School Email
                    </label>
                    <input
                      type="email"
                      id="schoolEmail"
                      name="schoolEmail"
                      value={formData.schoolEmail}
                      onChange={handleInputChange}
                      placeholder="school@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* School Phone */}
                  <div>
                    <label
                      htmlFor="schoolPhone"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      School Phone Number
                    </label>
                    <input
                      type="tel"
                      id="schoolPhone"
                      name="schoolPhone"
                      value={formData.schoolPhone}
                      onChange={handleInputChange}
                      placeholder="+234XXXXXXXXX"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label
                      htmlFor="contactPerson"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label
                      htmlFor="designation"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Designation
                    </label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g., Principal, Teacher"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Students Attending */}
                  <div>
                    <label
                      htmlFor="studentsAttending"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      No. of Students Attending
                    </label>
                    <input
                      type="number"
                      id="studentsAttending"
                      name="studentsAttending"
                      value={formData.studentsAttending}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      min="0"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Teachers Attending */}
                  <div>
                    <label
                      htmlFor="teachersAttending"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      No. of Teachers Attending
                    </label>
                    <input
                      type="number"
                      id="teachersAttending"
                      name="teachersAttending"
                      value={formData.teachersAttending}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
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
              className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-primary/80 text-white cursor-not-allowed"
                  : "bg-primary hover:bg-blue-600 text-white hover:shadow-xl hover:shadow-primary/30"
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
                "Submit Registration"
              )}
            </button>

            {/* Contact Info */}
            <p className="text-center text-sm text-gray-600 mt-6">
              For enquiries:{" "}
              <a
                href="mailto:event@bluesandstemlabs.com"
                className="text-primary hover:underline font-medium"
              >
                event@bluesandstemlabs.com
              </a>{" "}
              |{" "}
              <a
                href="tel:+2348139622583"
                className="text-primary hover:underline font-medium"
              >
                +2348139622583
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
