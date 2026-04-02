import { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from "recharts";

/* ═══ PALETTE ═══ */
var $ = {
  bg: "#0a0e1a", bg2: "#0f1525", bg3: "#141c2e",
  brd: "rgba(251,191,36,.08)", brdH: "rgba(251,191,36,.18)",
  tx: "#fef3c7", tx2: "#d4a574", tx3: "#92734a", dim: "#6b5a3e",
  glow: "#fbbf24", glowD: "rgba(251,191,36,.06)",
  ac: "#f59e0b", acB: "#fbbf24", acD: "rgba(245,158,11,.08)",
  gn: "#34d399", gnD: "rgba(52,211,153,.06)",
  rd: "#f87171", rdD: "rgba(248,113,113,.06)",
  navy: "#1e293b",
};
var F = { s: "'Manrope',system-ui,sans-serif", m: "'IBM Plex Mono',monospace" };
var TT = { background: $.bg3, border: "1px solid " + $.brd, borderRadius: 8, fontSize: 11, color: $.tx2, fontFamily: F.m };
var TK = { fontSize: 9, fill: $.dim, fontFamily: F.m };

/* ═══ DATA ═══ */
var SH=[.9878,.9658,.9603,.9632,.9599,.9504,.9473,.9476,.9446,.9387,.9322,.9358,.9322,.9307,.9334,.9377,.9381,.9391,.9445,.9499,.9444,.9403,.9438,.9461,.9448,.9396,.9423,.9343,.9279,.9305,.9386,.9406,.9381,.9367,.937,.9436,.9417,.9469,.9474,.9414,.9437,.9382,.9445,.9393,.9316,.9267,.9286,.931,.9378,.9449,.935,.9423,.9367,.9379,.939,.9369,.9324,.9308,.9241,.9224,.927,.9112,.9075,.9096,.9169,.9159,.9179,.9178,.9198,.9183,.9131,.9224,.9295,.928,.9261,.9263,.9251,.9215,.9202,.9184,.9055,.8995,.8914,.8861,.8743,.8779,.8726,.8687,.8679,.8631,.8686,.8639,.8635,.8642,.8722,.8657,.8678,.8702,.8663,.8682,.8809,.8938,.8984,.9052,.9085,.9127,.9132,.9146,.9169,.9169,.9138,.9021,.895,.8868,.8673,.8678,.8716,.868,.8683,.8723];
var SV=[.9488,.9275,.9405,.9264,.929,.9205,.9153,.9109,.904,.9032,.9027,.8993,.8931,.8947,.8938,.8967,.8982,.9046,.9149,.9075,.9062,.9131,.9054,.9067,.902,.9,.9023,.8987,.8957,.9064,.9044,.8977,.9073,.9046,.9091,.9099,.913,.9159,.9184,.9139,.9173,.9193,.913,.9156,.9141,.917,.9087,.9061,.8915,.8921,.8885,.8846,.8855,.8877,.881,.8785,.8861,.8884,.8916,.8925,.889,.8908,.8903,.8891,.892,.8885,.8802,.8773,.8859,.8816,.8814,.8859,.8849,.874,.8769,.8771,.867,.8534,.8423,.8415,.8335,.8134,.8148,.8155,.7988,.7885,.7846,.7869,.7881,.7897,.785,.7911,.7847,.7822,.792,.789,.7952,.7925,.79,.7867,.784,.7892,.791,.7921,.7821,.7855,.7909,.7867,.7784,.7702,.7751,.7657,.7582,.753,.7521,.7528,.7475,.7495,.7565,.7579];
var SR=[.9899,.9562,.9522,.9566,.95,.9347,.9333,.9309,.9317,.9331,.9279,.9339,.9358,.9309,.9299,.936,.938,.9422,.9465,.9463,.9467,.9413,.9347,.9391,.9384,.938,.9348,.9305,.9258,.9275,.9284,.9286,.9265,.9215,.927,.9235,.9261,.923,.9212,.9185,.9182,.9179,.9193,.9181,.9177,.9181,.918,.9234,.9261,.9276,.9217,.9199,.9246,.9292,.9173,.9147,.9097,.9101,.9099,.9056,.8963,.8982,.8903,.8883,.8972,.895,.894,.8877,.8865,.8857,.893,.8916,.8967,.894,.897,.8981,.901,.905,.9022,.9036,.8953,.8933,.8898,.886,.8715,.8779,.87,.8646,.8653,.8595,.8585,.8539,.8481,.8492,.8546,.8546,.8544,.8599,.8588,.86,.868,.8684,.8678,.8738,.8752,.8758,.886,.8847,.8904,.8965,.9,.901,.9103,.9039,.9027,.9008,.8976,.893,.8855,.8822];
var SP=[.10,.08,.09,.11,.12,.08,.08,.08,.12,.08,.10,.09,.11,.10,.13,.11,.09,.10,.10,.08,.10,.11,.10,.10,.08,.11,.11,.10,.11,.12,.10,.08,.08,.12,.07,.13,.09,.12,.11,.08,.07,.09,.08,.14,.09,.14,.10,.12,.11,.16,.15,.18,.12,.16,.18,.35,.22,.26,.23,.19,.27,.26,.31,.31,.30,.41,.57,.42,.30,.38,.44,.48,.40,.59,.38,.47,.60,.66,.43,.62,1.16,.98,.9,1.28,.89,1.22,1.4,.88,1.19,1.21,1.76,1.36,1.1,1.22,1.57,1.8,1.62,1.6,1.9,2.11,2,1.82,1.43,1.79,1.28,1.88,1.79,1.72,2.74,1.76,2.36,2.29,2.31,1.77,1.7,1.87,2.34,2.32,1.94,2.36];
var SC=[.96,.935,.93,.935,.934,.925,.919,.921,.92,.917,.911,.915,.917,.917,.919,.926,.929,.93,.934,.936,.929,.926,.923,.924,.921,.912,.915,.91,.905,.905,.914,.915,.916,.914,.916,.919,.918,.92,.924,.923,.925,.925,.925,.92,.913,.91,.91,.909,.907,.91,.902,.9,.898,.897,.896,.895,.886,.882,.877,.875,.875,.865,.86,.86,.865,.865,.866,.864,.867,.863,.858,.857,.857,.855,.852,.849,.845,.843,.84,.844,.833,.838,.835,.83,.819,.821,.821,.817,.815,.808,.81,.8,.799,.8,.806,.805,.804,.81,.809,.815,.831,.842,.844,.853,.859,.86,.858,.861,.863,.858,.853,.85,.848,.842,.83,.831,.84,.833,.832,.836];
var NS = Array.from({ length: 2000 }, function(_, i) { return Math.sin(i * 127.1 + i * i * .013) * .5 + Math.cos(i * 269.5 - i * .017) * .5; });

/* ═══ SCENARIOS ═══ */
var SCENARIOS = {
  nominal: { label: "Normal Operation", batch: 20, desc: "Stable grid. All systems nominal. Model predictions are trustworthy.", status: "STABLE", color: $.gn, health: 98, action: "Continue monitoring at standard interval.", feature: "None", alert: "No alerts" },
  gradual: { label: "Gradual Drift", batch: 55, desc: "Tau parameters shifting slowly. Model confidence degrading before accuracy drops.", status: "DRIFT DETECTED", color: $.ac, health: 87, action: "Recalibrate model. Increase damping at Node 2 (LOAD).", feature: "tau_std rising, F_gain_mean shifting", alert: "PSI crossed 0.25 threshold at batch 55" },
  noise: { label: "Sensor Noise", batch: 45, desc: "SCADA sensor corruption injected. Testing whether the model can distinguish noise from real instability.", status: "MONITORING", color: $.ac, health: 92, action: "Increase monitoring frequency. Check sensor integrity.", feature: "Broad noise across tau and g parameters", alert: "Early CUSUM deviation at batch 34" },
  adversarial: { label: "Adversarial Attack", batch: 65, desc: "FGSM perturbation applied to sensor readings. Simulates deliberate manipulation of grid telemetry.", status: "AT RISK", color: $.rd, health: 74, action: "Switch to RF fallback model. SVM boundary compromised.", feature: "SVM flip rate at 16.5%. Hybrid absorbs to 3.3%.", alert: "Adversarial signature detected in gradient pattern" },
  collapse: { label: "Regime Collapse", batch: 95, desc: "Abrupt parameter shift. Generator response characteristics have fundamentally changed.", status: "CRITICAL", color: $.rd, health: 52, action: "Emergency recalibration. Alert grid operator immediately.", feature: "All features shifted. Coverage below 82%.", alert: "Page Hinkley, CUSUM, PSI all triggered. Regime change confirmed." },
};

/* ═══ STYLES ═══ */
function useStyles() {
  useEffect(function() {
    if (document.getElementById("wrn")) return;
    var l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
    var s = document.createElement("style"); s.id = "wrn";
    s.textContent = "@keyframes wup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes wpulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes wblink{0%,100%{opacity:.5}50%{opacity:1}}@keyframes wsweep{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(251,191,36,.1);border-radius:2px}";
    document.head.appendChild(s);
  }, []);
}

/* ═══ COMPONENTS ═══ */
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

function Pill(props) {
  var c = props.color || $.ac;
  var bgMap = {}; bgMap[$.ac] = $.acD; bgMap[$.gn] = $.gnD; bgMap[$.rd] = $.rdD; bgMap[$.glow] = $.glowD;
  return (<span style={{ fontFamily: F.m, fontSize: 10, padding: "3px 10px", borderRadius: 999, color: c, background: bgMap[c] || "rgba(255,255,255,.04)", fontWeight: 500 }}>{props.children}</span>);
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
      setGlow(Math.max(0, Math.min(1, 1 - dist / 250)));
    }
    function onMouse(e) { onMove(e.clientX, e.clientY); }
    function onTouch(e) { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }
    function onLeave() { setGlow(0); }
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchstart", onTouch);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchend", onLeave);
    return function() { window.removeEventListener("mousemove", onMouse); window.removeEventListener("touchstart", onTouch); window.removeEventListener("touchmove", onTouch); window.removeEventListener("touchend", onLeave); };
  }, [interactive]);

  var lampOp = interactive ? (0.2 + glow * 0.8) : 0.7;
  var glowR = 4 + glow * 14;

  return (
    <svg ref={svgRef} width={s} height={s} viewBox="0 0 64 64" style={{ transition: "transform 0.3s", transform: "scale(" + (1 + (interactive ? glow * 0.05 : 0)) + ")" }}>
      {interactive && glow > 0.05 && (
        <g>
          <circle cx="32" cy="20" r={glowR} fill={$.glow} opacity={glow * 0.12} />
          <circle cx="32" cy="20" r={glowR * 1.6} fill={$.glow} opacity={glow * 0.05} />
          <line x1="32" y1="20" x2="8" y2="18" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" opacity={glow * 0.35} />
          <line x1="32" y1="20" x2="56" y2="18" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" opacity={glow * 0.35} />
          <line x1="32" y1="20" x2="14" y2="6" stroke={$.glow} strokeWidth="0.6" strokeDasharray="3,4" opacity={glow * 0.2} />
          <line x1="32" y1="20" x2="50" y2="6" stroke={$.glow} strokeWidth="0.6" strokeDasharray="3,4" opacity={glow * 0.2} />
        </g>
      )}
      {!interactive && (
        <g>
          <line x1="32" y1="18" x2="10" y2="18" stroke={$.glow} strokeWidth="1" strokeDasharray="4,4" opacity="0.25" />
          <line x1="32" y1="18" x2="54" y2="18" stroke={$.glow} strokeWidth="1" strokeDasharray="4,4" opacity="0.25" />
        </g>
      )}
      <polygon points="28,6 36,6 34,18 30,18" fill={$.tx2} opacity="0.7" />
      <rect x="30" y="18" width="4" height="2" fill={$.glow} opacity={lampOp} rx="1" />
      <circle cx="32" cy="20" r="3" fill={$.glow} opacity={lampOp} />
      <rect x="30" y="22" width="4" height="2" fill={$.glow} opacity={lampOp} rx="1" />
      <polygon points="30,24 34,24 37,50 27,50" fill={$.tx2} opacity="0.6" />
      <ellipse cx="32" cy="50" rx="12" ry="3" fill={$.dim} opacity="0.25" />
      <path d="M14,54 Q23,50 32,54 Q41,58 50,54" fill="none" stroke={$.glow} strokeWidth="0.8" opacity={0.08 + glow * 0.12} />
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
    <svg viewBox="0 0 320 240" style={{ width: "100%", maxWidth: 280, height: "auto", display: "block" }}>
      {links.map(function(pair, i) {
        var a = pair[0], b2 = pair[1];
        var stressed = health[a] > 0 || health[b2] > 0;
        return (<line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[b2].x} y2={pos[b2].y} stroke={stressed ? $.ac : "rgba(251,191,36,.08)"} strokeWidth={stressed ? 1.2 : 0.6} strokeDasharray={i >= 4 ? "4,4" : "none"} />);
      })}
      {pos.map(function(p, i) {
        var col = nc(i);
        return (<g key={i}><circle cx={p.x} cy={p.y} r={18} fill="none" stroke={col} strokeWidth={1} opacity={0.3} /><circle cx={p.x} cy={p.y} r={5} fill={col} /><text x={p.x} y={p.y + 28} textAnchor="middle" fill={col} fontSize={9} fontFamily={F.m}>{labels[i]}</text></g>);
      })}
    </svg>
  );
}

