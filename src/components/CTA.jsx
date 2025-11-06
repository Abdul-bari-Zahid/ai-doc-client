import { Link } from "react-router-dom";
function CTA() {
return (
<section id="get-started" className="max-w-7xl mx-auto px-6 py-16">
<div className="rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 text-white p-10 shadow-lg">
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
<div>
<h3 className="text-2xl font-bold">Ready to try MediAI?</h3>
<p className="mt-2 text-sm opacity-90 max-w-xl">Upload your report and let our AI give you a clear, actionable summary.</p>
</div>
<div className="flex gap-3">
    <Link className="px-6 py-3 bg-white text-sky-700 rounded-lg font-semibold" to="/uploadreport">Upload Report</Link>
    <Link className="px-6 py-3 bg-white text-sky-700 rounded-lg font-semibold" to="/">See Plans</Link>

{/* <a href="#upload">Upload Report</a>
<a href="#pricing" className="px-6 py-3 border border-white/40 rounded-lg">See Plans</a> */}
</div>
</div>
</div>
</section>
);
}export default CTA;