import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from "recharts";

/* ═══ PALETTE ═══ */
var $ = {
  bg: "#0a0e1a", bg2: "#0f1525", bg3: "#141c2e",
  brd: "rgba(251,191,36,.08)", brdH: "rgba(251,191,36,.18)",
  tx: "#fef3c7", tx2: "#ebcb9a", tx3: "#b08d5e", dim: "#8a7350",
  glow: "#fbbf24", glowD: "rgba(251,191,36,.06)",
  ac: "#f59e0b", acB: "#fbbf24", acD: "rgba(245,158,11,.08)",
  gn: "#34d399", gnD: "rgba(52,211,153,.06)",
  rd: "#f87171", rdD: "rgba(248,113,113,.06)",
  navy: "#1e293b",
};
var F = { s: "'Manrope',system-ui,sans-serif", m: "'IBM Plex Mono',monospace" };
var TT = { background: $.bg3, border: "1px solid " + $.brd, borderRadius: 8, fontSize: 11, color: $.tx2, fontFamily: F.m };
var TK = { fontSize: 9, fill: $.dim, fontFamily: F.m };
var serif = "'Iowan Old Style','Palatino Linotype',Georgia,serif";

/* ═══ DATA ═══ */
var SH=[.9569,.9389,.928,.9425,.944,.9396,.9409,.941,.9409,.9368,.9371,.9415,.943,.9353,.9354,.9408,.9456,.9414,.9454,.9495,.9382,.9335,.9285,.9297,.9272,.9282,.9231,.9287,.9218,.9188,.9285,.9324,.9373,.9441,.9448,.94,.9394,.9352,.9366,.9327,.9352,.9337,.9372,.9325,.9339,.9309,.9305,.9322,.9352,.9453,.9454,.9486,.9516,.9488,.9431,.9417,.9444,.9395,.9365,.9372,.9305,.9228,.9095,.9068,.911,.9138,.9145,.9214,.9105,.9025,.9041,.9071,.9148,.9124,.9117,.9057,.8994,.8936,.9004,.8947,.8873,.8762,.8707,.8696,.8598,.8693,.8632,.8648,.8715,.8778,.879,.8787,.8779,.879,.8891,.8871,.892,.8907,.889,.8855,.8922,.898,.9022,.9106,.9083,.8986,.896,.8996,.8972,.9029,.9008,.9008,.8919,.8774,.8666,.8757,.8797,.8752,.8725,.8674];
var SV=[.9259,.9148,.9101,.9238,.9204,.9152,.9179,.9195,.9188,.9147,.9132,.9118,.9096,.9032,.9036,.905,.8951,.892,.8912,.893,.8924,.8928,.8924,.8888,.8842,.8866,.8984,.9054,.9068,.907,.9112,.9153,.9178,.9287,.9363,.9368,.9286,.9235,.9228,.9221,.9235,.9143,.9109,.9074,.9021,.9007,.8953,.8898,.8824,.8812,.8755,.8813,.8895,.8826,.8822,.8847,.8923,.8998,.9026,.9055,.904,.9061,.9022,.904,.9045,.9042,.9003,.8953,.8975,.8915,.884,.8791,.8676,.8622,.8653,.8595,.8645,.8524,.8551,.8604,.8675,.8547,.8656,.8629,.8505,.8482,.8335,.8386,.8248,.8203,.8119,.82,.8161,.816,.8276,.8249,.8287,.8262,.8303,.8304,.835,.8312,.8273,.8274,.8153,.8073,.8079,.8061,.8002,.7803,.7662,.7638,.7532,.7516,.7432,.7378,.7394,.7333,.735,.7343];
var SR=[.9607,.937,.9576,.9574,.9493,.949,.9413,.9351,.9348,.9342,.9364,.941,.9373,.9344,.9291,.9287,.934,.9432,.949,.9538,.9456,.944,.943,.9417,.9453,.9442,.9425,.9402,.9316,.9272,.9308,.9299,.9278,.9318,.9362,.938,.9386,.9256,.9248,.9206,.9214,.9168,.9199,.9182,.9175,.9129,.9131,.9237,.928,.932,.9246,.931,.927,.9218,.9208,.9198,.9169,.9115,.9153,.9156,.917,.9113,.9088,.9097,.9056,.9076,.9068,.9113,.9018,.8996,.8988,.903,.9026,.8979,.8977,.8953,.8975,.8963,.901,.9007,.8862,.8813,.8751,.873,.8689,.869,.8602,.8563,.8532,.8456,.8582,.8526,.844,.8464,.8529,.8557,.8584,.8636,.8633,.8715,.872,.8766,.8881,.8936,.8965,.8931,.898,.8953,.9007,.904,.9032,.909,.907,.9023,.8952,.8944,.8893,.8936,.8854,.8806];
var SP=[.1,.08,.09,.11,.12,.08,.08,.08,.12,.08,.1,.09,.11,.1,.13,.11,.09,.1,.1,.08,.1,.11,.1,.1,.08,.11,.11,.1,.11,.12,.1,.08,.08,.12,.07,.13,.09,.12,.11,.08,.07,.09,.08,.14,.09,.14,.1,.12,.11,.16,.15,.18,.12,.16,.18,.35,.22,.26,.23,.19,.27,.26,.31,.31,.3,.41,.57,.42,.3,.38,.44,.48,.4,.59,.38,.47,.6,.66,.43,.62,1.16,.98,.9,1.28,.89,1.22,1.40,.88,1.19,1.21,1.76,1.36,1.10,1.22,1.57,1.80,1.62,1.60,1.90,2.11,2.00,1.82,1.43,1.79,1.28,1.88,1.79,1.72,2.74,1.76,2.36,2.29,2.31,1.77,1.70,1.87,2.34,2.32,1.94,2.36];
var SC=[.97,.94,.933,.942,.94,.935,.936,.934,.931,.927,.922,.926,.924,.921,.92,.924,.928,.929,.934,.938,.932,.926,.928,.928,.929,.931,.929,.931,.926,.923,.93,.934,.933,.938,.937,.93,.924,.92,.922,.921,.923,.923,.926,.92,.919,.916,.916,.917,.918,.923,.921,.921,.92,.917,.913,.912,.906,.898,.888,.887,.878,.869,.86,.858,.858,.86,.859,.862,.857,.848,.845,.845,.847,.841,.839,.837,.835,.832,.842,.841,.835,.831,.826,.825,.823,.827,.829,.833,.831,.833,.84,.836,.831,.83,.837,.835,.838,.836,.838,.837,.844,.856,.869,.877,.874,.866,.866,.872,.872,.88,.878,.879,.872,.863,.854,.863,.861,.857,.856,.852];
var SL=[.9592,.9226,.9172,.9216,.9241,.9185,.9207,.9156,.9167,.9114,.9079,.9145,.9075,.9101,.9056,.9071,.9111,.9183,.9182,.9257,.9259,.9267,.9355,.9346,.9346,.9358,.9296,.927,.9255,.9232,.9248,.9201,.9119,.9129,.9193,.9206,.9173,.9124,.9115,.914,.9127,.9122,.916,.9124,.9104,.9104,.9109,.9186,.92,.9152,.9117,.914,.9173,.9143,.9054,.9033,.9055,.8998,.9012,.899,.8987,.8994,.9012,.9041,.9094,.9077,.9075,.9054,.8961,.8974,.8938,.8908,.8909,.8893,.8935,.8893,.8854,.8875,.8948,.8964,.8862,.8822,.8702,.8614,.8458,.8444,.838,.8359,.8346,.8304,.8388,.8353,.8375,.8414,.8509,.8624,.8654,.8661,.8556,.8596,.8611,.8661,.8653,.8712,.8749,.8698,.8741,.865,.8835,.8876,.8897,.8867,.8885,.8832,.8802,.8805,.882,.8866,.8768,.8715];
var NS = Array.from({ length: 2000 }, function(_, i) { return Math.sin(i * 127.1 + i * i * .013) * .5 + Math.cos(i * 269.5 - i * .017) * .5; });

/* ═══ SCENARIOS ═══ */
var SCENARIOS = {
  nominal: { label: "Normal Operation", batch: 20, desc: "Stable grid. All systems nominal. Model predictions are trustworthy.", plain: "Everything is working. The AI model was trained on data that looks like this. Predictions are accurate.", status: "STABLE", color: $.gn, health: 98, action: "Continue monitoring at standard interval.", feature: "None. All features within training distribution.", alert: "No alerts", showDrift: false, showRegime: false },
  gradual: { label: "Gradual Drift", batch: 55, desc: "Tau parameters shifting slowly. Model confidence degrading before accuracy drops.", plain: "The real world is slowly changing, but the model was trained on old data. It's getting less reliable, but doesn't know it yet.", status: "DRIFT DETECTED", color: $.ac, health: 87, action: "Recalibrate model. Increase damping at Node 2 (LOAD). Reduce trust threshold to 0.90.", feature: "tau_std rising +40%, F_gain_mean shifting from training mean", alert: "PSI crossed 0.25 threshold at batch 55", showDrift: true, showRegime: false },
  noise: { label: "Sensor Noise", batch: 45, desc: "SCADA sensor corruption injected. Testing whether the model can distinguish noise from real instability.", plain: "A sensor is feeding bad data. Is the grid actually unstable, or is the sensor broken? The system has to tell the difference.", status: "MONITORING", color: $.ac, health: 92, action: "Increase monitoring frequency to 2x. Verify sensor integrity at Node 1.", feature: "Broad noise across tau and g parameters. Not localised.", alert: "Early CUSUM deviation at batch 34", showDrift: true, showRegime: false },
  adversarial: { label: "Adversarial Attack", batch: 65, desc: "FGSM perturbation applied to sensor readings. Simulates adversarial perturbation of grid telemetry.", plain: "This simulates adversarial perturbation. Small mathematical changes are applied to sensor readings to test whether the model holds or flips its predictions.", status: "AT RISK", color: $.rd, health: 74, action: "Switch to RF fallback model immediately. SVM boundary has been compromised by gradient attack.", feature: "SVM flip rate at 32.4% (ε=0.1). Hybrid stacking absorbs to 7.6%.", alert: "Adversarial signature detected in gradient pattern", showDrift: true, showRegime: false },
  collapse: { label: "Regime Collapse", batch: 95, desc: "Abrupt parameter shift. Generator response characteristics have fundamentally changed.", plain: "The grid itself has fundamentally changed. The world the model was trained for no longer exists. Nothing it learned applies anymore.", status: "CRITICAL", color: $.rd, health: 52, action: "Emergency recalibration via LaSCal pipeline. Alert grid operator. Reduce load at Nodes 2 and 3.", feature: "All features shifted beyond training bounds. Coverage at 85%.", alert: "All three detectors triggered. Regime change confirmed.", showDrift: true, showRegime: true },
};

/* ═══ STYLES ═══ */
function useStyles() {
  useEffect(function() {
    document.title = "W.R.E.N.";
    if (document.getElementById("wrn")) return;
    var l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
    var s = document.createElement("style"); s.id = "wrn";
    s.textContent = "@keyframes wup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes wpulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes wblink{0%,100%{opacity:.5}50%{opacity:1}}@keyframes wsweep{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes wshake{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-3px)}30%,60%,90%{transform:translateX(3px)}}@keyframes lhSweep{0%,100%{transform:rotate(-35deg)}50%{transform:rotate(35deg)}}@keyframes wLoad{0%{width:0%}100%{width:100%}}@keyframes wTransSweep{0%{transform:rotate(-40deg)}50%{transform:rotate(40deg)}100%{transform:rotate(-40deg)}}@keyframes bIdlePulse{0%,100%{opacity:.55}50%{opacity:.95}}"
      + "@keyframes findingIn{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:none}}"
      + "@keyframes findingPulse{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(1.4);opacity:1}}"
      + "@keyframes numPop{0%{opacity:0;transform:scale(.55)}60%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}"
      + "@keyframes barGrowW{from{width:0;opacity:0}to{opacity:1}}"
      + "@keyframes barGrowH{from{height:0;opacity:0}to{opacity:1}}"
      + "@keyframes gapBadge{0%{opacity:0;transform:scaleX(.2)}100%{opacity:1;transform:scaleX(1)}}"
      + "@keyframes softFadeIn{from{opacity:0}to{opacity:1}}"
      + "@keyframes detectorFire{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1);opacity:1}}"
      + "@keyframes detectorRing{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.4);opacity:0}}"
      + "@keyframes phaseShift{0%{opacity:0;transform:translateY(-4px)}100%{opacity:1;transform:none}}"
      + "@keyframes liveSweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}"
      + "@keyframes toastIn{0%{opacity:0;transform:translate(-50%,-140%)scale(.92)}65%{opacity:1;transform:translate(-50%,6px)scale(1.005)}100%{opacity:1;transform:translate(-50%,0)scale(1)}}"
      + "@keyframes toastOut{0%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-40%)}}"
      + "@keyframes toastProgress{0%{width:100%}100%{width:0%}}"
      + "@keyframes typewipe{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0 0 0)}}"
      + "@keyframes chipBurst{0%{box-shadow:0 0 0 0 var(--burst)}70%{box-shadow:0 0 0 20px rgba(0,0,0,0)}100%{box-shadow:0 0 0 0 rgba(0,0,0,0)}}"
      + "@keyframes logRowIn{0%{opacity:0;transform:translateX(-14px)}100%{opacity:1;transform:none}}"
      + "@keyframes iconRing{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.3);opacity:0}}"
      + "@keyframes chipShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-2px)}40%,80%{transform:translateX(2px)}}"
      + "@keyframes cardBloom{0%{opacity:0;transform:scale(.88)translateY(-6px);filter:blur(4px)}55%{opacity:1;transform:scale(1.012)translateY(0);filter:blur(0)}100%{opacity:1;transform:scale(1)translateY(0);filter:blur(0)}}"
      + "@keyframes cardBreathe{0%,100%{box-shadow:0 18px 44px rgba(0,0,0,.55),0 0 22px var(--breathe-a)}50%{box-shadow:0 22px 54px rgba(0,0,0,.62),0 0 44px var(--breathe-b)}}"
      + "@keyframes shockRing{0%{transform:scale(.5);opacity:1;border-width:3px}85%{opacity:.15}100%{transform:scale(4.2);opacity:0;border-width:.5px}}"
      + "@keyframes dotHalo{0%,100%{transform:scale(1);opacity:.18}50%{transform:scale(1.9);opacity:.38}}"
      + "@keyframes labelSlide{0%{opacity:0;transform:translateX(-10px);letter-spacing:.3em}100%{opacity:1;transform:none;letter-spacing:.18em}}"
      + "@keyframes titleRise{0%{opacity:0;transform:translateY(14px);filter:blur(3px)}55%{filter:blur(0)}100%{opacity:1;transform:none;filter:blur(0)}}"
      + "@keyframes linePop{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:none}}"
      + ".cin-card{animation:cardBloom .7s cubic-bezier(.22,1.4,.36,1) both,cardBreathe 3.2s ease-in-out .75s infinite;transform-origin:top right}"
      + ".cin-accent{animation:softFadeIn .4s ease .1s both}"
      + ".cin-label{animation:labelSlide .5s cubic-bezier(.16,1,.3,1) .15s both}"
      + ".cin-title{animation:titleRise .75s cubic-bezier(.16,1,.3,1) .3s both}"
      + ".cin-sub{animation:linePop .55s cubic-bezier(.16,1,.3,1) .55s both}"
      + ".cin-metric{animation:linePop .55s cubic-bezier(.16,1,.3,1) .75s both}"
      + ".cin-foot{animation:linePop .5s ease .95s both}"
      + ".cin-progress{animation:toastProgress 10s linear both;transform-origin:left}"
      + ".cin-ring-1{animation:shockRing 1.4s cubic-bezier(.16,1,.3,1) both}"
      + ".cin-ring-2{animation:shockRing 1.4s cubic-bezier(.16,1,.3,1) .35s both}"
      + ".cin-ring-3{animation:shockRing 1.4s cubic-bezier(.16,1,.3,1) .7s both}"
      + ".cin-halo{animation:dotHalo 2.4s ease-in-out infinite}"
      + ".cin-dot{animation:wpulse 1.4s ease-in-out infinite}"
      + "*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(251,191,36,.1);border-radius:2px}";
    document.head.appendChild(s);
  }, []);
}

/* ═══ HOOKS & UTILS ═══ */
function useReveal(th) {
  var ref = useRef(null);
  var _s = useState(false); var v = _s[0]; var setV = _s[1];
  useEffect(function() {
    var el = ref.current; if (!el) return;
    var o = new IntersectionObserver(function(entries) { if (entries[0].isIntersecting) { setV(true); o.unobserve(el); } }, { threshold: th || 0.1 });
    o.observe(el); return function() { o.disconnect(); };
  }, [th]);
  return [ref, v];
}

function Rv(props) {
  var d = props.d || 0;
  var r = useReveal(0.06); var ref = r[0]; var v = r[1];
  return (<div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) " + d + "s" }}>{props.children}</div>);
}

function seedRandom(seed) {
  return function() { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };
}

/* ═══ SVG COMPONENTS ═══ */
function Beacon(props) {
  var s = props.s || 48;
  var baseGlow = props.glow || 0;
  var interactive = !!props.interactive;
  var _g = useState(baseGlow); var g = _g[0]; var setG = _g[1];
  var svgRef = useRef(null);

  useEffect(function() {
    if (!interactive) { setG(baseGlow); return; }
    function track(cx, cy) {
      if (!svgRef.current) return;
      var r = svgRef.current.getBoundingClientRect();
      var dist = Math.sqrt(Math.pow(cx - (r.left + r.width / 2), 2) + Math.pow(cy - (r.top + r.height * 0.26), 2));
      setG(Math.max(baseGlow, Math.min(1, 1 - dist / 200)));
    }
    function onM(e) { track(e.clientX, e.clientY); }
    function onT(e) { if (e.touches[0]) track(e.touches[0].clientX, e.touches[0].clientY); }
    window.addEventListener("mousemove", onM);
    window.addEventListener("touchmove", onT, { passive: true });
    return function() { window.removeEventListener("mousemove", onM); window.removeEventListener("touchmove", onT); };
  }, [interactive, baseGlow]);

  var glow = g;
  var lampOp = 0.55 + glow * 0.45;
  var glowR = 3 + glow * 16;
  var idleAnim = (interactive && glow < 0.15) ? "bIdlePulse 2.5s ease-in-out infinite" : "none";

  return (
    <svg ref={svgRef} width={s} height={s} viewBox="0 0 100 120" style={{ display: "block" }}>
      {glow > 0.05 && (<g><circle cx="50" cy="32" r={glowR * 2.5} fill={$.glow} opacity={glow * 0.025} /><circle cx="50" cy="32" r={glowR * 1.5} fill={$.glow} opacity={glow * 0.06} /><circle cx="50" cy="32" r={glowR} fill={$.glow} opacity={glow * 0.12} /></g>)}
      {glow > 0.1 && (<g opacity={glow * 0.3}><line x1="50" y1="32" x2="4" y2="28" stroke={$.glow} strokeWidth="0.8" strokeDasharray="5,4" /><line x1="50" y1="32" x2="96" y2="28" stroke={$.glow} strokeWidth="0.8" strokeDasharray="5,4" /><line x1="50" y1="32" x2="12" y2="10" stroke={$.glow} strokeWidth="0.6" strokeDasharray="4,5" opacity="0.6" /><line x1="50" y1="32" x2="88" y2="10" stroke={$.glow} strokeWidth="0.6" strokeDasharray="4,5" opacity="0.6" /></g>)}
      <ellipse cx="50" cy="98" rx="18" ry="3" fill={$.dim} opacity="0.1" />
      <polygon points="44,38 56,38 60,96 40,96" fill="#1e2a3d" stroke={$.tx2} strokeWidth="0.6" opacity="0.9" />
      <line x1="42" y1="55" x2="58" y2="55" stroke={$.tx2} strokeWidth="0.5" opacity="0.3" />
      <line x1="41" y1="70" x2="59" y2="70" stroke={$.tx2} strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="85" x2="60" y2="85" stroke={$.tx2} strokeWidth="0.5" opacity="0.3" />
      <rect x="47" y="60" width="6" height="8" rx="3" fill={$.glow} opacity={lampOp * 0.5} />
      <rect x="42" y="34" width="16" height="4" rx="1" fill="#1e2a3d" stroke={$.tx2} strokeWidth="0.5" opacity="0.95" />
      <rect x="44" y="26" width="12" height="8" rx="1.5" fill="rgba(251,191,36,0.12)" stroke={$.glow} strokeWidth="0.6" opacity={lampOp} />
      <circle cx="50" cy="30" r="3.5" fill={$.glow} opacity={lampOp} style={{ animation: idleAnim }} />
      <circle cx="50" cy="30" r="1.8" fill="#fff" opacity={lampOp * 0.7} />
      <path d="M44,26 Q44,20 50,16 Q56,20 56,26" fill="#1e2a3d" stroke={$.tx2} strokeWidth="0.5" opacity="0.9" />
      <line x1="50" y1="16" x2="50" y2="11" stroke={$.tx2} strokeWidth="0.8" opacity="0.6" />
      <circle cx="50" cy="10" r="1.5" fill={$.glow} opacity={lampOp * 0.6} style={{ animation: idleAnim }} />
      <rect x="47" y="90" width="6" height="6" rx="1" fill="#0a0e1a" stroke={$.tx2} strokeWidth="0.4" opacity="0.5" />
    </svg>
  );
}

function BeaconSmall(props) {
  var s = props.s || 22;
  return (
    <svg width={s} height={s} viewBox="0 0 100 120" style={{ display: "block" }}>
      <polygon points="44,38 56,38 60,96 40,96" fill="#1a2233" stroke={$.tx3} strokeWidth="1" opacity="0.7" />
      <rect x="44" y="26" width="12" height="8" rx="1.5" fill="rgba(251,191,36,0.08)" stroke={$.glow} strokeWidth="0.8" opacity="0.7" />
      <circle cx="50" cy="30" r="3" fill={$.glow} opacity="0.7" />
      <path d="M44,26 Q44,20 50,16 Q56,20 56,26" fill="#1a2233" stroke={$.tx3} strokeWidth="0.8" opacity="0.7" />
      <line x1="50" y1="32" x2="20" y2="30" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" opacity="0.2" />
      <line x1="50" y1="32" x2="80" y2="30" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" opacity="0.2" />
    </svg>
  );
}