/* ═══ ENTRANCE ═══ */
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
      <svg width={90} height={90} viewBox="0 0 64 64" style={{ marginBottom: 24 }}>
        <polygon points="28,6 36,6 34,18 30,18" fill={$.tx2} opacity={stage >= 0 ? 0.5 : 0} style={{ transition: "opacity 0.6s" }} />
        <circle cx="32" cy="20" r="3" fill={$.glow} opacity={stage >= 1 ? 1 : 0.08} style={{ transition: "opacity 0.5s" }} />
        {stage >= 1 && <circle cx="32" cy="20" r={stage >= 2 ? 12 : 6} fill={$.glow} opacity={stage >= 2 ? 0.06 : 0.03} />}
        <polygon points="30,24 34,24 37,50 27,50" fill={$.tx2} opacity={stage >= 0 ? 0.5 : 0} style={{ transition: "opacity 0.6s" }} />
        {stage >= 2 && (
          <g opacity="0.3">
            <line x1="32" y1="20" x2="6" y2="18" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" />
            <line x1="32" y1="20" x2="58" y2="18" stroke={$.glow} strokeWidth="0.8" strokeDasharray="4,4" />
          </g>
        )}
        <ellipse cx="32" cy="50" rx="12" ry="3" fill={$.dim} opacity="0.2" />
      </svg>
      <div style={{ fontFamily: F.s, fontSize: 28, fontWeight: 700, color: $.glow, letterSpacing: 3, opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.6s", marginBottom: 6 }}>W.R.E.N.</div>
      <div style={{ fontFamily: F.m, fontSize: 10, color: $.dim, letterSpacing: 3, opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.8s 0.2s" }}>SIGNALS ROOM ONLINE</div>
    </div>
  );
}

/* ═══ SIGNATURE DEMO ═══ */
function SignatureDemo(props) {
  var _sc = useState("nominal"); var scenario = _sc[0]; var setScenario = _sc[1];
  var sc = SCENARIOS[scenario];
  var b = sc.batch;
  var aucData = useMemo(function() { return SH.map(function(v, i) { return { b: i, H: v, S: SV[i] }; }); }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Scenario selector */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
        {Object.keys(SCENARIOS).map(function(key) {
          var s = SCENARIOS[key];
          var active = scenario === key;
          return (
            <button key={key} onClick={function() { setScenario(key); }} style={{
              padding: "8px 18px", borderRadius: 8, fontFamily: F.s, fontSize: 12, fontWeight: active ? 700 : 400,
              cursor: "pointer", transition: "all .2s", letterSpacing: ".01em",
              color: active ? $.bg : $.tx3, background: active ? s.color : "rgba(255,255,255,.02)",
              border: "1px solid " + (active ? s.color : $.brd),
            }}>{s.label}</button>
          );
        })}
      </div>

      {/* Response dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        {/* Health Score */}
        <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: 18, textAlign: "center" }}>
          <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: ".06em", marginBottom: 8 }}>HEALTH SCORE</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: sc.health > 90 ? $.gn : sc.health > 75 ? $.ac : $.rd, transition: "color .3s" }}>{sc.health}</div>
          <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, marginTop: 4 }}>out of 100</div>
        </div>
        {/* Status */}
        <div style={{ background: $.bg2, border: "1px solid " + sc.color + "33", borderRadius: 10, padding: 18, textAlign: "center" }}>
          <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: ".06em", marginBottom: 8 }}>STATUS</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc.color, boxShadow: "0 0 8px " + sc.color, animation: sc.color !== $.gn ? "wpulse 2s ease-in-out infinite" : "none" }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: sc.color }}>{sc.status}</div>
          </div>
          <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, marginTop: 6 }}>{sc.alert}</div>
        </div>
        {/* Topology */}
        <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Topo batch={b} />
        </div>
      </div>

      {/* Chart + Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        {/* AUC Chart */}
        <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: "14px 14px 6px" }}>
          <div style={{ fontFamily: F.s, fontSize: 12, fontWeight: 600, color: $.tx, marginBottom: 8 }}>Model Confidence Over Time</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={aucData} margin={{ top: 16, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.04)" />
              <XAxis dataKey="b" tick={TK} tickLine={false} />
              <YAxis domain={["auto", "auto"]} tick={TK} tickLine={false} width={36} />
              <Tooltip contentStyle={TT} />
              <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={0.3} label={{ value: "Drift start", position: "insideTopLeft", fill: $.ac, fontSize: 8 }} />
              <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={0.3} label={{ value: "Regime change", position: "insideTopLeft", fill: $.rd, fontSize: 8 }} />
              <ReferenceLine x={b} stroke={$.glow} strokeWidth={2} strokeOpacity={0.8} />
              <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2.5} dot={false} name="Hybrid" />
              <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1} dot={false} opacity={0.25} name="SVM" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Explanation */}
          <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: 16, flex: 1 }}>
            <div style={{ fontFamily: F.m, fontSize: 9, color: $.glow, letterSpacing: ".04em", marginBottom: 6 }}>WHAT CHANGED</div>
            <div style={{ fontFamily: F.s, fontSize: 12, color: $.tx2, lineHeight: 1.6, marginBottom: 10 }}>{sc.desc}</div>
            <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: ".04em", marginBottom: 4 }}>FEATURE SIGNAL</div>
            <div style={{ fontFamily: F.m, fontSize: 11, color: sc.color, lineHeight: 1.4 }}>{sc.feature}</div>
          </div>
          {/* Action */}
          <div style={{ background: sc.color + "0a", border: "1px solid " + sc.color + "22", borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: F.m, fontSize: 9, color: sc.color, letterSpacing: ".04em", marginBottom: 6 }}>RECOMMENDED ACTION</div>
            <div style={{ fontFamily: F.s, fontSize: 12, color: $.tx, lineHeight: 1.6, fontWeight: 500 }}>{sc.action}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ COMMAND CENTRE (simplified - entered from landing page) ═══ */
