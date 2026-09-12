import buzzImg from "./assets/images/buzz.png";
import liteImg from "./assets/images/lite.png";
import buzzContainerImg from "./assets/images/buzz-blue-container.png";
import buzzLowdeckImg from "./assets/images/buzz-white-lowdeck.png";
import buzzFlatbedImg from "./assets/images/buzz-red-flatbed.png";
import liteContainerImg from "./assets/images/lite-blue-container.png";
import liteLowdeckImg from "./assets/images/lite-white-lowdeck.png";
import liteFlatbedImg from "./assets/images/lite-cream-flatbed.png";
import clusterImg from "./assets/images/cluster.png";
import gpsImg from "./assets/images/gps.png";
import appImg from "./assets/images/app.png";
import webImg from "./assets/images/web.png";
import keyImg from "./assets/images/key.jpg";

/**
 * data.js – Central data store for all AltEner landing page content
 * Keeps content separate from components for maintainability
 */

// Vite requires local images to be imported as modules

// Vehicle variant images

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Models", href: "#models" },
  { label: "Features", href: "#connectivity" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" }, 
  { label: "Contact", href: "#contact" },
];

const heroSlides = [
  {
    id: 1,
    heading: "Powering India's Last-Mile Revolution",
    subtext:
      "Zero-emission electric 3-wheelers engineered for maximum payload, minimum cost, and unmatched reliability.",
    cta: "Book Now",
    image: buzzImg,
  },
  {
    id: 2,
    heading: "Built for Business. Driven by Innovation.",
    subtext:
      "Advanced IoT telematics, keyless entry, and intelligent fleet management—all in one rugged platform.",
    cta: "Book Now",
    image: liteImg,
  },
];

const vehicleModels = [
  {
    id: "buzz",
    name: "BUZZ",
    tagline: "Heavy-duty hauler for demanding routes",
    variants: [
      {
        id: "buzz-container",
        name: "Container",
        image: buzzContainerImg,
        specs: {
          range: "120–140 km",
          payload: "550 kg",
          charging: "5–6 hrs",
          topSpeed: "30 / 50 km/h",
          battery: "11.8 kWh",
          motor: "9 kW PMSM",
          voltage: "72V LFP",
        },
        features: [
          "9 kW IP67 PMSM Motor (all-weather sealed)",
          "7.0\" Colour Touch LCD",
          "dedicated 4.3 inch display with reverse camera",
          "Keyless Entry with encrypted immobilizer",
          "2-Speed modes (Eco · Boost · Auto mode)",
          "11.8 kWh LFP battery",
          "10–12 inch heavy-duty tyres for rough terrain",
          "Front Disc brake + Regenerative braking",
        ],
      },
      {
        id: "buzz-lowdeck",
        name: "Low Deck",
        image: buzzLowdeckImg,
        specs: {
          range: "120–140 km",
          payload: "550 kg",
          charging: "5–6 hrs",
          topSpeed: "30 / 50 km/h",
          battery: "11.8 kWh",
          motor: "9 kW PMSM",
          voltage: "72V LFP",
        },
        features: [
          "9 kW IP67 PMSM Motor (all-weather sealed)",
          "7.0\" Colour Touch LCD",
          "Keyless Entry with encrypted immobilizer",
          "2-Speed modes (Eco · Boost · Auto)",
          "11.8 kWh LFP battery",
          "10–12 inch heavy-duty tyres for rough terrain",
          "Hill Hold Assist + Reverse Mode",
        ],
      },
      {
        id: "buzz-flatbed",
        name: "Flat Bed",
        image: buzzFlatbedImg,
        specs: {
          range: "120–140 km",
          payload: "550 kg",
          charging: "5–6 hrs",
          topSpeed: "30 / 50 km/h",
          battery: "11.8 kWh ",
          motor: "9 kW PMSM",
          voltage: "72V LFP",
        },
        features: [
          "9 kW IP67 PMSM Motor (all-weather sealed)",
          "7.0\" Colour Touch LCD",
          "Keyless Entry with encrypted immobilizer",
          "2-Speed modes (Eco · Boost · Auto)",
          "11.8 kWh LFP battery",
          "10–12 inch heavy-duty tyres for rough terrain",
          "OTA Updates + 4G LTE Remote Diagnostics",
        ],
      },
    ],
  },
  {
    id: "lite",
    name: "LITE",
    tagline: "Nimble performer for urban deliveries",
    variants: [
      {
        id: "lite-container",
        name: "Container",
        image: liteContainerImg,
        specs: {
          range: "100–120 km",
          payload: "350 kg",
          charging: "4–5 hrs",
          topSpeed: "45 km/h",
          battery: "6.5 kWh",
          motor: "6 kW PMSM",
          voltage: "72V LFP",
        },
        features: [
          "6 kW PMSM efficient motor",
          "5.0\" digital instrument cluster",
          "dedicated 4.3 inch display with reverse camera",
          "Physical key",
          "single speed automatic",
          "6.5 kWh LFP battery",
          "8-inch city-optimized tyres",
          "Front & Rear drum brakes",
        ],
      },
      {
        id: "lite-lowdeck",
        name: "Low Deck",
        image: liteLowdeckImg,
        specs: {
          range: "100–120 km",
          payload: "350 kg",
          charging: "4–5 hrs",
          topSpeed: "45 km/h",
          battery: "6.5 kWh",
          motor: "6 kW PMSM",
          voltage: "72V LFP",
        },
        features: [
          "6 kW PMSM efficient motor",
          "5.0\" digital instrument cluster",
          "Physical key",
          "single speed automatic",
          "6.5 kWh LFP battery",
          "8-inch city-optimized tyres",
          "Low-floor loading for quick cargo ops",
        ],
      },
      {
        id: "lite-flatbed",
        name: "Flat Bed",
        image: liteFlatbedImg,
        specs: {
          range: "100–120 km",
          payload: "350 kg",
          charging: "4–5 hrs",
          topSpeed: "45 km/h",
          battery: "6.5 kWh",
          motor: "6 kW PMSM",
          voltage: "72V LFP",
        },
        features: [
          "6 kW PMSM efficient motor",
          "5.0\" digital instrument cluster",
          "Physical key",
          "single speed automatic",
          "6.5 kWh LFP battery",
          "8-inch city-optimized tyres",
          "Open flatbed for versatile cargo types",
        ],
      },
    ],
  },
];

