function Footer() {
return (
<footer className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
<div className="flex flex-col md:flex-row md:justify-between gap-4">
<div>© {new Date().getFullYear()} MediAI — Not a replacement for professional medical advice.</div>
<div className="flex gap-4">
<a href="#" className="hover:text-sky-600">Privacy</a>
<a href="#" className="hover:text-sky-600">Terms</a>
</div>
</div>
</footer>
);
}export default Footer;