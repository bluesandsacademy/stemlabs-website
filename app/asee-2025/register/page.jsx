"use client";

import { useState } from "react";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    registrationType: "individual",
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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

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
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: "Thank you! Your registration has been successfully submitted.",
          type: "success",
        });

        // Reset form
        setFormData({
          registrationType: "individual",
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
      } else {
        setMessage({
          text: data.error || "Submission failed. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: "Network error. Please check your connection and try again.",
        type: "error",
      });
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
            Africa STEM EdTech Expo - Mini ASEE | November 14, 2025
          </p>
          <p className="text-secondary font-medium mt-1">
            Hosted by <span className="font-bold">Blue Sands STEM Labs</span>
          </p>
        </div>

        {/* Success / Error Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium transition-all ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

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
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      registrationType: "individual",
                    }))
                  }
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    formData.registrationType === "individual"
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      registrationType: "school",
                    }))
                  }
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    formData.registrationType === "school"
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  School / Group
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-900 mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-gray-900 mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="school"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  School / Organization <span className="text-red-500">*</span>
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
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Location (City / State) <span className="text-red-500">*</span>
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
              />
            </div>

            {/* School/Group Details */}
            <div className="border-t border-gray-200 pt-8 space-y-6">
              <h3 className="text-xl font-bold text-primary mb-6">
                School / Group Details
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Optional for individual registrations)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  />
                </div>

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
                  >
                    <option value="">Select type</option>
                    <option value="primary">Primary School</option>
                    <option value="secondary">Secondary School</option>
                    <option value="tertiary">Tertiary Institution</option>
                    <option value="private">Private School</option>
                    <option value="public">Public School</option>
                  </select>
                </div>

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
                  />
                </div>

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
                    placeholder="+234 XXX XXX XXXX"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>

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
                    placeholder="e.g. Mr. Ade Johnson"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="designation"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Designation (e.g. Principal)
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Principal, Coordinator, etc."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>

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
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>

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
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* Photo Consent */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="photoConsent"
                    checked={formData.photoConsent}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I consent to the use of photos/videos taken during the event
                    for educational and promotional purposes. I agree to follow
                    event protocols for safety and participation.
                  </span>
                </label>
              </div>
            </div>

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
                placeholder="Enter any accessibility needs, dietary restrictions, or additional comments..."
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg transform hover:-translate-y-0.5 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-primary hover:bg-blue-600 text-white hover:shadow-xl hover:shadow-primary/30"
              }`}
            >
              {loading ? "Submitting Registration..." : "Submit Registration"}
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
                href="tel:+234XXXXXXXXX"
                className="text-primary hover:underline font-medium"
              >
                +234 XXX XXX XXXX
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
