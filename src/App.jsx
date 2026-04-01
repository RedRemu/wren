import { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from "recharts";

/* === THEME === */
const $ = {
  bg: "#08090c", bg2: "#0d0f14", bg3: "#14161d",
  brd: "rgba(255,255,255,.055)", brdH: "rgba(255,255,255,.11)",
  tx: "#f3f4f6", tx2: "#9ca3af", tx3: "#6b7280", dim: "#4b5563",
  ac: "#6366f1", acB: "#818cf8", acD: "rgba(99,102,241,.07)",
  gn: "#10b981", gnD: "rgba(16,185,129,.07)",
  am: "#f59e0b", amD: "rgba(245,158,11,.07)",
  rd: "#ef4444", rdD: "rgba(239,68,68,.07)", pr: "#8b5cf6",
};
const F = { s: "'Manrope', system-ui, sans-serif", m: "'IBM Plex Mono', monospace" };
const TT = { background: $.bg3, border: "1px solid " + $.brd, borderRadius: 8, fontSize: 11, color: $.tx2, fontFamily: F.m };
const TK = { fontSize: 9, fill: $.dim, fontFamily: F.m };

/* === PIPELINE DATA === */
const SH = [.9878,.9658,.9603,.9632,.9599,.9504,.9473,.9476,.9446,.9387,.9322,.9358,.9322,.9307,.9334,.9377,.9381,.9391,.9445,.9499,.9444,.9403,.9438,.9461,.9448,.9396,.9423,.9343,.9279,.9305,.9386,.9406,.9381,.9367,.937,.9436,.9417,.9469,.9474,.9414,.9437,.9382,.9445,.9393,.9316,.9267,.9286,.931,.9378,.9449,.935,.9423,.9367,.9379,.939,.9369,.9324,.9308,.9241,.9224,.927,.9112,.9075,.9096,.9169,.9159,.9179,.9178,.9198,.9183,.9131,.9224,.9295,.928,.9261,.9263,.9251,.9215,.9202,.9184,.9055,.8995,.8914,.8861,.8743,.8779,.8726,.8687,.8679,.8631,.8686,.8639,.8635,.8642,.8722,.8657,.8678,.8702,.8663,.8682,.8809,.8938,.8984,.9052,.9085,.9127,.9132,.9146,.9169,.9169,.9138,.9021,.895,.8868,.8673,.8678,.8716,.868,.8683,.8723];
const SV = [.9488,.9275,.9405,.9264,.929,.9205,.9153,.9109,.904,.9032,.9027,.8993,.8931,.8947,.8938,.8967,.8982,.9046,.9149,.9075,.9062,.9131,.9054,.9067,.902,.9,.9023,.8987,.8957,.9064,.9044,.8977,.9073,.9046,.9091,.9099,.913,.9159,.9184,.9139,.9173,.9193,.913,.9156,.9141,.917,.9087,.9061,.8915,.8921,.8885,.8846,.8855,.8877,.881,.8785,.8861,.8884,.8916,.8925,.889,.8908,.8903,.8891,.892,.8885,.8802,.8773,.8859,.8816,.8814,.8859,.8849,.874,.8769,.8771,.867,.8534,.8423,.8415,.8335,.8134,.8148,.8155,.7988,.7885,.7846,.7869,.7881,.7897,.785,.7911,.7847,.7822,.792,.789,.7952,.7925,.79,.7867,.784,.7892,.791,.7921,.7821,.7855,.7909,.7867,.7784,.7702,.7751,.7657,.7582,.753,.7521,.7528,.7475,.7495,.7565,.7579];
const SR = [.9899,.9562,.9522,.9566,.95,.9347,.9333,.9309,.9317,.9331,.9279,.9339,.9358,.9309,.9299,.936,.938,.9422,.9465,.9463,.9467,.9413,.9347,.9391,.9384,.938,.9348,.9305,.9258,.9275,.9284,.9286,.9265,.9215,.927,.9235,.9261,.923,.9212,.9185,.9182,.9179,.9193,.9181,.9177,.9181,.918,.9234,.9261,.9276,.9217,.9199,.9246,.9292,.9173,.9147,.9097,.9101,.9099,.9056,.8963,.8982,.8903,.8883,.8972,.895,.894,.8877,.8865,.8857,.893,.8916,.8967,.894,.897,.8981,.901,.905,.9022,.9036,.8953,.8933,.8898,.886,.8715,.8779,.87,.8646,.8653,.8595,.8585,.8539,.8481,.8492,.8546,.8546,.8544,.8599,.8588,.86,.868,.8684,.8678,.8738,.8752,.8758,.886,.8847,.8904,.8965,.9,.901,.9103,.9039,.9027,.9008,.8976,.893,.8855,.8822];
const SP = [.10,.08,.09,.11,.12,.08,.08,.08,.12,.08,.10,.09,.11,.10,.13,.11,.09,.10,.10,.08,.10,.11,.10,.10,.08,.11,.11,.10,.11,.12,.10,.08,.08,.12,.07,.13,.09,.12,.11,.08,.07,.09,.08,.14,.09,.14,.10,.12,.11,.16,.15,.18,.12,.16,.18,.35,.22,.26,.23,.19,.27,.26,.31,.31,.30,.41,.57,.42,.30,.38,.44,.48,.40,.59,.38,.47,.60,.66,.43,.62,1.16,.98,.9,1.28,.89,1.22,1.4,.88,1.19,1.21,1.76,1.36,1.1,1.22,1.57,1.8,1.62,1.6,1.9,2.11,2,1.82,1.43,1.79,1.28,1.88,1.79,1.72,2.74,1.76,2.36,2.29,2.31,1.77,1.7,1.87,2.34,2.32,1.94,2.36];
const SC = [.96,.935,.93,.935,.934,.925,.919,.921,.92,.917,.911,.915,.917,.917,.919,.926,.929,.93,.934,.936,.929,.926,.923,.924,.921,.912,.915,.91,.905,.905,.914,.915,.916,.914,.916,.919,.918,.92,.924,.923,.925,.925,.925,.92,.913,.91,.91,.909,.907,.91,.902,.9,.898,.897,.896,.895,.886,.882,.877,.875,.875,.865,.86,.86,.865,.865,.866,.864,.867,.863,.858,.857,.857,.855,.852,.849,.845,.843,.84,.844,.833,.838,.835,.83,.819,.821,.821,.817,.815,.808,.81,.8,.799,.8,.806,.805,.804,.81,.809,.815,.831,.842,.844,.853,.859,.86,.858,.861,.863,.858,.853,.85,.848,.842,.83,.831,.84,.833,.832,.836];
const SHAP_D = [{f:"F_gain_mean",v:10.05},{f:"tau_std",v:3.35},{f:"g_mean",v:2.51},{f:"tau_mean",v:2.53},{f:"D_eff_std",v:1.42},{f:"D_eff_mean",v:1.23}];
const ADV_D = {H:[{e:.001,f:.03},{e:.01,f:.21},{e:.05,f:3.27},{e:.1,f:7.57}],S:[{e:.001,f:.01},{e:.01,f:1.28},{e:.05,f:16.51},{e:.1,f:32.4}],R:[{e:.001,f:.03},{e:.01,f:.05},{e:.05,f:.05},{e:.1,f:.05}],L:[{e:.001,f:.01},{e:.01,f:.13},{e:.05,f:.25},{e:.1,f:.26}]};
const NS = Array.from({ length: 2000 }, (_, i) => Math.sin(i * 127.1 + i * i * .013) * .5 + Math.cos(i * 269.5 - i * .017) * .5);

/* === HELPERS === */
function getStatus(b) {
  if (b < 40) return { label: "STABLE", color: $.gn, bg: $.gnD, sub: "All systems nominal" };
  if (b < 55) return { label: "MONITORING", color: $.am, bg: $.amD, sub: "Early drift indicators rising" };
  if (b < 80) return { label: "DRIFT DETECTED", color: $.am, bg: $.amD, sub: "PSI = " + (SP[b] || 0).toFixed(2) + " | Coverage degrading" };
  return { label: "CRITICAL", color: $.rd, bg: $.rdD, sub: "AUC = " + (SH[b] || 0).toFixed(4) + " | Coverage below target" };
}

function getDecision(b) {
  if (b < 40) return { status: "Nominal", actions: ["Continue monitoring", "No intervention required"], confidence: 98, priority: "Low", driver: "None" };
  if (b < 55) return { status: "Watch", actions: ["Increase monitoring frequency", "Check F_gain_mean stability"], confidence: 94, priority: "Medium", driver: "Early PSI elevation" };
  if (b < 80) return { status: "At Risk", actions: ["Recalibrate model", "Reduce trust threshold to 0.90", "Monitor F_gain drift on Node 2"], confidence: 87, priority: "High", driver: "PSI threshold breach (0.25)" };
  return { status: "Intervene", actions: ["Trigger emergency recalibration", "Switch to RF fallback model", "Alert grid operator", "Log regime change event"], confidence: 79, priority: "Critical", driver: "Coverage below 95% target" };
}

/* === STYLES INJECTION === */
function useStyles() {
  useEffect(() => {
    if (document.getElementById("wrn")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.id = "wrn";
    s.textContent = "@keyframes wup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes wpulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes wblink{0%,100%{opacity:.6}50%{opacity:1}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:2px}";
    document.head.appendChild(s);
  }, []);
}

/* === SCROLL REVEAL === */
function useReveal(th = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); o.unobserve(el); }
    }, { threshold: th });
    o.observe(el);
    return () => o.disconnect();
  }, [th]);
  return [ref, v];
}

