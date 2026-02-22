import React, { useState } from 'react';
import { Shield, ShieldCheck, FileText, FlaskConical, Info, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row font-sans w-full">

            {/* Left Column (Branding & Value Prop) */}
            <div className="lg:w-1/2 w-full p-12 lg:p-24 flex flex-col justify-center bg-gradient-to-b from-[#62414A] to-[#B7684C] relative overflow-hidden">
                {/* Optional: subtle background pattern/glow can go here if needed */}
                <div className="relative z-10 max-w-xl mx-auto lg:mx-0">

                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center mb-10 shadow-sm border border-white/10">
                        <Shield className="text-[#3E2A2F] w-9 h-9 opacity-90" strokeWidth={2.5} />
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Advance Your Research with Absolute Integrity.
                    </h1>

                    <p className="text-white/80 text-lg mb-12 leading-relaxed">
                        Vitro Workspace ensures your data is encrypted, compliant, and immutable. Join thousands of researchers securing their scientific breakthroughs today.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2.5 bg-[#875D5F]/40 border border-[#9E7374]/50 backdrop-blur-md px-5 py-2.5 rounded-xl text-white/90 text-sm font-semibold shadow-sm tracking-wide">
                            <ShieldCheck className="w-4 h-4 opacity-80" strokeWidth={2.5} />
                            End-to-End Encryption
                        </div>
                        <div className="flex items-center gap-2.5 bg-[#875D5F]/40 border border-[#9E7374]/50 backdrop-blur-md px-5 py-2.5 rounded-xl text-white/90 text-sm font-semibold shadow-sm tracking-wide">
                            <FileText className="w-4 h-4 opacity-80" strokeWidth={2.5} />
                            Audit Trails
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Column (Sign-Up Form) */}
            <div className="lg:w-1/2 w-full p-8 py-12 lg:p-24 flex flex-col justify-center bg-[#F4EBE1]">
                <div className="max-w-[440px] w-full mx-auto">

                    {/* Header Section */}
                    <div className="flex items-center gap-2.5 mb-10">
                        <FlaskConical className="w-6 h-6 text-[#62414A]" strokeWidth={2.5} />
                        <span className="text-[#3E2A2F] font-bold text-lg tracking-tight">Vitro Workspace</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-[#3E2A2F] mb-3 tracking-tight">Create your Researcher Account</h2>
                    <p className="text-[#62414A]/80 mb-10 font-medium tracking-wide">Start managing your experiments securely.</p>

                    {/* Social Sign-In */}
                    <div className="space-y-4 mb-9">
                        <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl py-3.5 text-sm font-bold text-[#3E2A2F] hover:shadow-md hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-[#62414A]/30">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign up with Google
                        </button>

                        <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl py-3.5 text-sm font-bold text-[#3E2A2F] hover:shadow-md hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-[#62414A]/30">
                            <div className="w-5 h-5 bg-[#A6CE39] rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none shrink-0 tracking-tighter">iD</div>
                            Sign up with ORCID
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-9">
                        <div className="flex-1 h-px bg-[#3E2A2F]/10"></div>
                        <span className="text-[#3E2A2F]/40 text-xs font-bold uppercase tracking-wider">Or with email</span>
                        <div className="flex-1 h-px bg-[#3E2A2F]/10"></div>
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-5">

                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-[#3E2A2F]/10 text-[#3E2A2F] placeholder-[#3E2A2F]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 transition-all shadow-sm"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="University / Institution Email"
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-[#3E2A2F]/10 text-[#3E2A2F] placeholder-[#3E2A2F]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 transition-all shadow-sm mb-2.5"
                            />
                            <div className="flex items-center gap-1.5 px-2 text-[#62414A]/70">
                                <Info className="w-3.5 h-3.5 opacity-80" strokeWidth={2.5} />
                                <span className="text-[11px] font-bold tracking-wide">Please use your .edu or institutional email.</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white border border-[#3E2A2F]/10 text-[#3E2A2F] placeholder-[#3E2A2F]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3E2A2F]/30 hover:text-[#3E2A2F]/60 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Strength Meter */}
                            <div className="px-1 mt-3.5">
                                <div className="text-[11px] font-bold text-[#3E2A2F]/60 mb-2.5 tracking-wide">
                                    Strength: <span className="text-[#E7614B]">Weak</span>
                                </div>
                                <div className="flex gap-2 h-1.5">
                                    <div className="flex-1 bg-[#E7614B] rounded-full shadow-sm"></div>
                                    <div className="flex-1 bg-white border border-[#3E2A2F]/10 rounded-full"></div>
                                    <div className="flex-1 bg-white border border-[#3E2A2F]/10 rounded-full"></div>
                                    <div className="flex-1 bg-white border border-[#3E2A2F]/10 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-4 px-1 pt-4 mb-4">
                            <div className="pt-[3px] shrink-0">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-[#3E2A2F]/20 text-[#62414A] focus:ring-[#62414A] bg-white cursor-pointer transition-colors"
                                    id="terms"
                                />
                            </div>
                            <label htmlFor="terms" className="text-[13px] text-[#3E2A2F]/70 leading-relaxed font-semibold cursor-pointer">
                                I agree to the <a href="#" className="text-[#7D464D] hover:text-[#62414A] hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-[#7D464D] hover:text-[#62414A] hover:underline transition-colors">Scientific Integrity Protocols</a>.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => window.location.href = '/'}
                                className="w-full bg-[#62414A] text-white rounded-2xl py-4 text-sm font-bold tracking-wide shadow-md shadow-[#62414A]/20 hover:bg-[#53353D] hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-[#62414A]/30"
                            >
                                Create Account
                            </button>
                        </div>

                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[13px] text-[#3E2A2F]/70 font-semibold tracking-wide">
                            Already have an account? <a href="/login" className="text-[#7D464D] hover:text-[#62414A] hover:underline transition-colors ml-1">Log in</a>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}
