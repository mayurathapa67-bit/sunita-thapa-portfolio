"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/admin-auth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // FIX: Move redirect to useEffect to prevent the React warning
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        router.replace("/admin/dashboard");
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  // Don't render the form if already logged in
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-serif text-gray-900">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your password to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all text-gray-800"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm text-center p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8B5CF6] text-white rounded-xl font-medium hover:bg-[#7C3AED] disabled:opacity-50 transition-all shadow-lg shadow-[#8B5CF6]/20"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}