

import React from 'react'
import { motion } from "framer-motion";
import heroImg from "./heroImg.jpg"
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useState } from 'react';
function Hero() {
const [loggedIn, setLoggedIn] = useState(false);

    useEffect(()=>{ 
        const token = localStorage.getItem("token");
        setLoggedIn(!!token);
    }, []);
    return (
        <section className="bg-bg-light to-teal-50 py-20">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-accent mb-4"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                      HealthMate – Your Smart Health Companion
                    </motion.h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Upload your medical reports and let AI explain them in simple English & Roman Urdu.

                        <br />
                        <span className="text-teal-700">
                          Understanding your reports is now easy with HealthMate.
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-accent text-black px-6 py-3 rounded-xl shadow hover:bg-accent transition">
                            Get Started
                        </button>
                        {!loggedIn ? (
                        <Link to="/login" className="bg-white text-accent px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition">
                            Login
                        </Link>
                        ):(
                             <button className="border border-accent text-accent px-6 py-3 rounded-xl hover:bg-blue-100 transition">
                                <Link to="/dashboard">Dashboard</Link>
                        </button>
                        )}
                    </div>
                </div>
                <motion.img
                    src={heroImg}
                    alt="HealthMate illustration"
                    className="md:w-1/2 w-72 mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                />
            </div>
        </section>
    )
}

export default Hero