const featureHighlights = [
  {
    icon: "BatteryChargingFull",
    title: "Extended Range",
    description:
      "High-efficiency transport with 120 - 140 km range on a single charge, powered by a robust 72V battery system.",
    image: liteLowdeckImg,
  },
  {
    icon: "LocalShipping",
    title: "Optimized Payload",
    description:
      "Built for heavy-duty logistics: Carry up to 550 kg with BUZZ or 350 kg with the nimble LITE variant.",
    image: buzzContainerImg,
  },
  {
    icon: "BatteryChargingFull",
    title: "Reliable Charging",
    description:
      "Standard 25A charging delivers 0–80% capacity in 5–6 hours, ensuring your fleet is ready for the next shift.",
    image: buzzImg,
  },
  {
    icon: "Speed",
    title: "Dual-Mode Performance",
    description:
      "Three drive modes for BUZZ: Eco (30 km/h), Boost (50 km/h), and Auto — smart switching between modes for optimal performance.",
    image: liteImg,
  },
];

const technologyData = [
  {
    icon: "Battery6Bar",
    title: "LiFePO4 (LFP) Battery",
    description:
      "The safest battery chemistry with 2,000+ charge cycles. 11.68 – 12.8 kWh capacity ensures reliable power delivery for long-distance hauling.",
  },
  {
    icon: "SettingsSuggest",
    title: "IP67 PMSM Motor",
    description:
      "9.5 kW peak power motor, fully sealed to IP67 standards. Delivers high torque and efficiency even in extreme weather conditions.",
  },
  {
    icon: "Key",
    title: "Immobilizer System",
    description:
      "Advanced start system with encrypted immobilizer for maximum security against unauthorized access.",
  },
  {
    icon: "Bluetooth",
    title: "Dual-Speed Gearbox",
    description:
      "Industry-first 2-speed gearbox with 14.96 and 8.06 ratios, optimizing performance for both steep inclines and high-speed cruising.",
  },
  {
    icon: "Router",
    title: "4G LTE Telematics",
    description:
      "Real-time GPS tracking (GNSS), remote diagnostics, and OTA software updates for comprehensive fleet management.",
  },
  {
    icon: "Dashboard",
    title: '7.0" Touch LCD Display',
    description:
      "Vivid touch-enabled display for real-time telemetry, reverse camera feed, and interactive vehicle diagnostics.",
  },
];

