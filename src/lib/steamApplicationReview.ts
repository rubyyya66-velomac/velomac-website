export const steamMeasurementOutputs = {
  "Operating Volumetric Flow (m³/h)": "m³/h",
  "Mass Flow (kg/h)": "kg/h",
  "Mass Flow (t/h)": "t/h",
  "Not Sure": "Not Sure"
} as const;

export const steamConditions = ["Saturated Steam", "Superheated Steam", "Wet Steam / Condensate Risk", "Not Sure"];
export const steamInstrumentation = ["Pressure Transmitter", "Temperature Transmitter", "External Flow Computer", "None", "Not Sure"];
export const steamSystemOutputs = ["4–20 mA", "Pulse", "RS485", "HART", "Modbus", "DCS / PLC Integration", "Other", "Not Sure"];

const fieldNames = {
  measurementOutput: "steam-measurement-output",
  minimumFlow: "minimum-flow", normalFlow: "normal-flow", maximumFlow: "maximum-flow",
  steamCondition: "steam-condition",
  pressure: "pressure", pressureUnit: "pressure-unit", pressureReference: "steam-pressure-reference",
  temperature: "temperature", temperatureUnit: "temperature-unit",
  pipeSize: "pipe-size-value", connectionStandard: "connection-standard",
  upstreamStraightPipe: "upstream-straight-run", upstreamStraightPipeUnit: "upstream-straight-run-unit",
  downstreamStraightPipe: "downstream-straight-run", downstreamStraightPipeUnit: "downstream-straight-run-unit",
  nearbyFittings: "nearby-fittings", installationPosition: "pipe-orientation",
  requiredOutput: "output-communication", notes: "additional-notes"
} as const;

type SteamTextField = keyof typeof fieldNames;
export type SteamReviewData = Record<SteamTextField, string> & { flowUnit: string; instrumentation: string[] };

export function steamFlowUnit(output: string) {
  return steamMeasurementOutputs[output as keyof typeof steamMeasurementOutputs] || "Not Sure";
}

export function steamReviewFromFormData(form: FormData): SteamReviewData {
  const text = Object.fromEntries(Object.entries(fieldNames).map(([key, name]) => [key, String(form.get(name) || "").trim()])) as Record<SteamTextField, string>;
  return {
    ...text,
    flowUnit: String(form.get("steam-flow-unit") || "").trim() || steamFlowUnit(text.measurementOutput),
    instrumentation: form.getAll("steam-instrumentation").filter((value): value is string => typeof value === "string")
  };
}

export function parseSteamReviewData(serialized: string): SteamReviewData | null {
  try {
    const data = JSON.parse(serialized) as SteamReviewData;
    if (!data || typeof data !== "object" || !Object.keys(fieldNames).every((key) => typeof data[key as SteamTextField] === "string")) return null;
    if (typeof data.flowUnit !== "string" || !Array.isArray(data.instrumentation) || !data.instrumentation.every((value) => typeof value === "string")) return null;
    return data;
  } catch { return null; }
}

