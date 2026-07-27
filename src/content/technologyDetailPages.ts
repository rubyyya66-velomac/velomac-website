import type {
  TechnologyCategoryId,
  TechnologyImage,
  TechnologyTable
} from "@/content/technology";

export type TechnologyDetailFact = {
  label: string;
  value: string;
};

export type TechnologyDetailImage = TechnologyImage & {
  caption?: string;
  position?: "center" | "top";
};

export type TechnologyDetailItem = {
  title: string;
  text?: string;
  bullets?: string[];
};

export type TechnologyDetailModule = {
  kind: "split" | "cards" | "steps" | "table" | "gallery" | "highlight" | "checklist";
  eyebrow?: string;
  title: string;
  description?: string;
  bullets?: string[];
  items?: TechnologyDetailItem[];
  image?: TechnologyDetailImage;
  images?: TechnologyDetailImage[];
  table?: TechnologyTable;
  result?: TechnologyDetailFact;
  reverse?: boolean;
  tone?: "white" | "soft" | "blue" | "dark";
};

export type TechnologyDetailPageContent = {
  slug: string;
  categoryId: TechnologyCategoryId;
  heroIntroduction: string;
  heroImage: TechnologyDetailImage;
  facts: TechnologyDetailFact[];
  modules: TechnologyDetailModule[];
  relatedEyebrow: string;
  relatedHeading: string;
  cta: {
    title: string;
    text: string;
  };
};

