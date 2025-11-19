"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function RegistrationForm() {
  const [registrationType, setRegistrationType] = useState("individual");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    role: "",
    school: "",
    email: "",
    phone: "",
    location: "",
    // School/Group fields
    schoolName: "",
    schoolType: "",
    schoolEmail: "",
    schoolPhone: "",
    contactPerson: "",
    designation: "",
    studentsAttending: "",
    teachersAttending: "",
    photoConsent: false,
    specialNeeds: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Submitting your registration...");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationType,
          ...formData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Thank you! Your registration has been successfully submitted.",
          {
            id: toastId,
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
          schoolName: "",
          schoolType: "",
          schoolEmail: "",
          schoolPhone: "",
          contactPerson: "",
          designation: "",
          studentsAttending: "",
          teachersAttending: "",
          photoConsent: false,
          specialNeeds: "",
        });
        setRegistrationType("individual");
      } else {
        toast.error(data.error || "Submission failed. Please try again.", {
          id: toastId,
        });
      }
    } catch (err) {
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
            Africa STEM EdTech Expo | November 25, 2025
          </p>
          <p className="text-secondary font-medium mt-1">
            Hosted by <span className="font-bold">Blue Sands STEM Labs</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Registration Type */}
            {registrationType === "individual" && (
              <>
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

                {/* Personal Information */}
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
              </>
            )}

            {/* School/Group Details - Conditional */}
            {registrationType === "school" && (
              <div className="border-t border-gray-200 pt-8 space-y-6">
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
                      disabled={loading}
                    >
                      <option value="">Type of School</option>
                      <option value="primary">Public Secondary School</option>
                      <option value="secondary">
                        Private Secondary School
                      </option>
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
                      placeholder="School Email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
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
                      placeholder="School Phone Number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
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
                      placeholder="Contact Person Name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      disabled={loading}
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label
                      htmlFor="designation"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Designation (e.g. principal)
                    </label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Designation (e.g. principal)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
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
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Photo/Video Consent */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="photoConsent"
                      checked={formData.photoConsent}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      I consent to the use of photos/videos taken during the
                      event for educational and promotional purposes. I agree to
                      follow event protocols for safety and participation.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Special Needs */}
            <div>
              <label
                htmlFor="specialNeeds"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Special Needs or Notes
              </label>
              <textarea
                id="specialNeeds"
                name="specialNeeds"
                value={formData.specialNeeds}
                onChange={handleInputChange}
                placeholder="Enter comments, requests or accessibility needs..."
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                disabled={loading}
              />
            </div>

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
                href="mailto:partnership@bluesandsacademy.org"
                className="text-primary hover:underline font-medium"
              >
                partnership@bluesandsacademy.org
              </a>{" "}
              |{" "}
              <a
                href="tel:+234XXXXXXXXX"
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