function Wave(props) {
  var ch = props.chaos !== undefined ? props.chaos : 0.15;
  var height = props.h || 40;
  var color = props.color || $.glow;
  var ref = useRef(null); var ph = useRef(0);
  var chaosRef = useRef(ch);
  chaosRef.current = ch;
  useEffect(function() {
    var c = ref.current; if (!c) return; var ctx = c.getContext("2d"); var run = true;
    var draw = function() {
      if (!run) return; var W = c.offsetWidth; if (W < 1) { requestAnimationFrame(draw); return; }
      var dp = window.devicePixelRatio || 1; c.width = W * dp; c.height = height * dp;
      ctx.setTransform(dp, 0, 0, dp, 0, 0); ctx.clearRect(0, 0, W, height);
      ph.current += 0.004; var p = ph.current; var mid = height / 2;
      var chaos = chaosRef.current;
      var steps = Math.floor(W / 1.5);
      ctx.beginPath();
      for (var i = 0; i < steps; i++) {
        var x = (i / steps) * W; var t = (i / steps) * 10 + p;
        var y = mid + (Math.sin(t * 0.7) * 0.35 + Math.sin(t * 1.5) * 0.2 + NS[(i + Math.floor(p * 50)) % NS.length] * chaos) * height * 0.35;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.globalAlpha = 0.75; ctx.stroke();
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    draw(); return function() { run = false; };
  }, [height, color]);
  return <canvas ref={ref} style={{ width: "100%", height: height, display: "block" }} />;
}

function HeroBeacon() {
  var _g = useState(0); var glow = _g[0]; var setGlow = _g[1];
  var containerRef = useRef(null);
  useEffect(function() {
    function onMove(cx, cy) {
      if (!containerRef.current) return;
      var rect = containerRef.current.getBoundingClientRect();
      var midX = rect.left + rect.width / 2; var midY = rect.top + rect.height * 0.35;
      var dist = Math.sqrt(Math.pow(cx - midX, 2) + Math.pow(cy - midY, 2));
      setGlow(Math.max(0, Math.min(1, 1 - dist / 280)));
    }
    function onMouse(e) { onMove(e.clientX, e.clientY); }
    function onTouch(e) { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }
    function onLeave() { setGlow(0); }
    window.addEventListener("mousemove", onMouse); window.addEventListener("touchstart", onTouch);
    window.addEventListener("touchmove", onTouch); window.addEventListener("touchend", onLeave);
    return function() { window.removeEventListener("mousemove", onMouse); window.removeEventListener("touchstart", onTouch); window.removeEventListener("touchmove", onTouch); window.removeEventListener("touchend", onLeave); };
  }, []);
  var waveChaos = 0.45 - glow * 0.35;
  return (
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", transition: "transform 0.3s", transform: "scale(" + (1 + glow * 0.03) + ")" }}>
      <Beacon s={110} glow={glow} />
      <div style={{ width: 260, marginTop: -12 }}><Wave chaos={waveChaos} h={36} color={$.glow} /></div>
    </div>
  );
}

function Spark(props) {
  var data = props.data; var color = props.color || $.ac; var w = props.w || 100; var h = props.h || 22;
  if (!data || data.length < 2) return null;
  var mn = Math.min.apply(null, data); var mx = Math.max.apply(null, data); var rng = mx - mn || 1;
  var pts = data.map(function(v, i) { return ((i / (data.length - 1)) * w) + "," + (h - ((v - mn) / rng * h * .65 + h * .17)); }).join(" ");
  return (<svg width={w} height={h} style={{ display: "block" }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" /></svg>);
}

function Topo(props) {
  var b = props.batch || 0;
  var pos = [{ x: 160, y: 40 }, { x: 300, y: 120 }, { x: 160, y: 200 }, { x: 20, y: 120 }];
  var links = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
  var labels = ["GEN", "LOAD", "DIST", "STORE"];
  var health;
  if (props.stressed) {
    health = props.stressed;
  } else {
    health = [0, 0, 0, 0];
    if (b >= 40) health[0] = 1;
    if (b >= 55) { health[1] = 2; health[3] = 1; }
    if (b >= 80) health[2] = 2;
  }
  function nc(i) { return health[i] === 2 ? $.rd : health[i] === 1 ? $.ac : $.gn; }
  var sz = props.size || 5;
  return (
    <svg viewBox="0 0 320 240" style={{ width: "100%", maxWidth: props.maxW || 280, height: "auto", display: "block" }}>
      {links.map(function(pair, i) {
        var a = pair[0], b2 = pair[1];
        var stressed = health[a] > 0 || health[b2] > 0;
        return (<line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[b2].x} y2={pos[b2].y} stroke={stressed ? $.ac : "rgba(251,191,36,.08)"} strokeWidth={stressed ? 1.4 : 0.6} strokeDasharray={i >= 4 ? "4,4" : "none"} />);
      })}
      {pos.map(function(p, i) {
        var col = nc(i);
        var pulse = health[i] === 2;
        return (
          <g key={i}>
            {pulse && <circle cx={p.x} cy={p.y} r={sz + 8} fill={col} opacity=".12" style={{ animation: "wpulse 1.2s ease-in-out infinite" }}/>}
            <circle cx={p.x} cy={p.y} r={sz + 3} fill="none" stroke={col} strokeWidth={1} opacity={0.3} />
            <circle cx={p.x} cy={p.y} r={sz} fill={col} />
            <text x={p.x} y={p.y + sz + 14} textAnchor="middle" fill={col} fontSize={9} fontFamily={F.m}>{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══ ENTRANCE ═══ */
function EvidenceCard(props) {
  var d = props.d; var last = props.last;
  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];
  return (
    <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: last ? "none" : "1px solid rgba(255,255,255,.04)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: F.m, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, color: d.color, lineHeight: 1 }}>{d.before}</span>
        <span style={{ fontSize: 14, color: $.dim }}>→</span>
        <span style={{ fontFamily: F.m, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, color: d.color, lineHeight: 1 }}>{d.after}</span>
        <span style={{ fontFamily: F.m, fontSize: 8, color: $.dim, letterSpacing: 1, marginLeft: 4 }}>{d.tag.toUpperCase()}</span>
      </div>
      <div style={{ fontSize: 14, color: $.tx2, lineHeight: 1.8, marginBottom: 6 }}>{d.plain}</div>
      <div onClick={function(){setOpen(!open);}} style={{ cursor: "pointer", display: "inline-block" }}>
        <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim, borderBottom: "1px dotted " + $.dim }}>{open ? "Hide technical detail" : "Technical detail"}</span>
      </div>
      {open && (
        <div style={{ marginTop: 8, fontSize: 11, color: $.dim, lineHeight: 1.6, fontFamily: F.m, animation: "wup .2s ease both" }}>{d.technical}</div>
      )}
    </div>
  );
}

function Entrance(props) {
  var _s = useState(0); var stage = _s[0]; var setStage = _s[1];
  useEffect(function() {
    var t1 = setTimeout(function() { setStage(1); }, 500);
    var t2 = setTimeout(function() { setStage(2); }, 1600);
    var t3 = setTimeout(function() { setStage(3); }, 2600);
    var t4 = setTimeout(function() { props.onDone(); }, 3400);
    return function() { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#050810", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "opacity 0.8s", opacity: stage >= 3 ? 0 : 1, pointerEvents: stage >= 3 ? "none" : "all" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: stage >= 1 ? 500 : 0, height: stage >= 1 ? 500 : 0, marginLeft: stage >= 1 ? -250 : 0, marginTop: stage >= 1 ? -280 : -30, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36," + (stage >= 1 ? "0.05" : "0") + ") 0%, transparent 70%)", transition: "all 1.5s ease", pointerEvents: "none" }} />
      <Beacon s={90} glow={stage >= 1 ? (stage >= 2 ? 0.8 : 0.3) : 0} />
      <div style={{ fontFamily: F.s, fontSize: 28, fontWeight: 700, color: $.glow, letterSpacing: 3, opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.6s", marginBottom: 6, marginTop: 16 }}>W.R.E.N.</div>
      <div style={{ fontFamily: F.m, fontSize: 10, color: $.dim, letterSpacing: 3, opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.8s 0.2s" }}>SIGNALS ROOM ONLINE</div>
    </div>
  );
}

/* ═══ SIGNATURE DEMO ═══ */
var SCENE_ORDER = ["nominal", "noise", "gradual", "adversarial", "collapse"];
var SCENE_TIMING = [3000, 4000, 4000, 4500, 4500];

var SLIDES = [
  { key: "nominal", num: "01", title: "Stable Operation", serif: "The AI scores 99.99%. Every prediction is correct. Everything looks perfect.", detail: "This is what a static benchmark shows. If evaluation stopped here, every model would look production ready.", batch: 20, health: 98 },
  { key: "noise", num: "02", title: "Sensor Corruption", serif: "A sensor starts feeding bad data. The AI cannot tell the difference between a broken sensor and a real threat.", detail: "SCADA environments have noisy, imperfect measurements. A model that has only seen clean data does not know how to handle this.", batch: 45, health: 92 },
  { key: "gradual", num: "03", title: "The World Drifts", serif: "Consumer behaviour changes slowly. The AI was trained on old patterns. It does not know the world has moved.", detail: "Accuracy drops a little. Confidence becomes a lie. The model says 90% sure while being wrong more and more often.", batch: 55, health: 87 },
  { key: "adversarial", num: "04", title: "Fake Data Attack", serif: "Carefully crafted false readings are injected into the sensor stream. One model is tricked a third of the time. Another holds at 0.05%.", detail: "The vulnerability depends entirely on what type of AI is used. The choice of model is a security decision, not just a performance decision.", batch: 65, health: 74 },
  { key: "collapse", num: "05", title: "Everything Changes", serif: "A generator trips offline. The grid operates in a way the AI has never seen. Its safety guarantees expire immediately.", detail: "One in six predictions now has no valid safety bound. The AI is still confident. That confidence is meaningless.", batch: 95, health: 52 },
];

function SignatureDemo() {
  var _si = useState(0); var slideIdx = _si[0]; var setSlideIdx = _si[1];
  var _animDir = useState(0); var animDir = _animDir[0]; var setAnimDir = _animDir[1];
  var _auto = useState(false); var auto = _auto[0]; var setAuto = _auto[1];
  var autoRef = useRef(null);
  var wrapRef = useRef(null);
  var aucData = useMemo(function() { return SH.map(function(v, i) { return { b: i, H: v, S: SV[i] }; }); }, []);

  var slide = SLIDES[slideIdx];
  var sc = SCENARIOS[slide.key];
  var healthColor = slide.health > 90 ? $.gn : slide.health > 75 ? $.ac : $.rd;

  function go(dir) {
    var next = slideIdx + dir;
    if (next < 0 || next >= SLIDES.length) return;
    setAnimDir(dir);
    setSlideIdx(next);
  }

  // Autoplay
  useEffect(function() {
    if (!auto) { clearInterval(autoRef.current); return; }
    autoRef.current = setInterval(function() {
      setSlideIdx(function(prev) {
        if (prev >= SLIDES.length - 1) { setAuto(false); return prev; }
        setAnimDir(1);
        return prev + 1;
      });
    }, 5000);
    return function() { clearInterval(autoRef.current); };
  }, [auto]);

  return (
    <div ref={wrapRef} style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>

      {/* Slide content */}
      <div key={slideIdx} style={{ animation: "wup 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontFamily: F.m, fontSize: 11, color: $.dim, opacity: 0.4 }}>{slide.num}</span>
              <span style={{ fontFamily: F.m, fontSize: 10, color: sc.color, letterSpacing: 1, fontWeight: 600 }}>{slide.title.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: "clamp(18px, 3vw, 24px)", fontFamily: serif, color: $.tx, lineHeight: 1.6, maxWidth: 520, fontWeight: 400, fontStyle: "italic" }}>
              {slide.serif}
            </div>
          </div>
          {/* Health */}
          <div style={{ textAlign: "center", flexShrink: 0, paddingLeft: 24 }}>
            <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1, marginBottom: 6 }}>HEALTH</div>
            <div style={{ fontFamily: F.m, fontSize: 44, fontWeight: 800, color: healthColor, lineHeight: 1, transition: "color .3s" }}>{slide.health}</div>
            <div style={{ width: 48, height: 2, background: "rgba(255,255,255,.04)", borderRadius: 1, marginTop: 8, margin: "8px auto 0" }}>
              <div style={{ width: slide.health + "%", height: "100%", background: healthColor, borderRadius: 1, transition: "width .8s" }} />
            </div>
          </div>
        </div>

        {/* Chart - cinematic */}
        <div style={{ background: "rgba(255,255,255,.02)", borderRadius: 14, padding: "20px 20px 12px", marginBottom: 16, border: "1px solid rgba(255,255,255,.03)" }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={aucData} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.03)" />
              <XAxis dataKey="b" tick={TK} tickLine={false} />
              <YAxis domain={["auto", "auto"]} tick={TK} tickLine={false} width={32} />
              <Tooltip contentStyle={TT} />
              <ReferenceLine x={slide.batch} stroke={sc.color} strokeWidth={2} strokeOpacity={0.8} />
              {sc.showDrift && <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={0.2} label={{value:"Drift",position:"insideTopLeft",fill:$.ac,fontSize:7,opacity:0.5}} />}
              {sc.showRegime && <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={0.2} label={{value:"Regime",position:"insideTopLeft",fill:$.rd,fontSize:7,opacity:0.5}} />}
              <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2.5} dot={false} name="Hybrid" isAnimationActive={false} />
              <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1} dot={false} opacity={0.15} name="SVM" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detail + status */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, fontSize: 13, color: $.tx3, lineHeight: 1.7 }}>{slide.detail}</div>
          <div style={{ background: sc.color + "08", borderRadius: 8, padding: "10px 14px", maxWidth: 240, flexShrink: 0, border: "1px solid " + sc.color + "15" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, animation: sc.color !== $.gn ? "wpulse 1.5s ease-in-out infinite" : "none" }} />
              <span style={{ fontFamily: F.m, fontSize: 9, color: sc.color, fontWeight: 600 }}>{sc.status}</span>
            </div>
            <div style={{ fontSize: 10, color: $.tx2, lineHeight: 1.5 }}>{sc.action}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 32 }}>
        <button onClick={function() { go(-1); }} disabled={slideIdx === 0}
          style={{ background: "none", border: "none", color: slideIdx === 0 ? "rgba(255,255,255,.08)" : $.tx3, fontSize: 18, cursor: slideIdx === 0 ? "default" : "pointer", padding: "8px 12px", transition: "color .2s" }}>
          {"\u2190"}
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {SLIDES.map(function(_, i) {
            var active = i === slideIdx;
            return (
              <button key={i} onClick={function() { setAnimDir(i > slideIdx ? 1 : -1); setSlideIdx(i); setAuto(false); }}
                style={{ width: active ? 24 : 8, height: 3, borderRadius: 2, background: active ? SCENARIOS[SLIDES[i].key].color : "rgba(255,255,255,.1)", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />
            );
          })}
        </div>
        <button onClick={function() { go(1); }} disabled={slideIdx === SLIDES.length - 1}
          style={{ background: "none", border: "none", color: slideIdx === SLIDES.length - 1 ? "rgba(255,255,255,.08)" : $.tx3, fontSize: 18, cursor: slideIdx === SLIDES.length - 1 ? "default" : "pointer", padding: "8px 12px", transition: "color .2s" }}>
          {"\u2192"}
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <button onClick={function() { if (auto) { setAuto(false); } else { setSlideIdx(0); setAuto(true); } }}
          style={{ background: "none", border: "none", fontFamily: F.m, fontSize: 9, color: auto ? $.glow : $.dim, cursor: "pointer", letterSpacing: 0.5, transition: "color .2s" }}>
          {auto ? "Pause" : "Autoplay"}
        </button>
      </div>
    </div>
  );
}

/* ═══ PIPELINE STAGE VISUALS ═══ */
function PipeVis(props) {
  var n = props.n; var color = props.color;
  var W = 260; var H = 60;
  var c = color || $.glow;

  // ━━━ PHASE 1: COLLECTING ━━━

  // 1. Data loading — file streams rows into a counter
  if (n === 1) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <rect x="10" y="16" width="28" height="28" rx="2" fill="none" stroke={c} strokeWidth="1" strokeOpacity="0.5"/>
      <line x1="16" y1="24" x2="32" y2="24" stroke={c} strokeWidth="0.8" strokeOpacity="0.4"/>
      <line x1="16" y1="28" x2="32" y2="28" stroke={c} strokeWidth="0.8" strokeOpacity="0.4"/>
      <line x1="16" y1="32" x2="28" y2="32" stroke={c} strokeWidth="0.8" strokeOpacity="0.4"/>
      <line x1="16" y1="36" x2="32" y2="36" stroke={c} strokeWidth="0.8" strokeOpacity="0.4"/>
      <text x="24" y="54" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.5">file</text>
      {[0,1,2,3,4,5].map(function(i){
        return <circle key={i} cy="30" r="2.2" fill={c}>
          <animate attributeName="cx" from="44" to="195" dur="1.4s" begin={i*0.23+"s"} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.12;0.88;1" dur="1.4s" begin={i*0.23+"s"} repeatCount="indefinite"/>
        </circle>;
      })}
      <rect x="195" y="16" width="55" height="28" rx="3" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="1" strokeOpacity="0.6"/>
      <text x="222.5" y="29" textAnchor="middle" fill={c} fontSize="10" fontFamily={F.m} fontWeight="700">60,000</text>
      <text x="222.5" y="39" textAnchor="middle" fill={c} fontSize="6" fontFamily={F.m} opacity="0.6">rows</text>
    </svg>
  );

  // 2. Feature engineering — 12 basics expand into 48 clues
  if (n === 2) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {Array.from({length:12}).map(function(_,i){
        return <circle key={i} cx={14+(i%6)*8} cy={20+Math.floor(i/6)*14} r="2.5" fill={c} opacity="0.8"/>;
      })}
      <text x="34" y="56" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.55">12 basics</text>
      <line x1="72" y1="30" x2="106" y2="30" stroke={c} strokeWidth="1" strokeOpacity="0.4"/>
      <polygon points="104,27 110,30 104,33" fill={c} fillOpacity="0.5"/>
      <text x="89" y="22" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.6">combine</text>
      {Array.from({length:48}).map(function(_,i){
        return <circle key={i} cx={124+(i%12)*9} cy={14+Math.floor(i/12)*10} r="1.8" fill={c} opacity="0">
          <animate attributeName="opacity" from="0" to="0.7" dur="0.3s" begin={(i*0.025)+"s"} fill="freeze"/>
        </circle>;
      })}
      <text x="176" y="56" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.55">48 clues</text>
    </svg>
  );

  // 3. Data splitting — one pile becomes three
  if (n === 3) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <rect x="10" y="22" width="70" height="16" rx="3" fill={c} fillOpacity="0.25"/>
      <text x="45" y="54" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.55">all data</text>
      <line x1="86" y1="30" x2="112" y2="30" stroke={c} strokeWidth="1" strokeOpacity="0.4"/>
      <polygon points="110,27 116,30 110,33" fill={c} fillOpacity="0.5"/>
      <rect x="122" y="22" width="50" height="16" rx="3" fill={$.gn} fillOpacity="0">
        <animate attributeName="fill-opacity" from="0" to="0.5" dur="0.4s" begin="0s" fill="freeze"/>
      </rect>
      <text x="147" y="34" textAnchor="middle" fill={$.gn} fontSize="8" fontFamily={F.m} fontWeight="700">TRAIN</text>
      <rect x="175" y="22" width="35" height="16" rx="3" fill={$.ac} fillOpacity="0">
        <animate attributeName="fill-opacity" from="0" to="0.5" dur="0.4s" begin="0.2s" fill="freeze"/>
      </rect>
      <text x="192.5" y="34" textAnchor="middle" fill={$.ac} fontSize="7" fontFamily={F.m} fontWeight="700">TUNE</text>
      <rect x="213" y="22" width="35" height="16" rx="3" fill={$.rd} fillOpacity="0">
        <animate attributeName="fill-opacity" from="0" to="0.5" dur="0.4s" begin="0.4s" fill="freeze"/>
      </rect>
      <text x="230.5" y="34" textAnchor="middle" fill={$.rd} fontSize="7" fontFamily={F.m} fontWeight="700">TEST</text>
      <text x="185" y="54" textAnchor="middle" fill={c} fontSize="6" fontFamily={F.m} opacity="0.45">three piles</text>
    </svg>
  );

  // ━━━ PHASE 2: CHOOSING ━━━

  // 4. Feature selection — useless clues fade away
  if (n === 4) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {Array.from({length:48}).map(function(_,i){
        var keep = [2,5,8,11,14,17,20,23,26,29,32,35,38,41].indexOf(i) >= 0;
        return <circle key={i} cx={10+(i%12)*7} cy={14+Math.floor(i/12)*10} r="2" fill={c} opacity={keep?0.9:0.4}>
          {!keep && <animate attributeName="opacity" values="0.4;0" dur="1s" begin={(i*0.02)+"s"} fill="freeze"/>}
          {!keep && <animate attributeName="r" values="2;0" dur="1s" begin={(i*0.02)+"s"} fill="freeze"/>}
          {keep && <animate attributeName="r" values="2;2.8;2" dur="1.8s" begin={(i*0.05)+"s"} repeatCount="indefinite"/>}
        </circle>;
      })}
      <text x="50" y="56" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.45">test all 48</text>
      <line x1="102" y1="30" x2="132" y2="30" stroke={c} strokeWidth="1" strokeOpacity="0.4"/>
      <polygon points="130,27 136,30 130,33" fill={c} fillOpacity="0.5"/>
      <rect x="142" y="20" width="82" height="20" rx="10" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1" strokeOpacity="0.5"/>
      <text x="183" y="33" textAnchor="middle" fill={c} fontSize="10" fontFamily={F.m} fontWeight="700">14 kept</text>
      <text x="183" y="54" textAnchor="middle" fill={c} fontSize="6" fontFamily={F.m} opacity="0.45">best ones</text>
    </svg>
  );

  // 5. Hyperparameter search — grid lights up, one winner
  if (n === 5) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {Array.from({length:40}).map(function(_,i){
        var x = 10 + (i%10)*10;
        var y = 10 + Math.floor(i/10)*11;
        var best = i === 23;
        return <rect key={i} x={x} y={y} width="7" height="7" rx="1" fill={c} opacity={best?1:0.18}>
          {!best && <animate attributeName="opacity" values="0.15;0.5;0.15" dur="2s" begin={(i*0.04)+"s"} repeatCount="indefinite"/>}
          {best && <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>}
        </rect>;
      })}
      <text x="57" y="56" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.45">100 tried</text>
      <line x1="118" y1="30" x2="148" y2="30" stroke={c} strokeWidth="1" strokeOpacity="0.4"/>
      <polygon points="146,27 152,30 146,33" fill={c} fillOpacity="0.5"/>
      <circle cx="188" cy="30" r="16" fill="none" stroke={c} strokeWidth="1" strokeOpacity="0.4">
        <animate attributeName="r" values="10;18;10" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="188" cy="30" r="10" fill={c} fillOpacity="0.8"/>
      <text x="188" y="34" textAnchor="middle" fill={$.bg} fontSize="11" fontFamily={F.m} fontWeight="700">★</text>
      <text x="224" y="33" fill={c} fontSize="9" fontFamily={F.m} opacity="0.65">best</text>
    </svg>
  );

  // ━━━ PHASE 3: TEACHING ━━━

  // 6. Four base learners — four distinct shapes
  if (n === 6) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <circle cx="40" cy="26" r="13" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.6"/>
      <circle cx="40" cy="26" r="4" fill="#a78bfa" fillOpacity="0.3"/>
      <text x="40" y="54" textAnchor="middle" fill="#a78bfa" fontSize="7" fontFamily={F.m} fontWeight="700">H1</text>
      <rect x="84" y="13" width="26" height="26" rx="2" fill="none" stroke={$.gn} strokeWidth="1.5" strokeOpacity="0.6"/>
      <line x1="97" y1="18" x2="91" y2="24" stroke={$.gn} strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="97" y1="18" x2="103" y2="24" stroke={$.gn} strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="97" y1="24" x2="89" y2="35" stroke={$.gn} strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="97" y1="24" x2="105" y2="35" stroke={$.gn} strokeWidth="1" strokeOpacity="0.6"/>
      <text x="97" y="54" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} fontWeight="700">H2</text>
      <polygon points="154,13 168,39 140,39" fill="none" stroke="#67e8f9" strokeWidth="1.5" strokeOpacity="0.6"/>
      <polygon points="154,22 160,34 148,34" fill="#67e8f9" fillOpacity="0.3"/>
      <text x="154" y="54" textAnchor="middle" fill="#67e8f9" fontSize="7" fontFamily={F.m} fontWeight="700">H3</text>
      <line x1="198" y1="37" x2="226" y2="15" stroke={$.ac} strokeWidth="1.5" strokeOpacity="0.6"/>
      <circle cx="200" cy="35" r="2" fill={$.ac} fillOpacity="0.7"/>
      <circle cx="212" cy="26" r="2" fill={$.ac} fillOpacity="0.7"/>
      <circle cx="224" cy="17" r="2" fill={$.ac} fillOpacity="0.7"/>
      <text x="212" y="54" textAnchor="middle" fill={$.ac} fontSize="7" fontFamily={F.m} fontWeight="700">H4</text>
    </svg>
  );

  // 7. Calibration — wavy (dishonest) → straight (honest)
  if (n === 7) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <text x="48" y="10" textAnchor="middle" fill={$.rd} fontSize="7" fontFamily={F.m} opacity="0.65">dishonest</text>
      <path d="M 12 44 Q 30 14 48 38 Q 66 52 84 18" fill="none" stroke={$.rd} strokeWidth="1.3" strokeOpacity="0.6" strokeDasharray="3 3"/>
      <line x1="98" y1="30" x2="128" y2="30" stroke={c} strokeWidth="1" strokeOpacity="0.4"/>
      <polygon points="126,27 132,30 126,33" fill={c} fillOpacity="0.5"/>
      <text x="113" y="22" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.55">align</text>
      <text x="188" y="10" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} opacity="0.65">honest</text>
      <line x1="142" y1="44" x2="232" y2="16" stroke={$.gn} strokeWidth="1.8" strokeOpacity="0.7"/>
      <circle cx="142" cy="44" r="2.2" fill={$.gn}/>
      <circle cx="232" cy="16" r="2.2" fill={$.gn}/>
      <text x="187" y="54" textAnchor="middle" fill={$.gn} fontSize="6" fontFamily={F.m} opacity="0.55">says 90%, is 90% right</text>
    </svg>
  );

  // 8. Stacking — two helpers merge into team
  if (n === 8) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <circle cx="22" cy="18" r="9" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity="0.6"/>
      <text x="22" y="22" textAnchor="middle" fill="#a78bfa" fontSize="8" fontFamily={F.m} fontWeight="700">H1</text>
      <rect x="12" y="34" width="20" height="14" rx="2" fill="none" stroke={$.gn} strokeWidth="1.2" strokeOpacity="0.6"/>
      <text x="22" y="44" textAnchor="middle" fill={$.gn} fontSize="8" fontFamily={F.m} fontWeight="700">H2</text>
      <line x1="35" y1="20" x2="105" y2="26" stroke={c} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 2"/>
      <line x1="35" y1="42" x2="105" y2="34" stroke={c} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 2"/>
      <polygon points="103,23 109,26 103,29" fill={c} fillOpacity="0.5"/>
      <polygon points="103,31 109,34 103,37" fill={c} fillOpacity="0.5"/>
      <rect x="118" y="14" width="92" height="30" rx="6" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1.5" strokeOpacity="0.7">
        <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="164" y="34" textAnchor="middle" fill={c} fontSize="12" fontFamily={F.m} fontWeight="700">TEAM</text>
      <text x="230" y="24" fill={c} fontSize="7" fontFamily={F.m} opacity="0.55">beats</text>
      <text x="230" y="36" fill={c} fontSize="7" fontFamily={F.m} opacity="0.55">both</text>
    </svg>
  );

  // ━━━ PHASE 4: TESTING ━━━

  // 9. Grade — score bar fills to near-perfect
  if (n === 9) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <text x="10" y="17" fill={$.dim} fontSize="7" fontFamily={F.m}>score</text>
      <rect x="10" y="22" width="180" height="16" rx="8" fill="rgba(255,255,255,.06)"/>
      <rect x="10" y="22" width="0" height="16" rx="8" fill={$.gn} fillOpacity="0.6">
        <animate attributeName="width" from="0" to="179.82" dur="1.2s" fill="freeze"/>
      </rect>
      <text x="100" y="34" textAnchor="middle" fill={$.tx} fontSize="10" fontFamily={F.m} fontWeight="700" opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1s" fill="freeze"/>
        99.99%
      </text>
      <text x="225" y="34" textAnchor="middle" fill={$.gn} fontSize="16" fontFamily={F.m} fontWeight="700" opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.2s" fill="freeze"/>
        ✓
      </text>
      <text x="100" y="52" textAnchor="middle" fill={$.dim} fontSize="6" fontFamily={F.m}>almost perfect</text>
    </svg>
  );

  // 10. Alarm level — three lights: SAFE / WATCH / DANGER
  if (n === 10) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <rect x="10" y="14" width="240" height="32" rx="16" fill="rgba(255,255,255,.02)" stroke={c} strokeWidth="0.5" strokeOpacity="0.2"/>
      <circle cx="50" cy="30" r="11" fill={$.gn} fillOpacity="0.25" stroke={$.gn} strokeWidth="1.2" strokeOpacity="0.7">
        <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="2s" begin="0s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="30" r="4" fill={$.gn} fillOpacity="0.9"/>
      <text x="50" y="55" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} fontWeight="700">SAFE</text>
      <circle cx="130" cy="30" r="11" fill={$.ac} fillOpacity="0.25" stroke={$.ac} strokeWidth="1.2" strokeOpacity="0.7">
        <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="2s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="130" cy="30" r="4" fill={$.ac} fillOpacity="0.9"/>
      <text x="130" y="55" textAnchor="middle" fill={$.ac} fontSize="7" fontFamily={F.m} fontWeight="700">WATCH</text>
      <circle cx="210" cy="30" r="11" fill={$.rd} fillOpacity="0.25" stroke={$.rd} strokeWidth="1.2" strokeOpacity="0.7">
        <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="2s" begin="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="210" cy="30" r="4" fill={$.rd} fillOpacity="0.9"/>
      <text x="210" y="55" textAnchor="middle" fill={$.rd} fontSize="7" fontFamily={F.m} fontWeight="700">DANGER</text>
    </svg>
  );

  // 11. Safety promise — 19 of 20 dots green
  if (n === 11) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {Array.from({length:20}).map(function(_,i){
        var covered = i < 19;
        var x = 10 + (i%10)*14;
        var y = 14 + Math.floor(i/10)*16;
        return <circle key={i} cx={x} cy={y} r="4" fill={covered?$.gn:$.rd} opacity="0">
          <animate attributeName="opacity" from="0" to={covered?0.75:0.55} dur="0.2s" begin={(i*0.06)+"s"} fill="freeze"/>
        </circle>;
      })}
      <text x="195" y="24" fill={$.gn} fontSize="13" fontFamily={F.m} fontWeight="700" opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.3s" fill="freeze"/>
        95%
      </text>
      <text x="195" y="36" fill={$.gn} fontSize="7" fontFamily={F.m} opacity="0.7">of 100</text>
      <text x="195" y="46" fill={$.gn} fontSize="7" fontFamily={F.m} opacity="0.7">right</text>
    </svg>
  );

  // 12. Bootstrap — many rounds, team wins every time
  if (n === 12) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {Array.from({length:10}).map(function(_,i){
        return <g key={i}>
          <circle cx={14+i*13} cy="26" r="5" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="0.8" strokeOpacity="0.5">
            <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="1.5s" begin={(i*0.12)+"s"} repeatCount="indefinite"/>
          </circle>
          <text x={14+i*13} y="29" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} fontWeight="700" opacity="0">
            <animate attributeName="opacity" from="0" to="0.9" dur="0.2s" begin={(i*0.12+0.1)+"s"} fill="freeze"/>
            ✓
          </text>
        </g>;
      })}
      <text x="77" y="12" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.55">team wins every round</text>
      <text x="77" y="48" textAnchor="middle" fill={$.dim} fontSize="7" fontFamily={F.m}>2,000 random tests</text>
      <rect x="160" y="14" width="86" height="28" rx="4" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="1" strokeOpacity="0.6"/>
      <text x="203" y="28" textAnchor="middle" fill={c} fontSize="11" fontFamily={F.m} fontWeight="700">skill</text>
      <text x="203" y="38" textAnchor="middle" fill={$.dim} fontSize="7" fontFamily={F.m}>not luck</text>
    </svg>
  );

  // 13. Learning curve — rises then plateaus
  if (n === 13) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <line x1="15" y1="48" x2="185" y2="48" stroke={c} strokeWidth="0.5" strokeOpacity="0.3"/>
      <line x1="15" y1="48" x2="15" y2="10" stroke={c} strokeWidth="0.5" strokeOpacity="0.3"/>
      <path d="M 15 46 Q 40 36 70 22 Q 100 14 130 14 L 185 14" fill="none" stroke={c} strokeWidth="2" strokeOpacity="0.75" strokeDasharray="220" strokeDashoffset="220">
        <animate attributeName="stroke-dashoffset" from="220" to="0" dur="1.4s" fill="freeze"/>
      </path>
      <line x1="100" y1="14" x2="185" y2="14" stroke={$.gn} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 3"/>
      <text x="142" y="10" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} opacity="0.85" fontWeight="700">plateau</text>
      <text x="100" y="58" textAnchor="middle" fill={$.dim} fontSize="7" fontFamily={F.m}>more data →</text>
      <rect x="195" y="20" width="55" height="22" rx="4" fill={$.gn} fillOpacity="0.12" stroke={$.gn} strokeWidth="1" strokeOpacity="0.5"/>
      <text x="222.5" y="28" textAnchor="middle" fill={$.gn} fontSize="8" fontFamily={F.m} fontWeight="700">enough</text>
      <text x="222.5" y="37" textAnchor="middle" fill={$.dim} fontSize="6" fontFamily={F.m}>data</text>
    </svg>
  );

  // 14. 5-fold CV — five tests, all pass
  if (n === 14) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {[0,1,2,3,4].map(function(i){
        return <g key={i}>
          <rect x={16+i*48} y="16" width="36" height="28" rx="3" fill={c} fillOpacity="0" stroke={c} strokeWidth="0.8" strokeOpacity="0">
            <animate attributeName="fill-opacity" from="0" to="0.12" dur="0.3s" begin={(i*0.3)+"s"} fill="freeze"/>
            <animate attributeName="stroke-opacity" from="0" to="0.5" dur="0.3s" begin={(i*0.3)+"s"} fill="freeze"/>
          </rect>
          <text x={34+i*48} y="36" textAnchor="middle" fill={$.gn} fontSize="15" fontFamily={F.m} fontWeight="700" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin={(i*0.3+0.2)+"s"} fill="freeze"/>
            ✓
          </text>
          <text x={34+i*48} y="55" textAnchor="middle" fill={c} fontSize="6" fontFamily={F.m} opacity="0.55">test {i+1}</text>
        </g>;
      })}
    </svg>
  );

  // 15. Permutation importance — bars with clear winner
  if (n === 15) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {[
        {n:"power flow", w:115, hi:true},
        {n:"timing", w:50, hi:false},
        {n:"avg gain", w:42, hi:false},
        {n:"weak node", w:30, hi:false},
        {n:"swing", w:22, hi:false},
      ].map(function(f, i){
        return <g key={i}>
          <text x="68" y={13+i*9} textAnchor="end" fill={f.hi?c:$.dim} fontSize="7" fontFamily={F.m} opacity={f.hi?0.95:0.55} fontWeight={f.hi?700:400}>{f.n}</text>
          <rect x="73" y={8+i*9} width="0" height="6" fill={f.hi?c:$.dim} fillOpacity={f.hi?0.8:0.35} rx="1">
            <animate attributeName="width" from="0" to={f.w} dur="0.7s" begin={(i*0.1)+"s"} fill="freeze"/>
          </rect>
        </g>;
      })}
      <g>
        <rect x="200" y="10" width="50" height="40" rx="4" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="1" strokeOpacity="0.5"/>
        <text x="225" y="25" textAnchor="middle" fill={c} fontSize="11" fontFamily={F.m} fontWeight="700">#1</text>
        <text x="225" y="36" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.7">power</text>
        <text x="225" y="44" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.7">flow</text>
      </g>
    </svg>
  );

  // 16. SHAP — show why, with contributing arrows
  if (n === 16) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {[
        {x:14, y:14, label:"flow", v:"+40%"},
        {x:14, y:30, label:"timing", v:"+25%"},
        {x:14, y:46, label:"gain", v:"+22%"},
      ].map(function(f, i){
        return <g key={i}>
          <text x={f.x} y={f.y+3} fill={c} fontSize="7" fontFamily={F.m} opacity="0.75">{f.label}</text>
          <text x={f.x+38} y={f.y+3} fill={$.gn} fontSize="7" fontFamily={F.m} opacity="0.75" fontWeight="700">{f.v}</text>
          <line x1={f.x+64} y1={f.y+1} x2="148" y2="30" stroke={c} strokeWidth="0.8" strokeOpacity="0" strokeDasharray="80">
            <animate attributeName="stroke-opacity" from="0" to="0.5" dur="0.4s" begin={(i*0.15)+"s"} fill="freeze"/>
          </line>
        </g>;
      })}
      <circle cx="170" cy="30" r="18" fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1.2" strokeOpacity="0.75"/>
      <text x="170" y="27" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} fontWeight="700">prediction</text>
      <text x="170" y="37" textAnchor="middle" fill={c} fontSize="8" fontFamily={F.m}>87%</text>
      <text x="222" y="22" fill={c} fontSize="8" fontFamily={F.m} opacity="0.6" fontWeight="700">why?</text>
      <text x="222" y="36" fill={c} fontSize="6" fontFamily={F.m} opacity="0.5">no black</text>
      <text x="222" y="44" fill={c} fontSize="6" fontFamily={F.m} opacity="0.5">box</text>
    </svg>
  );

  // 17. Stress test — messy input → team filter → clean output
  if (n === 17) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <text x="42" y="12" textAnchor="middle" fill={$.rd} fontSize="7" fontFamily={F.m} opacity="0.65">messy input</text>
      <path d="M 10 30 L 14 22 L 18 38 L 22 26 L 26 42 L 30 20 L 34 36 L 38 24 L 42 40 L 46 28 L 50 44 L 54 22 L 58 38 L 62 30 L 66 42 L 70 24 L 74 36" fill="none" stroke={$.rd} strokeWidth="1.2" strokeOpacity="0.7"/>
      <line x1="82" y1="30" x2="94" y2="30" stroke={c} strokeWidth="0.8" strokeOpacity="0.4"/>
      <polygon points="92,27 98,30 92,33" fill={c} fillOpacity="0.5"/>
      <rect x="102" y="18" width="46" height="24" rx="4" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="1" strokeOpacity="0.7"/>
      <text x="125" y="33" textAnchor="middle" fill={c} fontSize="9" fontFamily={F.m} fontWeight="700">TEAM</text>
      <line x1="152" y1="30" x2="164" y2="30" stroke={c} strokeWidth="0.8" strokeOpacity="0.4"/>
      <polygon points="162,27 168,30 162,33" fill={c} fillOpacity="0.5"/>
      <text x="206" y="12" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} opacity="0.65">stable output</text>
      <line x1="172" y1="30" x2="246" y2="30" stroke={$.gn} strokeWidth="1.8" strokeOpacity="0.75"/>
      <circle cx="246" cy="30" r="3" fill={$.gn}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );

  // 18. Adversarial — SVM is tricked, RF deflects
  if (n === 18) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <text x="50" y="10" textAnchor="middle" fill={$.rd} fontSize="7" fontFamily={F.m} opacity="0.65">broken</text>
      <circle cx="50" cy="28" r="12" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="2 2"/>
      <text x="50" y="31" textAnchor="middle" fill="#a78bfa" fontSize="8" fontFamily={F.m} fontWeight="700">H1</text>
      <line x1="14" y1="28" x2="36" y2="28" stroke={$.rd} strokeWidth="1.4"/>
      <polygon points="34,25 40,28 34,31" fill={$.rd}/>
      <text x="50" y="54" textAnchor="middle" fill={$.rd} fontSize="7" fontFamily={F.m} fontWeight="700">32% flip</text>
      <text x="115" y="32" textAnchor="middle" fill={$.dim} fontSize="11" fontFamily={F.m} opacity="0.4">vs</text>
      <text x="180" y="10" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} opacity="0.65">immune</text>
      <rect x="166" y="16" width="28" height="24" rx="3" fill={$.gn} fillOpacity="0.08" stroke={$.gn} strokeWidth="1.5" strokeOpacity="0.7"/>
      <text x="180" y="32" textAnchor="middle" fill={$.gn} fontSize="8" fontFamily={F.m} fontWeight="700">H2</text>
      <line x1="144" y1="28" x2="162" y2="28" stroke={$.rd} strokeWidth="1.4"/>
      <path d="M 162 28 Q 152 34 144 42" fill="none" stroke={$.rd} strokeWidth="1.2" strokeOpacity="0.6"/>
      <polygon points="146,40 142,42 144,38" fill={$.rd} fillOpacity="0.6"/>
      <text x="180" y="54" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} fontWeight="700">0.05%</text>
      <text x="234" y="32" textAnchor="middle" fill={$.dim} fontSize="6" fontFamily={F.m}>same</text>
      <text x="234" y="40" textAnchor="middle" fill={$.dim} fontSize="6" fontFamily={F.m}>attack</text>
    </svg>
  );

  // ━━━ PHASE 6: LIVE TESTING ━━━

  // 18b. Simulation — 120-batch timeline with phases
  if (n === "18b") return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <rect x="10" y="24" width="75" height="14" rx="2" fill={$.gn} fillOpacity="0.4"/>
      <rect x="85" y="24" width="35" height="14" fill={$.ac} fillOpacity="0.5"/>
      <rect x="120" y="24" width="40" height="14" fill={$.rd} fillOpacity="0.55"/>
      <rect x="160" y="24" width="90" height="14" rx="2" fill={$.rd} fillOpacity="0.65"/>
      <text x="47" y="20" textAnchor="middle" fill={$.gn} fontSize="6" fontFamily={F.m} fontWeight="700">CALM</text>
      <text x="102" y="20" textAnchor="middle" fill={$.ac} fontSize="6" fontFamily={F.m} fontWeight="700">DRIFT</text>
      <text x="140" y="20" textAnchor="middle" fill={$.rd} fontSize="6" fontFamily={F.m} fontWeight="700">ATTACK</text>
      <text x="205" y="20" textAnchor="middle" fill={$.rd} fontSize="6" fontFamily={F.m} fontWeight="700">REGIME</text>
      <circle cy="31" r="4.5" fill={c} stroke={$.bg} strokeWidth="1">
        <animate attributeName="cx" values="10;250;10" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite"/>
      </circle>
      <text x="130" y="54" textAnchor="middle" fill={$.dim} fontSize="7" fontFamily={F.m}>120 pretend days</text>
    </svg>
  );

  // 19. Change detection — 3 alarm bells + early warning badge
  if (n === "19") return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {[0,1,2].map(function(i){
        var x = 20 + i*28;
        return <g key={i}>
          <path d={"M "+x+" 18 Q "+(x-8)+" 18 "+(x-8)+" 32 L "+(x+8)+" 32 Q "+(x+8)+" 18 "+x+" 18 Z"} fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1" strokeOpacity="0.65">
            <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="1.3s" begin={(i*0.17)+"s"} repeatCount="indefinite"/>
          </path>
          <line x1={x} y1="32" x2={x} y2="36" stroke={c} strokeWidth="1.2" strokeOpacity="0.7"/>
          <circle cx={x} cy="37" r="1.8" fill={c} fillOpacity="0.8"/>
          <circle cx={x} cy="26" r="10" fill="none" stroke={c} strokeWidth="0.6" strokeOpacity="0">
            <animate attributeName="r" from="8" to="18" dur="1.3s" begin={(i*0.17)+"s"} repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.6;0" dur="1.3s" begin={(i*0.17)+"s"} repeatCount="indefinite"/>
          </circle>
        </g>;
      })}
      <text x="48" y="54" textAnchor="middle" fill={$.dim} fontSize="7" fontFamily={F.m}>3 alarm systems</text>
      <rect x="128" y="16" width="118" height="28" rx="14" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1" strokeOpacity="0.6">
        <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="1.8s" repeatCount="indefinite"/>
      </rect>
      <text x="187" y="34" textAnchor="middle" fill={c} fontSize="11" fontFamily={F.m} fontWeight="700">26 days early</text>
    </svg>
  );

  // 20. Generalisation — known zone, new situations still classified
  if (n === "20") return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <rect x="10" y="12" width="80" height="36" rx="4" fill={c} fillOpacity="0.08" stroke={c} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.55"/>
      <text x="50" y="9" textAnchor="middle" fill={c} fontSize="6" fontFamily={F.m} opacity="0.65">trained on</text>
      {[[22,22],[32,34],[42,18],[52,28],[66,40],[76,22],[48,42],[28,42],[62,20]].map(function(p,i){
        return <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={c} fillOpacity="0.75"/>;
      })}
      <line x1="96" y1="30" x2="128" y2="30" stroke={c} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2"/>
      <polygon points="126,27 132,30 126,33" fill={c} fillOpacity="0.5"/>
      <text x="112" y="22" textAnchor="middle" fill={c} fontSize="6" fontFamily={F.m} opacity="0.55">new</text>
      <rect x="138" y="8" width="108" height="44" rx="4" fill={c} fillOpacity="0.04" stroke={c} strokeWidth="1" strokeOpacity="0.35"/>
      <text x="192" y="9" textAnchor="middle" fill={c} fontSize="6" fontFamily={F.m} opacity="0.55">never seen before</text>
      {[[152,22],[168,36],[184,15],[202,26],[222,42],[236,30],[158,46],[216,14],[180,42]].map(function(p,i){
        return <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={$.gn} opacity="0">
          <animate attributeName="opacity" from="0" to="0.75" dur="0.3s" begin={(i*0.1)+"s"} fill="freeze"/>
        </circle>;
      })}
    </svg>
  );

  // 21. Auto stabilizer — wobble → smoothed flat
  if (n === "21") return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <text x="40" y="10" textAnchor="middle" fill={$.rd} fontSize="7" fontFamily={F.m} opacity="0.65">wobbly</text>
      <path d="M 10 30 Q 20 10 30 30 Q 40 50 50 30 Q 60 12 70 30" fill="none" stroke={$.rd} strokeWidth="1.4" strokeOpacity="0.7"/>
      <line x1="84" y1="30" x2="124" y2="30" stroke={c} strokeWidth="1" strokeOpacity="0.4"/>
      <polygon points="122,27 128,30 122,33" fill={c} fillOpacity="0.5"/>
      <text x="104" y="22" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.6">auto fix</text>
      <text x="104" y="44" textAnchor="middle" fill={$.dim} fontSize="6" fontFamily={F.m}>&lt;500 steps</text>
      <text x="195" y="10" textAnchor="middle" fill={$.gn} fontSize="7" fontFamily={F.m} opacity="0.65">stable</text>
      <path d="M 138 30 Q 148 22 158 28 Q 168 33 178 30 L 246 30" fill="none" stroke={$.gn} strokeWidth="1.5" strokeOpacity="0.75"/>
      <circle cx="246" cy="30" r="2.8" fill={$.gn}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );

  // 22. Browser export — package flies into browser window
  if (n === "22") return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <g>
        <rect x="10" y="16" width="30" height="28" rx="2" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1" strokeOpacity="0.65"/>
        <line x1="10" y1="24" x2="40" y2="24" stroke={c} strokeWidth="0.8" strokeOpacity="0.5"/>
        <line x1="25" y1="16" x2="25" y2="44" stroke={c} strokeWidth="0.8" strokeOpacity="0.5"/>
        <text x="25" y="56" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.6">model</text>
      </g>
      <line x1="48" y1="30" x2="96" y2="30" stroke={c} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 2"/>
      <polygon points="94,27 100,30 94,33" fill={c} fillOpacity="0.5"/>
      <circle cy="30" r="2" fill={c}>
        <animate attributeName="cx" from="42" to="100" dur="1.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="indefinite"/>
      </circle>
      <text x="72" y="22" textAnchor="middle" fill={c} fontSize="7" fontFamily={F.m} opacity="0.6">export</text>
      <g>
        <rect x="110" y="12" width="140" height="36" rx="3" fill={c} fillOpacity="0.08" stroke={c} strokeWidth="1" strokeOpacity="0.65"/>
        <rect x="110" y="12" width="140" height="8" rx="3" fill={c} fillOpacity="0.22"/>
        <circle cx="117" cy="16" r="1.6" fill={$.rd} fillOpacity="0.7"/>
        <circle cx="123" cy="16" r="1.6" fill={$.ac} fillOpacity="0.7"/>
        <circle cx="129" cy="16" r="1.6" fill={$.gn} fillOpacity="0.7"/>
        <text x="180" y="34" textAnchor="middle" fill={c} fontSize="9" fontFamily={F.m} fontWeight="700">this website!</text>
        <text x="180" y="44" textAnchor="middle" fill={c} fontSize="6" fontFamily={F.m} opacity="0.55">runs in browser</text>
      </g>
    </svg>
  );

  // Fallback
  return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <circle cx={W/2} cy={H/2} r="6" fill={c} fillOpacity="0.3"/>
    </svg>
  );
}

/* ═══ COMMAND CENTRE ═══ */

/* ═══════════════════════════════════════════════════════════════════
   W.R.E.N.  ·  CINEMATIC PIPELINE TAB  (self-contained)
   ---------------------------------------------------------------------
   Runs standalone with zero props. Can also receive
   PIPELINE / pipeOpen / setPipeOpen / PipeVis to integrate with Wren.
   ═══════════════════════════════════════════════════════════════════ */

