import type { TableBlock } from "@/types/content";

export function SpecTable({ table }: { table: TableBlock }) {
  return (
    <div className="min-w-0">
      {table.title ? <h3 className="text-xl font-semibold text-navy-950">{table.title}</h3> : null}
      <div className="mt-4 w-full max-w-full overflow-x-auto rounded-[6px] border border-metal-200 bg-white">
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
