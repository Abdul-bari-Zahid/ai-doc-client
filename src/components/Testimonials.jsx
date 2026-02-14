import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

function Testimonials() {
    const testimonials = [
        {
            name: "Sara Khan",
            role: "Patient",
            content: "Saved me a clinic visit — quick, clear and reassuring. The Roman Urdu explanation was a game changer for my family.",
            rating: 5,
            avatar: "SK"
        },
        {
            name: "Ahmed Raza",
            role: "Chronic Patient",
            content: "Great explanation of my blood tests. I finally understand what all those numbers mean without waiting for my doctor's appointment.",
            rating: 5,
            avatar: "AR"
        },
        {
            name: "Fatima Malik",
            role: "Caregiver",
            content: "Privacy-first approach made me trust the app. I can safely manage my parents' reports in one place.",
            rating: 5,
            avatar: "FM"
        }
    ];

    return (
        <section id="testimonials" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Testimonials</h2>
                    <h3 className="text-4xl font-bold text-slate-900 mb-6">Trusted by Thousands</h3>
                    <p className="text-lg text-slate-600">
                        See how MediAI is helping people understand their health better every day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 flex flex-col items-start relative hover:bg-white hover:shadow-xl transition-all duration-300"
                        >
                            <Quote className="absolute top-6 right-8 text-blue-100" size={48} />

                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-blue-500 text-blue-500" />
                                ))}
                            </div>

                            <p className="text-slate-700 leading-relaxed mb-8 italic">"{t.content}"</p>

                            <div className="mt-auto flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{t.name}</div>
                                    <div className="text-xs text-slate-500 font-medium">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
