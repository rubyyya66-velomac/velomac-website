import type { TechnologyDetailPageContent } from "@/content/technologyDetailPages";

export const calibrationDetailPages: TechnologyDetailPageContent[] = [
  {
    slug: "gas-flow-calibration",
    categoryId: "flow-calibration-systems",
    heroLabel: "Gas · Accuracy Class 1.0",
    breadcrumbs: [
      { label: "Technology", href: "/technology" },
      { label: "Flow Calibration Systems", href: "/technology/flow-calibration-systems" },
      { label: "Gas Flow Calibration System" }
    ],
    heroIntroduction:
      "A controlled gas-flow system for calibration and verification across configured operating points.",
    heroImage: {
      src: "/images/technology/calibration/gas-flow-calibration-system.jpg",
      alt: "Gas flow calibration system with multiple controlled comparison lines",
      fit: "cover",
      caption: "Gas-flow calibration system configured for controlled comparison."
    },
    facts: [
      { label: "Medium", value: "Gas" },
      { label: "Supported meter class", value: "Accuracy Class 1.0" },
      { label: "Method", value: "Controlled gas-flow comparison" },
      { label: "Operating approach", value: "Configured operating points" }
    ],
    modules: [
      {
        kind: "cards",
        eyebrow: "System at a Glance",
        title: "Controlled comparison at planned gas-flow points",
        items: [
          {
            title: "Controlled gas-flow conditions",
            text: "Establish the condition required for the planned comparison."
          },
          {
            title: "Configured comparison points",
            text: "Review the meter response at each selected operating point."
          },
          {
            title: "Recorded calibration results",
            text: "Keep each result tied to the meter setup and test point."
          }
        ],
        tone: "white"
      },
      {
        kind: "steps",
        eyebrow: "How the Method Works",
        title: "Four stages from setup to review",
        items: [
          { title: "1. Configure", text: "Install the meter and define the test point." },
          { title: "2. Establish", text: "Bring the system to the required gas-flow condition." },
          { title: "3. Compare", text: "Capture the meter response at the configured point." },
          { title: "4. Review", text: "Record and review the result before continuing." }
        ],
        tone: "blue"
      },
      {
        kind: "checklist",
        eyebrow: "Operating-Point Control",
        title: "Keep every result tied to a planned condition",
        description:
          "The test plan defines the gas-flow conditions and comparison sequence for the meter under review.",
        bullets: [
          "Planned operating points",
          "Stable comparison condition",
          "Recorded result for each point"
        ],
        tone: "white"
      },
      {
        kind: "checklist",
        eyebrow: "Selection Considerations",
        title: "Define the meter and required operating points",
        description:
          "Final suitability is reviewed against the actual meter setup and test condition.",
        bullets: [
          "Meter type and connection",
          "Required operating points",
          "Signal and output",
          "Test medium and conditions"
        ],
        tone: "soft"
      }
    ],
    relatedEyebrow: "Related Calibration Methods",
    relatedHeading: "Compare the liquid calibration routes",
    cta: {
      title: "Define the gas meter and required operating points.",
      text: "Share the meter type, connection, signal and the flow points that need calibration or verification."
    }
  },
  {
    slug: "master-meter-liquid-calibration",
    categoryId: "flow-calibration-systems",
    heroLabel: "Liquid · Accuracy Class 0.5",
    breadcrumbs: [
      { label: "Technology", href: "/technology" },
      { label: "Flow Calibration Systems", href: "/technology/flow-calibration-systems" },
      { label: "Master-Meter Liquid Calibration Method" }
    ],
    heroIntroduction:
      "Liquid flow calibration through controlled circulation and comparison with reference electromagnetic flow meters.",
    heroImage: {
      src: "/images/technology/calibration/water-flow-calibration-system.jpg",
      alt: "Water flow calibration system with reference-meter lines and circulation equipment",
      fit: "cover",
      caption: "Complete liquid calibration system and reference-meter lines."
    },
    facts: [
      { label: "Medium", value: "Liquid" },
      { label: "Supported meter class", value: "Accuracy Class 0.5" },
      { label: "Reference system", value: "Seven Yokogawa electromagnetic flow meters" },
      { label: "Reference-meter class", value: "Better than Class 0.2" },
      { label: "Repeatability", value: "Better than 0.08%" }
    ],
    modules: [
      {
        kind: "steps",
        eyebrow: "How the Method Works",
        title: "Circulate, compare and review",
        items: [
          {
            title: "1. Circulate and stabilize",
            text: "Establish the configured liquid-flow condition."
          },
          {
            title: "2. Compare",
            text: "Compare the meter under test with the selected reference meter."
          },
          {
            title: "3. Record and review",
            text: "Capture both readings at each configured flow point."
          }
        ],
        tone: "white"
      },
      {
        kind: "checklist",
        eyebrow: "Reference Meter System",
        title: "Select the reference line for the configured point",
        description:
          "Seven Yokogawa electromagnetic flow meters provide the reference system for the liquid comparison method.",
        bullets: [
          "Reference line selected for the test condition",
          "Reference and test-meter readings captured together",
          "Comparison reviewed at each planned point"
        ],
        tone: "blue"
      },
      {
        kind: "split",
        eyebrow: "Supporting Equipment",
        title: "Velomac-Developed Liquid Flow Calibration Bench",
        description:
          "An in-house developed platform supporting flow-point adjustment, reference-meter integration and recorded verification.",
        bullets: [
          "Flow-point control",
          "Reference-meter integration",
          "Recorded verification"
        ],
        image: {
          src: "/images/technology/calibration/velomac-developed-liquid-flow-calibration-bench.png",
          alt: "Velomac-developed liquid flow calibration bench in the workshop",
          fit: "contain",
          caption: "In-house developed bench supporting the master-meter method."
        },
        link: {
          label: "View the Calibration Bench",
          href: "/technology/liquid-flow-calibration-bench"
        },
        tone: "white"
      },
      {
        kind: "checklist",
        eyebrow: "Selection Considerations",
        title: "Define the liquid meter and comparison points",
        bullets: [
          "Liquid medium",
          "Meter size and connection",
          "Required Accuracy Class",
          "Planned flow points",
          "Output and recording requirement"
        ],
        tone: "soft"
      }
    ],
    relatedEyebrow: "Related Calibration Methods",
    relatedHeading: "Compare the gas and gravimetric routes",
    cta: {
      title: "Define the liquid meter and planned comparison points.",
      text: "Share the meter type, size, connection, signal and the flow points required for the verification."
    }
  },
  {
    slug: "liquid-flow-calibration-bench",
    categoryId: "flow-calibration-systems",
    breadcrumbs: [
      { label: "Technology", href: "/technology" },
      { label: "Flow Calibration Systems", href: "/technology/flow-calibration-systems" },
      {
        label: "Master-Meter Liquid Calibration",
        href: "/technology/master-meter-liquid-calibration"
      },
      { label: "Velomac-Developed Liquid Flow Calibration Bench" }
    ],
    heroIntroduction:
      "An in-house developed circulation and control platform supporting liquid flow-point adjustment, reference-meter comparison and recorded verification.",
    heroImage: {
      src: "/images/technology/calibration/velomac-developed-liquid-flow-calibration-bench.png",
      alt: "Velomac-developed liquid flow calibration bench in the workshop",
      fit: "contain",
      caption: "Full view of the in-house developed bench used within the master-meter method."
    },
    facts: [
      { label: "Position", value: "Supporting equipment" },
      { label: "Method", value: "Master-meter liquid" },
      { label: "Medium", value: "Liquid" },
      { label: "Development", value: "Velomac in-house" }
    ],
    modules: [
      {
        kind: "cards",
        eyebrow: "Why Velomac Developed the Bench",
        title: "Coordinate the liquid comparison workflow",
        items: [
          {
            title: "Configured control",
            text: "Set and adjust the liquid flow point for the planned comparison."
          },
          {
            title: "Reference integration",
            text: "Connect the selected reference meter to the circulation line."
          },
          {
            title: "Recorded review",
            text: "Collect meter and reference values for result review."
          }
        ],
        tone: "white"
      },
      {
        kind: "split",
        eyebrow: "System Structure",
        title: "Circulation lines, installation points and control",
        bullets: [
          "Liquid circulation control",
          "Test-point adjustment",
          "Reference-meter integration",
          "Instrument installation",
          "Data collection and result review"
        ],
        image: {
          src: "/images/technology/calibration/liquid-calibration-pipeline-array.jpg",
          alt: "Pipeline array on the Velomac-developed liquid calibration bench",
          fit: "cover",
          caption: "Circulation and reference-meter pipeline array."
        },
        tone: "blue"
      },
      {
        kind: "steps",
        eyebrow: "Flow-Point Control",
        title: "Support the comparison at each configured point",
        items: [
          { title: "1. Install", text: "Connect the meter to the selected line." },
          { title: "2. Circulate", text: "Start liquid circulation." },
          { title: "3. Adjust", text: "Set the required flow point." },
          { title: "4. Stabilize", text: "Hold the condition for comparison." },
          { title: "5. Capture", text: "Record meter and reference values." },
          { title: "6. Review", text: "Check the result before continuing." }
        ],
        tone: "white"
      },
      {
        kind: "split",
        eyebrow: "Reference-Meter Connection",
        title: "Link the test meter to the selected reference line",
        description:
          "The bench provides the circulation and connection structure used for master-meter comparison.",
        bullets: [
          "Reference line selected for the test setup",
          "Meter installed at the configured connection point",
          "Reference and test-meter signals captured together"
        ],
        image: {
          src: "/images/technology/calibration/master-meter-installation-area.jpg",
          alt: "Reference-meter and test-meter connection area",
          fit: "cover",
          caption: "Reference and installation area."
        },
        reverse: true,
        tone: "soft"
      },
      {
        kind: "checklist",
        eyebrow: "Data Recording",
        title: "Keep the operating point and result together",
        bullets: [
          "Meter identification",
          "Selected reference line",
          "Configured flow point",
          "Reference-meter value",
          "Meter-under-test value",
          "Result review"
        ],
        tone: "white"
      },
      {
        kind: "gallery",
        eyebrow: "Equipment and Facility Gallery",
        title: "Bench details across the workshop",
        images: [
          {
            src: "/images/technology/calibration/master-meter-pipeline-detail.jpg",
            alt: "Large-diameter pipeline connections on the calibration bench",
            fit: "cover",
            caption: "Pipeline and installation detail."
          },
          {
            src: "/images/technology/calibration/liquid-calibration-bench-control-area.jpg",
            alt: "Control equipment beside the liquid calibration bench",
            fit: "cover",
            caption: "Control area."
          },
          {
            src: "/images/technology/calibration/master-meter-liquid-calibration.jpg",
            alt: "Wide view of the master-meter calibration bench",
            fit: "cover",
            caption: "Bench within the liquid calibration workshop."
          },
          {
            src: "/images/technology/calibration/water-flow-calibration-system.jpg",
            alt: "Full liquid flow calibration system",
            fit: "cover",
            caption: "Facility overview."
          }
        ],
        tone: "blue"
      },
      {
        kind: "highlight",
        eyebrow: "Role within Master-Meter Calibration",
        title: "Supporting equipment, not a fourth calibration method",
        description:
          "The bench operates within the Master-Meter Liquid Calibration Method and supports its circulation, comparison and recording workflow.",
        result: {
          label: "Parent method",
          value: "Master-Meter Liquid Calibration"
        },
        link: {
          label: "Back to Master-Meter Liquid Calibration Method",
          href: "/technology/master-meter-liquid-calibration"
        },
        tone: "dark"
      }
    ],
    relatedEyebrow: "Related Calibration Pages",
    relatedHeading: "Return to the method or compare other routes",
    cta: {
      title: "Discuss the meter setup and required liquid flow points.",
      text: "Share the meter type, connection, signal and the operating points required for comparison."
    }
  },
  {
    slug: "gravimetric-liquid-calibration",
    categoryId: "flow-calibration-systems",
    heroLabel: "Liquid · Accuracy Class 0.3",
    breadcrumbs: [
      { label: "Technology", href: "/technology" },
      { label: "Flow Calibration Systems", href: "/technology/flow-calibration-systems" },
      { label: "Gravimetric Liquid Calibration Method" }
    ],
    heroIntroduction:
      "A mass-based liquid calibration method using METTLER TOLEDO electronic weighing equipment.",
    heroImage: {
      src: "/images/technology/calibration/gravimetric-piping-detail.jpg",
      alt: "Gravimetric liquid calibration collection vessels, piping and weighing displays",
      fit: "contain",
      caption: "Collection vessels, piping and weighing displays used for gravimetric calibration."
    },
    facts: [
      { label: "Medium", value: "Liquid" },
      { label: "Supported meter class", value: "Accuracy Class 0.3" },
      { label: "Method", value: "Gravimetric / weighing comparison" },
      { label: "Scale accuracy", value: "Better than 1/3000" }
    ],
    modules: [
      {
        kind: "steps",
        eyebrow: "How the Method Works",
        title: "Prepare, collect, weigh and compare",
        items: [
          {
            title: "1. Prepare and stabilize",
            text: "Prepare the meter and establish the configured liquid flow."
          },
          {
            title: "2. Collect",
            text: "Direct liquid into the selected vessel for a defined interval."
          },
          {
            title: "3. Weigh",
            text: "Measure the collected liquid mass."
          },
          {
            title: "4. Compare and record",
            text: "Compare the mass-based result with the meter output."
          }
        ],
        tone: "white"
      },
      {
        kind: "split",
        eyebrow: "METTLER TOLEDO Weighing Equipment",
        title: "Four METTLER TOLEDO electronic weighing scales",
        description:
          "The selected scale provides the mass reference for the configured collection interval.",
        bullets: [
          "Scale accuracy better than 1/3000",
          "10 t, 5 t, 600 kg and 150 kg capacities",
          "Integrated collection, timing and data recording"
        ],
        image: {
          src: "/images/technology/calibration/gravimetric-piping-detail.jpg",
          alt: "METTLER TOLEDO gravimetric collection vessels, piping and weighing displays",
          fit: "cover",
          caption: "Collection vessels, piping and weighing displays within the gravimetric system."
        },
        tone: "blue"
      },
      {
        kind: "cards",
        eyebrow: "Weighing Range Selection",
        title: "Four available capacities",
        items: [
          { title: "10 t" },
          { title: "5 t" },
          { title: "600 kg" },
          { title: "150 kg" }
        ],
        tone: "soft"
      },
      {
        kind: "gallery",
        eyebrow: "Facility Evidence",
        title: "Distinct views of collection and weighing equipment",
        images: [
          {
            src: "/images/technology/calibration/gravimetric-weighing-vessel.jpg",
            alt: "Individual gravimetric collection and weighing vessel",
            fit: "cover",
            caption: "Individual collection and weighing vessel."
          },
          {
            src: "/images/technology/calibration/gravimetric-collection-system.jpg",
            alt: "Controlled collection arrangement above the gravimetric vessel",
            fit: "cover",
            caption: "Controlled collection arrangement."
          }
        ],
        tone: "white"
      },
      {
        kind: "checklist",
        eyebrow: "When This Method Is Selected",
        title: "Match the mass reference to the meter requirement",
        bullets: [
          "Liquid medium",
          "Accuracy Class 0.3 requirement",
          "Mass-based reference required",
          "Suitable weighing range available"
        ],
        tone: "soft"
      }
    ],
    relatedEyebrow: "Related Calibration Methods",
    relatedHeading: "Compare the gas and master-meter routes",
    cta: {
      title: "Define the liquid meter and required weighing range.",
      text: "Share the meter type, connection, signal, expected flow points and required test volume."
    }
  }
];
