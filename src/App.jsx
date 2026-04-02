import { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from "recharts";

/* ═══ BEACON PALETTE ═══ */
var $ = {
  bg: "#0a0e1a", bg2: "#0f1525", bg3: "#141c2e",
  brd: "rgba(251,191,36,.08)", brdH: "rgba(251,191,36,.18)",
  tx: "#fef3c7", tx2: "#d4a574", tx3: "#92734a", dim: "#6b5a3e",
  glow: "#fbbf24", glowD: "rgba(251,191,36,.06)",
  ac: "#f59e0b", acB: "#fbbf24", acD: "rgba(245,158,11,.08)",
  gn: "#34d399", gnD: "rgba(52,211,153,.06)",
  am: "#fbbf24", amD: "rgba(251,191,36,.06)",
  rd: "#f87171", rdD: "rgba(248,113,113,.06)",
  navy: "#1e293b",
};
var F = { s: "'Manrope', system-ui, sans-serif", m: "'IBM Plex Mono', monospace" };
var TT = { background: $.bg3, border: "1px solid " + $.brd, borderRadius: 8, fontSize: 11, color: $.tx2, fontFamily: F.m };
var TK = { fontSize: 9, fill: $.dim, fontFamily: F.m };

/* ═══ DATA ═══ */
var SH=[.9878,.9658,.9603,.9632,.9599,.9504,.9473,.9476,.9446,.9387,.9322,.9358,.9322,.9307,.9334,.9377,.9381,.9391,.9445,.9499,.9444,.9403,.9438,.9461,.9448,.9396,.9423,.9343,.9279,.9305,.9386,.9406,.9381,.9367,.937,.9436,.9417,.9469,.9474,.9414,.9437,.9382,.9445,.9393,.9316,.9267,.9286,.931,.9378,.9449,.935,.9423,.9367,.9379,.939,.9369,.9324,.9308,.9241,.9224,.927,.9112,.9075,.9096,.9169,.9159,.9179,.9178,.9198,.9183,.9131,.9224,.9295,.928,.9261,.9263,.9251,.9215,.9202,.9184,.9055,.8995,.8914,.8861,.8743,.8779,.8726,.8687,.8679,.8631,.8686,.8639,.8635,.8642,.8722,.8657,.8678,.8702,.8663,.8682,.8809,.8938,.8984,.9052,.9085,.9127,.9132,.9146,.9169,.9169,.9138,.9021,.895,.8868,.8673,.8678,.8716,.868,.8683,.8723];
var SV=[.9488,.9275,.9405,.9264,.929,.9205,.9153,.9109,.904,.9032,.9027,.8993,.8931,.8947,.8938,.8967,.8982,.9046,.9149,.9075,.9062,.9131,.9054,.9067,.902,.9,.9023,.8987,.8957,.9064,.9044,.8977,.9073,.9046,.9091,.9099,.913,.9159,.9184,.9139,.9173,.9193,.913,.9156,.9141,.917,.9087,.9061,.8915,.8921,.8885,.8846,.8855,.8877,.881,.8785,.8861,.8884,.8916,.8925,.889,.8908,.8903,.8891,.892,.8885,.8802,.8773,.8859,.8816,.8814,.8859,.8849,.874,.8769,.8771,.867,.8534,.8423,.8415,.8335,.8134,.8148,.8155,.7988,.7885,.7846,.7869,.7881,.7897,.785,.7911,.7847,.7822,.792,.789,.7952,.7925,.79,.7867,.784,.7892,.791,.7921,.7821,.7855,.7909,.7867,.7784,.7702,.7751,.7657,.7582,.753,.7521,.7528,.7475,.7495,.7565,.7579];
var SR=[.9899,.9562,.9522,.9566,.95,.9347,.9333,.9309,.9317,.9331,.9279,.9339,.9358,.9309,.9299,.936,.938,.9422,.9465,.9463,.9467,.9413,.9347,.9391,.9384,.938,.9348,.9305,.9258,.9275,.9284,.9286,.9265,.9215,.927,.9235,.9261,.923,.9212,.9185,.9182,.9179,.9193,.9181,.9177,.9181,.918,.9234,.9261,.9276,.9217,.9199,.9246,.9292,.9173,.9147,.9097,.9101,.9099,.9056,.8963,.8982,.8903,.8883,.8972,.895,.894,.8877,.8865,.8857,.893,.8916,.8967,.894,.897,.8981,.901,.905,.9022,.9036,.8953,.8933,.8898,.886,.8715,.8779,.87,.8646,.8653,.8595,.8585,.8539,.8481,.8492,.8546,.8546,.8544,.8599,.8588,.86,.868,.8684,.8678,.8738,.8752,.8758,.886,.8847,.8904,.8965,.9,.901,.9103,.9039,.9027,.9008,.8976,.893,.8855,.8822];
var SP=[.10,.08,.09,.11,.12,.08,.08,.08,.12,.08,.10,.09,.11,.10,.13,.11,.09,.10,.10,.08,.10,.11,.10,.10,.08,.11,.11,.10,.11,.12,.10,.08,.08,.12,.07,.13,.09,.12,.11,.08,.07,.09,.08,.14,.09,.14,.10,.12,.11,.16,.15,.18,.12,.16,.18,.35,.22,.26,.23,.19,.27,.26,.31,.31,.30,.41,.57,.42,.30,.38,.44,.48,.40,.59,.38,.47,.60,.66,.43,.62,1.16,.98,.9,1.28,.89,1.22,1.4,.88,1.19,1.21,1.76,1.36,1.1,1.22,1.57,1.8,1.62,1.6,1.9,2.11,2,1.82,1.43,1.79,1.28,1.88,1.79,1.72,2.74,1.76,2.36,2.29,2.31,1.77,1.7,1.87,2.34,2.32,1.94,2.36];
var SC=[.96,.935,.93,.935,.934,.925,.919,.921,.92,.917,.911,.915,.917,.917,.919,.926,.929,.93,.934,.936,.929,.926,.923,.924,.921,.912,.915,.91,.905,.905,.914,.915,.916,.914,.916,.919,.918,.92,.924,.923,.925,.925,.925,.92,.913,.91,.91,.909,.907,.91,.902,.9,.898,.897,.896,.895,.886,.882,.877,.875,.875,.865,.86,.86,.865,.865,.866,.864,.867,.863,.858,.857,.857,.855,.852,.849,.845,.843,.84,.844,.833,.838,.835,.83,.819,.821,.821,.817,.815,.808,.81,.8,.799,.8,.806,.805,.804,.81,.809,.815,.831,.842,.844,.853,.859,.86,.858,.861,.863,.858,.853,.85,.848,.842,.83,.831,.84,.833,.832,.836];
var SHAP_D=[{f:"F_gain_mean",v:10.05},{f:"tau_std",v:3.35},{f:"tau_mean",v:2.53},{f:"g_mean",v:2.51},{f:"D_eff_std",v:1.42},{f:"D_eff_mean",v:1.23}];
var ADV_D={H:[{e:.001,f:.03},{e:.01,f:.21},{e:.05,f:3.27},{e:.1,f:7.57}],S:[{e:.001,f:.01},{e:.01,f:1.28},{e:.05,f:16.51},{e:.1,f:32.4}],R:[{e:.001,f:.03},{e:.01,f:.05},{e:.05,f:.05},{e:.1,f:.05}],L:[{e:.001,f:.01},{e:.01,f:.13},{e:.05,f:.25},{e:.1,f:.26}]};
var NS = Array.from({ length: 2000 }, function(_, i) { return Math.sin(i * 127.1 + i * i * .013) * .5 + Math.cos(i * 269.5 - i * .017) * .5; });

/* ═══ HELPERS ═══ */
function getStatus(b) {
  if (b < 40) return { label: "STABLE", color: $.gn, bg: $.gnD, headline: "Grid stable. All nodes within operating envelope.", plain: "Predictions are reliable. Model confidence aligns with observed accuracy." };
  if (b < 55) return { label: "MONITORING", color: $.ac, bg: $.acD, headline: "Early drift on tau parameters. Increasing watch.", plain: "Input distribution is shifting from training conditions. Predictions still accurate, but trust window narrowing." };
  if (b < 80) return { label: "DRIFT DETECTED", color: $.ac, bg: $.acD, headline: "Instability risk rising. Recommend reducing load or increasing damping.", plain: "Model confidence no longer reflects true accuracy. Predictions may look correct but uncertainty estimates are unreliable." };
  return { label: "CRITICAL", color: $.rd, bg: $.rdD, headline: "Immediate corrective action required. Coverage below safety threshold.", plain: "Conformal coverage has fallen below the 95% guarantee. Model should not be used for safety-critical decisions without recalibration." };
}
function getDecision(b) {
  if (b < 40) return { status: "Nominal", actions: ["Continue monitoring", "All nodes within damping authority"], confidence: 98, priority: "Low", plain: "System operating within expected parameters. No corrective action needed." };
  if (b < 55) return { status: "Watch", actions: ["Increase monitoring to 2x", "Check F_gain at Node 1 (GEN)", "Prepare recalibration"], confidence: 94, priority: "Medium", plain: "Early indicators suggest distribution shift. Monitoring frequency increased while recalibration pipeline is prepared." };
  if (b < 80) return { status: "At Risk", actions: ["Recalibrate against current distribution", "Increase damping at Node 2 (LOAD)", "Reduce trust threshold to 0.90", "Prepare RF fallback"], confidence: 87, priority: "High", plain: "Model requires recalibration against current operating conditions. Trust threshold reduced until calibration is restored." };
  return { status: "Intervene", actions: ["Emergency recalibration via LaSCal", "Switch to RF fallback model", "Reduce load at Nodes 2 and 3", "Alert grid operator", "Log regime change"], confidence: 79, priority: "Critical", plain: "Switch to fallback model immediately. Primary model confidence has decoupled from accuracy. Operator intervention required." };
}

/* ═══ STYLES ═══ */
function useStyles() {
  useEffect(function() {
    if (document.getElementById("wrn")) return;
    var l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
    var s = document.createElement("style"); s.id = "wrn";
    s.textContent = "@keyframes wup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes wpulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes wblink{0%,100%{opacity:.5}50%{opacity:1}}@keyframes wsweep{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes wfadein{from{opacity:0}to{opacity:1}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(251,191,36,.1);border-radius:2px}";
    document.head.appendChild(s);
  }, []);
}

function useReveal(th) {
  var ref = useRef(null);
  var _s = useState(false); var v = _s[0]; var setV = _s[1];
  useEffect(function() {
    var el = ref.current; if (!el) return;
    var o = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { setV(true); o.unobserve(el); }
    }, { threshold: th || 0.1 });
    o.observe(el);
    return function() { o.disconnect(); };
  }, [th]);
  return [ref, v];
}

