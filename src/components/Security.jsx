function Security() {
return (
<section id="security" className="max-w-7xl mx-auto px-6 py-16">
<h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Your data is safe</h2>
<p className="mt-3 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Industry‑grade security, encrypted uploads, zero data training — your health data stays yours.</p>
<div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
{[
{ t: "End‑to‑End Encryption", d: "All reports are encrypted in transit and at rest." },
{ t: "Zero Retention", d: "You control your data — delete anytime." },
{ t: "HIPAA‑inspired", d: "Built on healthcare security best practices." },
].map(card => (
<div key={card.t} className="p-6 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm">
<h4 className="font-semibold text-gray-900 dark:text-white">{card.t}</h4>
<p className="mt-2 text-gray-600 dark:text-gray-300">{card.d}</p>
</div>
))}
</div>
</section>
);
}
export default Security;