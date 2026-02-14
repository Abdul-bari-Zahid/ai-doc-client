import React from 'react';
import { Shield, Lock, EyeOff, Server } from 'lucide-react';
import { motion } from 'framer-motion';

function Security() {
    const securityFeatures = [
        {
            title: "End-to-End Encryption",
            desc: "Your medical data is encrypted both in transit and at rest using banking-grade security protocols.",
            icon: <Lock className="text-blue-500" size={24} />
        },
        {
            title: "Private by Design",
            desc: "We don't sell your data. Your health records are yours alone and processed with strict anonymity.",
            icon: <EyeOff className="text-teal-500" size={24} />
        },
        {
            title: "Secure Infrastructure",
            desc: "Hosted on HIPAA-compliant cloud infrastructure to ensure the highest standards of availability.",
            icon: <Server className="text-purple-500" size={24} />
        }
    ];

    return (
        <section id="security" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-8">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 font-heading">Your Privacy is Our <span className="text-blue-600">Top Priority</span></h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            We understand that health information is extremely sensitive. That's why we've built MediAI with a "Security First" mindset from the ground up.
                        </p>
                        <div className="flex items-center gap-4 p-4 border border-blue-100 bg-white rounded-2xl shadow-sm lg:inline-flex">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                <Shield size={20} />
                            </div>
                            <span className="font-bold text-slate-800">ISO 27001 Certified Protection</span>
                        </div>
                    </div>

                    <div className="lg:w-1/2 grid grid-cols-1 gap-6">
                        {securityFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex gap-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2 font-heading">{feature.title}</h4>
                                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Security;
