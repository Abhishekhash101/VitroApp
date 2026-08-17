import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import cityscapeVideo from '../assets/login-bg.mp4';

export default function LoginPage() {
    const { login } = useAppContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Please enter your email and password.');
            return;
        }
        // Local sign-in: derive a display name from the email.
        const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Researcher';
        login({ name, email: email.trim(), role: 'Researcher' });
        navigate('/dashboard');
    };
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
                                <Link to="/signup" className="px-5 py-2 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                                    Join us
                                </Link>
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

                            <form className="space-y-5" onSubmit={handleLogin}>
                                <div>
                                    <label className="block text-xs font-bold text-gray-800 mb-2">Email address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#864A3D]/40 focus:border-[#864A3D]/60 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm font-mono tracking-widest text-lg"
                                    />
                                </div>

                                {error && (
                                    <div className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        {error}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#864A3D] hover:bg-[#68362d] text-white py-3.5 rounded-xl font-bold tracking-wide shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#864A3D]/50 focus:ring-offset-2"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </form>

                            <p className="text-center mt-8 text-[13px] text-gray-500 font-semibold">
                                Don't have an account? <Link to="/signup" className="text-[#864A3D] font-bold hover:underline transition-all">Request access</Link>
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