function CommandCentre(props) {
  useStyles();
  var _b = useState(0); var batch = _b[0]; var setBatch = _b[1];
  var _d = useState(true); var demo = _d[0]; var setDemo = _d[1];
  var _en = useState(true); var entrance = _en[0]; var setEntrance = _en[1];
  var demoRef = useRef(null);
  var phase = batch < 40 ? "stable" : batch < 80 ? "drift" : "critical";
  var statusColor = phase === "stable" ? $.gn : phase === "drift" ? $.ac : $.rd;
  var statusLabel = phase === "stable" ? "STABLE" : phase === "drift" ? "DRIFT DETECTED" : "CRITICAL";
  var aucData = useMemo(function() { return SH.map(function(v, i) { return { b: i, H: v, S: SV[i], R: SR[i] }; }); }, []);
  var psiData = useMemo(function() { return SP.map(function(v, i) { return { b: i, P: v }; }); }, []);
  var covData = useMemo(function() { return SC.map(function(v, i) { return { b: i, C: v }; }); }, []);

  useEffect(function() {
    if (!demo || entrance) return;
    demoRef.current = setInterval(function() {
      setBatch(function(b) { if (b >= 119) { setDemo(false); return 119; } return b + 1; });
    }, 140);
    return function() { clearInterval(demoRef.current); };
  }, [demo, entrance]);

  if (entrance) return <Entrance onDone={function() { setEntrance(false); }} />;

  return (
    <div style={{ minHeight: "100vh", background: $.bg, fontFamily: F.s, color: $.tx2 }}>
      {/* Status bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 60, background: statusColor === $.gn ? $.gnD : statusColor === $.rd ? $.rdD : $.acD, borderBottom: "1px solid " + statusColor + "22", padding: "6px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor, boxShadow: "0 0 8px " + statusColor, animation: phase !== "stable" ? "wpulse 2s ease-in-out infinite" : "none" }} />
          <span style={{ fontFamily: F.m, fontSize: 11, fontWeight: 600, color: statusColor }}>{statusLabel}</span>
        </div>
        <span style={{ fontFamily: F.m, fontSize: 10, color: statusColor, opacity: 0.6 }}>B{batch} | AUC {(SH[batch] || 0).toFixed(4)} | PSI {(SP[batch] || 0).toFixed(2)}</span>
      </div>

      {/* Nav */}
      <div style={{ position: "sticky", top: 30, zIndex: 50, padding: "8px 20px", background: "rgba(10,14,26,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid " + $.brd, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={props.onBack} style={{ background: "transparent", border: "1px solid " + $.brd, borderRadius: 6, color: $.tx2, padding: "5px 12px", fontSize: 11, fontFamily: F.s, cursor: "pointer" }}>Back</button>
          <Beacon s={20} />
          <span style={{ fontSize: 13, fontWeight: 700, color: $.glow }}>W.R.E.N.</span>
          <span style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>Full Command Centre</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={function() { if (demo) { setDemo(false); } else { setBatch(0); setDemo(true); } }} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid " + (demo ? $.rd : $.glow), background: demo ? $.rdD : $.acD, color: demo ? $.rd : $.glow, fontFamily: F.m, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{demo ? "Pause" : "Replay"}</button>
          <input type="range" min={0} max={119} value={batch} onChange={function(e) { setDemo(false); setBatch(+e.target.value); }} style={{ width: 180, accentColor: $.glow }} />
          <span style={{ fontFamily: F.m, fontSize: 13, color: $.glow, fontWeight: 700, minWidth: 24 }}>{batch}</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 20px 40px" }}>
        {/* Metrics row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, marginBottom: 14, background: $.brd, borderRadius: 10, overflow: "hidden", border: "1px solid " + $.brd }}>
          {[
            { l: "Hybrid AUC", v: (SH[batch] || 0).toFixed(4), c: SH[batch] > .93 ? $.gn : SH[batch] > .88 ? $.ac : $.rd, d: SH },
            { l: "SVM AUC", v: (SV[batch] || 0).toFixed(4), c: SV[batch] > .88 ? $.tx2 : $.rd, d: SV },
            { l: "PSI", v: (SP[batch] || 0).toFixed(2), c: SP[batch] < .25 ? $.gn : SP[batch] < 1 ? $.ac : $.rd, d: SP },
            { l: "Coverage", v: ((SC[batch] || 0) * 100).toFixed(1) + "%", c: SC[batch] > .95 ? $.gn : SC[batch] > .85 ? $.ac : $.rd, d: SC },
          ].map(function(m) {
            return (<div key={m.l} style={{ background: $.bg2, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}><div style={{ flex: 1 }}><div style={{ fontFamily: F.m, fontSize: 8, color: $.dim, marginBottom: 3 }}>{m.l}</div><div style={{ fontSize: 18, fontWeight: 700, color: m.c, fontFamily: F.m }}>{m.v}</div></div><Spark data={m.d.slice(Math.max(0, batch - 20), batch + 1)} color={m.c} w={70} h={18} /></div>);
          })}
        </div>

        {/* Main chart */}
        <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: "14px 14px 6px", marginBottom: 14 }}>
          <div style={{ fontFamily: F.s, fontSize: 13, fontWeight: 600, color: $.tx, marginBottom: 8 }}>Streaming AUC</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aucData} margin={{ top: 20, right: 10, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.04)" />
              <XAxis dataKey="b" tick={TK} tickLine={false} />
              <YAxis domain={["auto", "auto"]} tick={TK} tickLine={false} width={36} />
              <Tooltip contentStyle={TT} />
              <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={0.3} label={{ value: "Drift", position: "insideTopLeft", fill: $.ac, fontSize: 9 }} />
              <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={0.3} label={{ value: "Abrupt", position: "insideTopLeft", fill: $.rd, fontSize: 9 }} />
              <ReferenceLine x={batch} stroke={$.glow} strokeWidth={2} strokeOpacity={0.8} />
              <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2.5} dot={false} name="Hybrid" />
              <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1} dot={false} opacity={0.2} name="SVM" />
              <Line type="monotone" dataKey="R" stroke={$.gn} strokeWidth={1} dot={false} opacity={0.2} name="RF" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PSI + Coverage */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: "14px 14px 6px" }}>
            <div style={{ fontFamily: F.s, fontSize: 12, fontWeight: 600, color: $.tx, marginBottom: 6 }}>PSI Drift</div>
            <ResponsiveContainer width="100%" height={130}><AreaChart data={psiData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}><XAxis dataKey="b" tick={false} axisLine={false} /><YAxis tick={false} axisLine={false} width={0} /><ReferenceLine y={0.25} stroke={$.rd} strokeDasharray="3 3" strokeOpacity={0.3} /><ReferenceLine x={batch} stroke={$.glow} strokeWidth={1.5} strokeOpacity={0.5} /><Area type="monotone" dataKey="P" stroke={$.ac} fill={$.acD} strokeWidth={1.5} /></AreaChart></ResponsiveContainer>
          </div>
          <div style={{ background: $.bg2, border: "1px solid " + $.brd, borderRadius: 10, padding: "14px 14px 6px" }}>
            <div style={{ fontFamily: F.s, fontSize: 12, fontWeight: 600, color: $.tx, marginBottom: 6 }}>Coverage</div>
            <ResponsiveContainer width="100%" height={130}><AreaChart data={covData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}><XAxis dataKey="b" tick={false} axisLine={false} /><YAxis domain={[0.75, 1]} tick={false} axisLine={false} width={0} /><ReferenceLine y={0.95} stroke={$.gn} strokeDasharray="3 3" strokeOpacity={0.2} /><ReferenceLine x={batch} stroke={$.glow} strokeWidth={1.5} strokeOpacity={0.5} /><Area type="monotone" dataKey="C" stroke={$.glow} fill={$.glowD} strokeWidth={1.5} /></AreaChart></ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "16px 20px", borderTop: "1px solid " + $.brd }}>
        <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim }}>W.R.E.N. v4.2 | A.G.N.E.S. | Husain Ali Al Hashem | Portsmouth 2025-2026</div>
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
  var serif = "'Iowan Old Style','Palatino Linotype',Georgia,serif";

  return (
    <div style={{ background: $.bg, color: $.tx, fontFamily: F.s, overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrollY > 60 ? "rgba(10,14,26,.92)" : "transparent", backdropFilter: scrollY > 60 ? "blur(20px)" : "none", borderBottom: scrollY > 60 ? "1px solid " + $.brd : "1px solid transparent", transition: "all .5s ease" }}>
        <div onClick={function() { go("hero"); }} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <Beacon s={22} />
          <span style={{ fontSize: 12, letterSpacing: 2, color: $.glow, fontWeight: 600 }}>W.R.E.N.</span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {["demo", "how", "proof", "honour"].map(function(id) {
            var labels = { demo: "Live Demo", how: "How It Works", proof: "Evidence", honour: "Honour" };
            return (<span key={id} onClick={function() { go(id); }} style={{ fontSize: 11, color: $.tx3, cursor: "pointer", letterSpacing: 1 }} onMouseEnter={function(e) { e.target.style.color = $.glow; }} onMouseLeave={function(e) { e.target.style.color = $.tx3; }}>{labels[id]}</span>);
          })}
          <button onClick={function() { setPage("command"); }} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 6, padding: "7px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Command Centre</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, marginLeft: -200, marginTop: -200, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", maxWidth: 680, position: "relative" }}>
          <Rv><div style={{ marginBottom: 24 }}><Beacon s={96} interactive={true} /></div></Rv>
          <Rv d={0.1}><h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 16px 0", fontFamily: serif }}>Reliability Monitoring for Smart Grid AI</h1></Rv>
          <Rv d={0.25}><p style={{ fontSize: 15, color: $.tx2, lineHeight: 1.8, maxWidth: 500, margin: "0 auto 32px", fontWeight: 300 }}>Detects distribution shift, calibration decay, and adversarial compromise in deployed ML models. Explains what changed. Recommends what to do.</p></Rv>
          <Rv d={0.4}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={function() { go("demo"); }} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Launch Live Demo</button>
              <button onClick={function() { go("how"); }} style={{ background: "transparent", border: "1px solid " + $.brd, borderRadius: 8, padding: "14px 32px", fontSize: 14, fontWeight: 500, color: $.tx2, cursor: "pointer" }}>See Architecture</button>
            </div>
          </Rv>
          
        </div>
      </section>

      {/* ═══ USE-CASE STRIP ═══ */}
      <section style={{ padding: "48px 24px", borderTop: "1px solid " + $.brd, borderBottom: "1px solid " + $.brd }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, maxWidth: 800, margin: "0 auto", background: $.brd, borderRadius: 10, overflow: "hidden", border: "1px solid " + $.brd }}>
          {[
            { icon: "\u26A0", title: "Anomaly Detection", desc: "Three sequential change detectors at different timescales. Page-Hinkley catches drift 26 batches before PSI confirms the source." },
            { icon: "\u25CE", title: "Drift Watch", desc: "Continuous PSI monitoring against training distribution. Alerts when feature distributions diverge beyond the 0.25 threshold." },
            { icon: "\u2726", title: "Reliability Scoring", desc: "Conformal prediction provides coverage guarantees. When the model's uncertainty estimates stop being trustworthy, the score tells you." },
            { icon: "\u2192", title: "Operator Guidance", desc: "Decision engine translates model state into engineering actions. Recalibrate, switch to fallback, increase damping, or alert." },
          ].map(function(c, i) {
            return (
              <Rv key={i} d={0.06 * i}>
                <div style={{ background: $.bg2, padding: "24px 18px", textAlign: "center", height: "100%" }}>
                  <div style={{ fontSize: 20, marginBottom: 10, opacity: 0.7 }}>{c.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: $.tx, marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: $.tx3, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </Rv>
            );
          })}
        </div>
      </section>

      {/* ═══ SIGNATURE DEMO ═══ */}
      <section id="demo" style={{ padding: "80px 24px 100px", background: $.bg2 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Rv><p style={{ fontFamily: F.m, fontSize: 11, color: $.glow, letterSpacing: 4, marginBottom: 12 }}>LIVE DEMO</p></Rv>
          <Rv d={0.08}><h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 600, margin: "0 0 12px 0", fontFamily: serif }}>Select a scenario. Watch the system respond.</h2></Rv>
          <Rv d={0.12}><p style={{ fontSize: 14, color: $.tx3, maxWidth: 480, margin: "0 auto" }}>Each scenario simulates a different operational condition. WREN detects, explains, and recommends in real time.</p></Rv>
        </div>
        <Rv d={0.2}><SignatureDemo /></Rv>
      </section>

      {/* ═══ COMMAND CENTRE CTA ═══ */}
      <section style={{ padding: "80px 24px", background: $.bg, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, marginLeft: -250, marginTop: -250, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", position: "relative", maxWidth: 560, margin: "0 auto" }}>
          <Rv><div style={{ marginBottom: 20 }}><Beacon s={56} /></div></Rv>
          <Rv d={0.08}><p style={{ fontFamily: F.m, fontSize: 11, color: $.glow, letterSpacing: 4, marginBottom: 12 }}>THE COMMAND CENTRE</p></Rv>
          <Rv d={0.15}><h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 600, fontFamily: serif, marginBottom: 16 }}>120 batches. Three drift phases. One system watching it all.</h2></Rv>
          <Rv d={0.22}><p style={{ fontSize: 14, color: $.tx3, lineHeight: 1.8, marginBottom: 28 }}>The full streaming simulation replays every batch of data through stable, drifting, and critical conditions. Auto-plays on entry. Every metric, every chart, every decision updates in real time.</p></Rv>
          <Rv d={0.3}><button onClick={function() { setPage("command"); }} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 8, padding: "16px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>Enter Command Centre</button></Rv>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" style={{ padding: "80px 24px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Rv><p style={{ fontFamily: F.m, fontSize: 11, color: $.glow, letterSpacing: 4, marginBottom: 12 }}>ARCHITECTURE</p></Rv>
          <Rv d={0.08}><h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 600, fontFamily: serif }}>Input. Monitor. Detect. Explain. Respond.</h2></Rv>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2, maxWidth: 800, margin: "0 auto", background: $.brd, borderRadius: 10, overflow: "hidden", border: "1px solid " + $.brd }}>
          {[
            { step: "01", title: "Ingest", desc: "48 physics-informed features from 12 raw DSGC parameters." },
            { step: "02", title: "Monitor", desc: "Streaming telemetry tracked across 120 sequential batches." },
            { step: "03", title: "Detect", desc: "PSI, CUSUM, and Page-Hinkley flag drift at three timescales." },
            { step: "04", title: "Explain", desc: "SHAP traces which features shifted and why confidence fell." },
            { step: "05", title: "Respond", desc: "Decision engine recommends recalibration, fallback, or alert." },
          ].map(function(s, i) {
            return (
              <Rv key={i} d={0.08 * i}>
                <div style={{ background: $.bg2, padding: "22px 16px", textAlign: "center", height: "100%" }}>
                  <div style={{ fontFamily: F.m, fontSize: 20, fontWeight: 300, color: $.glow, marginBottom: 8 }}>{s.step}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: $.tx, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: $.tx3, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </Rv>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Rv d={0.4}><p style={{ fontFamily: F.m, fontSize: 10, color: $.dim }}>Python 3.13 | scikit-learn 1.8 | LightGBM 4.6 | SHAP 0.50 | Optuna 4.7 | React | 3,300 lines | 22 automated stages</p></Rv>
        </div>
      </section>

      {/* ═══ PROOF ═══ */}
      <section id="proof" style={{ padding: "80px 24px 100px", background: $.bg2 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Rv><p style={{ fontFamily: F.m, fontSize: 11, color: $.glow, letterSpacing: 4, marginBottom: 12 }}>EVIDENCE</p></Rv>
          <Rv d={0.08}><h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 600, fontFamily: serif }}>Measured. Not claimed.</h2></Rv>
          <Rv d={0.12}><p style={{ fontSize: 12, color: $.dim, marginTop: 8 }}>Illustrative metrics from 60,000 sample sandbox evaluation.</p></Rv>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 720, margin: "0 auto" }}>
          {[
            { label: "Static AUC", value: "1.0000", sub: "6 errors in 12,000 samples" },
            { label: "Deployment AUC", value: "0.8834", sub: "After drift + regime change" },
            { label: "ECE Degradation", value: "214x", sub: "Confidence failed before accuracy" },
            { label: "Coverage", value: "99.97%", sub: "Conformal guarantee on clean data" },
            { label: "Drift Detection", value: "Batch 9", sub: "Page-Hinkley first signal" },
            { label: "Flip Rate Reduction", value: "4.3x", sub: "Stacking vs SVM alone" },
            { label: "False Positive Rate", value: "0.05%", sub: "6 false alarms in 12,000" },
            { label: "Signals Monitored", value: "14", sub: "RFECV-selected from 48 features" },
          ].map(function(m, i) {
            return (
              <Rv key={i} d={0.05 * i}>
                <div style={{ background: $.bg, border: "1px solid " + $.brd, borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: $.glow, fontFamily: F.m, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: $.tx, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: $.dim, lineHeight: 1.4 }}>{m.sub}</div>
                </div>
              </Rv>
            );
          })}
        </div>
      </section>

      {/* ═══ HONOUR ═══ */}
      <section id="honour" style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          <Rv><div style={{ width: 36, height: 1, background: $.glow, margin: "0 auto 24px", opacity: 0.3 }} /></Rv>
          <Rv d={0.1}><p style={{ fontSize: 12, letterSpacing: 4, color: $.dim, marginBottom: 20 }}>IN HONOUR</p></Rv>
          <Rv d={0.2}><p style={{ fontSize: 16, fontStyle: "italic", lineHeight: 1.9, color: $.tx2, fontFamily: serif, marginBottom: 24 }}>W.R.E.N. is named for the Women's Royal Naval Service, who served at HMS Vernon, Portsmouth, from 1939 to 1945.</p></Rv>
          <Rv d={0.3}><p style={{ fontSize: 13, lineHeight: 1.9, color: $.tx3, marginBottom: 20 }}>They sat in signals rooms, detecting anomalies in the noise and warning of danger before it arrived.</p></Rv>
          
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "24px 28px", borderTop: "1px solid " + $.brd, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Beacon s={14} /><span style={{ fontSize: 10, letterSpacing: 2, color: $.dim }}>W.R.E.N.</span></div>
        <div style={{ fontSize: 10, color: $.dim }}>Husain Ali Al Hashem | University of Portsmouth | 2025-2026</div>
        <div style={{ fontSize: 10, color: $.dim, fontStyle: "italic" }}>Powered by A.G.N.E.S. v4.2</div>
      </footer>
    </div>
  );
}