/* ═══ CINEMATIC PIPELINE (inlined) — uses wren $, F, serif ═══ */
/* ═══ DEFAULT 22-STAGE PIPELINE (fallback) ═══ */
var DEFAULT_PIPELINE = [
  {phase:"Collecting", color:$.gn, stages:[
    {n:1, name:"Get the data", plain:"Grab 60,000 real power grid readings and fix any broken ones", desc:"We grabbed 60,000 real measurements from a power grid. About 4 in every 10 grids were unstable. Some readings were missing or broken, so we filled them in with a best guess.", input:"Raw file", output:"Clean data"},
    {n:2, name:"Build the clues", plain:"Turn 12 basic readings into 48 helpful clues about the grid", desc:"The 12 basic readings alone don't tell the full story. So we combined them to make 48 new clues. The most important one measures how much power is flowing, which turned out to be the best predictor of trouble.", input:"12 readings", output:"48 clues"},
    {n:3, name:"Split the data", plain:"Make three piles: one to learn from, one to practice on, one to test", desc:"We split the data into three groups. The AI learns from the biggest group, practices on the middle one, and is tested on the smallest one. The AI never sees the test group while learning, so the test is fair.", input:"All the data", output:"3 piles"},
  ]},
  {phase:"Choosing", color:"#a78bfa", stages:[
    {n:4, name:"Pick the best clues", plain:"Try all 48 clues and keep only the 14 that matter most", desc:"We tested every clue to see which ones actually help. Then we threw out the useless ones until only the 14 best were left. The AI still works just as well with fewer clues, so it runs faster.", input:"48 clues", output:"14 best clues"},
    {n:5, name:"Tune the settings", plain:"Try 100 different settings for each helper to find the best ones", desc:"Every AI helper has knobs you can turn to change how it works. We tried 100 different combinations for each helper and kept whichever settings got the best results. All done automatically.", input:"Default knobs", output:"Best knobs"},
  ]},
  {phase:"Teaching", color:$.glow, stages:[
    {n:6, name:"Train four helpers", plain:"Teach four different AI helpers to spot a failing grid", desc:"We taught four different types of AI helpers. Each one learns in its own way, so they each have different strengths. Having four lets us compare them and pick the best approach.", input:"Training data", output:"4 trained helpers"},
    {n:7, name:"Make them honest", plain:"When a helper says it is 90% sure, make sure it really is 90% right", desc:"A helper might say it is 90% sure, but only be right 70% of the time. That is dishonest confidence. We adjusted the helpers so their confidence matches reality, which matters a lot for a safety system.", input:"Rough guesses", output:"Honest guesses"},
    {n:8, name:"Make them team up", plain:"Combine the two best helpers into one super-team that beats them both", desc:"We took the two best helpers and combined them into a team. The team takes both their opinions plus the most important clues, then makes a final decision. The team is more accurate than any single helper alone.", input:"Two best helpers", output:"The team"},
  ]},
  {phase:"Testing", color:$.ac, stages:[
    {n:9,  name:"Grade it", plain:"Test every helper on grids they have never seen. The team scored almost perfect", desc:"We showed each helper power grids they had never seen before and graded their answers. The team got almost every single one right.", input:"New grids", output:"Almost perfect score"},
    {n:10, name:"Set the alarm level", plain:"Missing real trouble is 10 times worse than a false alarm, so tune it that way", desc:"Missing a real power failure is much worse than a false alarm. So we tuned the AI to be extra careful, treating a missed warning as 10 times more serious than a false one. This gives us three alert levels: safe, watch, and danger.", input:"Risk rules", output:"3 alert levels"},
    {n:11, name:"Add a safety promise", plain:"Guarantee the AI will be right at least 95 times out of every 100", desc:"We added a mathematical safety net that promises the AI will be right at least 95 times out of every 100. When it is not sure, it says so instead of guessing. When we tested it, it was right 99.95% of the time.", input:"Practice scores", output:"95% promise kept"},
    {n:12, name:"Check the luck", plain:"Run 2,000 random tests to prove the team is actually better, not just lucky", desc:"What if the team only won by luck? To check, we ran 2,000 random comparisons. The team won nearly every single time, which proves it really is better and not just lucky.", input:"All helper answers", output:"Not luck, skill"},
    {n:13, name:"Check if it needs more data", plain:"See if giving it more examples would help. It would not, it has enough", desc:"We measured how much the AI improved as we gave it more and more examples. At some point it stopped improving, which tells us it already has enough data and is not missing anything.", input:"Different data sizes", output:"Enough data"},
    {n:14, name:"Test it five times", plain:"Rerun the whole test five times with different data each time to be sure", desc:"One test could be lucky. So we ran the whole test five times, each time using a different mix of the data. The AI scored well every single time, which proves it is reliably good.", input:"5 different tests", output:"Good every time"},
  ]},
  {phase:"Understanding", color:$.rd, stages:[
    {n:15, name:"Find the most important clue", plain:"Scramble each clue in turn. The power flow clue was always the most important", desc:"We messed up one clue at a time and watched the AI to see how much it got confused. The AI cared most about the power flow clue, the one we built from physics. This means the AI learned real physics, not just tricks.", input:"Scramble each clue", output:"Power flow wins"},
    {n:16, name:"Ask the AI why", plain:"Make the AI explain every decision it makes, not just give an answer", desc:"Every time the AI makes a decision we can ask it why. It shows which clues mattered most and by how much. No black box, no secrets.", input:"Any decision", output:"Clear explanation"},
    {n:17, name:"Test under pressure", plain:"Make the data messy and see if the AI still works. The team handles it best", desc:"We added static, stretched the numbers, and fed the AI weird readings on purpose. Some helpers broke, but the team kept working. It holds up better than any single helper.", input:"Messy data", output:"Team holds up"},
    {n:18, name:"Try to trick it", plain:"Hit it with sneaky attacks. One helper gets tricked, but the forest helper never does", desc:"We tried tiny, carefully crafted changes to trick the AI. One helper (the boundary one) gets tricked about 1 in 5 times. But the forest helper never gets tricked, and the team holds up well too.", input:"Sneaky changes", output:"Forest is safe"},
  ]},
  {phase:"Live testing", color:"#67e8f9", stages:[
    {n:"18b", name:"Practice for real life", plain:"Run 120 pretend days where the grid slowly changes and gets attacked", desc:"We pretended the AI was deployed for 120 days. For the first 40 days the grid was calm. Then it slowly started changing. Around day 65 we simulated an attack. Around day 80 the grid suddenly shifted. We watched how the AI handled it all.", input:"Trained team", output:"120 days of results"},
    {n:"19",  name:"Watch for trouble", plain:"Three different alarm systems catch problems 26 days before the AI gets confused", desc:"Three different alarm systems watch the data for anything unusual. They all caught the trouble about 26 days before the AI's accuracy actually dropped. That's plenty of warning to react.", input:"Live data stream", output:"Early warning"},
    {n:"20",  name:"Try new situations", plain:"Make up totally new grid conditions the AI has never seen. It still works", desc:"We made up brand new grid conditions, things the AI had never seen. It still worked well. This proves the AI understands how grids work, not just the specific examples we showed it.", input:"New situations", output:"Still works"},
    {n:"21",  name:"Auto-fix the grid", plain:"A helper bot that nudges the grid back to stable in under 500 tiny steps", desc:"We built a helper that knows how to nudge the grid back to stable. If the AI spots trouble, this helper can automatically adjust the grid in under 500 tiny steps to stabilise it.", input:"Wobbly grid", output:"Stable grid"},
    {n:"22",  name:"Put it all on the web", plain:"Pack everything into one file that runs in a browser. That's this website!", desc:"We took everything, the trained AI, all the settings, the safety nets, and packed them into one file that runs right inside a web browser. No special software needed. This website is running it right now.", input:"Everything we built", output:"This website"},
  ]},
];

/* ═══ CINEMATIC ACTS ═══ */
var ACTS = [
  { id:"load",     title:"1. Collect the data",       sub:"60,000 readings from the power grid pour in",       phase:"Step 1",  color:"#34d399", dur:4500, stage:1  },
  { id:"engineer", title:"2. Find the clues",         sub:"Turn raw numbers into useful measurements",          phase:"Step 2",  color:"#34d399", dur:4500, stage:2  },
  { id:"select",   title:"3. Keep what matters",      sub:"From 48 clues, pick only the 14 best ones",          phase:"Step 3",  color:"#a78bfa", dur:5500, stage:4  },
  { id:"train",    title:"4. Teach the AI",           sub:"Four helpers learn to spot a failing grid",          phase:"Step 4",  color:"#fbbf24", dur:6000, stage:6  },
  { id:"evaluate", title:"5. Test it",                sub:"Show it power grids it has never seen before",       phase:"Step 5",  color:"#f59e0b", dur:7000, stage:11 },
  { id:"stress",   title:"6. Try to break it",        sub:"Add noise, trick it, see if it still holds up",      phase:"Step 6",  color:"#f87171", dur:7500, stage:18 },
  { id:"deploy",   title:"7. Let it watch the grid",  sub:"Running live · the AI spots trouble before it hits", phase:"Step 7",  color:"#67e8f9", dur:7000, stage:22 },
];

/* ═══ SIGNAL DATA ═══ */
var LC_FRACS = [.1,.2,.3,.4,.5,.6,.7,.8,.9,1.0];
var LC_HYB   = [.9945,.9970,.9981,.9986,.9994,.9996,.9998,.9998,.9997,.9998];
var LC_RF    = [.9938,.9961,.9978,.9986,.9991,.9996,.9998,.9999,.9999,1.000];
var LC_LGBM  = [.9946,.9971,.9984,.9989,.9994,.9996,.9998,.9998,.9999,1.000];
var LC_LR    = [.9899,.9907,.9908,.9908,.9908,.9909,.9909,.9909,.9910,.9910];

function rocPath(auc) {
  var pts = [];
  for (var i=0;i<=40;i++){
    var x = i/40;
    var y = Math.pow(x, 1 - auc) * (1 - Math.pow(1-x, 8*auc));
    y = Math.max(0, Math.min(1, y + 0.02*Math.sin(i*0.4)));
    pts.push([x, Math.max(y, x*0.02 + (auc>0.99?0.98:auc))]);
  }
  pts[0]=[0,0]; pts[pts.length-1]=[1,1];
  return pts;
}

var SHAP_TOP = [
  {f:"F_gain_mean", v:10.05, phys:true},
  {f:"tau_std",     v:3.35,  phys:true},
  {f:"tau_mean",    v:2.53,  phys:true},
  {f:"g_mean",      v:2.51,  phys:true},
  {f:"D_eff_std",   v:1.42,  phys:true},
  {f:"D_eff_mean",  v:1.23,  phys:true},
  {f:"R_min",       v:0.98,  phys:true},
];
var CM_TARGET = [[4338, 6], [0, 7656]];
var PSI_STREAM = [.10,.11,.08,.08,.11,.11,.10,.11,.08,.10,.10,.12,.09,.08,.08,.14,.11,.18,.18,.26,.27,.31,.57,.38,.40,.47,.43,.98,.89,.88,1.76,1.22,1.62,2.11,1.43,1.88,2.74,2.29,1.70,2.32];
var AUC_STREAM = [.96,.94,.94,.94,.94,.94,.95,.93,.93,.93,.93,.94,.94,.93,.94,.93,.94,.95,.94,.94,.93,.91,.91,.90,.91,.91,.90,.88,.86,.86,.88,.88,.89,.89,.90,.90,.90,.90,.87,.88];
var ADV = [
  {name:"SVM",    rate:32.4, color:"#f87171"},
  {name:"LGBM",   rate:0.26, color:"#67e8f9"},
  {name:"HYBRID", rate:7.6,  color:"#fbbf24"},
  {name:"RF",     rate:0.05, color:"#34d399"},
];

/* ═══ STYLES ═══ */
function useCineStyles() {
  useEffect(function(){
    if (typeof document === "undefined") return;
    if (document.getElementById("wren-cine-sty")) return;
    var s=document.createElement("style"); s.id="wren-cine-sty";
    s.innerHTML = (
      "@keyframes cineFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}"+
      "@keyframes cinePulse{0%,100%{opacity:.45;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}"+
      "@keyframes cineGlow{0%,100%{filter:drop-shadow(0 0 2px currentColor)}50%{filter:drop-shadow(0 0 10px currentColor)}}"+
      "@keyframes cineBar{from{transform:scaleY(0)}to{transform:scaleY(1)}}"+
      "@keyframes cineDrop{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}"+
      "@keyframes cineRing{0%{r:6;opacity:.9}100%{r:26;opacity:0}}"+
      "@keyframes cineBlink{0%,100%{opacity:1}50%{opacity:.2}}"+
      ".cineBtn{transition:all .25s ease}.cineBtn:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(251,191,36,.15)}"
    );
    document.head.appendChild(s);
  },[]);
}

/* ═══ MAIN COMPONENT ═══ */
function CinematicPipeline(props) {
  useCineStyles();
  props = props || {};
  // Validate PIPELINE: must be a non-empty array whose every phase has a stages array
  var _pp = props.PIPELINE;
  var _valid = _pp && _pp.length && _pp.every(function(ph){ return ph && ph.stages && ph.stages.length; });
  var PIPELINE = _valid ? _pp : DEFAULT_PIPELINE;

  // Responsive: detect mobile viewport
  var _mob = useState(typeof window !== "undefined" && window.innerWidth < 720);
  var isMobile = _mob[0]; var setMobile = _mob[1];
  useEffect(function(){
    if (typeof window === "undefined") return;
    function onResize(){ setMobile(window.innerWidth < 720); }
    window.addEventListener("resize", onResize);
    return function(){ window.removeEventListener("resize", onResize); };
  },[]);

  var _localOpen = useState(null);
  var localOpen = _localOpen[0], setLocalOpen = _localOpen[1];
  var pipeOpen = props.pipeOpen !== undefined ? props.pipeOpen : localOpen;
  var setPipeOpen = props.setPipeOpen || setLocalOpen;
  var PipeVis = props.PipeVis || null;

  var _act = useState(0);         var actIdx = _act[0];   var setActIdx = _act[1];
  var _t   = useState(0);         var t      = _t[0];     var setT      = _t[1];
  var _playing = useState(true);  var playing= _playing[0];var setPlaying= _playing[1];
  var _speed   = useState(0.5);     var speed  = _speed[0]; var setSpeed  = _speed[1];
  var rafRef = useRef(null);
  var tRef = useRef(0);
  var aRef = useRef(0);
  var lastRef = useRef(null);

  var totalDur = useMemo(function(){ var s=0; ACTS.forEach(function(a){s+=a.dur;}); return s; },[]);
  var act = ACTS[actIdx] || ACTS[0];

  useEffect(function(){
    if (!playing) { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastRef.current=null; return; }
    function tick(ts) {
      if (lastRef.current==null) lastRef.current=ts;
      var dt = (ts - lastRef.current) * speed;
      lastRef.current = ts;
      tRef.current += dt;
      var curAct = ACTS[aRef.current];
      if (tRef.current >= curAct.dur) {
        tRef.current = 0;
        aRef.current = (aRef.current + 1) % ACTS.length;
        setActIdx(aRef.current);
      }
      setT(tRef.current / curAct.dur);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return function(){ if (rafRef.current) cancelAnimationFrame(rafRef.current); lastRef.current=null; };
  },[playing, speed]);

  function jumpTo(i){ aRef.current=i; tRef.current=0; setActIdx(i); setT(0); }
  function togglePlay(){ setPlaying(!playing); }

  var elapsed = 0;
  for (var k=0;k<actIdx;k++) elapsed += ACTS[k].dur;
  elapsed += t * act.dur;
  var globalPct = Math.min(100, (elapsed / totalDur) * 100);

  return (
    <div style={{minHeight:"100vh",background:$.bg,fontFamily:F.s,color:$.tx2,paddingBottom:80}}>

      {/* ─── CINEMATIC TOP STAGE ─── */}
      <div style={{position:"relative",
        background:"linear-gradient(180deg, #06090f 0%, "+$.bg+" 85%)",
        borderBottom:"1px solid rgba(255,255,255,.04)",overflow:"hidden"}}>

        <div style={{position:"absolute",top:-200,left:"50%",transform:"translateX(-50%)",
          width:900,height:600,borderRadius:"50%",
          background:"radial-gradient(ellipse at center, "+act.color+"22 0%, transparent 60%)",
          pointerEvents:"none",transition:"background 2s ease"}}/>

        <div style={{maxWidth:1200,margin:"0 auto",padding:isMobile?"18px 14px 0":"26px 24px 0",position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20}}>
            <div>
              <p style={{fontFamily:F.m,fontSize:10,color:$.glow,letterSpacing:4,marginBottom:10,margin:0}}>HOW THE AI LEARNS · 7 STEPS</p>
              <h2 style={{fontSize:"clamp(22px,3.2vw,32px)",fontWeight:600,fontFamily:serif,color:$.tx,margin:"6px 0 4px",lineHeight:1.15}}>
                How we built an AI that keeps the power on
              </h2>
              <p style={{fontSize:13,color:$.tx3,lineHeight:1.7,margin:0,maxWidth:640}}>
                Watch the story unfold. We collect grid data, find what matters, teach four AI helpers, test them, try to break them, then send the best one out to watch the grid for us.
              </p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={togglePlay} className="cineBtn"
                style={{background:playing?"rgba(255,255,255,.04)":$.glow,color:playing?$.tx2:$.bg,
                  border:"1px solid "+(playing?"rgba(255,255,255,.08)":$.glow),borderRadius:8,
                  padding:"8px 16px",fontSize:11,fontFamily:F.m,letterSpacing:.5,cursor:"pointer",fontWeight:600,minWidth:86}}>
                {playing ? "❚❚  PAUSE" : "▶  PLAY"}
              </button>
              {[.5,1,2].map(function(sp){
                var a = speed===sp;
                return (<button key={sp} onClick={function(){setSpeed(sp);}} className="cineBtn"
                  style={{background:a?$.glow+"18":"transparent",color:a?$.glow:$.dim,
                    border:"1px solid "+(a?$.glow+"44":"rgba(255,255,255,.06)"),borderRadius:6,
                    padding:"7px 10px",fontSize:10,fontFamily:F.m,cursor:"pointer",minWidth:36}}>
                  {sp}×</button>);
              })}
            </div>
          </div>

          <div style={{marginTop:22,display:"flex",gap:4,alignItems:"center"}}>
            {ACTS.map(function(a,i){
              var active = i===actIdx;
              var done = i<actIdx;
              var pct = active ? t*100 : (done?100:0);
              return (
                <div key={a.id} onClick={function(){jumpTo(i);}}
                  style={{flex:1,cursor:"pointer",padding:"6px 0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontFamily:F.m,fontSize:isMobile?7:8.5,letterSpacing:isMobile?.5:1.4,
                      color:active?a.color:done?$.tx3:$.dim,fontWeight:active?700:500,
                      transition:"color .3s",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {isMobile ? String(i+1).padStart(2,"0") : String(i+1).padStart(2,"0") + " · " + a.phase.toUpperCase()}
                    </span>
                    {active && <span style={{fontFamily:F.m,fontSize:8,color:a.color,
                      animation:"cineBlink 1.2s ease-in-out infinite"}}>●</span>}
                  </div>
                  <div style={{height:2,background:"rgba(255,255,255,.05)",borderRadius:1,overflow:"hidden"}}>
                    <div style={{width:pct+"%",height:"100%",
                      background:active?a.color:done?"rgba(255,255,255,.18)":"transparent",
                      transition:active?"width .1s linear":"width .4s ease",
                      boxShadow:active?"0 0 8px "+a.color+"88":"none"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{maxWidth:1200,margin:"0 auto",padding:isMobile?"20px 14px 40px":"30px 24px 44px",position:"relative",minHeight:isMobile?"auto":560}}>
          <div key={"cap"+actIdx} style={{
            position:isMobile?"relative":"absolute",
            left:isMobile?"auto":24,
            top:isMobile?"auto":22,
            maxWidth:isMobile?"100%":320,
            marginBottom:isMobile?16:0,
            zIndex:3,
            animation:"cineFade .6s ease both"}}>
            <div style={{fontFamily:F.m,fontSize:9,color:act.color,letterSpacing:2,marginBottom:8}}>
              STEP {actIdx+1} OF 7
            </div>
            <h3 style={{fontFamily:serif,fontSize:isMobile?"clamp(20px,5.5vw,26px)":"clamp(22px,2.6vw,30px)",color:$.tx,
              fontWeight:500,margin:"0 0 8px",lineHeight:1.2}}>
              {act.title}
            </h3>
            <p style={{fontFamily:F.s,fontSize:isMobile?12:13,color:$.tx3,lineHeight:1.6,margin:0}}>
              {act.sub}
            </p>
          </div>

          {isMobile && (
            <div style={{position:"relative",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1,minWidth:60}}>
                {(elapsed/1000).toFixed(1)}s / {(totalDur/1000).toFixed(0)}s
              </span>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)",position:"relative"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:globalPct+"%",
                  background:"linear-gradient(90deg,"+act.color+"aa,"+act.color+")",transition:"width .1s linear"}}/>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:act.color,letterSpacing:1,fontWeight:600,minWidth:32,textAlign:"right"}}>
                {Math.round(globalPct)}%
              </span>
            </div>
          )}

          <div style={{marginLeft:isMobile?0:"clamp(0px, 28vw, 360px)",minHeight:isMobile?"auto":460,position:"relative"}}>
            <SceneRenderer act={act} t={t} actIdx={actIdx} isMobile={isMobile}/>
          </div>

          {!isMobile && (
            <div style={{position:"absolute",left:24,right:24,bottom:12,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1}}>
                {(elapsed/1000).toFixed(1)}s / {(totalDur/1000).toFixed(0)}s
              </span>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)",position:"relative"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:globalPct+"%",
                  background:"linear-gradient(90deg,"+act.color+"aa,"+act.color+")",transition:"width .1s linear"}}/>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:act.color,letterSpacing:1,fontWeight:600,minWidth:38,textAlign:"right"}}>
                {Math.round(globalPct)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* BELOW THE FOLD */}
      <div style={{maxWidth:880,margin:"0 auto",padding:"36px 20px 56px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:3,marginBottom:6}}>↓ WANT MORE DETAIL? KEEP SCROLLING ↓</div>
          <h3 style={{fontFamily:serif,fontSize:22,color:$.tx,fontWeight:500,margin:"0 0 6px"}}>
            Every step, explained
          </h3>
          <p style={{fontSize:12,color:$.tx3,margin:0}}>
          Each step, with a simple explanation and what it looks like.
          </p>
        </div>

        {PIPELINE.filter(function(ph){ return ph && ph.stages && ph.stages.length; }).map(function(ph) {
          return (
            <div key={ph.phase} style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:ph.color,flexShrink:0}}/>
                <span style={{fontFamily:F.m,fontSize:9,color:ph.color,letterSpacing:".06em",fontWeight:600}}>{ph.phase.toUpperCase()}</span>
                <div style={{flex:1,height:1,background:ph.color,opacity:.12}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
  {ph.stages.map(function(s){
    return (
      <div key={s.n}
        style={{background:$.bg2,border:"1px solid "+$.brd,
          borderRadius:9,padding:"14px 16px",transition:"all .25s"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:ph.color+"14",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            fontFamily:F.m,fontSize:11,fontWeight:700,color:ph.color}}>{s.n}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:$.tx,marginBottom:3}}>{s.name}</div>
            <div style={{fontSize:11,color:$.tx3,lineHeight:1.55}}>{s.plain}</div>
          </div>
        </div>
        {PipeVis && (
          <div style={{paddingTop:10,borderTop:"1px solid rgba(255,255,255,.03)",display:"flex",justifyContent:"center"}}>
            <PipeVis n={s.n} color={ph.color}/>
          </div>
        )}
      </div>
    );
  })}
</div>
            </div>
          );
        })}
        </div>
    </div>
  );
}

/* ═══ SCENE RENDERER ═══ */
function SceneRenderer(props) {
  var act = props.act, t = props.t, actIdx = props.actIdx, isMobile = props.isMobile;
  return (
    <div key={actIdx} style={{width:"100%",height:isMobile?"auto":460,minHeight:isMobile?380:460,position:"relative",animation:"cineFade .55s ease both"}}>
      {act.id==="load"     && <SceneLoad t={t} color={act.color} isMobile={isMobile}/>}
      {act.id==="engineer" && <SceneEngineer t={t} color={act.color} isMobile={isMobile}/>}
      {act.id==="select"   && <SceneSelect t={t} color={act.color} isMobile={isMobile}/>}
      {act.id==="train"    && <SceneTrain t={t} color={act.color} isMobile={isMobile}/>}
      {act.id==="evaluate" && <SceneEvaluate t={t} color={act.color} isMobile={isMobile}/>}
      {act.id==="stress"   && <SceneStress t={t} color={act.color} isMobile={isMobile}/>}
      {act.id==="deploy"   && <SceneDeploy t={t} color={act.color} isMobile={isMobile}/>}
    </div>
  );
}

/* ═══ ACT 1: DATA LOADING ═══ */
function SceneLoad(props) {
  var t = props.t, color = props.color, isMobile = props.isMobile;
  var loaded = Math.floor(Math.min(1, t*1.3) * 60000);
  var nan = t < 0.55 ? Math.floor(t*1800) : Math.max(0, Math.floor((1-t)*200));
  var pct = Math.min(1, t*1.3);
  return (
    <div style={{width:"100%",height:isMobile?"auto":"100%",display:"grid",gridTemplateRows:isMobile?"auto auto":"1fr auto",gap:16}}>
      <div style={{position:"relative",background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"18px 22px",overflow:"hidden"}}>
        <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:14}}>
          READING THE POWER GRID
        </div>
        <svg viewBox="0 0 640 240" style={{width:"100%",height:220}}>
          <defs>
            <linearGradient id="sgL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.6"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="160" height="46" rx="6" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
          <text x="30" y="40" fill={$.tx3} fontSize="10" fontFamily={F.m}>smart_grid_stability</text>
          <text x="30" y="55" fill={$.dim} fontSize="9" fontFamily={F.m}>augmented.csv.xlsx</text>
          {Array.from({length:30}).map(function(_,i){
            var x = 200 + i*12;
            var delay = (i*0.06)%1;
            var phase = (t*4 + delay) % 1;
            var visible = phase > 0.1 && phase < 0.9;
            return (
              <line key={i} x1={x} y1={42+phase*80} x2={x} y2={60+phase*80}
                stroke={color} strokeWidth="1.3" opacity={visible?0.9:0}/>
            );
          })}
          <rect x="450" y="80" width="170" height="130" rx="8" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.2"/>
          <rect x="450" y={80+130-pct*125} width="170" height={pct*125} rx="8" fill="url(#sgL)"/>
          <text x="535" y="100" fill={color} fontSize="11" fontFamily={F.m} fontWeight="700" textAnchor="middle">
            {loaded.toLocaleString()}
          </text>
          <text x="535" y="114" fill={$.dim} fontSize="8" fontFamily={F.m} textAnchor="middle">samples</text>
          <path d="M 185 43 L 445 143" stroke="rgba(255,255,255,.08)" strokeWidth="1" strokeDasharray="3,4"/>
        </svg>
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:8}}>
        <Stat label="READINGS COLLECTED"  value={loaded.toLocaleString()} color={color}/>
        <Stat label="THINGS WE MEASURE"   value="12"                       color={color}/>
        <Stat label="BROKEN READINGS"     value={nan}                      color={nan>0?$.rd:color} pulse={nan>0}/>
        <Stat label="GRIDS IN TROUBLE"    value={(t>0.5?"37%":"—")}        color={color}/>
      </div>
    </div>
  );
}

/* ═══ ACT 2: FEATURE ENGINEERING ═══ */
function SceneEngineer(props) {
  var t = props.t, color = props.color, isMobile = props.isMobile;
  var raw = ["Node 1 time","Node 2 time","Node 3 time","Node 4 time","Node 1 power","Node 2 power","Node 3 power","Node 4 power","Node 1 gain","Node 2 gain","Node 3 gain","Node 4 gain"];
  var newFeats = [
    "Node 1 flow","Node 2 flow","Node 3 flow","Node 4 flow",
    "Average flow","Flow wobble","Weakest flow",
    "Grid health","Weakest node",
    "Average timing","Timing wobble","Slowest time",
    "Average gain","Gain wobble","Biggest gain",
    "Total power","Power balance"
  ];
  var keyLabels = ["Node 1 flow","Node 2 flow","Node 3 flow","Node 4 flow","Average flow","Flow wobble","Weakest flow","Grid health","Weakest node"];
  var reveal = Math.min(1, t*1.4);
  var featCount = Math.min(48, Math.floor(reveal * 48));
  var highlight = Math.floor((t*12) % newFeats.length);
  var visibleN = Math.min(featCount, newFeats.length);

  return (
    <div style={{width:"100%",height:isMobile?"auto":"100%",display:"grid",gridTemplateRows:isMobile?"auto auto":"1fr auto",gap:16}}>
      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
        <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:14}}>
          TURNING NUMBERS INTO CLUES
        </div>
        <svg viewBox="0 0 640 280" style={{width:"100%",height:270}}>
          {raw.map(function(f,i){
            var y = 20 + i*20;
            return (
              <g key={f}>
                <rect x="6" y={y} width="100" height="15" rx="3" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" strokeWidth=".5"/>
                <text x="56" y={y+10} fill={$.tx3} fontSize="8" fontFamily={F.s} textAnchor="middle">{f}</text>
              </g>
            );
          })}
          <text x="56" y={20+12*20+10} fill={$.dim} fontSize="8" fontFamily={F.m} textAnchor="middle">12 basic readings</text>

          {raw.map(function(_,i){
            var sy = 20 + i*20 + 7;
            var lines = [];
            for (var j=0; j<visibleN; j++) {
              if ((i+j)%3!==0) continue;
              var tj = (i+j*3) % newFeats.length;
              var ey = 15 + tj*13 + 5;
              lines.push(<path key={i+"-"+j} d={"M 106 "+sy+" Q 280 "+((sy+ey)/2)+" 390 "+ey}
                stroke={color} strokeWidth=".4" opacity={.18} fill="none"/>);
            }
            return <g key={"g"+i}>{lines}</g>;
          })}

          {newFeats.slice(0, visibleN).map(function(f,i){
            var y = 15 + i*13;
            var isKey = keyLabels.indexOf(f) >= 0;
            var isHi = i===highlight;
            return (
              <g key={f}>
                <rect x="390" y={y} width="140" height="10" rx="2"
                  fill={isHi?color+"55":isKey?color+"22":"rgba(255,255,255,.04)"}
                  stroke={isHi?color:isKey?color+"55":"rgba(255,255,255,.08)"} strokeWidth=".5"
                  style={{animation:"cineDrop .3s ease both", animationDelay:(i*0.018)+"s"}}/>
                <text x="460" y={y+7} fill={isHi?$.tx:isKey?color:$.tx3} fontSize="8" fontFamily={F.s} textAnchor="middle"
                  fontWeight={isKey?700:400}>{f}</text>
              </g>
            );
          })}

          {t > 0.35 && (
            <g style={{animation:"cineFade .5s ease both"}}>
              <rect x="545" y="40" width="90" height="80" rx="6" fill={$.bg3} stroke={color+"44"} strokeWidth="1"/>
              <text x="590" y="58" fill={color} fontSize="8" fontFamily={F.m} textAnchor="middle" fontWeight="700" letterSpacing="1">
                MOST IMPORTANT
              </text>
              <text x="590" y="72" fill={color} fontSize="8" fontFamily={F.m} textAnchor="middle" fontWeight="700" letterSpacing="1">
                CLUE
              </text>
              <text x="590" y="94" fill={$.tx} fontSize="13" fontFamily={serif} textAnchor="middle" fontStyle="italic">
                Power Flow
              </text>
              <text x="590" y="110" fill={$.tx3} fontSize="7" fontFamily={F.s} textAnchor="middle">
                = timing × gain
              </text>
            </g>
          )}
        </svg>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:8}}>
        <Stat label="WE STARTED WITH"    value="12"        color={$.dim}/>
        <Stat label="CLUES WE BUILT"     value={featCount} color={color} pulse={t<0.7}/>
        <Stat label="MOST POWERFUL"      value={featCount>=5?"5":featCount} color={color}/>
        <Stat label="MISSING DATA"       value="0"         color={$.gn}/>
      </div>
    </div>
  );
}

/* ═══ ACT 3: RFECV SELECTION ═══ */
function SceneSelect(props) {
  var t = props.t, color = props.color, isMobile = props.isMobile;
  var keepIdx = [0,1,2,4,5,7,9,11,13,16,18,22,25,30];
  var drawTo = Math.min(1, t*1.2);
  var kept = Math.round(drawTo * 14);
  var remaining = 48 - Math.round(drawTo * (48-14));

  var nFeats = [48,40,36,32,28,24,20,18,16,14,12,10,8,6,4,2];
  var aucs   = [.9998,.9998,.9998,.9997,.9997,.9997,.9996,.9996,.9995,.9994,.9990,.9982,.9960,.9900,.9750,.9500];
  var maxPt = Math.floor(drawTo * nFeats.length);

  var markerX = 40 + (48-14)/48*300;
  var markerY = 170 - (.9994-.94)*2000;

  return (
    <div style={{width:"100%",height:isMobile?"auto":"100%",display:"grid",gridTemplateRows:isMobile?"auto auto":"1fr auto",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1.1fr 1fr",gap:14}}>

        <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
          borderRadius:12,padding:"16px 18px"}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:10}}>
            48 CLUES TO CHOOSE FROM
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:4}}>
            {Array.from({length:48}).map(function(_,i){
              var keep = keepIdx.indexOf(i) >= 0;
              var dropped = !keep && t > 0.15 + (i*0.005);
              return (
                <div key={i} style={{
                  aspectRatio:"1.2",
                  background:keep?color+"22":dropped?"rgba(255,255,255,.015)":"rgba(255,255,255,.06)",
                  border:"1px solid "+(keep?color+"66":dropped?"rgba(255,255,255,.02)":"rgba(255,255,255,.08)"),
                  borderRadius:3,
                  opacity:dropped?0.15:1,
                  transition:"all .5s ease",
                  transform:dropped?"scale(0.6)":"scale(1)",
                  position:"relative",
                }}>
                  {keep && t>0.4 && <div style={{position:"absolute",inset:0,
                    background:color,opacity:.1,borderRadius:3,
                    animation:"cinePulse 2s ease-in-out infinite"}}/>}
                </div>
              );
            })}
          </div>
          <div style={{marginTop:14,display:"flex",gap:16,fontFamily:F.m,fontSize:9}}>
            <span style={{color:color}}>■ WE KEEP · {kept}</span>
            <span style={{color:$.dim}}>□ WE THROW OUT · {48-remaining}</span>
          </div>
        </div>

        <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
          borderRadius:12,padding:"16px 18px",position:"relative"}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:10}}>
            HOW GOOD THE AI IS WITH FEWER CLUES
          </div>
          <svg viewBox="0 0 360 200" style={{width:"100%",height:200}}>
            <line x1="40" y1="170" x2="340" y2="170" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
            <line x1="40" y1="20" x2="40" y2="170" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
            {[.95,.96,.97,.98,.99,1.0].map(function(y){
              var yp = 170 - (y-.94)*2000;
              return <g key={y}>
                <line x1="38" y1={yp} x2="42" y2={yp} stroke="rgba(255,255,255,.2)" strokeWidth=".5"/>
                <text x="34" y={yp+3} fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="end">{y.toFixed(2)}</text>
              </g>;
            })}
            {[48,32,20,14,8,2].map(function(n){
              var xp = 40 + (48-n)/48*300;
              return <text key={n} x={xp} y="183" fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="middle">{n}</text>;
            })}
            {maxPt > 0 && (
              <polyline
                points={nFeats.slice(0,maxPt).map(function(n,i){
                  var x = 40 + (48-n)/48*300;
                  var y = 170 - (aucs[i]-.94)*2000;
                  return x+","+y;
                }).join(" ")}
                fill="none" stroke={color} strokeWidth="1.8"/>
            )}
            {maxPt > 9 && (
              <g style={{animation:"cineFade .6s ease both"}}>
                <line x1={markerX} y1="170" x2={markerX} y2={markerY} stroke={color} strokeWidth=".5" strokeDasharray="2,3" opacity=".5"/>
                <circle cx={markerX} cy={markerY} r="5" fill={color}/>
                <circle cx={markerX} cy={markerY} r="5" fill="none" stroke={color} strokeWidth="1" opacity=".6"
                  style={{animation:"cineRing 1.6s ease-out infinite"}}/>
                <text x={markerX+10} y={markerY+3} fill={$.tx} fontSize="9" fontFamily={F.m} fontWeight="700">n=14</text>
              </g>
            )}
            <text x="40" y="14" fill={$.dim} fontSize="7" fontFamily={F.m}>HOW GOOD →</text>
            <text x="340" y="197" fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="end">fewer clues →</text>
          </svg>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:8}}>
        <Stat label="CLUES TO START"  value="48"       color={$.dim}/>
        <Stat label="CLUES LEFT"      value={remaining} color={color} pulse={t<0.8}/>
        <Stat label="ACCURACY LOST"   value="Almost none"   color={$.gn}/>
        <Stat label="BEST NUMBER"     value={t>0.8?"14 clues":"—"} color={color}/>
      </div>
    </div>
  );
}

