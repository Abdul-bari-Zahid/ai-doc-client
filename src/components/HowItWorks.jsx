import React from 'react';
import { Upload, Cpu, MessageCircleMore, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function HowItWorks() {
    const steps = [
        {
            title: 'Upload Report',
            desc: 'Securely upload your medical report PDF or lab results image to our platform.',
            icon: <Upload size={32} />
        },
        {
            title: 'AI Analysis',
            desc: 'Our advanced AI engine extracts findings and compares them with medical knowledge.',
            icon: <Cpu size={32} />
        },
        {
            title: 'Clear Explanation',
            desc: 'Receive a clear, simple summary in English or Roman Urdu within seconds.',
            icon: <MessageCircleMore size={32} />
        },
    ];

    return (
        <section id="how" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">How MediAI Works</h2>
                    <p className="text-lg text-slate-600">
                        Three simple steps to understanding your health data like never before.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -translate-y-1/2 hidden lg:block"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-blue-600 mb-8 border border-slate-50 relative group hover:scale-110 transition-transform duration-300">
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    {step.icon}
                                </div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h4>
                                <p className="text-slate-600 max-w-xs">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