const techEcosystem = [
  {
    id: "cluster",
    size: "large",
    icon: "Dashboard",
    title: "7\" Touch LCD",
    description:
      "Interactive high-resolution display with real-time telemetry and integrated reverse camera support.",
    image: liteImg, 
  },
  {
    id: "app",
    size: "tall",
    icon: "PhoneIphone",
    title: "4G LTE + GNSS",
    description:
      "Seamless connectivity for live tracking, geofencing, and remote diagnostics via our fleet portal.",
    image: buzzImg, 
  },
  {
    id: "telematics",
    size: "square",
    icon: "Router",
    title: "OTA Updates",
    description: "Future-proof vehicle with remote software improvements.",
  },
  {
    id: "ble",
    size: "square",
    icon: "Bluetooth",
    title: "2-Speed Gearbox",
    description:
      "Optimized gear ratios for superior gradeability and top speed.",
  },
  {
    id: "security",
    size: "wide",
    icon: "VpnKey",
    title: "Immobilizer",
    description: "Secure start system ensures your vehicle stays protected.",
  },
  {
    id: "charger",
    size: "wide",
    icon: "EvStation",
    title: "On-Board 25A Charger",
    description: "Fast ~1.5 hour charging with standard CEE socket compatibility.",
  },
];

const detailedSpecs = {
  buzz: [
    {
      id: "motor",
      title: "Motor & Drivetrain",
      icon: "ElectricBolt",
      specs: [
        { label: "Motor Type", value: "PMSM (Permanent Magnet Synchronous)" },
        { label: "Peak Power", value: "9 kW, IP67 Sealed" },
        { label: "Transmission", value: "2-Speed Gearbox" },
        { label: "Gear Ratios", value: "14.96 / 8.06" },
        { label: "Drive Modes", value: "Eco (30 km/h) / Boost (50 km/h) / Auto / Rev" },
        { label: "Cooling", value: "Active Controller Cooling" },
        { label: "Gradeability", value: "26.5%" },
      ],
    },
    {
      id: "battery",
      title: "Battery & Charging",
      icon: "BatteryChargingFull",
      specs: [
        { label: "Battery Chemistry", value: "LiFePO4 (LFP)" },
        { label: "Capacity", value: "11.8 kWh" },
        { label: "System Voltage", value: "72V" },
        { label: "Onboard Charger", value: "25A" },
        { label: "Charge Time (0–80%)", value: "5–6 hours" },
        { label: "Battery Cycles", value: "2,000+" },
      ],
    },
    {
      id: "performance",
      title: "Performance & Range",
      icon: "Speed",
      specs: [
        { label: "Range", value: "120–140 km (single charge)" },
        { label: "Top Speed (Eco)", value: "30 km/h" },
        { label: "Top Speed (Boost)", value: "50 km/h" },
        { label: "Payload Capacity", value: "550 kg" },
        { label: "Gross Weight", value: "1,100 kg" },
        { label: "Regen Braking", value: "Yes" },
      ],
    },
    {
      id: "chassis",
      title: "Chassis, Suspension & Brakes",
      icon: "SettingsSuggest",
      specs: [
        { label: "Frame", value: "High-strength steel" },
        { label: "Front Suspension", value: "Twin Shock Absorbers + Springs" },
        { label: "Rear Suspension", value: "Rubber Damping + Shock Absorbers" },
        { label: "Front Brake", value: "Disc Brake" },
        { label: "Rear Brake", value: "Drum Brake" },
        { label: "Tyre Size", value: "10–12 inch heavy-duty" },
      ],
    },
    {
      id: "smarttech",
      title: "Smart Tech & Safety",
      icon: "Router",
      specs: [
        { label: "Display", value: '7.0" Colour Touch LCD' },
        { label: "Start System", value: "Keyless Entry + Immobilizer" },
        { label: "Connectivity", value: "4G LTE + GNSS (GPS)" },
        { label: "Reverse Camera", value: 'Yes · Dedicated 4.3" screen' },
        { label: "OTA Updates", value: "Yes (remote software)" },
        { label: "Fleet Management", value: "Live GPS, Geofencing, Diagnostics" },
        { label: "Hill Hold Assist", value: "Yes" },
      ],
    },
  ],
  lite: [
    {
      id: "motor",
      title: "Motor & Drivetrain",
      icon: "ElectricBolt",
      specs: [
        { label: "Motor Type", value: "PMSM (Permanent Magnet Synchronous)" },
        { label: "Peak Power", value: "6 kW, IP67 Sealed" },
        { label: "Transmission", value: "Single-Speed Automatic" },
        { label: "Gear Changing", value: "Not required" },
        { label: "Top Speed", value: "45 km/h" },
        { label: "Cooling", value: "Active Controller Cooling" },
      ],
    },
    {
      id: "battery",
      title: "Battery & Charging",
      icon: "BatteryChargingFull",
      specs: [
        { label: "Battery Chemistry", value: "LiFePO4 (LFP)" },
        { label: "Capacity", value: "6.5 kWh" },
        { label: "System Voltage", value: "72V" },
        { label: "Onboard Charger", value: "25A" },
        { label: "Charge Time (0–80%)", value: "4–5 hours" },
        { label: "Battery Cycles", value: "2,000+" },
      ],
    },
    {
      id: "performance",
      title: "Performance & Range",
      icon: "Speed",
      specs: [
        { label: "Range", value: "100–120 km (single charge)" },
        { label: "Top Speed", value: "45 km/h" },
        { label: "Payload Capacity", value: "350 kg" },
        { label: "Gross Weight", value: "1,100 kg" },
        { label: "Regen Braking", value: "Yes" },
      ],
    },
    {
      id: "chassis",
      title: "Chassis, Suspension & Brakes",
      icon: "SettingsSuggest",
      specs: [
        { label: "Frame", value: "High-strength steel" },
        { label: "Front Suspension", value: "Twin Shock Absorbers + Springs" },
        { label: "Rear Suspension", value: "Rubber Damping + Shock Absorbers" },
        { label: "Front Brake", value: "Drum Brake" },
        { label: "Rear Brake", value: "Drum Brake" },
        { label: "Tyre Size", value: "8 inch city" },
      ],
    },
    {
      id: "smarttech",
      title: "Smart Tech & Safety",
      icon: "Router",
      specs: [
        { label: "Display", value: '5.0" Digital Instrument Cluster' },
        { label: "Start System", value: "Physical Key" },
        { label: "Connectivity", value: "4G LTE + GNSS (GPS)" },
        { label: "Reverse Camera", value: 'Yes · Dedicated 4.3" screen (Container)' },
        { label: "OTA Updates", value: "Yes (remote software)" },
        { label: "Fleet Management", value: "Live GPS, Geofencing, Diagnostics" },
      ],
    },
  ],
};

