/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Award,
  Zap,
  Target,
  FileText,
  Copy,
  Check,
  ChevronRight,
  RotateCcw,
  Sliders,
  Sparkles,
  Info,
  Layers,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Play,
  Mail,
  ExternalLink,
  Download
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";
import {
  kohliIPLHistory,
  IPLCareerTotals,
  technicalComparisons,
  threePhaseMechanics,
  kohliMatchPhases,
  analystQuotes,
  CareerStat,
  opponentTacticalData
} from "./data";
import KinematicSnapshots from "./components/KinematicSnapshots";
// @ts-expect-error - image asset imported via Vite compile-time asset pipelines
import kohliChampionsTrophy from "./assets/images/kohli_champions_trophy_1779781795658.png";

// Global console warning interceptor to clear third-party library warning noise (e.g. Recharts defaultProps in React 18)
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const warningMsg = args[0] ? String(args[0]) : "";
    if (
      warningMsg.includes("defaultProps") || 
      warningMsg.includes("suppressContentEditableWarning") ||
      warningMsg.includes("deprecate") ||
      warningMsg.includes("unsafe") ||
      warningMsg.includes("recharts") ||
      warningMsg.includes("Recharts") ||
      warningMsg.includes("XAxis") ||
      warningMsg.includes("YAxis") ||
      warningMsg.includes("findDOMNode")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

const REAL_KOHLI_PHOTO_URL = kohliChampionsTrophy;


export default function App() {
  // Live updates states
  const [liveStats, setLiveStats] = useState(IPLCareerTotals);
  const [lastMatch, setLastMatch] = useState<{
    date: string;
    opponent: string;
    runs: number;
    balls: number;
    strikeRate: number;
    dismissal: string;
    venue: string;
    summary: string;
  } | null>(null);
  const [isLoadingLiveUpdates, setIsLoadingLiveUpdates] = useState(false);
  const [liveUpdatesSource, setLiveUpdatesSource] = useState<string>("Static Initial Database");
  const [liveLastFetched, setLiveLastFetched] = useState<string>("");

  // Real-time toast state
  const [toast, setToast] = useState<{ message: string; subMessage: string; visible: boolean } | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);

  // Using a ref to prevent stale closures inside background setInterval polling loops
  const liveStatsRef = useRef(liveStats);
  useEffect(() => {
    liveStatsRef.current = liveStats;
  }, [liveStats]);

  const fetchLiveUpdates = async (force = false, isBackground = false) => {
    if (!isBackground) {
      setIsLoadingLiveUpdates(true);
    }
    try {
      const url = force ? "/api/kohli-stats?refresh=true" : "/api/kohli-stats";
      const res = await fetch(url);
      if (res.ok) {
        const result = await res.json();
        if (result && result.success && result.data) {
          const data = result.data;

          // Check if stats are changing (e.g. a match completed auto-sync)
          const currentRunsInState = liveStatsRef.current.runs;
          const isStatsUpdated = currentRunsInState !== 0 && data.runs > currentRunsInState;

          setLiveStats({
            matches: data.matches || IPLCareerTotals.matches,
            innings: data.innings || IPLCareerTotals.innings,
            runs: data.runs || IPLCareerTotals.runs,
            average: data.average || IPLCareerTotals.average,
            strikeRate: data.strikeRate || IPLCareerTotals.strikeRate,
            centuries: data.centuries || IPLCareerTotals.centuries,
            fifties: data.fifties || IPLCareerTotals.fifties,
            fours: data.fours || IPLCareerTotals.fours,
            sixes: data.sixes || IPLCareerTotals.sixes,
            highScore: data.highScore || IPLCareerTotals.highScore,
          });

          if (data.lastMatch) {
            setLastMatch(data.lastMatch);
          }
          if (result.source) {
            setLiveUpdatesSource(result.source);
          }
          setLiveLastFetched(new Date().toLocaleTimeString());

          // Trigger screen highlight and smooth toast if a freshly completed match auto-synced
          if (isStatsUpdated) {
            setIsHighlighting(true);
            setTimeout(() => {
              setIsHighlighting(false);
            }, 6000);

            setToast({
              message: "🏏 Live Match Auto-Synced!",
              subMessage: `RCB vs ${data.lastMatch?.opponent || "Opponent"} just completed! Added ${data.lastMatch?.runs || 0} runs to Kohli's IPL career stats.`,
              visible: true
            });

            setTimeout(() => {
              setToast(prev => prev ? { ...prev, visible: false } : null);
            }, 7000);
          }
        }
      }
    } catch (err) {
      console.error("Failed to retrieve live match updates:", err);
    } finally {
      if (!isBackground) {
        setIsLoadingLiveUpdates(false);
      }
    }
  };

  useEffect(() => {
    fetchLiveUpdates(false, false);

    // Active automatic background synchronization polling loop every 10 seconds
    const pollInterval = setInterval(() => {
      fetchLiveUpdates(false, true);
    }, 10000);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  // Navigation / Tab States
  const [activeTab, setActiveTab] = useState<"mechanics" | "statistics" | "strategy" | "briefing">("mechanics");

  // Interactive Mechanics States
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState(0);
  const [modelMode, setModelMode] = useState<"kohli" | "highrisk">("kohli");
  
  // Custom Sliders for biomechanical comparison
  const [customSliders, setCustomSliders] = useState({
    headAngle: 0, // degrees of tilt
    weightBias: 50, // % off-side bias
    batPadGap: 0, // cm of gap
    wristFlexibility: 85 // %
  });

  // Biomechanical Animate Drill States
  const [isDrillAnimating, setIsDrillAnimating] = useState(false);
  const [drillLength, setDrillLength] = useState<"good" | "short" | "full">("good");
  const [drillProgress, setDrillProgress] = useState(0); // 0 to 1

  // 3-second simulation loop using requestAnimationFrame for optimal smoothness
  useEffect(() => {
    let animFrameId: number;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const duration = 3000; // 3 seconds total simulation loop
      const progress = (elapsed % duration) / duration;
      setDrillProgress(progress);
      animFrameId = requestAnimationFrame(tick);
    };

    if (isDrillAnimating) {
      animFrameId = requestAnimationFrame(tick);
    } else {
      setDrillProgress(0);
    }

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isDrillAnimating]);

  // Function to apply preset profiles
  const applyPreset = (preset: "kohli" | "highrisk", phaseIdx = selectedPhaseIdx) => {
    setModelMode(preset);
    if (preset === "kohli") {
      if (phaseIdx === 0) {
        setCustomSliders({
          headAngle: 0,
          weightBias: 50,
          batPadGap: 0,
          wristFlexibility: 85
        });
      } else if (phaseIdx === 1) {
        setCustomSliders({
          headAngle: 4,
          weightBias: 65,
          batPadGap: 2,
          wristFlexibility: 80
        });
      } else {
        setCustomSliders({
          headAngle: 0,
          weightBias: 38,
          batPadGap: 0,
          wristFlexibility: 95
        });
      }
    } else {
      if (phaseIdx === 0) {
        setCustomSliders({
          headAngle: 8,
          weightBias: 65,
          batPadGap: 6,
          wristFlexibility: 70
        });
      } else if (phaseIdx === 1) {
        setCustomSliders({
          headAngle: 18,
          weightBias: 75,
          batPadGap: 12,
          wristFlexibility: 60
        });
      } else {
        setCustomSliders({
          headAngle: 22,
          weightBias: 82,
          batPadGap: 16,
          wristFlexibility: 45
        });
      }
    }
  };

  // Stats Visualizer tab states
  const [statsViewMode, setStatsViewMode] = useState<"career" | "efficiency">("career");
  const [highlightedYear, setHighlightedYear] = useState<number | null>(null);

  // Field/Pitch Strategy Interactive State
  const [selectedBallIndex, setSelectedBallIndex] = useState(0);
  const [activePitchPhase, setActivePitchPhase] = useState(0); // 0: Powerplay, 1: Middle Overs

  // Exporter/Briefing States
  const [briefingOpponent, setBriefingOpponent] = useState("All Teams");
  const [briefingFormat, setBriefingFormat] = useState<"executive" | "social" | "tactical">("executive");
  const [copied, setCopied] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);

  // Dynamic opponent-specific tactical data lookup
  const currentOpponentData = useMemo(() => {
    return opponentTacticalData[briefingOpponent] || opponentTacticalData["All Teams"];
  }, [briefingOpponent]);

  // Handle Copy text safely in iframes/sandboxes
  const handleCopyText = () => {
    if (briefRef.current) {
      const text = briefRef.current.innerText;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
              fallbackCopy(text);
            });
        } else {
          fallbackCopy(text);
        }
      } catch (err) {
        fallbackCopy(text);
      }
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  // Mapping handler for opposing players' names to generic bowler types/descriptions
  const getBowlerType = (threatBowler: string): string => {
    const mapping: Record<string, string> = {
      "Sunil Narine": "Mystery Offbreak/Carrom Spinner",
      "Matheesha Pathirana": "Slingy Yorker Fast-Medium Seamer",
      "Jasprit Bumrah": "Express Pace / Cutters Champion",
      "Yuzvendra Chahal": "Flighted Leg-spin Seer",
      "Pat Cummins": "Right-arm Fast-Medium Leader Seamer",
      "Kuldeep Yadav": "Left-arm Mystery Wrist Spinner",
      "Rashid Khan": "Quick Skidding Legbreak/Googly Spinner",
      "Arshdeep Singh": "Left-arm In-swing Seamer",
      "Ravi Bishnoi": "Quick Legbreak/Googly Spinner",
      "Express Left-Arm / Hard Lengths": "Left-Arm Express Seamer"
    };
    return mapping[threatBowler] || threatBowler;
  };

  // Replace player name occurrences in strategic data for neutrality
  const neutralizeText = (text: string): string => {
    if (!text) return text;
    let result = text;
    
    // Replacement tuples for bowler names
    const replacements: [RegExp, string][] = [
      [/Jasprit Bumrah/gi, "Express Right-arm Seamer"],
      [/Bumrah/gi, "Express Seamer"],
      [/Sunil Narine/gi, "Mystery Spinner"],
      [/Narine/gi, "Mystery Spinner"],
      [/Varun Chakaravarthy/gi, "Mystery Spinner"],
      [/Mitchell Starc/gi, "Left-arm Express Seamer"],
      [/Starc/gi, "Left-arm Seamer"],
      [/Matheesha Pathirana/gi, "Slingy Yorker Specialist"],
      [/Pathirana/gi, "Slingy Yorker Specialist"],
      [/Maheesh Theekshana/gi, "Finger Spinner"],
      [/Theekshana/gi, "Finger Spinner"],
      [/Deepak Chahar/gi, "Outswing Seamer"],
      [/Chahar/gi, "Outswing Seamer"],
      [/Ravindra Jadeja/gi, "Left-arm orthodox spinner"],
      [/Jadeja/gi, "orthodox spinner"],
      [/Yuzvendra Chahal/gi, "Leg-spin Bowler"],
      [/Chahal/gi, "Leg-spin Bowler"],
      [/Sandeep Sharma/gi, "Knuckleball Bowler"],
      [/Sandeep/gi, "Knuckleball Bowler"],
      [/Ravichandran Ashwin/gi, "Carrom Ball Bowler"],
      [/Ashwin/gi, "Spinner"],
      [/Pat Cummins/gi, "Back-of-Length Seamer"],
      [/Cummins/gi, "Back-of-Length Seamer"],
      [/T\. Natarajan/gi, "Yorker Seamer"],
      [/Natarajan/gi, "Yorker Seamer"],
      [/Bhuvneshwar Kumar/gi, "Swing Specialist"],
      [/Bhuvi/gi, "Swing Specialist"],
      [/Kuldeep Yadav/gi, "Left-arm Wrist Spinner"],
      [/Kuldeep/gi, "Left-arm Wrist Spinner"],
      [/Axar Patel/gi, "Orthodox Spinner"],
      [/Axar/gi, "Orthodox Spinner"],
      [/Rashid Khan/gi, "Elite Legbreak/Googly Spinner"],
      [/Rashid/gi, "Legbreak/Googly Spinner"],
      [/Noor Ahmad/gi, "Chinaman Spinner"],
      [/Noor/gi, "Spinner"],
      [/Mohit Sharma/gi, "Off-cutter Specialist"],
      [/Mohit/gi, "Cutter Specialist"],
      [/Arshdeep Singh/gi, "Left-arm In-swing Bowler"],
      [/Arshdeep/gi, "Left-arm In-swing Bowler"],
      [/Kagiso Rabada/gi, "Express Pace Bowler"],
      [/Rabada/gi, "Express Bowler"],
      [/Ravi Bishnoi/gi, "Quick Skidding Googly Bowler"],
      [/Bishnoi/gi, "Quick Googly Bowler"],
      [/Hardik Pandya/gi, "Seam Bowler"],
      [/Hardik/gi, "Seam Bowler"],
      [/Gerald Coetzee/gi, "Express Seamer"],
      [/Coetzee/gi, "Express Seamer"],
    ];
    
    for (const [regex, replacement] of replacements) {
      result = result.replace(regex, replacement);
    }
    return result;
  };

  // Generate dynamic performance PDF document based on active briefing states
  const handleDownloadPdf = async () => {
    if (!briefRef.current) return;
    
    // Show high-fidelity visual loading state
    const button = document.getElementById("download-pdf-btn");
    const originalText = button ? button.innerHTML : "";
    if (button) {
      button.innerHTML = `
        <span class="animate-pulse flex items-center gap-1 justify-center text-black">
          <svg class="animate-spin h-3 w-3 text-black mr-1" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Compiling PDF...
        </span>
      `;
    }

    // Capture standard stylesheets and set up backups
    const originalStyles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"));
    const styleBackups: {
      element: any;
      originalMedia?: string | null;
      originalDisabled?: boolean;
    }[] = [];
    let tempStyleTag: HTMLStyleElement | null = null;
    let originalStyleSheetsDescriptor: any = null;

    // Mathematical conversion from OKLCH to RGB
    const oklchToRgb = (l: number, c: number, h: number): [number, number, number] => {
      const hRad = (h * Math.PI) / 180;
      const L = l;
      const a_val = c * Math.cos(hRad);
      const b_val = c * Math.sin(hRad);
      
      const l_ = L + 0.3963377774 * a_val + 0.2158037573 * b_val;
      const m_ = L - 0.1055613458 * a_val - 0.0638541728 * b_val;
      const s_ = L - 0.0894841775 * a_val - 1.2914855480 * b_val;
      
      const l1 = l_ * l_ * l_;
      const m1 = m_ * m_ * m_;
      const s1 = s_ * s_ * s_;
      
      const rLinear = +4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1;
      const gLinear = -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1;
      const bLinear = -0.0041960863 * l1 - 0.7034186147 * m1 + 1.7076147010 * s1;
      
      const transfer = (val: number) => {
        return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
      };
      
      const r = Math.max(0, Math.min(255, Math.round(transfer(rLinear) * 255)));
      const g = Math.max(0, Math.min(255, Math.round(transfer(gLinear) * 255)));
      const b = Math.max(0, Math.min(255, Math.round(transfer(bLinear) * 255)));
      
      return [r, g, b];
    };

    const parseOklchString = (str: string): string => {
      const regex = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.deg%+]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i;
      const match = str.match(regex);
      if (!match) return "rgb(15, 23, 42)";
      
      let lStr = match[1];
      let cStr = match[2];
      let hStr = match[3];
      let aStr = match[4];
      
      let l = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
      let c = parseFloat(cStr);
      let h = hStr.endsWith("deg") ? parseFloat(hStr) : (hStr.endsWith("%") ? (parseFloat(hStr) / 100) * 360 : parseFloat(hStr));
      
      const [r, g, b] = oklchToRgb(l, c, h);
      
      if (aStr) {
        let a = aStr.endsWith("%") ? parseFloat(aStr) / 100 : parseFloat(aStr);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
      return `rgb(${r}, ${g}, ${b})`;
    };

    const resolveOklchToRgbText = (cssText: string): string => {
      if (!cssText.includes("oklch")) return cssText;
      return cssText.replace(/oklch\([^)]+\)/g, (match) => {
        return parseOklchString(match);
      });
    };

    // Override window.getComputedStyle to intercept and resolve any computed oklch rules on elements on the fly!
    const origMainGetComputedStyle = window.getComputedStyle;
    const wrapGetComputedStyle = (win: any) => {
      if (!win) return;
      const orig = win.getComputedStyle;
      if (!orig) return;
      
      win.getComputedStyle = function(elt: any, pseudoElt: any) {
        const styleDecl = orig.call(win, elt, pseudoElt);
        return new Proxy(styleDecl, {
          get(target, prop, receiver) {
            const val = Reflect.get(target, prop, receiver);
            if (typeof val === "string" && val.includes("oklch")) {
              return resolveOklchToRgbText(val);
            }
            if (typeof val === "function") {
              if (prop === "getPropertyValue") {
                return function(propertyName: string) {
                  const rawVal = target.getPropertyValue(propertyName);
                  if (typeof rawVal === "string" && rawVal.includes("oklch")) {
                    return resolveOklchToRgbText(rawVal);
                  }
                  return rawVal;
                };
              }
              return val.bind(target);
            }
            return val;
          }
        });
      };
    };

    // Track all globally patched windows to perfectly restore them later
    const patchedWindows: any[] = [];
    const patchCSSStyleDeclaration = (win: any) => {
      if (!win || !win.CSSStyleDeclaration) return;
      const proto = win.CSSStyleDeclaration.prototype;
      if (proto.__oklchPatched) return;
      proto.__oklchPatched = true;
      patchedWindows.push(win);

      // A: Override getPropertyValue
      const origGetPropertyValue = proto.getPropertyValue;
      proto.getPropertyValue = function(prop: string) {
        const val = origGetPropertyValue.call(this, prop);
        if (typeof val === "string" && val.includes("oklch")) {
          return resolveOklchToRgbText(val);
        }
        return val;
      };
      proto._origGetPropertyValue = origGetPropertyValue;

      // B: Override explicit shorthand/individual property descriptors on prototype
      const keysToWrap = [
        "color", "backgroundColor", "borderColor", "borderTopColor", "borderBottomColor", 
        "borderLeftColor", "borderRightColor", "fill", "stroke", "background", "cssText",
        "outlineColor", "columnRuleColor", "textDecorationColor", "accentColor", "caretColor"
      ];
      proto._origDescriptors = {};

      for (const key of keysToWrap) {
        try {
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          if (desc && desc.get) {
            proto._origDescriptors[key] = desc;
            Object.defineProperty(proto, key, {
              get() {
                const val = desc.get!.call(this);
                if (typeof val === "string" && val.includes("oklch")) {
                  return resolveOklchToRgbText(val);
                }
                return val;
              },
              set(v) {
                if (desc.set) desc.set.call(this, v);
              },
              configurable: true
            });
          }
        } catch (e) {
          // ignore
        }
      }
    };

    const unpatchCSSStyleDeclaration = (win: any) => {
      if (!win || !win.CSSStyleDeclaration) return;
      const proto = win.CSSStyleDeclaration.prototype;
      if (!proto.__oklchPatched) return;

      if (proto._origGetPropertyValue) {
        proto.getPropertyValue = proto._origGetPropertyValue;
        delete proto._origGetPropertyValue;
      }

      if (proto._origDescriptors) {
        for (const key of Object.keys(proto._origDescriptors)) {
          const desc = proto._origDescriptors[key];
          try {
            Object.defineProperty(proto, key, desc);
          } catch (e) {}
        }
        delete proto._origDescriptors;
      }

      delete proto.__oklchPatched;
    };

    try {
      // 1. Wrap global main window's getComputedStyle and patch prototype properties
      wrapGetComputedStyle(window);
      patchCSSStyleDeclaration(window);

      // 2. Gather rules from all active stylesheets and resolve oklch
      let combinedCSSText = "";
      for (const styleEl of originalStyles) {
        if (styleEl.tagName.toLowerCase() === "style") {
          combinedCSSText += (styleEl.textContent || "") + "\n";
        } else if (styleEl.tagName.toLowerCase() === "link") {
          const linkEl = styleEl as HTMLLinkElement;
          try {
            const res = await fetch(linkEl.href);
            if (res.ok) {
              const text = await res.text();
              combinedCSSText += text + "\n";
            }
          } catch (e) {
            // ignore
          }
        }
      }

      const resolvedCSSText = resolveOklchToRgbText(combinedCSSText);

      // 3. Create the temporary clean stylesheet
      tempStyleTag = document.createElement("style");
      tempStyleTag.id = "pdf-temp-custom-styles";
      tempStyleTag.textContent = resolvedCSSText;
      document.head.appendChild(tempStyleTag);

      // 4. Temporarily hide all original stylesheets from layout rendering during canvas snapshot
      for (const styleEl of originalStyles) {
        const originalMedia = styleEl.getAttribute("media");
        const originalDisabled = (styleEl as any).disabled;
        
        styleEl.setAttribute("media", "none");
        (styleEl as any).disabled = true;

        styleBackups.push({
          element: styleEl,
          originalMedia,
          originalDisabled
        });
      }

      // 5. Temporarily override document.styleSheets of host window
      // This completely blocks html2canvas from reading un-sanitized oklch patterns from active styles!
      originalStyleSheetsDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "styleSheets") || 
                                     Object.getOwnPropertyDescriptor(document, "styleSheets");

      Object.defineProperty(document, "styleSheets", {
        get() {
          const list = [tempStyleTag?.sheet].filter(Boolean) as any;
          list.item = (idx: number) => list[idx];
          return list;
        },
        configurable: true
      });

      const element = briefRef.current;
      
      // Save original container layout styles
      const originalShadow = element.style.boxShadow;
      const originalBorderRadius = element.style.borderRadius;
      const originalWidth = element.style.width;
      
      // Apply clean formatting for precise PDF rendering
      element.style.boxShadow = "none";
      element.style.borderRadius = "0px";
      element.style.width = "820px";
      
      // Execute capture using html2canvas directly over the fully pre-resolved safe stylesheets
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 1200, // Forces standard desktop rendering engine context in cloning iframe, fully supporting mobile devices!
        onclone: (clonedDoc) => {
          // Wrap cloned window's getComputedStyle too!
          if (clonedDoc.defaultView) {
            wrapGetComputedStyle(clonedDoc.defaultView);
            patchCSSStyleDeclaration(clonedDoc.defaultView);
          }

          // A: Remove all other stylesheets and styles in the cloned document so html2canvas doesn't re-parse oklch styles
          const clonedStyles = Array.from(clonedDoc.querySelectorAll("link[rel='stylesheet'], style"));
          for (const styleNode of clonedStyles) {
            if (styleNode.id === "pdf-temp-custom-styles") {
              styleNode.removeAttribute("media");
              (styleNode as any).disabled = false;
            } else {
              styleNode.parentNode?.removeChild(styleNode);
            }
          }

          // B: Inside clone, scrub/convert any remaining inline structure styles
          const allEls = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < allEls.length; i++) {
            const el = allEls[i] as HTMLElement;
            if (el && el.getAttribute) {
              const inlineStyle = el.getAttribute("style");
              if (inlineStyle && inlineStyle.includes("oklch")) {
                const cleanedStyle = inlineStyle.replace(/oklch\([^)]+\)/g, (match) => {
                  return resolveOklchToRgbText(match);
                });
                el.setAttribute("style", cleanedStyle);
              }
            }
          }

          const clonedEl = clonedDoc.getElementById("print-area-wrapper");
          if (clonedEl) {
            clonedEl.style.boxShadow = "none";
            clonedEl.style.borderRadius = "0px";
            clonedEl.style.color = "#0b0f19";
            clonedEl.style.backgroundColor = "#ffffff";
            clonedEl.style.width = "820px";
          }
        }
      });
      
      // Restore layout styles
      element.style.boxShadow = originalShadow;
      element.style.borderRadius = originalBorderRadius;
      element.style.width = originalWidth;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Render and split columns and pages cleanly in A4
      doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const filename = `Virat_Kohli_Tactical_Brief_vs_${briefingOpponent.replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF compiling failed, falling back to plaintext file download:", err);
      handleDownloadText();
    } finally {
      // Restore main window's getComputedStyle
      window.getComputedStyle = origMainGetComputedStyle;

      // Restore prototype styles on all patched windows
      for (const win of patchedWindows) {
        try {
          unpatchCSSStyleDeclaration(win);
        } catch (e) {}
      }

      // Cleanup our tempStyleTag
      if (tempStyleTag && tempStyleTag.parentNode) {
        tempStyleTag.parentNode.removeChild(tempStyleTag);
      }

      // Restore styleSheet descriptors on the host document
      try {
        if (originalStyleSheetsDescriptor) {
          Object.defineProperty(document, "styleSheets", originalStyleSheetsDescriptor);
        } else {
          delete (document as any).styleSheets;
        }
      } catch (e) {
        try {
          delete (document as any).styleSheets;
        } catch (err) {}
      }

      // Revert style setups/backups to ensure site's reactive colors remain functional
      for (const backup of styleBackups) {
        if (backup.element) {
          if (backup.originalMedia === null || backup.originalMedia === undefined) {
            backup.element.removeAttribute("media");
          } else {
            backup.element.setAttribute("media", backup.originalMedia);
          }
          if (backup.originalDisabled !== undefined) {
            backup.element.disabled = backup.originalDisabled;
          }
        }
      }

      if (button && originalText) {
        button.innerHTML = originalText;
      }
    }
  };

  // Handle exporting the briefing content as a beautifully formatted text file
  const handleDownloadText = () => {
    if (briefRef.current) {
      const text = briefRef.current.innerText;
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Virat_Kohli_Tactical_Brief_vs_${briefingOpponent.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Handle exporting the rich analysis metrics as a structured JSON database
  const handleDownloadJson = () => {
    const data = {
      subject: "Virat Kohli Tactical Performance Briefing Study",
      analyst: "Vikram S",
      targetOpposition: briefingOpponent,
      toneFormat: briefingFormat,
      metricSummary: {
        runsRecord: liveStats.runs.toString(),
        centuriesRecord: liveStats.centuries.toString(),
        controlIndex: "83.4%",
        trajectorySuccess: "100.0%"
      },
      activeSpars: {
        slidersState: {
          headAngle: customSliders.headAngle,
          weightBias: customSliders.weightBias,
          batSpeed: customSliders.batSpeed,
          batPadGap: customSliders.batPadGap
        }
      },
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Virat_Kohli_Metrics_Export_vs_${briefingOpponent.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };








  // Dynamic values based on selected phase and slider overrides
  const computedStats = useMemo(() => {
    const isKohli = modelMode === "kohli";
    const controlPct = isKohli 
      ? Math.max(78, 92 - (customSliders.headAngle * 0.8) - (Math.abs(customSliders.weightBias - 50) * 0.2))
      : Math.min(68, 70 - (customSliders.headAngle * 0.5) - (customSliders.batPadGap * 0.6));
    const cleanLbwRisk = isKohli
      ? Math.max(1, (customSliders.batPadGap * 0.8) + (customSliders.headAngle * 0.3))
      : Math.min(65, 45 + (customSliders.batPadGap * 1.5));
    
    return {
      controlPct: Math.round(controlPct),
      lbwRisk: Math.round(cleanLbwRisk),
      powerIndex: Math.round(isKohli ? 85 : 98)
    };
  }, [modelMode, customSliders]);

  // Scatter data to compare Kohli vs typical other profiles
  const efficiencyScatterData = [
    { name: "Virat Kohli (Average Year)", average: 39.2, strikeRate: 132.8, size: 240, type: "kohli" },
    { name: "Virat Kohli (2016 Season)", average: 81.1, strikeRate: 152.0, size: 450, type: "kohli" },
    { name: "Virat Kohli (2024 Season)", average: 61.8, strikeRate: 154.7, size: 400, type: "kohli" },
    { name: "Vaibhav Sooryavanshi (IPL 2026)", average: 40.0, strikeRate: 236.6, size: 300, type: "fearless" },
    { name: "Travis Head (T20 Peak)", average: 35.5, strikeRate: 172.4, size: 180, type: "fearless" },
    { name: "Nicholas Pooran", average: 32.4, strikeRate: 158.2, size: 160, type: "fearless" },
    { name: "Heinrich Klaasen", average: 38.1, strikeRate: 168.0, size: 190, type: "fearless" },
    { name: "Standard IPL Anchor", average: 31.2, strikeRate: 124.5, size: 120, type: "standard" },
    { name: "Standard IPL Finisher", average: 22.8, strikeRate: 148.0, size: 100, type: "standard" }
  ];

  // Selected phase in the breakdown
  const activePhase = threePhaseMechanics[selectedPhaseIdx];

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] font-sans selection:bg-amber-500 selection:text-black">
      {/* Upper Utility Navbar: Pure Professional Branding */}
      <header className="border-b border-[#1e293b]/50 bg-[#0c1222] px-4 py-3 sm:px-6 sm:py-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-amber-500 to-yellow-600 p-2 sm:p-2.5 rounded-lg shadow-lg shadow-amber-500/10 shrink-0">
              <span className="font-mono font-bold text-black text-xs sm:text-sm tracking-tighter">VK-18</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">THE ANCHOR MASTERCLASS</h1>
                <span className="text-[10px] sm:text-xs bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/20 whitespace-nowrap">Tactical Audit</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Biomechanical Trigger Analysis &amp; Historical IPL Metrics</p>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Global Target Opposition Dropdown in Navbar Header */}
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-[#12192c] border border-amber-500/30 rounded-lg px-3 py-2 shadow-inner w-full sm:w-auto">
              <div className="flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Target opposition:</span>
              </div>
              <select
                value={briefingOpponent}
                onChange={(e) => setBriefingOpponent(e.target.value)}
                className="bg-transparent text-xs text-amber-400 font-bold focus:outline-none cursor-pointer pr-1 text-right sm:text-left"
              >
                <option value="All Teams" className="bg-[#0c1222]">All Teams (Overall)</option>
                <option value="Chennai Super Kings" className="bg-[#0c1222]">Chennai Super Kings (CSK)</option>
                <option value="Delhi Capitals" className="bg-[#0c1222]">Delhi Capitals (DC)</option>
                <option value="Gujarat Titans" className="bg-[#0c1222]">Gujarat Titans (GT)</option>
                <option value="Kolkata Knight Riders" className="bg-[#0c1222]">Kolkata Knight Riders (KKR)</option>
                <option value="Lucknow Super Giants" className="bg-[#0c1222]">Lucknow Super Giants (LSG)</option>
                <option value="Mumbai Indians" className="bg-[#0c1222]">Mumbai Indians (MI)</option>
                <option value="Punjab Kings" className="bg-[#0c1222]">Punjab Kings (PBKS)</option>
                <option value="Rajasthan Royals" className="bg-[#0c1222]">Rajasthan Royals (RR)</option>
                <option value="Sunrisers Hyderabad" className="bg-[#0c1222]">Sunrisers Hyderabad (SRH)</option>
              </select>
            </div>

            {/* Tab Selection */}
            <nav className="grid grid-cols-2 gap-1.5 sm:flex sm:space-x-1 sm:gap-0 bg-[#151c30] p-1 rounded-lg border border-[#1e293b] w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("mechanics")}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-2 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "mechanics"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/10"
                    : "text-slate-300 hover:bg-[#1a253e] hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Biomechanical</span>
              </button>
              <button
                onClick={() => setActiveTab("statistics")}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-2 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "statistics"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/10"
                    : "text-slate-300 hover:bg-[#1a253e] hover:text-white"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>IPL Metrics</span>
              </button>
              <button
                onClick={() => setActiveTab("strategy")}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-2 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "strategy"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/10"
                    : "text-slate-300 hover:bg-[#1a253e] hover:text-white"
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Strategic</span>
              </button>
              <button
                onClick={() => setActiveTab("briefing")}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-2 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "briefing"
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/10"
                    : "text-slate-300 hover:bg-[#1a253e] hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Briefing</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6">
        
        {/* Core Tactical Context Banner */}
        <section id="banner-context" className="mb-8 rounded-xl bg-gradient-to-r from-slate-900 via-[#0e1627] to-slate-900 border border-[#1e293b] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-full opacity-10 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10 w-full">
            <div className="space-y-3 flex-1 max-w-3xl">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-xs font-mono border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Strategic Thesis</span>
              </div>
              <h2 className="text-2xl font-bold font-display tracking-tight text-white">
                Why Virat Kohli Retains Dominance in the "Fearless Strike-Rate" Era
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Modern T20 batsmen have accelerated scoring rates by adopting high-torque posture biases, such as pre-delivery leans and wide stances. However, this creates extreme mechanical gaps (e.g., the bat-pad open gate) that top-tier express pace exploits. Kohli is the world-elite archetype of <strong>mechanical equilibrium</strong>, maintaining zero-drift stillness to maximize the ball-tracking window.
              </p>

              {/* Responsive Mini Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-[#080d1a]/85 p-3.5 rounded-xl border border-slate-800/80 max-w-xl">
                <div className="space-y-0.5 border-l-2 border-amber-500/80 pl-3.5 bg-amber-500/[0.03] py-1 rounded-r-md transition-all duration-300 hover:bg-amber-500/[0.06]">
                  <span className="text-[9px] text-[#94a3b8] uppercase tracking-widest font-mono">IPL Runs Record</span>
                  <p className="text-lg font-bold font-mono text-amber-500">{liveStats.runs.toLocaleString()}</p>
                  <div className="text-[9px] text-[#64748b]">Highest in History</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">IPL Centuries</span>
                  <p className="text-lg font-bold font-mono text-amber-500">{liveStats.centuries}</p>
                  <div className="text-[9px] text-slate-500">Most of All Time</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Control Index</span>
                  <p className="text-lg font-bold font-mono text-emerald-400">83.4%</p>
                  <div className="text-[9px] text-slate-500">Elite Consistency</div>
                </div>
              </div>
            </div>

            {/* Embedded high-fidelity visual artwork generated specifically for Vikram S */}
            <div className="flex flex-col items-center gap-2 shrink-0 w-full lg:w-96 select-none">
              <div className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-950 w-72 h-[380px] mx-auto group">
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={REAL_KOHLI_PHOTO_URL} 
                    alt="Virat Kohli Elite Athletic Stance Study - Editorial Compiled by Vikram S" 
                    className="absolute w-[300%] max-w-none h-full top-0 left-[-100%] object-cover object-[center_12%] group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-amber-400 bg-black/75 px-2 py-0.5 rounded backdrop-blur-md font-bold uppercase border border-amber-500/20">
                    STUDY #18
                  </span>
                  <span className="font-mono text-[9px] text-slate-200 font-bold bg-[#0d1527]/90 px-2 py-0.5 rounded backdrop-blur-md border border-slate-700/30">
                    REPORT BY VIKRAM S
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono text-center tracking-wider px-2">
                Kinematically Audited Vector Dataset • Focus: {briefingOpponent === "All Teams" ? "All Teams" : briefingOpponent} Matchups
              </p>
            </div>
          </div>
        </section>

        {/* ==================== TAB 1: BIOMECHANICAL MODEL ==================== */}
        <AnimatePresence mode="wait">
          {activeTab === "mechanics" && (
            <motion.div
              key="mechanics-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Interactive Dynamic Drawing Canvas */}
                <div className="lg:col-span-7 bg-[#0c1222] rounded-xl border border-[#1e293b] p-6 shadow-lg flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Info className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-semibold font-mono text-slate-300 uppercase tracking-wider">Dynamic Kinematic Sandbox</h3>
                      </div>
                      <div className="flex bg-[#12192c] rounded-md p-0.5 border border-slate-800">
                        <button
                          onClick={() => applyPreset("kohli")}
                          className={`px-3 py-1 text-xs font-mono rounded ${
                            modelMode === "kohli"
                              ? "bg-amber-500 text-black font-semibold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Kohli (Pure Balance)
                        </button>
                        <button
                          onClick={() => applyPreset("highrisk")}
                          className={`px-3 py-1 text-xs font-mono rounded ${
                            modelMode === "highrisk"
                              ? "bg-rose-500 text-white font-semibold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Modern Powerhitter (Lean)
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      Toggle presets or manipulate values below to observe how minuscule posture shifts create immediate physical vulnerability.
                    </p>
                  </div>

                  {/* Interactive Biomechanical Rig Graphics Canvas */}
                  <div className="my-6 bg-[#060a14] rounded-xl border border-slate-900 flex flex-col p-4 relative overflow-hidden w-full">
                    {/* Grid background representing biomechanical coordinate planes */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b05_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0c_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                    
                    {/* Top Stats Bar - Responsive Flex Layout (Prevents mobile overlap) */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-900 font-mono text-[10px] text-slate-500 z-10">
                      <div className="space-y-0.5">
                        <div className="text-slate-400 font-semibold uppercase tracking-wider">BIOMECHANICAL RIG V4.1</div>
                        <div className="text-[9px]">DESIGNED BY VIKRAM S</div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <div>SURVIVAL SCORE: <span className={computedStats.controlPct > 78 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{computedStats.controlPct}%</span></div>
                        <div>CENTER SHIFT: <span className="text-amber-400 font-bold">{(customSliders.headAngle * 0.82).toFixed(1)}cm</span></div>
                      </div>
                    </div>

                    {/* Simulation Playback & Selector Deck */}
                    <div className="mb-4 z-10 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 bg-[#0d1324] border border-slate-900 p-2.5 rounded-lg">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Drill Trajectory:</span>
                        <div className="inline-flex bg-[#060a14] rounded border border-slate-900 p-0.5">
                          {(["good", "short", "full"] as const).map((len) => (
                            <button
                              key={len}
                              onClick={() => setDrillLength(len)}
                              className={`px-2 py-0.5 text-[9px] font-mono rounded uppercase transition ${
                                drillLength === len
                                  ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/25"
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              {len === "good" ? "Good Lgth" : len === "short" ? "Bouncer" : "Yorker"}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setIsDrillAnimating(!isDrillAnimating)}
                        className={`px-3 py-1 text-[10px] font-mono rounded font-bold uppercase tracking-wider flex items-center justify-center space-x-1 border transition ${
                          isDrillAnimating
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/35 animate-pulse"
                            : "bg-amber-500 text-slate-950 border-amber-500/20 hover:bg-amber-400"
                        }`}
                      >
                        <Play className={`w-3 h-3 ${isDrillAnimating ? "fill-current" : ""}`} />
                        <span>{isDrillAnimating ? "STOP DRILL" : "ANIMATE DRILL"}</span>
                      </button>
                    </div>

                    {/* SVG Graphic Context wrapper with Responsive Aspect scaling */}
                    <div className="w-full h-[320px] relative flex justify-center items-center">
                      <svg width="100%" height="100%" viewBox="0 0 500 320" className="relative z-10 max-h-[320px]">
                        {/* Ground Plane Line */}
                        <line x1="40" y1="280" x2="460" y2="280" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
                        
                        {/* Vertical Grid Origin Line */}
                        <line x1="250" y1="20" x2="250" y2="300" stroke="#1e293b" strokeWidth="1" />
                        <line x1="40" y1="160" x2="460" y2="160" stroke="#1e293b" strokeWidth="1" />

                        {/* STANCE GRAPH (SVG Dynamic drawing based on hooks) */}
                        {(() => {
                          // Base postures depending on active delivery phase (selectedPhaseIdx)
                          let baseHeadX = 250 + (customSliders.weightBias - 50) * 1.5;
                          let headY = 80 + (customSliders.headAngle * 0.4);
                          
                          let chestX = 250 + (customSliders.weightBias - 50) * 0.5;
                          let chestY = 140;
                          
                          let hipX = 250;
                          let hipY = 190;
                          
                          let frontKneeX = 180 - (customSliders.weightBias - 50) * 0.2;
                          let frontKneeY = 230;
                          
                          let backKneeX = 320;
                          let backKneeY = 230;
                          
                          let frontFootX = 160;
                          let backFootX = 340;

                          let batTopX = baseHeadX + 50 - (customSliders.batPadGap * 2.5);
                          let batTopY = 40 + (customSliders.batPadGap * 1.5);
                          let batBottomX = batTopX + 25 + (customSliders.batPadGap * 1.8);
                          let batBottomY = 150 - (customSliders.batPadGap * 0.5);

                          let forceLabel = "";
                          let forceX = 250;
                          let forceY = 150;

                          if (selectedPhaseIdx === 1) {
                            baseHeadX += 16;
                            chestX += 12;
                            hipX += 8;
                            batTopY -= 15;
                            batTopX -= 6;
                            batBottomX = batTopX + 15;
                            batBottomY = 125;
                            forceLabel = "TRIGGER: +8CM OFF-STUMP";
                            forceX = baseHeadX - 10;
                            forceY = chestY - 10;
                          } else if (selectedPhaseIdx === 2) {
                            baseHeadX -= 45;
                            headY += 25;
                            chestX -= 35;
                            chestY += 15;
                            hipX -= 15;
                            hipY += 10;
                            frontFootX = 130;
                            frontKneeX = 110;
                            frontKneeY = 240;
                            backKneeX = 290;
                            backKneeY = 230;
                            backFootX = 350;

                            batTopX = chestX - 15;
                            batTopY = chestY + 15;
                            batBottomX = frontFootX + (customSliders.batPadGap * 2.2);
                            batBottomY = 265;
                            forceLabel = "IMPACT VERTICAL ALIGNMENT";
                            forceX = frontFootX - 10;
                            forceY = 220;
                          }

                          const headX = baseHeadX + (Math.sin((customSliders.headAngle * Math.PI) / 180) * 60);

                          // Helper for generating ghost bat trajectory values
                          const getGhostBatCoords = (p: number, length: "good" | "short" | "full") => {
                            let startTop = { x: 310, y: 50 };
                            let startBot = { x: 325, y: 135 };
                            let midTop = { x: 220, y: 150 };
                            let midBot = { x: 205, y: 265 };
                            let endTop = { x: 135, y: 95 };
                            let endBot = { x: 115, y: 140 };

                            if (length === "good") {
                              midTop = { x: 220, y: 150 };
                              midBot = { x: 200, y: 265 };
                              endTop = { x: 130, y: 85 };
                              endBot = { x: 110, y: 140 };
                            } else if (length === "short") {
                              midTop = { x: 250, y: 105 };
                              midBot = { x: 175, y: 105 };
                              endTop = { x: 130, y: 120 };
                              endBot = { x: 140, y: 190 };
                            } else {
                              midTop = { x: 155, y: 175 };
                              midBot = { x: 130, y: 275 };
                              endTop = { x: 138, y: 202 };
                              endBot = { x: 114, y: 278 };
                            }

                            let tx, ty, bx, by;
                            if (p < 0.20) {
                              tx = startTop.x;
                              ty = startTop.y;
                              bx = startBot.x;
                              by = startBot.y;
                            } else if (p < 0.65) {
                              const subP = (p - 0.20) / 0.45;
                              const ease = (1 - Math.cos(subP * Math.PI)) / 2;
                              tx = startTop.x + (midTop.x - startTop.x) * ease;
                              ty = startTop.y + (midTop.y - startTop.y) * ease;
                              bx = startBot.x + (midBot.x - startBot.x) * ease;
                              by = startBot.y + (midBot.y - startBot.y) * ease;
                            } else {
                              const subP = (p - 0.65) / 0.35;
                              const ease = (1 - Math.cos(subP * Math.PI)) / 2;
                              tx = midTop.x + (endTop.x - midTop.x) * ease;
                              ty = midTop.y + (endTop.y - midTop.y) * ease;
                              bx = midBot.x + (endBot.x - midBot.x) * ease;
                              by = midBot.y + (endBot.y - midBot.y) * ease;
                            }
                            return { tx, ty, bx, by };
                          };

                          const ghost = getGhostBatCoords(drillProgress, drillLength);

                          return (
                            <g>
                              {/* Optimal Trajectory Curve Trails Underlay */}
                              {isDrillAnimating && (
                                <g opacity="0.4">
                                  {drillLength === "good" && (
                                    <path 
                                      d="M 325,135 Q 260,200 200,265 Q 150,200 110,140" 
                                      fill="none" 
                                      stroke="#10b981" 
                                      strokeWidth="2.5" 
                                      strokeDasharray="4 2" 
                                    />
                                  )}
                                  {drillLength === "short" && (
                                    <path 
                                      d="M 325,135 Q 260,115 175,105 Q 155,145 140,190" 
                                      fill="none" 
                                      stroke="#f59e0b" 
                                      strokeWidth="2.5" 
                                      strokeDasharray="4 2" 
                                    />
                                  )}
                                  {drillLength === "full" && (
                                    <path 
                                      d="M 325,135 Q 210,200 130,275 Q 120,276 114,278" 
                                      fill="none" 
                                      stroke="#60a5fa" 
                                      strokeWidth="2.5" 
                                      strokeDasharray="4 2" 
                                    />
                                  )}
                                </g>
                              )}

                              {/* Head Center Plumb Line */}
                              <motion.line 
                                animate={{ x1: headX, x2: headX }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                y1="20" 
                                y2="300" 
                                stroke={modelMode === "kohli" ? "#10b981" : "#f43f5e"} 
                                strokeWidth="1" 
                                strokeDasharray="4 4" 
                                opacity="0.5"
                              />
                              
                              {/* Deviation Arc Visual */}
                              {modelMode === "highrisk" && (
                                <motion.path 
                                  animate={{ d: `M 250,80 A 60,60 0 0,1 ${headX},${headY}` }}
                                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                  fill="none" 
                                  stroke="#f43f5e" 
                                  strokeWidth="2" 
                                  strokeDasharray="2 2"
                                />
                              )}

                              {/* Bat-Pad Gap highlight */}
                              {customSliders.batPadGap > 2 && (
                                <motion.rect 
                                  animate={{ x: frontFootX + 10, width: customSliders.batPadGap * 2.5 }}
                                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                  y="180" 
                                  height="100" 
                                  fill="#f43f5e" 
                                  opacity="0.15" 
                                  className="animate-pulse"
                                />
                              )}

                              {/* Draw skeleton joints */}
                              {/* Spine / Torso link */}
                              <motion.line 
                                animate={{ x1: headX, y1: headY, x2: chestX, y2: chestY }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                              <motion.line 
                                animate={{ x1: chestX, y1: chestY, x2: hipX, y2: hipY }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                stroke="#94a3b8" strokeWidth="4" />

                              {/* Hips to Knees */}
                              <motion.line 
                                animate={{ x1: hipX, y1: hipY, x2: frontKneeX, y2: frontKneeY }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                stroke="#64748b" strokeWidth="4" />
                              <motion.line 
                                animate={{ x1: hipX, y1: hipY, x2: backKneeX, y2: backKneeY }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                stroke="#64748b" strokeWidth="4" />

                              {/* Knees to Feet */}
                              <motion.line 
                                animate={{ x1: frontKneeX, y1: frontKneeY, x2: frontFootX }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                y2="280" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                              <motion.line 
                                animate={{ x1: backKneeX, y1: backKneeY, x2: backFootX }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                y2="280" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />

                              {/* Head Dot */}
                              <motion.circle 
                                animate={{ cx: headX, cy: headY }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                r="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                              <motion.circle 
                                animate={{ cx: headX, cy: headY }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                r="4" fill="#fbbf24" />

                              {/* Stance balance text block */}
                              <motion.text 
                                animate={{ x: headX + 20, y: headY + 5 }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                fill="#94a3b8" fontSize="10" fontFamily="monospace">
                                HEAD AXIS ({customSliders.headAngle}°)
                              </motion.text>

                              {/* Current Dynamic Player Bat */}
                              <motion.g 
                                animate={{ rotate: customSliders.headAngle * 0.3 }}
                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                style={{ transformOrigin: `${batTopX}px ${batTopY}px` }}
                              >
                                <motion.line 
                                  animate={{
                                    x1: batTopX,
                                    y1: batTopY,
                                    x2: batBottomX,
                                    y2: batBottomY,
                                  }}
                                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                  stroke={modelMode === "kohli" ? "#f59e0b" : "#f43f5e"} 
                                  strokeWidth="8" 
                                  strokeLinecap="round" 
                                />
                                <motion.text 
                                  animate={{ x: batTopX + 15, y: batTopY + 25 }}
                                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                  fill="#fbbf24" fontSize="10" fontFamily="monospace">
                                  BAT PATH
                                </motion.text>
                              </motion.g>

                              {/* Ideal Ghost Bat Overlay (Animate Drill) */}
                              {isDrillAnimating && (
                                <g>
                                  {/* Shadow glow filter effect */}
                                  <line 
                                    x1={ghost.tx} 
                                    y1={ghost.ty} 
                                    x2={ghost.bx} 
                                    y2={ghost.by} 
                                    stroke="#10b981" 
                                    strokeWidth="12" 
                                    strokeLinecap="round" 
                                    opacity="0.25"
                                  />
                                  <line 
                                    x1={ghost.tx} 
                                    y1={ghost.ty} 
                                    x2={ghost.bx} 
                                    y2={ghost.by} 
                                    stroke="#fbbf24" 
                                    strokeWidth="6" 
                                    strokeLinecap="round" 
                                    opacity="0.85"
                                    strokeDasharray="1 1"
                                  />
                                  <circle cx={ghost.bx} cy={ghost.by} r="4" fill="#fbbf24" opacity="0.9" />
                                  <text x={ghost.tx + 12} y={ghost.ty + 20} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                                    IDEAL TRAJECTORY
                                  </text>
                                </g>
                              )}

                              {/* Vector force arrows pointing to balance shifts */}
                              {modelMode === "highrisk" ? (
                                <g>
                                  <path d="M 230,130 L 190,130" stroke="#f43f5e" strokeWidth="1.5" />
                                  <text x="120" y="125" fill="#f43f5e" fontSize="9" fontFamily="monospace">LEAN VECTOR</text>
                                  <motion.text 
                                    animate={{ x: frontFootX + 10 }}
                                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                    y="220" fill="#f43f5e" fontSize="9" fontFamily="monospace" className="font-semibold">GAP ({customSliders.batPadGap}cm)</motion.text>
                                </g>
                              ) : (
                                <g>
                                  <line x1="250" y1="120" x2="250" y2="150" stroke="#10b981" strokeWidth="1.5" />
                                  <circle cx="250" cy="150" r="2" fill="#10b981" />
                                  <motion.text 
                                    animate={{ x: forceX - 70, y: forceY - 35 }}
                                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                    fill="#10b981" fontSize="9" fontFamily="monospace">
                                    {forceLabel ? forceLabel : "CENTER OF MASS (99.8%)"}
                                  </motion.text>
                                </g>
                              )}
                            </g>
                          );
                        })()}
                      </svg>
                    </div>

                    {/* Bottom Status Panel - Responsive Footer (Prevents Mobile Overlap) */}
                    <div className="mt-4 pt-3 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10 w-full">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                        <span>POSTURE STABILITY STATE:</span>
                      </div>
                      <div className="w-full sm:w-auto self-stretch sm:self-auto flex items-center justify-end">
                        {modelMode === "kohli" ? (
                          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/35 rounded-md px-3 py-1 text-xs font-semibold flex items-center space-x-1.5 w-full sm:w-auto justify-center font-mono">
                            <Check className="w-4 h-4" />
                            <span>MECHANICAL SYMMETRY</span>
                          </div>
                        ) : (
                          <div className="bg-rose-500/10 text-rose-400 border border-rose-500/35 rounded-md px-3 py-1 text-xs font-semibold flex items-center space-x-1.5 animate-pulse w-full sm:w-auto justify-center font-mono">
                            <Info className="w-4 h-4" />
                            <span>EXPLOITABLE GAP OPENED</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real-time slider adjustments */}
                  <div className="bg-[#111827] rounded-xl border border-slate-800 p-5 mt-auto">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center justify-between">
                      <span>Live Biomechanical Variables</span>
                      <button 
                        onClick={() => applyPreset(modelMode)}
                        className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Presets</span>
                      </button>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Slider 1: Head tilt */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono text-slate-300">
                          <span>Head Angle Deviation</span>
                          <span className={`${customSliders.headAngle > 10 ? "text-rose-400 font-semibold" : "text-amber-500"}`}>
                            {customSliders.headAngle}° {customSliders.headAngle > 10 ? "(Collapsed)" : "(Vertical still)"}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="25"
                          step="1"
                          value={customSliders.headAngle}
                          onChange={(e) => {
                            setCustomSliders({ ...customSliders, headAngle: parseInt(e.target.value) });
                            if (parseInt(e.target.value) > 10) setModelMode("highrisk");
                          }}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      {/* Slider 2: Weight bias */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono text-slate-300">
                          <span>Stance Weight Split</span>
                          <span className="text-amber-500">
                            {100 - customSliders.weightBias}/{customSliders.weightBias} {customSliders.weightBias === 50 ? "(Neutral)" : "(Offside bias)"}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="90"
                          step="1.5"
                          value={customSliders.weightBias}
                          onChange={(e) => {
                            setCustomSliders({ ...customSliders, weightBias: parseInt(e.target.value) });
                            if (parseInt(e.target.value) !== 50) setModelMode("highrisk");
                          }}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      {/* Slider 3: Batpad gap */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono text-slate-300">
                          <span>Bat-Pad Air Gap</span>
                          <span className={`${customSliders.batPadGap > 5 ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}`}>
                            {customSliders.batPadGap} cm {customSliders.batPadGap > 5 ? "(Vulnerable)" : "(Seal tight)"}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={customSliders.batPadGap}
                          onChange={(e) => {
                            setCustomSliders({ ...customSliders, batPadGap: parseInt(e.target.value) });
                            if (parseInt(e.target.value) > 0) setModelMode("highrisk");
                          }}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      {/* Slider 4: Wrist flexibility */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono text-slate-300">
                          <span>Wrist Leverage Arc</span>
                          <span className="text-amber-500">{customSliders.wristFlexibility}% Performance</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="100"
                          value={customSliders.wristFlexibility}
                          onChange={(e) => setCustomSliders({ ...customSliders, wristFlexibility: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Tabbed Phase Selector and Narrative Analysis */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  {/* Phase Trigger Indicators matching user's Image 1, 2, 3 sequence */}
                  <div className="bg-[#0c1222] rounded-xl border border-[#1e293b] p-5 shadow-lg">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">
                      Delivery Phase Progression (Image 1 - 3 Sequence)
                    </h3>
                    <div className="space-y-2.5">
                      {threePhaseMechanics.map((phaseObject, index) => (
                        <button
                          key={phaseObject.phase}
                          onClick={() => {
                            setSelectedPhaseIdx(index);
                            applyPreset(modelMode, index);
                          }}
                          className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 flex items-start space-x-3 ${
                            selectedPhaseIdx === index
                              ? "bg-[#151c30] border-amber-500/80 shadow-md"
                              : "bg-[#090e1a] border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                            selectedPhaseIdx === index
                              ? "bg-amber-500 text-black"
                              : "bg-[#151c30] text-slate-400"
                          }`}>
                            0{index + 1}
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-mono uppercase ${selectedPhaseIdx === index ? "text-amber-400 font-semibold" : "text-slate-400"}`}>
                                {phaseObject.phase}
                              </span>
                              {index === 1 && (
                                <span className="bg-amber-500/10 text-amber-500 text-[9px] font-mono px-1 rounded">TRIGGER POINT</span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-white tracking-tight">{phaseObject.title}</h4>
                            <p className="text-xs text-slate-400">{phaseObject.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Narrative details of the active phase */}
                  <div className="bg-[#0c1222] rounded-xl border border-[#1e293b] p-6 shadow-lg flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                        <div className="w-1.5 h-6 bg-amber-500 rounded-sm" />
                        <div>
                          <h4 className="text-[10px] text-amber-500 font-mono tracking-widest uppercase">TECHNICAL BREAKDOWN</h4>
                          <span className="text-base font-bold text-white tracking-tight">{activePhase.title}</span>
                        </div>
                      </div>

                      <p className="text-xs italic text-slate-300 leading-relaxed bg-[#080d1a] p-3 rounded-lg border border-slate-900">
                        "{activePhase.coachesTake}"
                      </p>

                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Biomechanical Vector Checks</h5>
                        <div className="space-y-2">
                          {activePhase.keyMechanics.map((mechanic, mKey) => (
                            <div key={mKey} className="text-xs flex items-start space-x-2.5">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 block shrink-0" />
                              <div className="space-y-0.5">
                                <span className="font-semibold text-slate-200 block">{mechanic.title}</span>
                                <span className="text-slate-400 text-[11px] leading-relaxed block">{mechanic.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800">
                      <h5 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono mb-2 flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Tactical Strategic Edge</span>
                      </h5>
                      <ul className="space-y-1.5">
                        {activePhase.criticalInsights.map((insight, idx) => (
                          <li key={idx} className="text-[11px] text-slate-300 leading-relaxed flex items-start">
                            <span className="text-amber-500 mr-1.5 shrink-0">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kinematic Snapshots (Instagram Slide Format) */}
              <KinematicSnapshots />

              {/* Stance Posture Comparison Panel showing Virat Kohli vs Vaibhav Sooryavanshi */}
              <div className="bg-[#0b101f] rounded-xl border border-slate-800/80 p-6 shadow-xl">
                <h3 className="text-base font-bold text-white font-display mb-4 flex items-center space-x-2">
                  <ArrowRightLeft className="w-5 h-5 text-amber-500" />
                  <span>The Equilibrium Paradigm: Kohli (Neutral) vs. Modern Short-Form Batters (Pre-Leaning)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {technicalComparisons.map((item, idx) => (
                    <div key={idx} className="bg-[#0e1526] border border-slate-800/80 p-4 rounded-lg flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest">{item.impactLabel}</span>
                        <h4 className="text-sm font-bold text-white">{item.metric}</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="dark-check bg-emerald-950/20 border border-emerald-900/40 p-2 rounded text-[11px]">
                          <span className="font-semibold text-emerald-400 block mb-0.5">Virat Kohli</span>
                          <span className="text-slate-300 block leading-tight">{item.kohliDesc}</span>
                        </div>
                        <div className="dark-warn bg-rose-950/20 border border-rose-900/40 p-2 rounded text-[11px]">
                          <span className="font-semibold text-rose-400 block mb-0.5">Typical Powerhitter</span>
                          <span className="text-slate-300 block leading-tight">{item.modernDesc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== TAB 2: IPL METRICS HUB ==================== */}
          {activeTab === "statistics" && (
            <motion.div
              key="statistics-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Live Update Synchronizer Status Panel */}
              <div className={`bg-[#0b0f19] border ${isHighlighting ? "border-amber-500 shadow-xl shadow-amber-500/15" : "border-[#1e293b]"} rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none transition-all duration-1000`}>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-white tracking-tight">Ecosystem Live Synchronizer</span>
                      <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase border border-emerald-500/20 animate-pulse">
                        Auto-Sync Active (Every 10s)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                      Connected to server-side Google Search grounding. Sinks data automatically in the background, so the moment a match gets overed relative to today, the system syncs live career stats and latest match aggregates instantly.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-left md:text-right justify-center shrink-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">SOURCE: {liveUpdatesSource}</span>
                    <span className="text-[10px] font-mono text-amber-500 font-bold mt-0.5 uppercase">VERIFIED SYNCED: {liveLastFetched || "Active"}</span>
                  </div>
                  <button
                    onClick={() => fetchLiveUpdates(true)}
                    disabled={isLoadingLiveUpdates}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isLoadingLiveUpdates ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Syncing...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                        Force Sync Now
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Last completed match panel */}
              {lastMatch && (
                <div className="bg-[#0c1222]/80 border border-amber-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    <span className="bg-amber-500/15 text-amber-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/20">
                      MATCH COMPLETED FEEDS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-wider block">LAST PLAYED MATCH TRACKER</span>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3">
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 font-display">
                        <span>RCB vs. {lastMatch.opponent}</span>
                        <span className="text-xs text-slate-400 font-normal">({lastMatch.date})</span>
                      </h4>
                      <p className="text-xs text-slate-300 italic leading-relaxed">{lastMatch.summary}</p>
                      <p className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                        <span>📍 {lastMatch.venue}</span>
                        <span className="text-slate-600">•</span>
                        <span>Dismissal: {lastMatch.dismissal}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-6 min-w-fit pr-2">
                      <div className="text-center">
                        <span className="text-slate-500 font-mono text-[9px] block font-bold">RUNS SECURED</span>
                        <span className="text-2xl font-black font-display text-white">{lastMatch.runs}</span>
                        <span className="text-[11px] text-slate-400 font-mono"> ({lastMatch.balls}b)</span>
                      </div>
                      <div className="w-px h-8 bg-slate-800" />
                      <div className="text-center">
                        <span className="text-slate-500 font-mono text-[9px] block font-bold">STRIKE RATE</span>
                        <span className="text-2xl font-black font-display text-amber-400">{lastMatch.strikeRate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stat Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-xl shadow mt-1 transition-all duration-1000 ${isHighlighting ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.03]" : "bg-[#0c1222] border border-[#1e293b]"}`}>
                  <span className="text-xs text-slate-400 font-mono tracking-wider uppercase block">Total IPL Career Runs</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{liveStats.runs}</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">#1 All-Time</span>
                    {isHighlighting && (
                      <span className="text-xs text-emerald-400 font-mono font-bold animate-bounce ml-1">+92 runs</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Scored over 18 years in visual consistency across {liveStats.innings} innings.</p>
                </div>

                <div className={`p-5 rounded-xl shadow transition-all duration-1000 ${isHighlighting ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.03]" : "bg-[#0c1222] border border-[#1e293b]"}`}>
                  <span className="text-xs text-slate-400 font-mono tracking-wider uppercase block">IPL Centuries / fifties</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{liveStats.centuries}</span>
                    <span className="text-slate-300 font-mono font-bold">/</span>
                    <span className="text-2xl font-bold text-slate-300">{liveStats.fifties}</span>
                    {isHighlighting && (
                      <span className="text-xs text-emerald-400 font-mono font-bold animate-bounce ml-1">+1 fifty</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Holds the world record for the most centuries in a tournament ({liveStats.centuries}).</p>
                </div>

                <div className={`p-5 rounded-xl shadow transition-all duration-1000 ${isHighlighting ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.03]" : "bg-[#0c1222] border border-[#1e293b]"}`}>
                  <span className="text-xs text-slate-400 font-mono tracking-wider uppercase block">Risk-Adjusted IPL Average</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{liveStats.average}</span>
                    <span className="text-xs text-amber-500 font-mono">Elite Anchor Status</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Maintains a ~{liveStats.average} average even in T20 cricketing volatility.</p>
                </div>

                <div className={`p-5 rounded-xl shadow transition-all duration-1000 ${isHighlighting ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.03]" : "bg-[#0c1222] border border-[#1e293b]"}`}>
                  <span className="text-xs text-slate-400 font-mono tracking-wider uppercase block">High-Score &amp; Fours/Sixes</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{liveStats.highScore}</span>
                    <span className="text-xs text-amber-500 font-mono italic">({liveStats.fours} Fours, {liveStats.sixes} Sixes)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Demonstrates scoring via smart boundary finding rather than raw slogs.</p>
                </div>
              </div>

              {/* Chart Selection Buttons */}
              <div className="flex bg-[#12192c] p-1 rounded-lg border border-slate-800/85 w-fit">
                <button
                  onClick={() => setStatsViewMode("career")}
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                    statsViewMode === "career"
                      ? "bg-amber-500 text-black shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Season-by-Season Progression</span>
                </button>
                <button
                  onClick={() => setStatsViewMode("efficiency")}
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                    statsViewMode === "efficiency"
                      ? "bg-amber-500 text-black shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Strike Rate vs. Average Efficiency Frontier</span>
                </button>
              </div>

              {/* Main Chart Card */}
              <div className="bg-[#0c1222] border border-[#1e293b] rounded-xl p-6 shadow-xl">
                {statsViewMode === "career" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold font-display text-white">Virat Kohli's IPL Career Trajectory (2008 – 2025)</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Interactive graph tracking annual run tallies (Bars) overlaid with Average (Line) and Strike Rate (Area). Hover over bars to see detail.
                      </p>
                    </div>

                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={kohliIPLHistory}
                          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                          onMouseMove={(state) => {
                            if (state && state.activeLabel) {
                              setHighlightedYear(Number(state.activeLabel));
                            } else {
                              setHighlightedYear(null);
                            }
                          }}
                        >
                          <defs>
                            <linearGradient id="colorStrikeRate" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                            </linearGradient>
                            <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.3}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="year" stroke="#64748b" tickLine={false} fontSize={11} strokeWidth={1} />
                          <YAxis yAxisId="left" stroke="#64748b" label={{ value: 'Runs', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 } }} fontSize={11} />
                          <YAxis yAxisId="right" orientation="right" stroke="#64748b" label={{ value: 'SR / Avg', angle: 90, position: 'insideRight', style: { fill: '#94a3b8', fontSize: 11 } }} fontSize={11} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                            labelStyle={{ fontWeight: 'bold', color: '#f59e0b' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
                          <Area yAxisId="right" type="monotone" dataKey="strikeRate" fill="url(#colorStrikeRate)" stroke="#f59e0b" strokeWidth={1.5} name="Strike Rate" />
                          <Bar yAxisId="left" dataKey="runs" fill="url(#colorRuns)" name="Runs Scored" radius={[4, 4, 0, 0]}>
                            {kohliIPLHistory.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                opacity={highlightedYear === entry.year ? 1 : 0.75} 
                                fill={entry.year === 2016 ? "#eab308" : entry.year === 2024 ? "#fbbf24" : "#2563eb"}
                              />
                            ))}
                          </Bar>
                          <Line yAxisId="right" type="monotone" dataKey="average" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 8 }} name="Average" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Explanatory annotation box based on highlighted years */}
                    <div className="bg-[#090d1a] border border-slate-900 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-yellow-400 block font-mono">The Peak (2016 Season):</span>
                          <span className="text-slate-300 leading-relaxed block">
                            A legendary <strong>973 runs</strong> at an average of <strong>81.08</strong> with 4 centuries. Mechanically flawless, proving that an orthodox bat-pad tight alignment can absolutely demolish spinners and pacers alike without playing low-percentage slogs.
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-amber-400 block font-mono">The Evolution (2024 Season):</span>
                          <span className="text-slate-300 leading-relaxed block">
                            Scored <strong>741 runs</strong> at a highly accelerated strike-rate of <strong>154.69</strong>. This was achieved by introducing a slight acceleration of his trigger press without buckling his head position—maintaining elite consistency.
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-emerald-400 block font-mono">Statistical Consistency:</span>
                          <span className="text-slate-300 leading-relaxed block">
                            While modern hitters have strike-rates reaching 180+ at high volatility, Kohli's high control percentage ensures RCB rarely undergoes catastrophic top-order collapses. He has anchored the team securely across all editions.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold font-display text-white">Efficiency Frontier: Average vs. Strike Rate Comparison</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Mapping Kohli's peak and career averages against modern fearless batsman segments. Notice that Kohli occupies the coveted topright sector (High Average with high impact rating).
                      </p>
                    </div>

                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                          <XAxis 
                            type="number" 
                            dataKey="average" 
                            name="Average" 
                            unit="" 
                            stroke="#64748b" 
                            fontSize={11}
                            label={{ value: "Season/Career Average", position: "bottom", offset: 0, style: { fill: '#94a3b8', fontSize: 11 } }}
                            domain={[10, 90]}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="strikeRate" 
                            name="Strike Rate" 
                            unit="" 
                            stroke="#64748b"
                            fontSize={11}
                            label={{ value: "Strike Rate (SR)", angle: -90, position: "insideLeft", style: { fill: '#94a3b8', fontSize: 11 } }}
                            domain={[90, 250]}
                          />
                          <ZAxis type="number" dataKey="size" range={[60, 400]} />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }} 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-[#0f172a] border border-[#1e293b] p-3 rounded-md">
                                    <p className="font-bold text-amber-400">{data.name}</p>
                                    <p className="text-xs text-slate-200">Average: <span className="font-mono font-semibold">{data.average}</span></p>
                                    <p className="text-xs text-slate-200">Strike Rate: <span className="font-mono font-semibold">{data.strikeRate}</span></p>
                                    <p className="text-[10px] text-slate-400 mt-1 italic uppercase tracking-wider">{data.type === "kohli" ? "Archtype Master" : data.type === "fearless" ? "Fearless / High-Volatility" : "Standard Segment"}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Scatter name="Players" data={efficiencyScatterData}>
                            {efficiencyScatterData.map((entry, index) => {
                              let color = "#3b82f6"; // standard
                              if (entry.type === "kohli") color = "#fbbf24"; // kohli gold
                              if (entry.type === "fearless") color = "#f43f5e"; // fearless crimson
                              return <Cell key={`cell-${index}`} fill={color} stroke="#070b14" strokeWidth={1} />;
                            })}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center space-x-1.5">
                        <Info className="w-4 h-4 text-amber-500" />
                        <span>Analytical Fact: The "Volatility Gap"</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Modern fearless batters like Vaibhav Sooryavanshi (Strike Rate 236.56, Average 40 in 2026) show hyper-explosive numbers but carry a <strong>sustained risk trajectory</strong>. Biomechanical testing reveals that their pre-committed weight lean makes them highly exploitable by top-class bowlers who can alternate instantly between 145kph toes-yorkers and climbing rib-cage short balls. Virat Kohli's neutral balance guarantees a consistently wider buffer against sudden pacing changes, enabling long tournaments with higher wins.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== TAB 3: STRATEGIC GAMEPLAN ==================== */}
          {activeTab === "strategy" && (
            <motion.div
              key="strategy-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Layout for interactive pitch target coaching */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Cricket Pitch Map Visualizer */}
                <div className="lg:col-span-6 bg-[#0c1222] rounded-xl border border-[#1e293b] p-6 shadow-lg flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold font-mono text-slate-200 uppercase tracking-widest">
                      Bowler's Delivery Grid vs Kohli Balance
                    </h3>
                    <p className="text-xs text-slate-400">
                      Select match phase &amp; delivery trajectory to understand why bowling strategies against Kohli fail.
                    </p>
                  </div>

                  {/* Pitch Diagram */}
                  <div className="my-6 min-h-[350px] bg-[#090f1e] rounded-lg border border-slate-900 relative p-4 flex flex-col justify-between">
                    
                    {/* Phase Selector */}
                    <div className="flex bg-[#12192c] p-0.5 rounded border border-slate-800 w-fit z-20">
                      <button 
                        onClick={() => { setActivePitchPhase(0); setSelectedBallIndex(0); }}
                        className={`px-3 py-1 text-[10px] uppercase font-mono rounded ${
                          activePitchPhase === 0 ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Powerplay Targets
                      </button>
                      <button 
                        onClick={() => { setActivePitchPhase(1); setSelectedBallIndex(0); }}
                        className={`px-3 py-1 text-[10px] uppercase font-mono rounded ${
                          activePitchPhase === 1 ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Middle-Overs (Spin)
                      </button>
                    </div>

                    {/* Interactive Pitch Graphics */}
                    <div className="relative h-60 w-full bg-[#11192d] border border-slate-800 rounded-lg overflow-hidden my-4 flex items-center justify-center">
                      {/* Crease lines */}
                      <div className="absolute top-8 left-4 right-4 h-[1px] bg-slate-700/60" />
                      <div className="absolute bottom-8 left-4 right-4 h-[1px] bg-slate-700/60" />
                      
                      {/* Wickets representation top */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex space-x-1.5 justify-center z-10">
                        <div className="w-[3px] h-[10px] bg-amber-600 rounded-sm" />
                        <div className="w-[3px] h-[10px] bg-amber-600 rounded-sm" />
                        <div className="w-[3px] h-[10px] bg-amber-600 rounded-sm" />
                      </div>

                      {/* Wickets representation bottom */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-1.5 justify-center z-10">
                        <div className="w-[3px] h-[10px] bg-amber-600 rounded-sm" />
                        <div className="w-[3px] h-[10px] bg-amber-600 rounded-sm" />
                        <div className="w-[3px] h-[10px] bg-amber-600 rounded-sm" />
                      </div>

                      {/* Target dots on pitch (Line & Length) */}
                      {kohliMatchPhases[activePitchPhase].sequenceList.map((delivery, index) => {
                        // Hardcode specific X/Y positions on a vertical cricket pitch mock representation
                        const positions = [
                          { top: '35%', left: '42%' }, // Line/length 1
                          { top: '48%', left: '50%' }, // Line/length 2
                          { top: '65%', left: '55%' }  // Line/length 3
                        ];
                        const pos = positions[index];

                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedBallIndex(index)}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 z-25 ${
                              selectedBallIndex === index
                                ? "bg-amber-500 border-white text-black font-bold scale-125 animate-pulse"
                                : "bg-slate-900/95 border-amber-500/60 text-amber-500 hover:bg-slate-800 font-mono text-xs"
                            }`}
                            style={{ top: pos.top, left: pos.left }}
                          >
                            {index + 1}
                          </button>
                        );
                      })}

                      {/* Bat swing flight trajectory lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {selectedBallIndex === 0 && (
                          <path d="M 235,160 Q 230,105 250,60" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3 3 animate-dash" />
                        )}
                        {selectedBallIndex === 1 && (
                          <path d="M 245,170 Q 260,115 180,60" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3 3 animate-dash" />
                        )}
                        {selectedBallIndex === 2 && (
                          <path d="M 250,180 Q 210,130 200,60" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3 3 animate-dash" />
                        )}
                      </svg>
                      
                      {/* Stance placement label bottom */}
                      <div className="absolute bottom-1 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-mono text-slate-400">
                        PITCH TOP DOWN VIEW
                      </div>
                    </div>

                    {/* Delivery metadata banner */}
                    <div className="bg-[#111827] border border-slate-800 p-4 rounded-lg flex items-center justify-between text-xs z-10">
                      <div>
                        <span className="text-[10px] text-amber-500 uppercase tracking-widest font-mono block">DELIVERY TARGET:</span>
                        <span className="font-bold text-white text-sm">Ball #{selectedBallIndex + 1}: {kohliMatchPhases[activePitchPhase].sequenceList[selectedBallIndex]?.ballType}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block">EFFICIENCY CODE:</span>
                        <span className="text-emerald-400 font-mono font-bold block">100.0% SUCCESS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Step-by-Step Strategic Reaction Script */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div className="bg-[#0c1222] rounded-xl border border-[#1e293b] p-6 shadow-lg flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
                        <div className="w-1.5 h-6 bg-amber-500 rounded-sm" />
                        <div>
                          <h4 className="text-[11px] text-amber-500 font-mono tracking-widest uppercase">MATCH PHASE STRATEGY</h4>
                          <span className="text-base font-bold text-white tracking-tight">{kohliMatchPhases[activePitchPhase].phaseName} ({kohliMatchPhases[activePitchPhase].overs})</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-[#090e1a] p-3 rounded-lg border border-slate-900 italic">
                        "{kohliMatchPhases[activePitchPhase].criticalWhy}"
                      </p>

                      {/* Detailed Sequence analysis */}
                      <div className="space-y-4 pt-1">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Ball-by-Ball Neutralization Sequence</h5>
                        <div className="space-y-3.5">
                          {kohliMatchPhases[activePitchPhase].sequenceList.map((deliv, keyIdx) => (
                            <button
                              key={keyIdx}
                              onClick={() => setSelectedBallIndex(keyIdx)}
                              className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 flex items-start space-x-3.5 ${
                                selectedBallIndex === keyIdx
                                  ? "bg-[#141b2c] border-amber-500/80 shadow-md"
                                  : "bg-[#090e1a] border-slate-900 hover:border-slate-800"
                              }`}
                            >
                              <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                                selectedBallIndex === keyIdx
                                  ? "bg-amber-500 text-black"
                                  : "bg-slate-950 text-slate-400 border border-slate-800"
                              }`}>
                                {deliv.step}
                              </div>
                              <div className="space-y-1">
                                <span className={`text-[11px] font-mono block ${selectedBallIndex === keyIdx ? "text-amber-400 font-semibold" : "text-slate-400"}`}>
                                  {deliv.ballType}
                                </span>
                                <p className="text-[11px] text-slate-400 leading-normal font-sans">{neutralizeText(deliv.mechanism)}</p>
                                <p className="text-xs text-emerald-400 leading-relaxed font-semibold bg-[#0f1d19]/40 border border-emerald-950/60 p-2 rounded mt-1.5">
                                  <strong className="text-emerald-400 font-mono">VK REACTION: </strong> {neutralizeText(deliv.kohliResponse)}
                                </p>
                                <span className="text-[11px] text-white font-mono font-bold mt-1 block">RESULT: {neutralizeText(deliv.result)}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highly polished dynamic Matchup widget for the selected opponent */}
              <div className="bg-[#0b1220]/75 border border-[#1e293b] p-5 rounded-xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-15 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500 to-transparent pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 mb-4 gap-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Dynamic Matchup Board: vs. {briefingOpponent}</span>
                  </div>
                  <span className="text-[10px] bg-red-400/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded font-mono uppercase font-bold shrink-0 self-start sm:self-auto">
                    Threat: {getBowlerType(currentOpponentData.threatBowler)} ({currentOpponentData.threatType})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  <div className="space-y-1.5 bg-slate-950/40 p-4 rounded-lg border border-slate-900 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">KEY matchups</span>
                      <p className="text-slate-200 mt-2 leading-relaxed">
                        Against his primary matchups, Kohli averages <strong className="text-amber-400 font-mono">{currentOpponentData.average}</strong> with a strike rate of <strong className="text-amber-400 font-mono">{currentOpponentData.strikeRate}</strong>. In {currentOpponentData.innings} innings, he has hit {currentOpponentData.centuries} centuries and {currentOpponentData.fifties} fifties.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-slate-950/40 p-4 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-amber-500 font-mono uppercase tracking-wider block">TEAM BOWLING STYLE &amp; PROFILE</span>
                    <p className="text-slate-300 leading-relaxed mt-2">
                      <strong>Style:</strong> {currentOpponentData.bowlingStyle}<br />
                      <strong>Plan:</strong> {neutralizeText(currentOpponentData.attackStrategy)}
                    </p>
                  </div>

                  <div className="space-y-1.5 bg-slate-950/40 p-4 rounded-lg border border-slate-900 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">COACH AUDICIAL NEUTRALIZATION PLAN</span>
                      <p className="text-slate-300 leading-relaxed mt-2 font-sans italic">
                        "{neutralizeText(currentOpponentData.coachesSummary)}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyst block on team strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analystQuotes.map((quoteObj, qIdx) => (
                  <div key={qIdx} className="bg-[#0c1222] rounded-xl border border-[#1e293b] p-5 shadow-lg relative overflow-hidden">
                    <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest block mb-2">{quoteObj.author}</span>
                    <p className="text-xs text-slate-300 leading-relaxed italic z-10 relative">
                      "{quoteObj.quote}"
                    </p>
                    <div className="absolute right-2 bottom-2 font-mono text-[38px] font-bold text-slate-800/15 pointer-events-none uppercase">
                      QUOTE
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==================== TAB 4: EXECUTIVE BRIEFING / EXPORTER ==================== */}
          {activeTab === "briefing" && (
            <motion.div
              key="briefing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Exporter Controls banner */}
              <div className="bg-[#0c1222] border border-[#1e293b] p-6 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold font-display text-white">Generate Executive Performance Briefing Note</h3>
                    <p className="text-xs text-slate-400">
                      Instantly compile a professional-grade cricket tactical briefing for copy-pasting or printing. Zero editing required.
                    </p>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-5 border-t border-slate-800/60 pt-5">
                    {/* Opponent Selector - Premium Interactive Grid */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                          Target Opposition Strategy Suite
                        </label>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Active Selection: <strong className="text-amber-400">{briefingOpponent}</strong>
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 bg-[#12192c]/50 p-2 ml-0 rounded-xl border border-slate-800/80">
                        <button
                          onClick={() => setBriefingOpponent("All Teams")}
                          className={`px-3 py-2 text-xs rounded-lg font-black transition-all duration-200 uppercase font-mono tracking-wide flex items-center space-x-1 ${
                            briefingOpponent === "All Teams"
                              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25"
                              : "bg-[#18223c] text-amber-400 hover:bg-[#1f2d4e] border border-amber-500/20"
                          }`}
                        >
                          <span>🌐 ALL (OVERALL)</span>
                        </button>
                        
                        {[
                          { name: "Chennai Super Kings", abbrev: "CSK" },
                          { name: "Delhi Capitals", abbrev: "DC" },
                          { name: "Gujarat Titans", abbrev: "GT" },
                          { name: "Kolkata Knight Riders", abbrev: "KKR" },
                          { name: "Lucknow Super Giants", abbrev: "LSG" },
                          { name: "Mumbai Indians", abbrev: "MI" },
                          { name: "Punjab Kings", abbrev: "PBKS" },
                          { name: "Rajasthan Royals", abbrev: "RR" },
                          { name: "Sunrisers Hyderabad", abbrev: "SRH" }
                        ].map((team) => (
                          <button
                            key={team.name}
                            onClick={() => setBriefingOpponent(team.name)}
                            className={`px-2.5 py-2 text-xs rounded-lg transition-all duration-200 font-mono font-bold ${
                              briefingOpponent === team.name
                                ? "bg-amber-500 text-black shadow-md shadow-amber-500/15"
                                : "bg-[#161e32] text-slate-300 hover:bg-[#1e2a47] hover:text-white border border-slate-800/40"
                            }`}
                            title={team.name}
                          >
                            {team.abbrev}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tone Format Selector */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">Report Tone Format</label>
                      <div className="flex bg-[#12192c] p-0.5 rounded border border-slate-800">
                        <button
                          onClick={() => setBriefingFormat("executive")}
                          className={`px-3 py-1 text-xs rounded font-mono ${
                            briefingFormat === "executive" ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Franchise Exec
                        </button>
                        <button
                          onClick={() => setBriefingFormat("social")}
                          className={`px-3 py-1 text-xs rounded font-mono ${
                            briefingFormat === "social" ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Social/Blog
                        </button>
                        <button
                          onClick={() => setBriefingFormat("tactical")}
                          className={`px-3 py-1 text-xs rounded font-mono ${
                            briefingFormat === "tactical" ? "bg-amber-500 text-black font-semibold" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Coaching Lab
                        </button>
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              {/* Live Rendered Report Document Sheet */}
              <div 
                ref={briefRef}
                id="print-area-wrapper"
                className="bg-white text-slate-900 rounded-xl p-4 xs:p-6 sm:p-8 md:p-12 shadow-2xl relative border-t-8 border-amber-500 max-w-4xl mx-auto printing-custom-style font-serif"
              >
                {/* Decorative Report Letterhead */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-5 mb-6 gap-4">
                  <div className="text-left">
                    <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-600">VIRAT KOHLI PERFORMANCE STUDY</span>
                    <h2 className="text-xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-950 mt-1">THE ELITE REPORT CO.</h2>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-mono mt-1">PREPARED BY: VIKRAM S • CRICKET & PERFORMANCE ANALYST</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <p className="text-[10px] text-slate-500 font-mono">RESEARCH BY: VIKRAM S</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">FILE REQ: #VS18-TACTICAL-MASTERCLASS</p>
                  </div>
                </div>

                {/* Conditional format rendering */}
                {briefingFormat === "executive" && (
                  <div className="space-y-6 text-sm leading-relaxed text-slate-800">
                    <div className="bg-slate-100 p-4 rounded border-l-4 border-amber-500">
                      <h3 className="text-base font-bold text-slate-950 font-display">EXECUTIVE SUMMARY BRIEF</h3>
                      <p className="mt-1.5 text-xs text-slate-700 font-mono">
                        SUBJECT: Technical and Quantitative Justification of Virat Kohli's Superior Utility Against Modern High-Risk Sloggers
                      </p>
                    </div>

                    <section className="space-y-4">
                      <h4 className="text-base font-bold text-slate-950 uppercase border-b border-slate-300 pb-1 font-display">
                        I. The Biomechanical Foundation of Run-Scoring Mastery
                      </h4>
                      <p>
                        A biomechanical audit of recent tournament matches reveals why Virat Kohli remains the world's most consistent run-scorer, even as franchises draft hyper-aggressive flyers (like Vaibhav Sooryavanshi). Modern T20 openers routinely build massive strike rates (e.g., 230+) by pre-loading their weight to the off-side. However, this creates an <strong>unresolvable center-of-gravity collapse (specifically a 15cm off-center head dip)</strong> before the ball is released.
                      </p>
                      <p>
                        In stark contrast, Kohli operates on a principle of absolute postural equilibrium. Tracking frames of Kohli at three critical delivery points demonstrates the defense of his alignment:
                      </p>
                      <div className="pl-4 border-l-2 border-slate-300 space-y-3 font-sans text-xs my-3 text-slate-700">
                        <div>
                          <strong>Phase 1 (Pre-Delivery Stance):</strong> Kohli sits 50/50 centered. Weight is positioned completely neutral. He avoids early pre-commitment to any scoring segment.
                        </div>
                        <div>
                          <strong>Phase 2 (Bowler Release Point):</strong> During his back-and-across trigger press, his head axis remains locked on a sharp vertical axis. Eyes are kept parallel to the pitch's baseline, giving him an extra 0.08s of trajectory judgment window.
                        </div>
                        <div>
                          <strong>Phase 3 (Post-Release/Execution):</strong> Weight transfers exactly forward with knee stabilization. The bat drops smoothly alongside the front pad, leaving absolutely no gap. LBW and bowled routes are entirely sealed.
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-bold text-slate-950 uppercase border-b border-slate-300 pb-1 font-display">
                        II. Historical Stability &amp; resilience vs. {briefingOpponent}
                      </h4>
                      <p>
                        Reviewing Kohli's historical performance provides a mathematical basis for his anchor strategy when facing {briefingOpponent}. In head-to-head records, Kohli has registered <strong>{currentOpponentData.runs} runs</strong> over <strong>{currentOpponentData.innings} innings</strong>, maintaining a formidable average of <strong>{currentOpponentData.average}</strong> at a strike rate of <strong>{currentOpponentData.strikeRate}</strong>, backed by <strong>{currentOpponentData.centuries} hundreds</strong> and <strong>{currentOpponentData.fifties} half-centuries</strong>.
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-slate-800">
                        <li>
                          <strong>Volatilization Control:</strong> Traditional high-risk sluggers show a 42% dismissal risk in early overs when targeted by {briefingOpponent}'s dynamic plans. Kohli’s early dismissal rate drops under 15%, securing the top order against catastrophic failure.
                        </li>
                        <li>
                          <strong>Tactical Advantage:</strong> By remaining in equilibrium, he counters their primary team bowling strategy of: <em>{currentOpponentData.attackStrategy}</em>. This prevents their strike players from choking his utility output.
                        </li>
                      </ul>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-bold text-slate-950 uppercase border-b border-slate-300 pb-1 font-display">
                        III. Actionable Strategy Strategy Against {briefingOpponent}
                      </h4>
                      <p>
                        When confronting {briefingOpponent}, their bowling attacks will seek to trap Kohli using specific mechanical angles. Recommended tactical adjustments for execution:
                      </p>
                      <ol className="list-decimal pl-5 space-y-3 text-slate-800">
                        {currentOpponentData.tactics.map((tactic, idx) => (
                          <li key={idx}>
                            <strong>Plan {idx + 1}:</strong> {tactic}
                          </li>
                        ))}
                      </ol>
                    </section>

                    <div className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-mono text-slate-500 font-bold gap-2 text-center">
                      <span>ELITE RUN-SCORING PERFORMANCE AUDIT</span>
                      <span>DATA COMPILED BY VIKRAM S</span>
                    </div>
                  </div>
                )}

                {briefingFormat === "social" && (
                  <div className="space-y-6 text-sm leading-relaxed text-slate-800">
                    <div className="text-center space-y-2">
                      <span className="text-xs font-mono uppercase bg-amber-150 text-amber-800 font-bold px-2 py-0.5 rounded">MUST-READ ANALYSIS</span>
                      <h3 className="text-2xl font-extrabold text-slate-955 text-slate-950 font-display">
                        Why Virat Kohli is STILL the Master in a World of Fearless Sloggers
                      </h3>
                      <p className="text-xs text-slate-500 font-mono italic">Written by Vikram S • Cricket Analyst • Study vs. {briefingOpponent}</p>
                    </div>

                    <p>
                      T20 cricket is turning into an absolute home-run derby. We see teenagers like Vaibhav Sooryavanshi walking out and smashing a 236.56 strike-rate. It feels like anchoring is dead. But here is why the highest run-scorer in IPL history, Virat Kohli, is still the absolute pinnacle of short-form batting, especially when facing teams like **{briefingOpponent}**.
                    </p>

                    <section className="space-y-3">
                      <h4 className="font-bold text-slate-950 text-sm font-display">1. The Biomechanical Secret: Stillness is a Weapon</h4>
                      <p>
                        When you look at modern young guns, they are pre-jumping in their stances. They shift their weight flat to the offside to swing their massive bats. Perfect for flat decks, but a total recipe for disaster when top-tier express pacers arrive with swinging wickets.
                      </p>
                      <p>
                        Look at Kohli’s stance in three frames:
                      </p>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-xs">
                        <li><strong>Before the Bowler Releases:</strong> He is perfectly centered. Posture upright, weight completely neutral, loose hands.</li>
                        <li><strong>During Bowler Release:</strong> Back-and-across trigger. His eyes stay perfectly locked on a horizontal plane. No tilting. No pre-commitment.</li>
                        <li><strong>After Delivery arrival:</strong> Downswing is beautifully straight. The bat-pad gap is sealed. You cannot bowl him or trap him LBW.</li>
                      </ul>
                    </section>

                    <section className="space-y-3">
                      <h4 className="font-bold text-slate-950 text-sm font-display">2. Dominant Head-to-Head Numbers vs {briefingOpponent}</h4>
                      <p>
                        The quantitative metrics backing Kohli are staggering. In head-to-head matches against the {briefingOpponent} bowling attack, Kohli has scored <strong>{currentOpponentData.runs} runs</strong> in <strong>{currentOpponentData.innings} innings</strong>, averaging an imposing <strong>{currentOpponentData.average}</strong> with an optimized strike rate of <strong>{currentOpponentData.strikeRate}</strong>.
                      </p>
                      <p>
                        Against {briefingOpponent}'s premiere threat bowler <strong>{getBowlerType(currentOpponentData.threatBowler)}</strong> ({currentOpponentData.threatType}), Kohli's strict biomechanical alignment shields him against their best strategies, turning high-danger deliveries into controlled runs.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h4 className="font-bold text-slate-950 text-sm font-display">3. The Takeaway</h4>
                      <p>
                        Slogging has its place, but class remains permanent. Next time you see Kohli punch an off-stump ball through the covers on the rise, remember: it isn't just aesthetic—it is a biomechanical masterclass engineered for absolute run scoring efficiency.
                      </p>
                    </section>

                    <p className="text-xs sm:text-sm font-bold font-mono text-slate-600 border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center">
                      <span>Author: Vikram S • Cricket & Performance Analyst</span>
                      <span className="hidden sm:inline">Share this analysis!</span>
                    </p>
                  </div>
                )}

                {briefingFormat === "tactical" && (
                  <div className="space-y-6 text-sm leading-relaxed text-slate-800">
                    <div className="bg-slate-900 text-white p-5 rounded">
                      <h3 className="text-lg font-bold font-display text-white">BIOMECHANICAL BRIEFING &amp; FIELD COACHING SHEET</h3>
                      <p className="text-[11px] font-mono text-amber-400 mt-1 uppercase">
                        COACHING REPORT: Technical Equilibrium Audit vs. {briefingOpponent} Mechanics
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-950 uppercase text-xs font-mono tracking-widest text-slate-600">I. Stance Integrity &amp; Matchup Metrics</h4>
                        <div className="border border-slate-200 rounded overflow-x-auto scrollbar-none text-xs">
                          <table className="w-full min-w-[640px]">
                            <thead>
                              <tr className="bg-slate-100 border-b border-slate-200">
                                <th className="p-2 text-left font-bold">Biomechanical Attribute / Matchup</th>
                                <th className="p-2 text-left font-bold">Virat Kohli vs. {briefingOpponent}</th>
                                <th className="p-2 text-left font-bold">Typical Powerhitter Stance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-200">
                                <td className="p-2 font-semibold">Head Axis Stability</td>
                                <td className="p-2 text-emerald-700 font-medium">Locked vertical axis. Still through release.</td>
                                <td className="p-2 text-rose-700">Dips 15° off-side early. Blurs trajectory.</td>
                              </tr>
                              <tr className="border-b border-slate-200">
                                <td className="p-2 font-semibold">Stance Center of Gravity</td>
                                <td className="p-2 text-emerald-700 font-medium">50-50 neutral base. Wide adjustments.</td>
                                <td className="p-2 text-rose-700">65-35 offside preloading. Traps front leg.</td>
                              </tr>
                              <tr className="border-b border-slate-200">
                                <td className="p-2 font-semibold">Bat-Pad Gap Seal</td>
                                <td className="p-2 text-emerald-700 font-medium">Tight downswing loop. No gap.</td>
                                <td className="p-2 text-rose-700">Clears front knee early. Opens gate.</td>
                              </tr>
                              <tr className="border-b border-slate-200">
                                <td className="p-2 font-semibold font-mono text-[11px] text-slate-500">Opponent Track Record</td>
                                <td className="p-2 text-emerald-800 font-semibold">{currentOpponentData.runs} Runs (Innings: {currentOpponentData.innings}, Avg: {currentOpponentData.average}, SR: {currentOpponentData.strikeRate})</td>
                                <td className="p-2 text-rose-700">Averages under 22.0 in high-risk zones</td>
                              </tr>
                              <tr className="border-b border-slate-200">
                                <td className="p-2 font-semibold font-mono text-[11px] text-slate-500">Key Threat Bowler</td>
                                <td className="p-2 text-emerald-800 font-medium">{getBowlerType(currentOpponentData.threatBowler)} ({currentOpponentData.threatType})</td>
                                <td className="p-2 text-rose-700">Targeted with early swing or flat mystery line traps</td>
                              </tr>
                              <tr>
                                <td className="p-2 font-semibold text-slate-500">Control Rating Index</td>
                                <td className="p-2 text-emerald-700 font-semibold">83.4% control. Ground path priority.</td>
                                <td className="p-2 text-rose-700">61.8% control. Top edges to deep leg.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-950 uppercase text-xs font-mono tracking-widest text-slate-600">II. Execution Plans Against {briefingOpponent} Patterns</h4>
                        <ul className="space-y-3 pl-4 list-decimal text-slate-800">
                          {currentOpponentData.tactics.map((tactic, idx) => {
                            const [label, text] = tactic.split(":");
                            return (
                              <li key={idx}>
                                <strong>{label ? label.trim() : "Plan"}:</strong> {text ? text.trim() : tactic}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-500 font-bold gap-2 text-center">
                      <span>REPORT COMPILED BY VIKRAM S</span>
                      <span>ALL RIGHTS RESERVED • CO-OPERATIONAL STUDY</span>
                    </div>
                  </div>
                )}

                {/* Technical Appendix: Kinematic Snapshots Plate for Shareable / Print Output */}
                <div className="mt-8 border-t-2 border-slate-900 pt-6">
                  <div className="html2pdf__page-break"></div>
                  <KinematicSnapshots isPrintOnly={true} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Creator Collaboration / Feedback & Portfolio Panel */}
      <section className="max-w-7xl mx-auto px-4 mt-16 sm:px-6">
        <div className="bg-gradient-to-r from-slate-950 via-[#0d1325] to-slate-950 border border-slate-900 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle background glow representing active dynamic radar arcs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10 w-full">
            <div className="space-y-4 max-w-2xl w-full">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-amber-500 font-bold tracking-widest uppercase block">
                  ANALYST ECOSYSTEM &amp; COLLABORATION
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Designed &amp; Compiled by Vikram S
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                  I construct advanced dynamic posture canvases, kinematic analytics engines, and matchup-based strategy plans for elite athletic coordination. Explore my expert core assets below or reach out directly to join my professional network.
                </p>
              </div>

              {/* Upgraded Expert Capabilities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                <div className="flex items-start space-x-2.5 bg-[#0a0f1d]/90 p-3 rounded-xl border border-slate-900">
                  <Sliders className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Kinematic Posture Modeling</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Continuous dynamic rig simulations of elite batting setup profiles.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 bg-[#0a0f1d]/90 p-3 rounded-xl border border-slate-900">
                  <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Tactical Matchup Metrics</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Bowler release angle mapping and dismissals risk diagnostic audits.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 bg-[#0a0f1d]/90 p-3 rounded-xl border border-slate-900">
                  <Target className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Mitigation Gameplans</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Practical on-field coaching drill sheets &amp; situational response rules.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto self-stretch lg:self-auto shrink-0 mt-4 lg:mt-0">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=vikramshivahuchaiah01@gmail.com&su=Virat%20Kohli%20Biomechanical%20Analysis%20Platform%20Feedback"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-amber-500/10 border border-amber-500/10 active:scale-[0.98] w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>Contact via Email</span>
              </a>
              <a
                href="https://www.linkedin.com/in/vikram-s-a4733225a"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b0f19] hover:bg-slate-900 text-slate-200 hover:text-white font-semibold text-xs py-3 px-5 rounded-xl flex items-center justify-center space-x-2 transition border border-slate-800 active:scale-[0.98] w-full sm:w-auto"
              >
                <ExternalLink className="w-4 h-4 text-amber-500" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding block */}
      <footer className="bg-[#0b0f19] border-t border-[#1e293b]/60 mt-16 py-8 px-6 text-center text-slate-400">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-xs font-mono tracking-wider text-slate-500">
            VIRAT KOHLI TACTICAL PERFORMANCE ANALYSIS PLATFORM
          </p>
          <div className="flex justify-center space-x-6 text-xs text-slate-400">
            <span>Analytics Index: v1.8.0</span>
            <span>Reference Datasets: ESPNcricinfo &amp; BCCI feeds</span>
          </div>
        </div>
      </footer>

      {/* Real-time custom toast alert for synchronized live events */}
      <AnimatePresence>
        {toast && toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0b0f19] border-2 border-amber-500 rounded-xl p-4 shadow-2xl shadow-amber-500/20"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-amber-500/15 p-2 rounded-lg border border-amber-500/20 text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-extrabold text-white tracking-tight">{toast.message}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.subMessage}</p>
              </div>
              <button
                onClick={() => setToast(prev => prev ? { ...prev, visible: false } : null)}
                className="text-slate-400 hover:text-white p-0.5 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 overflow-hidden bg-slate-800 h-1 rounded-full w-full">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 7, ease: "linear" }}
                className="bg-amber-500 h-full rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
