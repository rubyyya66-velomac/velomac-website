import type { TableBlock } from "@/types/content";

export function SpecTable({ table }: { table: TableBlock }) {
  return (
    <div className="min-w-0">
      {table.title ? <h3 className="text-xl font-semibold text-navy-950">{table.title}</h3> : null}
      <p className="mt-4 text-xs font-semibold text-slate-500 sm:hidden" aria-hidden="true">
        Swipe horizontally to view all columns →
      </p>
      <div
        className="mt-2 w-full max-w-full overflow-x-auto overscroll-x-contain rounded-[6px] border border-metal-200 bg-white sm:mt-4"
        role="region"
        aria-label={`${table.title || "Specification"} table; scroll horizontally to view all columns`}
        tabIndex={0}
      >
        <table className="min-w-[720px] w-full border-collapse bg-white text-left text-sm">
          <thead className="bg-navy-950 text-white">
            <tr>
              {table.columns.map((column) => (
                <th key={column} scope="col" className="border-b border-white/10 px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`} className="border-b border-metal-200 last:border-b-0 odd:bg-white even:bg-metal-50/70">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className="px-4 py-3 align-top leading-6 text-slate-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note ? <p className="mt-3 text-sm leading-6 text-slate-500">{table.note}</p> : null}
    </div>
  );
}
