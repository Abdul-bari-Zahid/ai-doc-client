function Testimonials() {
return (
<section id="testimonials" className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
<h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">What users say</h2>
<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
<blockquote className="p-6 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">“Saved me a clinic visit — quick, clear and reassuring.”<div className="mt-3 text-sm text-gray-500">— Sara</div></blockquote>
<blockquote className="p-6 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">“Great explanation of my blood tests.”<div className="mt-3 text-sm text-gray-500">— Ahmed</div></blockquote>
<blockquote className="p-6 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">“Privacy-first approach made me trust the app.”<div className="mt-3 text-sm text-gray-500">— Fatima</div></blockquote>
</div>
</section>
);
}
export default Testimonials;