"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const countries = [
  "USA",
  "UK",
  "Germany",
  "France",
  "Netherlands",
  "Canada",
  "Australia",
  "Sweden",
  "Norway",
  "Switzerland",
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    phoneNumber: "",
    agreeToTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const country = formData.get('country') as string;
    const phone = formData.get('phone') as string;
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            country,
            phone
          }
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#0a1628] rounded-2xl shadow-2xl border border-[#1e3a5f] p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#B8960C] font-[family-name:var(--font-playfair)] tracking-wide">
              Apex Meridian
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Create your account to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#050a14] border border-[#1e3a5f] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8960C] focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#050a14] border border-[#1e3a5f] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8960C] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#050a14] border border-[#1e3a5f] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8960C] focus:border-transparent transition-all"
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#050a14] border border-[#1e3a5f] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8960C] focus:border-transparent transition-all"
                placeholder="Confirm your password"
              />
            </div>

            {/* Country Dropdown */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#050a14] border border-[#1e3a5f] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#B8960C] focus:border-transparent transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.25rem 1.25rem",
                }}
              >
                <option value="" disabled className="text-gray-500">
                  Select your country
                </option>
                {countries.map((country) => (
                  <option key={country} value={country} className="bg-[#0a1628]">
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phone"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#050a14] border border-[#1e3a5f] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8960C] focus:border-transparent transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 rounded border-[#1e3a5f] bg-[#050a14] text-[#B8960C] focus:ring-[#B8960C] focus:ring-offset-0 cursor-pointer accent-[#B8960C]"
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-400 cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[#B8960C] hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#B8960C] hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#B8960C] hover:bg-[#a6870b] disabled:opacity-50 disabled:cursor-not-allowed text-[#050a14] font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#B8960C]/20 focus:outline-none focus:ring-2 focus:ring-[#B8960C] focus:ring-offset-2 focus:ring-offset-[#0a1628]"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Trust Signal */}
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Your data is secure and encrypted</span>
          </div>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#B8960C] hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