const statsData = [
  {
    value: "₹1.2/km",
    label: "Running Cost",
    detail: "vs ₹5+/km for petrol autos",
    icon: "Savings",
  },
  {
    value: "120 - 140 km",
    label: "Max Range",
    detail: "On a single charge",
    icon: "Route",
  },
  {
    value: "80%",
    label: "CO₂ Reduction",
    detail: "Compared to ICE vehicles",
    icon: "Eco",
  },
  {
    value: "2,000+",
    label: "Battery Cycles",
    detail: "Long-lasting performance",
    icon: "BatteryChargingFull",
  },
  {
    value: "550 kg",
    label: "Payload Capacity",
    detail: "Heavy-duty BUZZ model",
    icon: "FitnessCenter",
  },
  {
    value: "11.8 kWh",
    label: "Battery Power",
    detail: "High-voltage 72V system",
    icon: "ElectricBolt",
  },
];

const faqData = [
  {
    question: "What is the range of AltEner electric 3-wheelers?",
    answer:
      "Our vehicles offer a range of 100–140 km on a single charge depending on the model, payload, and road conditions. The BUZZ series delivers up to 140 km of range.",
  },
  {
    question: "How long does it take to fully charge?",
    answer:
      "A standard 25A charge takes 5–6 hours to reach 80% capacity. Our onboard charging system is optimized for battery longevity and safety.",
  },
  {
    question: "What is the payload capacity?",
    answer:
      "The BUZZ series supports a payload of 550 kg and the LITE series up to 350 kg, making them ideal for a wide range of urban logistics.",
  },
  {
    question: "Is there a warranty on the battery?",
    answer:
      "Yes. All AltEner vehicles come with a 3-year / 2,000-cycle warranty on the high-voltage 72V LFP battery pack.",
  },
  {
    question: "Do you offer fleet solutions?",
    answer:
      "Absolutely. Our Advanced Fleet Management Suite provides live GPS tracking, driver analytics, remote diagnostics, and OTA updates.",
  },
  {
    question: "Where can I service my AltEner vehicle?",
    answer:
      "We have authorized service centers across major Indian cities and provide remote diagnostic support for quick troubleshooting.",
  },
  {
    question: "Can I book a test drive?",
    answer:
      'Yes! Click "Book Now" at the top of this page or fill in the contact form below, and our team will arrange a test drive at your location.',
  },
];