/* ═══ ACT 4: TRAINING ═══ */
function SceneTrain(props) {
  var t = props.t, isMobile = props.isMobile;
  var models = [
    {name:"Helper 1",  color:"#a78bfa", auc:.9999, kind:"boundary"},
    {name:"Helper 2",   color:"#34d399", auc:1.000, kind:"forest"},
    {name:"Helper 3", color:"#67e8f9", auc:1.000, kind:"gradient"},
    {name:"Helper 4",   color:"#fbbf24", auc:.9910, kind:"line"},
  ];
  var lcRows = [{data:LC_HYB,c:"#fbbf24",name:"TEAM"},{data:LC_LGBM,c:"#67e8f9",name:"H3"},{data:LC_RF,c:"#34d399",name:"H2"},{data:LC_LR,c:"#a78bfa",name:"H4"}];

  return (
    <div style={{width:"100%",height:isMobile?"auto":"100%",display:"grid",gridTemplateRows:isMobile?"auto auto":"auto 1fr",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:10}}>
        {models.map(function(m,i){
          var localT = Math.max(0, Math.min(1, (t - i*0.08) * 1.5));
          return (
            <div key={m.name} style={{background:"rgba(255,255,255,.015)",
              border:"1px solid "+(localT>0?m.color+"33":"rgba(255,255,255,.04)"),
              borderRadius:10,padding:"12px 12px 10px",
              transition:"border-color .4s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontFamily:F.m,fontSize:10,color:m.color,fontWeight:700}}>{m.name}</span>
                {localT>=1
                  ? <span style={{fontFamily:F.m,fontSize:8,color:$.gn}}>✓ READY</span>
                  : localT>0 ? <span style={{fontFamily:F.m,fontSize:8,color:m.color,animation:"cineBlink .8s ease-in-out infinite"}}>LEARNING</span>
                  : <span style={{fontFamily:F.m,fontSize:8,color:$.dim}}>WAITING</span>
                }
              </div>
              <TrainMini kind={m.kind} t={localT} color={m.color}/>
              <div style={{marginTop:8,display:"flex",justifyContent:"space-between",fontFamily:F.m,fontSize:9}}>
                <span style={{color:$.dim}}>SCORE</span>
                <span style={{color:localT>=1?m.color:$.tx3,fontWeight:700}}>
                  {localT>=1 ? (m.auc*100).toFixed(1)+"%" : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"14px 18px"}}>
        <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:8}}>
          HOW FAST EACH HELPER LEARNS
        </div>
        <svg viewBox="0 0 600 200" style={{width:"100%",height:180}}>
          <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
          <line x1="40" y1="20"  x2="40"  y2="170" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
          {[.99,.995,1.0].map(function(y){
            var yp = 170 - (y-.988)*12000;
            return <g key={y}>
              <line x1="38" y1={yp} x2="42" y2={yp} stroke="rgba(255,255,255,.2)" strokeWidth=".5"/>
              <text x="34" y={yp+3} fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="end">{y.toFixed(3)}</text>
            </g>;
          })}
          {[2400,7200,12000,16800,21600].map(function(x,i){
            var xp = 40 + i*135;
            return <text key={x} x={xp} y="183" fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="middle">{(x/1000).toFixed(1)}k</text>;
          })}
          {lcRows.map(function(row,idx){
            var maxI = Math.min(LC_FRACS.length, Math.floor(t * LC_FRACS.length) + 1);
            var sliced = row.data.slice(0, maxI);
            if (sliced.length === 0) return null;
            var pts = sliced.map(function(v,i){
              var x = 40 + (i/(LC_FRACS.length-1))*540;
              var y = 170 - (v-.988)*12000;
              return x+","+y;
            });
            var lastCoords = pts[pts.length-1].split(",");
            var lastX = parseFloat(lastCoords[0]);
            var lastY = parseFloat(lastCoords[1]);
            return (
              <g key={row.name}>
                <polyline points={pts.join(" ")} fill="none" stroke={row.c} strokeWidth="1.6"/>
                <circle cx={lastX} cy={lastY} r="3" fill={row.c}/>
                <text x={555} y={30+idx*14} fill={row.c} fontSize="9" fontFamily={F.m} fontWeight="700">{row.name}</text>
                <rect x={539} y={25+idx*14} width="12" height="3" fill={row.c} opacity=".8"/>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function TrainMini(props) {
  var kind = props.kind, t = props.t, color = props.color;
  if (kind==="boundary") {
    return (
      <svg viewBox="0 0 120 70" style={{width:"100%",height:70}}>
        {Array.from({length:18}).map(function(_,i){
          var x = 10 + (i*23 % 100);
          var y = 10 + ((i*37+i*i) % 50);
          var cls = (x+y*0.3) > 50;
          return <circle key={i} cx={x} cy={y} r="2"
            fill={cls?color:$.dim} opacity={cls?0.85:0.35}/>;
        })}
        {t>0.15 && (
          <path d={"M 5 "+(65-t*20)+" Q 60 "+(35-t*5)+" 115 "+(5+t*10)}
            stroke={color} strokeWidth="1.3" fill="none"
            strokeDasharray="200" strokeDashoffset={(1-Math.min(1,t*1.3))*200}
            opacity="0.9"/>
        )}
      </svg>
    );
  }
  if (kind==="forest") {
    return (
      <svg viewBox="0 0 120 70" style={{width:"100%",height:70}}>
        {[0,1,2,3,4].map(function(i){
          var x = 12 + i*24;
          var h = Math.max(5, t*35 - i*2);
          return (
            <g key={i} opacity={Math.min(1,t*2 - i*0.1)}>
              <line x1={x} y1="58" x2={x} y2={58-h} stroke={color} strokeWidth="1.2"/>
              {h>10 && <line x1={x} y1={58-h*0.6} x2={x-6} y2={58-h*0.8} stroke={color} strokeWidth=".8"/>}
              {h>10 && <line x1={x} y1={58-h*0.6} x2={x+6} y2={58-h*0.8} stroke={color} strokeWidth=".8"/>}
              {h>18 && <line x1={x-6} y1={58-h*0.8} x2={x-10} y2={58-h*1.0} stroke={color} strokeWidth=".5"/>}
              {h>18 && <line x1={x+6} y1={58-h*0.8} x2={x+10} y2={58-h*1.0} stroke={color} strokeWidth=".5"/>}
            </g>
          );
        })}
        <line x1="0" y1="58" x2="120" y2="58" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
      </svg>
    );
  }
  if (kind==="gradient") {
    return (
      <svg viewBox="0 0 120 70" style={{width:"100%",height:70}}>
        <path d="M 5 15 Q 25 20 40 30 Q 60 45 80 55 Q 100 62 115 63"
          stroke={color} strokeWidth="1.5" fill="none"
          strokeDasharray="180" strokeDashoffset={(1-t)*180}/>
        <circle cx={5 + t*110} cy={15 + t*48} r="3" fill={color}
          style={{animation:"cineGlow 1s ease-in-out infinite"}}/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 70" style={{width:"100%",height:70}}>
      {Array.from({length:14}).map(function(_,i){
        var x = 8 + i*8;
        var y = 35 + Math.sin(i*0.8 + t*2)*18 * (1-t*0.6);
        return <circle key={i} cx={x} cy={y} r="1.8" fill={color} opacity={.5 + t*0.4}/>;
      })}
      <line x1="5" y1={55 - t*20} x2="115" y2={15 + t*8}
        stroke={color} strokeWidth="1.4" opacity={Math.min(1,t*1.4)}/>
    </svg>
  );
}

/* ═══ ACT 5: EVALUATION ═══ */
function SceneEvaluate(props) {
  var t = props.t, color = props.color, isMobile = props.isMobile;
  var rocRows = [
    {c:"#fbbf24",auc:1.000, name:"TEAM"},
    {c:"#67e8f9",auc:1.000, name:"H3"},
    {c:"#34d399",auc:1.000, name:"H2"},
    {c:"#a78bfa",auc:0.991, name:"H1"}
  ];
  return (
    <div style={{width:"100%",height:isMobile?"auto":"100%",display:"grid",
      gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gridTemplateRows:isMobile?"auto":"auto auto",gap:12}}>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"14px 16px"}}>
        <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:6}}>HOW OFTEN EACH HELPER IS RIGHT</div>
        <svg viewBox="0 0 220 180" style={{width:"100%",height:150}}>
          <line x1="30" y1="160" x2="210" y2="160" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
          <line x1="30" y1="10" x2="30" y2="160" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
          <line x1="30" y1="160" x2="210" y2="10" stroke="rgba(255,255,255,.04)" strokeWidth=".5" strokeDasharray="2,3"/>
          {rocRows.map(function(row, i){
            var pts = rocPath(row.auc);
            var upto = Math.floor(Math.min(1, (t*2) - i*0.06) * pts.length);
            if (upto <= 0) return null;
            return (
              <g key={row.name}>
                <polyline
                  points={pts.slice(0, upto).map(function(p){ return (30+p[0]*180)+","+(160-p[1]*150); }).join(" ")}
                  fill="none" stroke={row.c} strokeWidth="1.4" opacity=".95"/>
                <text x="180" y={18+i*12} fill={row.c} fontSize="8" fontFamily={F.m} fontWeight="700">
                  {row.name} {row.auc.toFixed(3)}
                </text>
              </g>
            );
          })}
          <text x="120" y="176" fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="middle">false alarms →</text>
          <text x="14" y="85" fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="middle" transform="rotate(-90 14 85)">correct catches →</text>
        </svg>
      </div>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"14px 16px"}}>
        <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:6}}>RIGHT vs WRONG ANSWERS</div>
        <svg viewBox="0 0 220 180" style={{width:"100%",height:150}}>
          {[[0,0],[0,1],[1,0],[1,1]].map(function(p,i){
            var r = p[0], c = p[1];
            var x = 50 + c*75;
            var y = 30 + r*60;
            var actual = CM_TARGET[r][c];
            var cur = Math.floor(actual * Math.min(1, t*1.4));
            var correct = r===c;
            return (
              <g key={i}>
                <rect x={x} y={y} width="70" height="55" rx="4"
                  fill={correct?color+"33":$.rd+"22"}
                  stroke={correct?color+"88":$.rd+"88"} strokeWidth="1"
                  style={{animation:"cineDrop .4s ease both", animationDelay:(i*.08)+"s"}}/>
                <text x={x+35} y={y+35} fill={correct?color:$.rd} fontSize="14"
                  fontFamily={F.m} fontWeight="700" textAnchor="middle">{cur.toLocaleString()}</text>
              </g>
            );
          })}
          <text x="85"  y="24"  fill={$.dim} fontSize="8" fontFamily={F.m} textAnchor="middle">Said OK</text>
          <text x="160" y="24"  fill={$.dim} fontSize="8" fontFamily={F.m} textAnchor="middle">Said bad</text>
          <text x="44"  y="62"  fill={$.dim} fontSize="8" fontFamily={F.m} textAnchor="end">Was OK</text>
          <text x="44"  y="122" fill={$.dim} fontSize="8" fontFamily={F.m} textAnchor="end">Was bad</text>
          <text x="85"  y="170" fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="middle">green = correct</text>
        </svg>
      </div>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"14px 16px"}}>
        <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:6}}>IS THE AI HONEST ABOUT ITS CONFIDENCE?</div>
        <svg viewBox="0 0 220 180" style={{width:"100%",height:150}}>
          <line x1="30" y1="160" x2="210" y2="10" stroke="rgba(255,255,255,.1)" strokeWidth=".6" strokeDasharray="3,4"/>
          {Array.from({length:10}).map(function(_,i){
            var x = 30 + i*18;
            var p = i*0.1;
            var q = p + Math.sin(i*0.8+t*3)*0.015*(1-Math.min(1,t*1.1));
            var yC = 160 - q*150;
            var appearAt = i*0.09;
            if (t < appearAt) return null;
            return <circle key={i} cx={x} cy={yC} r="3" fill={color}
              style={{animation:"cineDrop .3s ease both"}}/>;
          })}
          {Array.from({length:9}).map(function(_,i){
            var x1 = 30 + i*18, x2 = 30 + (i+1)*18;
            var p1 = i*0.1, p2 = (i+1)*0.1;
            var y1 = 160 - p1*150, y2 = 160 - p2*150;
            if (t < i*0.09) return null;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.2"
              style={{animation:"cineFade .4s ease both"}}/>;
          })}
          <text x="14" y="85" fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="middle" transform="rotate(-90 14 85)">how often right</text>
          <text x="120" y="176" fill={$.dim} fontSize="7" fontFamily={F.m} textAnchor="middle">how confident the AI said</text>
        </svg>
      </div>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"14px 16px",position:"relative"}}>
        <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:6}}>SAFETY PROMISE</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:150,flexDirection:"column",gap:10}}>
          <div style={{fontFamily:serif,fontSize:44,color:color,fontWeight:500,lineHeight:1,
            animation:t>0.6?"cineFade .6s ease both":"none",opacity:t>0.6?1:0}}>
            {t>0.6 ? "99.95%" : ""}
          </div>
          <div style={{fontSize:11,color:$.tx3,fontFamily:F.m,textAlign:"center"}}>
            right at least this often<br/>
            <span style={{color:$.dim,fontSize:9}}>promise was 95%</span>
          </div>
          {t>0.8 && <div style={{fontFamily:F.m,fontSize:8,color:color,letterSpacing:1.5,animation:"cineFade .4s ease both"}}>
            ✓ PROMISE KEPT
          </div>}
        </div>
      </div>
    </div>
  );
}

/* ═══ ACT 6: STRESS ═══ */
function SceneStress(props) {
  var t = props.t, color = props.color, isMobile = props.isMobile;
  var noise = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
  var ADV_FRIENDLY = [
    {name:"Helper 1", rate:32.4, color:"#f87171"},
    {name:"Helper 3", rate:0.26, color:"#67e8f9"},
    {name:"TEAM",     rate:7.6,  color:"#fbbf24"},
    {name:"Helper 2", rate:0.05, color:"#34d399"},
  ];
  return (
    <div style={{width:"100%",height:isMobile?"auto":"100%",display:"grid",
      gridTemplateRows:isMobile?"auto auto":"1fr 1fr",gap:12}}>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"14px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5}}>HOW OFTEN EACH HELPER GETS TRICKED</div>
          <div style={{fontFamily:F.m,fontSize:9,color:color}}>lower = better</div>
        </div>
        <svg viewBox="0 0 600 140" style={{width:"100%",height:130}}>
          {ADV_FRIENDLY.map(function(m,i){
            var x = 30 + i*142;
            var h = Math.min(1, t*1.3) * (m.rate/35) * 90;
            return (
              <g key={m.name}>
                <rect x={x} y={110-h} width="80" height={h} rx="4" fill={m.color}
                  style={{animation:"cineBar .5s ease both",animationDelay:(i*.12)+"s",transformOrigin:"bottom"}}/>
                <text x={x+40} y={126} fill={$.tx2} fontSize="10" fontFamily={F.m} textAnchor="middle" fontWeight="700">{m.name}</text>
                <text x={x+40} y={110-h-6} fill={m.color} fontSize="10" fontFamily={F.m} textAnchor="middle" fontWeight="700">
                  {m.rate.toFixed(1)}%
                </text>
                {m.name==="Helper 2" && t>0.7 && (
                  <text x={x+40} y={22} fill={$.gn} fontSize="8" fontFamily={F.m} textAnchor="middle" fontWeight="700"
                    style={{animation:"cineFade .4s ease both"}}>CANT BE TRICKED ✓</text>
                )}
                {m.name==="Helper 1" && t>0.3 && (
                  <text x={x+40} y={22} fill={$.rd} fontSize="8" fontFamily={F.m} textAnchor="middle" fontWeight="700"
                    style={{animation:"cineFade .4s ease both"}}>GETS TRICKED</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1.4fr 1fr",gap:12}}>
        <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
          borderRadius:12,padding:"12px 16px"}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:8}}>TOP CLUES THE AI USES</div>
          {SHAP_TOP.slice(0,7).map(function(f,i){
            var w = Math.min(1, (t*1.4) - i*0.04) * (f.v/10) * 100;
            if (w <= 0) return null;
            var labels = ["Power flow","Timing wobble","Average timing","Average power","Damping spread","Average damping","Lowest reserve"];
            return (
              <div key={f.f} style={{marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:F.m,fontSize:9,color:f.phys?color:$.tx3,width:90,textAlign:"right"}}>{labels[i]}</span>
                <div style={{flex:1,height:9,background:"rgba(255,255,255,.03)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{width:w+"%",height:"100%",background:f.phys?color:$.tx3,
                    transition:"width .2s",
                    borderRadius:2,
                    boxShadow:i===0?"0 0 8px "+color+"88":"none"}}/>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
          borderRadius:12,padding:"12px 16px"}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:10}}>ADDING STATIC & STILL WORKS</div>
          <div style={{fontFamily:serif,fontSize:34,color:color,lineHeight:1,textAlign:"center",marginBottom:8}}>
            {noise < 0.33 ? "a little" : noise < 0.66 ? "more" : "lots"}
          </div>
          <div style={{height:4,background:"rgba(255,255,255,.04)",borderRadius:2,position:"relative",marginBottom:14}}>
            <div style={{width:(noise*100)+"%",height:"100%",background:color,borderRadius:2,
              boxShadow:"0 0 8px "+color}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:F.m,fontSize:8,color:$.dim}}>
            <span>none</span><span>lots</span>
          </div>
          <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:F.m,fontSize:9,color:$.tx3}}>
              <span>Team accuracy</span>
              <span style={{color:color,fontWeight:700}}>{((0.9999 - noise*0.06)*100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ ACT 7: DEPLOYMENT ═══ */
function SceneDeploy(props) {
  var t = props.t, color = props.color, isMobile = props.isMobile;
  var nBatches = AUC_STREAM.length;
  var upto = Math.floor(Math.min(1, t) * nBatches);
  var aucSlice = AUC_STREAM.slice(0, upto);
  var psiSlice = PSI_STREAM.slice(0, upto);
  var alertFired = upto > 20;
  var lastAucX = upto > 0 ? 20 + ((upto-1)/(nBatches-1))*560 : 20;
  var lastAucY = upto > 0 ? 100 - ((aucSlice[aucSlice.length-1]-.65)/.35)*85 : 100;

  return (
    <div style={{width:"100%",height:isMobile?"auto":"100%",display:"grid",
      gridTemplateRows:isMobile?"auto auto auto":"1fr 1fr auto",gap:12}}>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"12px 18px",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5}}>HOW WELL THE AI IS DOING OVER TIME</div>
          <div style={{fontFamily:F.m,fontSize:9,color:color}}>
            {upto>0 ? (aucSlice[aucSlice.length-1]*100).toFixed(0)+"%" : "—"}
          </div>
        </div>
        <svg viewBox="0 0 600 110" style={{width:"100%",height:100}}>
          <rect x="20" y="10" width={(13/nBatches)*560} height="90" fill="#34d399" opacity=".06"/>
          <rect x={20+(13/nBatches)*560} y="10" width={(13/nBatches)*560} height="90" fill="#f59e0b" opacity=".06"/>
          <rect x={20+(26/nBatches)*560} y="10" width={(14/nBatches)*560} height="90" fill="#f87171" opacity=".06"/>
          <line x1="20" y1="100" x2="580" y2="100" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
          {aucSlice.length>0 && (
            <polyline points={aucSlice.map(function(v,i){
              var x = 20 + (i/(nBatches-1))*560;
              var y = 100 - ((v-.65)/.35)*85;
              return x+","+y;
            }).join(" ")} fill="none" stroke={color} strokeWidth="1.5"/>
          )}
          {upto>0 && (
            <circle cx={lastAucX} cy={lastAucY} r="3.5" fill={color}
              style={{animation:"cineGlow 1s ease-in-out infinite"}}/>
          )}
          <text x="24" y="20" fill="#34d399" fontSize="7" fontFamily={F.m} fontWeight="700">GRID CALM</text>
          <text x={24+(13/nBatches)*560} y="20" fill="#f59e0b" fontSize="7" fontFamily={F.m} fontWeight="700">SHIFTING</text>
          <text x={24+(26/nBatches)*560} y="20" fill="#f87171" fontSize="7" fontFamily={F.m} fontWeight="700">BIG CHANGE</text>
        </svg>
      </div>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"12px 18px",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5}}>TROUBLE DETECTOR · WARNS EARLY</div>
          <div style={{fontFamily:F.m,fontSize:9,color:alertFired?$.rd:$.gn}}>
            {alertFired ? "⚠ WARNING" : "✓ ALL GOOD"}
          </div>
        </div>
        <svg viewBox="0 0 600 110" style={{width:"100%",height:100}}>
          <line x1="20" y1="100" x2="580" y2="100" stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
          <line x1="20" y1={100 - (0.25/2.5)*85} x2="580" y2={100 - (0.25/2.5)*85}
            stroke={$.rd} strokeWidth=".8" strokeDasharray="4,4" opacity=".6"/>
          <text x="584" y={100 - (0.25/2.5)*85 + 3} fill={$.rd} fontSize="7" fontFamily={F.m}>alarm</text>
          {upto>1 && (
            <polygon points={"20,100 " + psiSlice.map(function(v,i){
              var x = 20 + (i/(nBatches-1))*560;
              var y = 100 - (v/2.5)*85;
              return x+","+y;
            }).join(" ") + " " + (20+((upto-1)/(nBatches-1))*560)+",100"}
              fill={alertFired?$.rd:color} opacity=".12"/>
          )}
          {psiSlice.length>0 && (
            <polyline points={psiSlice.map(function(v,i){
              var x = 20 + (i/(nBatches-1))*560;
              var y = 100 - (v/2.5)*85;
              return x+","+y;
            }).join(" ")} fill="none" stroke={alertFired?$.rd:color} strokeWidth="1.5"/>
          )}
          {alertFired && (
            <g>
              <circle cx={20 + (20/(nBatches-1))*560} cy={100 - (0.35/2.5)*85} r="4"
                fill={$.rd} style={{animation:"cinePulse 1.2s ease-in-out infinite"}}/>
              <text x={20 + (20/(nBatches-1))*560 + 8} y={100 - (0.35/2.5)*85 - 4}
                fill={$.rd} fontSize="7" fontFamily={F.m} fontWeight="700">TROUBLE SPOTTED</text>
            </g>
          )}
        </svg>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:8}}>
        <Stat label="MINUTES RUNNING"  value={upto + " / " + nBatches}  color={color}/>
        <Stat label="HOW OFTEN RIGHT"  value={upto>0 ? (aucSlice[aucSlice.length-1]*100).toFixed(0)+"%" : "—"} color={color}/>
        <Stat label="TROUBLE LEVEL"    value={upto>0 ? (psiSlice[psiSlice.length-1] < 0.25 ? "Low" : psiSlice[psiSlice.length-1] < 1 ? "Medium" : "High") : "—"} color={alertFired?$.rd:color}/>
        <Stat label="GRID STATUS"      value={alertFired ? (upto>28?"DANGER":"WARNING"):"SAFE"} color={alertFired?(upto>28?$.rd:$.ac):$.gn} pulse={alertFired}/>
      </div>
    </div>
  );
}

/* ═══ Stat tile ═══ */
function Stat(props) {
  var label = props.label, value = props.value, color = props.color, pulse = props.pulse;
  return (
    <div style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)",
      borderRadius:8,padding:"8px 10px"}}>
      <div style={{fontFamily:F.m,fontSize:8,color:$.dim,letterSpacing:1.2,marginBottom:3}}>{label}</div>
      <div style={{fontFamily:F.m,fontSize:14,color:color||$.tx,fontWeight:700,
        animation:pulse?"cineBlink 1.2s ease-in-out infinite":"none"}}>
        {value}
      </div>
    </div>
  );
}

/* ═══ COUNTDOWN DISPLAY (self-contained, isolated from parent re-renders) ═══ */
function CountdownDisplay(props) {
  var s = useState(Math.ceil((props.durationMs || 10000) / 1000));
  var c = s[0]; var setC = s[1];
  useEffect(function(){
    var iv = setInterval(function(){
      setC(function(prev){ return Math.max(0, prev - 1); });
    }, 1000);
    return function(){ clearInterval(iv); };
  }, []);
  return <span style={{color: props.color, fontWeight: 700, fontSize: 11}}>{c}s</span>;
}

/* ═══ COLD OPEN — the editorial moment before the hero ═══
   Auto-advances through five beats, then waits for the user to tap ENTER.
   Module-level flag so it only shows once per page load. */
var _coldOpenDismissed = false;

function ColdOpen(props) {
  var _stage = useState(0); var stage = _stage[0]; var setStage = _stage[1];
  var _out = useState(false); var out = _out[0]; var setOut = _out[1];

  useEffect(function(){
    var timers = [];
    timers.push(setTimeout(function(){ setStage(1); },  900));
    timers.push(setTimeout(function(){ setStage(2); }, 3800));
    timers.push(setTimeout(function(){ setStage(3); }, 6600));
    timers.push(setTimeout(function(){ setStage(4); }, 9800));
    return function(){ timers.forEach(clearTimeout); };
  }, []);

  function dismiss(){
    if (out) return;
    setOut(true);
    _coldOpenDismissed = true;
    setTimeout(function(){ props.onDone && props.onDone(); }, 700);
  }

  useEffect(function(){
    function onKey(e){ if (e.key === "Enter" || e.key === "Escape" || e.key === " ") dismiss(); }
    window.addEventListener("keydown", onKey);
    return function(){ window.removeEventListener("keydown", onKey); };
  }, [out]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#050710",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"clamp(28px, 5vh, 56px) clamp(20px, 5vw, 72px)",
      opacity: out ? 0 : 1,
      transition:"opacity .7s ease",
      pointerEvents: out ? "none" : "auto",
      overflowY:"auto", WebkitOverflowScrolling:"touch"
    }}>
      {/* Subtle vignette so the text feels centred even on wide monitors */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,.55) 100%)"
      }}/>

      <div style={{maxWidth:720, width:"100%", position:"relative"}}>

        {/* Dateline */}
        <div style={{
          fontFamily:F.m,
          fontSize:"clamp(9px, 1.1vw, 10.5px)",
          color:"#67e8f9",
          letterSpacing:"clamp(.16em, .3vw, .32em)",
          fontWeight:600,
          marginBottom:"clamp(18px, 3.2vw, 32px)",
          opacity: stage >= 0 ? 1 : 0,
          transform: stage >= 0 ? "translateY(0)" : "translateY(6px)",
          transition:"opacity 1s ease .1s, transform 1s ease .1s"
        }}>
          AUGUST 14, 2003 · NORTHEAST BLACKOUT
        </div>

        {/* Beat 1 — the technical context, not the shock */}
        <div style={{
          fontFamily:serif, fontStyle:"italic", fontWeight:400,
          fontSize:"clamp(21px, 4.4vw, 38px)",
          color:"#e8ecf5", lineHeight:1.32,
          marginBottom:"clamp(14px, 2vw, 20px)",
          opacity: stage >= 1 ? 1 : 0,
          transform: stage >= 1 ? "translateY(0)" : "translateY(12px)",
          transition:"opacity 1.2s ease, transform 1.2s cubic-bezier(.16,1,.3,1)"
        }}>
          A software race condition stalled the control room's alarm system for 62 minutes.
        </div>

        {/* Beat 2 — what it meant in human terms */}
        <div style={{
          fontFamily:serif, fontStyle:"italic", fontWeight:400,
          fontSize:"clamp(16px, 2.8vw, 22px)",
          color:"#cbd5e1", lineHeight:1.45,
          marginBottom:"clamp(22px, 3.2vw, 32px)",
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? "translateY(0)" : "translateY(10px)",
          transition:"opacity 1.1s ease, transform 1.1s cubic-bezier(.16,1,.3,1)"
        }}>
          For over an hour, operators could not see the grid failing in front of them.
        </div>

        {/* Beat 3 — the cost, quiet mono, the context the user asked for */}
        <div style={{
          fontFamily:F.m,
          fontSize:"clamp(10.5px, 1.4vw, 12.5px)",
          color:"#94a3b8", lineHeight:1.75,
          letterSpacing:".02em", maxWidth:580,
          marginBottom:"clamp(24px, 3.6vw, 36px)",
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? "translateY(0)" : "translateY(8px)",
          transition:"opacity 1s ease, transform 1s ease"
        }}>
          Cascade outages crossed eight states and two provinces. 55 million without power. 11 people died. $6 billion in damages. No intelligent system was watching whether the monitoring itself was still working.
        </div>

        {/* Beat 4 — why W.R.E.N. exists, no yellow divider */}
        <div style={{
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(10px)",
          transition:"opacity 1.2s ease, transform 1.2s cubic-bezier(.16,1,.3,1)"
        }}>
          <div style={{
            fontFamily:F.s,
            fontSize:"clamp(13px, 1.7vw, 16px)",
            color:"#e2e8f0", lineHeight:1.65, maxWidth:560,
            marginBottom:"clamp(18px, 2.6vw, 24px)"
          }}>
            Today, machine learning models decide whether grids stay stable. W.R.E.N. is the deployment monitor that watches those models for the moment they quietly stop being reliable.
          </div>
          <div style={{
            display:"flex", alignItems:"center", gap:"clamp(10px, 2vw, 14px)",
            flexWrap:"wrap"
          }}>
            <span style={{
              fontFamily:F.m,
              fontSize:"clamp(11px, 1.4vw, 13px)",
              color:"#fbbf24",
              letterSpacing:"clamp(.22em, .4vw, .36em)",
              fontWeight:700
            }}>
              W.R.E.N.
            </span>
            <span style={{
              fontFamily:F.m,
              fontSize:"clamp(8px, 1vw, 9px)",
              color:"#64748b",
              letterSpacing:".16em"
            }}>
              press enter to begin
            </span>
          </div>
        </div>
      </div>

      {/* Skip / enter button */}
      <button onClick={dismiss} style={{
        position:"fixed",
        bottom:"clamp(18px, 3vh, 32px)",
        right:"clamp(14px, 4vw, 48px)",
        background:"transparent",
        border:"1px solid rgba(255,255,255,.14)",
        color:"rgba(255,255,255,.55)",
        padding:"clamp(7px, 1vw, 9px) clamp(14px, 2vw, 20px)",
        borderRadius:6,
        fontFamily:F.m,
        fontSize:"clamp(8px, 1vw, 9.5px)",
        letterSpacing:".22em",
        fontWeight:600,
        cursor:"pointer", transition:"all .2s",
        zIndex:10
      }}
      onMouseEnter={function(e){e.currentTarget.style.borderColor="rgba(251,191,36,.45)";e.currentTarget.style.color="#fbbf24";}}
      onMouseLeave={function(e){e.currentTarget.style.borderColor="rgba(255,255,255,.14)";e.currentTarget.style.color="rgba(255,255,255,.55)";}}>
        {stage >= 4 ? "ENTER \u2192" : "SKIP"}
      </button>

      {/* Top progress bar — pacing indicator, not a decorative line */}
      <div style={{
        position:"fixed", top:0, left:0, right:0, height:2,
        background:"rgba(255,255,255,.04)", zIndex:10
      }}>
        <div style={{
          height:"100%",
          background:"#fbbf24",
          boxShadow:"0 0 8px #fbbf24",
          width: (Math.min(stage, 4) * 25) + "%",
          transition:"width 1.1s cubic-bezier(.16,1,.3,1)"
        }}/>
      </div>
    </div>
  );
}

/* ═══ DETECTOR EVENT CATALOGUE ═══ */
var DETECTOR_EVENTS = [
  { batch:  9, key:"ph",    name:"PAGE HINKLEY", title:"First warning",         sub:"Something just shifted in the data. The earliest detector caught it.",              color:"#a78bfa", severity:"info", metric:"Signal 4.2 (alert at 3.5)" },
  { batch: 34, key:"cusum", name:"CUSUM",        title:"Drift is building",     sub:"Small changes are stacking up over time. The trend is real now.",                    color:"#67e8f9", severity:"warn", metric:"Signal 8.1 (alert at 5.0)" },
  { batch: 55, key:"psi",   name:"PSI DRIFT",    title:"Data looks different",  sub:"The live data no longer matches what the model learned from.",                       color:$.glow,    severity:"warn", metric:"Score 0.35 (alert at 0.25)" },
  { batch: 81, key:"auc",   name:"AUC BREAK",    title:"Accuracy has dropped",  sub:"The model is making more mistakes. Three detectors warned us before this happened.", color:$.rd,      severity:"crit", metric:"Accuracy 87.6 percent" },
];