function Rv(props) {
  var d = props.d || 0;
  var result = useReveal(0.06); var ref = result[0]; var v = result[1];
  return (<div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(36px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) " + d + "s" }}>{props.children}</div>);
}

/* ═══ COMPONENTS ═══ */
function Pill(props) {
  var c = props.color || $.ac;
  return (<span style={{ fontFamily: F.m, fontSize: 10, padding: "3px 10px", borderRadius: 999, color: c, background: c === $.gn ? $.gnD : c === $.rd ? $.rdD : $.acD, fontWeight: 500 }}>{props.children}</span>);
}

function Beacon(props) {
  var s = props.s || 48;
  var interactive = props.interactive || false;
  var _g = useState(0); var glow = _g[0]; var setGlow = _g[1];
  var svgRef = useRef(null);

  useEffect(function() {
    if (!interactive) return;
    function onMove(cx, cy) {
      if (!svgRef.current) return;
      var rect = svgRef.current.getBoundingClientRect();
      var midX = rect.left + rect.width / 2;
      var midY = rect.top + rect.height * 0.35;
      var dist = Math.sqrt(Math.pow(cx - midX, 2) + Math.pow(cy - midY, 2));
      var intensity = Math.max(0, Math.min(1, 1 - dist / 250));
      setGlow(intensity);
    }
    function onMouse(e) { onMove(e.clientX, e.clientY); }
    function onTouch(e) { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }
    function onLeave() { setGlow(0); }
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchstart", onTouch);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchend", onLeave);
    return function() {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
    };
  }, [interactive]);

  var lampOp = interactive ? (0.2 + glow * 0.8) : 0.7;
  var glowR = 4 + glow * 14;
  var beamOp = glow * 0.4;

  return (
    <svg ref={svgRef} width={s} height={s} viewBox="0 0 64 64" style={{ transition: "transform 0.3s ease", transform: interactive ? "scale(" + (1 + glow * 0.05) + ")" : "scale(1)" }}>
      {interactive && glow > 0.05 && (
        <g>
          <circle cx="32" cy="20" r={glowR} fill={$.glow} opacity={glow * 0.12} />
          <circle cx="32" cy="20" r={glowR * 1.6} fill={$.glow} opacity={glow * 0.05} />
          <circle cx="32" cy="20" r={glowR * 2.5} fill={$.glow} opacity={glow * 0.02} />
          <line x1="32" y1="20" x2="8" y2="18" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" opacity={beamOp} />
          <line x1="32" y1="20" x2="56" y2="18" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" opacity={beamOp} />
          <line x1="32" y1="20" x2="14" y2="6" stroke={$.glow} strokeWidth="0.6" strokeDasharray="3,4" opacity={beamOp * 0.6} />
          <line x1="32" y1="20" x2="50" y2="6" stroke={$.glow} strokeWidth="0.6" strokeDasharray="3,4" opacity={beamOp * 0.6} />
          <line x1="32" y1="20" x2="12" y2="30" stroke={$.glow} strokeWidth="0.6" strokeDasharray="3,4" opacity={beamOp * 0.5} />
          <line x1="32" y1="20" x2="52" y2="30" stroke={$.glow} strokeWidth="0.6" strokeDasharray="3,4" opacity={beamOp * 0.5} />
        </g>
      )}
      {!interactive && (
        <g>
          <line x1="32" y1="18" x2="10" y2="18" stroke={$.glow} strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
          <line x1="32" y1="18" x2="54" y2="18" stroke={$.glow} strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
          <line x1="32" y1="18" x2="14" y2="6" stroke={$.glow} strokeWidth="0.8" strokeDasharray="3,4" opacity="0.2" />
          <line x1="32" y1="18" x2="50" y2="6" stroke={$.glow} strokeWidth="0.8" strokeDasharray="3,4" opacity="0.2" />
        </g>
      )}
      <polygon points="28,6 36,6 34,18 30,18" fill={$.tx2} opacity="0.8" />
      <rect x="30" y="18" width="4" height="2" fill={$.glow} opacity={lampOp} rx="1" />
      <circle cx="32" cy="20" r="3" fill={$.glow} opacity={lampOp} />
      <rect x="30" y="22" width="4" height="2" fill={$.glow} opacity={lampOp} rx="1" />
      <polygon points="30,24 34,24 37,50 27,50" fill={$.tx2} opacity="0.7" />
      <rect x="29" y="34" width="6" height="1.5" fill={$.dim} opacity="0.2" rx="0.5" />
      <rect x="28" y="42" width="8" height="1.5" fill={$.dim} opacity="0.2" rx="0.5" />
      <ellipse cx="32" cy="50" rx="12" ry="3" fill={$.dim} opacity="0.3" />
      <path d="M14,54 Q23,50 32,54 Q41,58 50,54" fill="none" stroke={$.glow} strokeWidth="0.8" opacity={0.1 + glow * 0.15} />
      <path d="M10,58 Q21,54 32,58 Q43,62 54,58" fill="none" stroke={$.glow} strokeWidth="0.6" opacity={0.06 + glow * 0.1} />
    </svg>
  );
}

