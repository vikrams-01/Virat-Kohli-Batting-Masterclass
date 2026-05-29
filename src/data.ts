/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CareerStat {
  year: number;
  runs: number;
  average: number;
  strikeRate: number;
  centuries: number;
  fifties: number;
  highScore: string;
}

export interface MetricComparison {
  metric: string;
  kohli: number | string;
  kohliDesc: string;
  modernBatter: number | string;
  modernDesc: string;
  impactLabel: string;
}

export interface DetailedPhaseAnalysis {
  phase: string;
  title: string;
  subtitle: string;
  coachesTake: string;
  imageRepresentation: string;
  keyMechanics: {
    title: string;
    description: string;
    status: "optimal" | "warning";
  }[];
  criticalInsights: string[];
}

export interface BowlingStrategyMatchPhase {
  phaseName: string;
  overs: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  criticalWhy: string;
  sequenceList: {
    step: number;
    ballType: string;
    mechanism: string;
    kohliResponse: string;
    result: string;
  }[];
}

// 1. Full Career Statistics of Virat Kohli in IPL History
export const kohliIPLHistory: CareerStat[] = [
  { year: 2008, runs: 165, average: 15.00, strikeRate: 105.09, centuries: 0, fifties: 0, highScore: "38" },
  { year: 2009, runs: 246, average: 22.36, strikeRate: 112.32, centuries: 0, fifties: 0, highScore: "50" },
  { year: 2010, runs: 307, average: 27.90, strikeRate: 144.81, centuries: 0, fifties: 1, highScore: "58" },
  { year: 2011, runs: 557, average: 46.41, strikeRate: 121.08, centuries: 0, fifties: 4, highScore: "71" },
  { year: 2012, runs: 364, average: 28.00, strikeRate: 111.65, centuries: 0, fifties: 2, highScore: "73" },
  { year: 2013, runs: 634, average: 45.28, strikeRate: 138.73, centuries: 0, fifties: 6, highScore: "99" },
  { year: 2014, runs: 359, average: 27.61, strikeRate: 122.10, centuries: 0, fifties: 2, highScore: "73" },
  { year: 2015, runs: 505, average: 45.90, strikeRate: 130.82, centuries: 0, fifties: 3, highScore: "82*" },
  { year: 2016, runs: 973, average: 81.08, strikeRate: 152.03, centuries: 4, fifties: 7, highScore: "113" },
  { year: 2017, runs: 308, average: 30.80, strikeRate: 122.22, centuries: 0, fifties: 4, highScore: "64" },
  { year: 2018, runs: 530, average: 48.18, strikeRate: 139.10, centuries: 0, fifties: 4, highScore: "92*" },
  { year: 2019, runs: 464, average: 33.14, strikeRate: 141.46, centuries: 1, fifties: 2, highScore: "100" },
  { year: 2020, runs: 466, average: 42.36, strikeRate: 121.35, centuries: 0, fifties: 3, highScore: "90*" },
  { year: 2021, runs: 405, average: 28.92, strikeRate: 119.46, centuries: 0, fifties: 3, highScore: "72*" },
  { year: 2022, runs: 341, average: 22.73, strikeRate: 115.98, centuries: 0, fifties: 2, highScore: "73" },
  { year: 2023, runs: 639, average: 53.25, strikeRate: 139.82, centuries: 2, fifties: 6, highScore: "101*" },
  { year: 2024, runs: 741, average: 61.75, strikeRate: 154.69, centuries: 1, fifties: 5, highScore: "113*" },
  { year: 2025, runs: 652, average: 46.57, strikeRate: 148.40, centuries: 1, fifties: 4, highScore: "105*" },
];

export const IPLCareerTotals = {
  matches: 278,
  innings: 268,
  runs: 9261,
  average: 39.4,
  strikeRate: 133.5,
  centuries: 10,
  fifties: 64,
  fours: 820,
  sixes: 295,
  highScore: "113*"
};

