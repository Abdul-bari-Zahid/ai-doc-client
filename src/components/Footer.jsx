import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";


function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <img src="/ai-doctor-assistant.png" alt="MediAI Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-bold text-slate-900">MediAI</span>
                        </Link>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            Your intelligent healthcare companion. Understanding medical reports has never been easier.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-100 transition-all">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-blue-400 hover:border-blue-100 transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Product</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-500">
                            <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
                            <li><a href="#how" className="hover:text-blue-600 transition-colors">How it Works</a></li>
                            <li><Link to="/uploadreport" className="hover:text-blue-600 transition-colors">Upload Report</Link></li>
                            <li><Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Company</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Career</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Support</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                <a href="mailto:support@mediai.co" className="hover:text-blue-600 transition-colors">support@mediai.co</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 font-medium">
                    <div>© {currentYear} MediAI. All rights reserved.</div>
                    <div className="text-center md:text-right">
                        Not a replacement for professional medical advice. Always consult a physician.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
