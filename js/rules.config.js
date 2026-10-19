/**
 * MESSAGE INSPECTOR — RULE CONFIGURATION
 * 
 * Transparent, deterministic heuristic rules for educational inspection.
 * NOTE: This is NOT an AI model and does NOT determine whether a message is safe.
 * Threat actors can easily craft deceptive messages that bypass keyword heuristics.
 */

export const inspectorRules = [
  {
    id: "RULE-URGENCY-01",
    name: "Artificial Time Pressure & Urgency",
    severity: "HIGH",
    category: "Psychological Coercion",
    explanation: "Attackers commonly impose urgent deadlines (e.g. 'within 15 minutes', 'immediately', 'action required') to provoke panic and induce rushed compliance before the recipient can verify authenticity.",
    match: (text) => {
      const regex = /\b(immediate(?:ly)?|urgent(?:ly)?|within (?:[0-9]+|\b(?:twenty[- ]four|forty[- ]eight|12|24|48)\b) (?:hours|hrs|minutes|mins)|account will be (?:closed|suspended|locked|terminated)|suspended in|act now|immediate action required|final warning|last notice)\b/i;
      const match = text.match(regex);
      return match ? { matchedText: match[0], position: match.index } : null;
    }
  },
  {
    id: "RULE-CREDENTIALS-02",
    name: "Direct Credential / Secret Solicitation",
    severity: "HIGH",
    category: "Credential Harvesting",
    explanation: "Requests urging the user to submit passwords, 2FA/MFA security codes, PIN numbers, or API keys directly via email or an unverified link are a classic phishing signature.",
    match: (text) => {
      const regex = /\b(verify your (?:password|identity|account|credentials)|confirm your (?:password|pin|secret)|enter your (?:login|password|credentials|mfa code|otp)|reset your password immediately|send your credentials|update your login)\b/i;
      const match = text.match(regex);
      return match ? { matchedText: match[0], position: match.index } : null;
    }
  },
  {
    id: "RULE-SUSP-URL-03",
    name: "Suspicious or Misleading URL Patterns",
    severity: "HIGH",
    category: "Domain Spoofing",
    explanation: "Matches raw IP address links, non-standard top-level domains (.biz, .top, .xyz, .click, .work, .su, .ru), or hyphenated fake brand domains that mimic trusted organizations.",
    match: (text) => {
      // Raw IP URL or suspicious TLD or brand hyphenation in URL
      const ipRegex = /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:[^\s]*)/i;
      const ipMatch = text.match(ipRegex);
      if (ipMatch) return { matchedText: ipMatch[0], detail: "Raw IP address used as URL host" };

      const suspTldRegex = /https?:\/\/[a-zA-Z0-9-.]+\.(?:biz|xyz|top|click|fit|work|gq|cf|ml|su|rest|hair|live)\b[^\s]*/i;
      const tldMatch = text.match(suspTldRegex);
      if (tldMatch) return { matchedText: tldMatch[0], detail: "Suspicious, high-risk top-level domain" };

      const brandSpoof = /https?:\/\/[a-zA-Z0-9-]*(?:paypal|google|microsoft|apple|amazon|netflix|bank|login|auth|portal|support)-[a-zA-Z0-9-]*\.[a-z]{2,}[^\s]*/i;
      const brandMatch = text.match(brandSpoof);
      if (brandMatch) return { matchedText: brandMatch[0], detail: "Hyphenated spoof domain mimicking a known service" };

      return null;
    }
  },
  {
    id: "RULE-AUTHORITY-04",
    name: "Executive / Financial Impersonation Hints",
    severity: "MEDIUM",
    category: "Social Engineering",
    explanation: "Messages claiming to originate from executive roles (CEO, CFO, Director) demanding discrete wire transfers, gift card purchases, or immediate confidential payroll changes without verbal confirmation.",
    match: (text) => {
      const regex = /\b(?:(?:ceo|cfo|director|president|executive) (?:wire|transfer|payment|request|memo)|wire transfer immediately|send wire|purchase (?:apple|amazon|google play|steam) gift cards|confidential wire|update vendor banking|change direct deposit details)\b/i;
      const match = text.match(regex);
      return match ? { matchedText: match[0], position: match.index } : null;
    }
  },
  {
    id: "RULE-PRIZE-05",
    name: "Unsolicited Financial or Prize Lures",
    severity: "MEDIUM",
    category: "Advance-Fee / Prize Scam",
    explanation: "Promises of free rewards, unanticipated inheritances, lottery winnings, or unexpected cash bonuses designed to lure the recipient into clicking or disclosing personal banking info.",
    match: (text) => {
      const regex = /\b(you(?:'ve| have) won|selected to receive|claim your (?:gift card|reward|prize|\$|voucher)|free (?:gift card|bonus|payout)|exclusive prize|claim before midnight|congratulations! you are our lucky winner)\b/i;
      const match = text.match(regex);
      return match ? { matchedText: match[0], position: match.index } : null;
    }
  },
  {
    id: "RULE-ATTACHMENT-06",
    name: "Dangerous File Extension Mentions",
    severity: "CAUTION",
    category: "Malware Delivery",
    explanation: "Direct instructions encouraging opening executable, script, or macro-enabled archive files (.iso, .exe, .scr, .vbs, .js, .xlsm, .bat) commonly used for payload delivery.",
    match: (text) => {
      const regex = /\b(?:open|extract|download|run|review)\s+(?:the\s+)?(?:attached|enclosed)?\s*[a-zA-Z0-9_-]+\.(?:iso|exe|scr|vbs|hta|bat|cmd|xlsm|docm|jar)\b/i;
      const match = text.match(regex);
      return match ? { matchedText: match[0], position: match.index } : null;
    }
  }
];

export const sampleInspectorMessages = [
  {
    label: "Phishing: High Urgency Suspension",
    category: "Malicious Indicator",
    text: "URGENT SECURITY ALERT: Your organization access has been suspended! You must verify your password within 15 minutes at http://portal-auth-security99.biz/login or your account will be permanently closed."
  },
  {
    label: "CEO Fraud: Wire Transfer",
    category: "Social Engineering",
    text: "CONFIDENTIAL MEMO: From Office of the CEO. We are finalizing an expedited acquisition today. Please execute a wire transfer of $24,500 to our external consultant. Update vendor banking details immediately and do not discuss over the phone."
  },
  {
    label: "Scam: Gift Card Lure",
    category: "Lure / Scam",
    text: "Congratulations! You have been selected to receive a free $500 Amazon gift card from customer appreciation. Claim your gift card before midnight at http://192.168.1.105:8080/claim-reward."
  },
  {
    label: "Legitimate: Engineering Sprint Note",
    category: "Clean Baseline",
    text: "Hi team, our sprint retrospective is confirmed for Thursday at 2:00 PM in Conference Room B. Please review the PR backlog and add your talking points to the internal team wiki beforehand. Thanks!"
  }
];