function Spark(props) {
  var data = props.data; var color = props.color || $.ac; var w = props.w || 100; var h = props.h || 22;
  if (!data || data.length < 2) return null;
  var mn = Math.min.apply(null, data); var mx = Math.max.apply(null, data); var rng = mx - mn || 1;
  var pts = data.map(function(v, i) { return ((i / (data.length - 1)) * w) + "," + (h - ((v - mn) / rng * h * .65 + h * .17)); }).join(" ");
  return (<svg width={w} height={h} style={{ display: "block" }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" /></svg>);
}

function Wave(props) {
  var ch = props.chaos !== undefined ? props.chaos : 0.5;
  var height = props.h || 90;
  var isStable = props.stable || false;
  var ref = useRef(null); var ph = useRef(0);
  useEffect(function() {
    var c = ref.current; if (!c) return; var ctx = c.getContext("2d"); var run = true;
    var draw = function() {
      if (!run) return; var W = c.offsetWidth; if (W < 1) { requestAnimationFrame(draw); return; }
      var dp = window.devicePixelRatio || 1; c.width = W * dp; c.height = height * dp;
      ctx.setTransform(dp, 0, 0, dp, 0, 0); ctx.clearRect(0, 0, W, height);
      ph.current += 0.005; var p = ph.current; var mid = height / 2; var amp = height * 0.28;
      var steps = Math.floor(W / 1.5); var raw = [];
      for (var i = 0; i < steps; i++) {
        var x = (i / steps) * W; var t = (i / steps) * 12 + p;
        var base = Math.sin(t * 0.8) * 0.4 + Math.sin(t * 1.7) * 0.25;
        var ni = (i + Math.floor(p * 60)) % NS.length;
        var n = NS[ni] * ch + NS[(ni + 500) % NS.length] * ch * 0.5 * Math.sin(t * 5);
        raw.push({ x: x, y: mid + (base + n) * amp });
      }
      var pts = raw;
      if (isStable) {
        var sm = [];
        for (var si = 0; si < raw.length; si++) {
          var sy = 0, cnt = 0;
          for (var j = Math.max(0, si - 8); j <= Math.min(raw.length - 1, si + 8); j++) { sy += raw[j].y; cnt++; }
          sm.push({ x: raw[si].x, y: mid + (sy / cnt - mid) * 0.15 });
        }
        pts = sm;
      }
      ctx.beginPath();
      for (var pi = 0; pi < pts.length; pi++) { if (pi === 0) ctx.moveTo(pts[pi].x, pts[pi].y); else ctx.lineTo(pts[pi].x, pts[pi].y); }
      ctx.strokeStyle = isStable ? $.glow : $.rd;
      ctx.lineWidth = isStable ? 2 : 1.5; ctx.stroke();
      requestAnimationFrame(draw);
    };
    draw(); return function() { run = false; };
  }, [ch, height, isStable]);
  return <canvas ref={ref} style={{ width: "100%", height: height, display: "block" }} />;
}

function Topo(props) {
  var b = props.batch || 0;
  var pos = [{ x: 160, y: 40 }, { x: 300, y: 120 }, { x: 160, y: 200 }, { x: 20, y: 120 }];
  var links = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
  var labels = ["GEN", "LOAD", "DIST", "STORE"];
  var health = [0, 0, 0, 0];
  if (b >= 40) health[0] = 1;
  if (b >= 55) { health[1] = 2; health[3] = 1; }
  if (b >= 80) health[2] = 2;
  function nc(i) { return health[i] === 2 ? $.rd : health[i] === 1 ? $.ac : $.gn; }
  return (
    <svg viewBox="0 0 320 240" style={{ width: "100%", height: "auto", display: "block" }}>
      {links.map(function(pair, i) {
        var a = pair[0], b2 = pair[1];
        var stressed = health[a] > 0 || health[b2] > 0;
        var critical = health[a] === 2 || health[b2] === 2;
        return (<line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[b2].x} y2={pos[b2].y} stroke={critical ? $.rd : stressed ? $.ac : "rgba(251,191,36,.1)"} strokeWidth={stressed ? 1.5 : 0.8} strokeDasharray={i >= 4 ? "4,4" : "none"} opacity={stressed ? 0.7 : 1} />);
      })}
      {pos.map(function(p, i) {
        var col = nc(i);
        return (<g key={i}><circle cx={p.x} cy={p.y} r={20} fill="none" stroke={col} strokeWidth={1} opacity={0.3} /><circle cx={p.x} cy={p.y} r={5} fill={col} /><text x={p.x} y={p.y + 30} textAnchor="middle" fill={col} fontSize={9} fontFamily={F.m}>{labels[i]}</text></g>);
      })}
    </svg>
  );
}

/* ═══ LIGHTHOUSE ENTRANCE ═══ */
function Entrance(props) {
  var _s = useState(0); var stage = _s[0]; var setStage = _s[1];
  useEffect(function() {
    var t1 = setTimeout(function() { setStage(1); }, 600);
    var t2 = setTimeout(function() { setStage(2); }, 1800);
    var t3 = setTimeout(function() { setStage(3); }, 2800);
    var t4 = setTimeout(function() { props.onDone(); }, 3600);
    return function() { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#050810", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "opacity 1s ease", opacity: stage >= 3 ? 0 : 1, pointerEvents: stage >= 3 ? "none" : "all" }}>

      {/* Radial glow - expands as lighthouse ignites */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: stage >= 1 ? 500 : 0, height: stage >= 1 ? 500 : 0,
        marginLeft: stage >= 1 ? -250 : 0, marginTop: stage >= 1 ? -280 : -30,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36," + (stage >= 1 ? "0.06" : "0") + ") 0%, transparent 70%)",
        transition: "all 1.5s ease", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", marginBottom: 32, opacity: stage >= 0 ? 1 : 0, transition: "opacity 0.5s" }}>
        {/* Lighthouse SVG - starts dim, lamp ignites at stage 1 */}
        <svg width={100} height={100} viewBox="0 0 64 64">
          <polygon points="28,6 36,6 34,18 30,18" fill={$.tx2} opacity={stage >= 0 ? 0.6 : 0} style={{ transition: "opacity 0.8s" }} />
          <rect x="30" y="18" width="4" height="2" fill={$.glow} opacity={stage >= 1 ? 0.9 : 0.15} rx="1" style={{ transition: "opacity 0.6s" }} />
          <circle cx="32" cy="20" r="3" fill={$.glow} opacity={stage >= 1 ? 1 : 0.1} style={{ transition: "opacity 0.5s" }} />
          {stage >= 1 && <circle cx="32" cy="20" r={stage >= 2 ? 12 : 6} fill={$.glow} opacity={stage >= 2 ? 0.08 : 0.04} style={{ transition: "all 0.8s ease" }} />}
          {stage >= 2 && <circle cx="32" cy="20" r={22} fill={$.glow} opacity="0.03" style={{ transition: "all 0.6s ease" }} />}
          <rect x="30" y="22" width="4" height="2" fill={$.glow} opacity={stage >= 1 ? 0.9 : 0.15} rx="1" style={{ transition: "opacity 0.6s" }} />
          <polygon points="30,24 34,24 37,50 27,50" fill={$.tx2} opacity={stage >= 0 ? 0.6 : 0} style={{ transition: "opacity 0.8s" }} />
          <ellipse cx="32" cy="50" rx="12" ry="3" fill={$.dim} opacity="0.2" />
          {stage >= 2 && (
            <g style={{ opacity: 0.35 }}>
              <line x1="32" y1="20" x2="6" y2="18" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" />
              <line x1="32" y1="20" x2="58" y2="18" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" />
              <line x1="32" y1="20" x2="12" y2="6" stroke={$.glow} strokeWidth="0.6" strokeDasharray="3,4" opacity="0.6" />
              <line x1="32" y1="20" x2="52" y2="6" stroke={$.glow} strokeWidth="0.6" strokeDasharray="3,4" opacity="0.6" />
              <line x1="32" y1="20" x2="10" y2="32" stroke={$.glow} strokeWidth="0.5" strokeDasharray="3,4" opacity="0.4" />
              <line x1="32" y1="20" x2="54" y2="32" stroke={$.glow} strokeWidth="0.5" strokeDasharray="3,4" opacity="0.4" />
            </g>
          )}
          <path d="M14,54 Q23,50 32,54 Q41,58 50,54" fill="none" stroke={$.glow} strokeWidth="0.8" opacity="0.1" />
        </svg>

        {/* Spinning ring */}
        <div style={{
          position: "absolute", top: "25%", left: "50%", width: 110, height: 110, marginLeft: -55, marginTop: -55,
          border: "1.5px solid " + $.glow, borderRadius: "50%", borderTopColor: "transparent", borderRightColor: "transparent",
          animation: stage >= 1 ? "wsweep 2.5s linear infinite" : "none",
          opacity: stage >= 1 && stage < 3 ? 0.25 : 0, transition: "opacity 0.6s",
        }} />
      </div>

      <div style={{ fontFamily: F.s, fontSize: 32, fontWeight: 700, color: $.glow, letterSpacing: 3, opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.8s", marginBottom: 6 }}>W.R.E.N.</div>
      <div style={{ fontFamily: F.m, fontSize: 10, color: $.tx3, letterSpacing: 4, opacity: stage >= 2 ? 1 : 0, transition: "opacity 1s 0.2s" }}>SIGNALS ROOM ONLINE</div>
      <div style={{ fontFamily: F.s, fontSize: 11, color: $.dim, opacity: stage >= 2 ? 1 : 0, transition: "opacity 1s 0.4s", marginTop: 16, fontStyle: "italic" }}>She watches. She warns. She guides.</div>
    </div>
  );
}

/* ═══ GUIDED TOUR ═══ */
var TOUR_STEPS = [
  { title: "Welcome to the Signals Room", text: "W.R.E.N. monitors smart grid stability in real time. This demo replays 120 batches of streaming data through three phases: stable, drifting, and critical failure." },
  { title: "The Warden Decides", text: "The left panel shows what W.R.E.N. recommends at each moment: continue monitoring, recalibrate, or intervene. These are engineering-grade actions, not just numbers." },
  { title: "Watch the Drift", text: "The main chart tracks model performance as conditions degrade. The vertical line follows the current batch. When PSI crosses 0.25, the system raises an alert." },
  { title: "You Are in Control", text: "Drag the slider to any batch, or click Replay to watch the full simulation. Below the charts, expand the Deep Analysis for adversarial testing and feature importance." },
];

function Tour(props) {
  var step = props.step;
  var s = TOUR_STEPS[step];
  if (!s) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,8,16,.8)", backdropFilter: "blur(6px)", animation: "wfadein .3s ease" }} onClick={function(e) { if (e.target === e.currentTarget) props.onSkip(); }}>
      <div style={{ background: $.bg3, border: "1px solid " + $.brd, borderRadius: 14, padding: "28px 32px", maxWidth: 420, width: "92%", animation: "wup .35s ease both" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {TOUR_STEPS.map(function(_, i) { return (<div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? $.glow : "rgba(255,255,255,.05)", transition: "background .3s" }} />); })}
        </div>
        <div style={{ fontFamily: F.m, fontSize: 10, color: $.glow, marginBottom: 6 }}>STEP {step + 1} OF {TOUR_STEPS.length}</div>
        <h3 style={{ fontFamily: F.s, fontSize: 18, fontWeight: 700, color: $.tx, marginBottom: 8 }}>{s.title}</h3>
        <p style={{ fontFamily: F.s, fontSize: 13, lineHeight: 1.75, color: $.tx3, marginBottom: 22 }}>{s.text}</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={props.onSkip} style={{ padding: "7px 14px", borderRadius: 7, border: "1px solid " + $.brd, background: "transparent", color: $.tx3, fontFamily: F.s, fontSize: 12, cursor: "pointer" }}>Skip</button>
          <button onClick={props.onNext} style={{ padding: "9px 22px", borderRadius: 7, border: "none", background: $.glow, color: $.bg, fontFamily: F.s, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{step === TOUR_STEPS.length - 1 ? "Begin" : "Next"}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ COMMAND CENTRE ═══ */
function CommandCentre(props) {
  useStyles();
  var _b = useState(0); var batch = _b[0]; var setBatch = _b[1];
  var _d = useState(true); var demo = _d[0]; var setDemo = _d[1];
  var _e = useState(false); var expanded = _e[0]; var setExpanded = _e[1];
  var _en = useState(true); var entrance = _en[0]; var setEntrance = _en[1];
  var _t = useState(0); var tour = _t[0]; var setTour = _t[1];
  var _st = useState(true); var showTour = _st[0]; var setShowTour = _st[1];
  var demoRef = useRef(null);

  var status = getStatus(batch);
  var decision = getDecision(batch);
  var phase = batch < 40 ? "stable" : batch < 80 ? "drift" : "critical";
  var chaos = batch < 40 ? 0.2 : batch < 80 ? 0.45 : 0.7;

  useEffect(function() {
    if (!demo || entrance || showTour) return;
    demoRef.current = setInterval(function() {
      setBatch(function(b) { if (b >= 119) { setDemo(false); return 119; } return b + 1; });
    }, 150);
    return function() { clearInterval(demoRef.current); };
  }, [demo, entrance, showTour]);

  var aucData = useMemo(function() { return SH.map(function(v, i) { return { b: i, H: v, S: SV[i], R: SR[i] }; }); }, []);
  var psiData = useMemo(function() { return SP.map(function(v, i) { return { b: i, P: v }; }); }, []);
  var covData = useMemo(function() { return SC.map(function(v, i) { return { b: i, C: v }; }); }, []);

  if (entrance) return <Entrance onDone={function() { setEntrance(false); }} />;

  return (
    <div style={{ minHeight: "100vh", background: $.bg, fontFamily: F.s, color: $.tx2 }}>
      {showTour && <Tour step={tour} onNext={function() { if (tour < TOUR_STEPS.length - 1) setTour(tour + 1); else setShowTour(false); }} onSkip={function() { setShowTour(false); }} />}

      {/* STATUS BAR */}
      <div style={{ position: "sticky", top: 0, zIndex: 60, background: status.bg, borderBottom: "1px solid " + status.color + "22", padding: "7px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background .5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: status.color, boxShadow: "0 0 8px " + status.color, animation: phase !== "stable" ? "wpulse 2s ease-in-out infinite" : "none" }} />
          <span style={{ fontFamily: F.m, fontSize: 11, fontWeight: 600, color: status.color }}>{status.label}</span>
          <span style={{ fontFamily: F.s, fontSize: 11, color: status.color, opacity: 0.7 }}>{status.headline}</span>
        </div>
        <span style={{ fontFamily: F.m, fontSize: 10, color: status.color, opacity: 0.5 }}>B{batch}</span>
      </div>

      {/* NAV */}
      <div style={{ position: "sticky", top: 34, zIndex: 50, padding: "8px 20px", background: "rgba(10,14,26,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid " + $.brd, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={props.onBack} style={{ background: "transparent", border: "1px solid " + $.brd, borderRadius: 6, color: $.tx2, padding: "5px 12px", fontSize: 11, fontFamily: F.s, cursor: "pointer" }}>Back</button>
          <Beacon s={22} />
          <span style={{ fontSize: 14, fontWeight: 700, color: $.glow }}>W.R.E.N.</span>
          <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>Signals Room</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!showTour && <button onClick={function() { setTour(0); setShowTour(true); }} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid " + $.brd, background: "transparent", color: $.dim, fontFamily: F.m, fontSize: 10, cursor: "pointer" }}>Tour</button>}
          <button onClick={function() { if (demo) { setDemo(false); } else { setBatch(0); setDemo(true); } }} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid " + (demo ? $.rd : $.glow), background: demo ? $.rdD : $.acD, color: demo ? $.rd : $.glow, fontFamily: F.m, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{demo ? "Pause" : "Replay"}</button>
          <input type="range" min={0} max={119} value={batch} onChange={function(e) { setDemo(false); setBatch(+e.target.value); }} style={{ width: 180, accentColor: $.glow }} />
          <span style={{ fontFamily: F.m, fontSize: 13, color: $.glow, fontWeight: 700, minWidth: 28 }}>{batch}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 20px 40px" }}>

        {/* HERO ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {/* DECISION */}
          <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 12, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: F.m, fontSize: 10, fontWeight: 600, color: $.glow, letterSpacing: ".04em" }}>WARDEN DECISION</span>
              <Pill color={decision.priority === "Critical" ? $.rd : decision.priority === "High" ? $.ac : $.gn}>{decision.priority}</Pill>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: decision.status === "Nominal" ? $.gn : decision.status === "Watch" ? $.glow : decision.status === "At Risk" ? $.ac : $.rd, marginBottom: 6 }}>{decision.status}</div>
            <div style={{ fontFamily: F.s, fontSize: 13, color: $.tx, lineHeight: 1.5, marginBottom: 6, fontWeight: 500 }}>{status.headline}</div>
            <div style={{ fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.6, marginBottom: 12, padding: "8px 10px", background: "rgba(251,191,36,.03)", borderRadius: 6, borderLeft: "2px solid " + $.glow + "33" }}>{decision.plain}</div>
            {decision.actions.map(function(a, i) {
              return (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 4 }}><div style={{ width: 4, height: 4, borderRadius: 1, background: $.glow, flexShrink: 0, marginTop: 5 }} /><span style={{ fontFamily: F.s, fontSize: 12, color: $.tx2, lineHeight: 1.4 }}>{a}</span></div>);
            })}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(0,0,0,.3)", borderRadius: 6, marginTop: 12 }}>
              <span style={{ fontFamily: F.m, fontSize: 10, color: $.dim }}>Confidence</span>
              <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,.04)", borderRadius: 3, overflow: "hidden" }}><div style={{ width: decision.confidence + "%", height: "100%", background: decision.confidence > 90 ? $.gn : decision.confidence > 80 ? $.ac : $.rd, borderRadius: 3, transition: "width .4s" }} /></div>
              <span style={{ fontFamily: F.m, fontSize: 11, fontWeight: 600, color: $.tx }}>{decision.confidence}%</span>
            </div>
          </div>

          {/* DRIFT + TRUST */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: status.bg, border: "1px solid " + status.color + "33", borderRadius: 12, padding: "18px 22px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: status.color, boxShadow: "0 0 12px " + status.color, animation: phase !== "stable" ? "wblink 1.5s ease-in-out infinite" : "none" }} />
                <span style={{ fontFamily: F.m, fontSize: 10, fontWeight: 600, color: status.color }}>DRIFT STATUS</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: status.color }}>{(SP[batch] || 0).toFixed(2)}</div>
                <div><div style={{ fontFamily: F.m, fontSize: 10, color: $.tx3 }}>PSI</div>{SP[batch] > .25 && <div style={{ fontFamily: F.m, fontSize: 10, color: $.rd, marginTop: 2 }}>Above 0.25</div>}</div>
              </div>
              <div style={{ fontFamily: F.s, fontSize: 10, color: $.tx3, marginTop: 8, lineHeight: 1.5 }}>{status.plain}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { l: "Calibration", v: batch < 40 ? "Healthy" : batch < 80 ? "Degrading" : "Failed", c: batch < 40 ? $.gn : batch < 80 ? $.ac : $.rd },
                { l: "Coverage", v: ((SC[batch] || 0) * 100).toFixed(1) + "%", c: SC[batch] > .95 ? $.gn : SC[batch] > .85 ? $.ac : $.rd },
                { l: "Drift", v: batch < 40 ? "None" : batch < 55 ? "Early" : batch < 80 ? "Active" : "Severe", c: batch < 40 ? $.gn : batch < 55 ? $.ac : $.rd },
                { l: "Action", v: batch < 40 ? "Monitor" : batch < 55 ? "Review" : batch < 80 ? "Intervene" : "Emergency", c: batch < 40 ? $.gn : batch < 55 ? $.ac : $.rd },
              ].map(function(t) {
                return (<div key={t.l} style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 8, padding: "8px 12px", textAlign: "center" }}><div style={{ fontFamily: F.m, fontSize: 8, color: $.dim, letterSpacing: ".06em", marginBottom: 3 }}>{t.l.toUpperCase()}</div><div style={{ fontFamily: F.m, fontSize: 12, fontWeight: 600, color: t.c }}>{t.v}</div></div>);
              })}
            </div>
          </div>
        </div>

        {/* MAIN CHART */}
        <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 12, padding: "16px 16px 8px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 4px" }}>
            <span style={{ fontFamily: F.s, fontSize: 13, fontWeight: 600, color: $.tx }}>Model Performance Under Drift</span>
            <Pill color={phase === "stable" ? $.gn : phase === "drift" ? $.ac : $.rd}>{phase === "stable" ? "Nominal" : phase === "drift" ? "Degrading" : "Critical"}</Pill>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aucData} margin={{ top: 20, right: 10, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.04)" />
              <XAxis dataKey="b" tick={TK} tickLine={false} />
              <YAxis domain={["auto", "auto"]} tick={TK} tickLine={false} width={36} />
              <Tooltip contentStyle={TT} />
              <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={0.3} label={{ value: "Drift start", position: "insideTopLeft", fill: $.ac, fontSize: 9, fontFamily: F.m }} />
              <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={0.3} label={{ value: "Abrupt shift", position: "insideTopLeft", fill: $.rd, fontSize: 9, fontFamily: F.m }} />
              <ReferenceLine x={batch} stroke={$.glow} strokeWidth={2} strokeOpacity={0.8} />
              <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2.5} dot={false} name="Hybrid" />
              <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1} dot={false} opacity={0.2} name="SVM" />
              <Line type="monotone" dataKey="R" stroke={$.gn} strokeWidth={1} dot={false} opacity={0.2} name="RF" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SUPPORTING ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 12, padding: "14px 14px 6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, padding: "0 2px" }}>
              <span style={{ fontFamily: F.s, fontSize: 12, fontWeight: 600, color: $.tx }}>PSI Drift</span>
              {SP[batch] > .25 && <Pill color={$.rd}>Alert</Pill>}
            </div>
            <ResponsiveContainer width="100%" height={110}><AreaChart data={psiData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}><XAxis dataKey="b" tick={false} tickLine={false} axisLine={false} /><YAxis tick={false} tickLine={false} axisLine={false} width={0} /><ReferenceLine y={0.25} stroke={$.rd} strokeDasharray="3 3" strokeOpacity={0.3} /><ReferenceLine x={batch} stroke={$.glow} strokeWidth={1.5} strokeOpacity={0.5} /><Area type="monotone" dataKey="P" stroke={$.ac} fill={$.acD} strokeWidth={1.5} /></AreaChart></ResponsiveContainer>
          </div>
          <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 12, padding: "14px 14px 6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, padding: "0 2px" }}>
              <span style={{ fontFamily: F.s, fontSize: 12, fontWeight: 600, color: $.tx }}>Coverage</span>
              <span style={{ fontFamily: F.m, fontSize: 11, fontWeight: 600, color: SC[batch] > .95 ? $.gn : SC[batch] > .85 ? $.ac : $.rd }}>{((SC[batch] || 0) * 100).toFixed(1)}%</span>
            </div>
            <ResponsiveContainer width="100%" height={110}><AreaChart data={covData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}><XAxis dataKey="b" tick={false} tickLine={false} axisLine={false} /><YAxis domain={[0.75, 1]} tick={false} tickLine={false} axisLine={false} width={0} /><ReferenceLine y={0.95} stroke={$.gn} strokeDasharray="3 3" strokeOpacity={0.2} /><ReferenceLine x={batch} stroke={$.glow} strokeWidth={1.5} strokeOpacity={0.5} /><Area type="monotone" dataKey="C" stroke={$.glow} fill={$.glowD} strokeWidth={1.5} /></AreaChart></ResponsiveContainer>
          </div>
          <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 12, padding: "14px 14px 6px" }}>
            <span style={{ fontFamily: F.s, fontSize: 12, fontWeight: 600, color: $.tx }}>Network</span>
            <Topo batch={batch} />
          </div>
        </div>

        {/* BEFORE / AFTER */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: $.brd, borderRadius: 12, overflow: "hidden", marginBottom: 14, border: "1px solid " + $.brd }}>
          <div style={{ background: $.bg2 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid " + $.brd }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: $.rd, animation: "wpulse 1.5s ease-in-out infinite" }} /><span style={{ fontSize: 13, fontWeight: 700, color: $.rd }}>Before</span></div>
              <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>Noise {(chaos * 100).toFixed(0)}%</span>
            </div>
            <div style={{ padding: "0 3px" }}><Wave chaos={chaos} h={80} /></div>
          </div>
          <div style={{ background: $.bg2 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid " + $.brd }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: $.glow }} /><span style={{ fontSize: 13, fontWeight: 700, color: $.glow }}>After</span></div>
              <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>A.G.N.E.S.</span>
            </div>
            <div style={{ padding: "0 3px" }}><Wave chaos={chaos} h={80} stable={true} /></div>
            <div style={{ padding: "6px 16px", borderTop: "1px solid " + $.brd, display: "flex", gap: 14, fontFamily: F.m, fontSize: 10 }}>
              <span style={{ color: batch < 80 ? $.gn : $.ac }}>Stability {batch < 40 ? "+58" : batch < 80 ? "+42" : "+21"}%</span>
              <span style={{ color: batch < 80 ? $.gn : $.ac }}>Noise {batch < 40 ? "-71" : batch < 80 ? "-63" : "-48"}%</span>
            </div>
          </div>
        </div>

        {/* EXPAND */}
        <div style={{ textAlign: "center", marginBottom: expanded ? 14 : 0 }}>
          <button onClick={function() { setExpanded(!expanded); }} style={{ background: "transparent", border: "1px solid " + $.brd, borderRadius: 8, color: $.tx3, padding: "10px 28px", fontFamily: F.s, fontSize: 12, cursor: "pointer" }}>{expanded ? "Hide Deep Analysis" : "Deep Analysis \u2014 Adversarial, SHAP, Detectors"}</button>
        </div>

        {expanded && (
          <div style={{ animation: "wup .4s ease both" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
              {[{ n: "Page Hinkley", b: 9, r: "First Whisper", c: $.ac, plain: "Detects smallest deviation in running mean. Earliest possible warning of distribution shift." }, { n: "CUSUM", b: 34, r: "Confirmation", c: $.glow, plain: "Cumulative sum confirms sustained degradation in Brier score. Not a false alarm." }, { n: "PSI", b: 55, r: "Source Found", c: "#a78bfa", plain: "Identifies which features have shifted from training distribution. Pinpoints the cause." }].map(function(det) {
                return (<div key={det.n} style={{ background: $.bg2, border: "1px solid " + (batch >= det.b ? det.c + "33" : $.brd), borderRadius: 10, padding: 16, textAlign: "center" }}><div style={{ fontSize: 32, fontWeight: 300, color: batch >= det.b ? det.c : $.dim }}>{det.b}</div><div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, marginBottom: 6 }}>batch</div><div style={{ fontSize: 13, fontWeight: 700, color: $.tx }}>{det.n}</div><div style={{ fontFamily: F.m, fontSize: 10, color: det.c, fontStyle: "italic", marginTop: 2 }}>{det.r}</div><div style={{ fontSize: 10, color: $.tx3, marginTop: 6, lineHeight: 1.5 }}>{det.plain}</div>{batch >= det.b && <div style={{ marginTop: 6 }}><Pill color={det.c}>Triggered</Pill></div>}</div>);
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

              {/* FGSM PANEL */}
              <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontFamily: F.s, fontSize: 13, fontWeight: 700, color: $.tx }}>Adversarial Robustness</div>
                  <Pill color={$.ac}>FGSM</Pill>
                </div>
                <div style={{ fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.6, marginBottom: 14 }}>
                  Fast Gradient Sign Method applies tiny calculated perturbations to sensor inputs. A flip means the model changed its stability prediction. This simulates an attacker manipulating SCADA readings.
                </div>

                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={ADV_D.H.map(function(d, i) { return { e: d.e, H: d.f, S: ADV_D.S[i].f, R: ADV_D.R[i].f, L: ADV_D.L[i].f }; })} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.04)" />
                    <XAxis dataKey="e" tick={TK} tickLine={false} />
                    <YAxis tick={TK} tickLine={false} width={30} />
                    <Tooltip contentStyle={TT} />
                    <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2.5} dot={{ r: 3 }} name="Hybrid" />
                    <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1.2} dot={{ r: 2 }} name="SVM" opacity={0.5} />
                    <Line type="monotone" dataKey="R" stroke={$.gn} strokeWidth={1.2} dot={{ r: 2 }} name="RF" opacity={0.5} />
                    <Line type="monotone" dataKey="L" stroke={$.ac} strokeWidth={1.2} dot={{ r: 2 }} name="LGBM" opacity={0.5} />
                  </LineChart>
                </ResponsiveContainer>

                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>
                    <span style={{ display: "inline-block", width: 8, height: 2, background: $.glow, marginRight: 4, verticalAlign: "middle" }} />Hybrid
                  </span>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>
                    <span style={{ display: "inline-block", width: 8, height: 2, background: "#a78bfa", marginRight: 4, verticalAlign: "middle" }} />SVM
                  </span>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>
                    <span style={{ display: "inline-block", width: 8, height: 2, background: $.gn, marginRight: 4, verticalAlign: "middle" }} />RF
                  </span>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>
                    <span style={{ display: "inline-block", width: 8, height: 2, background: $.ac, marginRight: 4, verticalAlign: "middle" }} />LGBM
                  </span>
                </div>

                <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                  <div style={{ padding: "10px 12px", background: "rgba(248,113,113,.04)", borderRadius: 6, borderLeft: "2px solid " + $.rd + "44" }}>
                    <div style={{ fontFamily: F.m, fontSize: 10, color: $.rd, fontWeight: 600, marginBottom: 3 }}>SVM Vulnerability: 32.4% flip rate</div>
                    <div style={{ fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.5 }}>Smooth RBF decision boundary is easily traversed by gradient-based perturbation. A 10% sensor manipulation flips one in three predictions.</div>
                  </div>
                  <div style={{ padding: "10px 12px", background: "rgba(251,191,36,.04)", borderRadius: 6, borderLeft: "2px solid " + $.glow + "44" }}>
                    <div style={{ fontFamily: F.m, fontSize: 10, color: $.glow, fontWeight: 600, marginBottom: 3 }}>Hybrid Defence: 32.4% reduced to 7.6%</div>
                    <div style={{ fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.5 }}>Stacking with Random Forest absorbs SVM vulnerability. RF's piecewise-constant boundaries cannot be traversed by gradient steps, providing natural adversarial resistance.</div>
                  </div>
                  <div style={{ padding: "10px 12px", background: "rgba(52,211,153,.04)", borderRadius: 6, borderLeft: "2px solid " + $.gn + "44" }}>
                    <div style={{ fontFamily: F.m, fontSize: 10, color: $.gn, fontWeight: 600, marginBottom: 3 }}>Tree Models: Near-zero flip rate</div>
                    <div style={{ fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.5 }}>RF and LightGBM are inherently robust. Their axis-aligned splits are unaffected by gradient-based attacks, which require a smooth loss surface to exploit.</div>
                  </div>
                </div>
              </div>

              {/* SHAP PANEL */}
              <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontFamily: F.s, fontSize: 13, fontWeight: 700, color: $.tx }}>Feature Importance</div>
                  <Pill color={$.glow}>SHAP</Pill>
                </div>
                <div style={{ fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.6, marginBottom: 14 }}>
                  SHAP values measure each feature's contribution to individual predictions. Higher values mean the feature has more influence on whether the model predicts stable or unstable.
                </div>

                {[
                  { f: "F_gain_mean", v: 10.05, desc: "Average feedback gain across all 4 nodes. The product of generator response and damping." },
                  { f: "tau_std", v: 3.35, desc: "Variation in reaction times across nodes. High spread means uneven network response." },
                  { f: "tau_mean", v: 2.53, desc: "Average generator reaction time. Slower reactions mean less control authority." },
                  { f: "g_mean", v: 2.51, desc: "Average power coefficient. How aggressively each generator corrects imbalance." },
                  { f: "D_eff_std", v: 1.42, desc: "Variation in damping effectiveness. Uneven damping creates weak points." },
                  { f: "D_eff_mean", v: 1.23, desc: "Average damping effectiveness. The ratio of correction power to reaction delay." },
                ].map(function(f, i) {
                  return (
                    <div key={f.f} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: F.m, fontSize: 10, color: i === 0 ? $.glow : $.tx2, width: 80, textAlign: "right", flexShrink: 0, fontWeight: i === 0 ? 600 : 400 }}>{f.f}</span>
                        <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,.04)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: (f.v / 10.05 * 100) + "%", height: "100%", background: i === 0 ? $.glow : "rgba(251,191,36,.15)", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontFamily: F.m, fontSize: 10, fontWeight: 600, color: i === 0 ? $.glow : $.tx, minWidth: 36, textAlign: "right" }}>{f.v.toFixed(2)}</span>
                      </div>
                      <div style={{ fontFamily: F.s, fontSize: 10, color: $.dim, marginLeft: 88, lineHeight: 1.4 }}>{f.desc}</div>
                    </div>
                  );
                })}

                <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(251,191,36,.04)", borderRadius: 6, borderLeft: "2px solid " + $.glow + "44" }}>
                  <div style={{ fontFamily: F.m, fontSize: 10, color: $.glow, fontWeight: 600, marginBottom: 3 }}>Physics Validation</div>
                  <div style={{ fontFamily: F.s, fontSize: 11, color: $.tx3, lineHeight: 1.6 }}>F_gain_mean dominates across all drift phases (clean, gradual, and post-abrupt), confirming the model learned genuine DSGC stability mechanisms rather than statistical artefacts. The same features that control theory predicts should matter most are the features the model relies on most.</div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "16px 20px", borderTop: "1px solid " + $.brd }}>
        <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>W.R.E.N. v4.2 | Powered by A.G.N.E.S. | Husain Ali Al Hashem | University of Portsmouth 2025-2026</div>
        <div style={{ fontFamily: F.s, fontSize: 9, color: $.dim, fontStyle: "italic", marginTop: 3 }}>Named in honour of the Women's Royal Naval Service, HMS Vernon, Portsmouth, 1939-1945</div>
      </div>
    </div>
  );
}

