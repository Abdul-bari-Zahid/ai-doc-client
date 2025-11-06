function HowItWorks() {
const steps = [
{ title: 'Upload', desc: 'Securely upload your medical report or image.' },
{ title: 'Analyze', desc: 'AI extracts findings and compares with clinical knowledge.' },
{ title: 'Explain', desc: 'Receive a clear summary, risks, and suggested next steps.' },
];


return (
<section id="how" className="max-w-6xl mx-auto px-6 py-16">
<h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">How it works</h2>
<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
{steps.map(s => (
<div key={s.title} className="p-6 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm">
<div className="w-10 h-10 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center font-semibold">✓</div>
<h4 className="mt-3 font-semibold text-gray-900 dark:text-white">{s.title}</h4>
<p className="mt-2 text-gray-600 dark:text-gray-300">{s.desc}</p>
</div>
))}
</div>
</section>
);
}
export default HowItWorks;