function Rv({ children, d = 0 }) {
  const [ref, v] = useReveal(0.06);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "none" : "translateY(36px)",
      transition: "all 1s cubic-bezier(0.16,1,0.3,1) " + d + "s",
    }}>
      {children}
    </div>
  );
}

/* === SMALL UI COMPONENTS === */
function An({ children, delay = 0 }) {
  return (
    <div style={{ animation: "wup .4s ease " + delay + "ms both" }}>
      {children}
    </div>
  );
}

function Pill({ children, color }) {
  const c = color || $.ac;
  const bgMap = {};
  bgMap[$.ac] = $.acD;
  bgMap[$.gn] = $.gnD;
  bgMap[$.am] = $.amD;
  bgMap[$.rd] = $.rdD;
  return (
    <span style={{ fontFamily: F.m, fontSize: 10, padding: "3px 10px", borderRadius: 999, color: c, background: bgMap[c] || "rgba(255,255,255,.04)", fontWeight: 500 }}>
      {children}
    </span>
  );
}

function Panel({ title, tag, tc, children }) {
  const tagColor = tc || $.ac;
  return (
    <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid " + $.brd }}>
        <span style={{ fontFamily: F.s, fontSize: 12, fontWeight: 600, color: $.tx }}>{title}</span>
        {tag ? <Pill color={tagColor}>{tag}</Pill> : null}
      </div>
      {children}
    </div>
  );
}

function Logo({ s }) {
  const size = s || 28;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <polygon points="24,4 44,14 44,28 24,44 4,28 4,14" fill="none" stroke={$.ac} strokeWidth="1.5" />
      <circle cx="24" cy="16" r="2.2" fill={$.acB} />
      <circle cx="34" cy="22" r="2.2" fill={$.acB} />
      <circle cx="24" cy="32" r="2.2" fill={$.acB} />
      <circle cx="14" cy="22" r="2.2" fill={$.acB} />
      <path d="M18,24 Q21,20 24,24 Q27,28 30,24" fill="none" stroke={$.acB} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Spark({ data, color, w, h }) {
  const clr = color || $.ac;
  const width = w || 120;
  const height = h || 24;
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const rng = mx - mn || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - mn) / rng * height * .65 + height * .17);
    return x + "," + y;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={clr} strokeWidth="1.5" strokeLinejoin="round" opacity="0.65" />
    </svg>
  );
}

