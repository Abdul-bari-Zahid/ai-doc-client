

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, CheckCircle, Activity } from "lucide-react";
import heroImg from "./heroImg.jpg";
import { Link } from 'react-router-dom';

function Hero() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoggedIn(!!token);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        className="lg:w-1/2 text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100"
                        >
                            <Sparkles size={16} />
                            <span>Next Generation AI healthcare</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6"
                        >
                            Your Health, <br />
                            <span className="gradient-text">Intelligently Explained.</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed"
                        >
                            MediAI simplifies complex medical reports using advanced AI. Get clear insights in English and Roman Urdu within seconds.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            {!loggedIn ? (
                                <Link to="/login" className="btn-primary flex items-center gap-2 group">
                                    Get Started Free
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <Link to="/uploadreport" className="btn-primary flex items-center gap-2 group">
                                    Upload Report
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                            <button className="btn-secondary flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Play size={14} fill="currentColor" />
                                </div>
                                How it works
                            </button>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-teal-500" />
                                <span>Privacy First</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-teal-500" />
                                <span>99% Accuracy</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-teal-500" />
                                <span>Roman Urdu Support</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="lg:w-1/2 relative"
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm">
                            <img
                                src={heroImg}
                                alt="Healthcare AI"
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                        </div>

                        {/* Floating Glass Cards */}
                        <motion.div
                            className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl z-20 hidden md:block"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Analysis</div>
                                    <div className="text-lg font-bold text-slate-800 italic">"Reports Simplified"</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute -top-6 -right-6 glass p-4 rounded-2xl z-20 hidden md:block"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            <div className="flex flex-col gap-1">
                                <div className="h-2 w-24 bg-blue-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: "75%" }}
                                        transition={{ delay: 1.5, duration: 1 }}
                                    />
                                </div>
                                <div className="text-[10px] font-bold text-slate-400">AI Confidence: 98%</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
