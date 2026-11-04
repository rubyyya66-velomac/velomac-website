import { Download, FileText } from "lucide-react";

const sheet = "/downloads/quotation-scope-landed-cost-comparison-sheet";

export function BuyerTools() {
  return (
    <section aria-labelledby="buyer-tools-heading" className="mb-8 rounded-md border-l-4 border-blue-400 bg-navy-950 px-5 py-6 text-white sm:mb-10 sm:px-8 sm:py-8">
      <div className="flex items-start gap-4 sm:gap-5">
        <FileText aria-hidden="true" className="mt-0.5 hidden h-10 w-10 shrink-0 rounded-md bg-white/10 p-2 text-blue-100 sm:block" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Buyer Tools</p>
          <h2 id="buyer-tools-heading" className="mt-2 scroll-mt-40 text-xl font-semibold leading-tight text-white sm:text-3xl">
            Quotation Scope &amp; Landed-Cost Comparison Sheet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
            Compare equipment, included accessories, freight and destination charges across up to three supplier quotes.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a id="buyer-tools-quotation-sheet-pdf" data-asset-id="quotation_sheet_pdf" href={`${sheet}.pdf`} download className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-sm bg-white px-4 text-sm font-semibold text-navy-950 transition hover:bg-blue-100">
              <Download aria-hidden="true" className="h-4 w-4 shrink-0" /> Download PDF
            </a>
            <a id="buyer-tools-quotation-sheet-xlsx" data-asset-id="quotation_sheet_xlsx" href={`${sheet}.xlsx`} download className="focus-ring inline-flex min-h-11 items-center rounded-sm border border-blue-200/60 px-4 text-sm font-semibold text-white transition hover:bg-white/10">Download Editable XLSX</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuoteComparisonDownload() {
  return (
    <aside id="contact-buyer-tool" aria-labelledby="contact-buyer-tool-title" className="mb-6 scroll-mt-40 rounded-md border border-blue-200 border-l-4 border-l-industrial-600 bg-blue-50 p-4 sm:p-5">
      <h2 id="contact-buyer-tool-title" className="flex items-start gap-2 text-base font-semibold leading-6 text-navy-950 sm:text-lg">
        <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-industrial-700" />
        Comparing flowmeter quotations?
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">Use the worksheet to compare equipment scope, delivery terms and destination charges.</p>
      <a id="contact-quotation-sheet-pdf" data-asset-id="quotation_sheet_pdf" href={`${sheet}.pdf`} download className="focus-ring mt-3 inline-flex min-h-11 items-center gap-2 rounded-sm border border-industrial-700 bg-white px-3 py-2 text-sm font-semibold leading-5 text-industrial-700 transition hover:bg-industrial-700 hover:text-white">
        <Download aria-hidden="true" className="h-4 w-4 shrink-0" />
        Download Comparison Sheet (PDF)
      </a>
    </aside>
  );
}
