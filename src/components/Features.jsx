function Features() {
const items = [
{ title: 'Report Interpretation', desc: 'Automatically translate medical jargon into plain language.' },
{ title: 'Symptom Checker', desc: 'AI-assisted triage to suggest urgency and next steps.' },
{ title: 'Secure Storage', desc: 'Encrypted records with patient-controlled sharing.' },
];


return (
<section id="features" className="max-w-7xl mx-auto px-6 py-16">
<h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">What we offer</h2>
<p className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A suite of AI tools built with clinical safety and user clarity in mind.</p>


<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
{items.map(i => (
<article key={i.title} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-sm">
<h3 className="font-semibold text-lg text-gray-900 dark:text-white">{i.title}</h3>
<p className="mt-2 text-gray-600 dark:text-gray-300">{i.desc}</p>
</article>
))}
</div>
</section>
);
}export default Features;