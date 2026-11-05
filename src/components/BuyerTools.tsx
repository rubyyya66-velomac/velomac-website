import { Download, FileText } from "lucide-react";
import Link from "next/link";
import { BuyerToolsQuoteLink } from "@/components/BuyerToolsQuoteLink";

const sheet = "/downloads/quotation-scope-landed-cost-comparison-sheet";
export const buyerToolsHref = "/resources#buyer-tools-heading";

export function BuyerTools() {
  return (
    <section aria-labelledby="buyer-tools-heading" className="mb-8 rounded-md border-l-4 border-blue-400 bg-navy-950 px-5 py-6 text-white sm:mb-10 sm:px-8 sm:py-8">
      <div className="flex items-start gap-4 sm:gap-5">
        <FileText aria-hidden="true" className="mt-0.5 hidden h-10 w-10 shrink-0 rounded-md bg-white/10 p-2 text-blue-100 sm:block" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Buyer Tools</p>
          <h2 id="buyer-tools-heading" className="mt-2 scroll-mt-40 text-xl font-semibold leading-tight text-white sm:text-3xl">
            Compare Flow Meter Quotations Beyond the Unit Price
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
            The Quotation Scope &amp; Landed-Cost Comparison Sheet helps buyers compare up to three flowmeter supplier quotes. Check what each price includes and which costs your team may still need to pay.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a id="buyer-tools-quotation-sheet-pdf" data-asset-id="quotation_sheet_pdf" href={`${sheet}.pdf`} download className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-sm bg-white px-4 text-sm font-semibold text-navy-950 transition hover:bg-blue-100">
              <Download aria-hidden="true" className="h-4 w-4 shrink-0" /> Download PDF
            </a>
            <a id="buyer-tools-quotation-sheet-xlsx" data-asset-id="quotation_sheet_xlsx" href={`${sheet}.xlsx`} download className="focus-ring inline-flex min-h-11 items-center rounded-sm border border-blue-200/60 px-4 text-sm font-semibold text-white transition hover:bg-white/10">Download Editable XLSX</a>
          </div>
        </div>
      </div>
      <QuotationGuide />
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
      <Link href={buyerToolsHref} className="focus-ring mt-2 flex min-h-11 w-fit items-center text-sm font-semibold text-industrial-700 underline underline-offset-4 hover:text-navy-950">
        See what the comparison sheet covers
      </Link>
    </aside>
  );
}

const quotationItems = [
  ["Instrument", "Model, configuration, quantity, currency and unit price."],
  ["Accessories", "Which fittings, cables, displays or other required items are included, optional or excluded."],
  ["Packaging", "Whether export packing or crating is included or separately charged."],
  ["Freight and insurance", "The quoted route, carrier charges and who arranges insurance, if applicable."],
  ["Delivery terms", "The Incoterms® 2020 rule and the exact named place or port."],
  ["Import and destination charges", "Confirm applicable duty, tax, brokerage, terminal handling and onward delivery with your broker or forwarder."]
] as const;

const deliveryTerms = [
  ["EXW", "Seller makes the goods available at the named place. Buyer generally arranges pickup, main transport and clearance."],
  ["FOB", "Seller delivers on board at the named shipment port. Buyer generally pays main freight; risk transfers on board."],
  ["CIF", "Seller pays freight and arranges insurance to the named destination port. Risk still transfers on board at shipment."],
  ["DAP", "Seller delivers to the named destination ready for unloading. Buyer generally handles import clearance and applicable duties and taxes."],
  ["DDP", "Seller delivers ready for unloading and handles import clearance and applicable duties and taxes. Confirm what the seller can legally handle at destination."]
] as const;

function QuotationGuide() {
  const headingClass = "text-lg font-semibold leading-snug text-navy-950 sm:text-xl";
  return (
    <details className="mt-6 rounded-sm bg-white text-slate-700">
      <summary className="focus-ring min-h-11 cursor-pointer rounded-sm px-4 py-3 text-sm font-semibold text-industrial-700 hover:text-navy-950 sm:px-5">
        How to compare flowmeter quotes and landed costs
      </summary>
      <div className="space-y-6 border-t border-metal-200 px-4 py-5 text-sm leading-6 sm:px-5 sm:text-base sm:leading-7">
        <section>
          <h3 className={headingClass}>What should a flowmeter quotation include?</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            {quotationItems.map(([label, detail]) => <li key={label}><strong>{label}:</strong> {detail}</li>)}
          </ul>
        </section>
        <section>
          <h3 className={headingClass}>Instrument price vs. total landed cost</h3>
          <p className="mt-2">Instrument price covers the quoted meter configuration. Total landed cost covers acquiring and getting it to your destination, including applicable accessories, transport, insurance, import and destination charges. Add only costs that apply and aren’t already included in the quotation.</p>
        </section>
        <section>
          <h3 className={headingClass}>How to compare EXW, FOB, CIF, DAP and DDP quotations</h3>
          <p className="mt-2">Compare the same delivery endpoint and check who pays each charge and where risk transfers. FOB and CIF apply to sea or inland-waterway transport only.</p>
          <table className="mt-3 w-full table-fixed border-collapse text-left text-sm leading-5">
            <caption className="sr-only">Selected Incoterms® 2020 rules and quotation checks</caption>
            <thead className="bg-metal-50 text-navy-950">
              <tr><th scope="col" className="w-16 px-2 py-2 sm:w-24 sm:px-3">Rule</th><th scope="col" className="px-2 py-2 sm:px-3">What to check</th></tr>
            </thead>
            <tbody>
              {deliveryTerms.map(([rule, detail]) => (
                <tr key={rule} className="border-b border-metal-200 align-top">
                  <th scope="row" className="px-2 py-2.5 font-semibold text-navy-950 sm:px-3">{rule}</th>
                  <td className="px-2 py-2.5 sm:px-3">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-sm">See the <a href="https://library.iccwbo.org/content/tfb/BOOKS/BK_0049/BK_0049_03_Introduction.htm" className="focus-ring text-industrial-700 underline underline-offset-4">ICC’s Incoterms® 2020 guidance</a>. Confirm exact delivery obligations and charges for your shipment.</p>
        </section>
        <section>
          <h3 className={headingClass}>How to use the comparison worksheet</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5">
            <li>Enter up to three offers and align the meter scope, quantity and currency.</li>
            <li>Record each delivery rule and named place. Mark exclusions and unconfirmed charges separately.</li>
            <li>Compare totals at the same endpoint after confirming open items. A blank cost is not zero.</li>
          </ol>
        </section>
        <section>
          <h3 className={headingClass}>Frequently asked questions</h3>
          <dl className="mt-2 space-y-3">
            <div><dt className="font-semibold text-navy-950">Why can the lowest unit price cost more overall?</dt><dd>A lower meter price may exclude required fittings, export packing or freight that a higher quote already includes.</dd></div>
            <div><dt className="font-semibold text-navy-950">Why does the named place or port matter?</dt><dd>It identifies the location tied to the rule’s obligations. For example, a CIF destination port identifies how far the seller pays freight, not where risk transfers.</dd></div>
            <div><dt className="font-semibold text-navy-950">Is the worksheet a landed-cost calculator?</dt><dd>No. It organizes supplier offers; confirm freight, insurance, duties, taxes and local charges for your shipment before comparing totals.</dd></div>
          </dl>
        </section>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-metal-200 pt-3">
          <p className="text-sm">Prepared by Velomac Flow Meter.</p>
          <BuyerToolsQuoteLink />
        </div>
      </div>
    </details>
  );
}