const connectivityData = [
  {
    id: "cluster",
    label: "Smart Display",
    icon: "Dashboard",
    title: "Smart Instrument Display",
    image: clusterImg,
    features: [
      "BUZZ: 7.0\" colour touch LCD — fully interactive",
      "LITE: 5.0\" digital instrument cluster",
      "Live speed, SoC (battery %), and range display",
      "Fault codes and maintenance reminders at a glance",
      "Dedicated 4.3\" reverse camera screen (Container variants)",
    ],
  },
  {
    id: "lte-gps",
    label: "4G LTE + GPS",
    icon: "Router",
    title: "4G LTE + GNSS Live Tracking",
    image: gpsImg,
    features: [
      "GNSS-based real-time vehicle location on map",
      "Geofencing alerts when vehicle leaves defined zones",
      "4G LTE data for uninterrupted remote connectivity",
      "OTA (Over-the-Air) software updates via network",
      "Trip distance, idle time, and route history logs",
    ],
  },
  {
    id: "app",
    label: "Driver App",
    icon: "PhoneIphone",
    title: "AltEner Mobile App",
    image: appImg,
    features: [
      "Real-time battery % and estimated range to empty",
      "Remote immobilizer control (anti-theft)",
      "Driver trip logs, distance covered, and score",
      "One-tap SOS and breakdown assistance request",
      "Push alerts for theft, geofence breach, or faults",
    ],
  },
  {
    id: "web-app",
    label: "Fleet Portal",
    icon: "DesktopWindows",
    title: "Fleet Management Portal",
    image: webImg,
    features: [
      "Live map with all fleet vehicles in one view",
      "Per-driver efficiency scores and behavior reports",
      "Idle time monitoring and energy cost analytics",
      "Scheduled maintenance tracking and service history",
      "Export reports (CSV / PDF) for accounts & compliance",
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: "VpnKey",
    title: "Anti-Theft & Access Control",
    image: keyImg,
    features: [
      "BUZZ: Keyless entry with encrypted immobilizer",
      "LITE: Physical key with standard ignition lock",
      "Remote immobilization via app or fleet portal",
      "Real-time movement alerts when vehicle is parked",
      "Driver ID logging — every trip is attributed and tracked",
    ],
  },
];

const aboutContent = {
  title: "Built in India. Built for India.",
  paragraphs: [
    "AltEner is on a mission to decarbonise last-mile logistics across India. We design, engineer, and manufacture electric three-wheelers that deliver outstanding performance at the lowest total cost of ownership.",
    "Our vehicles are purpose-built for Indian roads—tough, reliable, and backed by cutting-edge IoT telematics. From single-vehicle operators to enterprise fleets, AltEner powers businesses that move the nation.",
  ],
  vision:
    "To make electric commercial mobility accessible, affordable, and intelligent—accelerating India's transition to a zero-emission freight ecosystem.",
  mission:
    "We engineer world-class EV platforms that combine robust hardware, smart software, and exceptional after-sales support to help businesses save money and the planet.",
};

export {
  navLinks,
  heroSlides,
  vehicleModels,
  featureHighlights,
  technologyData,
  techEcosystem,
  detailedSpecs,
  statsData,
  faqData,
  aboutContent,
  connectivityData
};

