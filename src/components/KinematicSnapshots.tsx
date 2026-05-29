import React from "react";
import { Camera, Eye, Zap, Shield, ArrowRight } from "lucide-react";

interface SnapshotProps {
  isPrintOnly?: boolean;
}

export default function KinematicSnapshots({ isPrintOnly = false }: SnapshotProps) {
  const snapshots = [
    {
      frame: "Frame 01",
      title: "Pre-Delivery Balance",
      subtitle: "Stance Baseline (T - 0.8s)",
      desc: "Perfect postural alignment prior to the bowler reaching load-up. Hand positioning is fully relaxed, creating a neutral base that prevents any premature commitment.",
      insights: ["50/50 Lateral Weight Distribution", "Upright neutral spine alignment", "Low-backlift slip alignment"],
      svg: (
        <svg viewBox="0 0 200 240" className="w-full h-full text-current print:text-slate-900" style={{ minHeight: "180px" }}>
          <defs>
            <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" className="fill-transparent" />
          
          {/* Ground Line */}
          <line x1="20" y1="210" x2="180" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.5" />
          
          {/* Vertical axis line */}
          <line x1="100" y1="20" x2="100" y2="220" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
          
          {/* Kohli Wireframe */}
          {/* Head (100, 50) */}
          <circle cx="100" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="50" r="3" fill="#fbbf24" />
          
          {/* Spine (100, 60) to (100, 110) */}
          <line x1="100" y1="60" x2="100" y2="120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          
          {/* Off-Side shoulder (85, 68) & Back-Side shoulder (115, 65) */}
          <line x1="85" y1="68" x2="115" y2="65" stroke="currentColor" strokeWidth="2" />
          
          {/* Front Leg: hip (100, 120) -> knee (75, 160) -> foot (70, 210) */}
          <line x1="100" y1="120" x2="75" y2="160" stroke="currentColor" strokeWidth="2.5" />
          <line x1="75" y1="160" x2="70" y2="210" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Back Leg: hip (100, 120) -> knee (125, 160) -> foot (130, 210) */}
          <line x1="100" y1="120" x2="125" y2="160" stroke="currentColor" strokeWidth="2.5" />
          <line x1="125" y1="160" x2="130" y2="210" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

          {/* Hands & Bat */}
          {/* Bat handle starting at hip level (100, 105), angled down to slips */}
          <line x1="105" y1="105" x2="135" y2="155" stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round" />
          {/* Hands from shoulders meeting at bat handle */}
          <line x1="85" y1="68" x2="105" y2="105" stroke="currentColor" strokeWidth="1.5" />
          <line x1="115" y1="65" x2="105" y2="105" stroke="currentColor" strokeWidth="1.5" />

          {/* Posture alignment nodes */}
          <circle cx="100" cy="120" r="3.5" fill="currentColor" opacity="0.5" />
          <circle cx="75" cy="160" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="125" cy="160" r="3" fill="currentColor" opacity="0.5" />

          {/* Ocular line of sight */}
          <line x1="100" y1="48" x2="40" y2="48" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 1" opacity="0.6" />
          
          {/* Labels annotations */}
          <text x="105" y="42" fontSize="8" className="font-mono fill-current font-bold">STILL HEAD</text>
          <text x="110" y="115" fontSize="8" className="font-mono fill-slate-500">50/50 CoM</text>
          <text x="140" y="150" stroke="none" fill="#fbbf24" fontSize="8" className="font-mono">SLIP FACE</text>
        </svg>
      )
    },
    {
      frame: "Frame 02",
      title: "Bowler Release Point",
      subtitle: "The Signature Trigger (T = 0.00s)",
      desc: "During bowler release, Kohli engages a backward-and-across press (+8cm towards off-stump). Stance closes organically without tilting his horizontal ocular plane.",
      insights: ["Locked Horizon (eyes level)", "Hips closed off to line-of-fire", "Off-stump channel covered"],
      svg: (
        <svg viewBox="0 0 200 240" className="w-full h-full text-current print:text-slate-900" style={{ minHeight: "180px" }}>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" className="fill-transparent" />
          
          {/* Ground Line */}
          <line x1="20" y1="210" x2="180" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.5" />
          
          {/* Original reference axis (Frame 01 position) */}
          <line x1="100" y1="20" x2="100" y2="220" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
          
          {/* Shifted Trigger Axis (offset by 12px) */}
          <line x1="112" y1="20" x2="112" y2="220" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.5" />
          <path d="M 100 80 L 112 80" stroke="#ef4444" strokeWidth="1" markerEnd="url(#arrow)" />

          {/* Kohli Wireframe - Shifted 12px back-and-across */}
          {/* Head (112, 50) */}
          <circle cx="112" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="112" cy="50" r="3" fill="#fbbf24" stroke="none" />
          
          {/* Spine (112, 60) to (112, 120) */}
          <line x1="112" y1="60" x2="112" y2="120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          
          {/* Closed Shoulder orientation (97, 68) & (127, 64) */}
          <line x1="97" y1="68" x2="127" y2="64" stroke="currentColor" strokeWidth="2" />
          
          {/* Front Leg: hip (112, 120) -> knee (87, 160) -> foot (82, 210) */}
          <line x1="112" y1="120" x2="87" y2="160" stroke="currentColor" strokeWidth="2.5" />
          <line x1="87" y1="160" x2="82" y2="210" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Back Leg: hip (112, 120) -> knee (137, 160) -> foot (142, 210) */}
          <line x1="112" y1="120" x2="137" y2="160" stroke="currentColor" strokeWidth="2.5" />
          <line x1="137" y1="160" x2="142" y2="210" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

          {/* Hands & Loaded Bat cocked slightly higher */}
          <line x1="117" y1="100" x2="147" y2="135" stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="97" y1="68" x2="117" y2="100" stroke="currentColor" strokeWidth="1.5" />
          <line x1="127" y1="64" x2="117" y2="100" stroke="currentColor" strokeWidth="1.5" />

          {/* Joint nodes */}
          <circle cx="112" cy="120" r="3.5" fill="currentColor" opacity="0.5" />
          <circle cx="87" cy="160" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="137" cy="160" r="3" fill="currentColor" opacity="0.5" />

          {/* Level horizon indicator */}
          <line x1="112" y1="48" x2="40" y2="48" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Labels */}
          <text x="124" y="42" fontSize="8" className="font-mono fill-current font-bold text-amber-500">TRIGGER: +8cm</text>
          <text x="124" y="110" fontSize="8" className="font-mono fill-slate-500">Locked Core</text>
          <text x="45" y="42" stroke="none" fill="#10b981" fontSize="8" className="font-mono font-bold">0° HORIZON</text>
        </svg>
      )
    },
    {
      frame: "Frame 03",
      title: "Contact & Execution",
      subtitle: "Downswing Impact (T + 0.15s)",
      desc: "Dynamic forward reach. Front shoulder leads downward, hips rotate aggressively, and the downswing locks precisely flush against the front pad to seal the gate.",
      insights: ["Zero Bat-Pad air gap", "Impact registered under eye line", "Stable rotational front brace"],
      svg: (
        <svg viewBox="0 0 200 240" className="w-full h-full text-current print:text-slate-900" style={{ minHeight: "180px" }}>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" className="fill-transparent" />
          
          {/* Ground Line */}
          <line x1="20" y1="210" x2="180" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.5" />
          
          {/* Ball flight vector line */}
          <path d="M 20 180 L 70 180" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="70" cy="180" r="3.5" fill="#f43f5e" />

          {/* Kohli Wireframe - Lunging forward defensive pose */}
          {/* Head (105, 80) - Lead forward & downward */}
          <circle cx="105" cy="80" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="105" cy="80" r="3" fill="#fbbf24" />
          
          {/* Spine inclined forward: head (105, 80) -> hip (130, 130) */}
          <line x1="105" y1="90" x2="130" y2="130" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          
          {/* Front shoulder (90, 95) & back shoulder (120, 90) */}
          <line x1="90" y1="95" x2="120" y2="90" stroke="currentColor" strokeWidth="2" />
          
          {/* Front lunging leg: hip (130, 130) -> knee (74, 175) -> foot (70, 210) */}
          <line x1="130" y1="130" x2="74" y2="175" stroke="currentColor" strokeWidth="2.8" />
          <line x1="74" y1="175" x2="70" y2="210" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          
          {/* Back braced leg: hip (130, 130) -> knee (155, 175) -> foot (165, 210) */}
          <line x1="130" y1="130" x2="155" y2="175" stroke="currentColor" strokeWidth="2.2" />
          <line x1="155" y1="175" x2="165" y2="210" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />

          {/* Straight Vertical Bat Flush with Front Knee */}
          {/* Contact point at (70, 180), Bat extends to hands at (85, 135) */}
          <line x1="85" y1="125" x2="68" y2="195" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
          {/* Hands meeting handle */}
          <line x1="90" y1="95" x2="85" y2="125" stroke="currentColor" strokeWidth="1.5" />
          <line x1="120" y1="90" x2="85" y2="125" stroke="currentColor" strokeWidth="1.5" />

          {/* Tight Loop highlighting "Zero Gap" */}
          <ellipse cx="72" cy="180" rx="10" ry="16" fill="#10b981" opacity="0.15" />

          {/* Joint nodes */}
          <circle cx="130" cy="130" r="3.5" fill="currentColor" opacity="0.5" />
          <circle cx="74" cy="175" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="155" cy="175" r="3" fill="currentColor" opacity="0.5" />

          {/* Sight plumb line down to contact point */}
          <line x1="105" y1="80" x2="70" y2="180" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 3" />
          
          {/* Labels */}
          <text x="118" y="78" fontSize="8" className="font-mono fill-current font-bold">EYES OVER BALL</text>
          <text x="42" y="150" stroke="none" fill="#10b981" fontSize="8" className="font-mono font-bold">ZERO GAP</text>
          <text x="145" y="165" fontSize="8" className="font-mono fill-slate-500">Braced base</text>
        </svg>
      )
    }
  ];

  if (isPrintOnly) {
    // Elegant letterpress inline wireframe document rendering for PDF Print
    return (
      <div className="my-8 page-break-inside-avoid">
        <div className="border-t border-b border-slate-900 py-3 mb-6">
          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase block">KINESTHETIC TELEMETRY &amp; FRAME GRAPHICS</span>
          <h5 className="text-sm font-bold text-slate-900 font-display">CHRONOPHOTOGRAPHIC INSTAGRAM RE-POST SERIES</h5>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {snapshots.map((snap) => (
            <div key={snap.frame} className="border border-slate-300 p-4 rounded bg-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-2">
                  <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">{snap.frame}</span>
                  <span className="font-mono text-[8px] text-slate-500 uppercase tracking-tight">VK DATA RECORD</span>
                </div>
                <h6 className="text-xs font-bold text-slate-950 font-display">{snap.title}</h6>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-none">{snap.subtitle}</p>
              </div>

              <div className="my-3 bg-slate-50 border border-slate-100 rounded flex items-center justify-center p-2 stroke-slate-950 text-slate-950">
                {snap.svg}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-700 leading-normal">{snap.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {snap.insights.map((ins, i) => (
                    <span key={i} className="bg-slate-100 text-[8px] text-slate-800 px-1 py-0.5 rounded font-mono">
                      ✓ {ins}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 no-print">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Instagram Snapshot Deck</h3>
          </div>
          <p className="text-xs text-slate-400">
            Interactive visual storyboard tracing Kohli's physical equilibrium across three frame delivery captures.
          </p>
        </div>
        <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded font-mono uppercase tracking-wide">
          LinkedIn / IG Shareable Frame Layout
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {snapshots.map((snap, sIdx) => (
          <div 
            key={snap.frame} 
            className="group relative bg-[#0c1222] border border-[#1e293b] hover:border-amber-500/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            {/* Slide decoration/headers */}
            <div className="p-4 border-b border-[#1e293b]/50 flex items-center justify-between bg-[#10192d]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{snap.frame}</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">SHOT ANALYSIS</span>
            </div>

            {/* Simulated camera viewfinder frame */}
            <div className="p-4 bg-[#060a14] flex items-center justify-center relative select-none">
              {/* Corner brackets simulating camera frame */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-700 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-slate-700 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-slate-700 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-700 pointer-events-none" />
              
              <div className="w-full h-full max-h-[220px] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center text-slate-400">
                {snap.svg}
              </div>
            </div>

            {/* Slide details */}
            <div className="p-5 space-y-3.5 bg-[#0c1222] mt-auto">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                  {snap.title}
                </h4>
                <p className="text-[10px] text-amber-500/80 font-mono tracking-tight">{snap.subtitle}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans min-h-[50px]">
                {snap.desc}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">Kinetic Telemetry:</span>
                <div className="space-y-1">
                  {snap.insights.map((ins, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-[10px] text-slate-300">
                      <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bottom ribbon matching Instagram footer design */}
            <div className="p-3 bg-[#0a0f19] border-t border-[#1e293b]/40 flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-slate-400" />
                <span>TELEMETRY LIVE</span>
              </span>
              <span>1.8.0-VK-ACTIVE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
