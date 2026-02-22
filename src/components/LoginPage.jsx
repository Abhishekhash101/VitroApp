import React from 'react';
import { FlaskConical } from 'lucide-react';
import cityscapeVideo from '../assets/login-bg.mp4';

export default function LoginPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">

            {/* Bottom Layer (Video) */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={cityscapeVideo} type="video/mp4" />
            </video>

            {/* Middle Layer (Diagonal Beige Cutout) */}
            <div
                className="absolute top-0 right-0 w-[60%] lg:w-[55%] h-full bg-[#F4EBE1] z-0"
                style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
            ></div>

            {/* Top Layer (Content Wrapper) */}
            <div className="relative z-10 w-full max-w-[1100px] p-6 lg:p-12">
                <div className="flex flex-col lg:flex-row w-full min-h-[640px] rounded-[3rem] shadow-2xl overflow-hidden bg-transparent">

                    {/* Left Column (Glassmorphic Video Overlay) */}
                    <div className="lg:w-1/2 w-full flex flex-col relative p-10 lg:p-14 bg-gradient-to-br from-[#2b1625]/85 to-[#7a3b2e]/85 backdrop-blur-md overflow-hidden">

                        {/* Top Bar */}
                        <div className="flex items-center justify-between relative z-20">
                            <div className="flex items-center gap-2.5">
                                <FlaskConical className="text-white w-6 h-6" strokeWidth={2.5} />
                                <span className="text-white font-bold text-lg tracking-tight">Vitro Workspace</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-white/60 text-sm font-medium">Sign up</span>
                                <a href="/signup" className="px-5 py-2 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                                    Join us
                                </a>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col justify-center relative z-20 mt-12 mb-8 pr-4">
                            <h1 className="text-4xl lg:text-[42px] font-bold text-white leading-[1.15] mb-6 tracking-tight">
                                Accelerate your research with next-gen data tools.
                            </h1>
                            <p className="text-white/70 text-[15px] leading-relaxed max-w-md font-medium">
                                Connect your lab data, collaborate in real-time, and visualize complex molecular structures in a unified, secure workspace.
                            </p>
                        </div>

                        {/* Bottom Corner Icon */}
                        <FlaskConical className="absolute -bottom-16 -left-12 w-80 h-80 text-white opacity-10 -rotate-12 pointer-events-none" />
                    </div>

                    {/* Right Column (Solid White Form) */}
                    <div className="lg:w-1/2 w-full bg-white p-10 lg:p-16 flex flex-col justify-center">

                        <div className="max-w-[400px] w-full mx-auto">
                            <h2 className="text-[32px] font-extrabold text-[#1a2332] mb-2 tracking-tight">Welcome back</h2>
                            <p className="text-gray-500 font-medium mb-10 text-sm">Please enter your details to sign in.</p>

                            <form className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-800 mb-2">Email address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#864A3D]/40 focus:border-[#864A3D]/60 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-gray-800">Password</label>
                                        <a href="#" className="text-xs font-bold text-[#864A3D] hover:text-[#2b1625] transition-colors">Forgot password?</a>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#864A3D]/40 focus:border-[#864A3D]/60 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm font-mono tracking-widest text-lg"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => window.location.href = '/'}
                                        className="w-full bg-[#864A3D] hover:bg-[#68362d] text-white py-3.5 rounded-xl font-bold tracking-wide shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#864A3D]/50 focus:ring-offset-2"
                                    >
                                        Sign In
                                    </button>
                                </div>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">or</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-xl font-bold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </button>
                                </div>
                            </form>

                            <p className="text-center mt-8 text-[13px] text-gray-500 font-semibold">
                                Don't have an account? <a href="/signup" className="text-[#864A3D] font-bold hover:underline transition-all">Request access</a>
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
