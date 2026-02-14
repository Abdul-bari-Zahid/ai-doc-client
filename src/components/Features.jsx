import React from 'react';
import { FileSearch, ShieldCheck, Stethoscope, Zap, MessageSquare, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

function Features() {
    const items = [
        {
            title: 'Report Interpretation',
            desc: 'Automatically translate complex medical jargon into plain, easy-to-understand language.',
            icon: <FileSearch className="text-blue-600" size={24} />,
            color: 'bg-blue-50'
        },
        {
            title: 'Symptom Checker',
            desc: 'AI-assisted triage to suggest urgency and provide clear, actionable next steps.',
            icon: <Stethoscope className="text-teal-600" size={24} />,
            color: 'bg-teal-50'
        },
        {
            title: 'Secure & Private',
            desc: 'Healthcare-grade encryption ensures your records are always safe and under your control.',
            icon: <ShieldCheck className="text-purple-600" size={24} />,
            color: 'bg-purple-50'
        },
        {
            title: 'Bilingual Support',
            desc: 'Get interpretations in both English and Roman Urdu for better accessibility.',
            icon: <MessageSquare className="text-orange-600" size={24} />,
            color: 'bg-orange-50'
        },
        {
            title: 'Instant Analysis',
            desc: 'No more waiting for days. Get your medical reports analyzed in just a few seconds.',
            icon: <Zap className="text-yellow-600" size={24} />,
            color: 'bg-yellow-50'
        },
        {
            title: 'Health Tracking',
            desc: 'Monitor your vitals and health trends over time with our integrated dashboard.',
            icon: <HeartPulse className="text-red-600" size={24} />,
            color: 'bg-red-50'
        },
    ];

    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Our Features</h2>
                    <h3 className="text-4xl font-bold text-slate-900 mb-6">Innovative Tools for Your Health</h3>
                    <p className="text-lg text-slate-600">
                        A suite of AI-powered tools built with clinical safety and user clarity at its core.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
