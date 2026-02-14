import { Link } from "react-router-dom";
import { ArrowRight, FileUp } from "lucide-react";
import { motion } from "framer-motion";

function CTA() {
    return (
        <section id="get-started" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[3rem] bg-slate-900 text-white p-12 lg:p-20 relative overflow-hidden shadow-2xl"
                >
                    {/* Abstract background shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                        <h3 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                            Ready to take control of <br />
                            <span className="text-blue-400">your health journey?</span>
                        </h3>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
                            Join thousands of users who trust MediAI for clear, actionable medical report interpretations. All processed securely and instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link to="/uploadreport" className="btn-primary py-4 px-10 rounded-2xl flex items-center justify-center gap-2 group">
                                <FileUp size={20} />
                                Upload Your Report
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold transition-all text-center">
                                Create Free Account
                            </Link>
                        </div>

                        <p className="mt-8 text-slate-500 text-sm font-medium">
                            No credit card required • GDPR Compliant • Free forever for individuals
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default CTA;
