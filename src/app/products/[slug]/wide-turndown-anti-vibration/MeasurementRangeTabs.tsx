"use client";

import { useState } from "react";

type MeasurementRangeRow = readonly [
  size: string,
  liquidFlow: string,
  liquidVelocity: string,
  gasFlow: string,
  gasVelocity: string
];

export function MeasurementRangeTabs({ rows }: { rows: readonly MeasurementRangeRow[] }) {
  const [medium, setMedium] = useState<"liquid" | "gas">("liquid");
  const isLiquid = medium === "liquid";

  return (
    <div>
      <div className="flex border-b border-metal-300" role="tablist" aria-label="Measurement range medium">
        {(["liquid", "gas"] as const).map((tab) => {
          const selected = medium === tab;

          return (
            <button
              key={tab}
              id={`${tab}-range-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="measurement-range-panel"
              onClick={() => setMedium(tab)}
              className={`focus-ring min-w-28 border-b-2 px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.14em] transition sm:min-w-36 ${
                selected
                  ? "border-industrial-700 text-industrial-700"
                  : "border-transparent text-slate-500 hover:text-navy-950"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div
        id="measurement-range-panel"
        role="tabpanel"
        aria-labelledby={`${medium}-range-tab`}
        className="pt-2"
      >
        <table className="w-full table-fixed border-collapse text-left text-[15px] text-slate-700 sm:text-base">
          <colgroup>
            <col className="w-[24%] sm:w-[22%]" />
            <col className="w-[38%] sm:w-[39%]" />
            <col className="w-[38%] sm:w-[39%]" />
          </colgroup>
          <thead>
            <tr className="border-b-2 border-navy-950 text-navy-950">
              <th className="px-2 py-4 text-xs font-semibold uppercase leading-5 tracking-[0.08em] sm:px-4 sm:text-sm">
                <span className="sm:hidden">Size</span>
                <span className="hidden sm:inline">Nominal Size</span>
              </th>
              <th className="px-2 py-4 text-xs font-semibold uppercase leading-5 tracking-[0.08em] sm:px-4 sm:text-sm">Flow Range (m³/h)</th>
              <th className="px-2 py-4 text-xs font-semibold uppercase leading-5 tracking-[0.08em] sm:px-4 sm:text-sm">Velocity (m/s)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-metal-200">
                <th scope="row" className="whitespace-nowrap px-2 py-4 font-semibold text-navy-950 sm:px-4">
                  {row[0]}
                </th>
                <td className="whitespace-nowrap px-2 py-4 tabular-nums sm:px-4">{isLiquid ? row[1] : row[3]}</td>
                <td className="whitespace-nowrap px-2 py-4 tabular-nums sm:px-4">{isLiquid ? row[2] : row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