// 2. Direct Technical Comparison: Kohli's Anchoring vs. Modern Ultra-Risk Hitters
export const technicalComparisons: MetricComparison[] = [
  {
    metric: "Head Axis & Stability",
    kohli: "100% Locked",
    kohliDesc: "Head stays perfectly vertical through bowler's release. Direct horizontal line of sight.",
    modernBatter: "Early Off-Side Dip",
    modernDesc: "Pre-committed lean. Dip causes the head to drift up to 15cm off-center, impairing trajectory judgment.",
    impactLabel: "Judgment Window"
  },
  {
    metric: "Weight Distribution",
    kohli: "50-50 Balanced",
    kohliDesc: "Weight evenly split on ball-of-foot. True neutral point of origin allows instant forward or back trigger.",
    modernBatter: "65-35 Off-Side Bias",
    modernDesc: "Pre-loading weight onto the front/off side to clear hips early. Traps the front foot.",
    impactLabel: "Reactibility"
  },
  {
    metric: "Control Percentage",
    kohli: "83.4%",
    kohliDesc: "Extreme control. Rare top-edges or mistimed slashes because the bat path stays strictly inside-out.",
    modernBatter: "61.8%",
    modernDesc: "High rate of mistimed shots, top edges, or bat-shoulder contact due to cross-batted swing paths.",
    impactLabel: "Dismissal Risk"
  },
  {
    metric: "Bat-Pad Gap Integrity",
    kohli: "Zero Air Gap",
    kohliDesc: "The downswing plane tracks exactly alongside the front pad, eliminating inside routing.",
    modernBatter: "Exploitable Gap",
    modernDesc: "Early clearing of the front leg leaves a 10-15cm gap between bat and pad—susceptible to straight seed/yorkers.",
    impactLabel: "Bowled / LBW Rate"
  },
  {
    metric: "Attack Versatility",
    kohli: "360° Option",
    kohliDesc: "Scoring sectors evenly scattered. Wrist manipulation allows late-forcing of gaps in both segments.",
    modernBatter: "V-Segment Dominant",
    modernDesc: "Heavily reliant on slog-sweep or deep-midwicket clearing, making field choking highly effective.",
    impactLabel: "Field Defiance"
  }
];

// 3. Three-Phase Trigger Mechanics breakdown (Matches Image 1, 2, 3)
export const threePhaseMechanics: DetailedPhaseAnalysis[] = [
  {
    phase: "Image 1 (Pre-Delivery)",
    title: "The Stance & Equilibrium",
    subtitle: "Before bowler reaches load-up (T - 0.8s)",
    coachesTake: "Traditional neutral setup. Weight centered over both insteps. Notice how still Kohli sits compared to modern power hitters. His bat rests lightly behind his back heel with a relaxed low backlift, hiding his ultimate hitting arc from the bowler.",
    imageRepresentation: "stance_analysis",
    keyMechanics: [
      {
        title: "Weight Centration",
        description: "50/50 balance. Feet aligned slightly wider than shoulder-width, providing a solid lateral base without losing spring.",
        status: "optimal"
      },
      {
        title: "Upper-Body Neutrality",
        description: "Trunk stays upright with a micro-tilt forward. Rigid posture is eschewed in favor of relaxed muscular readiness.",
        status: "optimal"
      },
      {
        title: "Lower Backlift Angle",
        description: "Bat face angled toward first slip, ensuring a minimal distance travel loop once the downswing commences.",
        status: "optimal"
      }
    ],
    criticalInsights: [
      "No premature movement: Unlike Vaibhav Sooryavanshi who pre-commits weight off-side at this point, Kohli remains completely neutral.",
      "Conserves kinetic energy: By staying loose, muscle groups remain fast-twitch responsive.",
      "Bowler blindfold: Gives no early pre-room cues or lap-sweep intentions."
    ]
  },
  {
    phase: "Image 2 (Release Point)",
    title: "Signature Back-and-Across Trigger",
    subtitle: "Just as bowler releases the ball (T = 0.00s)",
    coachesTake: "The defining trigger mechanism of modern cricket. Kohli presses back-and-across towards off-stump, shifting his base by 5-10cm. This locks his head directly over his front knee, keeping his line of sight perfectly parallel of the pitch's plane.",
    imageRepresentation: "trigger_movement",
    keyMechanics: [
      {
        title: "Absolute Head Lock",
        description: "Zero dip. The eyes sit on a perfect horizontal plane, remaining perfectly steady throughout the ball's departure.",
        status: "optimal"
      },
      {
        title: "The Off-Stump Cover",
        description: "The micro-step across covers the off-stump range, forcing bowlers to bowl within his ocular target or drift wide.",
        status: "optimal"
      },
      {
        title: "Closed Shoulder Alignment",
        description: "Front shoulder remains pointing at the bowler, locking the chest inside and protecting against early front-side leakage.",
        status: "optimal"
      }
    ],
    criticalInsights: [
      "Secures the off-stump channel: By moving slightly across, he converts 'good-length' outside off deliveries into reliable punch regions.",
      "Protects against the inswinger: Stance adjustment keeps the hips closed, preventing the front leg from getting 'stuck' across the wickets.",
      "Maximizes reaction window: Still eyes allow rapid tracking of variations (slower balls/cutters)."
    ]
  },
  {
    phase: "Image 3 (Weight Transfer & Execution)",
    title: "Dynamic Contact & Base Control",
    subtitle: "Mid-flight to Point of Contact (T + 0.15s)",
    coachesTake: "Immaculate ball traversal. If the ball is full, weight slides forward with head preceding the bat. Note the complete closure of the bat-pad loop: the bat comes down perfectly straight and late, pushing right under the eye line.",
    imageRepresentation: "execution_reach",
    keyMechanics: [
      {
        title: "Vertical Bat Axis",
        description: "Downswing tracks as a pure pendulum. Bat and pad act as a unified wall, removing any risk of inside edge.",
        status: "optimal"
      },
      {
        title: "Braced Supporting Knee",
        description: "Front knee remains flexed but braced, acting as a rotational brake that converts forward momentum into severe bat speed.",
        status: "optimal"
      },
      {
        title: "Wrists Leverage Point",
        description: "Late wrist snap at contact enables path deflection without altering the bat's core kinetic direction.",
        status: "optimal"
      }
    ],
    criticalInsights: [
      "High Control Index: Pushing exactly under his face guarantees the ball stays grounded unless deliberately lofted.",
      "Mastery of late deflection: Even if the ball swings late, his soft hands absorb extra recoil, resulting in delicate runs past third man.",
      "Infinite adjustment: Retaining a bent, springy front knee means he can adapt to dynamic bounce heights half-way through the swing."
    ]
  }
];