function CommandCentre(props) {
  useStyles();
  var _tab  = useState(props.initialTab || "sim");   var tab   = _tab[0];   var setTab   = _tab[1];
  var _b    = useState(0);       var batch = _b[0];     var setBatch = _b[1];
  var _demo = useState(false);   var demo  = _demo[0];  var setDemo  = _demo[1];
  var _card = useState(null);    var card  = _card[0];  var setCard  = _card[1];
  var _pipeStage = useState(22); var pipeStage = _pipeStage[0]; var setPipeStage = _pipeStage[1];
  var _pipeOpen = useState(null); var pipeOpen = _pipeOpen[0]; var setPipeOpen = _pipeOpen[1];
  var _pipeRunning = useState(false); var pipeRunning = _pipeRunning[0]; var setPipeRunning = _pipeRunning[1];
  var pipeTimers = useRef([]);
  var _findOpen = useState(null); var findOpen = _findOpen[0]; var setFindOpen = _findOpen[1];
  var demoRef = useRef(null);
  var _activeToast = useState(null); var activeToast = _activeToast[0]; var setActiveToast = _activeToast[1];
  var lastFiredRef = useRef(null);
  var toastTimerRef = useRef(null);
  var pausedByToastRef = useRef(false);
  var prevBatchRef = useRef(0);

  var TOAST_DURATION_MS = 10000;

  // Watch the batch counter; when it crosses a detector threshold, fire a toast AND pause playback.
  // No setInterval for countdown here — the countdown lives in its own sub-component so it
  // doesn't trigger re-renders of the overlay (which would restart the entrance animations).
  useEffect(function(){
    var movingForward = batch >= prevBatchRef.current;
    prevBatchRef.current = batch;

    var firedNow = DETECTOR_EVENTS.filter(function(e){ return batch >= e.batch; });
    var mostRecent = firedNow[firedNow.length - 1];
    if (!mostRecent) {
      lastFiredRef.current = null;
      setActiveToast(null);
      return;
    }
    if (mostRecent.key !== lastFiredRef.current) {
      lastFiredRef.current = mostRecent.key;
      if (!movingForward) return;
      var stamped = {};
      for (var k in mostRecent) stamped[k] = mostRecent[k];
      stamped.id = Date.now();
      setActiveToast(stamped);

      if (demoRef.current) { clearInterval(demoRef.current); demoRef.current = null; }
      if (demo) { pausedByToastRef.current = true; setDemo(false); }

      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(function(){
        setActiveToast(null);
        if (pausedByToastRef.current) {
          pausedByToastRef.current = false;
          setDemo(true);
        }
      }, TOAST_DURATION_MS);
    }
  }, [batch]);

  function dismissToast(){
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setActiveToast(null);
    if (pausedByToastRef.current) {
      pausedByToastRef.current = false;
      setDemo(true);
    }
  }
  var aucData = useMemo(function(){ return SH.map(function(v,i){ return {b:i,H:v,S:SV[i],R:SR[i],L:SL[i]}; }); },[]);
  var psiData = useMemo(function(){ return SP.map(function(v,i){ return {b:i,P:v}; }); },[]);
  var covData = useMemo(function(){ return SC.map(function(v,i){ return {b:i,C:v}; }); },[]);
  var phase = batch<40?"stable":batch<80?"drift":"critical";
  var pCol  = phase==="stable"?$.gn:phase==="drift"?$.ac:$.rd;

  useEffect(function(){
    if (!demo){ clearInterval(demoRef.current); return; }
    demoRef.current = setInterval(function(){ setBatch(function(b){ if(b>=119){setDemo(false);return 119;} return b+1; }); },130);
    return function(){ clearInterval(demoRef.current); };
  },[demo]);

  /* ── 22 REAL PIPELINE STAGES from nexus_engine_v4.py ── */
  var PIPELINE = [
    {phase:"Data", color:$.gn, stages:[
      {n:1, name:"Data Loading", plain:"Load 60,000 real power grid measurements. Check for missing values and fix them", desc:"60,000 samples loaded from DSGC dataset. 12 raw electrical parameters. Class balance checked 37% unstable. NaN values detected and median imputed.", input:"Raw CSV", output:"Clean dataset"},
      {n:2, name:"Physics Feature Engineering", plain:"Turn raw electrical readings into meaningful physics measurements. 12 values become 48", desc:"48 physics informed candidates generated. Key v4 features: F_gain_i = τ·g per node, H_net, D_eff_mean, F_gain_mean/std/min. Raw 12 features expanded to 48.", input:"12 features", output:"48 features"},
      {n:3, name:"Data Splitting", plain:"Split the data into three groups: one to learn from, one to tune with, one to test on. None overlap", desc:"Stratified train / validation / test split. Class balance preserved across all three partitions. Reproducible seeding applied.", input:"Full dataset", output:"Train / Val / Test"},
    ]},
    {phase:"Feature Selection", color:"#a78bfa", stages:[
      {n:4, name:"RFECV Feature Selection", plain:"Test all 48 features and keep only the 14 that actually matter. Remove the noise", desc:"Recursive Feature Elimination with Cross-Validation. Reduced 48 candidates down to 14 optimal features. Eliminates noise and collinear terms. Top retained: F_gain_mean, tau_std, g_mean.", input:"48 features", output:"14 features"},
      {n:5, name:"Bayesian Hyperparameter Search", plain:"Automatically find the best settings for each model. 100 experiments per model, all run in parallel", desc:"Optuna TPE sampler. 100 trials per model, run in parallel. Tuned SVM (C, gamma), Random Forest (n_estimators, max_depth), LightGBM (n_estimators, learning_rate). Total search time: ~180s.", input:"Default settings", output:"Optimal settings"},
    ]},
    {phase:"Model Training", color:$.glow, stages:[
      {n:6, name:"Four Base Learners", plain:"Train four different AI models on the same data. Each learns differently, has different strengths", desc:"SVM (RBF kernel), Random Forest (300 estimators), LightGBM (gradient boosting), Logistic Regression. All trained on the 14 selected features with optimised hyperparameters.", input:"Training data", output:"4 trained models"},
      {n:7, name:"Probability Calibration", plain:"Make sure when a model says \"90% confident\" it really is right 90% of the time", desc:"Platt scaling (sigmoid) and Isotonic regression applied post hoc. Aligns confidence scores with empirical accuracy. Reduces ECE on validation set.", input:"Raw probabilities", output:"Calibrated probabilities"},
      {n:8, name:"Stacking Hybrid Ensemble", plain:"Combine the best two models into one that outperforms both. The hybrid uses SVM + RF predictions plus raw physics features", desc:"SVM + RF base predictions fed into a LogisticRegression meta learner. Also uses top physics features (F_gain_mean, tau_mean) as meta inputs. Final model outperforms all individual bases.", input:"SVM + RF outputs", output:"Hybrid model"},
    ]},
    {phase:"Evaluation", color:$.ac, stages:[
      {n:9,  name:"Test Set Evaluation", plain:"Test all models on data they have never seen. Every model scored at the ceiling: AUC ≥ 0.9999 across all four", desc:"Full metrics: AUC, F1, Accuracy, Brier score, ECE. AUC ≥ 0.9999 across all four models (Hybrid, SVM, RF, LGBM) on the held-out test set. Hybrid wins on calibration: ECE 0.0005, Brier 0.0003. Clean data performance establishes the deployment baseline.", input:"Test data", output:"AUC ≥ 0.9999"},
      {n:10, name:"Cost Optimal Threshold", plain:"Missing a real grid failure is 10× worse than a false alarm. Set the decision boundary accordingly", desc:"v4: Cost function penalises false negatives 10× more than false positives (grid failure cost >> false alarm cost). Three level risk index: STABLE / BORDERLINE / CRITICAL. Thresholds saved to JSON.", input:"Cost ratio 10:1", output:"Risk thresholds"},
      {n:11, name:"Conformal Prediction", plain:"Add a mathematical safety guarantee: at least 95% of predictions must have a reliable confidence bound", desc:"Split conformal prediction, \u03B1=0.05. Mathematical guarantee: at least 95% of prediction intervals contain the true class on exchangeable data. q_hat quantile computed from validation set.", input:"Validation scores", output:"95% guarantee"},
      {n:12, name:"Paired Bootstrap Test", plain:"Is the Hybrid actually better than the others, or did it just get lucky? Run 2,000 random tests to find out", desc:"2,000 bootstrap resamples comparing Hybrid vs LightGBM AUC. Delta AUC and 95% confidence interval computed. p value confirms statistical significance of Hybrid improvement.", input:"Model predictions", output:"p < 0.05 confirmed"},
      {n:13, name:"Learning Curve Analysis", plain:"Does the model need more data, or does it have enough? Performance plateaus before using all data, so it generalises well", desc:"AUC vs training set size computed for all models. Shows model is not data limited. Performance plateaus before 100% of training data, confirming generalisation.", input:"Varying data sizes", output:"Plateau confirmed"},
      {n:14, name:"Cross Validation", plain:"Test the model five different ways by rotating which data it trains on. Makes sure results are not a fluke", desc:"Stratified 5 fold CV on full train and val set. Hybrid requires nested manual CV (calibration inside each fold). Hybrid CV AUC confirms no overfitting to test set.", input:"5 rotations", output:"Stable across all"},
      {n:15, name:"Permutation Importance", plain:"Scramble each feature one at a time. The physics formula F_gain dominated every single test, proving the model learned real physics", desc:"Each feature permuted 5 times. AUC drop measured. F_gain_mean is the dominant feature across all drift phases. The physics formula holds even when statistical guarantees break down.", input:"Feature scrambling", output:"F_gain_mean #1"},
    ]},
    {phase:"Robustness", color:$.rd, stages:[
      {n:16, name:"SHAP Explainability", plain:"Ask the model why it made each decision. Every prediction can be traced back to specific input features", desc:"TreeSHAP for RF and LightGBM. KernelSHAP approximation for SVM. Global and local attributions saved. F_gain consistently top ranked. Model is explainable and physics aligned.", input:"Any prediction", output:"Feature attributions"},
      {n:17, name:"Stress Testing", plain:"Add noise, scale inputs, push boundaries. The Hybrid degrades most gracefully under every stress condition tested", desc:"Gaussian noise (4 levels), OOD scaling, boundary sensitivity, Monte Carlo (N=50, 3 noise levels). Hybrid degrades most gracefully under all stress conditions tested.", input:"4 noise levels", output:"Hybrid most robust"},
      {n:18, name:"Adversarial Robustness", plain:"Apply mathematical perturbations to test if models can be pushed into wrong answers. SVM flipped 32.4%. Random Forest held at 0.05%", desc:"Fast Gradient Sign Method at 6 epsilon levels (0.001 to 0.1). SVM (RBF) flip rate: 32.4% at eps=0.1. RF flip rate: 0.05%. Tree models effectively immune due to discrete leaf structure.", input:"FGSM ε=0.001–0.1", output:"RF immune"},
    ]},
    {phase:"Simulation & Export", color:"#67e8f9", stages:[
      {n:"18b", name:"Deployment Simulation", plain:"Simulate 120 batches of real-world deployment: gradual drift, adversarial perturbation, and sudden regime change, all at once", desc:"3 layer, 120 sequential batches. Gradual tau drift from batch 40. FGSM adversarial perturbation at batch 65. Abrupt regime shift at batch 80. SCADA noise, missing data, quantisation and latency all simulated.", input:"Clean model", output:"120 batch results"},
      {n:"19", name:"Change Detection", plain:"Three different alarm systems watching the data stream. PSI caught trouble 26 batches before accuracy visibly dropped", desc:"PSI drift index per batch (threshold 0.25). CUSUM sequential test for cumulative drift. Page Hinkley test for abrupt shifts. PSI fires 26 batches before AUC visibly drops.", input:"Streaming data", output:"Early warnings"},
      {n:"20", name:"Generalisation Suite", plain:"Generate entirely new operating conditions the model has never seen. Confirm it still works outside its training boundaries", desc:"Synthetic DSGC operating points generated with varied τ and g ranges. Cross regime evaluation confirms model holds outside training distribution boundaries.", input:"New conditions", output:"Still holds"},
      {n:"21", name:"Auto Stabiliser", plain:"An automatic controller that adjusts grid parameters to push the system back toward stability in under 500 steps", desc:"Gradient based controller adjusts τ and g to push P(unstable) below target threshold. Adam optimiser (lr=0.3, β1=0.9, β2=0.999). Corrective grid control in ≤500 iterations.", input:"Unstable state", output:"Stabilised"},
      {n:"22", name:"Browser Export", plain:"Package everything into a single file that runs in a web browser. This is what powers the website you are looking at right now", desc:"JSON model bundle generated for deployment. Contains SVM/RF/LGBM weights, scaler parameters, feature names, thresholds, calibration data, and run metadata. This webapp reads that bundle.", input:"Full pipeline", output:"This website"},
    ]},
  ];

  /* Flashcard content for each chart */
  var CARDS = {
    auc:{
      title:"What is this chart telling you?",
      plain:"This is the model's accuracy score over time AUC goes from 0 (random guessing) to 1.0 (perfect). In the lab, the Hybrid model scored 0.9999. Nearly perfect.",
      insight:"But then the real world happened. As the grid data drifts (batch 40), gets attacked (batch 65), and shifts regime entirely (batch 80), accuracy falls to 0.8834. That's not a failure. It is what deployment actually looks like. A static benchmark would never show you this. W.R.E.N. tracks it in real time so you know when to trust the model and when to escalate.",
      lines:[{c:$.glow,l:"Hybrid: your best model"},{c:"#a78bfa",l:"SVM: smooth boundaries, vulnerable to attacks"},{c:$.gn,l:"RF: immune to gradient attacks"},{c:"#67e8f9",l:"LGBM: gradient boosting, fast and competitive"}],
    },
    psi:{
      title:"What is PSI telling you?",
      plain:"PSI (Population Stability Index) measures how much the incoming data has changed compared to what the model was trained on. Below 0.1 = stable. Above 0.25 = alert.",
      insight:"The spike here isn't random. PSI crossed the 0.25 threshold at batch 55, 26 batches before the model's accuracy visibly dropped. It saw the problem coming. That early warning is the whole point: by the time the model starts failing, you've already had time to act.",
    },
    cov:{
      title:"What is Coverage telling you?",
      plain:"Conformal coverage is a mathematical guarantee. It says: at least 95% of the time, the model's prediction interval contains the true answer. It's not a promise about any single prediction it's a statistical guarantee across all predictions.",
      insight:"When the grid is stable, coverage holds at 92%+. When the data shifts too far outside training (regime collapse, batch 80), it drops to 85%. That means 1 in 7 predictions has an uncertainty the model can't quantify. W.R.E.N. flags this instantly so operators know when the safety guarantee has expired.",
    },
  };

  /* Findings data consequence format */
  var FINDINGS = [
    {metric:"AUC fell from 0.9999 to 0.8834",   color:$.rd, 
     consequence:"The model was near perfect in the lab. Under real deployment drift, 1 in 9 predictions deteriorated. A model that looks production ready on a static benchmark can still fail silently once deployed. This is the gap W.R.E.N. exists to close."},
    {metric:"ECE increased 279×",                color:$.rd, 
     consequence:"Calibration error is how wrong the model's confidence is. 279× baseline means when it said '90% stable', it was right far less often. Decisions made on uncalibrated confidence are decisions made on false certainty. LaSCal recalibration brought this back under control."},
    {metric:"PSI crossed 0.25 at batch 55",      color:$.glow,icon:"",
     consequence:"26 batches before accuracy dropped, the data started looking different. PSI caught it first. That 26-batch head start is the difference between a controlled recalibration and an emergency shutdown. Early warning is the economic value of deployment monitoring."},
    {metric:"RF adversarial flip rate: 0.05%",   color:$.gn, 
     consequence:"Under FGSM adversarial testing at ε=0.1, the SVM was flipped 32.4% of the time. The Random Forest: 0.05%. Tree models don't use gradients there's no slope to attack. When adversarial conditions are possible, the fallback model is the RF, not the SVM."},
    {metric:"Conformal coverage dropped to 85%", color:$.ac, 
     consequence:"1 in 7 predictions during regime collapse had no valid uncertainty bound. The conformal guarantee expired. This isn't a model failure it's the model honestly admitting it is out of its depth. A model that tells you when to stop trusting it is more valuable than one that doesn't."},
    {metric:"F_gain_mean dominated all phases",  color:$.glow,icon:"",
     consequence:"SHAP showed that the physics formula F_gain = τ·g remained the top feature across every drift phase, every attack, every regime. The physics didn't break even when the statistics did. The model's core reasoning was sound only its calibration drifted."},
  ];

  var nav = (
    <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(6,11,20,.98)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
      <div style={{padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <BeaconSmall s={18}/>
          <span style={{fontSize:13,fontWeight:700,color:$.glow,fontFamily:F.m}}>W.R.E.N.</span>
          <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>LIVE DASHBOARD</span>
        </div>
        <button onClick={props.onBack} style={{background:"transparent",border:"1px solid rgba(255,255,255,.08)",borderRadius:6,color:$.dim,padding:"5px 14px",fontSize:11,fontFamily:F.s,cursor:"pointer"}}>Exit</button>
      </div>
      <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,.04)"}}>
        {[{id:"pipe",label:"How it works"},{id:"sim",label:"Simulation"},{id:"finds",label:"Findings"}].map(function(t){
          var a=tab===t.id;
          return (<button key={t.id} onClick={function(){setTab(t.id);setCard(null);}} style={{flex:1,padding:"10px 0",fontFamily:F.m,fontSize:10,fontWeight:a?600:400,color:a?$.glow:$.dim,background:"transparent",border:"none",cursor:"pointer",borderBottom:"2px solid "+(a?$.glow:"transparent"),letterSpacing:".04em",transition:"all .2s"}}>{t.label}</button>);
        })}
      </div>
    </div>
  );

  /* helper chart card wrapper — chart is always visible; "Click to explain" toggles a panel below */
  function ChartCard(cp) {
    var open = card===cp.id;
    return (
      <div style={{background:$.bg2,border:"1px solid "+(open?$.glow+"55":$.brd),borderRadius:10,padding:"14px 14px 10px",transition:"border-color .2s",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,gap:10}}>
          <div style={{fontSize:12,fontWeight:600,color:$.tx}}>{cp.title}</div>
          <button onClick={function(){setCard(open?null:cp.id);}}
            style={{fontFamily:F.m,fontSize:8,color:open?$.glow:$.dim,background:open?"rgba(251,191,36,.08)":"transparent",padding:"3px 10px",borderRadius:999,border:"1px solid "+(open?$.glow+"33":"rgba(255,255,255,.06)"),transition:"all .2s",cursor:"pointer",fontWeight:600,letterSpacing:.5,whiteSpace:"nowrap"}}>
            {open?"Close":"Click to explain ↓"}
          </button>
        </div>
        {cp.sub && <div style={{fontFamily:F.m,fontSize:8,color:$.dim,marginBottom:8}}>{cp.sub}</div>}
        {/* Chart is ALWAYS visible — overlay sits on top of it for anchored pop-ups */}
        <div style={{position:"relative"}}>
          {cp.children}
          {cp.overlay}
        </div>
        {/* Explanation panel opens BELOW the animated chart */}
        {open && (
          <div style={{marginTop:12,paddingTop:12,borderTop:"1px dashed "+$.brd,animation:"findingIn .35s cubic-bezier(.16,1,.3,1) both"}}>
            <div style={{fontFamily:F.m,fontSize:9,color:$.glow,letterSpacing:".06em",marginBottom:8}}>{CARDS[cp.id].title}</div>
            <p style={{fontSize:12,color:$.tx,lineHeight:1.8,marginBottom:10}}>{CARDS[cp.id].plain}</p>
            <p style={{fontSize:12,color:$.tx3,lineHeight:1.8,marginBottom: CARDS[cp.id].lines?12:0}}>{CARDS[cp.id].insight}</p>
            {CARDS[cp.id].lines && (
              <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                {CARDS[cp.id].lines.map(function(l){ return (<div key={l.l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:16,height:2,background:l.c,borderRadius:1}}/><span style={{fontFamily:F.m,fontSize:8,color:$.dim}}>{l.l}</span></div>); })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ── TAB: SIMULATION ── */
  if (tab==="sim") return (
    <div style={{minHeight:"100vh",background:$.bg,fontFamily:F.s,color:$.tx2}}>
      {nav}
      <div style={{padding:"8px 16px",background:pCol===$.gn?$.gnD:pCol===$.rd?$.rdD:$.acD,borderBottom:"1px solid "+pCol+"22",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:pCol,animation:phase!=="stable"?"wpulse 1.8s ease-in-out infinite":"none"}}/>
          <span style={{fontFamily:F.m,fontSize:10,fontWeight:600,color:pCol}}>{phase==="stable"?"STABLE":phase==="drift"?"DRIFT DETECTED":"CRITICAL"}</span>
          <span style={{fontFamily:F.m,fontSize:9,color:pCol,opacity:.6}}>Batch {batch} · AUC {(SH[batch]||0).toFixed(4)} · PSI {(SP[batch]||0).toFixed(2)}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={function(){pausedByToastRef.current=false;if(demo){setDemo(false);}else{if(batch>=119)setBatch(0);setDemo(true);}}} style={{padding:"4px 12px",borderRadius:5,border:"1px solid "+(demo?$.rd:$.glow),background:demo?$.rdD:$.acD,color:demo?$.rd:$.glow,fontFamily:F.m,fontSize:9,fontWeight:600,cursor:"pointer"}}>{demo?"Pause":batch>=119?"Replay":"Play"}</button>
          <input type="range" min={0} max={119} value={batch} onChange={function(e){pausedByToastRef.current=false;setDemo(false);setBatch(+e.target.value);}} style={{width:"clamp(100px, 25vw, 150px)",accentColor:$.glow}}/>
          <span style={{fontFamily:F.m,fontSize:11,color:$.glow,fontWeight:700,minWidth:20}}>{batch}</span>
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"16px 20px 48px"}}>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:1,marginBottom:14,background:$.brd,borderRadius:10,overflow:"hidden",border:"1px solid "+$.brd}}>
          {[
            {l:"Hybrid AUC",v:(SH[batch]||0).toFixed(4),c:SH[batch]>.93?$.gn:SH[batch]>.88?$.ac:$.rd,d:SH},
            {l:"SVM AUC",   v:(SV[batch]||0).toFixed(4),c:SV[batch]>.88?$.tx2:$.rd,d:SV},
            {l:"PSI Drift", v:(SP[batch]||0).toFixed(2), c:SP[batch]<.25?$.gn:SP[batch]<1?$.ac:$.rd,d:SP},
            {l:"Coverage",  v:((SC[batch]||0)*100).toFixed(1)+"%",c:SC[batch]>.95?$.gn:SC[batch]>.85?$.ac:$.rd,d:SC},
          ].map(function(m){ return (
            <div key={m.l} style={{background:$.bg2,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}><div style={{fontFamily:F.m,fontSize:8,color:$.dim,marginBottom:3}}>{m.l}</div><div style={{fontSize:20,fontWeight:700,color:m.c,fontFamily:F.m}}>{m.v}</div></div>
              <Spark data={m.d.slice(Math.max(0,batch-20),batch+1)} color={m.c} w={68} h={18}/>
            </div>
          ); })}
        </div>

        {/* AUC chart clickable — pop-ups anchor inside the chart at the fire batch position */}
        <div style={{marginBottom:14}}>
          <ChartCard id="auc" title="Model Confidence. AUC over 120 Batches"
            sub="Three models, three drift phases. Click to understand what you're looking at."
            overlay={activeToast && (
              <div key={activeToast.id} style={{position:"absolute", inset:0, pointerEvents:"none"}}>

                {/* ── Fire-point beacon: halo + shockwave rings + glowing dot ── */}
                <div style={{
                  position:"absolute",
                  left:"calc(" + (4.5 + (activeToast.batch / 119) * 94) + "% - 18px)",
                  top:-18,
                  width:36, height:36,
                  pointerEvents:"none"
                }}>
                  <div className="cin-halo" style={{position:"absolute", inset:0, borderRadius:"50%", background:activeToast.color}}/>
                  <div className="cin-ring-1" style={{position:"absolute", inset:12, borderRadius:"50%", border:"2px solid "+activeToast.color}}/>
                  <div className="cin-ring-2" style={{position:"absolute", inset:12, borderRadius:"50%", border:"2px solid "+activeToast.color}}/>
                  <div className="cin-ring-3" style={{position:"absolute", inset:12, borderRadius:"50%", border:"1px solid "+activeToast.color}}/>
                  <div className="cin-dot" style={{position:"absolute", left:12, top:12, width:12, height:12, borderRadius:"50%", background:activeToast.color, boxShadow:"0 0 18px "+activeToast.color+", 0 0 6px #fff"}}/>
                </div>

                {/* ── Pop-up card: blooms in with a focus-pull, then breathes softly ── */}
                <div className="cin-card" style={{
                  position:"absolute",
                  top:6, right:6,
                  width:"min(340px, calc(100% - 12px))",
                  pointerEvents:"auto",
                  background:"linear-gradient(155deg, rgba(14,18,32,.97) 0%, rgba(12,16,28,.95) 60%, "+activeToast.color+"0c 100%)",
                  border:"1px solid "+activeToast.color+"66",
                  borderRadius:12,
                  backdropFilter:"blur(16px)",
                  ["--breathe-a"]: activeToast.color + "1f",
                  ["--breathe-b"]: activeToast.color + "3a",
                  overflow:"hidden"
                }}>
                  <div style={{position:"absolute", left:-40, top:-40, width:140, height:140, borderRadius:"50%", background:"radial-gradient(circle, "+activeToast.color+"22 0%, transparent 70%)", pointerEvents:"none"}}/>
                  <div className="cin-accent" style={{position:"absolute", left:0, top:0, bottom:0, width:3, background:activeToast.color, boxShadow:"0 0 12px "+activeToast.color}}/>

                  <div style={{position:"relative", padding:"16px 18px 14px 22px"}}>
                    <div className="cin-label" style={{display:"flex", alignItems:"center", gap:10, marginBottom:12}}>
                      <span style={{width:7, height:7, borderRadius:"50%", background:activeToast.color, boxShadow:"0 0 8px "+activeToast.color}}/>
                      <span style={{fontFamily:F.m, fontSize:10, color:activeToast.color, letterSpacing:".18em", fontWeight:700}}>{activeToast.name}</span>
                      <span style={{fontFamily:F.m, fontSize:8, color:$.dim, marginLeft:"auto", letterSpacing:".1em"}}>BATCH {String(activeToast.batch).padStart(3,"0")}</span>
                      <button onClick={dismissToast} style={{background:"transparent", border:"none", color:$.dim, cursor:"pointer", padding:"0 2px", fontSize:15, lineHeight:1, marginLeft:2}}>×</button>
                    </div>

                    <div className="cin-title" style={{fontFamily:serif, fontStyle:"italic", fontSize:22, fontWeight:500, color:$.tx, lineHeight:1.2, marginBottom:10, textShadow:"0 0 28px "+activeToast.color+"33"}}>
                      {activeToast.title}
                    </div>

                    <div className="cin-sub" style={{fontSize:12.5, color:$.tx2, lineHeight:1.65, marginBottom:12}}>
                      {activeToast.sub}
                    </div>

                    <div className="cin-metric" style={{fontFamily:F.m, fontSize:9.5, color:$.dim, letterSpacing:".04em", marginBottom:14, paddingLeft:10, borderLeft:"1px solid "+activeToast.color+"44"}}>
                      {activeToast.metric}
                    </div>

                    <div className="cin-foot" style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, fontFamily:F.m, fontSize:9, color:$.dim, letterSpacing:".06em"}}>
                      <span>Resumes in <CountdownDisplay key={activeToast.id} durationMs={TOAST_DURATION_MS} color={activeToast.color} /></span>
                      <button onClick={dismissToast} style={{background:"transparent", border:"1px solid "+activeToast.color+"66", color:activeToast.color, cursor:"pointer", padding:"4px 12px", fontSize:8.5, fontWeight:700, letterSpacing:".18em", borderRadius:4, fontFamily:F.m, transition:"all .2s"}}
                        onMouseEnter={function(e){e.currentTarget.style.background=activeToast.color+"18";}}
                        onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>SKIP</button>
                    </div>
                  </div>

                  <div style={{height:2, background:"rgba(255,255,255,.04)", position:"relative"}}>
                    <div className="cin-progress" style={{height:"100%", background:"linear-gradient(90deg, "+activeToast.color+" 0%, "+activeToast.color+"bb 100%)", boxShadow:"0 0 8px "+activeToast.color}}/>
                  </div>
                </div>
              </div>
            )}
            children={
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={aucData.slice(0,batch+1)} margin={{top:8,right:8,bottom:4,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.04)"/>
                  <XAxis dataKey="b" tick={TK} tickLine={false} domain={[0,119]} type="number"/>
                  <YAxis domain={["dataMin - 0.01","dataMax + 0.01"]} tick={TK} tickLine={false} width={36}/>
                  <Tooltip contentStyle={TT}/>
                  {batch>=9  && <ReferenceLine x={9}  stroke="#a78bfa" strokeDasharray="2 3" strokeOpacity={.4} label={{value:"PH",position:"insideBottomLeft",fill:"#a78bfa",fontSize:7}}/>}
                  {batch>=34 && <ReferenceLine x={34} stroke="#67e8f9" strokeDasharray="2 3" strokeOpacity={.4} label={{value:"CUSUM",position:"insideBottomLeft",fill:"#67e8f9",fontSize:7}}/>}
                  {batch>=40 && <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Drift",position:"insideTopLeft",fill:$.ac,fontSize:8}}/>}
                  {batch>=55 && <ReferenceLine x={55} stroke={$.glow} strokeDasharray="2 3" strokeOpacity={.45} label={{value:"PSI",position:"insideBottomLeft",fill:$.glow,fontSize:7}}/>}
                  {batch>=65 && <ReferenceLine x={65} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Attack",position:"insideTopLeft",fill:$.rd,fontSize:8}}/>}
                  {batch>=80 && <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Regime",position:"insideTopLeft",fill:$.rd,fontSize:8}}/>}
                  <ReferenceLine x={batch} stroke={$.glow} strokeWidth={1.5} strokeOpacity={.9}/>
                  <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2.5} dot={false} name="Hybrid" isAnimationActive={false}/>
                  <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1.2} dot={false} opacity={.5} name="SVM" isAnimationActive={false}/>
                  <Line type="monotone" dataKey="R" stroke={$.gn} strokeWidth={1.2} dot={false} opacity={.5} name="RF" isAnimationActive={false}/>
                  <Line type="monotone" dataKey="L" stroke="#67e8f9" strokeWidth={1.2} dot={false} opacity={.5} name="LGBM" isAnimationActive={false}/>
                </LineChart>
              </ResponsiveContainer>
            }/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
          <ChartCard id="psi" title="PSI Drift Index"
            sub="Alert threshold: 0.25. Crossed at batch 55, 26 batches early"
            children={
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={psiData.slice(0,batch+1)} margin={{top:14,right:4,bottom:4,left:0}}>
                  <XAxis dataKey="b" tick={false} axisLine={false} domain={[0,119]} type="number"/>
                  <YAxis tick={false} axisLine={false} width={0} domain={[0, function(max){ return Math.max(0.35, max*1.1); }]}/>
                  <ReferenceLine y={0.25} stroke={$.rd} strokeDasharray="3 3" strokeOpacity={.5} label={{value:"Alert 0.25",position:"insideTopLeft",fill:$.rd,fontSize:8}}/>
                  {batch>=9  && <ReferenceLine x={9}  stroke="#a78bfa" strokeDasharray="2 3" strokeOpacity={.4}/>}
                  {batch>=34 && <ReferenceLine x={34} stroke="#67e8f9" strokeDasharray="2 3" strokeOpacity={.4}/>}
                  {batch>=55 && <ReferenceLine x={55} stroke={$.glow} strokeDasharray="2 3" strokeOpacity={.5}/>}
                  <ReferenceLine x={batch} stroke={$.glow} strokeWidth={1.2} strokeOpacity={.7}/>
                  <Area type="monotone" dataKey="P" stroke={$.ac} fill={$.acD} strokeWidth={2} isAnimationActive={false}/>
                </AreaChart>
              </ResponsiveContainer>
            }/>
          <ChartCard id="cov" title="Conformal Coverage"
            sub="Target 95%. Drops to 83% at regime collapse"
            children={
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={covData.slice(0,batch+1)} margin={{top:14,right:4,bottom:4,left:0}}>
                  <XAxis dataKey="b" tick={false} axisLine={false} domain={[0,119]} type="number"/>
                  <YAxis domain={[function(min){ return Math.min(0.78, min-0.01); }, 1]} tick={false} axisLine={false} width={0}/>
                  <ReferenceLine y={0.95} stroke={$.gn} strokeDasharray="3 3" strokeOpacity={.4} label={{value:"95% target",position:"insideTopRight",fill:$.gn,fontSize:8}}/>
                  <ReferenceLine x={batch} stroke={$.glow} strokeWidth={1.2} strokeOpacity={.7}/>
                  <Area type="monotone" dataKey="C" stroke={$.glow} fill={$.glowD} strokeWidth={2} isAnimationActive={false}/>
                </AreaChart>
              </ResponsiveContainer>
            }/>
        </div>

        {/* Stress Test */}
        <div style={{marginTop:32,marginBottom:24}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.glow,letterSpacing:".18em",marginBottom:10}}>· INTERACTIVE ·</div>
          <h3 style={{fontFamily:serif,fontStyle:"italic",fontWeight:500,fontSize:"clamp(22px,3.4vw,30px)",color:$.tx,marginBottom:10,lineHeight:1.2}}>Break it yourself.</h3>
          <p style={{fontSize:12.5,color:$.tx3,marginBottom:20,lineHeight:1.65,maxWidth:620}}>
            Pick a threat. Drag the slider. Watch what happens to four models under the same pressure, and what that pressure would cost in the real world. Every percent you move the slider is a choice a grid operator would be forced to make.
          </p>
          <StressTestWidget />
        </div>
      </div>
      <div style={{textAlign:"center",padding:"12px",borderTop:"1px solid "+$.brd}}>
        <div style={{fontFamily:F.m,fontSize:9,color:$.dim}}>A.G.N.E.S. v4.2 | University of Portsmouth 2025–2026</div>
      </div>
    </div>
  );

  /* ── TAB: PIPELINE ── */

  function runPipeline() {
    pipeTimers.current.forEach(clearTimeout);
    setPipeStage(0); setPipeOpen(null); setPipeRunning(true);
    var allStages = [];
    PIPELINE.forEach(function(ph) { ph.stages.forEach(function(s) { allStages.push(s); }); });
    allStages.forEach(function(_, i) {
      pipeTimers.current.push(setTimeout(function() {
        setPipeStage(i + 1);
        if (i === allStages.length - 1) setPipeRunning(false);
      }, (i + 1) * 550));
    });
  }

  var totalStages = 0;
  PIPELINE.forEach(function(ph) { totalStages += ph.stages.length; });
  var progress = Math.round((pipeStage / totalStages) * 100);

  if (tab==="pipe") return (
    <div style={{minHeight:"100vh",background:$.bg,fontFamily:F.s,color:$.tx2}}>
      {nav}
      <CinematicPipeline
        PIPELINE={PIPELINE}
        pipeOpen={pipeOpen}
        setPipeOpen={setPipeOpen}
        PipeVis={PipeVis}
      />
    </div>
  );

  /* ── TAB: FINDINGS ── */

  return (
    <div style={{minHeight:"100vh",background:$.bg,fontFamily:F.s,color:$.tx2}}>
      {nav}
      <div style={{maxWidth:820,margin:"0 auto",padding:"28px 20px 56px"}}>
        <div style={{marginBottom:28}}>
          <p style={{fontFamily:F.m,fontSize:10,color:$.glow,letterSpacing:4,marginBottom:8,animation:"findingIn .6s cubic-bezier(.16,1,.3,1) 0s both"}}>RESEARCH FINDINGS</p>
          <h2 style={{fontSize:"clamp(18px,3vw,26px)",fontWeight:600,fontFamily:serif,color:$.tx,marginBottom:8,animation:"findingIn .7s cubic-bezier(.16,1,.3,1) .08s both"}}>The data behind every claim</h2>
          <p style={{fontSize:13,color:$.tx3,lineHeight:1.75,animation:"findingIn .7s cubic-bezier(.16,1,.3,1) .16s both"}}>Click any finding to see the actual evidence</p>
        </div>

        {/* Finding 1: AUC degradation */}
        <div style={{marginBottom:14,animation:"findingIn .7s cubic-bezier(.16,1,.3,1) .28s both"}}>
          <div onClick={function(){setFindOpen(findOpen===1?null:1);}}
            onMouseEnter={function(e){if(findOpen!==1){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=$.rd+"44";}}}
            onMouseLeave={function(e){if(findOpen!==1){e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=$.brd;}}}
            style={{background:$.bg2,border:"1px solid "+(findOpen===1?$.rd+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .3s cubic-bezier(.16,1,.3,1)",position:"relative"}}>
            <div style={{position:"absolute",top:24,right:72,width:7,height:7,borderRadius:"50%",background:$.rd,animation:"findingPulse 2.2s ease-in-out infinite"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===1?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.rd,display:"inline-block",animation:"numPop .7s cubic-bezier(.16,1,.3,1) .5s both"}}>0.9999 → 0.8834</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The model was near-perfect in the lab. Deployment told a different story</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===1?"Close":"See proof"}</span>
            </div>
            {findOpen===1 && (
              <div style={{animation:"findingIn .4s ease both"}}>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={aucData} margin={{top:8,right:8,bottom:4,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.04)"/>
                    <XAxis dataKey="b" tick={TK} tickLine={false}/>
                    <YAxis domain={[0.84,1]} tick={TK} tickLine={false} width={36}/>
                    <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Drift",fill:$.ac,fontSize:8}}/>
                    <ReferenceLine x={65} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Attack",fill:$.rd,fontSize:8}}/>
                    <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Regime",fill:$.rd,fontSize:8}}/>
                    <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2} dot={false} name="Hybrid" animationDuration={1600}/>
                    <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1} dot={false} opacity={.4} name="SVM" animationDuration={1600} animationBegin={200}/>
                    <Line type="monotone" dataKey="R" stroke={$.gn} strokeWidth={1} dot={false} opacity={.4} name="RF" animationDuration={1600} animationBegin={400}/>
                  </LineChart>
                </ResponsiveContainer>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7,marginTop:8}}>Every line is a different model watching the same data stream. The vertical dashed lines mark when conditions changed. Between batch 40 and batch 120, 1 in 9 Hybrid predictions degraded. The model had no idea it was getting worse</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 2: ECE / Confidence */}
        <div style={{marginBottom:14,animation:"findingIn .7s cubic-bezier(.16,1,.3,1) .38s both"}}>
          <div onClick={function(){setFindOpen(findOpen===2?null:2);}}
            onMouseEnter={function(e){if(findOpen!==2){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=$.rd+"44";}}}
            onMouseLeave={function(e){if(findOpen!==2){e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=$.brd;}}}
            style={{background:$.bg2,border:"1px solid "+(findOpen===2?$.rd+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .3s cubic-bezier(.16,1,.3,1)",position:"relative"}}>
            <div style={{position:"absolute",top:24,right:72,width:7,height:7,borderRadius:"50%",background:$.rd,animation:"findingPulse 2.2s ease-in-out infinite .3s"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===2?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.rd,display:"inline-block",animation:"numPop .7s cubic-bezier(.16,1,.3,1) .6s both"}}>Confidence error increased 279×</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The model was still saying "90% sure" while being wrong</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===2?"Close":"See proof"}</span>
            </div>
            {findOpen===2 && (
              <div style={{animation:"findingIn .4s ease both"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
                  <div style={{background:"rgba(52,211,153,.04)",borderRadius:8,padding:"16px",textAlign:"center",animation:"findingIn .5s cubic-bezier(.16,1,.3,1) .1s both"}}>
                    <div style={{fontFamily:F.m,fontSize:8,color:$.gn,letterSpacing:1,marginBottom:6}}>LAB (CLEAN DATA)</div>
                    <div style={{fontFamily:F.m,fontSize:28,fontWeight:700,color:$.gn,animation:"numPop .7s cubic-bezier(.16,1,.3,1) .25s both"}}>1×</div>
                    <div style={{fontSize:11,color:$.tx3,marginTop:4}}>Model says 90%, is right 90% of the time</div>
                  </div>
                  <div style={{background:"rgba(248,113,113,.04)",borderRadius:8,padding:"16px",textAlign:"center",animation:"findingIn .5s cubic-bezier(.16,1,.3,1) .2s both"}}>
                    <div style={{fontFamily:F.m,fontSize:8,color:$.rd,letterSpacing:1,marginBottom:6}}>DEPLOYED (DRIFT)</div>
                    <div style={{fontFamily:F.m,fontSize:28,fontWeight:700,color:$.rd,animation:"numPop .9s cubic-bezier(.16,1,.3,1) .55s both"}}>279×</div>
                    <div style={{fontSize:11,color:$.tx3,marginTop:4}}>Model says 90%, is right far less often</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7}}>This is the most dangerous failure mode in ML deployment. The model does not know it is wrong. It keeps outputting high-confidence predictions that no longer match reality. LaSCal recalibration brought this back under control</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 3: PSI Early Warning */}
        <div style={{marginBottom:14,animation:"findingIn .7s cubic-bezier(.16,1,.3,1) .48s both"}}>
          <div onClick={function(){setFindOpen(findOpen===3?null:3);}}
            onMouseEnter={function(e){if(findOpen!==3){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=$.glow+"44";}}}
            onMouseLeave={function(e){if(findOpen!==3){e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=$.brd;}}}
            style={{background:$.bg2,border:"1px solid "+(findOpen===3?$.glow+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .3s cubic-bezier(.16,1,.3,1)",position:"relative"}}>
            <div style={{position:"absolute",top:24,right:72,width:7,height:7,borderRadius:"50%",background:$.glow,animation:"findingPulse 2.2s ease-in-out infinite .6s"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===3?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.glow,display:"inline-block",animation:"numPop .7s cubic-bezier(.16,1,.3,1) .7s both"}}>PSI fired 26 batches early</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The system spotted trouble before accuracy dropped</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===3?"Close":"See proof"}</span>
            </div>
            {findOpen===3 && (
              <div style={{animation:"findingIn .4s ease both"}}>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={psiData} margin={{top:8,right:8,bottom:4,left:0}}>
                    <XAxis dataKey="b" tick={TK} tickLine={false}/>
                    <YAxis tick={false} axisLine={false} width={0} domain={[0,function(mx){return Math.max(0.4,mx*1.1);}]}/>
                    <ReferenceLine y={0.25} stroke={$.rd} strokeDasharray="3 3" strokeOpacity={.5} label={{value:"Alert threshold",fill:$.rd,fontSize:8}}/>
                    <ReferenceLine x={55} stroke={$.glow} strokeWidth={2} strokeOpacity={.5} label={{value:"PSI fires",fill:$.glow,fontSize:8,position:"top"}}/>
                    <ReferenceLine x={81} stroke={$.rd} strokeWidth={1} strokeOpacity={.3} label={{value:"AUC drops",fill:$.rd,fontSize:8,position:"top"}}/>
                    <Area type="monotone" dataKey="P" stroke={$.ac} fill={$.acD} strokeWidth={2} animationDuration={1400}/>
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,marginBottom:8,animation:"gapBadge .8s cubic-bezier(.16,1,.3,1) 1s both",transformOrigin:"center"}}>
                  <div style={{flex:1,height:1,background:$.glow+"33"}}/>
                  <span style={{fontFamily:F.m,fontSize:11,color:$.glow,fontWeight:700,padding:"2px 8px",border:"1px solid "+$.glow+"44",borderRadius:4,background:$.glow+"0a"}}>26 batch gap</span>
                  <div style={{flex:1,height:1,background:$.glow+"33"}}/>
                </div>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7}}>The amber line is PSI, which measures how different incoming data looks from training data. It crossed the alert threshold at batch 55. Accuracy did not visibly drop until batch 81. That 26-batch window is the time you have to recalibrate, switch models, or alert an operator before the failure becomes visible</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 4: Adversarial Robustness */}
        <div style={{marginBottom:14,animation:"findingIn .7s cubic-bezier(.16,1,.3,1) .58s both"}}>
          <div onClick={function(){setFindOpen(findOpen===4?null:4);}}
            onMouseEnter={function(e){if(findOpen!==4){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=$.gn+"44";}}}
            onMouseLeave={function(e){if(findOpen!==4){e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=$.brd;}}}
            style={{background:$.bg2,border:"1px solid "+(findOpen===4?$.gn+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .3s cubic-bezier(.16,1,.3,1)",position:"relative"}}>
            <div style={{position:"absolute",top:24,right:72,width:7,height:7,borderRadius:"50%",background:$.gn,animation:"findingPulse 2.2s ease-in-out infinite .9s"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===4?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.gn,display:"inline-block",animation:"numPop .7s cubic-bezier(.16,1,.3,1) .8s both"}}>SVM 32.4% flipped vs RF 0.05%</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>Same test, completely different resilience</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===4?"Close":"See proof"}</span>
            </div>
            {findOpen===4 && (
              <div style={{animation:"findingIn .4s ease both"}}>
                <div style={{display:"flex",gap:12,marginBottom:12}}>
                  {[
                    {name:"SVM",val:32.4,color:"#a78bfa"},
                    {name:"Hybrid",val:7.6,color:$.glow},
                    {name:"LGBM",val:0.26,color:"#67e8f9"},
                    {name:"RF",val:0.05,color:$.gn},
                  ].map(function(m,i){return (
                    <div key={m.name} style={{flex:1,textAlign:"center"}}>
                      <div style={{height:100,display:"flex",alignItems:"flex-end",justifyContent:"center",marginBottom:6}}>
                        <div style={{width:"100%",maxWidth:40,height:Math.max(2,m.val/32.4*90),background:m.color,opacity:0.5,borderRadius:"3px 3px 0 0",animation:"barGrowH .9s cubic-bezier(.16,1,.3,1) "+(0.15+i*0.12)+"s both"}}/>
                      </div>
                      <div style={{fontFamily:F.m,fontSize:12,fontWeight:700,color:m.color,animation:"numPop .6s cubic-bezier(.16,1,.3,1) "+(0.9+i*0.12)+"s both"}}>{m.val}%</div>
                      <div style={{fontFamily:F.m,fontSize:8,color:$.dim,marginTop:2,animation:"softFadeIn .4s ease "+(1+i*0.12)+"s both"}}>{m.name}</div>
                    </div>
                  );})}
                </div>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7}}>Under FGSM adversarial perturbation testing at ε=0.1, the SVM had its predictions flipped 32.4% of the time. The Random Forest held at 0.05%. Tree-based models have no gradient to exploit. This is why the system keeps RF as the automatic fallback when adversarial conditions are detected</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 5: Coverage */}
        <div style={{marginBottom:14,animation:"findingIn .7s cubic-bezier(.16,1,.3,1) .68s both"}}>
          <div onClick={function(){setFindOpen(findOpen===5?null:5);}}
            onMouseEnter={function(e){if(findOpen!==5){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=$.ac+"44";}}}
            onMouseLeave={function(e){if(findOpen!==5){e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=$.brd;}}}
            style={{background:$.bg2,border:"1px solid "+(findOpen===5?$.ac+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .3s cubic-bezier(.16,1,.3,1)",position:"relative"}}>
            <div style={{position:"absolute",top:24,right:72,width:7,height:7,borderRadius:"50%",background:$.ac,animation:"findingPulse 2.2s ease-in-out infinite 1.2s"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===5?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.ac,display:"inline-block",animation:"numPop .7s cubic-bezier(.16,1,.3,1) .9s both"}}>Coverage dropped from 92% to 85%</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The safety guarantee expired. 1 in 7 predictions had no bound</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===5?"Close":"See proof"}</span>
            </div>
            {findOpen===5 && (
              <div style={{animation:"findingIn .4s ease both"}}>
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={covData} margin={{top:8,right:8,bottom:4,left:0}}>
                    <XAxis dataKey="b" tick={TK} tickLine={false}/>
                    <YAxis domain={[0.78,1]} tick={TK} tickLine={false} width={36}/>
                    <ReferenceLine y={0.95} stroke={$.gn} strokeDasharray="3 3" strokeOpacity={.5} label={{value:"95% guarantee",fill:$.gn,fontSize:8}}/>
                    <Area type="monotone" dataKey="C" stroke={$.glow} fill={$.glowD} strokeWidth={2} animationDuration={1600}/>
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7,marginTop:8}}>Conformal prediction guarantees that at least 95% of predictions have a reliable confidence bound. When the data shifts far enough, that guarantee breaks. By the abrupt-shift phase, coverage averaged 85%, meaning 1 in 7 predictions had no valid safety net. A model that can tell you when its own guarantee has expired is more valuable than one that cannot</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 6: F_gain */}
        <div style={{marginBottom:14,animation:"findingIn .7s cubic-bezier(.16,1,.3,1) .78s both"}}>
          <div onClick={function(){setFindOpen(findOpen===6?null:6);}}
            onMouseEnter={function(e){if(findOpen!==6){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=$.glow+"33";}}}
            onMouseLeave={function(e){if(findOpen!==6){e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=$.brd;}}}
            style={{background:$.bg2,border:"1px solid "+(findOpen===6?$.glow+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .3s cubic-bezier(.16,1,.3,1)",position:"relative"}}>
            <div style={{position:"absolute",top:24,right:72,width:7,height:7,borderRadius:"50%",background:$.glow,animation:"findingPulse 2.2s ease-in-out infinite 1.5s"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===6?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.glow,display:"inline-block",animation:"numPop .7s cubic-bezier(.16,1,.3,1) 1s both"}}>F_gain dominated every phase</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The physics held even when the statistics broke down</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===6?"Close":"See proof"}</span>
            </div>
            {findOpen===6 && (
              <div style={{animation:"findingIn .4s ease both"}}>
                <div style={{marginBottom:12}}>
                  {[
                    {name:"F_gain_mean",val:100,phase:"All phases"},
                    {name:"tau_std",val:72,phase:"All phases"},
                    {name:"tau_mean",val:58,phase:"All phases"},
                    {name:"g_mean",val:41,phase:"Stable + Drift"},
                    {name:"D_eff_std",val:33,phase:"Clean only"},
                  ].map(function(f,i){return (
                    <div key={f.name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,animation:"softFadeIn .4s ease "+(0.1+i*0.08)+"s both"}}>
                      <div style={{fontFamily:F.m,fontSize:9,color:$.tx2,width:90,textAlign:"right"}}>{f.name}</div>
                      <div style={{flex:1,height:6,background:"rgba(255,255,255,.04)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:f.val+"%",height:"100%",background:f.name==="F_gain_mean"?$.glow:$.dim,opacity:f.name==="F_gain_mean"?0.6:0.25,borderRadius:3,animation:"barGrowW .9s cubic-bezier(.16,1,.3,1) "+(0.25+i*0.12)+"s both",boxShadow:f.name==="F_gain_mean"?"0 0 8px "+$.glow+"44":"none"}}/>
                      </div>
                      <div style={{fontFamily:F.m,fontSize:8,color:$.dim,width:80}}>{f.phase}</div>
                    </div>
                  );})}
                </div>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7}}>SHAP analysis across every drift phase, every attack, every regime shift. The physics formula F_gain = τ·g was the most important feature in every single condition. When the statistics broke down, the physics still held. The model learned real electrical behaviour, not statistical artifacts</div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ THE CONVICTION — closing statement, not a summary ═══ */}
        <div style={{
          marginTop:44, marginBottom:8,
          padding:"clamp(28px, 4vw, 40px) clamp(22px, 3vw, 32px)",
          background:"linear-gradient(180deg, rgba(248,113,113,.03) 0%, transparent 100%)",
          borderTop:"1px solid "+$.rd+"22",
          borderBottom:"1px solid "+$.brd,
          animation:"findingIn 1s cubic-bezier(.16,1,.3,1) .95s both"
        }}>
          <div style={{
            fontFamily:F.m, fontSize:9, color:$.rd,
            letterSpacing:".32em", marginBottom:"clamp(18px, 2.5vw, 26px)",
            fontWeight:700
          }}>
            · THE ARGUMENT ·
          </div>

          <div style={{
            fontFamily:serif, fontStyle:"italic", fontWeight:400,
            fontSize:"clamp(22px, 3.6vw, 32px)",
            color:$.tx, lineHeight:1.3,
            marginBottom:"clamp(14px, 2vw, 20px)",
            maxWidth:720
          }}>
            A confident model sounds exactly like an accurate one.
          </div>

          <div style={{
            fontFamily:serif, fontStyle:"italic", fontWeight:400,
            fontSize:"clamp(22px, 3.6vw, 32px)",
            color:$.rd, lineHeight:1.3,
            marginBottom:"clamp(26px, 3.5vw, 36px)",
            maxWidth:720
          }}>
            Until it doesn't.
          </div>

          <div style={{
            width:56, height:1, background:$.glow, opacity:.45,
            marginBottom:"clamp(22px, 3vw, 28px)"
          }}/>

          <div style={{
            fontFamily:serif, fontWeight:400,
            fontSize:"clamp(15px, 2vw, 19px)",
            color:$.tx2, lineHeight:1.55,
            maxWidth:640,
            marginBottom:"clamp(20px, 2.6vw, 26px)"
          }}>
            W.R.E.N. is the difference between finding out from the model, and finding out from the news.
          </div>

          <div style={{
            display:"flex", alignItems:"center", gap:14,
            fontFamily:F.m, fontSize:9, color:$.dim, letterSpacing:".2em"
          }}>
            <span style={{width:20, height:1, background:$.brd}}/>
            <span>UNIVERSITY OF PORTSMOUTH · 2025 · 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}




/* ═══ HERO SECTION ═══ */
function HeroPreview() {
  var _sc = useState("nominal"); var scenario = _sc[0]; var setScenario = _sc[1];
  var _si = useState(0); var sceneIdx = _si[0]; var setSceneIdx = _si[1];
  var _health = useState(98); var dispHealth = _health[0]; var setDispHealth = _health[1];
  var _playing = useState(false); var playing = _playing[0]; var setPlaying = _playing[1];
  var _started = useState(false); var started = _started[0]; var setStarted = _started[1];
  var timerRef = useRef(null); var healthRef = useRef(null); var wrapRef = useRef(null);
  var sc = SCENARIOS[scenario];

  useEffect(function() {
    if (started) return;
    var el = wrapRef.current; if (!el) return;
    var o = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { setPlaying(true); setStarted(true); o.disconnect(); }
    }, { threshold: 0.3 });
    o.observe(el);
    return function() { o.disconnect(); };
  }, [started]);

  useEffect(function() {
    if (!playing) return;
    var idx = sceneIdx; var key = SCENE_ORDER[idx]; var target = SCENARIOS[key];
    setScenario(key);
    var startH = dispHealth; var endH = target.health; var steps = 30; var step = 0;
    clearInterval(healthRef.current);
    healthRef.current = setInterval(function() {
      step++; var t = step / steps; var ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setDispHealth(Math.round(startH + (endH - startH) * ease));
      if (step >= steps) clearInterval(healthRef.current);
    }, 30);
    timerRef.current = setTimeout(function() {
      if (idx < SCENE_ORDER.length - 1) setSceneIdx(idx + 1);
      else { setPlaying(false); setSceneIdx(0); setDispHealth(98); setScenario("nominal"); }
    }, SCENE_TIMING[idx]);
    return function() { clearTimeout(timerRef.current); clearInterval(healthRef.current); };
  }, [playing, sceneIdx]);

  var healthColor = dispHealth > 90 ? $.gn : dispHealth > 75 ? $.ac : $.rd;
  var b = sc.batch;
  var aucSlice = SH.slice(0, b + 1);

  return (
    <div ref={wrapRef} style={{ maxWidth: 660, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
        {/* Health score */}
        <div style={{ background: "rgba(255,255,255,.015)", borderRadius: 16, padding: "24px 28px", textAlign: "center", minWidth: 120 }}>
          <div style={{ marginBottom: 8 }}><Beacon s={32} glow={dispHealth > 90 ? 0.7 : dispHealth > 75 ? 0.3 : 0.05} /></div>
          <div style={{ fontSize: 44, fontWeight: 800, color: healthColor, fontFamily: F.m, transition: "color .3s", lineHeight: 1 }}>{dispHealth}</div>
          <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,.03)", borderRadius: 1, marginTop: 12, overflow: "hidden" }}>
            <div style={{ width: dispHealth + "%", height: "100%", background: healthColor, borderRadius: 1, transition: "width .8s, background .3s" }} />
          </div>
        </div>
        {/* Chart + status */}
        <div style={{ flex: 1, background: "rgba(255,255,255,.015)", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, boxShadow: "0 0 6px " + sc.color, animation: sc.color !== $.gn ? "wpulse 1.5s ease-in-out infinite" : "none" }} />
              <span style={{ fontFamily: F.m, fontSize: 9, color: sc.color, fontWeight: 600 }}>{sc.status}</span>
            </div>
            <span style={{ fontFamily: F.m, fontSize: 8, color: $.dim, opacity: 0.7 }}>{sc.label}</span>
          </div>
          <ResponsiveContainer width="100%" height={76}>
            <LineChart data={aucSlice.map(function(v, i) { return { b: i, v: v }; })} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <YAxis domain={["dataMin - 0.02", "dataMax + 0.01"]} hide={true} />
              <XAxis dataKey="b" hide={true} domain={[0, 119]} type="number" />
              <Line type="monotone" dataKey="v" stroke={$.glow} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, marginTop: 6, opacity: 0.6 }}>Model confidence over deployment</div>
        </div>
      </div>
    </div>
  );
}

function HeroSection(props) {
  var go = props.go; var setPage = props.setPage;
  var _stage = useState(0); var stage = _stage[0]; var setStage = _stage[1];
  var secRef = useRef(null);

  useEffect(function() {
    var t1 = setTimeout(function() { setStage(1); }, 600);
    var t2 = setTimeout(function() { setStage(2); }, 2000);
    var t3 = setTimeout(function() { setStage(3); }, 3200);
    var t4 = setTimeout(function() { setStage(4); }, 4000);
    var t5 = setTimeout(function() { setStage(5); }, 4600);
    return function() { [t1,t2,t3,t4,t5].forEach(clearTimeout); };
  }, []);

  var lampOp = stage >= 1 ? 0.95 : 0;
  var glowR = 38;
  var glowOp = stage >= 1 ? 0.35 : 0;
  var beamA = stage >= 2 ? 0.08 : 0;

  return (
    <section id="hero" ref={secRef} style={{ position: "relative", background: "#030608", overflow: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Grain */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", zIndex: 6, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      {/* Sea mist */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: "linear-gradient(to top, rgba(5,8,16,0.8), transparent)", pointerEvents: "none", zIndex: 5 }} />

      {/* ── CENTRED LIGHTHOUSE SCENE ── */}
      <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} aria-hidden="true">
        <defs>
          <style>{`@keyframes lhTw0{0%,100%{opacity:.9}60%{opacity:.2}}@keyframes lhTw1{0%,100%{opacity:.5}40%{opacity:1}}@keyframes lhTw2{0%,100%{opacity:.7}70%{opacity:.15}}@keyframes sigPulse{0%,100%{opacity:0}15%,85%{opacity:1}}`}</style>
          <linearGradient id="towerG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8892a0"/><stop offset="35%" stopColor="#d0d5dc"/><stop offset="55%" stopColor="#e8eaef"/><stop offset="75%" stopColor="#c0c6cf"/><stop offset="100%" stopColor="#7a8494"/></linearGradient>
          <linearGradient id="bandG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6b7585"/><stop offset="40%" stopColor="#9aa3b2"/><stop offset="60%" stopColor="#a8b0be"/><stop offset="100%" stopColor="#5e6878"/></linearGradient>
          <linearGradient id="domeG" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#b0b8c4"/><stop offset="50%" stopColor="#d8dce3"/><stop offset="100%" stopColor="#9aa2af"/></linearGradient>
          <linearGradient id="lampG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7a8494"/><stop offset="30%" stopColor="#c0c8d2"/><stop offset="50%" stopColor="#dde1e8"/><stop offset="70%" stopColor="#b8c0cc"/><stop offset="100%" stopColor="#6e7888"/></linearGradient>
          <linearGradient id="railG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8a94a4"/><stop offset="50%" stopColor="#d0d6de"/><stop offset="100%" stopColor="#8a94a4"/></linearGradient>
          <clipPath id="lhClip"><rect x="0" y="0" width="1400" height="700"/></clipPath>
        </defs>
        <rect x="0" y="0" width="1400" height="900" fill="#030608"/>

        {/* Stars */}
        <g style={{animation:"lhTw0 3.2s ease-in-out infinite"}} opacity={stage>=1?1:0}>
          <circle cx="150" cy="80" r="1.4" fill="#e8d5a3" opacity=".5"/><circle cx="1250" cy="90" r="1.6" fill="#e8d5a3" opacity=".45"/>
          <circle cx="400" cy="50" r="1.8" fill="#e8d5a3" opacity=".6"/><circle cx="1100" cy="60" r="1.3" fill="#fff" opacity=".4"/>
          <circle cx="800" cy="40" r="2" fill="#e8d5a3" opacity=".5"/><circle cx="250" cy="140" r="1.2" fill="#fff" opacity=".35"/>
        </g>
        <g style={{animation:"lhTw1 4.1s ease-in-out infinite"}} opacity={stage>=1?1:0}>
          <circle cx="550" cy="65" r="1.5" fill="#e8d5a3" opacity=".45"/><circle cx="950" cy="80" r="1.4" fill="#fff" opacity=".4"/>
          <circle cx="1300" cy="120" r="1.7" fill="#e8d5a3" opacity=".4"/>
        </g>

        {/* Beam - static, from lamp */}
        <g clipPath="url(#lhClip)" opacity={stage>=2?1:0} style={{transition:"opacity 1.5s ease"}}>
          <polygon points="700,416 380,-100 1020,-100" fill="#fbbf24" opacity={beamA * 1.3}/>
          <polygon points="700,416 520,-100 880,-100" fill="#fbbf24" opacity={beamA * 0.7}/>

          {/* Grid nodes revealed by beam */}
          <g opacity={beamA * 9} style={{animation:"sigPulse 5.5s ease-in-out infinite"}}>
            <circle cx="500" cy="200" r="5" fill="none" stroke="#fbbf24" strokeWidth="0.7" opacity=".3"/>
            <circle cx="500" cy="200" r="1.3" fill="#fbbf24" opacity=".5"/>
            <circle cx="700" cy="100" r="5.5" fill="none" stroke="#fbbf24" strokeWidth="0.7" opacity=".35"/>
            <circle cx="700" cy="100" r="1.4" fill="#fbbf24" opacity=".6"/>
            <circle cx="900" cy="180" r="5" fill="none" stroke="#fbbf24" strokeWidth="0.7" opacity=".28"/>
            <circle cx="900" cy="180" r="1.3" fill="#fbbf24" opacity=".45"/>
            <line x1="500" y1="200" x2="700" y2="100" stroke="#fbbf24" strokeWidth="0.5" opacity=".2" strokeDasharray="5 5"/>
            <line x1="700" y1="100" x2="900" y2="180" stroke="#fbbf24" strokeWidth="0.5" opacity=".16" strokeDasharray="5 5"/>
            <text x="514" y="195" fill="#fbbf24" fontSize="8" fontFamily="monospace" opacity=".35">GEN</text>
            <text x="714" y="94" fill="#fbbf24" fontSize="8" fontFamily="monospace" opacity=".3">LOAD</text>
            <text x="914" y="174" fill="#fbbf24" fontSize="8" fontFamily="monospace" opacity=".25">DIST</text>
          </g>

          {/* Waveform */}
          <g opacity={beamA * 7} style={{animation:"sigPulse 6s ease-in-out infinite 1.2s"}}>
            <path d="M480,280 Q510,270 540,280 T600,280 T660,280 Q690,268 720,280 T780,280 T840,280 Q860,290 880,278 T940,280" fill="none" stroke="#fbbf24" strokeWidth="0.7" opacity=".3"/>
          </g>
        </g>

        {/* Spinnaker Tower */}
        <g opacity={stage>=1?0.85:0} style={{transition:"opacity 1.5s ease"}}>
          <polygon points="435,680 443,680 441,380 438,320 435,380" fill="#0d1a2c" opacity=".85"/>
          <path d="M433,670 L410,666 Q384,652 368,622 Q352,588 356,546 Q360,508 376,480 Q394,452 418,440 Q430,435 433,410 Q418,410 400,422 Q378,438 364,470 Q348,508 352,550 Q356,592 374,626 Q392,656 428,668Z" fill="#0c1828" opacity=".8"/>
        </g>

        {/* Guildhall */}
        <g opacity={stage>=1?0.75:0} style={{transition:"opacity 1.5s ease"}}>
          <rect x="930" y="618" width="168" height="65" fill="#0d1825" opacity=".75" rx="2"/>
          <polygon points="930,618 1098,618 1014,585" fill="#0f1d2e" opacity=".75"/>
          <rect x="998" y="560" width="32" height="62" fill="#0d1927" opacity=".8" rx="2"/>
          <path d="M998,560 Q1014,538 1030,560" fill="#0f1d2e" opacity=".8"/>
        </g>

        {/* ── 3D CAD LIGHTHOUSE centred ── */}
        <g opacity={stage>=1?1:0} style={{transition:"opacity 1.2s ease"}}>
          <polygon points="666,680 734,680 718,440 682,440" fill="url(#towerG)"/>
          <polygon points="700,440 718,440 734,680 700,680" fill="#6e7888" opacity=".25"/>
          <line x1="666" y1="680" x2="682" y2="440" stroke="#f0f2f5" strokeWidth="0.6" opacity=".5"/>
          <polygon points="668,530 732,530 729,496 671,496" fill="url(#bandG)" opacity=".9"/>
          <polygon points="669,600 731,600 728,568 672,568" fill="url(#bandG)" opacity=".85"/>
          <rect x="656" y="432" width="88" height="8" rx="2" fill="url(#railG)"/>
          <rect x="656" y="432" width="88" height="2" rx="1" fill="#eef0f3" opacity=".5"/>
          <rect x="676" y="396" width="48" height="38" rx="2" fill="url(#lampG)"/>
          <rect x="676" y="396" width="48" height="38" rx="2" fill="#fbbf24" opacity={stage>=1?0.15:0}/>
          <line x1="688" y1="396" x2="688" y2="434" stroke="rgba(255,255,255,.15)" strokeWidth=".6"/>
          <line x1="700" y1="396" x2="700" y2="434" stroke="rgba(255,255,255,.2)" strokeWidth=".6"/>
          <line x1="712" y1="396" x2="712" y2="434" stroke="rgba(255,255,255,.15)" strokeWidth=".6"/>
          <rect x="677" y="397" width="12" height="36" rx="1" fill="#fff" opacity=".06"/>
          <path d="M676,396 Q677,370 700,358 Q723,370 724,396Z" fill="url(#domeG)"/>
          <path d="M676,396 Q677,370 700,358 Q700,370 700,396Z" fill="#fff" opacity=".08"/>
          <line x1="700" y1="358" x2="700" y2="336" stroke="#c0c8d2" strokeWidth="2"/>
          <circle cx="700" cy="334" r="4" fill="#d0d6de" stroke="#9aa2af" strokeWidth="0.5"/>
          <circle cx="699" cy="333" r="1.5" fill="#fff" opacity=".3"/>
          <circle cx="700" cy="334" r="2" fill="#fbbf24" opacity=".7"/>
          <rect x="692" y="507" width="16" height="20" rx="8" fill="#3a4050" opacity=".4"/>
          <rect x="693" y="508" width="14" height="18" rx="7" fill="#fbbf24" opacity=".3"/>
          <rect x="692" y="577" width="16" height="20" rx="8" fill="#3a4050" opacity=".35"/>
          <rect x="693" y="578" width="14" height="18" rx="7" fill="#fbbf24" opacity=".22"/>
          <rect x="658" y="676" width="84" height="6" rx="2" fill="url(#railG)" opacity=".8"/>
          {/* Lamp glow */}
          <circle cx="700" cy="416" r={glowR} fill="#fbbf24" opacity={glowOp}/>
          <circle cx="700" cy="416" r="12" fill="#fbbf24" opacity={stage>=1?0.55:0}/>
          <circle cx="700" cy="416" r="5" fill="#fbbf24" opacity={lampOp}/>
          <circle cx="700" cy="416" r="2.5" fill="#fffde0" opacity={stage>=1?0.9:0}/>
        </g>

        {/* Ground */}
        <rect x="0" y="680" width="1400" height="220" fill="#050810"/>
        <line x1="0" y1="681" x2="1400" y2="681" stroke="#152030" strokeWidth="1.5" opacity=".5"/>
      </svg>

      {/* Headline at bottom of lighthouse, everything under it below */}
      <div style={{ position: "absolute", bottom: "1vh", left: 0, right: 0, zIndex: 10, textAlign: "center", padding: "0 16px" }}>

        <h1 style={{ fontSize: "clamp(22px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", color: $.tx, fontFamily: F.s, marginBottom: "clamp(8px, 2vw, 18px)", textShadow: "0 4px 30px #030608, 0 0 60px rgba(3,6,8,0.8)",
          opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? "none" : "translateY(20px)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1)" }}>
          Know when the model<br/>stops being trustworthy
        </h1>

        {/* Signal line */}
        <div style={{ width: stage >= 4 ? "clamp(50px, 10vw, 100px)" : 0, height: 1, background: "linear-gradient(90deg, " + $.glow + "66, transparent)", margin: "0 auto clamp(8px, 1.5vw, 14px)", transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />

        <p style={{ fontSize: "clamp(12px, 2.5vw, 16px)", color: $.tx3, lineHeight: 1.6, maxWidth: 440, margin: "0 auto clamp(6px, 1.5vw, 14px)", textShadow: "0 2px 20px #030608",
          opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? "none" : "translateY(14px)", transition: "all 0.8s ease" }}>
          When an AI runs a power grid,<br/>how do you know it is still getting it right
        </p>

        <p style={{ fontFamily: F.m, fontSize: "clamp(7px, 1.2vw, 9px)", color: $.dim, letterSpacing: 1.2, marginBottom: "clamp(14px, 3vw, 28px)",
          opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? "none" : "translateY(10px)", transition: "all 0.8s ease 0.15s" }}>
          Built in Portsmouth. Inspired by signal rooms.
        </p>

        <div style={{ display: "flex", gap: "clamp(6px, 1.5vw, 12px)", justifyContent: "center",
          opacity: stage >= 5 ? 1 : 0, transform: stage >= 5 ? "none" : "translateY(8px)", transition: "all 0.8s ease" }}>
          <button onClick={function() { setPage("ops"); }}
            style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 8, padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 24px)", fontSize: "clamp(11px, 1.8vw, 13px)", fontWeight: 700, cursor: "pointer", fontFamily: F.s }}>
            Enter Ops Centre
          </button>
           <button onClick={function() { setPage("story"); }}
            style={{ background: "rgba(255,255,255,.04)", color: $.tx3, border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, padding: "clamp(8px, 1.5vw, 10px) clamp(14px, 2.5vw, 20px)", fontSize: "clamp(11px, 1.8vw, 13px)", fontWeight: 500, cursor: "pointer", fontFamily: F.s, backdropFilter: "blur(8px)" }}>
            See It Live
          </button>
        </div>
      </div>
    </section>
  );
}
/* ═══ INTERACTIVE STRESS TEST ═══ */
function StressTestWidget() {
  var _mode = useState("drift"); var mode = _mode[0]; var setMode = _mode[1];
  var _level = useState(25); var level = _level[0]; var setLevel = _level[1];
  var _dragging = useState(false); var dragging = _dragging[0]; var setDragging = _dragging[1];
  var _explain = useState(null); var explain = _explain[0]; var setExplain = _explain[1];

  // Compute metrics based on stress level and mode
  var t = level / 100;
  var metrics = {
    drift: {
      auc: (0.9999 - t * t * 0.165).toFixed(4),
      psi: (0.08 + t * t * 2.3).toFixed(2),
      cov: ((0.96 - t * t * 0.18) * 100).toFixed(1),
      aucC: t < 0.4 ? $.gn : t < 0.7 ? $.ac : $.rd,
      psiC: t * t * 2.3 + 0.08 < 0.25 ? $.gn : t < 0.7 ? $.ac : $.rd,
      covC: (0.96 - t * t * 0.18) > 0.95 ? $.gn : (0.96 - t * t * 0.18) > 0.85 ? $.ac : $.rd,
      label: "DISTRIBUTION DRIFT",
      desc: "Training data no longer matches reality. Features shift gradually.",
    },
    noise: {
      auc: (0.9999 - t * 0.08 - t * t * 0.04).toFixed(4),
      psi: (0.08 + t * 0.15).toFixed(2),
      cov: ((0.96 - t * 0.06) * 100).toFixed(1),
      aucC: t < 0.5 ? $.gn : t < 0.8 ? $.ac : $.rd,
      psiC: (0.08 + t * 0.15) < 0.25 ? $.gn : $.ac,
      covC: (0.96 - t * 0.06) > 0.95 ? $.gn : $.ac,
      label: "SENSOR NOISE",
      desc: "Corrupted sensor readings injected into the data pipeline.",
    },
    attack: {
      auc: (0.9999 - t * t * t * 0.22).toFixed(4),
      psi: (0.08 + t * t * 1.8).toFixed(2),
      cov: ((0.96 - t * t * t * 0.2) * 100).toFixed(1),
      aucC: t < 0.35 ? $.gn : t < 0.6 ? $.ac : $.rd,
      psiC: t * t * 1.8 + 0.08 < 0.25 ? $.gn : t < 0.5 ? $.ac : $.rd,
      covC: (0.96 - t * t * t * 0.2) > 0.95 ? $.gn : (0.96 - t * t * t * 0.2) > 0.85 ? $.ac : $.rd,
      label: "ADVERSARIAL ATTACK",
      desc: "FGSM perturbation targeting the SVM decision boundary.",
    },
  };
  var m = metrics[mode];
  var phase = t < 0.3 ? "stable" : t < 0.65 ? "degrading" : "critical";
  var phaseCol = phase === "stable" ? $.gn : phase === "degrading" ? $.ac : $.rd;

  // Generate multi-model sparkline data
  var sparkHybrid = [], sparkSVM = [], sparkRF = [], sparkLGBM = [];
  for (var i = 0; i <= 40; i++) {
    var st = (i / 40) * t;
    var noise = Math.sin(i * 3.7) * 0.008 + Math.cos(i * 7.1) * 0.005;
    // Hybrid - best, degrades gracefully
    var hVal = mode === "drift" ? 0.9999 - st * st * 0.165 + noise
      : mode === "noise" ? 0.9999 - st * 0.08 - st * st * 0.04 + noise * 2
      : 0.9999 - st * st * st * 0.22 + noise;
    // SVM - degrades fast, especially under attack
    var svmVal = mode === "drift" ? 0.9259 - st * st * 0.22 + noise * 1.5
      : mode === "noise" ? 0.9259 - st * 0.12 - st * st * 0.06 + noise * 2.5
      : 0.9259 - st * st * 0.35 + noise;
    // RF - holds under attack, decent under drift
    var rfVal = mode === "drift" ? 0.9607 - st * st * 0.18 + noise
      : mode === "noise" ? 0.9607 - st * 0.06 - st * st * 0.03 + noise * 1.5
      : 0.9607 - st * st * st * 0.04 + noise;
    // LGBM - between hybrid and SVM
    var lgbmVal = mode === "drift" ? 0.9592 - st * st * 0.19 + noise * 1.2
      : mode === "noise" ? 0.9592 - st * 0.09 - st * st * 0.05 + noise * 1.8
      : 0.9592 - st * st * st * 0.18 + noise;
    sparkHybrid.push(Math.max(0.7, Math.min(1, hVal)));
    sparkSVM.push(Math.max(0.7, Math.min(1, svmVal)));
    sparkRF.push(Math.max(0.7, Math.min(1, rfVal)));
    sparkLGBM.push(Math.max(0.7, Math.min(1, lgbmVal)));
  }
  var sparkData = sparkHybrid;

  // Grid stress based on level
  var gridStress = t < 0.3 ? [0,0,0,0] : t < 0.5 ? [1,0,0,0] : t < 0.65 ? [1,1,0,1] : t < 0.8 ? [2,1,1,1] : [2,2,2,2];

  // Trust threshold
  var TRUST_LINE = 0.90;
  var currentAUC = sparkHybrid[sparkHybrid.length - 1];
  var crossedThreshold = currentAUC < TRUST_LINE;

  // Batches to failure estimate
  var batchesToFailure = t < 0.1 ? 120 : t < 0.3 ? Math.round(80 - t * 200) : t < 0.6 ? Math.round(30 - t * 40) : t < 0.85 ? Math.round(8 - t * 6) : 0;
  batchesToFailure = Math.max(0, batchesToFailure);

  // Intervention effect - what recalibration would do
  var afterAUC = Math.min(0.98, parseFloat(m.auc) + 0.06 + (1 - t) * 0.03).toFixed(4);
  var afterCov = Math.min(96, parseFloat(m.cov) + 5 + (1 - t) * 3).toFixed(1);

  // Model prediction vs reality
  var modelSays = Math.max(52, Math.round(98 - t * t * 46));
  var reality = Math.max(38, Math.round(98 - t * 55));
  var gap = Math.abs(modelSays - reality);
  var trustable = gap < 5;

  // Failure mode label
  var failMode = t < 0.15 ? "Stable" : t < 0.3 ? "Nominal drift" : t < 0.5 ? "Degrading" : t < 0.65 ? "Miscalibrated" : t < 0.8 ? "Unsafe" : "Failure";
  var failColor = t < 0.15 ? $.gn : t < 0.3 ? $.gn : t < 0.5 ? $.ac : t < 0.65 ? $.ac : t < 0.8 ? $.rd : $.rd;

  // Dynamic takeaway
  var takeaway = t < 0.15 ? "The model is reliable. What it says matches what is actually happening"
    : t < 0.35 ? "The model is starting to lose touch with reality, but it does not know that yet. It is still confident"
    : t < 0.55 ? "The safety guarantee is weakening. Some predictions now have no reliable confidence bound"
    : t < 0.75 ? "Predictions are no longer safe to act on. A human should be making these decisions now"
    : t < 0.9 ? "The model is confidently wrong. Every decision based on it carries real risk"
    : "Nothing the model says can be trusted. It needs to be taken offline";

  // Mode explainer
  var modeExplain = mode === "drift" ? "The real world is slowly changing but the model was trained on old data. Imagine a weather forecast built on last year's climate. It gets less reliable every day, but it doesn't know that."
    : mode === "noise" ? "A sensor is sending bad readings. The model sees chaos in the data. Is the power grid actually failing, or is the sensor just broken? The system has to figure out the difference."
    : "Standard adversarial robustness testing. Small mathematical perturbations applied to inputs to test whether the model can be pushed into wrong predictions. This is a real threat in critical infrastructure.";

  // ═══ HUMAN-SCALE CONSEQUENCES ═══ translates the abstract stress level into lives
  var homesAffected    = Math.round(Math.pow(t, 1.8) * 850000);
  var hospitalsBackup  = Math.floor(Math.pow(t, 1.5) * 14);
  var damagesPerHourM  = Math.round(Math.pow(t, 2.2) * 18 * 10) / 10;  // $M, one decimal

  var impactTier =
    t < 0.15 ? { label: "STABLE",               narr: "A grid of this size would be running normally.",                         accent: $.gn,  tint: "transparent",            border: $.brd,      numCol: $.tx2 } :
    t < 0.35 ? { label: "LOCAL IMPACT",         narr: "A grid of this size would be showing its first warning signs.",          accent: $.gn,  tint: "rgba(52,211,153,.03)",   border: $.gn+"22",  numCol: $.tx2 } :
    t < 0.55 ? { label: "REGIONAL IMPACT",      narr: "A grid of this size would be moving into emergency operations.",         accent: $.ac,  tint: "rgba(251,191,36,.04)",   border: $.ac+"33",  numCol: $.ac  } :
    t < 0.75 ? { label: "CRITICAL IMPACT",      narr: "A grid of this size would be in cascade failure.",                       accent: $.rd,  tint: "rgba(248,113,113,.045)", border: $.rd+"44",  numCol: $.rd  } :
               { label: "CATASTROPHIC IMPACT",  narr: "A grid of this size would be beyond recovery.",                          accent: $.rd,  tint: "rgba(248,113,113,.07)",  border: $.rd+"66",  numCol: $.rd  };

  // Real blackouts the current stress profile most closely resembles
  var historicalEvent =
    t < 0.20 ? null :
    t < 0.35 ? { when: "July 1977",       where: "New York City",          cost: "9 hours dark · 1,600 stores looted · $300M in damages" } :
    t < 0.50 ? { when: "August 2006",     where: "Queens, New York",       cost: "100,000 without power for 9 days · 9 deaths in heatwave" } :
    t < 0.68 ? { when: "August 2003",     where: "Northeast North America", cost: "55 million affected · $6 billion in damages · 11 deaths" } :
    t < 0.82 ? { when: "February 2021",   where: "Texas",                   cost: "4.5 million without heat · $200 billion in damages · 246 deaths" } :
    t < 0.95 ? { when: "September 2003",  where: "Italy",                   cost: "57 million affected · near total national grid failure" } :
               { when: "No precedent",    where: "Beyond recorded history", cost: "There is nothing at this scale on record" };

  return (
    <div style={{ maxWidth: 740, margin: "0 auto" }}>
      {/* Mode selector */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
        {[{id:"drift",label:"Drift"},{id:"noise",label:"Noise"},{id:"attack",label:"Attack"}].map(function(md) {
          var active = mode === md.id;
          return (
            <button key={md.id} onClick={function(){ setMode(md.id); }}
              style={{ padding: "8px 22px", borderRadius: 8, fontFamily: F.m, fontSize: 11, fontWeight: active ? 700 : 400, cursor: "pointer",
                color: active ? $.bg : $.tx3, background: active ? $.glow : "rgba(255,255,255,.03)", border: "1px solid " + (active ? $.glow : $.brd),
                transition: "all .2s", letterSpacing: 0.5 }}>
              {md.label}
            </button>
          );
        })}
      </div>

      {/* Main panel */}
      <div style={{ background: $.bg2, borderRadius: 14, padding: "24px 24px 20px", position: "relative", overflow: "hidden", transition: "all .5s" }}>

        {/* Edge glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
          boxShadow: phase === "critical" ? "inset 0 0 80px " + $.rd + "18" : phase === "degrading" ? "inset 0 0 50px " + $.ac + "0a" : "none",
          transition: "box-shadow .8s" }} />

        {/* Slider row */}
        <div style={{ marginBottom: 18, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Beacon s={22} glow={phase === "stable" ? 0.6 : phase === "degrading" ? 0.25 : 0.03} />
              <span style={{ fontFamily: F.m, fontSize: 10, color: failColor, letterSpacing: 1, fontWeight: 600 }}>{failMode.toUpperCase()}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {batchesToFailure > 0 && t > 0.1 && (
                <span style={{ fontFamily: F.m, fontSize: 9, color: batchesToFailure < 10 ? $.rd : batchesToFailure < 30 ? $.ac : $.dim, transition: "color .3s" }}>
                  ~{batchesToFailure} batches to failure
                </span>
              )}
              {batchesToFailure === 0 && t > 0.1 && (
                <span style={{ fontFamily: F.m, fontSize: 9, color: $.rd, fontWeight: 700, animation: "wpulse 1s ease-in-out infinite" }}>FAILED</span>
              )}
              <span style={{ fontFamily: F.m, fontSize: 13, color: phaseCol, fontWeight: 700 }}>{Math.round(level)}%</span>
            </div>
          </div>
          <input type="range" min={0} max={100} value={level}
            onChange={function(e) { setLevel(+e.target.value); }}
            onMouseDown={function() { setDragging(true); }}
            onMouseUp={function() { setDragging(false); }}
            onTouchStart={function() { setDragging(true); }}
            onTouchEnd={function() { setDragging(false); }}
            style={{ width: "100%", accentColor: $.glow, height: 6, cursor: "pointer" }} />
        </div>

        {/* Mode explainer */}
        <div style={{ fontSize: 11, color: $.tx3, lineHeight: 1.5, marginBottom: 16, fontStyle: "italic", opacity: 0.75 }}>
          {modeExplain}
        </div>

        {/* ═══ CONSEQUENCE PANEL ═══ what this stress level would mean for real people */}
        <div style={{
          marginBottom: 18,
          padding: "18px 20px 16px",
          background: impactTier.tint,
          border: "1px solid " + impactTier.border,
          borderRadius: 12,
          transition: "background .5s, border-color .5s",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Phase classification stamp */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 10
          }}>
            <div style={{
              width: 6, height: 6, borderRadius:"50%",
              background: impactTier.accent,
              boxShadow: t > 0.55 ? "0 0 8px " + impactTier.accent : "none",
              animation: t > 0.55 ? "wpulse 1.6s ease-in-out infinite" : "none",
              transition: "background .4s"
            }}/>
            <span style={{
              fontFamily: F.m, fontSize: 9, color: impactTier.accent,
              letterSpacing: ".22em", fontWeight: 700, transition: "color .4s"
            }}>
              {impactTier.label}
            </span>
            <span style={{ flex: 1, height: 1, background: impactTier.border, marginLeft: 4 }}/>
            <span style={{ fontFamily: F.m, fontSize: 8, color: $.dim, letterSpacing: ".08em" }}>
              {Math.round(level)}% STRESS
            </span>
          </div>

          {/* Editorial narrative — the line that does the heavy lifting */}
          <div style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: 19, color: $.tx, lineHeight: 1.35,
            marginBottom: 16, transition: "color .4s"
          }}>
            {impactTier.narr}
          </div>

          {/* Three big stat columns — these climb in real time as the slider moves */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14,
            paddingTop: 14, borderTop: "1px dashed " + $.brd
          }}>
            <div>
              <div style={{ fontFamily: F.m, fontSize: 7.5, color: $.dim, letterSpacing: "0.14em", marginBottom: 5 }}>HOMES WITHOUT POWER</div>
              <div style={{ fontFamily: F.m, fontSize: 22, fontWeight: 700, color: impactTier.numCol, transition: "color .4s", letterSpacing: "-0.01em" }}>
                {homesAffected.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F.m, fontSize: 7.5, color: $.dim, letterSpacing: "0.14em", marginBottom: 5 }}>HOSPITALS ON BACKUP</div>
              <div style={{ fontFamily: F.m, fontSize: 22, fontWeight: 700, color: impactTier.numCol, transition: "color .4s", letterSpacing: "-0.01em" }}>
                {hospitalsBackup}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F.m, fontSize: 7.5, color: $.dim, letterSpacing: "0.14em", marginBottom: 5 }}>DAMAGES PER HOUR</div>
              <div style={{ fontFamily: F.m, fontSize: 22, fontWeight: 700, color: impactTier.numCol, transition: "color .4s", letterSpacing: "-0.01em" }}>
                ${damagesPerHourM}M
              </div>
            </div>
          </div>

          {/* Historical anchor — the quiet, devastating part */}
          {historicalEvent && (
            <div style={{
              marginTop: 16, paddingTop: 14,
              borderTop: "1px dashed " + (t > 0.68 ? $.rd + "33" : $.brd)
            }}>
              <div style={{ fontFamily: F.m, fontSize: 7.5, color: $.dim, letterSpacing: "0.2em", marginBottom: 6 }}>
                STRESS PROFILE MATCHES
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 14, color: $.tx2, fontWeight: 500 }}>
                  {historicalEvent.where}
                </span>
                <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: ".05em" }}>
                  {historicalEvent.when}
                </span>
              </div>
              <div style={{ fontSize: 11, color: $.tx3, lineHeight: 1.55 }}>
                {historicalEvent.cost}
              </div>
            </div>
          )}

          {/* The final gravity line — only appears at the highest levels */}
          {t > 0.78 && (
            <div style={{
              marginTop: 14, paddingTop: 12,
              borderTop: "1px solid " + $.rd + "33",
              fontFamily: serif, fontStyle: "italic",
              fontSize: 12.5, color: $.rd, lineHeight: 1.55,
              animation: "wup .4s ease both"
            }}>
              A decision based on a model this wrong is not a prediction. It is a guess. At this scale, the cost of guessing is measured in lives.
            </div>
          )}
        </div>

        {/* Grid + Chart side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 14, marginBottom: 14 }}>
          {/* Grid topology */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Topo batch={0} stressed={gridStress} size={4} maxW={120} />
          </div>
          {/* Multi-model chart */}
          <div style={{ position: "relative" }}>
            <svg viewBox="0 0 440 90" style={{ width: "100%", height: 90, display: "block" }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={phaseCol} stopOpacity="0.1"/>
                  <stop offset="100%" stopColor={phaseCol} stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Trust threshold */}
              <line x1="0" y1={((1-TRUST_LINE)*80+5)} x2="400" y2={((1-TRUST_LINE)*80+5)} stroke={crossedThreshold?$.rd:$.ac} strokeWidth={crossedThreshold?"1":"0.5"} strokeDasharray="4 4" opacity={crossedThreshold?0.6:0.2}/>
              {crossedThreshold && <rect x="0" y={((1-TRUST_LINE)*80+5)} width="400" height={90-((1-TRUST_LINE)*80+5)} fill={$.rd} opacity="0.03"/>}
              <text x="404" y={((1-TRUST_LINE)*80+8)} fill={crossedThreshold?$.rd:$.dim} fontSize="6" fontFamily="monospace" opacity={crossedThreshold?0.7:0.3}>TRUST</text>
              {/* SVM line - fails first */}
              <polyline points={sparkSVM.map(function(v, i) { return (i / 40 * 400) + "," + ((1 - v) * 80 + 5); }).join(" ")}
                fill="none" stroke="#a78bfa" strokeWidth="1.2" opacity="0.5" />
              {/* RF line - holds under attack */}
              <polyline points={sparkRF.map(function(v, i) { return (i / 40 * 400) + "," + ((1 - v) * 80 + 5); }).join(" ")}
                fill="none" stroke={$.gn} strokeWidth="1.2" opacity="0.5" />
              {/* LGBM line */}
              <polyline points={sparkLGBM.map(function(v, i) { return (i / 40 * 400) + "," + ((1 - v) * 80 + 5); }).join(" ")}
                fill="none" stroke="#67e8f9" strokeWidth="1.2" opacity="0.45" />
              {/* Hybrid area */}
              <path d={
                "M0," + ((1 - sparkHybrid[0]) * 80 + 5) + " " +
                sparkHybrid.map(function(v, i) { return (i / 40 * 400) + "," + ((1 - v) * 80 + 5); }).join(" L") +
                " L400,90 L0,90 Z"
              } fill="url(#stressGrad)" />
              {/* Hybrid line - your best model */}
              <polyline points={sparkHybrid.map(function(v, i) { return (i / 40 * 400) + "," + ((1 - v) * 80 + 5); }).join(" ")}
                fill="none" stroke={$.glow} strokeWidth="2" />
              <circle cx="400" cy={(1 - sparkHybrid[sparkHybrid.length - 1]) * 80 + 5} r="3.5" fill={$.glow} opacity="0.9" />
            </svg>
            <div style={{ position: "absolute", top: 0, left: 0, fontFamily: F.m, fontSize: 7, color: $.dim }}>AUC</div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 10, height: 2, background: $.glow, borderRadius: 1 }}/><span style={{ fontFamily: F.m, fontSize: 7, color: $.dim }}>Hybrid</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 10, height: 2, background: "#a78bfa", borderRadius: 1 }}/><span style={{ fontFamily: F.m, fontSize: 7, color: $.dim }}>SVM</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 10, height: 2, background: $.gn, borderRadius: 1 }}/><span style={{ fontFamily: F.m, fontSize: 7, color: $.dim }}>RF</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 10, height: 2, background: "#67e8f9", borderRadius: 1 }}/><span style={{ fontFamily: F.m, fontSize: 7, color: $.dim }}>LGBM</span></div>
            </div>
          </div>
        </div>

        {/* Prediction vs Reality - clickable */}
        <div onClick={function(){setExplain(explain==="pred"?null:"pred");}} style={{ cursor: "pointer", marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center" }}>
            <div style={{ background: "rgba(255,255,255,.025)", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1, marginBottom: 4 }}>MODEL SAYS</div>
              <div style={{ fontFamily: F.m, fontSize: 24, fontWeight: 700, color: trustable ? $.gn : $.ac, transition: "color .3s" }}>{modelSays}%</div>
              <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim }}>stable</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: F.m, fontSize: 18, color: trustable ? $.gn : gap > 15 ? $.rd : $.ac, fontWeight: 700, transition: "color .3s" }}>{trustable ? "=" : "\u2260"}</div>
              <div style={{ fontFamily: F.m, fontSize: 7, color: trustable ? $.gn : $.rd, marginTop: 2 }}>{trustable ? "MATCH" : "GAP: " + gap}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,.025)", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1, marginBottom: 4 }}>REALITY</div>
              <div style={{ fontFamily: F.m, fontSize: 24, fontWeight: 700, color: reality > 80 ? $.gn : reality > 60 ? $.ac : $.rd, transition: "color .3s" }}>{reality}%</div>
              <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim }}>stable</div>
            </div>
          </div>
          {explain==="pred" && (
            <div style={{ marginTop: 8, padding: "10px 12px", background: "rgba(251,191,36,.04)", borderRadius: 8, animation: "wup .2s ease both" }}>
              <div style={{ fontSize: 11, color: $.tx2, lineHeight: 1.6 }}>Every time the model makes a prediction, it also says how confident it is. When the data is normal, that confidence is accurate. But when conditions change, something dangerous happens: the model stays confident while becoming wrong. It still says "90% safe" when the real answer is "60% safe." That gap between what the model believes and what is actually true is exactly what W.R.E.N. is built to detect</div>
            </div>
          )}
          <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, textAlign: "center", marginTop: 4 }}>{explain==="pred"?"Click to close":"Click to understand"}</div>
        </div>

        {/* Dynamic takeaway */}
        <div style={{ fontSize: 12, color: failColor, lineHeight: 1.5, marginBottom: 10, transition: "color .3s", fontWeight: t > 0.6 ? 600 : 400 }}>
          {takeaway}
        </div>

        {/* Intervention effect - what would recalibration do */}
        {t > 0.25 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14, animation: "wup .3s ease both" }}>
            <div style={{ flex: 1, background: "rgba(52,211,153,.04)", border: "1px solid " + $.gn + "22", borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ fontFamily: F.m, fontSize: 7, color: $.gn, letterSpacing: 1, marginBottom: 4 }}>IF RECALIBRATED NOW</div>
              <div style={{ display: "flex", gap: 12 }}>
                <div><span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>AUC </span><span style={{ fontFamily: F.m, fontSize: 11, color: m.aucC }}>{m.auc}</span><span style={{ fontSize: 10, color: $.dim }}> → </span><span style={{ fontFamily: F.m, fontSize: 11, color: $.gn, fontWeight: 700 }}>{afterAUC}</span></div>
                <div><span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>COV </span><span style={{ fontFamily: F.m, fontSize: 11, color: m.covC }}>{m.cov}%</span><span style={{ fontSize: 10, color: $.dim }}> → </span><span style={{ fontFamily: F.m, fontSize: 11, color: $.gn, fontWeight: 700 }}>{afterCov}%</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics - clickable */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { l: "AUC", v: m.auc, c: m.aucC, id: "auc", ex: "This is how accurate the model is. 1.0 means perfect, 0.5 means random guessing. It started at 0.9999 (nearly perfect). As you increase stress, watch it drop. Below 0.88, about 1 in 9 predictions are wrong" },
            { l: "PSI", v: m.psi, c: m.psiC, id: "psi", ex: "This measures how different the incoming data looks compared to what the model was trained on. Below 0.1 means normal. Above 0.25 means the world has changed enough that the model might not cope. The key insight: PSI rises before accuracy falls" },
            { l: "COV", v: m.cov + "%", c: m.covC, id: "cov", ex: "This is a safety guarantee. It means: at least 95% of predictions have a reliable confidence bound. When it drops below 95%, the guarantee is broken. At 83%, one in six predictions has no safety net at all" },
          ].map(function(met) {
            var open = explain === met.id;
            return (
              <div key={met.l} onClick={function(){setExplain(open?null:met.id);}} style={{ background: open ? "rgba(251,191,36,.04)" : "rgba(255,255,255,.025)", borderRadius: 8, padding: "10px", textAlign: "center", cursor: "pointer", transition: "background .2s", border: "1px solid " + (open ? $.glow + "33" : "transparent") }}>
                <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1, marginBottom: 3 }}>{met.l}</div>
                <div style={{ fontFamily: F.m, fontSize: 20, fontWeight: 700, color: met.c, transition: "color .3s" }}>{met.v}</div>
                {open && (
                  <div style={{ marginTop: 6, fontSize: 10, color: $.tx2, lineHeight: 1.5, textAlign: "left", animation: "wup .2s ease both" }}>{met.ex}</div>
                )}
                {!open && <div style={{ fontFamily: F.m, fontSize: 6, color: $.dim, marginTop: 3 }}>Click to learn</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══ APP ═══ */
/* ═══ OPERATIONS CENTRE (structured incidents + mini tasks) ═══ */
/* ═══ SCENARIO DATA ═══ */
const INCIDENTS = [
  {
    id: "drift",
    label: "SLOW CHANGE",
    batch: 55,
    color: $.ac,
    briefing: {
      title: "The world is changing but the AI does not know",
      body: "Think of a weather forecast built on last year's climate. The seasons are shifting, but the forecast still uses old patterns. It keeps predicting, and it still gets some things right, but it is slowly becoming less reliable. It does not know this is happening. That is what is about to happen to this grid's AI.",
      teaches: "This is called 'drift.' The AI was trained on old data. The real world has moved on. The AI has not."
    },
    taskCorruption: { sensorDriftSpeed: 2.5, noiseChance: 0.4, calFail: 0.35 },
    alerts: [
      { t: 2000, msg: "Incoming readings diverging from expected patterns", plain: "The numbers coming in are starting to look different from what the AI learned from" },
      { t: 4000, msg: "Data shift index crossing alert threshold", plain: "The difference between old data and new data is now big enough to trigger a warning" },
      { t: 6500, msg: "Model confidence drifting from actual accuracy", plain: "Here is the dangerous part: the AI still says it is 90% sure, but it is actually getting more things wrong. Its confidence no longer matches reality" },
    ],
    metrics: { auc: [0.98, 0.96, 0.94, 0.927], psi: [0.08, 0.15, 0.28, 0.35], cov: [0.96, 0.93, 0.90, 0.886] },
    options: [
      { label: "Reset the AI's confidence", desc: "Tell the AI to recalculate how sure it should be, using the new data it is actually seeing right now",
        why: "The AI's predictions are still okay. The problem is that it thinks it is more certain than it actually is. Resetting its confidence makes it honest again. It will say '70% sure' instead of '90% sure,' and that 70% will be real.",
        outcome: "good", consequence: "The AI becomes honest about what it knows and what it does not. Its safety guarantees start working again. Operators can trust the numbers on screen." },
      { label: "Do nothing and keep watching", desc: "No action. Wait and see if the problem fixes itself",
        why: "This feels safe, but every minute that passes makes the gap between what the AI believes and what is true wider. There is a window to fix this easily. That window is closing.",
        outcome: "bad", consequence: "Wrong call. But because A.G.N.E.S. caught the drift early, the damage is contained. The AI's confidence is unreliable, but the system flags every prediction it is not sure about. Operators know which readings to double check. Without A.G.N.E.S., this would have gone unnoticed until something broke." },
    ],
    research: "Measured result: Expected Calibration Error increased 279\u00d7 from baseline across 120 streaming batches (Chapter 4, Section 4.3). AUC degraded from 0.9999 to 0.8834 (Table 6).",
    lesson: "The AI kept saying 'I am 90% sure this grid is safe.' But it was wrong more and more often. The accuracy dropped a little. The confidence became a lie. That is the most dangerous kind of failure: a system that looks certain while quietly falling apart."
  },
  {
    id: "adversarial",
    label: "FAKE DATA ATTACK",
    batch: 65,
    color: $.rd,
    briefing: {
      title: "Someone is feeding the AI fake data",
      body: "Imagine a security camera system. Someone has figured out how to hold up a carefully crafted picture in front of the camera. The camera thinks it is seeing reality, but it is seeing a fake. That is what is happening here. Tiny, carefully designed changes in the sensor readings are tricking the AI into giving wrong answers.",
      teaches: "This is called an 'adversarial attack.' The key discovery: different types of AI are vulnerable in completely different ways. One type can be tricked easily. Another is almost immune."
    },
    taskCorruption: { sensorDriftSpeed: 1.5, noiseChance: 0.6, calFail: 0.5 },
    alerts: [
      { t: 2000, msg: "Suspicious pattern detected in generator feed", plain: "The readings from the generator look strange. They seem normal at first glance, but there is a hidden mathematical pattern that should not be there" },
      { t: 4000, msg: "Primary model flip rate rising above 6%", plain: "The main AI is starting to change its answers. Predictions that used to say 'safe' are now flipping to 'unsafe' for no real reason" },
      { t: 6000, msg: "Deliberate manipulation confirmed", plain: "This is not a glitch. Someone is deliberately feeding fake data into the system to make the AI give wrong answers" },
    ],
    metrics: { auc: [0.97, 0.94, 0.92, 0.916], psi: [0.12, 0.28, 0.45, 0.57], cov: [0.94, 0.91, 0.88, 0.865] },
    options: [
      { label: "Switch to the backup AI", desc: "Stop using the main AI and switch to a different type called Random Forest that works in a completely different way",
        why: "The attack works by finding a smooth surface in the AI's logic and pushing predictions along it, like sliding a ball down a hill. The backup AI does not have a smooth surface. It makes decisions using simple yes/no questions, like a flowchart. There is no hill to push the ball down. The attack simply does not work on it.",
        outcome: "good", consequence: "The backup AI is immune to this type of attack. The fake data has no effect. The attack fails completely and the grid goes back to normal." },
      { label: "Reset the AI's confidence", desc: "Recalibrate the main AI against the new data coming in",
        why: "Resetting confidence fixes a different problem. It fixes the gap between how sure the AI is and how right it is. But this attack is not about confidence. It is tricking the AI into giving the wrong actual answer. Resetting confidence does not help if the answers themselves are wrong.",
        outcome: "bad", consequence: "Wrong call. The attack continues and predictions are unreliable. But A.G.N.E.S. detected the attack pattern and is flagging every suspicious prediction. Operators can see which answers are likely corrupted instead of trusting them blindly. Without A.G.N.E.S., nobody would even know an attack was happening." },
    ],
    research: "Measured result: SVM flip rate 32.4% vs Random Forest 0.05% under FGSM at \u03b5=0.10, a ~650\u00d7 vulnerability difference (Chapter 4, Section 4.5, Table 5).",
    lesson: "Two different AIs looked at the exact same attack. One was tricked a third of the time. The other was tricked 0.05% of the time, basically never. Same attack, completely different result. The type of AI you choose is not just about accuracy. It is about security."
  },
  {
    id: "collapse",
    label: "TOTAL SYSTEM CHANGE",
    batch: 85,
    color: $.rd,
    briefing: {
      title: "Everything the AI learned is now wrong",
      body: "A major power source just went offline. The way people use electricity has changed overnight. Think of a GPS that was trained on city roads suddenly being used in the countryside. Every rule it learned, every pattern it memorised, no longer applies. The AI is still giving answers, but those answers are based on a world that no longer exists.",
      teaches: "This is called 'regime change.' Unlike slow drift, this is sudden. The AI's safety guarantees expire immediately because the data is completely outside what it was trained on."
    },
    taskCorruption: { sensorDriftSpeed: 4, noiseChance: 0.7, calFail: 0.65 },
    alerts: [
      { t: 1500, msg: "Page Hinkley detector triggered", plain: "The earliest warning system just fired. Something fundamental about the grid has changed" },
      { t: 3000, msg: "CUSUM threshold breached", plain: "A second, independent warning system confirms it. This is not a false alarm. The change is real and getting worse" },
      { t: 5000, msg: "All readings outside training range", plain: "Every single number the AI is seeing right now is outside anything it was trained on. It has never seen data like this before" },
      { t: 6500, msg: "Safety coverage at 83%", plain: "The AI can no longer guarantee that its safety checks are reliable. One in six predictions has no safety net at all" },
    ],
    metrics: { auc: [0.95, 0.91, 0.88, 0.877], psi: [0.25, 0.68, 1.2, 1.65], cov: [0.91, 0.86, 0.84, 0.83] },
    options: [
      { label: "Call a human operator", desc: "Hand control to a real person. Reduce power load on the weakest parts of the grid to create a safety margin",
        why: "When the AI has never seen anything like the current situation, its predictions are guesses. A human operator can use judgment, experience, and common sense that the AI does not have. Reducing load on weak points buys time to figure out what happened.",
        outcome: "good", consequence: "A human takes over while the AI is out of its depth. The power reduction creates a safety cushion. The grid stays running. No blackout." },
      { label: "Keep the AI running", desc: "Let the AI continue making decisions. Wait for more information before doing anything",
        why: "The AI is still producing answers. But those answers are based on a world that no longer exists. It is like following GPS directions in a city that has been completely rebuilt. The directions look confident. They are meaningless.",
        outcome: "bad", consequence: "Wrong call. The AI's predictions are meaningless in this new regime. But A.G.N.E.S. has already triggered all three warning systems and is showing exactly how far outside normal the grid has moved. The situation is serious, but visible. Without A.G.N.E.S., this would have looked like normal operation right up until the blackout." },
    ],
    research: "Measured result: Page Hinkley triggered at batch 9, CUSUM at batch 34, PSI at batch 55. Conformal coverage fell from 99.95% to 85.05% (Chapter 4, Sections 4.6\u20134.7, Tables 6\u20138).",
    lesson: "Three different warning systems spotted trouble at three different times. The earliest caught it 71 steps before the worst damage. The warnings were there the whole time. Everything came down to whether someone was listening and whether someone acted."
  },
];

/* ═══ MINI TASKS ═══ */

function SensorCalibration({ corruption, onComplete, onFail }) {
  const [pos, setPos] = useState(50);
  const [target] = useState(50);
  const [done, setDone] = useState(false);
  const speed = corruption?.sensorDriftSpeed || 1;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (done) return;
    intervalRef.current = setInterval(() => {
      setPos(p => {
        const drift = (Math.random() - 0.45) * speed * 3;
        return Math.max(5, Math.min(95, p + drift));
      });
    }, 80);
    return () => clearInterval(intervalRef.current);
  }, [done, speed]);

  const handleClick = () => {
    if (done) return;
    const dist = Math.abs(pos - target);
    if (dist < 15) { setDone(true); onComplete(); }
    else { onFail(); }
  };

  const dist = Math.abs(pos - target);
  const col = dist < 10 ? $.gn : dist < 20 ? $.ac : $.rd;

  return (
    <div style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${$.brd}`, borderRadius: 12, padding: "16px 20px", cursor: done ? "default" : "pointer" }} onClick={handleClick}>
      <div style={{ fontFamily: F.m, fontSize: 8, color: $.tx3, letterSpacing: 2, marginBottom: 8 }}>SENSOR CALIBRATION</div>
      <div style={{ fontSize: 11, color: $.tx2, marginBottom: 12, lineHeight: 1.6 }}>The needle is drifting. Tap when it hits the green zone</div>
      <div style={{ position: "relative", height: 32, background: "rgba(255,255,255,.03)", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "35%", width: "30%", height: "100%", background: "rgba(52,211,153,.1)", borderLeft: `1px solid ${$.gn}33`, borderRight: `1px solid ${$.gn}33` }} />
        <div style={{ position: "absolute", left: `${pos}%`, top: "50%", transform: "translate(-50%,-50%)", width: 12, height: 24, background: col, borderRadius: 3, transition: "left 0.08s linear, background 0.2s", boxShadow: `0 0 8px ${col}44` }} />
      </div>
      {done && <div style={{ fontFamily: F.m, fontSize: 9, color: $.gn, marginTop: 8, textAlign: "center" }}>CALIBRATED</div>}
    </div>
  );
}

function SignalFilter({ corruption, onComplete, onFail }) {
  const [signals, setSignals] = useState(() => {
    const nc = corruption?.noiseChance || 0.3;
    return Array.from({ length: 6 }, (_, i) => ({
      id: i, value: (Math.random() * 8 + 1).toFixed(2),
      corrupted: Math.random() < nc,
      flagged: false, missed: false,
    }));
  });
  const [done, setDone] = useState(false);

  const handleTap = (id) => {
    if (done) return;
    setSignals(prev => {
      const next = prev.map(s => s.id === id ? { ...s, flagged: !s.flagged } : s);
      return next;
    });
  };

  const handleSubmit = () => {
    const correct = signals.every(s => s.flagged === s.corrupted);
    const mostlyCorrect = signals.filter(s => s.flagged === s.corrupted).length >= 5;
    setDone(true);
    if (mostlyCorrect) onComplete(); else onFail();
  };

  return (
    <div style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${$.brd}`, borderRadius: 12, padding: "16px 20px" }}>
      <div style={{ fontFamily: F.m, fontSize: 8, color: $.tx3, letterSpacing: 2, marginBottom: 8 }}>SIGNAL FILTER</div>
      <div style={{ fontSize: 11, color: $.tx2, marginBottom: 12, lineHeight: 1.6 }}>Some numbers are glitching. Tap the ones that look wrong, then submit</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
        {signals.map(s => (
          <button key={s.id} onClick={() => handleTap(s.id)} disabled={done}
            style={{ padding: "8px 4px", borderRadius: 6, border: s.flagged ? `2px solid ${$.rd}` : `1px solid ${$.brd}`, background: s.flagged ? `${$.rd}11` : "rgba(255,255,255,.03)", cursor: done ? "default" : "pointer", fontFamily: F.m, fontSize: 12, color: s.corrupted && done ? $.rd : $.tx, transition: "all 0.15s",
              textDecoration: s.corrupted ? (done ? "" : "none") : "none",
              animation: s.corrupted && !done ? `flicker ${0.3 + Math.random() * 0.4}s ease infinite alternate` : "none" }}>
            {s.value}{s.corrupted && !done && <span style={{ opacity: Math.random() > 0.5 ? 0.6 : 0 }}>{String.fromCharCode(9608)}</span>}
          </button>
        ))}
      </div>
      {!done && <button onClick={handleSubmit} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "none", background: $.glow, color: $.bg, fontFamily: F.m, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>SUBMIT</button>}
      {done && <div style={{ fontFamily: F.m, fontSize: 9, color: $.gn, textAlign: "center" }}>FILTERED</div>}
    </div>
  );
}