export function validateSteamReview(data: SteamReviewData) {
  if (!Object.hasOwn(steamMeasurementOutputs, data.measurementOutput) || !["m³/h", "kg/h", "t/h", "Not Sure"].includes(data.flowUnit)) return "Please choose the required output and the unit of your supplied flow values.";
  const choices: Array<[string, string[], string]> = [
    [data.steamCondition, steamConditions, "steam condition"],
    [data.pressureUnit, ["bar", "MPa", "kPa"], "pressure unit"],
    [data.pressureReference, ["Gauge Pressure", "Absolute Pressure", "Not Sure"], "pressure reference"],
    [data.temperatureUnit, ["°C", "°F"], "temperature unit"],
    [data.connectionStandard, ["EN 1092-1", "ASME B16.5", "JIS", "Other", "Not Sure"], "connection standard"],
    [data.upstreamStraightPipeUnit, ["D", "mm", "m", "Not Sure"], "upstream straight-pipe unit"],
    [data.downstreamStraightPipeUnit, ["D", "mm", "m", "Not Sure"], "downstream straight-pipe unit"],
    [data.nearbyFittings, ["None known", "Elbows", "Valves", "Reducers", "Multiple fittings", "Other", "Not Sure"], "nearby fittings"],
    [data.installationPosition, ["Horizontal", "Vertical", "Other", "Not Sure"], "installation position"],
    [data.requiredOutput, steamSystemOutputs, "required output"]
  ];
  for (const [value, options, label] of choices) if (value && !options.includes(value)) return `Please check the ${label}.`;
  for (const key of ["minimumFlow", "normalFlow", "maximumFlow", "pressure", "temperature", "pipeSize", "upstreamStraightPipe", "downstreamStraightPipe"] as const) {
    const value = data[key];
    if (value && (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value) || !Number.isFinite(Number(value)) || (!["pressure", "temperature"].includes(key) && Number(value) < 0))) return "Please enter valid numeric values, or leave unknown values blank.";
  }
  if (data.minimumFlow && data.normalFlow && data.maximumFlow && !(Number(data.minimumFlow) <= Number(data.normalFlow) && Number(data.normalFlow) <= Number(data.maximumFlow))) return "Please check the flow range: Minimum Flow must be ≤ Normal Flow, and Normal Flow must be ≤ Maximum Flow.";
  if (data.pressure && !data.pressureUnit || data.temperature && !data.temperatureUnit || data.upstreamStraightPipe && !data.upstreamStraightPipeUnit || data.downstreamStraightPipe && !data.downstreamStraightPipeUnit) return "Please include the unit for each supplied value.";
  if (data.instrumentation.some((value) => !steamInstrumentation.includes(value)) || new Set(data.instrumentation).size !== data.instrumentation.length || (data.instrumentation.some((value) => value === "None" || value === "Not Sure") && data.instrumentation.length > 1)) return "Choose available instruments, or choose None / Not Sure on its own.";
  return "";
}

export function steamReviewRows(data: SteamReviewData): Array<[string, string]> {
  const quantity = (value: string, unit: string) => value ? `${value} ${unit || "(unit not provided)"}` : "Not provided";
  return [
    ["Required measurement output", data.measurementOutput],
    ["Flow unit", data.flowUnit],
    ["Minimum Flow", quantity(data.minimumFlow, data.flowUnit)],
    ["Normal Flow", quantity(data.normalFlow, data.flowUnit)],
    ["Maximum Flow", quantity(data.maximumFlow, data.flowUnit)],
    ["Steam condition", data.steamCondition || "Not Sure"],
    ["Operating pressure", quantity(data.pressure, data.pressureUnit)],
    ["Pressure reference", data.pressureReference || "Not Sure"],
    ["Operating temperature", quantity(data.temperature, data.temperatureUnit)],
    ["Pipe size", quantity(data.pipeSize, "DN")],
    ["Connection standard", data.connectionStandard || "Not provided"],
    ["Available upstream straight pipe", data.upstreamStraightPipeUnit === "Not Sure" && !data.upstreamStraightPipe ? "Not Sure" : quantity(data.upstreamStraightPipe, data.upstreamStraightPipeUnit)],
    ["Available downstream straight pipe", data.downstreamStraightPipeUnit === "Not Sure" && !data.downstreamStraightPipe ? "Not Sure" : quantity(data.downstreamStraightPipe, data.downstreamStraightPipeUnit)],
    ["Nearby elbows / valves / reducers", data.nearbyFittings || "Not provided"],
    ["Installation position", data.installationPosition || "Not provided"],
    ["Existing instrumentation", data.instrumentation.join(", ") || "Not provided"],
    ["Required output / control system", data.requiredOutput || "Not provided"],
    ["Additional notes", data.notes || "Not provided"]
  ];
}

export function formatSteamReview(data: SteamReviewData) {
  return ["Steam Measurement Application", "", ...steamReviewRows(data).map(([label, value]) => `${label}: ${value}`)].join("\n");
}
