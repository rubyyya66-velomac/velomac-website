import type { Application } from "@/types/content";

export const applications: Application[] = [
  {
    slug: "steam-measurement",
    title: "Steam Measurement",
    focus:
      "Boiler systems, steam distribution, energy use, vortex flowmeter selection and compensation requirements.",
    image: {
      src: "/images/applications/steam-measurement.png",
      alt: "Industrial steam pipeline with visible vapor and an installed flowmeter"
    },
    cardDescription: "Boiler systems, steam distribution, energy use and compensation requirements.",
    whereItFits: "Steam lines often change with pressure, temperature and insulation conditions.",
    siteCondition:
      "Steam lines often operate with changing pressure and temperature, insulation limits and limited straight pipe.",
    challenge:
      "A quote based only on pipe size can miss the real steam flow range, pressure state and installation limitations.",
    suitableMeters: ["Vortex Flowmeter", "Multivariable Vortex Flowmeter"],
    detailsToSend: ["Steam type", "Pipe size", "Pressure", "Temperature", "Flow range"]
  },
  {
    slug: "gas-flow-measurement",
    title: "Gas Flow Measurement",
    focus:
      "Compressed air, natural gas, industrial gas, thermal mass, gas turbine and vortex options.",
    image: {
      src: "/images/applications/gas-flow-measurement.png",
      alt: "Industrial gas process pipeline and installed flowmeter"
    },
    cardDescription: "Compressed air, natural gas and industrial gas measurement options.",
    whereItFits: "Gas lines vary by composition, pressure, temperature and output requirements.",
    siteCondition:
      "Industrial gas systems can vary by gas composition, pressure, flow profile and required output signal.",
    challenge:
      "Different gas applications may need mass flow, standard volumetric flow, turbine measurement or vortex measurement.",
    suitableMeters: ["Thermal Mass Flowmeter", "Gas Turbine Flowmeter", "Vortex Flowmeter"],
    detailsToSend: ["Gas type", "Line size", "Pressure", "Temperature", "Flow range"]
  },
  {
    slug: "conductive-liquid-measurement",
    title: "Conductive Liquid Measurement",
    focus:
      "Water, wastewater, chemical liquids, slurry-compatible conditions and electromagnetic flowmeter selection.",
    image: {
      src: "/images/applications/conductive-liquid-measurement.png",
      alt: "Water process pipeline with pumps and installed flowmeter"
    },
    cardDescription: "Water, wastewater and chemical liquids using electromagnetic measurement.",
    whereItFits: "Conductive liquids depend on conductivity, lining, electrode material and grounding.",
    siteCondition:
      "Conductive liquids require attention to conductivity, lining material, electrodes and installation grounding.",
    challenge:
      "Material compatibility and low conductivity can affect meter configuration and long-term measurement behavior.",
    suitableMeters: ["Electromagnetic Flowmeter"],
    detailsToSend: ["Liquid name", "Conductivity", "Pipe size", "Lining", "Electrode", "Flow range"]
  },
  {
    slug: "chemical-process-lines",
    title: "Chemical Process Lines",
    focus:
      "Material compatibility, lining selection, electrode selection and corrosion considerations.",
    image: {
      src: "/images/applications/chemical-process-lines.png",
      alt: "Clean stainless steel chemical process line and vessel"
    },
    cardDescription: "Material compatibility, lining selection and corrosion considerations.",
    whereItFits: "Chemical lines need the right lining, electrode material and connection choice.",
    siteCondition:
      "Chemical lines may include corrosive media, solids, temperature variation and strict material requirements.",
    challenge:
      "The wrong lining or electrode material can create compatibility issues even when the meter type is correct.",
    suitableMeters: ["Electromagnetic Flowmeter", "PTFE-Lined Flowmeter", "V-Cone Flowmeter"],
    detailsToSend: ["Chemical name", "Concentration", "Temperature", "Pressure", "Materials", "Connection"]
  },
  {
    slug: "high-vibration-pipelines",
    title: "High Vibration Pipelines",
    focus:
      "Pump areas, compressors, process vibration, signal stability and vortex flowmeter selection.",
    image: {
      src: "/images/applications/high-vibration-pipelines.png",
      alt: "Industrial pipeline installed close to large pump motors"
    },
    cardDescription: "Pump, compressor and process lines where vibration affects signal stability.",
    whereItFits: "Vibration-prone lines appear near pumps, compressors, reducers and weak pipe supports.",
    siteCondition:
      "Vibration-prone process lines can appear near pumps, compressors, reducers and unstable pipe supports.",
    challenge:
      "Mechanical vibration can affect signal quality and make installation details more important than a model number.",
    suitableMeters: ["Vortex Flowmeter", "Swirl Flowmeter"],
    detailsToSend: ["Vibration source", "Pipe layout", "Media", "Flow range", "Pressure", "Temperature"]
  },
  {
    slug: "energy-loss-visibility",
    title: "Energy Loss Visibility",
    focus:
      "Flow measurement as a way to locate hidden energy waste in steam, compressed air, cooling water and process utilities.",
    image: {
      src: "/images/applications/energy-loss-visibility.png",
      alt: "Industrial steam pipeline with visible leakage near a flowmeter"
    },
    cardDescription: "Utility flow measurement for steam, compressed air, cooling water and process lines.",
    whereItFits: "Utility networks can lose energy through leaks, bypasses and poorly monitored use points.",
    siteCondition:
      "Utility networks often lose energy through leaks, bypasses, oversized lines or poorly monitored usage points.",
    challenge:
      "Without measured flow, operators may see energy cost but not know which line or process is responsible.",
    suitableMeters: ["Vortex Flowmeter", "Thermal Mass Flowmeter", "Electromagnetic Flowmeter", "Ultrasonic Flowmeter"],
    detailsToSend: ["Utility type", "Metering point", "Pipe size", "Expected operating range", "Data output requirements"]
  }
];