function ConfidenceCheck({ corruption, onComplete, onFail }) {
  const failChance = corruption?.calFail || 0.3;
  const [prediction] = useState(() => {
    const conf = (0.82 + Math.random() * 0.16).toFixed(1);
    const isWrong = Math.random() < failChance;
    return { label: Math.random() > 0.5 ? "STABLE" : "UNSTABLE", confidence: conf, isWrong };
  });
  const [choice, setChoice] = useState(null);

  const handleChoice = (c) => {
    if (choice) return;
    setChoice(c);
    const correct = (c === "doubt" && prediction.isWrong) || (c === "trust" && !prediction.isWrong);
    if (correct) onComplete(); else onFail();
  };

  const correct = choice && ((choice === "doubt" && prediction.isWrong) || (choice === "trust" && !prediction.isWrong));

  return (
    <div style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${$.brd}`, borderRadius: 12, padding: "16px 20px" }}>
      <div style={{ fontFamily: F.m, fontSize: 8, color: $.tx3, letterSpacing: 2, marginBottom: 8 }}>CONFIDENCE CHECK</div>
      <div style={{ fontSize: 11, color: $.tx2, marginBottom: 12, lineHeight: 1.6 }}>The AI says it is {prediction.confidence}% sure about this one. Is it right, or is it bluffing?</div>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: F.m, fontSize: 22, fontWeight: 700, color: prediction.label === "STABLE" ? $.gn : $.rd }}>{prediction.label}</div>
        <div style={{ fontFamily: F.m, fontSize: 12, color: $.tx3 }}>{prediction.confidence}% confident</div>
      </div>
      {!choice ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={() => handleChoice("trust")} style={{ padding: 10, borderRadius: 6, border: `1px solid ${$.gn}44`, background: `${$.gn}08`, color: $.gn, fontFamily: F.m, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>TRUST</button>
          <button onClick={() => handleChoice("doubt")} style={{ padding: 10, borderRadius: 6, border: `1px solid ${$.rd}44`, background: `${$.rd}08`, color: $.rd, fontFamily: F.m, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>DOUBT</button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F.m, fontSize: 11, color: correct ? $.gn : $.rd, marginBottom: 4 }}>{correct ? "Good call." : "Wrong call."}</div>
          <div style={{ fontSize: 10, color: $.tx3, lineHeight: 1.6 }}>{prediction.isWrong ? "The AI was bluffing. It sounded sure, but it was wrong. High confidence does not always mean correct." : "The AI was telling the truth this time. Its confidence matched what actually happened."}</div>
        </div>
      )}
    </div>
  );
}

/* ═══ GRID TOPOLOGY ═══ */
function Grid({ stress }) {
  const s = stress || [0,0,0,0];
  const nodes = [
    { x: 160, y: 30, label: "GEN", sub: "Generator", role: "Produces power" },
    { x: 290, y: 140, label: "LOAD", sub: "Consumer", role: "Draws power" },
    { x: 160, y: 250, label: "DIST", sub: "Distribution", role: "Routes power" },
    { x: 30, y: 140, label: "STORE", sub: "Storage", role: "Buffers power" },
  ];
  const links = [[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]];
  const nc = i => s[i] === 2 ? $.rd : s[i] === 1 ? $.ac : $.gn;
  const lc = (a,b) => { const m = Math.max(s[a],s[b]); return m === 2 ? $.rd : m === 1 ? $.ac : "rgba(26,56,90,.3)"; };

  return (
    <svg viewBox="0 0 320 280" style={{ width: "100%", maxWidth: 260, height: "auto", display: "block", margin: "0 auto" }}>
      <style>{`@keyframes flowDash{0%{stroke-dashoffset:24}100%{stroke-dashoffset:0}}@keyframes pulse{0%,100%{opacity:.7}50%{opacity:1}}`}</style>
      {links.map(([a,b],i) => {
        const active = Math.max(s[a],s[b]) > 0;
        return <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={lc(a,b)} strokeWidth={active?1.5:0.6} strokeDasharray={active?"8,5":"none"} opacity={active?0.7:0.1} style={active?{animation:"flowDash 0.8s linear infinite"}:{}} />;
      })}
      {nodes.map((n,i) => (
        <g key={i}>
          {s[i]>0 && <circle cx={n.x} cy={n.y} r={s[i]===2?28:24} fill={nc(i)} opacity={s[i]===2?0.2:0.12} style={{animation:`pulse ${s[i]===2?0.7:1.3}s ease infinite`}} />}
          <circle cx={n.x} cy={n.y} r="18" fill={$.bg} stroke={nc(i)} strokeWidth={s[i]>0?2:0.8} opacity={s[i]>0?1:0.4} />
          <text x={n.x} y={n.y-1} textAnchor="middle" dominantBaseline="middle" fill={nc(i)} fontSize="8" fontFamily={F.m} fontWeight="700" letterSpacing="1">{n.label}</text>
          <text x={n.x} y={n.y+12} textAnchor="middle" fill={nc(i)} fontSize="6" fontFamily={F.m} opacity=".5">{n.role}</text>
        </g>
      ))}
    </svg>
  );
}

/* ═══ METRICS BAR ═══ */
function MetricChip({ label, abbr, value, color, explain }) {
  return (
    <div style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${color}22`, borderRadius: 8, padding: "8px 14px", flex: 1, minWidth: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <div style={{ fontFamily: F.m, fontSize: 7, color: $.tx3, letterSpacing: 1 }}>{label}</div>
        <div style={{ fontFamily: F.m, fontSize: 6, color: $.dim, opacity: 0.5 }}>{abbr}</div>
      </div>
      <div style={{ fontFamily: F.m, fontSize: 18, fontWeight: 700, color, transition: "color 0.3s" }}>{value}</div>
      <div style={{ fontSize: 8, color: $.tx3, marginTop: 2, lineHeight: 1.4 }}>{explain}</div>
    </div>
  );
}