/* ═══ LANDING PAGE ═══ */
export default function App() {
  useStyles();
  var _p = useState("landing"); var page = _p[0]; var setPage = _p[1];
  var _s = useState(0); var scrollY = _s[0]; var setScrollY = _s[1];
  useEffect(function() { var h = function() { setScrollY(window.scrollY); }; window.addEventListener("scroll", h, { passive: true }); return function() { window.removeEventListener("scroll", h); }; }, []);

  if (page === "command") return <CommandCentre onBack={function() { setPage("landing"); window.scrollTo(0, 0); }} />;
  var go = function(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  var serif = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";

  return (
    <div style={{ background: $.bg, color: $.tx, fontFamily: serif, overflowX: "hidden" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrollY > 60 ? "rgba(10,14,26,.9)" : "transparent", backdropFilter: scrollY > 60 ? "blur(20px)" : "none", borderBottom: scrollY > 60 ? "1px solid " + $.brd : "1px solid transparent", transition: "all .5s ease" }}>
        <div onClick={function() { go("hero"); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <Beacon s={24} />
          <span style={{ fontSize: 12, letterSpacing: 2, color: $.glow, fontFamily: F.s, fontWeight: 600 }}>W.R.E.N.</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["problem", "engine", "results", "honour"].map(function(id) {
            var labels = { problem: "The Problem", engine: "The Engine", results: "Results", honour: "Honour" };
            return (<span key={id} onClick={function() { go(id); }} style={{ fontSize: 11, letterSpacing: 1, color: $.tx3, fontFamily: F.s, cursor: "pointer" }} onMouseEnter={function(e) { e.target.style.color = $.glow; }} onMouseLeave={function(e) { e.target.style.color = $.tx3; }}>{labels[id]}</span>);
          })}
          <button onClick={function() { setPage("command"); }} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 6, padding: "7px 16px", fontSize: 11, fontWeight: 700, fontFamily: F.s, cursor: "pointer" }}>Live Demo</button>
        </div>
      </nav>

      <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg, position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, marginLeft: -200, marginTop: -200, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", maxWidth: 800, position: "relative" }}>
          <Rv><div style={{ marginBottom: 32 }}><Beacon s={72} interactive={true} /></div></Rv>
          <Rv d={0.15}><h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 400, letterSpacing: -1, lineHeight: 1.05, margin: "0 0 20px 0", color: $.tx }}>Predict grid instability before failure occurs</h1></Rv>
          <Rv d={0.35}><p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: $.tx2, fontFamily: F.s, fontWeight: 300, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>Real-time drift detection, calibration monitoring, and decision support for smart grid networks. Powered by A.G.N.E.S.</p></Rv>
          <Rv d={0.5}><button onClick={function() { setPage("command"); }} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 8, padding: "16px 40px", fontSize: 15, fontWeight: 700, fontFamily: F.s, cursor: "pointer", letterSpacing: 1 }}>Launch Live Demo</button></Rv>
          <Rv d={0.65}><p style={{ fontSize: 14, color: $.dim, marginTop: 48, fontStyle: "italic", fontFamily: serif }}>She watches. She warns. She guides.</p></Rv>
        </div>
      </section>

      <section id="problem" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg2 }}>
        <div style={{ maxWidth: 640, textAlign: "center" }}>
          <Rv><p style={{ fontSize: 12, letterSpacing: 5, color: $.glow, fontFamily: F.s, marginBottom: 24, textTransform: "uppercase", fontWeight: 600 }}>The Problem</p></Rv>
          <Rv d={0.08}><h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 400, lineHeight: 1.2, margin: "0 0 28px 0" }}>Every model scored perfect. None were ready for deployment.</h2></Rv>
          <Rv d={0.16}><p style={{ fontSize: 17, lineHeight: 1.9, color: $.tx2, fontFamily: F.s, fontWeight: 300 }}>AUC = 1.0 on clean data. Then we simulated real conditions. Confidence degraded 214x before accuracy dropped. That is the gap this project closes.</p></Rv>
          <Rv d={0.3}><div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 48, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 44, fontWeight: 300, lineHeight: 1, color: $.glow }}>1.0</div><div style={{ fontSize: 12, color: $.tx3, fontFamily: F.s, marginTop: 6 }}>Benchmark</div></div>
            <div style={{ width: 48, height: 1, background: $.brd }} />
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 44, fontWeight: 300, color: $.rd, lineHeight: 1 }}>0.88</div><div style={{ fontSize: 12, color: $.tx3, fontFamily: F.s, marginTop: 6 }}>Deployment</div></div>
          </div></Rv>
        </div>
      </section>

      <section id="engine" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg }}>
        <div style={{ maxWidth: 800, textAlign: "center" }}>
          <Rv><p style={{ fontSize: 12, letterSpacing: 5, color: $.glow, fontFamily: F.s, marginBottom: 24, textTransform: "uppercase", fontWeight: 600 }}>The Engine</p></Rv>
          <Rv d={0.06}><h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, margin: "0 0 8px 0" }}>A.G.N.E.S.</h2></Rv>
          <Rv d={0.1}><p style={{ fontSize: 12, color: $.dim, fontFamily: F.s, letterSpacing: 3, marginBottom: 36 }}>ADAPTIVE GRID NEURAL ENGINEERING SYSTEM</p></Rv>
          <Rv d={0.16}><p style={{ fontSize: 17, lineHeight: 1.9, color: $.tx2, fontFamily: F.s, fontWeight: 300, maxWidth: 520, margin: "0 auto 48px" }}>3,300 lines. 22 stages. Trains, calibrates, stress-tests, attacks, drifts, and monitors. If the model survives, you know it is ready.</p></Rv>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, maxWidth: 720, margin: "0 auto" }}>
            {[{ t: "Physics-Informed Features", d: "48 from 12 raw DSGC parameters." }, { t: "Stacking Ensemble", d: "SVM + RF with calibrated meta-learner." }, { t: "Conformal Prediction", d: "Coverage that degrades honestly." }, { t: "Adversarial Testing", d: "FGSM at 6 epsilon levels." }, { t: "Streaming Simulation", d: "120 batches under drift." }, { t: "Triple Drift Detection", d: "PSI, CUSUM, Page-Hinkley." }].map(function(item, i) {
              return (<Rv key={i} d={0.06 * i}><div style={{ background: $.bg3, padding: "24px 20px", textAlign: "left", height: "100%", borderTop: "1px solid " + $.brd }}><div style={{ fontSize: 13, fontFamily: F.s, fontWeight: 600, color: $.tx, marginBottom: 6 }}>{item.t}</div><div style={{ fontSize: 12, fontFamily: F.s, fontWeight: 300, color: $.tx3, lineHeight: 1.6 }}>{item.d}</div></div></Rv>);
            })}
          </div>
        </div>
      </section>

      <section id="results" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", background: $.bg2 }}>
        <div style={{ maxWidth: 640, textAlign: "center" }}>
          <Rv><p style={{ fontSize: 12, letterSpacing: 5, color: $.glow, fontFamily: F.s, marginBottom: 24, textTransform: "uppercase", fontWeight: 600 }}>Results</p></Rv>
          <Rv d={0.08}><h2 style={{ fontSize: "clamp(24px, 4.5vw, 38px)", fontWeight: 400, margin: "0 0 40px 0" }}>What survived. What broke. What matters.</h2></Rv>
          <Rv d={0.2}><div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "36px 20px", marginBottom: 48 }}>
            {[{ l: "Static AUC", v: "1.0000" }, { l: "Deployment AUC", v: "0.8834" }, { l: "ECE Increase", v: "214x" }, { l: "Coverage", v: "99.97%" }, { l: "Stages", v: "22" }, { l: "Lines", v: "3,300" }].map(function(m) {
              return (<div key={m.l}><div style={{ fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 300, fontFamily: F.s, color: $.glow }}>{m.v}</div><div style={{ fontSize: 11, color: $.tx3, fontFamily: F.s, marginTop: 6, letterSpacing: 1.5 }}>{m.l}</div></div>);
            })}
          </div></Rv>
          <Rv d={0.35}><button onClick={function() { setPage("command"); }} style={{ background: "transparent", border: "1px solid " + $.glow, borderRadius: 8, color: $.glow, padding: "14px 36px", fontSize: 14, fontFamily: F.s, fontWeight: 600, cursor: "pointer", letterSpacing: 2 }}>SEE IT LIVE</button></Rv>
        </div>
      </section>

      <section id="honour" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "100px 24px", background: $.bg }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <Rv><div style={{ width: 36, height: 1, background: $.glow, margin: "0 auto 28px", opacity: 0.3 }} /></Rv>
          <Rv d={0.12}><p style={{ fontSize: 12, letterSpacing: 5, color: $.dim, fontFamily: F.s, marginBottom: 24, textTransform: "uppercase" }}>In Honour</p></Rv>
          <Rv d={0.2}><p style={{ fontSize: 17, fontStyle: "italic", lineHeight: 1.9, color: $.tx2, marginBottom: 28 }}>W.R.E.N. is named for the Women's Royal Naval Service, who served at HMS Vernon, Portsmouth, from 1939 to 1945.</p></Rv>
          <Rv d={0.32}><p style={{ fontSize: 14, lineHeight: 1.9, color: $.tx3, fontFamily: F.s, fontWeight: 300, marginBottom: 24 }}>They sat in signals rooms, detecting anomalies in the noise and warning of danger before it arrived.</p></Rv>
          <Rv d={0.44}><p style={{ fontSize: 14, color: $.tx3, fontStyle: "italic" }}>They watched. They warned. They guided.</p></Rv>
        </div>
      </section>

      <footer style={{ padding: "28px", background: $.bg, borderTop: "1px solid " + $.brd, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Beacon s={16} /><span style={{ fontSize: 10, letterSpacing: 2, color: $.dim, fontFamily: F.s }}>W.R.E.N.</span></div>
        <div style={{ fontSize: 10, color: $.dim, fontFamily: F.s }}>Husain Ali Al Hashem / University of Portsmouth / 2025-2026</div>
        <div style={{ fontSize: 10, color: $.dim, fontFamily: F.s, fontStyle: "italic" }}>Powered by A.G.N.E.S. v4.2</div>
      </footer>
    </div>
  );
}