// 4. Strategic Bowling Match Phases & Kohli's Neutralization of the Attack
export const kohliMatchPhases: BowlingStrategyMatchPhase[] = [
  {
    phaseName: "The Powerplay",
    overs: "Overs 1 – 6",
    riskLevel: "LOW",
    criticalWhy: "In this phase, modern hitters lean forward aggressively to clear infielders, making them vulnerable to early yorkers. Conversely, Kohli exploits the field restrictions with low-risk ground strokes through the cover-point gaps, scoring at a 140+ SR with zero high-risk aerial elements.",
    sequenceList: [
      {
        step: 1,
        ballType: "Outswinger on 5th Stump",
        mechanism: "Ball pitches on good length, angling away to invite a loose drive.",
        kohliResponse: "Allows the ball to reach right under his eyes, punching it on the rise through covers with bent elbows.",
        result: "Boundary (4) or sterile dot - absolute safety."
      },
      {
        step: 2,
        ballType: "Hard Inswinger or Yorker on Leg-Stump",
        mechanism: "Hoping to trap his feet behind his across-trigger.",
        kohliResponse: "Subtle wrist roll. Angles his bat face late, using his strong wrists to sweep-flick the ball from off/middle to deep mid-wicket.",
        result: "Boundary (4) - exploits field gap behind square."
      },
      {
        step: 3,
        ballType: "Shorter length into the body ribs",
        mechanism: "Hoping to cramp his bat swing and force an awkward pull.",
        kohliResponse: "Backfoot press. Pulls down with rolled wrists, forcing the ball strictly groundward.",
        result: "Single (1) to deep square leg - rotates strike."
      }
    ]
  },
  {
    phaseName: "The Middle Overs (Spin Trap)",
    overs: "Overs 7 – 15",
    riskLevel: "MEDIUM",
    criticalWhy: "Modern cricket sees many high-risk sluggers perish in this phase by attempting reckless lofted sweeps against spinners. Kohli's masterclass is his unmatched strike rotation: he averages over 55 against spin by stepping out to drive or punching off the back foot, combined with surgical sprint doubles.",
    sequenceList: [
      {
        step: 1,
        ballType: "Flat Spin into the Stumps",
        mechanism: "Spinners bowl flat and straight to lock down scoring.",
        kohliResponse: "Steps out, meets the pitch before turn, driving gracefully to long-off.",
        result: "Easy single (1) or crisp drive boundary."
      },
      {
        step: 2,
        ballType: "Googly / Away Turning Ball",
        mechanism: "Slow loop, looking to find an inside or outside edge.",
        kohliResponse: "Plays with late soft-hands. Uses the wrist to steer the ball fine of short third-man.",
        result: "Surgical boundaries or lightning pair of runs."
      },
      {
        step: 3,
        ballType: "Short Skidding Seed",
        mechanism: "Cramps bottom edge with quick pace off wicket.",
        kohliResponse: "Steps back and cuts with a slap-drive to deep cover-point.",
        result: "Comfortable single/double - maintaining strike rotation."
      }
    ]
  }
];

