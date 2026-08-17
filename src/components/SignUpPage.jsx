import React, { useState } from 'react';
import { Shield, ShieldCheck, FileText, FlaskConical, Info, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function SignUpPage() {
    const { signup } = useAppContext();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (!acceptedTerms) {
            setError('Please accept the Terms of Service to continue.');
            return;
        }
        // Local account creation: store the user locally.
        signup({ name: fullName.trim(), email: email.trim(), role: 'Researcher' });
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row font-sans w-full">

            {/* Left Column (Branding & Value Prop) */}
            <div className="lg:w-1/2 w-full p-12 lg:p-24 flex flex-col justify-center bg-gradient-to-b from-[#62414A] to-[#B7684C] relative overflow-hidden">
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

                    {/* Form Fields */}
                    <form className="space-y-5" onSubmit={handleSignup}>

                        <div>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-[#3E2A2F]/10 text-[#3E2A2F] placeholder-[#3E2A2F]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 transition-all shadow-sm"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-[#3E2A2F]/20 text-[#62414A] focus:ring-[#62414A] bg-white cursor-pointer transition-colors"
                                    id="terms"
                                />
                            </div>
                            <label htmlFor="terms" className="text-[13px] text-[#3E2A2F]/70 leading-relaxed font-semibold cursor-pointer">
                                I agree to the <a href="#" className="text-[#7D464D] hover:text-[#62414A] hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-[#7D464D] hover:text-[#62414A] hover:underline transition-colors">Scientific Integrity Protocols</a>.
                            </label>
                        </div>

                        {error && (
                            <div className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#62414A] text-white rounded-2xl py-4 text-sm font-bold tracking-wide shadow-md shadow-[#62414A]/20 hover:bg-[#53353D] hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-[#62414A]/30"
                            >
                                Create Account
                            </button>
                        </div>

                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[13px] text-[#3E2A2F]/70 font-semibold tracking-wide">
                            Already have an account? <Link to="/login" className="text-[#7D464D] hover:text-[#62414A] hover:underline transition-colors ml-1">Log in</Link>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}