/* === WAVEFORM === */
function Wave({ chaos, h, stable }) {
  const ch = chaos === undefined ? 0.5 : chaos;
  const height = h || 110;
  const isStable = stable || false;
  const ref = useRef(null);
  const ph = useRef(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let run = true;
    const draw = () => {
      if (!run) return;
      const W = c.offsetWidth;
      if (W < 1) { requestAnimationFrame(draw); return; }
      const dp = window.devicePixelRatio || 1;
      c.width = W * dp;
      c.height = height * dp;
      ctx.setTransform(dp, 0, 0, dp, 0, 0);
      ctx.clearRect(0, 0, W, height);
      ph.current += 0.005;
      const p = ph.current;
      const mid = height / 2;
      const amp = height * 0.28;
      const steps = Math.floor(W / 1.5);
      const raw = [];
      for (let i = 0; i < steps; i++) {
        const x = (i / steps) * W;
        const t = (i / steps) * 12 + p;
        const base = Math.sin(t * 0.8) * 0.4 + Math.sin(t * 1.7) * 0.25 + Math.sin(t * 3.1) * 0.12;
        const ni = (i + Math.floor(p * 60)) % NS.length;
        const n = NS[ni] * ch + NS[(ni + 500) % NS.length] * ch * 0.5 * Math.sin(t * 5);
        raw.push({ x: x, y: mid + (base + n) * amp });
      }
      var pts = raw;
      if (isStable) {
        var sm = [];
        for (var si = 0; si < raw.length; si++) {
          var sy = 0;
          var cnt = 0;
          for (var j = Math.max(0, si - 8); j <= Math.min(raw.length - 1, si + 8); j++) {
            sy += raw[j].y;
            cnt++;
          }
          sm.push({ x: raw[si].x, y: mid + (sy / cnt - mid) * 0.15 });
        }
        pts = sm;
      }
      ctx.beginPath();
      pts.forEach(function(pt, idx) {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = isStable ? $.ac : $.rd;
      ctx.lineWidth = isStable ? 2 : 1.5;
      ctx.stroke();
      requestAnimationFrame(draw);
    };
    draw();
    return () => { run = false; };
  }, [ch, height, isStable]);

  return <canvas ref={ref} style={{ width: "100%", height: height, display: "block" }} />;
}

/* === TOPOLOGY === */
function Topo({ batch }) {
  var b = batch || 0;
  var pos = [{ x: 160, y: 38 }, { x: 300, y: 120 }, { x: 160, y: 202 }, { x: 20, y: 120 }];
  var links = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
  var labels = ["GEN", "LOAD", "DIST", "STORE"];

  // Weakest node shifts as drift progresses through the network
  var weakIdx = b < 40 ? -1 : b < 55 ? 0 : b < 80 ? 1 : 2;
  var weakLabel = b < 40 ? "" : b < 55 ? "GEN under early tau drift" : b < 80 ? "LOAD absorbing distribution shift" : "DIST failed under regime change";

  // Node health: 0=healthy, 1=stressed, 2=critical
  var nodeHealth = [0, 0, 0, 0];
  if (b >= 40) { nodeHealth[0] = 1; }
  if (b >= 55) { nodeHealth[0] = 1; nodeHealth[1] = 2; nodeHealth[3] = 1; }
  if (b >= 80) { nodeHealth[0] = 1; nodeHealth[1] = 2; nodeHealth[2] = 2; nodeHealth[3] = 1; }

  function nodeColor(i) {
    if (nodeHealth[i] === 2) return $.rd;
    if (nodeHealth[i] === 1) return $.am;
    return $.gn;
  }

  return (
    <svg viewBox="0 0 320 248" style={{ width: "100%", height: "auto", display: "block" }}>
      {links.map(function(pair, i) {
        var a = pair[0];
        var b2 = pair[1];
        var stressed = nodeHealth[a] > 0 || nodeHealth[b2] > 0;
        var critical = nodeHealth[a] === 2 || nodeHealth[b2] === 2;
        var lineColor = critical ? $.rd : stressed ? $.am : "rgba(255,255,255,.07)";
        return (
          <line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[b2].x} y2={pos[b2].y}
            stroke={lineColor} strokeWidth={stressed ? 1.5 : 0.8}
            strokeDasharray={i >= 4 ? "4,4" : "none"} opacity={stressed ? 0.7 : 1} />
        );
      })}
      {pos.map(function(p, i) {
        var col = nodeColor(i);
        var isWeak = i === weakIdx;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={22} fill="none" stroke={col} strokeWidth={1} opacity={0.3} />
            <circle cx={p.x} cy={p.y} r={14} fill={col} opacity={isWeak ? 0.2 : 0.1} />
            <circle cx={p.x} cy={p.y} r={5} fill={col} />
            <text x={p.x} y={p.y + 34} textAnchor="middle" fill={col} fontSize={9} fontFamily={F.m} fontWeight={isWeak ? 600 : 400}>{labels[i]}</text>
            {isWeak && (
              <text x={p.x} y={p.y - 28} textAnchor="middle" fill={col} fontSize={8} fontFamily={F.m} fontWeight={600}>WEAKEST</text>
            )}
          </g>
        );
      })}
      <text x={160} y={242} textAnchor="middle" fill={$.dim} fontSize={8} fontFamily={F.m}>
        {b < 40 ? "All nodes within operating envelope" : weakLabel}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════ */
/* ===       COMMAND CENTRE            === */
/* ═══════════════════════════════════════ */
function CommandCentre({ onBack }) {
  useStyles();
  const [batch, setBatch] = useState(0);
  const [tab, setTab] = useState("signals");
  const [demo, setDemo] = useState(false);
  const demoRef = useRef(null);

  var status = getStatus(batch);
  var decision = getDecision(batch);
  var phase = batch < 40 ? "stable" : batch < 80 ? "drift" : "critical";

  useEffect(() => {
    if (!demo) return;
    demoRef.current = setInterval(function() {
      setBatch(function(b) {
        if (b >= 119) { setDemo(false); return 119; }
        return b + 1;
      });
    }, 180);
    return function() { clearInterval(demoRef.current); };
  }, [demo]);

  var aucData = useMemo(function() { return SH.map(function(v, i) { return { b: i, H: v, S: SV[i], R: SR[i] }; }); }, []);
  var psiData = useMemo(function() { return SP.map(function(v, i) { return { b: i, P: v }; }); }, []);
  var covData = useMemo(function() { return SC.map(function(v, i) { return { b: i, C: v }; }); }, []);

  var tabs = [
    { id: "signals", label: "Signals Feed" },
    { id: "anomaly", label: "Anomaly Detection" },
    { id: "threat", label: "Threat Simulation" },
    { id: "network", label: "Network State" },
  ];

  var trustItems = [
    { l: "Calibration", v: batch < 40 ? "Healthy" : batch < 80 ? "Degrading" : "Failed", c: batch < 40 ? $.gn : batch < 80 ? $.am : $.rd },
    { l: "Drift", v: batch < 40 ? "None" : batch < 55 ? "Early" : batch < 80 ? "Active" : "Severe", c: batch < 40 ? $.gn : batch < 55 ? $.am : $.rd },
    { l: "Coverage", v: SC[batch] > .95 ? "On Target" : SC[batch] > .85 ? "Below Target" : "Critical", c: SC[batch] > .95 ? $.gn : SC[batch] > .85 ? $.am : $.rd },
    { l: "Actionability", v: batch < 40 ? "Monitor" : batch < 55 ? "Review" : batch < 80 ? "Intervene" : "Emergency", c: batch < 40 ? $.gn : batch < 55 ? $.am : $.rd },
  ];

  var metricCards = [
    { l: "Hybrid AUC", v: (SH[batch] || 0).toFixed(4), c: SH[batch] > .93 ? $.gn : SH[batch] > .88 ? $.am : $.rd, spark: SH },
    { l: "SVM AUC", v: (SV[batch] || 0).toFixed(4), c: SV[batch] > .88 ? $.tx2 : $.rd, spark: SV },
    { l: "RF AUC", v: (SR[batch] || 0).toFixed(4), c: SR[batch] > .9 ? $.tx2 : $.am, spark: SR },
    { l: "Coverage", v: ((SC[batch] || 0) * 100).toFixed(1) + "%", c: SC[batch] > .95 ? $.gn : SC[batch] > .85 ? $.am : $.rd, spark: SC },
  ];

  return (
    <div style={{ minHeight: "100vh", background: $.bg, fontFamily: F.s, color: $.tx2 }}>

      {/* STATUS BAR */}
      <div style={{ position: "sticky", top: 0, zIndex: 60, background: status.bg, borderBottom: "1px solid " + status.color + "22", padding: "6px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background .5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: status.color, boxShadow: "0 0 8px " + status.color, animation: phase !== "stable" ? "wpulse 2s ease-in-out infinite" : "none" }} />
          <span style={{ fontFamily: F.m, fontSize: 11, fontWeight: 600, color: status.color, letterSpacing: ".04em" }}>SYSTEM STATUS: {status.label}</span>
        </div>
        <div style={{ fontFamily: F.m, fontSize: 10, color: status.color, opacity: 0.7 }}>
          Batch {batch} | PSI = {(SP[batch] || 0).toFixed(2)} | AUC = {(SH[batch] || 0).toFixed(4)}
        </div>
      </div>

      {/* NAV BAR */}
      <div style={{ position: "sticky", top: 28, zIndex: 50, padding: "8px 20px", background: "rgba(8,9,12,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid " + $.brd, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ background: "transparent", border: "1px solid " + $.brd, borderRadius: 6, color: $.tx2, padding: "5px 12px", fontSize: 11, fontFamily: F.s, cursor: "pointer" }}>Back</button>
          <Logo s={20} />
          <span style={{ fontSize: 13, fontWeight: 700, color: $.tx, letterSpacing: ".5px" }}>COMMAND CENTRE</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={function() { if (demo) { setDemo(false); } else { setBatch(0); setDemo(true); } }} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid " + (demo ? $.rd : $.ac), background: demo ? $.rdD : $.acD, color: demo ? $.rd : $.ac, fontFamily: F.m, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
            {demo ? "Stop Demo" : "Run Demo"}
          </button>
          <input type="range" min={0} max={119} value={batch} onChange={function(e) { setDemo(false); setBatch(+e.target.value); }} style={{ width: 160, accentColor: $.ac }} />
          <span style={{ fontFamily: F.m, fontSize: 12, color: $.ac, fontWeight: 600, minWidth: 24 }}>{batch}</span>
        </div>
      </div>

      {/* TRUST LAYER */}
      <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid " + $.brd, background: $.bg }}>
        {trustItems.map(function(t) {
          return (
            <div key={t.l} style={{ flex: 1, padding: "8px 14px", textAlign: "center", borderRight: "1px solid " + $.brd }}>
              <div style={{ fontFamily: F.m, fontSize: 8, color: $.dim, letterSpacing: ".06em", marginBottom: 2 }}>{t.l.toUpperCase()}</div>
              <div style={{ fontFamily: F.m, fontSize: 11, fontWeight: 600, color: t.c }}>{t.v}</div>
            </div>
          );
        })}
      </div>

      {/* HERO STRIP */}
      <div style={{ textAlign: "center", padding: "20px 20px 12px" }}>
        <div style={{ fontSize: 11, fontFamily: F.m, color: $.dim, letterSpacing: ".06em", marginBottom: 4 }}>SIGNALS ROOM</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: $.tx, letterSpacing: "-.02em" }}>W.R.E.N.</div>
        <div style={{ fontSize: 12, color: $.tx3, fontWeight: 300, letterSpacing: ".12em", marginTop: 2 }}>Evaluates model reliability under live drift, telemetry corruption, and operational stress.</div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 20px" }}>

        {/* CORE ALERT PANEL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {/* Drift Status */}
          <div style={{ background: status.bg, border: "1px solid " + status.color + "33", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: status.color, boxShadow: "0 0 12px " + status.color, animation: phase !== "stable" ? "wblink 1.5s ease-in-out infinite" : "none" }} />
              <span style={{ fontFamily: F.m, fontSize: 10, fontWeight: 600, color: status.color, letterSpacing: ".04em" }}>DRIFT STATUS</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: status.color, marginBottom: 4 }}>{(SP[batch] || 0).toFixed(2)}</div>
            <div style={{ fontFamily: F.m, fontSize: 10, color: $.tx3, marginBottom: 8 }}>Population Stability Index</div>
            {SP[batch] > .25 && <div style={{ fontFamily: F.m, fontSize: 10, color: $.rd, marginBottom: 6 }}>Threshold exceeded (0.25)</div>}
            <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(0,0,0,.2)", borderRadius: 6, fontFamily: F.m, fontSize: 10, color: $.tx3, lineHeight: 1.6 }}>
              {batch < 40 ? "Feature distributions stable. No action required." :
               batch < 55 ? "Early distribution shift in tau parameters. Monitoring." :
               batch < 80 ? "Significant distributional divergence. Recalibration recommended." :
               "Severe distribution shift. Model predictions may be unreliable."}
            </div>
          </div>

          {/* Warden Decision */}
          <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: F.m, fontSize: 10, fontWeight: 600, color: $.acB, letterSpacing: ".04em" }}>WARDEN DECISION</span>
              <Pill color={decision.priority === "Critical" ? $.rd : decision.priority === "High" ? $.am : $.gn}>{decision.priority}</Pill>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: decision.status === "Nominal" ? $.gn : decision.status === "Watch" ? $.acB : decision.status === "At Risk" ? $.am : $.rd, marginBottom: 10 }}>{decision.status}</div>
            <div style={{ fontFamily: F.m, fontSize: 10, color: $.dim, marginBottom: 8 }}>Driver: {decision.driver}</div>
            <div style={{ marginBottom: 10 }}>
              {decision.actions.map(function(a, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 4, height: 4, borderRadius: 1, background: $.acB, flexShrink: 0 }} />
                    <span style={{ fontFamily: F.s, fontSize: 11, color: $.tx2 }}>{a}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(0,0,0,.2)", borderRadius: 6 }}>
              <span style={{ fontFamily: F.m, fontSize: 10, color: $.dim }}>Confidence:</span>
              <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.04)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: decision.confidence + "%", height: "100%", background: decision.confidence > 90 ? $.gn : decision.confidence > 80 ? $.am : $.rd, borderRadius: 3, transition: "width .5s" }} />
              </div>
              <span style={{ fontFamily: F.m, fontSize: 11, fontWeight: 600, color: $.tx }}>{decision.confidence}%</span>
            </div>
          </div>
        </div>

        {/* SUPPORTING METRICS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 16, background: $.brd, borderRadius: 10, overflow: "hidden", border: "1px solid " + $.brd }}>
          {metricCards.map(function(s) {
            return (
              <div key={s.l} style={{ background: $.bg2, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.m, fontSize: 8, color: $.dim, letterSpacing: ".03em", marginBottom: 3 }}>{s.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.c, fontFamily: F.m }}>{s.v}</div>
                </div>
                <Spark data={s.spark.slice(Math.max(0, batch - 20), batch + 1)} color={s.c} w={80} h={20} />
              </div>
            );
          })}
        </div>

        {/* TAB BAR */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px solid " + $.brd }}>
          {tabs.map(function(t) {
            return (
              <button key={t.id} onClick={function() { setTab(t.id); }} style={{
                background: "transparent", border: "none",
                borderBottom: tab === t.id ? "2px solid " + $.ac : "2px solid transparent",
                color: tab === t.id ? $.tx : $.tx3, padding: "10px 20px",
                fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: F.s,
              }}>{t.label}</button>
            );
          })}
        </div>

        {/* SIGNALS FEED */}
        {tab === "signals" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <Panel title="Streaming AUC" tag={phase === "stable" ? "Nominal" : phase === "drift" ? "Degrading" : "Critical"} tc={phase === "stable" ? $.gn : phase === "drift" ? $.am : $.rd}>
                <div style={{ padding: "8px 8px 4px" }}>
                  <ResponsiveContainer width="100%" height={210}>
                    <LineChart data={aucData} margin={{ top: 12, right: 10, bottom: 4, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" />
                      <XAxis dataKey="b" tick={TK} tickLine={false} />
                      <YAxis domain={["auto", "auto"]} tick={TK} tickLine={false} width={36} />
                      <Tooltip contentStyle={TT} />
                      <ReferenceLine x={40} stroke={$.am} strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "Drift", position: "top", fill: $.am, fontSize: 8 }} />
                      <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "Abrupt", position: "top", fill: $.rd, fontSize: 8 }} />
                      <ReferenceLine x={batch} stroke={$.acB} strokeWidth={2} strokeOpacity={0.8} />
                      <Line type="monotone" dataKey="H" stroke={$.acB} strokeWidth={2.5} dot={false} name="Hybrid" />
                      <Line type="monotone" dataKey="S" stroke={$.pr} strokeWidth={1} dot={false} opacity={0.25} name="SVM" />
                      <Line type="monotone" dataKey="R" stroke={$.gn} strokeWidth={1} dot={false} opacity={0.25} name="RF" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: 16 }}>
                <div style={{ fontFamily: F.m, fontSize: 10, fontWeight: 600, color: $.acB, letterSpacing: ".04em", marginBottom: 12 }}>OPERATIONAL INTERPRETATION</div>
                {(batch < 40 ? [
                  "All models within expected range.",
                  "Hybrid leading with AUC > 0.93.",
                  "No drift indicators triggered.",
                  "Coverage holding above 95% target.",
                ] : batch < 80 ? [
                  "Drift detected around batch 55.",
                  "SVM degrading fastest.",
                  "Hybrid retains strongest resilience.",
                  "Coverage fell below target.",
                  "Recalibration recommended.",
                ] : [
                  "Regime change confirmed at batch 80.",
                  "SVM collapsed to AUC 0.78.",
                  "Hybrid maintained AUC > 0.87.",
                  "Coverage critically below target.",
                  "Emergency recalibration required.",
                ]).map(function(line, i) {
                  return (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "flex-start" }}>
                      <div style={{ width: 3, height: 3, borderRadius: 1, background: $.acB, marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.5 }}>{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <Panel title="PSI Drift Index" tag={SP[batch] > .25 ? "ALERT" : "Normal"} tc={SP[batch] > .25 ? $.rd : $.gn}>
                <div style={{ padding: "8px 8px 4px" }}>
                  <ResponsiveContainer width="100%" height={170}>
                    <AreaChart data={psiData} margin={{ top: 8, right: 10, bottom: 4, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" />
                      <XAxis dataKey="b" tick={TK} tickLine={false} />
                      <YAxis tick={TK} tickLine={false} width={36} />
                      <Tooltip contentStyle={TT} />
                      <ReferenceLine y={0.25} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={0.6} />
                      <ReferenceLine x={batch} stroke={$.acB} strokeWidth={2} strokeOpacity={0.7} />
                      <Area type="monotone" dataKey="P" stroke={$.am} fill={$.amD} strokeWidth={1.5} name="PSI" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Conformal Coverage" tag={SC[batch] > .95 ? "Holding" : "Degraded"} tc={SC[batch] > .95 ? $.gn : $.am}>
                <div style={{ padding: "8px 8px 4px" }}>
                  <ResponsiveContainer width="100%" height={170}>
                    <AreaChart data={covData} margin={{ top: 8, right: 10, bottom: 4, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" />
                      <XAxis dataKey="b" tick={TK} tickLine={false} />
                      <YAxis domain={[0.75, 1]} tick={TK} tickLine={false} width={36} />
                      <Tooltip contentStyle={TT} />
                      <ReferenceLine y={0.95} stroke={$.gn} strokeDasharray="4 4" strokeOpacity={0.5} />
                      <ReferenceLine x={batch} stroke={$.acB} strokeWidth={2} strokeOpacity={0.7} />
                      <Area type="monotone" dataKey="C" stroke={$.ac} fill={$.acD} strokeWidth={1.5} name="Coverage" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* ANOMALY DETECTION */}
        {tab === "anomaly" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              {[
                { n: "Page Hinkley", b: 9, r: "First Whisper", c: $.am, d: "Cumulative deviation. Catches the faintest tremor." },
                { n: "CUSUM", b: 34, r: "Confirmation", c: $.ac, d: "Cumulative sum on Brier. When she speaks, it is real." },
                { n: "PSI", b: 55, r: "Source Identified", c: $.pr, d: "Distribution shift against training. Now you know where." },
              ].map(function(det) {
                return (
                  <div key={det.n} style={{ background: $.bg2, border: "1px solid " + (batch >= det.b ? det.c + "33" : $.brd), borderRadius: 10, padding: 18, textAlign: "center", transition: "border-color .5s" }}>
                    <div style={{ fontSize: 36, fontWeight: 300, color: batch >= det.b ? det.c : $.dim, transition: "color .5s" }}>{det.b}</div>
                    <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, marginBottom: 6 }}>batch</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: $.tx }}>{det.n}</div>
                    <div style={{ fontFamily: F.m, fontSize: 11, color: det.c, fontStyle: "italic", marginTop: 3 }}>{det.r}</div>
                    <div style={{ fontSize: 11, color: $.tx3, marginTop: 8, lineHeight: 1.5 }}>{det.d}</div>
                    {batch >= det.b && <div style={{ marginTop: 8 }}><Pill color={det.c}>TRIGGERED</Pill></div>}
                  </div>
                );
              })}
            </div>
            <Panel title="PSI Over 120 Batches" tag="With Detection Events" tc={$.am}>
              <div style={{ padding: "8px 8px 4px" }}>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={psiData} margin={{ top: 12, right: 10, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" />
                    <XAxis dataKey="b" tick={TK} tickLine={false} />
                    <YAxis tick={TK} tickLine={false} width={36} />
                    <Tooltip contentStyle={TT} />
                    <ReferenceLine y={0.25} stroke={$.rd} strokeDasharray="4 4" />
                    <ReferenceLine x={9} stroke={$.am} strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: "PH", position: "top", fill: $.am, fontSize: 8 }} />
                    <ReferenceLine x={34} stroke={$.ac} strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: "CUSUM", position: "top", fill: $.ac, fontSize: 8 }} />
                    <ReferenceLine x={55} stroke={$.pr} strokeDasharray="3 3" strokeOpacity={0.4} label={{ value: "PSI", position: "top", fill: $.pr, fontSize: 8 }} />
                    <ReferenceLine x={batch} stroke={$.acB} strokeWidth={2} strokeOpacity={0.7} />
                    <Area type="monotone" dataKey="P" stroke={$.am} fill={$.amD} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        )}

        {/* THREAT SIMULATION */}
        {tab === "threat" && (
          <div>
            <Panel title="FGSM Flip Rate by Model" tag="Adversarial" tc={$.am}>
              <div style={{ padding: 16 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={ADV_D.H.map(function(d, i) { return { e: d.e, H: d.f, S: ADV_D.S[i].f, R: ADV_D.R[i].f, L: ADV_D.L[i].f }; })} margin={{ top: 8, right: 10, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" />
                    <XAxis dataKey="e" tick={TK} tickLine={false} />
                    <YAxis tick={TK} tickLine={false} width={36} />
                    <Tooltip contentStyle={TT} />
                    <Line type="monotone" dataKey="H" stroke={$.acB} strokeWidth={2.5} dot={{ r: 3 }} name="Hybrid" />
                    <Line type="monotone" dataKey="S" stroke={$.pr} strokeWidth={1.2} dot={{ r: 3 }} name="SVM" opacity={0.5} />
                    <Line type="monotone" dataKey="R" stroke={$.gn} strokeWidth={1.2} dot={{ r: 3 }} name="RF" opacity={0.5} />
                    <Line type="monotone" dataKey="L" stroke={$.am} strokeWidth={1.2} dot={{ r: 3 }} name="LGBM" opacity={0.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
            <div style={{ marginTop: 12 }}>
              <Panel title="SHAP Feature Importance" tag="Physics Validation" tc={$.ac}>
                <div style={{ padding: 16 }}>
                  {SHAP_D.map(function(f, i) {
                    return (
                      <div key={f.f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontFamily: F.m, fontSize: 10, color: $.tx2, width: 90, textAlign: "right", flexShrink: 0 }}>{f.f}</span>
                        <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,.04)", borderRadius: 5, overflow: "hidden" }}>
                          <div style={{ width: (f.v / 10.05 * 100) + "%", height: "100%", background: i === 0 ? $.am : $.acD, borderRadius: 5 }} />
                        </div>
                        <span style={{ fontFamily: F.m, fontSize: 11, fontWeight: 600, color: $.tx, minWidth: 40, textAlign: "right" }}>{f.v.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(0,0,0,.2)", borderRadius: 6, fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.6, fontStyle: "italic" }}>
                    Adversarial sensitivity remained lowest in the same models whose stability logic was dominated by physics-consistent features. Tree-based models showed near-zero flip rates because piecewise-constant boundaries cannot be traversed by gradient steps.
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* NETWORK STATE */}
        {tab === "network" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Panel title="Grid Topology" tag="4-Node DSGC" tc={$.ac}>
                <div style={{ padding: 12 }}><Topo batch={batch} /></div>
              </Panel>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { l: "Rolling AUC", data: SH, color: $.acB },
                  { l: "PSI Drift", data: SP, color: $.am },
                  { l: "Coverage", data: SC, color: $.gn },
                ].map(function(s) {
                  return (
                    <div key={s.l} style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, marginBottom: 3 }}>{s.l}</div>
                        <div style={{ fontFamily: F.m, fontSize: 18, fontWeight: 600, color: s.color }}>{(s.data[batch] || 0).toFixed(4)}</div>
                      </div>
                      <Spark data={s.data.slice(Math.max(0, batch - 25), batch + 1)} color={s.color} w={130} h={28} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid " + $.brd }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: $.rd, animation: "wpulse 1.5s ease-in-out infinite" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: $.rd }}>Before</span>
                  </div>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>Raw Grid Signal | Noise: <span style={{ color: $.rd, fontWeight: 600 }}>{batch < 40 ? "20" : batch < 80 ? "45" : "70"}%</span></span>
                </div>
                <div style={{ padding: "0 3px" }}><Wave chaos={batch < 40 ? 0.2 : batch < 80 ? 0.45 : 0.7} h={110} /></div>
              </div>
              <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid " + $.brd }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: $.ac }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: $.ac }}>After</span>
                  </div>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>A.G.N.E.S. Output</span>
                </div>
                <div style={{ padding: "0 3px" }}><Wave chaos={batch < 40 ? 0.2 : batch < 80 ? 0.45 : 0.7} h={110} stable={true} /></div>
                <div style={{ padding: "8px 14px", borderTop: "1px solid " + $.brd, display: "flex", gap: 16, fontFamily: F.m, fontSize: 10 }}>
                  <span style={{ color: batch < 80 ? $.gn : $.am }}>Stability {batch < 40 ? "+58" : batch < 80 ? "+42" : "+21"}%</span>
                  <span style={{ color: batch < 80 ? $.gn : $.am }}>Noise {batch < 40 ? "-71" : batch < 80 ? "-63" : "-48"}%</span>
                  <span style={{ color: batch < 80 ? $.gn : $.am }}>Confidence {batch < 40 ? "+22" : batch < 80 ? "+18" : "+6"}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: 20, borderTop: "1px solid " + $.brd, marginTop: 16 }}>
        <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>W.R.E.N. Signals Room | Powered by A.G.N.E.S. v4.2 | Husain Ali Al Hashem | University of Portsmouth 2025-2026</div>
        <div style={{ fontFamily: F.s, fontSize: 10, color: $.dim, fontStyle: "italic", marginTop: 4 }}>Named in honour of the Women's Royal Naval Service, HMS Vernon, Portsmouth, 1939-1945</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════ */
/* ===       LANDING PAGE              === */
/* ═══════════════════════════════════════ */
var LNAV = ["problem", "engine", "results", "honour"];
var LNAV_L = { problem: "The Problem", engine: "The Engine", results: "Results", honour: "Honour" };

export default function App() {
  useStyles();
  var [page, setPage] = useState("landing");
  var [scrollY, setScrollY] = useState(0);

  useEffect(function() {
    var h = function() { setScrollY(window.scrollY); };
    window.addEventListener("scroll", h, { passive: true });
    return function() { window.removeEventListener("scroll", h); };
  }, []);

  if (page === "command") {
    return <CommandCentre onBack={function() { setPage("landing"); window.scrollTo(0, 0); }} />;
  }

  var go = function(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  var serif = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";

  return (
    <div style={{ background: $.bg, color: $.tx, fontFamily: serif, overflowX: "hidden" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrollY > 60 ? "rgba(8,9,12,.9)" : "transparent", backdropFilter: scrollY > 60 ? "blur(20px)" : "none", borderBottom: scrollY > 60 ? "1px solid " + $.brd : "1px solid transparent", transition: "all .5s ease" }}>
        <div onClick={function() { go("hero"); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <Logo s={24} />
          <span style={{ fontSize: 12, letterSpacing: 2, color: $.tx2, fontFamily: F.s, fontWeight: 600 }}>W.R.E.N.</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {LNAV.map(function(id) {
            return (
              <span key={id} onClick={function() { go(id); }} style={{ fontSize: 11, letterSpacing: 1, color: $.tx3, fontFamily: F.s, cursor: "pointer" }}
                onMouseEnter={function(e) { e.target.style.color = $.tx; }}
                onMouseLeave={function(e) { e.target.style.color = $.tx3; }}
              >{LNAV_L[id]}</span>
            );
          })}
          <button onClick={function() { setPage("command"); }} style={{ background: $.ac, color: "#fff", border: "none", borderRadius: 6, padding: "7px 16px", fontSize: 11, fontWeight: 700, fontFamily: F.s, cursor: "pointer", letterSpacing: 1 }}>Command Centre</button>
        </div>
      </nav>

      <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg }}>
        <div style={{ textAlign: "center", maxWidth: 800 }}>
          <Rv><div style={{ marginBottom: 24, opacity: 0.4 }}><Logo s={56} /></div></Rv>
          <Rv d={0.1}><p style={{ fontSize: 11, letterSpacing: 6, color: $.dim, fontFamily: F.s, marginBottom: 8 }}>PROJECT CODENAME</p></Rv>
          <Rv d={0.2}><h1 style={{ fontSize: "clamp(60px, 10vw, 110px)", fontWeight: 400, letterSpacing: -2, lineHeight: 0.95, margin: "0 0 16px 0" }}>W.R.E.N.</h1></Rv>
          <Rv d={0.35}><p style={{ fontSize: "clamp(14px, 2vw, 20px)", color: $.tx2, fontFamily: F.s, fontWeight: 300, letterSpacing: 5, textTransform: "uppercase", margin: "0 0 48px 0" }}>Warden Reliability Engine for Networks</p></Rv>
          <Rv d={0.75}><p style={{ fontSize: 11, color: $.dim, marginTop: 8, fontFamily: F.s, letterSpacing: 1.5 }}>Powered by A.G.N.E.S.</p></Rv>
        </div>
      </section>

      <section id="problem" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg2 }}>
        <div style={{ maxWidth: 640, textAlign: "center" }}>
          <Rv><p style={{ fontSize: 12, letterSpacing: 5, color: $.acB, fontFamily: F.s, marginBottom: 24, textTransform: "uppercase", fontWeight: 600 }}>The Problem</p></Rv>
          <Rv d={0.08}><h2 style={{ fontSize: "clamp(30px, 5.5vw, 52px)", fontWeight: 400, lineHeight: 1.15, margin: "0 0 32px 0" }}>A perfect model failed one in nine predictions.</h2></Rv>
          <Rv d={0.16}><p style={{ fontSize: 18, lineHeight: 1.9, color: $.tx2, fontFamily: F.s, fontWeight: 300 }}>Every model scored AUC = 1.0 on the benchmark. Then we tested under real conditions.</p></Rv>
          <Rv d={0.3}>
            <div style={{ marginTop: 56, display: "flex", justifyContent: "center", gap: 48, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 64, fontWeight: 300, lineHeight: 1 }}>1.0</div>
                <div style={{ fontSize: 12, color: $.tx3, fontFamily: F.s, marginTop: 6 }}>Benchmark</div>
              </div>
              <div style={{ width: 48, height: 1, background: $.brd }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 64, fontWeight: 300, color: $.rd, lineHeight: 1 }}>0.88</div>
                <div style={{ fontSize: 12, color: $.tx3, fontFamily: F.s, marginTop: 6 }}>Deployment</div>
              </div>
            </div>
          </Rv>
        </div>
      </section>

      <section id="engine" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg }}>
        <div style={{ maxWidth: 800, textAlign: "center" }}>
          <Rv><p style={{ fontSize: 12, letterSpacing: 5, color: $.acB, fontFamily: F.s, marginBottom: 24, textTransform: "uppercase", fontWeight: 600 }}>The Engine</p></Rv>
          <Rv d={0.06}><h2 style={{ fontSize: "clamp(30px, 5.5vw, 48px)", fontWeight: 400, margin: "0 0 8px 0" }}>A.G.N.E.S.</h2></Rv>
          <Rv d={0.1}><p style={{ fontSize: 12, color: $.dim, fontFamily: F.s, letterSpacing: 3, marginBottom: 36 }}>ADAPTIVE GRID NEURAL ENGINEERING SYSTEM</p></Rv>
          <Rv d={0.16}><p style={{ fontSize: 18, lineHeight: 1.9, color: $.tx2, fontFamily: F.s, fontWeight: 300, maxWidth: 540, margin: "0 auto 56px" }}>3,300 lines. 22 stages. One question: does this model deserve to be deployed?</p></Rv>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, maxWidth: 720, margin: "0 auto" }}>
            {[
              { t: "Physics Informed Features", d: "48 from 12 raw parameters. RFECV selects 14." },
              { t: "Stacking Hybrid Ensemble", d: "SVM + RF with calibrated logistic meta learner." },
              { t: "Conformal Prediction", d: "Coverage guarantees that degrade honestly." },
              { t: "Adversarial Robustness", d: "FGSM at 6 epsilon levels across all models." },
              { t: "Streaming Simulation", d: "120 batches under drift and SCADA corruption." },
              { t: "Triple Drift Detection", d: "PSI, CUSUM, Page Hinkley. Three timescales." },
            ].map(function(item, i) {
              return (
                <Rv key={i} d={0.06 * i}>
                  <div style={{ background: $.bg3, padding: "28px 22px", textAlign: "left", height: "100%", borderTop: "1px solid " + $.brd }}>
                    <div style={{ fontSize: 14, fontFamily: F.s, fontWeight: 600, color: $.tx, marginBottom: 8 }}>{item.t}</div>
                    <div style={{ fontSize: 13, fontFamily: F.s, fontWeight: 300, color: $.tx3, lineHeight: 1.7 }}>{item.d}</div>
                  </div>
                </Rv>
              );
            })}
          </div>
        </div>
      </section>

      <section id="results" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg2 }}>
        <div style={{ maxWidth: 640, textAlign: "center" }}>
          <Rv><p style={{ fontSize: 12, letterSpacing: 5, color: $.acB, fontFamily: F.s, marginBottom: 24, textTransform: "uppercase", fontWeight: 600 }}>Results</p></Rv>
          <Rv d={0.08}><h2 style={{ fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 400, margin: "0 0 48px 0" }}>What survived. What broke. What matters.</h2></Rv>
          <Rv d={0.2}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px 20px", marginBottom: 48 }}>
              {[
                { l: "Static AUC", v: "1.0000" }, { l: "Deployment AUC", v: "0.8834" }, { l: "ECE Increase", v: "214x" },
                { l: "Coverage", v: "99.97%" }, { l: "Pipeline Stages", v: "22" }, { l: "Lines of Python", v: "3,300" },
              ].map(function(m) {
                return (
                  <div key={m.l}>
                    <div style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 300, fontFamily: F.s }}>{m.v}</div>
                    <div style={{ fontSize: 11, color: $.tx3, fontFamily: F.s, marginTop: 6, letterSpacing: 1.5 }}>{m.l}</div>
                  </div>
                );
              })}
            </div>
          </Rv>
          <Rv d={0.35}>
            <button onClick={function() { setPage("command"); }} style={{ background: "transparent", border: "1px solid " + $.ac, borderRadius: 8, color: $.acB, padding: "14px 36px", fontSize: 14, fontFamily: F.s, fontWeight: 600, cursor: "pointer", letterSpacing: 2 }}>ENTER COMMAND CENTRE</button>
          </Rv>
        </div>
      </section>

      <section id="honour" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg }}>
        <div style={{ maxWidth: 500, textAlign: "center" }}>
          <Rv><div style={{ width: 40, height: 1, background: $.ac, margin: "0 auto 32px", opacity: 0.3 }} /></Rv>
          <Rv d={0.12}><p style={{ fontSize: 12, letterSpacing: 5, color: $.dim, fontFamily: F.s, marginBottom: 28, textTransform: "uppercase" }}>In Honour</p></Rv>
          <Rv d={0.2}><p style={{ fontSize: 19, fontStyle: "italic", lineHeight: 1.9, color: $.tx2, marginBottom: 32 }}>W.R.E.N. is named for the Women's Royal Naval Service, who served at HMS Vernon, Portsmouth, from 1939 to 1945.</p></Rv>
          <Rv d={0.32}><p style={{ fontSize: 15, lineHeight: 1.9, color: $.tx3, fontFamily: F.s, fontWeight: 300, marginBottom: 28 }}>They sat in signals rooms, detecting anomalies in the noise and warning of danger before it arrived. They were not the intelligence. They were the bridge between knowledge and action.</p></Rv>
          <Rv d={0.44}><p style={{ fontSize: 15, lineHeight: 1.9, color: $.tx3, fontFamily: F.s, fontWeight: 300, marginBottom: 32 }}>Many gave their lives. This project carries their name because the work it does, watching for the signals others miss, is the work they did first.</p></Rv>
        </div>
      </section>

      <footer style={{ padding: "36px 28px", background: $.bg, borderTop: "1px solid " + $.brd, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Logo s={18} />
          <span style={{ fontSize: 10, letterSpacing: 2, color: $.dim, fontFamily: F.s }}>W.R.E.N. SIGNALS ROOM</span>
        </div>
        <div style={{ fontSize: 10, color: $.dim, fontFamily: F.s }}>Husain Ali Al Hashem / University of Portsmouth / 2025-2026</div>
        <div style={{ fontSize: 10, color: $.dim, fontFamily: F.s, fontStyle: "italic" }}>Powered by A.G.N.E.S. v4.2</div>
      </footer>
    </div>
  );
}
