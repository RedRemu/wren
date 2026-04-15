import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from "recharts";

/* ═══ PALETTE ═══ */
var $ = {
  bg: "#0a0e1a", bg2: "#0f1525", bg3: "#141c2e",
  brd: "rgba(251,191,36,.08)", brdH: "rgba(251,191,36,.18)",
  tx: "#fef3c7", tx2: "#e0b88a", tx3: "#b08d5e", dim: "#8a7350",
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
var SH=[.9878,.9658,.9603,.9632,.9599,.9504,.9473,.9476,.9446,.9387,.9322,.9358,.9322,.9307,.9334,.9377,.9381,.9391,.9445,.9499,.9444,.9403,.9438,.9461,.9448,.9396,.9423,.9343,.9279,.9305,.9386,.9406,.9381,.9367,.937,.9436,.9417,.9469,.9474,.9414,.9437,.9382,.9445,.9393,.9316,.9267,.9286,.931,.9378,.9449,.935,.9423,.9367,.9379,.939,.9369,.9324,.9308,.9241,.9224,.927,.9112,.9075,.9096,.9169,.9159,.9179,.9178,.9198,.9183,.9131,.9224,.9295,.928,.9261,.9263,.9251,.9215,.9202,.9184,.9055,.8995,.8914,.8861,.8743,.8779,.8726,.8687,.8679,.8631,.8686,.8639,.8635,.8642,.8722,.8657,.8678,.8702,.8663,.8682,.8809,.8938,.8984,.9052,.9085,.9127,.9132,.9146,.9169,.9169,.9138,.9021,.895,.8868,.8673,.8678,.8716,.868,.8683,.8723];
var SV=[.9488,.9275,.9405,.9264,.929,.9205,.9153,.9109,.904,.9032,.9027,.8993,.8931,.8947,.8938,.8967,.8982,.9046,.9149,.9075,.9062,.9131,.9054,.9067,.902,.9,.9023,.8987,.8957,.9064,.9044,.8977,.9073,.9046,.9091,.9099,.913,.9159,.9184,.9139,.9173,.9193,.913,.9156,.9141,.917,.9087,.9061,.8915,.8921,.8885,.8846,.8855,.8877,.881,.8785,.8861,.8884,.8916,.8925,.889,.8908,.8903,.8891,.892,.8885,.8802,.8773,.8859,.8816,.8814,.8859,.8849,.874,.8769,.8771,.867,.8534,.8423,.8415,.8335,.8134,.8148,.8155,.7988,.7885,.7846,.7869,.7881,.7897,.785,.7911,.7847,.7822,.792,.789,.7952,.7925,.79,.7867,.784,.7892,.791,.7921,.7821,.7855,.7909,.7867,.7784,.7702,.7751,.7657,.7582,.753,.7521,.7528,.7475,.7495,.7565,.7579];
var SR=[.9899,.9562,.9522,.9566,.95,.9347,.9333,.9309,.9317,.9331,.9279,.9339,.9358,.9309,.9299,.936,.938,.9422,.9465,.9463,.9467,.9413,.9347,.9391,.9384,.938,.9348,.9305,.9258,.9275,.9284,.9286,.9265,.9215,.927,.9235,.9261,.923,.9212,.9185,.9182,.9179,.9193,.9181,.9177,.9181,.918,.9234,.9261,.9276,.9217,.9199,.9246,.9292,.9173,.9147,.9097,.9101,.9099,.9056,.8963,.8982,.8903,.8883,.8972,.895,.894,.8877,.8865,.8857,.893,.8916,.8967,.894,.897,.8981,.901,.905,.9022,.9036,.8953,.8933,.8898,.886,.8715,.8779,.87,.8646,.8653,.8595,.8585,.8539,.8481,.8492,.8546,.8546,.8544,.8599,.8588,.86,.868,.8684,.8678,.8738,.8752,.8758,.886,.8847,.8904,.8965,.9,.901,.9103,.9039,.9027,.9008,.8976,.893,.8855,.8822];
var SP=[.10,.08,.09,.11,.12,.08,.08,.08,.12,.08,.10,.09,.11,.10,.13,.11,.09,.10,.10,.08,.10,.11,.10,.10,.08,.11,.11,.10,.11,.12,.10,.08,.08,.12,.07,.13,.09,.12,.11,.08,.07,.09,.08,.14,.09,.14,.10,.12,.11,.16,.15,.18,.12,.16,.18,.35,.22,.26,.23,.19,.27,.26,.31,.31,.30,.41,.57,.42,.30,.38,.44,.48,.40,.59,.38,.47,.60,.66,.43,.62,1.16,.98,.9,1.28,.89,1.22,1.4,.88,1.19,1.21,1.76,1.36,1.1,1.22,1.57,1.8,1.62,1.6,1.9,2.11,2,1.82,1.43,1.79,1.28,1.88,1.79,1.72,2.74,1.76,2.36,2.29,2.31,1.77,1.7,1.87,2.34,2.32,1.94,2.36];
var SC=[.96,.935,.93,.935,.934,.925,.919,.921,.92,.917,.911,.915,.917,.917,.919,.926,.929,.93,.934,.936,.929,.926,.923,.924,.921,.912,.915,.91,.905,.905,.914,.915,.916,.914,.916,.919,.918,.92,.924,.923,.925,.925,.925,.92,.913,.91,.91,.909,.907,.91,.902,.9,.898,.897,.896,.895,.886,.882,.877,.875,.875,.865,.86,.86,.865,.865,.866,.864,.867,.863,.858,.857,.857,.855,.852,.849,.845,.843,.84,.844,.833,.838,.835,.83,.819,.821,.821,.817,.815,.808,.81,.8,.799,.8,.806,.805,.804,.81,.809,.815,.831,.842,.844,.853,.859,.86,.858,.861,.863,.858,.853,.85,.848,.842,.83,.831,.84,.833,.832,.836];
var SL=[.9856,.9612,.9558,.9601,.9545,.9398,.9378,.9362,.9355,.9372,.9318,.9382,.9395,.9348,.9335,.9401,.9418,.9458,.9498,.9501,.9504,.9448,.9388,.9425,.9418,.9412,.9385,.9340,.9295,.9312,.9320,.9325,.9300,.9255,.9305,.9272,.9298,.9265,.9248,.9222,.9218,.9215,.9230,.9218,.9213,.9216,.9215,.9270,.9296,.9312,.9252,.9234,.9282,.9328,.9208,.9182,.9132,.9136,.9134,.9090,.8998,.9016,.8938,.8918,.9006,.8984,.8974,.8912,.8900,.8892,.8964,.8950,.9002,.8974,.9004,.9015,.9044,.9084,.9056,.9070,.8988,.8967,.8932,.8894,.8750,.8812,.8734,.8680,.8688,.8630,.8618,.8572,.8514,.8526,.8580,.8580,.8578,.8634,.8622,.8634,.8714,.8718,.8712,.8772,.8786,.8792,.8894,.8880,.8938,.8998,.9034,.9044,.9136,.9072,.9060,.9042,.9010,.8964,.8888,.8856];
var NS = Array.from({ length: 2000 }, function(_, i) { return Math.sin(i * 127.1 + i * i * .013) * .5 + Math.cos(i * 269.5 - i * .017) * .5; });

/* ═══ SCENARIOS ═══ */
var SCENARIOS = {
  nominal: { label: "Normal Operation", batch: 20, desc: "Stable grid. All systems nominal. Model predictions are trustworthy.", plain: "Everything is working. The AI model was trained on data that looks like this. Predictions are accurate.", status: "STABLE", color: $.gn, health: 98, action: "Continue monitoring at standard interval.", feature: "None. All features within training distribution.", alert: "No alerts", showDrift: false, showRegime: false },
  gradual: { label: "Gradual Drift", batch: 55, desc: "Tau parameters shifting slowly. Model confidence degrading before accuracy drops.", plain: "The real world is slowly changing, but the model was trained on old data. It's getting less reliable, but doesn't know it yet.", status: "DRIFT DETECTED", color: $.ac, health: 87, action: "Recalibrate model. Increase damping at Node 2 (LOAD). Reduce trust threshold to 0.90.", feature: "tau_std rising +40%, F_gain_mean shifting from training mean", alert: "PSI crossed 0.25 threshold at batch 55", showDrift: true, showRegime: false },
  noise: { label: "Sensor Noise", batch: 45, desc: "SCADA sensor corruption injected. Testing whether the model can distinguish noise from real instability.", plain: "A sensor is feeding bad data. Is the grid actually unstable, or is the sensor broken? The system has to tell the difference.", status: "MONITORING", color: $.ac, health: 92, action: "Increase monitoring frequency to 2x. Verify sensor integrity at Node 1.", feature: "Broad noise across tau and g parameters. Not localised.", alert: "Early CUSUM deviation at batch 34", showDrift: true, showRegime: false },
  adversarial: { label: "Adversarial Attack", batch: 65, desc: "FGSM perturbation applied to sensor readings. Simulates adversarial perturbation of grid telemetry.", plain: "This simulates adversarial perturbation. Small mathematical changes are applied to sensor readings to test whether the model holds or flips its predictions.", status: "AT RISK", color: $.rd, health: 74, action: "Switch to RF fallback model immediately. SVM boundary has been compromised by gradient attack.", feature: "SVM flip rate at 16.5%. Hybrid stacking absorbs to 3.3%.", alert: "Adversarial signature detected in gradient pattern", showDrift: true, showRegime: false },
  collapse: { label: "Regime Collapse", batch: 95, desc: "Abrupt parameter shift. Generator response characteristics have fundamentally changed.", plain: "The grid itself has fundamentally changed. The world the model was trained for no longer exists. Nothing it learned applies anymore.", status: "CRITICAL", color: $.rd, health: 52, action: "Emergency recalibration via LaSCal pipeline. Alert grid operator. Reduce load at Nodes 2 and 3.", feature: "All features shifted beyond training bounds. Coverage at 82%.", alert: "All three detectors triggered. Regime change confirmed.", showDrift: true, showRegime: true },
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
    s.textContent = "@keyframes wup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes wpulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes wblink{0%,100%{opacity:.5}50%{opacity:1}}@keyframes wsweep{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes wshake{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-3px)}30%,60%,90%{transform:translateX(3px)}}@keyframes lhSweep{0%,100%{transform:rotate(-35deg)}50%{transform:rotate(35deg)}}@keyframes wLoad{0%{width:0%}100%{width:100%}}@keyframes wTransSweep{0%{transform:rotate(-40deg)}50%{transform:rotate(40deg)}100%{transform:rotate(-40deg)}}@keyframes bIdlePulse{0%,100%{opacity:.55}50%{opacity:.95}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(251,191,36,.1);border-radius:2px}";
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
  { key: "adversarial", num: "04", title: "Fake Data Attack", serif: "Carefully crafted false readings are injected into the sensor stream. One model is tricked a third of the time. Another holds at 0.04%.", detail: "The vulnerability depends entirely on what type of AI is used. The choice of model is a security decision, not just a performance decision.", batch: 65, health: 74 },
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
  var W = 220; var H = 48;
  var c = color || $.glow;

  // Data loading - dots streaming into a box
  if (n === 1) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {[0,1,2,3,4,5,6,7].map(function(i){return <circle key={i} cx={20+i*12} cy={24} r="2.5" fill={c} opacity="0.4"><animate attributeName="opacity" values="0.1;0.8;0.1" dur="1.5s" begin={i*0.15+"s"} repeatCount="indefinite"/></circle>;})}
      <rect x={130} y={12} width={60} height={24} rx="4" fill="none" stroke={c} strokeWidth="1" opacity="0.3"/>
      <text x={160} y={28} textAnchor="middle" fill={c} fontSize="8" fontFamily={F.m} opacity="0.5">60K</text>
    </svg>
  );
  // Feature engineering - 12 dots expanding to 48
  if (n === 2) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){return <circle key={i} cx={15+i*5} cy={24} r="2" fill={c} opacity="0.6"/>;})}
      <text x={85} y={27} fill={c} fontSize="10" fontFamily={F.m} opacity="0.4">→</text>
      {Array.from({length:24}).map(function(_,i){return <circle key={i} cx={100+(i%12)*8} cy={i<12?16:32} r="1.5" fill={c} opacity="0.35"><animate attributeName="opacity" values="0.15;0.5;0.15" dur="2s" begin={i*0.06+"s"} repeatCount="indefinite"/></circle>;})}
    </svg>
  );
  // Data splitting - bar dividing into 3
  if (n === 3) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <rect x={10} y={18} width={70} height={12} rx="3" fill={c} opacity="0.2"/>
      <text x={115} y={27} fill={c} fontSize="10" fontFamily={F.m} opacity="0.4">→</text>
      <rect x={135} y={18} width={28} height={12} rx="2" fill={$.gn} opacity="0.35"/><text x={149} y={27} textAnchor="middle" fill={$.gn} fontSize="6" fontFamily={F.m}>TRN</text>
      <rect x={166} y={18} width={20} height={12} rx="2" fill={$.ac} opacity="0.35"/><text x={176} y={27} textAnchor="middle" fill={$.ac} fontSize="6" fontFamily={F.m}>VAL</text>
      <rect x={189} y={18} width={20} height={12} rx="2" fill={$.rd} opacity="0.35"/><text x={199} y={27} textAnchor="middle" fill={$.rd} fontSize="6" fontFamily={F.m}>TST</text>
    </svg>
  );
  // Feature selection - dots disappearing
  if (n === 4) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {Array.from({length:24}).map(function(_,i){var keep=i<7;return <circle key={i} cx={10+(i%12)*8} cy={i<12?16:32} r="2" fill={keep?c:$.dim} opacity={keep?0.7:0.12}>{!keep&&<animate attributeName="r" values="2;0" dur="0.8s" begin={(i*0.05)+"s" } fill="freeze"/>}</circle>;})}
      <text x={115} y={27} fill={c} fontSize="10" fontFamily={F.m} opacity="0.4">→</text>
      <text x={140} y={28} fill={c} fontSize="9" fontFamily={F.m} opacity="0.6">14 kept</text>
    </svg>
  );
  // Hyperparameter search - grid with one highlighted
  if (n === 5) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      {Array.from({length:25}).map(function(_,i){var x=15+(i%5)*14;var y=8+(Math.floor(i/5))*9;var best=i===12;return <rect key={i} x={x} y={y} width={10} height={6} rx="1" fill={best?$.glow:c} opacity={best?0.8:0.12}>{best&&<animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>}</rect>;})}
      <text x={105} y={27} fill={c} fontSize="10" fontFamily={F.m} opacity="0.4">→</text>
      <text x={125} y={28} fill={$.glow} fontSize="9" fontFamily={F.m} opacity="0.6">optimal</text>
    </svg>
  );
  // Four base learners - 4 different shapes
  if (n === 6) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <circle cx={30} cy={24} r="10" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5"/><text x={30} y={27} textAnchor="middle" fill="#a78bfa" fontSize="6" fontFamily={F.m}>SVM</text>
      <rect x={55} y={14} width={20} height={20} rx="3" fill="none" stroke={$.gn} strokeWidth="1.5" opacity="0.5"/><text x={65} y={27} textAnchor="middle" fill={$.gn} fontSize="6" fontFamily={F.m}>RF</text>
      <polygon points="100,14 110,34 90,34" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.5"/><text x={100} y={30} textAnchor="middle" fill="#67e8f9" fontSize="5" fontFamily={F.m}>LGB</text>
      <rect x={120} y={14} width={20} height={20} rx="10" fill="none" stroke={$.ac} strokeWidth="1.5" opacity="0.5"/><text x={130} y={27} textAnchor="middle" fill={$.ac} fontSize="6" fontFamily={F.m}>LR</text>
    </svg>
  );
  // Calibration - crooked line becoming straight
  if (n === 7) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <path d="M10,38 Q30,10 50,30 Q70,42 90,20" fill="none" stroke={$.rd} strokeWidth="1.2" opacity="0.3" strokeDasharray="3 3"/>
      <text x={105} y={27} fill={c} fontSize="10" fontFamily={F.m} opacity="0.4">→</text>
      <line x1={120} y1={38} x2={200} y2={12} stroke={$.gn} strokeWidth="1.5" opacity="0.5"/>
      <line x1={120} y1={38} x2={200} y2={12} stroke={$.gn} strokeWidth="1" opacity="0.15" strokeDasharray="3 3"/>
    </svg>
  );
  // Stacking ensemble - shapes merging
  if (n === 8) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <circle cx={25} cy={24} r="8" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4"/>
      <rect x={50} y={16} width={16} height={16} rx="2" fill="none" stroke={$.gn} strokeWidth="1" opacity="0.4"/>
      <text x={85} y={27} fill={c} fontSize="10" fontFamily={F.m} opacity="0.4">→</text>
      <rect x={105} y={10} width={50} height={28} rx="6" fill={$.glow} opacity="0.1" stroke={$.glow} strokeWidth="1.5" opacity="0.4"/>
      <text x={130} y={28} textAnchor="middle" fill={$.glow} fontSize="8" fontFamily={F.m} opacity="0.6">HYBRID</text>
    </svg>
  );
  // Score bar
  if (n === 9) return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <rect x={10} y={20} width={140} height={8} rx="4" fill="rgba(255,255,255,.06)"/>
      <rect x={10} y={20} width={139.8} height={8} rx="4" fill={$.gn} opacity="0.4"><animate attributeName="width" from="0" to="139.8" dur="1.2s" fill="freeze"/></rect>
      <text x={160} y={27} fill={$.gn} fontSize="9" fontFamily={F.m} fontWeight="700" opacity="0.7">0.9999</text>
    </svg>
  );
  // Default - simple pulse dot + label
  var labels = {10:"10:1 cost",11:"95% bound",12:"p<0.05",13:"plateau",14:"5 folds",15:"F_gain #1",16:"explainable",17:"robust",18:"RF immune","18b":"120 batches",19:"26 early",20:"generalises",21:"stabilised",22:"deployed"};
  return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H}>
      <circle cx={20} cy={24} r="6" fill={c} opacity="0.15"><animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/></circle>
      <circle cx={20} cy={24} r="3" fill={c} opacity="0.4"/>
      <line x1={32} y1={24} x2={90} y2={24} stroke={c} strokeWidth="0.8" opacity="0.15" strokeDasharray="3 3"/>
      <text x={100} y={28} fill={c} fontSize="10" fontFamily={F.m} opacity="0.5">{labels[n]||""}</text>
    </svg>
  );
}

