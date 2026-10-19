/**
 * SITE CONFIGURATION
 * 
 * Edit your real details here. Placeholders are clearly marked.
 * The site will automatically hide any contact/social links that remain
 * as placeholders so no broken or dead links are ever rendered.
 */

export const siteConfig = {
  // Author & Identity
  author: {
    name: "Abhinav",
    displayFallback: "Abhinav",
    role: "1st Year CSE Student",
    education: "B.Tech Computer Science Engineering (1st Year)",
    focus: "Cybersecurity (Core Interest), Hackathons & Hardware",
    statusBadge: "1ST YEAR CSE // CYBERSECURITY CORE // HACKATHON EXPERIMENTS",
    bio: "I am a first-year Computer Science Engineering student with a core focus on cybersecurity. I spend my time building for hackathons, figuring out newer technologies from microcontrollers to AI, and testing how systems break."
  },

  // Site Metadata
  site: {
    title: "Abhinav — Engineering & Security Portfolio",
    description: "Abhinav's engineering and security build log: cybersecurity experiments, hackathon projects, and embedded hardware.",
    wordmark: "ABHINAV",
    url: "https://github.com/Abhiii-14"
  },

  // Social & Contact Links
  contact: {
    github: "https://github.com/Abhiii-14",
    linkedin: "https://www.linkedin.com/in/abhiii21",
    email: "abhiii.sync@gmail.com"
  },

  // Hero Index Strip
  indexStrip: [
    {
      number: "001",
      title: "SafeGuard AI",
      category: "EMBEDDED // IoT",
      status: "HACKATHON BUILD",
      href: "#safeguard"
    },
    {
      number: "002",
      title: "Phishing Detection",
      category: "CYBERSECURITY // AI",
      status: "SECURITY RESEARCH",
      href: "#experiment-002"
    },
    {
      number: "003",
      title: "Web Security Analysis",
      category: "SECURITY // AUDIT",
      status: "LEARNING LAB",
      href: "#experiment-003"
    },
    {
      number: "004",
      title: "Interface Experiments",
      category: "UI // ACCESSIBILITY",
      status: "INTERACTIVE",
      href: "#experiment-004"
    }
  ],

  // Skills in three honest, editable lists (NO proficiency bars, NO percentage meters)
  skills: {
    using: [
      "C / C++ (CSE Foundations)",
      "Python 3 & Automation Scripts",
      "ESP32 DevKit & ESP-IDF v5",
      "Linux / Bash Command Line",
      "Git & GitHub Version Control",
      "JavaScript (ES6 Modules) & Web Basics",
      "Hackathon Rapid Prototyping & Breadboards"
    ],
    learning: [
      "Cybersecurity Fundamentals & Threat Modeling",
      "Network Packet Analysis (Wireshark & TCP/IP)",
      "Web Security (OWASP Top 10 & Sanitization)",
      "PyTorch & Vision Models for Edge Safety",
      "Microcontroller Hardware Buses (UART, SPI, I2C)"
    ],
    nextToExplore: [
      "Binary Exploitation & Buffer Overflows",
      "Hardware Security Basics & Fault Injection",
      "Capture The Flag (CTF) Security Challenges",
      "Assembly / Low-level Architecture (x86/ARM)",
      "TinyML & Model Quantization on Microcontrollers"
    ]
  },

  // Field Notes (clearly marked as PLACEHOLDER entries)
  fieldNotes: [
    {
      id: "note-01",
      number: "01",
      title: "[PLACEHOLDER] Building My First ESP32 Latching Alarm: What Breadboards Taught Me About Race Conditions",
      date: "OCT 2026",
      category: "EMBEDDED SYSTEMS",
      readTime: "4 MIN READ",
      summary: "Documenting mechanical switch bounce, latching logic states in ESP-IDF, and why hardware pull-up resistors matter more than software debounce loops.",
      relatedProject: "001 SafeGuard AI",
      relatedHref: "#safeguard",
      bodyHtml: `
        <p>When I first connected an emergency push button to the ESP32 GPIO, I assumed a simple digital read inside a loop would suffice. Instead, a single physical button press fired up to 14 rapid false interrupts in under 8 milliseconds due to mechanical contact chatter.</p>
        <p>I investigated two remedies: software timer suppression and external RC filtering. In this note, I document why a hardware pull-up with a 100nF ceramic capacitor across the switch contacts provided deterministic latching without consuming MCU cycles.</p>
      `
    },
    {
      id: "note-02",
      number: "02",
      title: "[PLACEHOLDER] Why Keyword Heuristics Fail: Breaking My Own Phishing Rules",
      date: "OCT 2026",
      category: "CYBERSECURITY",
      readTime: "5 MIN READ",
      summary: "An honest breakdown of how trivial character substitutions, zero-width spaces, and conversational context easily evade static regex matching, motivating my research into semantic classification.",
      relatedProject: "002 Phishing Detection",
      relatedHref: "#inspector",
      bodyHtml: `
        <p>While building the Message Inspector experiment, I cataloged standard high-urgency keywords like 'URGENT', 'ACCOUNT SUSPENDED', and 'VERIFY NOW'. Within ten minutes of testing, I was able to craft five deceptive messages that bypassed every single rule simply by replacing Latin glyphs with Cyrillic homoglyphs or wrapping words in polite passive voice.</p>
        <p>Static rules are great for rapid, zero-dependency educational inspection, but real defensive engineering demands multi-layered analysis: SPF/DKIM verification, sender reputation, and semantic anomaly detection.</p>
      `
    },
    {
      id: "note-03",
      number: "03",
      title: "[PLACEHOLDER] Setting Up ESP-IDF v5 on Windows: Terminal Notes & Flash Gotchas",
      date: "OCT 2026",
      category: "DEV ENVIRONMENT",
      readTime: "3 MIN READ",
      summary: "My personal cheat-sheet for CMake configurations, CP2102 driver permissions on Windows 11, and baud rate stability during flash operations.",
      relatedProject: "001 SafeGuard AI",
      relatedHref: "#safeguard",
      bodyHtml: `
        <p>Setting up the native ESP-IDF v5 toolchain outside of visual IDE wrappers was an essential learning curve. Understanding how idf.py interacts with CMake, Ninja, and Python virtual environments cleared up why flasher scripts sometimes hang at <code>Connecting...___...___</code>.</p>
        <p>Holding the BOOT (GPIO0) button during initial sync, strapping pins, and verifying that CP210x COM port drivers are assigned correctly were the three key takeaways from week one.</p>
      `
    }
  ]
};

/**
 * Helper to determine whether a string is still a placeholder.
 * Used across the UI to hide unconfigured personal links.
 */
export function isPlaceholder(val) {
  if (!val) return true;
  const str = String(val).trim();
  return (
    str.includes("[YOUR_") ||
    str.includes("example.com") ||
    str === "" ||
    str === "https://github.com/" ||
    str === "https://linkedin.com/in/"
  );
}