const detailPages: TechnologyDetailPageContent[] = [
  {
    slug: "non-wetted-piezoelectric-vortex-sensor",
    categoryId: "product-sensor-innovation",
    heroIntroduction:
      "Velomac developed a vortex sensing structure that keeps the piezoelectric element outside direct process-medium contact while preserving the mechanical signal path used to detect vortex shedding.",
    heroImage: {
      src: "/images/technology/non-wetted-sensor-main.png",
      alt: "Comparison of traditional and Velomac non-wetted vortex sensor signals",
      fit: "contain",
      caption: "Non-wetted sensor development and controlled waveform comparison."
    },
    facts: [
      { label: "Signal retained", value: ">95%" },
      { label: "Process temperature", value: ">400°C" },
      { label: "Comparison point", value: "DN50 at 4.2 m/s" },
      { label: "Service structure", value: "Removable sensor core" }
    ],
    modules: [
      {
        kind: "split",
        eyebrow: "Sensor Structure",
        title: "What Velomac developed",
        description:
          "The design separates the sensing element from the medium without breaking the mechanical transmission path.",
        bullets: [
          "Piezoelectric element remains outside direct medium contact",
          "Thin metal diaphragm receives fluid-induced vibration",
          "Tapered rigid coupling transfers the signal to the sensor core",
          "Removable core supports focused field service",
          "Protection-tube length can be configured for process heat"
        ],
        image: {
          src: "/images/technology/non-wetted-sensor-structure.png",
          alt: "Section view of the removable non-wetted vortex sensor structure",
          fit: "contain",
          caption: "Section view of the removable sensing core and protected transmission path."
        },
        tone: "white"
      },
      {
        kind: "highlight",
        eyebrow: "Service Direction",
        title: "Replace the sensor core without removing the complete meter body",
        description:
          "The removable core is designed to reduce full-meter disassembly. Any field intervention still follows the approved isolation, pressure and temperature safety procedure.",
        result: {
          label: "Meter-body removal",
          value: "Not required for sensor-core replacement"
        },
        tone: "dark"
      },
      {
        kind: "cards",
        eyebrow: "Operating Relevance",
        title: "Protection without giving up the vortex signal",
        items: [
          {
            title: "Process heat",
            text: "Test work for the non-wetted direction included operation above 400°C."
          },
          {
            title: "Deposits and particles",
            text: "The sensing element is less directly exposed to medium contamination and impurity buildup."
          },
          {
            title: "Maintenance access",
            text: "Service work can focus on the removable core instead of the complete meter assembly."
          }
        ],
        tone: "soft"
      },
      {
        kind: "gallery",
        eyebrow: "Validation Evidence",
        title: "Same board, same operating point",
        description:
          "The traditional medium-contact sensor and the Velomac non-wetted sensor were compared with the same signal-processing board.",
        images: [
          {
            src: "/images/technology/non-wetted-traditional-waveform.png",
            alt: "Waveform from the traditional medium-contact vortex sensor",
            fit: "contain",
            caption: "Traditional medium-contact sensor waveform."
          },
          {
            src: "/images/technology/non-wetted-velomac-waveform.png",
            alt: "Waveform from the Velomac non-wetted vortex sensor",
            fit: "contain",
            caption: "Velomac non-wetted sensor waveform."
          }
        ],
        tone: "white"
      },
      {
        kind: "table",
        eyebrow: "Controlled Test Point",
        title: "Controlled comparison data",
        description:
          "The result applies to this operating point and should not be read as a full-range accuracy statement.",
        table: {
          columns: ["Test item", "Test value"],
          rows: [
            ["Ambient temperature", "28°C"],
            ["Atmospheric pressure", "101.413 kPa"],
            ["Meter size", "DN50"],
            ["Flow velocity", "4.2 m/s"],
            ["Signal processing", "Identical board for both sensors"],
            ["Measured result", "More than 95% of the traditional signal amplitude retained"]
          ]
        },
        result: {
          label: "Signal result",
          value: ">95% amplitude retained"
        },
        tone: "blue"
      },
      {
        kind: "checklist",
        eyebrow: "Suitable Process Conditions",
        title: "Where this direction may be relevant",
        description:
          "Application review still starts with the medium, heat, pressure, flow and maintenance procedure.",
        bullets: [
          "High-temperature steam and thermal process lines",
          "Media where deposits or particles may reach the sensing area",
          "Continuous lines where full meter removal creates substantial service work",
          "Installations requiring a defined sensor-core replacement procedure",
          "Sites where vibration and pipe stress must also be reviewed"
        ],
        tone: "white"
      }
    ],
    relatedEyebrow: "Related Developments",
    relatedHeading: "Explore adjacent sensing and test work",
    cta: {
      title: "Discuss the medium, temperature and maintenance condition.",
      text: "Share the process medium, pressure, temperature, pipe size, flow range and permitted service procedure."
    }
  },
  {
    slug: "wide-turndown-anti-vibration-vortex-flowmeter",
    categoryId: "product-sensor-innovation",
    heroIntroduction:
      "This vortex meter development addresses two separate field problems: changing operating flow and mechanical vibration that can overlap with the true vortex signal, especially near the lower end of the range.",
    heroImage: {
      src: "/images/technology/wide-turndown-vortex-main.png",
      alt: "Problem and solution comparison for the Velomac anti-vibration vortex flowmeter",
      fit: "cover",
      caption: "Wide-flow-range handling and digital vibration analysis are reviewed together."
    },
    facts: [
      { label: "Maximum turndown", value: "1:70" },
      { label: "Rated flow coverage", value: "1%–100%" },
      { label: "Measurement class", value: "Class 0.5" },
      { label: "Dynamic variation", value: "Approx. 75% lower" }
    ],
    modules: [
      {
        kind: "cards",
        eyebrow: "Two Operating Challenges",
        title: "Flow change and vibration need different responses",
        items: [
          {
            title: "Changing flow range",
            bullets: [
              "Low-flow vortex signals can be small",
              "One fixed cutoff can remove useful information",
              "Higher flow shifts the expected vortex frequency"
            ]
          },
          {
            title: "Pipeline vibration",
            bullets: [
              "Mechanical interference is often narrow-band",
              "Motor and power-frequency harmonics can remain fixed",
              "Vibration amplitude may exceed the real low-flow signal"
            ]
          }
        ],
        tone: "soft"
      },
      {
        kind: "split",
        eyebrow: "Development Approach",
        title: "Follow the process signal instead of one fixed filter",
        bullets: [
          "Adaptive filtering across changing flow conditions",
          "Digital signal-feature analysis for persistent interference",
          "Ten selectable anti-vibration modes",
          "Wide-flow-range handling from 1% to 100% of rated flow",
          "Site review based on both flow range and vibration source"
        ],
        image: {
          src: "/images/technology/wide-turndown-vortex-flowmeter.png",
          alt: "Velomac wide-turndown anti-vibration vortex flowmeter",
          fit: "contain",
          caption: "The product development combines wide range coverage with digital anti-vibration functions."
        },
        reverse: true,
        tone: "white"
      },
      {
        kind: "split",
        eyebrow: "Test Setup",
        title: "Apply flow and mechanical disturbance together",
        description:
          "A representative program used the in-house airflow and vibration test system to compare the same meter configuration with digital signal-feature analysis disabled and enabled.",
        bullets: [
          "Approximately 1g three-axis acceleration",
          "Approximately five minutes per recorded condition",
          "Static test with no flow",
          "Dynamic test at approximately 5 m/s"
        ],
        image: {
          src: "/images/technology/vibration-test-system-photo.jpg",
          alt: "Velomac airflow and vibration test setup with vortex flowmeter",
          fit: "cover",
          caption: "Real in-house setup used to apply airflow and mechanical disturbance."
        },
        tone: "blue"
      },
      {
        kind: "table",
        eyebrow: "Before and After",
        title: "Recorded result with digital feature analysis enabled",
        table: {
          columns: ["Measurement", "Feature disabled", "Feature enabled"],
          rows: [
            ["Static vibration signal", "33–51 Hz", "0 Hz"],
            ["Static flow output", "False flow present", "0.000 m³/h"],
            ["Dynamic frequency range", "185–189 Hz", "185–186 Hz"],
            ["Dynamic frequency spread", "4 Hz", "1 Hz"],
            ["Instantaneous flow peak-to-peak variation", "Approx. 0.20 m³/h", "Approx. 0.05 m³/h"]
          ]
        },
        result: {
          label: "Recorded dynamic change",
          value: "Approx. 75% reduction"
        },
        tone: "dark"
      },
      {
        kind: "gallery",
        eyebrow: "Image-Supported Validation",
        title: "Static and dynamic screen records",
        description:
          "The screen captures show the two feature states. Values shown are tied to the recorded test conditions.",
        images: [
          {
            src: "/images/technology/anti-vibration-static-disabled.jpg",
            alt: "Static vibration test with digital feature analysis disabled",
            fit: "contain",
            caption: "Static, no flow: feature analysis disabled."
          },
          {
            src: "/images/technology/anti-vibration-static-enabled.jpg",
            alt: "Static vibration test with digital feature analysis enabled",
            fit: "contain",
            caption: "Static, no flow: feature analysis enabled."
          },
          {
            src: "/images/technology/anti-vibration-dynamic-disabled.png",
            alt: "Dynamic vibration test with digital feature analysis disabled",
            fit: "contain",
            caption: "Dynamic flow: feature analysis disabled."
          },
          {
            src: "/images/technology/anti-vibration-dynamic-enabled.jpg",
            alt: "Dynamic vibration test with digital feature analysis enabled",
            fit: "contain",
            caption: "Dynamic flow: feature analysis enabled."
          }
        ],
        tone: "white"
      },
      {
        kind: "checklist",
        eyebrow: "Suitable Conditions",
        title: "Information needed for a useful review",
        bullets: [
          "Minimum, normal and maximum flow",
          "Medium, pressure and temperature",
          "Pipe size and available straight run",
          "Vibration source and approximate frequency or acceleration",
          "Pipe supports, nearby pumps, compressors or motors"
        ],
        tone: "soft"
      }
    ],
    relatedEyebrow: "Related Developments",
    relatedHeading: "Connect the meter result to the test capability",
    cta: {
      title: "Share the flow range and vibration condition.",
      text: "Send the minimum, normal and maximum flow together with the vibration source, pipe layout and operating conditions."
    }
  },
  {
    slug: "electromagnetic-flowmeter-remote-pressure-monitoring",
    categoryId: "product-sensor-innovation",
    heroIntroduction:
      "This configuration measures conductive-liquid flow and pipeline pressure at the same location, then uses an integrated 4G connection to support remote operating visibility for distributed or space-constrained installations.",
    heroImage: {
      src: "/images/technology/remote-pressure-electromagnetic-main.png",
      alt: "Electromagnetic flowmeter with integrated pressure sensing",
      fit: "contain",
      caption: "Flow, pressure and remote communication combined at one pipeline point."
    },
    facts: [
      { label: "Measured variables", value: "Flow + pressure" },
      { label: "Remote connection", value: "Integrated 4G" },
      { label: "Installation", value: "One pipeline point" },
      { label: "Medium requirement", value: "Conductive liquid" }
    ],
    modules: [
      {
        kind: "cards",
        eyebrow: "One Location, Two Variables",
        title: "A compact measurement architecture",
        items: [
          {
            title: "Electromagnetic flow",
            text: "Measures conductive-liquid flow through the primary sensor."
          },
          {
            title: "Pressure sensing",
            text: "Reads pipeline pressure at the same measurement location."
          },
          {
            title: "Local indication",
            text: "Keeps operating values available at the instrument."
          },
          {
            title: "Remote transmission",
            text: "Integrated 4G supports access without a separate wireless unit."
          }
        ],
        tone: "soft"
      },
      {
        kind: "split",
        eyebrow: "Co-Located Measurement",
        title: "Compare pressure and flow at the same point",
        description:
          "Aligned readings can support pump review, line-condition checks and remote operation without creating two separate measurement locations.",
        bullets: [
          "One process location for both operating variables",
          "Fewer separate field devices and wiring runs",
          "Useful for distributed pump stations and packaged systems",
          "Flow and pressure remain aligned in time and location"
        ],
        image: {
          src: "/images/technology/remote-pressure-production.jpg",
          alt: "Electromagnetic flowmeters with pressure connections prepared in production",
          fit: "cover",
          position: "top",
          caption: "Multiple integrated units prepared for project supply."
        },
        tone: "white"
      },
      {
        kind: "split",
        eyebrow: "Pressure-Sensing Direction",
        title: "Designed around pump and pulsation conditions",
        description:
          "The pressure-sensing direction is intended for pulsating service. Pressure range and long-term measurement data still require project-specific confirmation.",
        bullets: [
          "Review pump or reciprocating-equipment pulsation",
          "Confirm pressure range and process connection",
          "Check material compatibility with the liquid",
          "Keep flow and pressure configuration requirements separate"
        ],
        image: {
          src: "/images/technology/remote-pressure-calibration.jpg",
          alt: "Electromagnetic flowmeters prepared for calibration and configuration",
          fit: "cover",
          caption: "Project units prepared for configuration and calibration work."
        },
        reverse: true,
        tone: "blue"
      },
      {
        kind: "checklist",
        eyebrow: "Engineering Considerations",
        title: "What must be confirmed before configuration",
        bullets: [
          "Liquid conductivity and media compatibility",
          "Lining and electrode selection",
          "Pipe size and flow range",
          "Pressure range and pulsation condition",
          "Temperature and process connection",
          "Power supply and signal output",
          "4G coverage, data destination and update requirement"
        ],
        tone: "white"
      },
      {
        kind: "cards",
        eyebrow: "Typical Scenarios",
        title: "Where co-located flow and pressure can help",
        items: [
          { title: "Distributed pump stations", text: "Remote operating visibility across separated sites." },
          { title: "Water and wastewater networks", text: "Flow and pressure review at one pipeline location." },
          { title: "Packaged process equipment", text: "Fewer separate installation points on compact skids." },
          { title: "Chemical batching systems", text: "Combined variables where media compatibility is confirmed." }
        ],
        tone: "white"
      }
    ],
    relatedEyebrow: "Related Developments",
    relatedHeading: "Explore liquid measurement and in-house verification",
    cta: {
      title: "Share the liquid, pressure range and remote-data requirement.",
      text: "Include conductivity, pipe size, flow range, pressure, temperature, power supply and the required data destination."
    }
  },
  {
    slug: "in-house-liquid-flow-calibration-bench",
    categoryId: "testing-calibration",
    heroIntroduction:
      "Velomac developed an in-house liquid-flow bench that compares a controlled displacement volume with measured liquid mass, supporting accumulated and instantaneous flow review through two connected reference methods.",
    heroImage: {
      src: "/images/technology/liquid-flow-calibration-bench.jpg",
      alt: "Velomac in-house liquid flow calibration workshop and circulation lines",
      fit: "cover",
      caption: "In-house liquid-flow calibration bench and circulation pipelines."
    },
    facts: [
      { label: "Working medium", value: "Liquid" },
      { label: "Reference method", value: "Volume + mass" },
      { label: "Flow review", value: "Accumulated + instantaneous" },
      { label: "Operation", value: "In-house" }
    ],
    modules: [
      {
        kind: "cards",
        eyebrow: "Why Velomac Built It",
        title: "Keep liquid verification close to development and configuration",
        items: [
          {
            title: "Two connected references",
            text: "Displaced volume and measured mass provide a cross-check."
          },
          {
            title: "Configured operating points",
            text: "Travel and retraction speed establish the required liquid condition."
          },
          {
            title: "In-house data review",
            text: "Meter output can be reviewed near manufacturing and setup work."
          }
        ],
        tone: "white"
      },
      {
        kind: "highlight",
        eyebrow: "Dual-Reference Principle",
        title: "One displacement tube, one mass reference",
        description:
          "The telescopic tube establishes reference volume V. The electronic scale records discharged mass m. The connected values can be used to review density through ρ = m / V.",
        result: {
          label: "Reference relationship",
          value: "ρ = m / V"
        },
        tone: "dark"
      },
      {
        kind: "steps",
        eyebrow: "Calibration Flow",
        title: "From meter setup to result review",
        description:
          "The exact points are configured for the meter and liquid under review.",
        items: [
          { title: "1. Meter setup", text: "Install the meter and confirm the liquid and connection." },
          { title: "2. Set the point", text: "Control displacement travel and retraction speed." },
          { title: "3. Discharge liquid", text: "Move the reference volume through the meter." },
          { title: "4. Record references", text: "Capture displaced volume, mass and meter output." },
          { title: "5. Review result", text: "Compare accumulated and instantaneous flow." }
        ],
        tone: "blue"
      },
      {
        kind: "cards",
        eyebrow: "System Support",
        title: "What the bench can review",
        items: [
          { title: "Accumulated flow", text: "Compare totalized meter output with the reference discharge." },
          { title: "Instantaneous flow", text: "Relate meter output to the controlled retraction speed." },
          { title: "Reference density", text: "Use measured mass and displaced volume as connected values." },
          { title: "Configured points", text: "Review minimum, normal and maximum flow where the bench setup permits." }
        ],
        tone: "white"
      },
      {
        kind: "checklist",
        eyebrow: "Before a Verification Review",
        title: "Send the meter and operating details",
        bullets: [
          "Liquid and expected density or composition",
          "Meter type, pipe size and connection",
          "Minimum, normal and maximum flow",
          "Pressure and temperature",
          "Power supply and output signal",
          "Required test points and report expectation"
        ],
        tone: "soft"
      }
    ],
    relatedEyebrow: "Related Test Capabilities",
    relatedHeading: "See how Velomac connects flow and disturbance testing",
    cta: {
      title: "Discuss the meter size and required verification points.",
      text: "Share the liquid, meter type, connection, flow range and the operating points that need to be reviewed."
    }
  },
  {
    slug: "vibration-measurement-test-system",
    categoryId: "testing-calibration",
    heroIntroduction:
      "The in-house system applies controlled airflow and mechanical disturbance at the same time, then records vibration and meter outputs so behavior can be reviewed against a defined test condition.",
    heroImage: {
      src: "/images/technology/vibration-test-system-photo.jpg",
      alt: "Real Velomac vibration measurement test system with vortex flowmeter and vibration motor",
      fit: "cover",
      caption: "Real in-house airflow and vibration test setup."
    },
    facts: [
      { label: "Applied variables", value: "Airflow + vibration" },
      { label: "Coordination", value: "PLC controlled" },
      { label: "Data collection", value: "Real-time" },
      { label: "Representative program", value: "Approx. 1g" }
    ],
    modules: [
      {
        kind: "cards",
        eyebrow: "What the System Evaluates",
        title: "Observe the meter while the disturbance is known",
        items: [
          { title: "Static false output", text: "Check whether vibration creates a flow signal with no airflow." },
          { title: "Dynamic variation", text: "Observe frequency and flow output under airflow and vibration." },
          { title: "Mode comparison", text: "Compare signal-processing states under the same program." }
        ],
        tone: "white"
      },
      {
        kind: "split",
        eyebrow: "Test-System Structure",
        title: "Airflow, disturbance and sensing on one platform",
        bullets: [
          "Blower establishes the airflow path",
          "Electric regulating valve sets the flow condition",
          "Vortex flowmeter is mounted in the test line",
          "Vibration motor applies mechanical disturbance",
          "Vibration sensor is positioned near the sensing area",
          "PLC and software coordinate control and collection"
        ],
        image: {
          src: "/images/technology/vibration-test-system-diagram.png",
          alt: "Labeled structure diagram of the vibration measurement test system",
          fit: "contain",
          caption: "Structure drawing showing the meter, vibration source, sensor, inlet and support structure."
        },
        tone: "blue"
      },
      {
        kind: "steps",
        eyebrow: "Test Process",
        title: "A compact controlled sequence",
        items: [
          { title: "1. Establish airflow", text: "Start the blower and set the regulating valve." },
          { title: "2. Stabilize the point", text: "Confirm the required flow condition." },
          { title: "3. Apply disturbance", text: "Run the vibration motor at the defined condition." },
          { title: "4. Collect together", text: "Record vibration, flow and equipment status." },
          { title: "5. Compare states", text: "Review static or dynamic behavior against the program." }
        ],
        tone: "white"
      },
      {
        kind: "table",
        eyebrow: "Controlled Conditions",
        title: "Representative anti-vibration test program",
        description:
          "These values describe one recorded program, not the fixed limit of the test system.",
        table: {
          columns: ["Test item", "Recorded condition"],
          rows: [
            ["Vibration", "Approximately 1g three-axis acceleration"],
            ["Duration", "Approximately 5 minutes"],
            ["Static state", "No flow"],
            ["Dynamic state", "Low velocity at approximately 5 m/s"],
            ["Outputs reviewed", "Vibration frequency, instantaneous flow and accumulated flow"]
          ]
        },
        tone: "soft"
      },
      {
        kind: "gallery",
        eyebrow: "Equipment and Data Path",
        title: "Supporting system visuals",
        images: [
          {
            src: "/images/technology/vibration-test-system-main.png",
            alt: "Rendered overview of the vibration measurement test system",
            fit: "contain",
            caption: "System overview showing the meter, vibration sensor and motor."
          },
          {
            src: "/images/technology/vibration-test-system-airflow-loop.png",
            alt: "Airflow-loop diagram for the vibration measurement test system",
            fit: "contain",
            caption: "Airflow loop with regulating valve, vibration devices and blower."
          },
          {
            src: "/images/technology/anti-vibration-static-enabled.jpg",
            alt: "Representative static test record with feature analysis enabled",
            fit: "contain",
            caption: "Representative output screen from a defined anti-vibration program."
          }
        ],
        tone: "white"
      },
      {
        kind: "highlight",
        eyebrow: "Data Collected",
        title: "Relate meter output to the applied condition",
        description:
          "The software interface can display vibration frequency, instantaneous flow, accumulated flow, regulating-valve opening and blower status.",
        result: {
          label: "Review basis",
          value: "Vibration + flow + equipment status"
        },
        tone: "dark"
      },
      {
        kind: "checklist",
        eyebrow: "Technical Review Input",
        title: "Define the expected field disturbance",
        bullets: [
          "Source of vibration",
          "Approximate frequency or acceleration when known",
          "Minimum, normal and maximum flow",
          "Pipe support and installation layout",
          "Static or dynamic test objective",
          "Meter output or signal to be reviewed"
        ],
        tone: "white"
      }
    ],
    relatedEyebrow: "Related Test Capabilities",
    relatedHeading: "Connect the test system to the product development",
    cta: {
      title: "Review the expected mechanical and flow disturbance.",
      text: "Share the vibration source, available vibration data, flow condition, pipe arrangement and the meter output to be reviewed."
    }
  },
  {
    slug: "smart-vortex-upgrade-chemical-pharmaceutical",
    categoryId: "application-engineering",
    heroIntroduction:
      "This application review considers when an existing orifice-plate measurement point may be suited to a vortex alternative, based on pressure loss, operating range, maintenance arrangement and available installation geometry.",
    heroImage: {
      src: "/images/applications/chemical-process-lines.png",
      alt: "Vortex flowmeter installed on a chemical process utility line",
      fit: "cover",
      caption: "A replacement decision depends on the actual process and installation condition."
    },
    facts: [
      { label: "Existing method", value: "Orifice plate" },
      { label: "Review direction", value: "Vortex alternative" },
      { label: "Typical utilities", value: "Steam, water, gas" }
    ],
    modules: [
      {
        kind: "cards",
        eyebrow: "Existing Situation",
        title: "Why an established measurement point may be reviewed",
        items: [
          {
            title: "Permanent pressure loss",
            text: "The restriction can increase the work required from pumps, compressors or boilers."
          },
          {
            title: "Usable operating range",
            text: "Changing batch and utility loads can move below the practical range of the existing setup."
          },
          {
            title: "Impulse-line maintenance",
            text: "Tapping points, impulse lines and associated hardware add service work."
          },
          {
            title: "Installation geometry",
            text: "The current straight run, pipe stress and maintenance access must be checked."
          }
        ],
        tone: "soft"
      },
      {
        kind: "checklist",
        eyebrow: "Upgrade Assessment",
        title: "Review the real operating envelope first",
        description:
          "Pipe size alone is not enough to decide whether an orifice-to-vortex change is suitable.",
        bullets: [
          "Medium and composition",
          "Minimum, normal and maximum flow",
          "Operating and design pressure",
          "Operating and design temperature",
          "Pipe size and available straight run",
          "Vibration and upstream disturbance",
          "Installation space and maintenance access",
          "Required output and compensation",
          "Wetted material and sanitary requirements"
        ],
        tone: "white"
      },
      {
        kind: "split",
        eyebrow: "Proposed Measurement Direction",
        title: "Evaluate the vortex option against the existing assembly",
        description:
          "A vortex meter removes the separate impulse-line arrangement, but it still needs suitable flow, straight pipe, vibration control and media conditions.",
        bullets: [
          "Check the minimum usable vortex velocity",
          "Review permanent pressure-loss difference",
          "Confirm temperature and pressure compensation needs",
          "Check condensate behavior, orientation and drainability",
          "Keep the existing method when the operating condition favors it"
        ],
        image: {
          src: "/images/applications/energy-loss-visibility.png",
          alt: "Industrial utility line used for pressure-loss and energy review",
          fit: "cover",
          caption: "Pressure-loss review is one part of the upgrade decision."
        },
        tone: "blue"
      },
      {
        kind: "table",
        eyebrow: "Comparison Basis",
        title: "Before and upgrade review points",
        description:
          "These values describe the reviewed operating basis. Actual results depend on the existing orifice design and process condition.",
        table: {
          columns: ["Review item", "Existing orifice basis", "Vortex review basis"],
          rows: [
            ["Permanent pressure loss", "8–13 times the compared vortex meter", "Lower restriction in the reviewed comparison"],
            ["Rangeability", "1:3 nominal; 1:5 stated operating coverage", "Liquid 1:30 in the reviewed comparison"],
            ["Straight pipe", "20D upstream; 10D downstream", "10D upstream; 5D downstream in the reviewed comparison"],
            ["Assembly", "Pressure taps, impulse lines and DP transmitter", "No separate impulse-line arrangement"]
          ]
        },
        tone: "dark"
      },
      {
        kind: "gallery",
        eyebrow: "Process Context",
        title: "Installation conditions still control the result",
        images: [
          {
            src: "/images/company/process-installation.png",
            alt: "Industrial process pipeline with flow instrumentation and available installation geometry",
            fit: "cover",
            caption: "Review pipe geometry, disturbance and maintenance access."
          },
          {
            src: "/images/applications/high-vibration-pipelines.png",
            alt: "Industrial process pipeline where supports, disturbance and vibration require review",
            fit: "cover",
            caption: "Confirm disturbance, supports and available straight pipe."
          }
        ],
        tone: "white"
      },
      {
        kind: "cards",
        eyebrow: "Application Takeaways",
        title: "A replacement is conditional, not automatic",
        items: [
          { title: "Keep the baseline", text: "Record the existing orifice, transmitter and impulse-line arrangement." },
          { title: "Use real flow data", text: "Review minimum, normal and maximum operating flow." },
          { title: "Check the pipe", text: "Confirm straight run, supports, vibration and available space." },
          { title: "Verify materials", text: "Review wetted material, surface and cleaning requirements." }
        ],
        tone: "soft"
      }
    ],
    relatedEyebrow: "Related Measurement Projects",
    relatedHeading: "Explore sensing and validation work behind the review",
    cta: {
      title: "Send the current measurement arrangement for an upgrade review.",
      text: "Include the existing orifice data, medium, flow range, pressure, temperature, straight pipe, vibration and output requirement."
    }
  }
];

export function getTechnologyDetailPage(slug: string) {
  return detailPages.find((page) => page.slug === slug);
}