/* ═══ COMMAND CENTRE ═══ */

function CommandCentre(props) {
  useStyles();
  var _tab  = useState("sim");   var tab   = _tab[0];   var setTab   = _tab[1];
  var _b    = useState(0);       var batch = _b[0];     var setBatch = _b[1];
  var _demo = useState(false);   var demo  = _demo[0];  var setDemo  = _demo[1];
  var _card = useState(null);    var card  = _card[0];  var setCard  = _card[1];
  var _pipeStage = useState(22); var pipeStage = _pipeStage[0]; var setPipeStage = _pipeStage[1];
  var _pipeOpen = useState(null); var pipeOpen = _pipeOpen[0]; var setPipeOpen = _pipeOpen[1];
  var _pipeRunning = useState(false); var pipeRunning = _pipeRunning[0]; var setPipeRunning = _pipeRunning[1];
  var pipeTimers = useRef([]);
  var _findOpen = useState(null); var findOpen = _findOpen[0]; var setFindOpen = _findOpen[1];
  var demoRef = useRef(null);
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
      {n:2, name:"Physics Feature Engineering", plain:"Turn raw electrical readings into meaningful physics measurements. 12 values become 48", desc:"48 physics informed candidates generated. Key v4 features: F_gain_i = τ·g per node, H_net, V_weak, F_gain_mean/std/min. Raw 12 features expanded to 48.", input:"12 features", output:"48 features"},
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
      {n:9,  name:"Test Set Evaluation", plain:"Test all models on data they have never seen. The Hybrid scored 0.9999 out of 1.0, nearly perfect", desc:"Full metrics: AUC, F1, Accuracy, Brier score, ECE. Hybrid AUC: 0.9999. SVM: 0.9899. RF: 0.9899. LGBM comparable. Clean data performance established as deployment baseline.", input:"Test data", output:"AUC: 0.9999"},
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
      {n:18, name:"Adversarial Robustness", plain:"Apply mathematical perturbations to test if models can be pushed into wrong answers. SVM flipped 19.8%. Random Forest held at 0.04%", desc:"Fast Gradient Sign Method at 6 epsilon levels (0.01 to 0.30). SVM (RBF) flip rate: 19.8% at eps=0.1. RF flip rate: 0.04%. Tree models immune due to discrete leaf structure.", input:"FGSM ε=0.01–0.30", output:"RF immune"},
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
      insight:"When the grid is stable, coverage holds at 96%+. When the data shifts too far outside training (regime collapse, batch 80), it drops to 83%. That means 1 in 6 predictions has an uncertainty the model can't quantify. W.R.E.N. flags this instantly so operators know when the safety guarantee has expired.",
    },
  };

  /* Findings data consequence format */
  var FINDINGS = [
    {metric:"AUC fell from 0.9999 to 0.8834",   color:$.rd, 
     consequence:"The model was near perfect in the lab. Under real deployment drift, 1 in 9 predictions deteriorated. A model that looks production ready on a static benchmark can still fail silently once deployed. This is the gap W.R.E.N. exists to close."},
    {metric:"ECE increased 214×",                color:$.rd, 
     consequence:"Calibration error is how wrong the model's confidence is. 214× baseline means when it said '90% stable', it was right far less often. Decisions made on uncalibrated confidence are decisions made on false certainty. LaSCal recalibration brought this back under control."},
    {metric:"PSI crossed 0.25 at batch 55",      color:$.glow,icon:"",
     consequence:"26 batches before accuracy dropped, the data started looking different. PSI caught it first. That 26-batch head start is the difference between a controlled recalibration and an emergency shutdown. Early warning is the economic value of deployment monitoring."},
    {metric:"RF adversarial flip rate: 0.04%",   color:$.gn, 
     consequence:"Under FGSM adversarial testing, the SVM was flipped 19.8% of the time. The Random Forest: 0.04%. Tree models don't use gradients there's no slope to attack. When adversarial conditions are possible, the fallback model is the RF, not the SVM."},
    {metric:"Conformal coverage dropped to 83%", color:$.ac, 
     consequence:"1 in 6 predictions during regime collapse had no valid uncertainty bound. The conformal guarantee expired. This isn't a model failure it's the model honestly admitting it is out of its depth. A model that tells you when to stop trusting it is more valuable than one that doesn't."},
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
        {[{id:"sim",label:"Simulation"},{id:"pipe",label:"Pipeline · 22 Stages"},{id:"finds",label:"Findings"}].map(function(t){
          var a=tab===t.id;
          return (<button key={t.id} onClick={function(){setTab(t.id);setCard(null);}} style={{flex:1,padding:"10px 0",fontFamily:F.m,fontSize:10,fontWeight:a?600:400,color:a?$.glow:$.dim,background:"transparent",border:"none",cursor:"pointer",borderBottom:"2px solid "+(a?$.glow:"transparent"),letterSpacing:".04em",transition:"all .2s"}}>{t.label}</button>);
        })}
      </div>
    </div>
  );

  /* helper chart card wrapper with click-to-flashcard */
  function ChartCard(cp) {
    var open = card===cp.id;
    return (
      <div style={{background:$.bg2,border:"1px solid "+(open?$.glow+"55":$.brd),borderRadius:10,padding:"14px 14px 8px",cursor:"pointer",transition:"border-color .2s",position:"relative"}}
        onClick={function(){setCard(open?null:cp.id);}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontSize:12,fontWeight:600,color:$.tx}}>{cp.title}</div>
          <div style={{fontFamily:F.m,fontSize:8,color:open?$.glow:$.dim,background:open?"rgba(251,191,36,.08)":"transparent",padding:"2px 8px",borderRadius:999,border:"1px solid "+(open?$.glow+"33":"transparent"),transition:"all .2s"}}>
            {open?"Close":"Click to explain"}
          </div>
        </div>
        {cp.sub && <div style={{fontFamily:F.m,fontSize:8,color:$.dim,marginBottom:8}}>{cp.sub}</div>}
        {open ? (
          <div style={{padding:"14px 0 6px",animation:"wup .25s ease both"}}>
            <div style={{fontFamily:F.m,fontSize:9,color:$.glow,letterSpacing:".06em",marginBottom:8}}>{CARDS[cp.id].title}</div>
            <p style={{fontSize:12,color:$.tx,lineHeight:1.8,marginBottom:10}}>{CARDS[cp.id].plain}</p>
            <p style={{fontSize:12,color:$.tx3,lineHeight:1.8,marginBottom: CARDS[cp.id].lines?12:0}}>{CARDS[cp.id].insight}</p>
            {CARDS[cp.id].lines && (
              <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                {CARDS[cp.id].lines.map(function(l){ return (<div key={l.l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:16,height:2,background:l.c,borderRadius:1}}/><span style={{fontFamily:F.m,fontSize:8,color:$.dim}}>{l.l}</span></div>); })}
              </div>
            )}
          </div>
        ) : cp.children}
      </div>
    );
  }

  /* ── TAB: SIMULATION ── */
  if (tab==="sim") return (
    <div style={{minHeight:"100vh",background:$.bg,fontFamily:F.s,color:$.tx2}}>
      {nav}
      <div style={{padding:"8px 24px",background:pCol===$.gn?$.gnD:pCol===$.rd?$.rdD:$.acD,borderBottom:"1px solid "+pCol+"22",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:pCol,animation:phase!=="stable"?"wpulse 1.8s ease-in-out infinite":"none"}}/>
          <span style={{fontFamily:F.m,fontSize:10,fontWeight:600,color:pCol}}>{phase==="stable"?"STABLE":phase==="drift"?"DRIFT DETECTED":"CRITICAL"}</span>
          <span style={{fontFamily:F.m,fontSize:9,color:pCol,opacity:.6}}>| Batch {batch} | AUC {(SH[batch]||0).toFixed(4)} | PSI {(SP[batch]||0).toFixed(2)}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={function(){if(demo){setDemo(false);}else{setBatch(0);setDemo(true);}}} style={{padding:"4px 12px",borderRadius:5,border:"1px solid "+(demo?$.rd:$.glow),background:demo?$.rdD:$.acD,color:demo?$.rd:$.glow,fontFamily:F.m,fontSize:9,fontWeight:600,cursor:"pointer"}}>{demo?"Pause":batch>=119?"Replay":"Play"}</button>
          <input type="range" min={0} max={119} value={batch} onChange={function(e){setDemo(false);setBatch(+e.target.value);}} style={{width:150,accentColor:$.glow}}/>
          <span style={{fontFamily:F.m,fontSize:11,color:$.glow,fontWeight:700,minWidth:20}}>{batch}</span>
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"16px 20px 48px"}}>
        <p style={{fontFamily:F.m,fontSize:9,color:$.dim,marginBottom:14,textAlign:"right"}}>Click any chart to see a plain-English explanation</p>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:14,background:$.brd,borderRadius:10,overflow:"hidden",border:"1px solid "+$.brd}}>
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

        {/* AUC chart clickable */}
        <div style={{marginBottom:14}}>
          <ChartCard id="auc" title="Model Confidence. AUC over 120 Batches"
            sub="Three models, three drift phases. Click to understand what you're looking at."
            children={
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={aucData.slice(0,batch+1)} margin={{top:8,right:8,bottom:4,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.04)"/>
                  <XAxis dataKey="b" tick={TK} tickLine={false} domain={[0,119]} type="number"/>
                  <YAxis domain={["dataMin - 0.01","dataMax + 0.01"]} tick={TK} tickLine={false} width={36}/>
                  <Tooltip contentStyle={TT}/>
                  {batch>=40 && <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Drift",position:"insideTopLeft",fill:$.ac,fontSize:8}}/>}
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

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <ChartCard id="psi" title="PSI Drift Index"
            sub="Alert threshold: 0.25. Crossed at batch 55, 26 batches early"
            children={
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={psiData.slice(0,batch+1)} margin={{top:14,right:4,bottom:4,left:0}}>
                  <XAxis dataKey="b" tick={false} axisLine={false} domain={[0,119]} type="number"/>
                  <YAxis tick={false} axisLine={false} width={0} domain={[0, function(max){ return Math.max(0.35, max*1.1); }]}/>
                  <ReferenceLine y={0.25} stroke={$.rd} strokeDasharray="3 3" strokeOpacity={.5} label={{value:"Alert 0.25",position:"insideTopLeft",fill:$.rd,fontSize:8}}/>
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
        <div style={{marginTop:24,marginBottom:24}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.glow,letterSpacing:".06em",marginBottom:8}}>INTERACTIVE</div>
          <h3 style={{fontSize:16,fontWeight:600,color:$.tx,marginBottom:6}}>Break it yourself</h3>
          <p style={{fontSize:12,color:$.tx3,marginBottom:16}}>Drag the slider. Watch four models respond differently to the same threat</p>
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
      <div style={{maxWidth:880,margin:"0 auto",padding:"28px 20px 56px"}}>
        <div style={{marginBottom:28}}>
          <p style={{fontFamily:F.m,fontSize:10,color:$.glow,letterSpacing:4,marginBottom:8}}>A.G.N.E.S. PIPELINE v4.2</p>
          <h2 style={{fontSize:"clamp(18px,3vw,26px)",fontWeight:600,fontFamily:serif,color:$.tx,marginBottom:8}}>22 stages from raw data to deployed model</h2>
          <p style={{fontSize:13,color:$.tx3,lineHeight:1.75}}>Every stage feeds into the next. Click any stage to see what it does and why</p>
        </div>

        {/* Run button + progress */}
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
          <button onClick={runPipeline} disabled={pipeRunning}
            style={{background:pipeRunning?$.bg2:$.glow,color:pipeRunning?$.dim:$.bg,border:"none",borderRadius:8,padding:"10px 24px",fontSize:12,fontWeight:700,cursor:pipeRunning?"default":"pointer",fontFamily:F.m,letterSpacing:0.5}}>
            {pipeRunning?"Running...":pipeStage>=totalStages?"Run again":"Run pipeline"}
          </button>
          <div style={{flex:1,height:3,background:"rgba(255,255,255,.04)",borderRadius:2,overflow:"hidden"}}>
            <div style={{width:progress+"%",height:"100%",background:$.glow,borderRadius:2,transition:"width .2s ease"}}/>
          </div>
          <span style={{fontFamily:F.m,fontSize:10,color:$.glow,fontWeight:600,minWidth:36}}>{pipeStage}/{totalStages}</span>
        </div>

        {(function() {
          var stageCount = 0;
          return PIPELINE.map(function(ph) {
            var phaseStart = stageCount;
            var phaseComplete = true;
            ph.stages.forEach(function() { stageCount++; if (stageCount > pipeStage) phaseComplete = false; });
            var phaseActive = stageCount > pipeStage && phaseStart < pipeStage;

            return (
              <div key={ph.phase} style={{marginBottom:20,opacity:phaseStart<pipeStage?1:0.3,transition:"opacity .4s ease"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:ph.color,flexShrink:0,animation:phaseActive?"wpulse 1s ease-in-out infinite":"none"}}/>
                  <span style={{fontFamily:F.m,fontSize:9,color:ph.color,letterSpacing:".06em",fontWeight:600}}>{ph.phase.toUpperCase()}</span>
                  <div style={{flex:1,height:1,background:ph.color,opacity:.12}}/>
                  
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {(function() {
                    var localCount = phaseStart;
                    return ph.stages.map(function(s) {
                      localCount++;
                      var reached = localCount <= pipeStage;
                      var current = localCount === pipeStage && pipeRunning;
                      var isOpen = pipeOpen === s.n;
                      return (
                        <div key={s.n}
                          onClick={function(){if(reached)setPipeOpen(isOpen?null:s.n);}}
                          style={{background:current?"rgba(251,191,36,.04)":$.bg2,border:"1px solid "+(current?$.glow+"44":isOpen?ph.color+"44":$.brd),borderRadius:9,padding:"12px 14px",cursor:reached?"pointer":"default",transition:"all .3s",opacity:reached?1:0.25,transform:reached?"none":"translateX(8px)"}}>
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <div style={{width:32,height:32,borderRadius:8,background:reached?ph.color+"10":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:F.m,fontSize:11,fontWeight:700,color:reached?ph.color:$.dim,transition:"all .3s"}}>
                              {s.n}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <div style={{fontSize:13,fontWeight:600,color:reached?$.tx:$.dim}}>{s.name}</div>
                                {reached && !isOpen && <span style={{fontFamily:F.m,fontSize:7,color:$.dim}}>→</span>}
                              </div>
                              {!isOpen && reached && <div style={{fontSize:11,color:$.tx3,marginTop:2}}>{s.plain}</div>}
                            </div>
                            {current && <div style={{width:6,height:6,borderRadius:"50%",background:$.glow,animation:"wpulse 0.6s ease-in-out infinite",flexShrink:0}}/>}
                          </div>

                          {isOpen && reached && (
                            <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.04)",animation:"wup .2s ease both"}}>
                              {/* Stage visual */}
                              <div style={{marginBottom:10}}><PipeVis n={s.n} color={ph.color}/></div>
                              {/* Input → Output */}
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                                <div style={{background:"rgba(255,255,255,.03)",borderRadius:6,padding:"6px 10px"}}>
                                  <div style={{fontFamily:F.m,fontSize:7,color:$.dim,letterSpacing:1}}>INPUT</div>
                                  <div style={{fontFamily:F.m,fontSize:10,color:$.tx2,marginTop:2}}>{s.input}</div>
                                </div>
                                <span style={{color:ph.color,fontSize:14}}>→</span>
                                <div style={{background:ph.color+"08",border:"1px solid "+ph.color+"22",borderRadius:6,padding:"6px 10px"}}>
                                  <div style={{fontFamily:F.m,fontSize:7,color:ph.color,letterSpacing:1}}>OUTPUT</div>
                                  <div style={{fontFamily:F.m,fontSize:10,color:$.tx,marginTop:2,fontWeight:600}}>{s.output}</div>
                                </div>
                              </div>
                              {/* Technical detail */}
                              <div style={{fontSize:11,color:$.dim,lineHeight:1.7,fontFamily:F.m}}>{s.desc}</div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            );
          });
        })()}

        <div style={{background:$.acD,border:"1px solid "+$.glow+"22",borderRadius:10,padding:"16px 20px",textAlign:"center",marginTop:8}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.glow,letterSpacing:4,marginBottom:10}}>ENVIRONMENT</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {["Python 3.13","scikit learn 1.8","LightGBM 4.6","SHAP 0.50","Optuna 4.7","NumPy","Pandas","SciPy"].map(function(t){
              return (<span key={t} style={{fontFamily:F.m,fontSize:9,color:$.tx3,background:"rgba(255,255,255,.04)",padding:"3px 10px",borderRadius:5}}>{t}</span>);
            })}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── TAB: FINDINGS ── */

  return (
    <div style={{minHeight:"100vh",background:$.bg,fontFamily:F.s,color:$.tx2}}>
      {nav}
      <div style={{maxWidth:820,margin:"0 auto",padding:"28px 20px 56px"}}>
        <div style={{marginBottom:28}}>
          <p style={{fontFamily:F.m,fontSize:10,color:$.glow,letterSpacing:4,marginBottom:8}}>RESEARCH FINDINGS</p>
          <h2 style={{fontSize:"clamp(18px,3vw,26px)",fontWeight:600,fontFamily:serif,color:$.tx,marginBottom:8}}>The data behind every claim</h2>
          <p style={{fontSize:13,color:$.tx3,lineHeight:1.75}}>Click any finding to see the actual evidence</p>
        </div>

        {/* Finding 1: AUC degradation */}
        <div style={{marginBottom:14}}>
          <div onClick={function(){setFindOpen(findOpen===1?null:1);}} style={{background:$.bg2,border:"1px solid "+(findOpen===1?$.rd+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===1?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.rd}}>0.9999 → 0.8834</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The model was near-perfect in the lab. Deployment told a different story</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===1?"Close":"See proof"}</span>
            </div>
            {findOpen===1 && (
              <div style={{animation:"wup .2s ease both"}}>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={aucData} margin={{top:8,right:8,bottom:4,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.04)"/>
                    <XAxis dataKey="b" tick={TK} tickLine={false}/>
                    <YAxis domain={[0.84,1]} tick={TK} tickLine={false} width={36}/>
                    <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Drift",fill:$.ac,fontSize:8}}/>
                    <ReferenceLine x={65} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Attack",fill:$.rd,fontSize:8}}/>
                    <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={.35} label={{value:"Regime",fill:$.rd,fontSize:8}}/>
                    <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2} dot={false} name="Hybrid" isAnimationActive={false}/>
                    <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1} dot={false} opacity={.4} name="SVM" isAnimationActive={false}/>
                    <Line type="monotone" dataKey="R" stroke={$.gn} strokeWidth={1} dot={false} opacity={.4} name="RF" isAnimationActive={false}/>
                  </LineChart>
                </ResponsiveContainer>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7,marginTop:8}}>Every line is a different model watching the same data stream. The vertical dashed lines mark when conditions changed. Between batch 40 and batch 120, 1 in 9 Hybrid predictions degraded. The model had no idea it was getting worse</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 2: ECE / Confidence */}
        <div style={{marginBottom:14}}>
          <div onClick={function(){setFindOpen(findOpen===2?null:2);}} style={{background:$.bg2,border:"1px solid "+(findOpen===2?$.rd+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===2?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.rd}}>Confidence error increased 214×</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The model was still saying "90% sure" while being wrong</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===2?"Close":"See proof"}</span>
            </div>
            {findOpen===2 && (
              <div style={{animation:"wup .2s ease both"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
                  <div style={{background:"rgba(52,211,153,.04)",borderRadius:8,padding:"16px",textAlign:"center"}}>
                    <div style={{fontFamily:F.m,fontSize:8,color:$.gn,letterSpacing:1,marginBottom:6}}>LAB (CLEAN DATA)</div>
                    <div style={{fontFamily:F.m,fontSize:28,fontWeight:700,color:$.gn}}>1×</div>
                    <div style={{fontSize:11,color:$.tx3,marginTop:4}}>Model says 90%, is right 90% of the time</div>
                  </div>
                  <div style={{background:"rgba(248,113,113,.04)",borderRadius:8,padding:"16px",textAlign:"center"}}>
                    <div style={{fontFamily:F.m,fontSize:8,color:$.rd,letterSpacing:1,marginBottom:6}}>DEPLOYED (DRIFT)</div>
                    <div style={{fontFamily:F.m,fontSize:28,fontWeight:700,color:$.rd}}>214×</div>
                    <div style={{fontSize:11,color:$.tx3,marginTop:4}}>Model says 90%, is right far less often</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7}}>This is the most dangerous failure mode in ML deployment. The model does not know it is wrong. It keeps outputting high-confidence predictions that no longer match reality. LaSCal recalibration brought this back under control</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 3: PSI Early Warning */}
        <div style={{marginBottom:14}}>
          <div onClick={function(){setFindOpen(findOpen===3?null:3);}} style={{background:$.bg2,border:"1px solid "+(findOpen===3?$.glow+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===3?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.glow}}>PSI fired 26 batches early</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The system spotted trouble before accuracy dropped</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===3?"Close":"See proof"}</span>
            </div>
            {findOpen===3 && (
              <div style={{animation:"wup .2s ease both"}}>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={psiData} margin={{top:8,right:8,bottom:4,left:0}}>
                    <XAxis dataKey="b" tick={TK} tickLine={false}/>
                    <YAxis tick={false} axisLine={false} width={0} domain={[0,function(mx){return Math.max(0.4,mx*1.1);}]}/>
                    <ReferenceLine y={0.25} stroke={$.rd} strokeDasharray="3 3" strokeOpacity={.5} label={{value:"Alert threshold",fill:$.rd,fontSize:8}}/>
                    <ReferenceLine x={55} stroke={$.glow} strokeWidth={2} strokeOpacity={.5} label={{value:"PSI fires",fill:$.glow,fontSize:8,position:"top"}}/>
                    <ReferenceLine x={81} stroke={$.rd} strokeWidth={1} strokeOpacity={.3} label={{value:"AUC drops",fill:$.rd,fontSize:8,position:"top"}}/>
                    <Area type="monotone" dataKey="P" stroke={$.ac} fill={$.acD} strokeWidth={2} isAnimationActive={false}/>
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,marginBottom:8}}>
                  <div style={{flex:1,height:1,background:$.glow+"33"}}/>
                  <span style={{fontFamily:F.m,fontSize:11,color:$.glow,fontWeight:700}}>26 batch gap</span>
                  <div style={{flex:1,height:1,background:$.glow+"33"}}/>
                </div>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7}}>The amber line is PSI, which measures how different incoming data looks from training data. It crossed the alert threshold at batch 55. Accuracy did not visibly drop until batch 81. That 26-batch window is the time you have to recalibrate, switch models, or alert an operator before the failure becomes visible</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 4: Adversarial Robustness */}
        <div style={{marginBottom:14}}>
          <div onClick={function(){setFindOpen(findOpen===4?null:4);}} style={{background:$.bg2,border:"1px solid "+(findOpen===4?$.gn+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===4?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.gn}}>SVM 19.8% flipped vs RF 0.04%</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>Same test, completely different resilience</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===4?"Close":"See proof"}</span>
            </div>
            {findOpen===4 && (
              <div style={{animation:"wup .2s ease both"}}>
                <div style={{display:"flex",gap:12,marginBottom:12}}>
                  {[
                    {name:"SVM",val:19.8,color:"#a78bfa"},
                    {name:"Hybrid",val:3.3,color:$.glow},
                    {name:"LGBM",val:1.2,color:"#67e8f9"},
                    {name:"RF",val:0.04,color:$.gn},
                  ].map(function(m){return (
                    <div key={m.name} style={{flex:1,textAlign:"center"}}>
                      <div style={{height:100,display:"flex",alignItems:"flex-end",justifyContent:"center",marginBottom:6}}>
                        <div style={{width:"100%",maxWidth:40,height:Math.max(2,m.val/19.8*90),background:m.color,opacity:0.5,borderRadius:"3px 3px 0 0",transition:"height .5s ease"}}/>
                      </div>
                      <div style={{fontFamily:F.m,fontSize:12,fontWeight:700,color:m.color}}>{m.val}%</div>
                      <div style={{fontFamily:F.m,fontSize:8,color:$.dim,marginTop:2}}>{m.name}</div>
                    </div>
                  );})}
                </div>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7}}>Under FGSM adversarial perturbation testing at ε=0.1, the SVM had its predictions flipped almost 20% of the time. The Random Forest held at 0.04%. Tree-based models have no gradient to exploit. This is why the system keeps RF as the automatic fallback when adversarial conditions are detected</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 5: Coverage */}
        <div style={{marginBottom:14}}>
          <div onClick={function(){setFindOpen(findOpen===5?null:5);}} style={{background:$.bg2,border:"1px solid "+(findOpen===5?$.ac+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===5?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.ac}}>Coverage dropped from 96% to 83%</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The safety guarantee expired. 1 in 6 predictions had no bound</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===5?"Close":"See proof"}</span>
            </div>
            {findOpen===5 && (
              <div style={{animation:"wup .2s ease both"}}>
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={covData} margin={{top:8,right:8,bottom:4,left:0}}>
                    <XAxis dataKey="b" tick={TK} tickLine={false}/>
                    <YAxis domain={[0.78,1]} tick={TK} tickLine={false} width={36}/>
                    <ReferenceLine y={0.95} stroke={$.gn} strokeDasharray="3 3" strokeOpacity={.5} label={{value:"95% guarantee",fill:$.gn,fontSize:8}}/>
                    <Area type="monotone" dataKey="C" stroke={$.glow} fill={$.glowD} strokeWidth={2} isAnimationActive={false}/>
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{fontSize:12,color:$.tx3,lineHeight:1.7,marginTop:8}}>Conformal prediction guarantees that at least 95% of predictions have a reliable confidence bound. When the data shifts far enough, that guarantee breaks. At batch 95, coverage was 83%, meaning 1 in 6 predictions had no valid safety net. A model that can tell you when its own guarantee has expired is more valuable than one that cannot</div>
              </div>
            )}
          </div>
        </div>

        {/* Finding 6: F_gain */}
        <div style={{marginBottom:14}}>
          <div onClick={function(){setFindOpen(findOpen===6?null:6);}} style={{background:$.bg2,border:"1px solid "+(findOpen===6?$.glow+"44":$.brd),borderRadius:12,padding:"20px 22px",cursor:"pointer",transition:"all .2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:findOpen===6?14:0}}>
              <div>
                <div style={{fontFamily:F.m,fontSize:11,fontWeight:700,color:$.glow}}>F_gain dominated every phase</div>
                <div style={{fontSize:13,color:$.tx,marginTop:4}}>The physics held even when the statistics broke down</div>
              </div>
              <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>{findOpen===6?"Close":"See proof"}</span>
            </div>
            {findOpen===6 && (
              <div style={{animation:"wup .2s ease both"}}>
                <div style={{marginBottom:12}}>
                  {[
                    {name:"F_gain_mean",val:100,phase:"All phases"},
                    {name:"tau_std",val:72,phase:"Drift + Regime"},
                    {name:"g_mean",val:58,phase:"Stable + Drift"},
                    {name:"H_net",val:41,phase:"Regime only"},
                    {name:"V_weak",val:33,phase:"Attack only"},
                  ].map(function(f){return (
                    <div key={f.name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <div style={{fontFamily:F.m,fontSize:9,color:$.tx2,width:90,textAlign:"right"}}>{f.name}</div>
                      <div style={{flex:1,height:6,background:"rgba(255,255,255,.04)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:f.val+"%",height:"100%",background:f.name==="F_gain_mean"?$.glow:$.dim,opacity:f.name==="F_gain_mean"?0.6:0.25,borderRadius:3}}/>
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

        <div style={{marginTop:28,background:"rgba(248,113,113,.04)",border:"1px solid rgba(248,113,113,.16)",borderRadius:12,padding:"20px 22px"}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.rd,letterSpacing:".06em",marginBottom:10}}>THE BOTTOM LINE</div>
          <p style={{fontSize:14,color:$.tx,lineHeight:1.85,fontFamily:serif}}>A model that scores <strong style={{color:$.glow}}>0.9999</strong> in the lab can still fail silently in the field. The only difference between knowing and not knowing is whether you built the monitoring to detect it</p>
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
          <button onClick={function() { go("demo"); }}
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
    var svmVal = mode === "drift" ? 0.9488 - st * st * 0.22 + noise * 1.5
      : mode === "noise" ? 0.9488 - st * 0.12 - st * st * 0.06 + noise * 2.5
      : 0.9488 - st * st * 0.35 + noise;
    // RF - holds under attack, decent under drift
    var rfVal = mode === "drift" ? 0.9899 - st * st * 0.18 + noise
      : mode === "noise" ? 0.9899 - st * 0.06 - st * st * 0.03 + noise * 1.5
      : 0.9899 - st * st * st * 0.04 + noise;
    // LGBM - between hybrid and SVM
    var lgbmVal = mode === "drift" ? 0.9856 - st * st * 0.19 + noise * 1.2
      : mode === "noise" ? 0.9856 - st * 0.09 - st * st * 0.05 + noise * 1.8
      : 0.9856 - st * st * st * 0.18 + noise;
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
    research: "Measured result: Expected Calibration Error increased 214\u00d7 from baseline across 120 streaming batches (Chapter 4, Section 4.3). AUC degraded from 0.9999 to 0.8834 (Table 6).",
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
    research: "Measured result: SVM flip rate 32.4% vs Random Forest 0.04% under FGSM at \u03b5=0.10, an 800\u00d7 vulnerability difference (Chapter 4, Section 4.5, Table 5).",
    lesson: "Two different AIs looked at the exact same attack. One was tricked a third of the time. The other was tricked 0.04% of the time, basically never. Same attack, completely different result. The type of AI you choose is not just about accuracy. It is about security."
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
    research: "Measured result: Page Hinkley triggered at batch 9, CUSUM at batch 34, PSI at batch 55. Conformal coverage fell from 99.97% to 85.05% (Chapter 4, Sections 4.6\u20134.7, Tables 6\u20138).",
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
        <h1 style={{ fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 600, color: $.tx, textAlign: "center", lineHeight: 1.5, marginBottom: 12, maxWidth: 480 }}>
          You are the grid operator.<br />Three things are about to go wrong.
        </h1>
        <p style={{ fontSize: 13, color: $.tx3, textAlign: "center", lineHeight: 1.8, maxWidth: 440, marginBottom: 8 }}>
          Before each incident, you will get a briefing explaining what is about to happen. Between incidents, you will do small monitoring tasks that keep the grid healthy. When the crisis hits, you will get two options with full explanations of what each one does.
        </p>
        <p style={{ fontSize: 11, color: $.dim, textAlign: "center", lineHeight: 1.7, maxWidth: 400, marginBottom: 32 }}>
          You have 30 seconds to decide each time. There is no trick. The reasoning is right there on the screen. Read it and choose.
        </p>

        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "ACCURACY", sub: "AUC", explain: "How often the model is right" },
            { label: "DATA SHIFT", sub: "PSI", explain: "How much the incoming data has changed" },
            { label: "SAFETY", sub: "COV", explain: "Whether predictions have safety bounds" },
          ].map(m => (
            <div key={m.label} style={{ background: "rgba(255,255,255,.03)", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ fontFamily: F.m, fontSize: 10, color: $.glow, fontWeight: 700 }}>{m.label}</div>
              <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, marginTop: 1 }}>{m.sub}</div>
              <div style={{ fontSize: 9, color: $.tx3, marginTop: 2 }}>{m.explain}</div>
            </div>
          ))}
        </div>

        <button onClick={props.onBack} style={{ background: "transparent", border: "1px solid " + $.brd, borderRadius: 6, color: $.tx2, padding: "8px 16px", fontSize: 11, cursor: "pointer", marginBottom: 16, fontFamily: F.m }}>Back</button>
        <button onClick={() => setPhase("briefing")} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 10, padding: "16px 52px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: F.s }}>Begin Watch</button>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>

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
              The AI failed in both timelines. The only difference is whether anyone could see it happening.
            </div>
            <div style={{ fontSize: 12, color: $.tx3, lineHeight: 1.6, marginTop: 10 }}>
              That is what this project is about. Not building a better AI. Building the system that tells you when to stop trusting it.
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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

  useEffect(function() {
    var t = setTimeout(function() { setLoading(false); }, 2200);
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
        <div style={{ height: "100%", background: $.glow, borderRadius: 1, animation: "wLoad 2s ease-in-out forwards" }} />
      </div>
    </div>
  );

  var pageContent;

  if (page === "command") pageContent = <CommandCentre onBack={function() { setPage("landing"); }} />;
  else if (page === "ops") pageContent = <OpsCenter onBack={function() { setPage("landing"); }} />;
  else {

  var go = function(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  pageContent = (
    <div style={{ background: $.bg, color: $.tx, fontFamily: F.s, overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrollY > 60 ? "rgba(10,14,26,.92)" : "transparent", backdropFilter: scrollY > 60 ? "blur(20px)" : "none", borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,.04)" : "1px solid transparent", transition: "all .5s ease" }}>
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
          <Rv><h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, fontFamily: F.s, marginBottom: 16 }}>What deployment actually looks like</h2></Rv>
          <Rv d={0.08}><p style={{ fontSize: 14, color: $.tx3, maxWidth: 420, margin: "0 auto" }}>Five stages of a model encountering the real world. Navigate with the arrows or let it play.</p></Rv>
        </div>
        <Rv d={0.16}><div style={{ maxWidth: 900, margin: "0 auto" }}><SignatureDemo /></div></Rv>
      </section>

      {/* ═══ EXPLORE ═══ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Rv><h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, fontFamily: F.s, textAlign: "center", marginBottom: 48 }}>Go deeper</h2></Rv>
          <Rv d={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div onClick={function() { setPage("ops"); }}
              style={{ background: $.bg2, borderRadius: 14, padding: "32px 28px", cursor: "pointer", transition: "all .25s" }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,.06)"; }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: 1.5, marginBottom: 12 }}>Interactive</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: $.tx, marginBottom: 10 }}>Operations Centre</div>
              <p style={{ fontSize: 13, color: $.tx3, lineHeight: 1.75, marginBottom: 20 }}>Three incidents. Briefings, mini tasks, timed decisions, and a full debrief</p>
              <span style={{ fontFamily: F.m, fontSize: 11, color: $.glow, fontWeight: 600 }}>Enter →</span>
            </div>
            <div onClick={function() { setPage("command"); }}
              style={{ background: $.bg2, borderRadius: 14, padding: "32px 28px", cursor: "pointer", transition: "all .25s" }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,.06)"; }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: 1.5, marginBottom: 12 }}>Technical</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: $.tx, marginBottom: 10 }}>Dashboard</div>
              <p style={{ fontSize: 13, color: $.tx3, lineHeight: 1.75, marginBottom: 20 }}>120 batches. Full pipeline. Every chart explained.</p>
              <span style={{ fontFamily: F.m, fontSize: 11, color: $.glow, fontWeight: 600 }}>Open →</span>
            </div>
          </div>
          </Rv>
        </div>
      </section>

      {/* ═══ EVIDENCE ═══ */}
      <section id="proof" style={{ padding: "80px 24px 80px", background: $.bg2 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Rv><h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, fontFamily: F.s, marginBottom: 40 }}>What the data showed</h2></Rv>

          {[
            { before: "99.99%", after: "88.34%", tag: "Accuracy", color: $.rd,
              plain: "In the lab, the model got almost every prediction right. Once deployed into the real world, 1 in 9 predictions went wrong. The model did not know it was getting worse",
              technical: "AUC dropped from 0.9999 to 0.8834 across 120 streaming batches under distribution drift, adversarial perturbation, and regime shift" },
            { before: "Accurate", after: "214× wrong", tag: "Confidence", color: $.rd,
              plain: "When the model said \"I am 90% sure this is safe,\" it used to be right. After deployment, that confidence became 214 times less reliable. It was still saying 90% while being wrong",
              technical: "Expected Calibration Error (ECE) increased 214× from baseline. Post-hoc LaSCal recalibration recovered alignment" },
            { before: "Problem visible", after: "26 batches earlier", tag: "Early warning", color: $.glow,
              plain: "The accuracy only visibly dropped at batch 81. But the system spotted something was wrong at batch 55, twenty-six steps earlier. That early warning is the whole point",
              technical: "PSI crossed the 0.25 alert threshold 26 batches before AUC degradation became statistically significant" },
            { before: "19.8% flipped", after: "0.04% flipped", tag: "Attack resistance", color: $.gn,
              plain: "Under standard adversarial robustness testing, one model's predictions flipped almost 20% of the time. A different model held at 0.04%. Same test, different architecture, completely different resilience",
              technical: "SVM RBF flip rate 19.8% under FGSM at ε=0.1. Random Forest flip rate 0.04%, immune due to discrete leaf structure" },
          ].map(function(d, i) { return (
            <Rv key={i} d={0.06 * i}><EvidenceCard d={d} last={i===3} /></Rv>
          ); })}
        </div>
      </section>

      {/* ═══ HONOUR ═══ */}
      <section id="honour" style={{ padding: "60px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <Rv><div style={{ width: 24, height: 1, background: $.glow, margin: "0 auto 28px", opacity: 0.15 }} /></Rv>
          <Rv d={0.1}><p style={{ fontSize: 15, fontStyle: "italic", lineHeight: 2, color: $.tx3, marginBottom: 16 }}>Named for the Women's Royal Naval Service, who served at HMS Vernon, Portsmouth, 1939-1945.</p></Rv>
          <Rv d={0.2}><p style={{ fontSize: 13, lineHeight: 1.9, color: $.dim }}>They sat in signals rooms, detecting anomalies in the noise and warning of danger before it arrived.</p></Rv>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderTop: "1px solid rgba(255,255,255,.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BeaconSmall s={12} />
          <span style={{ fontSize: 9, letterSpacing: 2, color: $.dim, fontFamily: F.m }}>W.R.E.N.</span>
        </div>
        <div style={{ fontSize: 9, color: $.dim }}>University of Portsmouth | 2025-2026</div>
        <div style={{ fontSize: 9, color: $.dim, opacity: 0.5 }}>Powered by A.G.N.E.S. v4.2</div>
      </footer>
    </div>
  );
  }

  var transitioning = fade !== "visible";

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
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