// Insights from team strategists
export const analystQuotes = [
  {
    author: "ANALYST POV",
    quote: "T20 cricket is dominated by players who swing for the fences and have extreme peaks and troughs. What makes Virat Kohli the master is his ability to operate with a 150+ strike rate at an average above 50 in big tournaments. He treats run-scoring as an exact athletic science. By refusing to compromise his head-stability and body posture, he removes the element of luck that catches up to fearless batting styles."
  },
  {
    author: "HEAD COACH POV",
    quote: "You don't play Virat Kohli out with tricks or plan overlays. Other batters have visible stance deficiencies (like a pre-delivery weight lean or a trailing backfoot) that you can exploit. Kohli has no mechanical flaws. He is a technical circle—everything is balanced and closed. Your best bet is choking him with a tight off-side sweep field and hoping he takes a 2% risk."
  }
];

export interface OpponentData {
  runs: number;
  innings: number;
  average: number;
  strikeRate: number;
  centuries: number;
  fifties: number;
  threatBowler: string;
  threatType: string;
  bowlingStyle: string;
  attackStrategy: string;
  coachesSummary: string;
  tactics: string[];
}

export const opponentTacticalData: Record<string, OpponentData> = {
  "Kolkata Knight Riders": {
    runs: 944,
    innings: 27,
    average: 39.3,
    strikeRate: 131.5,
    centuries: 1,
    fifties: 6,
    threatBowler: "Mystery Spin Trap",
    threatType: "Mystery Spin Trap",
    bowlingStyle: "Right-arm Offbreak / Carrom Ball",
    attackStrategy: "KKR focuses on spin stranglehold in middle overs (Mystery Offbreak & Carrom Spinners) with wide-line traps from express seamers.",
    coachesSummary: "Our opponent historically uses mystery spin to dry up the off-side. Kohli counters this by refusing the sweep, choosing instead to step down the track to convert spin into full tosses or tapping them into deep midwicket for active doubles.",
    tactics: [
      "Avoid the Sweep against Mystery Spin: Play with a vertical bat face, pressing forward to smother the spin on contact.",
      "Target wide bowling lines: Keep elbows soft and punch behind point rather than slashing aggressively.",
      "Sprint-Choke the Spinners: Tap and run to deep sweepers, turning 1s into energetic 2s to prevent them from bowling matching sequences."
    ]
  },
  "Chennai Super Kings": {
    runs: 1006,
    innings: 31,
    average: 37.3,
    strikeRate: 125.8,
    centuries: 0,
    fifties: 9,
    threatBowler: "Slingy Yorker Specialist",
    threatType: "Slingy Yorker Death Over Barrage",
    bowlingStyle: "Slingshot Right-arm Fast-Medium",
    attackStrategy: "CSK employs bowling discipline with spin squeezing (Finger Spinners) and tail-end slingy yorker attacks.",
    coachesSummary: "CSK relies on defensive suffocations. Kohli's strategic counters involve placing early outswingers through cover-point and holding posture against the slingy release to guide low full surfaces securely behind square.",
    tactics: [
      "Counter early swing by batting 12 inches forward, neutralizing the late swing before it finds the slip tier.",
      "Brace against slingy releases: Expect the yorker on the pads, using a deep crease stand to flick past backward-square.",
      "Surgical spin manipulation: Punch orthodox finger spinners off the back foot into deep cover gaps to keep the strike rotating without lofted risks."
    ]
  },
  "Mumbai Indians": {
    runs: 916,
    innings: 29,
    average: 32.7,
    strikeRate: 126.3,
    centuries: 0,
    fifties: 5,
    threatBowler: "Express Seamer",
    threatType: "High-Impedance Seam & Yorker",
    bowlingStyle: "Right-arm Fast / Hyperextension",
    attackStrategy: "MI relies on extreme execution of Yorkers and hard-length testing from their express speed merchants.",
    coachesSummary: "High-quality express pace represents the ultimate mechanical test. Kohli approaches this by treating extreme pace as a high-control period while launching attacks against secondary bowling links.",
    tactics: [
      "Establish a defensive shield vs Extreme Pace: Focus on solid chest-forward blocks, utilizing the high elbow to ground his off-cutter.",
      "Pounce on spin rotations: Use active footwork to loft under-rotated spinners straight back over the bowler's sightline.",
      "Redirect Hard Lengths: When seamers use short balls, slide backward-and-across to direct and ramp them over keeper."
    ]
  },
  "Rajasthan Royals": {
    runs: 795,
    innings: 25,
    average: 34.6,
    strikeRate: 121.2,
    centuries: 1,
    fifties: 4,
    threatBowler: "Leg-spin Bowler",
    threatType: "Tactical Leg-spin Baiting",
    bowlingStyle: "Right-arm Legbreak",
    attackStrategy: "RR pairs early knuckleballs in the powerplay with flighted leg-spin bait in the ring.",
    coachesSummary: "RR attempts to bait top-order batters into slicing wide, turning balls to long-off. Kohli counters this with his signature wrist manipulation, driving the wide delivery instead securely inside-out down the ground.",
    tactics: [
      "Nullify finger-spin variations: Stay anchored on the crease and play late, defending with soft wrists instead of swinging.",
      "Counter wide teaser balls: Meet the ball early by stepping out, closing the face to run it down the ground rather than slicing.",
      "Smother early swing: Remain ultra-still and press forward, ensuring absolute bat-pad sealing."
    ]
  },
  "Sunrisers Hyderabad": {
    runs: 711,
    innings: 21,
    average: 37.4,
    strikeRate: 138.9,
    centuries: 1,
    fifties: 4,
    threatBowler: "Back-of-Length Seamer",
    threatType: "Heavy Hard-Length Seam & Off-cutter",
    bowlingStyle: "Right-arm Fast-Medium",
    attackStrategy: "SRH deploys a high-octane assault, setting defensive locks with back-of-length seamers and skidding spinners.",
    coachesSummary: "Fast bowlers try to push batters back with back-of-a-length deliveries and off-cutters. Kohli combats this by using his backfoot punch through the covers, capitalizing on bounce height with pure wrist-work.",
    tactics: [
      "Punish hard lengths: Use a back-foot shift and punch through the offside gap with high vertical elbows.",
      "Decongest early outswing: Step down the wicket to convert the delivery's length and drive through mid-on.",
      "Sweeper Chasing: Probe the deep boundary lines with sweep-flicks to push deep fielders into defensive configurations."
    ]
  },
  "Delhi Capitals": {
    runs: 1030,
    innings: 28,
    average: 51.5,
    strikeRate: 134.6,
    centuries: 0,
    fifties: 10,
    threatBowler: "Left-arm Wrist Spinner",
    threatType: "Left-arm Chinaman Drift & Goblet",
    bowlingStyle: "Left-arm Wrist Spin",
    attackStrategy: "DC isolates Kohli with skidding orthodox finger-spin darts and teasing left-arm wrist spin.",
    coachesSummary: "Kohli has been highly dominant here. He counters left-arm spin drift by reading the seam off the hand and playing with a straight bat face, driving against the spin to secure low-risk runs.",
    tactics: [
      "Read turners out of the hand: Focus on the back-of-wrist release to register the googly early, pressing back to cut safely.",
      "Neutralize skidding finger spinners: Play with a vertical bat, sliding the front pad slightly open to avoid any trapped LBW calls.",
      "Expose support bowlers: Target secondary bowling links, punching through the cover gaps with high-control wrist driving."
    ]
  },
  "Gujarat Titans": {
    runs: 450,
    innings: 10,
    average: 45.0,
    strikeRate: 136.2,
    centuries: 1,
    fifties: 3,
    threatBowler: "Elite Legbreak/Googly Spinner",
    threatType: "High-Speed Legbreak & Skidding Googly",
    bowlingStyle: "Right-arm Legbreak / High Speed",
    attackStrategy: "GT squeezes runs in middle overs using high-speed spinners out of the hand.",
    coachesSummary: "High-speed legbreak spinners bowl at speeds matching medium pacers. Kohli's response is to play them purely as seam-bowlers, staying flat-footed and punching through the lines with minimal backlift to ensure total ball contact.",
    tactics: [
      "De-bias the quick Googly: Treat high-speed turners as medium pacers, using a short, robust downswing to block/sweep-flick.",
      "Leverage powerplay lines: Stand tall and punch early outswingers past mid-off with high postural balance.",
      "Target wide bowler channels: Use the inside-out drive against spinners to defeat deep off-side field blocks."
    ]
  },
  "Punjab Kings": {
    runs: 1030,
    innings: 32,
    average: 34.3,
    strikeRate: 133.8,
    centuries: 1,
    fifties: 4,
    threatBowler: "Left-arm In-swing Bowler",
    threatType: "Left-Arm In-Swinger Trap",
    bowlingStyle: "Left-arm Fast-Medium",
    attackStrategy: "PBKS targets the off-stump channel with left-arm angles and back-of-length seam pacing.",
    coachesSummary: "Kohli dominates this angle by stepping across to cover the left-arm bowler. Against incoming swings, he holds a balanced trigger to slice late through point or roll wrists over the inswinger to mid-wicket.",
    tactics: [
      "Counter left-arm angle: Stay upright and play late, defending the incoming ball to mid-on instead of chasing the wide guide.",
      "Attack shorter lengths: Slide back-and-across to pull through mid-wicket or punch past cover.",
      "Drive spinners with vertical face: Read their lengths early to punch past the cover ring, establishing active strike rotation."
    ]
  },
  "Lucknow Super Giants": {
    runs: 245,
    innings: 6,
    average: 49.0,
    strikeRate: 139.2,
    centuries: 0,
    fifties: 3,
    threatBowler: "Quick Skidding Googly Bowler",
    threatType: "Quick Skidding Googly",
    bowlingStyle: "Right-arm Legbreak/Googly",
    attackStrategy: "LSG uses flat skidding googlies and side-arm speed variations from their pace battery.",
    coachesSummary: "Bowlers bowl flat and fast to choke boundaries. Kohli counters by executing controlled backfoot cuts against googlies and utilizing soft-handed extensions to steer pacers into deep gaps.",
    tactics: [
      "Watch skidding angles: Expect skidding googlies; step deep in crease and cut past backward-point.",
      "Steer side-arm pacers: Exploit wide-line traps by letting ball face meet bat under the nose, steering behind third man.",
      "Proactive strike rotation: Turn defensive length blocks into quick ones, denying bowler rhythm in middle phases."
    ]
  },
  "All Teams": {
    runs: 9261,
    innings: 268,
    average: 39.4,
    strikeRate: 133.5,
    centuries: 10,
    fifties: 64,
    threatBowler: "Express Left-Arm / Hard Lengths",
    threatType: "Early Late Swing & Blind Spot Bouncers",
    bowlingStyle: "Slingy / Swing Extraordinaire",
    attackStrategy: "Opposing teams prioritize early off-stump swing, shifting to hard-length bouncers and mystery middle-overs spin traps.",
    coachesSummary: "Kohli's overall career is a testament to perfect posture and biomechanical stillness. By avoiding the extreme stances of modern sloggers, he maintains a world-best 83.4% control rate, securing matches even under heavy fire.",
    tactics: [
      "Retain Absolute Head Stillness: Keep the eyes aligned on a level horizontal plane irrespective of bowler length variations.",
      "Eliminate Bat-Pad Air-Gap: Form a solid, impenetrable triangle between the front pad, front shoulder, and vertical bat.",
      "Rotate Strike via soft wrists: Play the ball directly under the eyes, picking the gaps in the circle to turn ones into active twos."
    ]
  }
};