/* ═══ MAIN COMPONENT ═══ */
function OpsCenter(props) {
  const [phase, setPhase] = useState("intro");
  const [incidentIdx, setIncidentIdx] = useState(0);
  const [tasksDone, setTasksDone] = useState(0);
  const [tasksFailed, setTasksFailed] = useState(0);
  const [taskTotal, setTaskTotal] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [metricStep, setMetricStep] = useState(0);
  const [stress, setStress] = useState([0,0,0,0]);
  const [chosen, setChosen] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [taskBarPct, setTaskBarPct] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [gridHealth, setGridHealth] = useState(100);
  const [optionOrder, setOptionOrder] = useState([0, 1]);
  const timers = useRef([]);
  const alertRef = useRef(null);
  const countdownRef = useRef(null);
  const tasksDoneRef = useRef(0);

  const incident = INCIDENTS[incidentIdx];

  const clr = () => { timers.current.forEach(clearTimeout); timers.current = []; if(countdownRef.current) clearInterval(countdownRef.current); };

  useEffect(() => { return () => clr(); }, []);
  useEffect(() => { if (alertRef.current) alertRef.current.scrollTop = alertRef.current.scrollHeight; }, [alerts]);

  const spawnTask = useCallback(() => {
    setCurrentTask(Math.floor(Math.random() * 3));
    setTaskTotal(prev => prev + 1);
  }, []);

  const onTaskComplete = useCallback(() => {
    setTasksDone(prev => { tasksDoneRef.current = prev + 1; return prev + 1; });
    setTaskBarPct(prev => Math.min(100, prev + 8));
    setGridHealth(prev => Math.min(100, prev + 2));
    setTimeout(() => spawnTask(), 600);
  }, [spawnTask]);

  const onTaskFail = useCallback(() => {
    setTasksFailed(prev => prev + 1);
    setTaskBarPct(prev => Math.max(0, prev - 3));
    setGridHealth(prev => Math.max(10, prev - 4));
  }, []);

  const startTasks = () => {
    setPhase("tasks");
    setAlerts([]);
    setMetricStep(0);
    setStress([0,0,0,0]);
    setChosen(null);
    setCountdown(null);
    setTasksDone(0);
    setTasksFailed(0);
    setTaskTotal(0);
    tasksDoneRef.current = 0;
    setOptionOrder(Math.random() > 0.5 ? [1, 0] : [0, 1]);
    spawnTask();

    const inc = incident;
    const t = [];

    // Schedule alerts and metric degradation — health drops with each alert
    inc.alerts.forEach((a, i) => {
      t.push(setTimeout(() => {
        setAlerts(prev => [...prev, a]);
        setMetricStep(i + 1);
        const stressPatterns = [[0,0,0,0],[1,0,0,0],[1,1,0,1],[2,1,1,1]];
        setStress(stressPatterns[Math.min(i + 1, 3)]);
        setGridHealth(prev => Math.max(10, prev - 2));
      }, a.t));
    });

    // Trigger crisis — flat 30 seconds
    t.push(setTimeout(() => {
      setPhase("crisis");
      setMetricStep(3);
      setStress(inc.id === "collapse" ? [2,2,1,1] : [2,1,1,0]);
      setGridHealth(prev => Math.max(10, prev - 3));
      setCountdown(30);
    }, inc.alerts[inc.alerts.length - 1].t + 2000));

    timers.current = t;
  };

  // Countdown timer
  useEffect(() => {
    if (phase !== "crisis" || chosen !== null || countdown === null) return;
    if (countdown <= 0) {
      // Time's up — pick the wrong answer (real index 1 is always bad)
      const badDisplayIdx = optionOrder.indexOf(1);
      handleDecision(badDisplayIdx);
      return;
    }
    countdownRef.current = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(countdownRef.current);
  }, [countdown, phase, chosen]);

  const handleDecision = (displayIdx) => {
    if (chosen !== null) return;
    clr();
    const realIdx = optionOrder[displayIdx];
    setChosen(realIdx);
    const opt = incident.options[realIdx];
    setDecisions(prev => [...prev, { label: opt.label, outcome: opt.outcome, consequence: opt.consequence, batch: incident.batch, incident: incident.label }]);
    if (opt.outcome === "good") {
      setStress([0,0,0,0]);
      setTaskBarPct(prev => Math.min(100, prev + 15));
      setGridHealth(prev => Math.min(100, prev + 8));
    } else {
      setStress([2,1,1,0]);
      setTaskBarPct(prev => Math.max(0, prev - 10));
      setGridHealth(prev => Math.max(30, prev - 10));
    }
  };

  const advance = () => {
    if (incidentIdx >= INCIDENTS.length - 1) {
      setPhase("debrief");
    } else {
      setIncidentIdx(prev => prev + 1);
      setPhase("briefing");
    }
  };

  const restart = () => {
    clr();
    setPhase("intro");
    setIncidentIdx(0);
    setDecisions([]);
    setTaskBarPct(0);
    setTasksDone(0);
    setTasksFailed(0);
    setTaskTotal(0);
    setGridHealth(100);
    tasksDoneRef.current = 0;
  };

  const ms = incident.metrics;
  const aucVal = ms.auc[Math.min(metricStep, ms.auc.length - 1)];
  const psiVal = ms.psi[Math.min(metricStep, ms.psi.length - 1)];
  const covVal = ms.cov[Math.min(metricStep, ms.cov.length - 1)];

  /* ═══ INTRO ═══ */
  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: $.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F.s, padding: 24 }}>
        <div style={{ width: 200, opacity: 0.15, marginBottom: 32 }}><Grid stress={[0,0,0,0]} /></div>
        <div style={{ fontFamily: F.m, fontSize: 9, color: $.glow, letterSpacing: 5, marginBottom: 20 }}>OPERATIONS CENTRE</div>
        <h1 style={{ fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 600, color: $.tx, textAlign: "center", lineHeight: 1.5, marginBottom: 16, maxWidth: 480 }}>
          You are the grid operator.<br />Three things are about to go wrong.
        </h1>
        <p style={{ fontSize: 13, color: $.tx3, textAlign: "center", lineHeight: 1.8, maxWidth: 420, marginBottom: 36 }}>
          Each incident comes with a briefing. Every decision is explained. You have 30 seconds to choose.
        </p>

        <button onClick={() => setPhase("briefing")} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 10, padding: "16px 52px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: F.s, marginBottom: 16 }}>Begin Watch</button>
        <button onClick={props.onBack} style={{ background: "transparent", border: "none", color: $.dim, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: F.m, letterSpacing: 1 }}>← Back</button>
      </div>
    );
  }

  /* ═══ BRIEFING ═══ */
  if (phase === "briefing") {
    return (
      <div style={{ minHeight: "100vh", background: $.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F.s, padding: 24 }}>
        <div style={{ fontFamily: F.m, fontSize: 9, color: incident.color, letterSpacing: 4, marginBottom: 8 }}>INCIDENT {incidentIdx + 1} OF 3</div>
        <div style={{ fontFamily: F.m, fontSize: 10, color: incident.color, letterSpacing: 2, marginBottom: 24, opacity: 0.6 }}>BATCH {incident.batch}</div>
        <h2 style={{ fontSize: "clamp(20px, 4vw, 30px)", fontWeight: 600, color: $.tx, textAlign: "center", lineHeight: 1.5, marginBottom: 16, maxWidth: 480 }}>{incident.briefing.title}</h2>
        <p style={{ fontSize: 14, color: $.tx2, textAlign: "center", lineHeight: 1.8, maxWidth: 440, marginBottom: 20 }}>{incident.briefing.body}</p>
        <div style={{ background: `${incident.color}08`, border: `1px solid ${incident.color}22`, borderRadius: 10, padding: "16px 20px", maxWidth: 440, marginBottom: 16 }}>
          <div style={{ fontFamily: F.m, fontSize: 8, color: incident.color, letterSpacing: 1, marginBottom: 6 }}>WHAT THIS TEACHES YOU</div>
          <div style={{ fontSize: 13, color: $.tx2, lineHeight: 1.7, textAlign: "center" }}>{incident.briefing.teaches}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,.03)", borderRadius: 8, padding: "10px 16px", maxWidth: 440, marginBottom: 28 }}>
          <div style={{ fontFamily: F.m, fontSize: 8, color: $.dim, letterSpacing: 1, marginBottom: 4 }}>WHAT TO WATCH FOR</div>
          <div style={{ fontSize: 11, color: $.tx3, lineHeight: 1.6, textAlign: "center" }}>
            {incident.id === "drift" && "Watch the Accuracy number at the top. It will start high. The scary part: the Data Shift number will rise first, before Accuracy falls. The AI is getting worse but does not realise it yet."}
            {incident.id === "adversarial" && "Watch the Data Shift number jump suddenly. The AI is being tricked with fake data, but only one of the two options can actually stop it. The explanations on each option will tell you which one and why."}
            {incident.id === "collapse" && "Watch the Safety number. When it drops below 95%, the AI can no longer promise its answers are reliable. That is when a human needs to take over."}
          </div>
        </div>
        <div style={{ fontSize: 11, color: $.tx3, textAlign: "center", marginBottom: 20 }}>
          Grid health: <span style={{ fontFamily: F.m, fontWeight: 700, color: gridHealth > 75 ? $.gn : gridHealth > 50 ? $.ac : $.rd }}>{gridHealth}</span>
          <span style={{ color: $.dim }}> | </span>
          Complete tasks to earn more decision time
        </div>
        <button onClick={startTasks} style={{ background: incident.color, color: $.bg, border: "none", borderRadius: 10, padding: "14px 44px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Start Monitoring</button>
      </div>
    );
  }

  /* ═══ DEBRIEF ═══ */
  if (phase === "debrief") {
    const correct = decisions.filter(d => d.outcome === "good").length;

    const withoutTimeline = [
      { batch: INCIDENTS[0].batch, event: INCIDENTS[0].label,
        result: "No warning system was watching. The AI kept saying it was confident while slowly getting things wrong. Nobody knew until it was too late to fix easily",
        health: 72 },
      { batch: INCIDENTS[1].batch, event: INCIDENTS[1].label,
        result: "Fake data was fed into the system. Without monitoring, nobody noticed. The AI gave wrong answers a third of the time. Every grid decision based on those answers was unreliable",
        health: 48 },
      { batch: INCIDENTS[2].batch, event: INCIDENTS[2].label,
        result: "The grid changed completely. The AI kept running on rules from a world that no longer existed. No warning. No human called. The grid failed",
        health: 23 },
    ];

    const withTimeline = decisions.map((d, i) => ({
      batch: d.batch,
      event: d.incident,
      action: d.label,
      result: d.consequence,
      health: Math.max(10, Math.round(gridHealth + (2 - i) * (d.outcome === "good" ? 3 : -5))),
      good: d.outcome === "good",
    }));

    const finalWithout = 23;
    const finalWith = gridHealth;
    const gap = finalWith - finalWithout;

    return (
      <div style={{ minHeight: "100vh", background: $.bg, fontFamily: F.s, overflowY: "auto" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: F.m, fontSize: 9, color: $.glow, letterSpacing: 4, marginBottom: 16 }}>DEBRIEF</div>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 600, color: $.tx, lineHeight: 1.5, marginBottom: 12 }}>
              Two timelines. Same incidents.
            </h2>
            <p style={{ fontSize: 13, color: $.tx3, lineHeight: 1.7 }}>
              The only difference is whether A.G.N.E.S. was watching
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: F.m, fontSize: 36, fontWeight: 700, color: correct === 3 ? $.gn : correct >= 2 ? $.ac : $.rd }}>{correct}/3</div>
                <div style={{ fontSize: 10, color: $.tx3 }}>correct decisions</div>
              </div>
              <div>
                <div style={{ fontFamily: F.m, fontSize: 36, fontWeight: 700, color: $.glow }}>{tasksDone}</div>
                <div style={{ fontSize: 10, color: $.tx3 }}>tasks completed</div>
              </div>
              <div>
                <div style={{ fontFamily: F.m, fontSize: 36, fontWeight: 700, color: gridHealth > 75 ? $.gn : gridHealth > 50 ? $.ac : $.rd }}>{gridHealth}</div>
                <div style={{ fontSize: 10, color: $.tx3 }}>grid health</div>
              </div>
            </div>
            {/* Operator rating */}
            <div style={{ display: "inline-block", background: correct === 3 && tasksDone >= 6 ? `${$.gn}12` : correct >= 2 ? `${$.ac}12` : `${$.rd}12`, border: `1px solid ${correct === 3 && tasksDone >= 6 ? $.gn : correct >= 2 ? $.ac : $.rd}33`, borderRadius: 8, padding: "8px 20px" }}>
              <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1, marginBottom: 4 }}>OPERATOR RATING</div>
              <div style={{ fontFamily: F.m, fontSize: 14, fontWeight: 700, color: correct === 3 && tasksDone >= 6 ? $.gn : correct >= 2 ? $.ac : $.ac }}>
                {correct === 3 && tasksDone >= 6 ? "EXEMPLARY" : correct === 3 ? "EXCELLENT" : correct >= 2 ? "COMPETENT" : correct === 1 ? "LEARNING" : "ROUGH SHIFT"}
              </div>
            </div>
          </div>

          {/* Side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 40 }}>

            {/* WITHOUT */}
            <div style={{ background: "rgba(248,113,113,.03)", border: "1px solid rgba(248,113,113,.15)", borderRadius: 14, padding: "20px 18px" }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.rd, letterSpacing: 2, marginBottom: 16, textAlign: "center" }}>WITHOUT ANY MONITORING</div>
              {withoutTimeline.map((t, i) => (
                <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < 2 ? "1px solid rgba(248,113,113,.08)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontFamily: F.m, fontSize: 8, color: $.rd, opacity: 0.6 }}>BATCH {t.batch}</span>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: $.rd, fontWeight: 700 }}>{t.health}%</span>
                  </div>
                  <div style={{ fontFamily: F.m, fontSize: 8, color: $.rd, marginBottom: 4, opacity: 0.7 }}>{t.event}</div>
                  <div style={{ fontSize: 11, color: $.tx3, lineHeight: 1.6 }}>{t.result}</div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 8, padding: "12px", background: "rgba(248,113,113,.06)", borderRadius: 8 }}>
                <div style={{ fontFamily: F.m, fontSize: 8, color: $.rd, letterSpacing: 1, marginBottom: 4 }}>FINAL GRID HEALTH</div>
                <div style={{ fontFamily: F.m, fontSize: 32, fontWeight: 700, color: $.rd }}>{finalWithout}%</div>
                <div style={{ fontSize: 10, color: $.rd, opacity: 0.6, marginTop: 2 }}>No warnings. No visibility. No chance.</div>
              </div>
            </div>

            {/* WITH A.G.N.E.S. */}
            <div style={{ background: "rgba(52,211,153,.03)", border: "1px solid rgba(52,211,153,.15)", borderRadius: 14, padding: "20px 18px" }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.gn, letterSpacing: 2, marginBottom: 16, textAlign: "center" }}>A.G.N.E.S. PROTOCOL</div>
              {withTimeline.map((t, i) => (
                <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < 2 ? "1px solid rgba(52,211,153,.08)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: F.m, fontSize: 8, color: t.good ? $.gn : $.rd, opacity: 0.6 }}>BATCH {t.batch}</span>
                      <span style={{ fontSize: 9, color: t.good ? $.gn : $.rd }}>{t.good ? "\u2713" : "\u2717"}</span>
                    </div>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: t.good ? $.gn : $.ac, fontWeight: 700 }}>{t.health}%</span>
                  </div>
                  <div style={{ fontFamily: F.m, fontSize: 9, color: $.glow, marginBottom: 4 }}>{t.action}</div>
                  <div style={{ fontSize: 11, color: $.tx3, lineHeight: 1.6 }}>{t.result}</div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 8, padding: "12px", background: correct >= 2 ? "rgba(52,211,153,.06)" : "rgba(251,191,36,.06)", borderRadius: 8 }}>
                <div style={{ fontFamily: F.m, fontSize: 8, color: correct >= 2 ? $.gn : $.ac, letterSpacing: 1, marginBottom: 4 }}>FINAL GRID HEALTH</div>
                <div style={{ fontFamily: F.m, fontSize: 32, fontWeight: 700, color: correct >= 2 ? $.gn : $.ac }}>{finalWith}%</div>
                <div style={{ fontSize: 10, color: correct >= 2 ? $.gn : $.ac, opacity: 0.6, marginTop: 2 }}>
                  {correct === 3 ? "Every warning acted on" : correct >= 2 ? "Mostly right. Monitoring made the difference" : correct === 1 ? "One right call. A.G.N.E.S. caught the rest" : "Every call wrong. A.G.N.E.S. still prevented collapse"}
                </div>
              </div>
            </div>
          </div>

          {/* The gap */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: F.m, fontSize: 11, color: $.dim, marginBottom: 8 }}>The difference A.G.N.E.S. made</div>
            <div style={{ fontFamily: F.m, fontSize: 48, fontWeight: 700, color: $.glow, lineHeight: 1 }}>+{gap}%</div>
            <div style={{ fontSize: 13, color: $.tx3, lineHeight: 1.7, maxWidth: 420, margin: "16px auto 0" }}>
              {correct === 3
                ? "Every warning was read. Every decision was right. The grid survived because the operator had the right information at the right time"
                : correct >= 2
                  ? "Even with one wrong call, having a monitoring system meant the operator could see what was happening and respond. Without it, there was nothing to act on at all"
                  : "The monitoring system gave the warnings. The information was there on screen. The difference is always whether someone reads it and acts on it"}
            </div>
          </div>

          {/* Bottom line */}
          <div style={{ background: `${$.glow}08`, border: `1px solid ${$.glow}22`, borderRadius: 12, padding: "20px 22px", textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 15, color: $.tx, lineHeight: 1.8 }}>
              {correct === 3
                ? "The AI was challenged in both timelines. In one, nobody knew. In the other, every warning was acted on and the grid held."
                : "The AI was challenged in both timelines. The only difference is whether anyone could see it happening."}
            </div>
            <div style={{ fontSize: 12, color: $.tx3, lineHeight: 1.6, marginTop: 10 }}>
              {correct === 3
                ? "That is what this project is about. Not building a perfect AI. Building the system that keeps an imperfect one honest."
                : "That is what this project is about. Not building a better AI. Building the system that tells you when to stop trusting it."}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={props.onBack} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "14px 24px", fontSize: 14, color: $.tx3, cursor: "pointer" }}>Back to W.R.E.N.</button>
            <button onClick={restart} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ TASKS + CRISIS + DECISION ═══ */
  const isCrisis = phase === "crisis";
  const isResolved = chosen !== null;
  const opt = chosen !== null ? incident.options[chosen] : null;

  const TaskComponent = [SensorCalibration, SignalFilter, ConfidenceCheck][currentTask];

  return (
    <div style={{ minHeight: "100vh", background: $.bg, fontFamily: F.s, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`@keyframes flicker{0%{opacity:1}100%{opacity:.4}}@keyframes pulseBorder{0%,100%{border-color:${incident.color}33}50%{border-color:${incident.color}}}`}</style>

      {/* Top bar */}
      <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${$.brd}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isCrisis ? $.rd : $.gn, boxShadow: `0 0 8px ${isCrisis ? $.rd : $.gn}` }} />
          <span style={{ fontFamily: F.m, fontSize: 10, color: isCrisis ? $.rd : $.glow, fontWeight: 700 }}>{isCrisis ? "ACTION REQUIRED" : "MONITORING"}</span>
          <span style={{ fontFamily: F.m, fontSize: 9, color: incident.color, opacity: 0.6 }}>{incident.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Grid Health */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1 }}>GRID</span>
            <span style={{ fontFamily: F.m, fontSize: 16, fontWeight: 700, color: gridHealth > 75 ? $.gn : gridHealth > 50 ? $.ac : $.rd, transition: "color 0.3s" }}>{gridHealth}</span>
            <div style={{ width: 40, height: 3, background: "rgba(255,255,255,.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: gridHealth + "%", height: "100%", background: gridHealth > 75 ? $.gn : gridHealth > 50 ? $.ac : $.rd, borderRadius: 2, transition: "width 0.5s, background 0.3s" }} />
            </div>
          </div>
          {/* Task score */}
          <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>
            <span style={{ color: $.gn }}>{tasksDone}</span>
            {tasksFailed > 0 && <span style={{ color: $.rd, marginLeft: 4 }}>/{tasksFailed}</span>}
          </div>
          {/* Progress pips */}
          <div style={{ display: "flex", gap: 4 }}>
            {INCIDENTS.map((_, i) => <div key={i} style={{ width: 24, height: 3, borderRadius: 2, background: i < incidentIdx ? $.gn : i === incidentIdx ? incident.color : $.brd }} />)}
          </div>
          {/* Exit */}
          <button onClick={props.onBack} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.08)", borderRadius: 5, color: $.dim, padding: "4px 10px", fontSize: 9, fontFamily: F.m, letterSpacing: 1, cursor: "pointer" }}>EXIT</button>
        </div>
      </div>

      {/* Task progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,.04)" }}>
        <div style={{ height: "100%", width: `${taskBarPct}%`, background: $.glow, transition: "width 0.5s ease", borderRadius: "0 2px 2px 0" }} />
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "12px 20px", gap: 12, overflowY: "auto" }}>

        {/* Situation bar */}
        <div style={{ background: `${isCrisis ? $.rd : incident.color}08`, borderRadius: 8, padding: "8px 14px", border: `1px solid ${isCrisis ? $.rd : incident.color}22` }}>
          <div style={{ fontSize: 12, color: isCrisis ? $.rd : $.tx2, lineHeight: 1.5 }}>
            {!isCrisis && !isResolved && metricStep === 0 && "Everything looks good so far. While you wait, try the task on the right. It is the kind of work that keeps a grid running."}
            {!isCrisis && !isResolved && metricStep === 1 && "The numbers are starting to shift. Something might be changing out there. Keep going with your tasks."}
            {!isCrisis && !isResolved && metricStep === 2 && "This is getting worse. The model is starting to lose touch with what is actually happening on the grid."}
            {!isCrisis && !isResolved && metricStep >= 3 && "Multiple warnings now. A decision is coming. Get ready."}
            {isCrisis && !isResolved && "A.G.N.E.S. has spotted a problem. Read both options carefully. The explanation under each one will help you decide."}
            {isResolved && opt && opt.outcome === "good" && "Nice work. That was the right call. The grid is recovering."}
            {isResolved && opt && opt.outcome !== "good" && "That was not the right call. But A.G.N.E.S. caught the problem and limited the damage. Read below to see what happened."}
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "flex", gap: 8 }}>
          <MetricChip label="ACCURACY" abbr="AUC" value={aucVal.toFixed(3)} color={aucVal > 0.95 ? $.gn : aucVal > 0.92 ? $.ac : $.rd} explain={aucVal > 0.95 ? "Getting it right" : aucVal > 0.92 ? "Starting to slip" : "Getting things wrong"} />
          <MetricChip label="DATA SHIFT" abbr="PSI" value={psiVal.toFixed(2)} color={psiVal < 0.1 ? $.gn : psiVal < 0.25 ? $.ac : $.rd} explain={psiVal < 0.1 ? "Data looks normal" : psiVal < 0.25 ? "Data is changing" : "Data has changed a lot"} />
          <MetricChip label="SAFETY" abbr="COV" value={`${(covVal * 100).toFixed(0)}%`} color={covVal > 0.95 ? $.gn : covVal > 0.90 ? $.ac : $.rd} explain={covVal > 0.95 ? "Safety checks holding" : covVal > 0.90 ? "Safety weakening" : "Safety checks failing"} />
        </div>

        {/* Grid + Task side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, alignItems: "start" }}>
          <div>
            <Grid stress={stress} />
          </div>
          <div>
            {!isCrisis && !isResolved && (
              <div>
                <div style={{ fontSize: 10, color: $.dim, marginBottom: 6, lineHeight: 1.5 }}>
                  {currentTask === 0 && "This sensor needle is wobbling. Tap the button when it drifts into the green zone to lock it in."}
                  {currentTask === 1 && "Some of these numbers are glitching. They flicker and look wrong. Tap the ones that look broken, then hit submit."}
                  {currentTask === 2 && "The AI just made a call. Look at how confident it says it is. Does that feel right to you, or is it bluffing?"}
                </div>
                <TaskComponent key={`${incidentIdx}-${taskTotal}`} corruption={incident.taskCorruption} onComplete={onTaskComplete} onFail={onTaskFail} />
              </div>
            )}
            {isCrisis && !isResolved && countdown !== null && (
              <div style={{ background: `${$.rd}08`, border: `1px solid ${$.rd}33`, borderRadius: 12, padding: 20, textAlign: "center", animation: "pulseBorder 1.5s ease infinite" }}>
                <div style={{ fontFamily: F.m, fontSize: 42, fontWeight: 700, color: countdown <= 5 ? $.rd : countdown <= 10 ? $.ac : $.glow }}>{countdown}</div>
                <div style={{ fontFamily: F.m, fontSize: 9, color: $.tx3, letterSpacing: 2, marginTop: 4 }}>SECONDS TO DECIDE</div>
                <div style={{ fontSize: 9, color: $.dim, marginTop: 6 }}>Take your time. Read both options carefully.</div>
              </div>
            )}
            {isResolved && (
              <div style={{ background: `${opt.outcome === "good" ? $.gn : $.ac}08`, border: `1px solid ${opt.outcome === "good" ? $.gn : $.ac}33`, borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{opt.outcome === "good" ? "\u2713" : "\u26A0"}</div>
                <div style={{ fontFamily: F.m, fontSize: 12, color: opt.outcome === "good" ? $.gn : $.ac, fontWeight: 600, marginBottom: 6 }}>{opt.outcome === "good" ? "Grid stabilised" : "Damage limited"}</div>
                <div style={{ fontSize: 10, color: $.tx3 }}>{opt.outcome === "good" ? "Health: " + gridHealth : "A.G.N.E.S. prevented collapse. Health: " + gridHealth}</div>
              </div>
            )}
          </div>
        </div>

        {/* Alert feed */}
        <div ref={alertRef} style={{ background: "rgba(255,255,255,.03)", borderRadius: 10, padding: "12px 16px", maxHeight: 120, overflowY: "auto", border: `1px solid ${$.brd}` }}>
          {alerts.length === 0 && <div style={{ fontFamily: F.m, fontSize: 10, color: $.dim }}>A.G.N.E.S. scanning sensor feeds...</div>}
          {alerts.map((a, i) => (
            <div key={i} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: i < alerts.length - 1 ? `1px solid ${$.brd}` : "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 2 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: i === alerts.length - 1 ? $.rd : $.ac, flexShrink: 0, marginTop: 4 }} />
                <div style={{ fontSize: 11, color: $.tx2, lineHeight: 1.5 }}>{a.plain}</div>
              </div>
              <div style={{ fontFamily: F.m, fontSize: 8, color: $.dim, paddingLeft: 11, lineHeight: 1.4 }}>{a.msg}</div>
            </div>
          ))}
        </div>

        {/* Decision cards */}
        {isCrisis && !isResolved && (
          <div>
            <div style={{ fontFamily: F.m, fontSize: 9, color: $.rd, letterSpacing: 2, marginBottom: 6, textAlign: "center" }}>YOUR CALL, OPERATOR</div>
            <div style={{ fontSize: 12, color: $.tx3, textAlign: "center", marginBottom: 14, lineHeight: 1.5 }}>You have 30 seconds. Read what each option does, then pick the one you think is right.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
              {optionOrder.map((realIdx, displayIdx) => {
                const o = incident.options[realIdx];
                return (
                <button key={displayIdx} onClick={() => handleDecision(displayIdx)}
                  style={{ width: "100%", textAlign: "left", background: "rgba(255,255,255,.03)", border: `1px solid ${incident.color}33`, borderRadius: 14, padding: "18px 16px", cursor: "pointer", fontFamily: F.s, transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = incident.color; e.currentTarget.style.background = `${incident.color}0a`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${incident.color}33`; e.currentTarget.style.background = "rgba(255,255,255,.03)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: $.tx, marginBottom: 6 }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: $.tx3, lineHeight: 1.6, marginBottom: 12 }}>{o.desc}</div>
                  <div style={{ background: `${$.glow}08`, border: `1px solid ${$.glow}15`, borderRadius: 8, padding: "12px 14px", flex: 1 }}>
                    <div style={{ fontFamily: F.m, fontSize: 8, color: $.glow, letterSpacing: 1, marginBottom: 6 }}>WHAT DOES THIS ACTUALLY DO?</div>
                    <div style={{ fontSize: 12, color: $.tx2, lineHeight: 1.7 }}>{o.why}</div>
                  </div>
                </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Consequence + lesson */}
        {isResolved && (
          <div>
            {/* What happened */}
            <div style={{ background: `${opt.outcome === "good" ? $.gn : $.rd}06`, border: `1px solid ${opt.outcome === "good" ? $.gn : $.rd}22`, borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontFamily: F.m, fontSize: 8, color: opt.outcome === "good" ? $.gn : $.rd, letterSpacing: 1, marginBottom: 8 }}>WHAT HAPPENED</div>
              <div style={{ fontSize: 13, color: $.tx, lineHeight: 1.7, marginBottom: 0 }}>{opt.consequence}</div>
            </div>
            {/* The lesson */}
            <div style={{ background: `${$.glow}06`, border: `1px solid ${$.glow}18`, borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontFamily: F.m, fontSize: 8, color: $.glow, letterSpacing: 1, marginBottom: 8 }}>WHY THIS MATTERS</div>
              <div style={{ fontSize: 13, color: $.tx2, lineHeight: 1.8, marginBottom: incident.research ? 10 : 0 }}>{incident.lesson}</div>
              {incident.research && (
                <div style={{ borderTop: `1px solid ${$.glow}15`, paddingTop: 8 }}>
                  <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1, marginBottom: 4 }}>FROM THE RESEARCH</div>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: $.tx3, lineHeight: 1.6 }}>{incident.research}</div>
                </div>
              )}
            </div>
            <button onClick={advance} style={{ width: "100%", background: $.glow, color: $.bg, border: "none", borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {incidentIdx >= INCIDENTS.length - 1 ? "See the debrief" : "Next incident"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default function App() {
  useStyles();
  var _p = useState("landing"); var page = _p[0]; var rawSetPage = _p[1];
  var _s = useState(0); var scrollY = _s[0]; var setScrollY = _s[1];
  var _loading = useState(true); var loading = _loading[0]; var setLoading = _loading[1];
  var _fade = useState("visible"); var fade = _fade[0]; var setFade = _fade[1];
  var _showIntro = useState(!_coldOpenDismissed); var showIntro = _showIntro[0]; var setShowIntro = _showIntro[1];

  useEffect(function() {
    var t = setTimeout(function() { setLoading(false); }, 1200);
    return function() { clearTimeout(t); };
  }, []);

  function setPage(p) {
    setFade("clear");
    setTimeout(function() { setFade("beacon"); }, 500);
    setTimeout(function() { setFade("sweep"); }, 1000);
    setTimeout(function() { setFade("flash"); }, 4000);
    setTimeout(function() {
      rawSetPage(p);
      window.scrollTo(0, 0);
      setFade("reveal");
    }, 4800);
    setTimeout(function() { setFade("visible"); }, 5200);
  }

  useEffect(function() { var h = function() { setScrollY(window.scrollY); }; window.addEventListener("scroll", h, { passive: true }); return function() { window.removeEventListener("scroll", h); }; }, []);

  // Loading screen
  if (loading) return (
    <div style={{ background: $.bg, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F.s }}>
      <div style={{ marginBottom: 24, animation: "wpulse 1.5s ease-in-out infinite" }}>
        <Beacon s={48} glow={0.7} />
      </div>
      <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 4, color: $.glow, opacity: 0.6, marginBottom: 8 }}>W.R.E.N.</div>
      <div style={{ fontSize: 11, color: $.dim }}>Initialising deployment monitor</div>
      <div style={{ width: 120, height: 2, background: "rgba(255,255,255,.04)", borderRadius: 1, marginTop: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", background: $.glow, borderRadius: 1, animation: "wLoad 1.2s ease-in-out forwards" }} />
      </div>
    </div>
  );

  var pageContent;

  if (page === "command") pageContent = <CommandCentre onBack={function() { setPage("landing"); }} initialTab="sim" />;
  else if (page === "story") pageContent = <CommandCentre onBack={function() { setPage("landing"); }} initialTab="pipe" />;
  else if (page === "ops") pageContent = <OpsCenter onBack={function() { setPage("landing"); }} />;
  else {

  var go = function(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  pageContent = (
    <div style={{ background: $.bg, color: $.tx, fontFamily: F.s, overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px clamp(16px, 4vw, 36px)", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrollY > 60 ? "rgba(10,14,26,.92)" : "transparent", backdropFilter: scrollY > 60 ? "blur(20px)" : "none", borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,.04)" : "1px solid transparent", transition: "all .5s ease" }}>
        <div onClick={function() { go("hero"); }} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <BeaconSmall s={16} />
          <span style={{ fontSize: 13, letterSpacing: 3, color: $.glow, fontWeight: 700, fontFamily: F.m }}>W.R.E.N.</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span onClick={function() { setPage("command"); }} style={{ fontSize: 11, color: $.dim, cursor: "pointer", letterSpacing: 0.5, transition: "color .3s, opacity .3s", opacity: 0.7 }} onMouseEnter={function(e) { e.target.style.color = $.tx; e.target.style.opacity = "1"; }} onMouseLeave={function(e) { e.target.style.color = $.dim; e.target.style.opacity = "0.7"; }}>Dashboard</span>
          <button onClick={function() { setPage("ops"); }} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Ops Centre</button>
        </div>
      </nav>

      <HeroSection go={go} setPage={setPage} />

      {/* ═══ FULL DEMO ═══ */}
      <section id="demo" style={{ padding: "80px 24px 80px", background: $.bg2 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Rv><div style={{ fontFamily: F.m, fontSize: 10, color: $.rd, letterSpacing: 3, marginBottom: 12 }}>THE PROBLEM</div></Rv>
          <Rv d={0.05}><h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, fontFamily: F.s, marginBottom: 16 }}>Why "accurate" AI fails in the real world</h2></Rv>
          <Rv d={0.08}><p style={{ fontSize: 14, color: $.tx3, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>Five moments that break a model. From a clean lab score of 99.99% to silent failure in deployment.</p></Rv>
        </div>
        <Rv d={0.16}><div style={{ maxWidth: 900, margin: "0 auto" }}><SignatureDemo /></div></Rv>
      </section>

      {/* ═══ EXPLORE ═══ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Rv><div style={{ fontFamily: F.m, fontSize: 10, color: $.glow, letterSpacing: 3, marginBottom: 12 }}>THE SOLUTION</div></Rv>
            <Rv d={0.05}><h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, fontFamily: F.s }}>Three ways to see how we solved it</h2></Rv>
          </div>
          <Rv d={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            <div onClick={function() { setPage("story"); }}
              style={{ background: $.bg2, borderRadius: 14, padding: "32px 24px", cursor: "pointer", transition: "all .25s", border: "1px solid " + $.glow + "22" }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,.1)"; e.currentTarget.style.borderColor = $.glow + "55"; }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = $.glow + "22"; }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.glow, letterSpacing: 1.5, marginBottom: 12 }}>Watch</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: $.tx, marginBottom: 10 }}>The Story</div>
              <p style={{ fontSize: 13, color: $.tx3, lineHeight: 1.75, marginBottom: 20 }}>Seven steps, no jargon. See how we built defences against every failure above.</p>
              <span style={{ fontFamily: F.m, fontSize: 11, color: $.glow, fontWeight: 600 }}>Watch →</span>
            </div>
            <div onClick={function() { setPage("ops"); }}
              style={{ background: $.bg2, borderRadius: 14, padding: "32px 24px", cursor: "pointer", transition: "all .25s" }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,.06)"; }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: 1.5, marginBottom: 12 }}>Try</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: $.tx, marginBottom: 10 }}>Operations Centre</div>
              <p style={{ fontSize: 13, color: $.tx3, lineHeight: 1.75, marginBottom: 20 }}>Take the operator's seat. Three incidents. Thirty seconds to decide. Full debrief.</p>
              <span style={{ fontFamily: F.m, fontSize: 11, color: $.glow, fontWeight: 600 }}>Enter →</span>
            </div>
            <div onClick={function() { setPage("command"); }}
              style={{ background: $.bg2, borderRadius: 14, padding: "32px 24px", cursor: "pointer", transition: "all .25s" }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,.06)"; }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: 1.5, marginBottom: 12 }}>Verify</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: $.tx, marginBottom: 10 }}>Dashboard</div>
              <p style={{ fontSize: 13, color: $.tx3, lineHeight: 1.75, marginBottom: 20 }}>120 batches of live monitoring. Every chart explained. Every finding backed by data.</p>
              <span style={{ fontFamily: F.m, fontSize: 11, color: $.glow, fontWeight: 600 }}>Open →</span>
            </div>
          </div>
          </Rv>
        </div>
      </section>

      {/* ═══ HONOUR ═══ */}
      <section id="honour" style={{ padding: "60px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <Rv><div style={{ width: 24, height: 1, background: $.glow, margin: "0 auto 28px", opacity: 0.15 }} /></Rv>
          <Rv d={0.1}><p style={{ fontSize: 15, fontStyle: "italic", lineHeight: 2, color: $.tx3, marginBottom: 16 }}>Named for the Women's Royal Naval Service, who served at HMS Vernon, Portsmouth, 1939–1945.</p></Rv>
          <Rv d={0.2}><p style={{ fontSize: 13, lineHeight: 1.9, color: $.dim }}>They sat in signals rooms, detecting anomalies in the noise and warning of danger before it arrived.</p></Rv>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderTop: "1px solid rgba(255,255,255,.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BeaconSmall s={12} />
          <span style={{ fontSize: 9, letterSpacing: 2, color: $.dim, fontFamily: F.m }}>W.R.E.N.</span>
        </div>
        <div style={{ fontSize: 9, color: $.dim }}>University of Portsmouth | 2025–2026</div>
        <div style={{ fontSize: 9, color: $.dim, opacity: 0.5 }}>Powered by A.G.N.E.S. v4.2</div>
      </footer>
    </div>
  );
  }

  var transitioning = fade !== "visible";

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Cold open — shown once per session, before anything else */}
      {showIntro && <ColdOpen onDone={function(){ setShowIntro(false); }}/>}

      {/* Page content */}
      <div style={{
        opacity: fade === "clear" || fade === "beacon" || fade === "flash" ? 0 : 1,
        transition: fade === "clear" ? "opacity 0.4s ease-out" : fade === "reveal" ? "opacity 0.3s ease-in" : "none",
        pointerEvents: transitioning ? "none" : "auto",
      }}>
        {pageContent}
      </div>

      {/* Transition overlay */}
      {transitioning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: $.bg,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          opacity: fade === "clear" ? 0 : fade === "reveal" ? 0 : 1,
          transition: fade === "reveal" ? "opacity 0.35s ease-out" : "opacity 0.4s ease-in",
        }}>
          {/* Beacon + sweep */}
          <div style={{ position: "relative" }}>
            <div style={{
              opacity: (fade === "beacon" || fade === "sweep" || fade === "flash") ? 1 : 0,
              transform: fade === "flash" ? "scale(1.15)" : "scale(1)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <Beacon s={64} glow={fade === "flash" ? 1 : fade === "sweep" ? 0.7 : 0.4} />
            </div>

            {/* Sweeping beam */}
            {(fade === "sweep") && (
              <div style={{ position: "absolute", top: -280, left: "50%", marginLeft: -400, width: 800, height: 300, pointerEvents: "none", overflow: "visible" }}>
                <svg viewBox="0 0 800 300" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  <defs>
                    <radialGradient id="tBeam" cx="50%" cy="100%" r="80%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <g style={{ transformOrigin: "400px 290px", animation: "wTransSweep 3s ease-in-out infinite" }}>
                    <polygon points="400,290 150,0 650,0" fill="url(#tBeam)" opacity="0.45"/>
                  </g>
                </svg>
              </div>
            )}
          </div>

          {/* Flash glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.4), rgba(251,191,36,0.1) 35%, transparent 65%)",
            opacity: fade === "flash" ? 1 : 0,
            transition: "opacity 0.5s ease-in",
            pointerEvents: "none",
          }} />
        </div>
      )}
    </div>
  );
}
