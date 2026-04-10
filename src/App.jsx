import { useState, useEffect, useRef, useMemo } from "react";
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

/* ═══ DECISION POINTS ═══ */
var ALL_DECISION_POINTS = [
  {
    id:"drift", batch:55, urgency:$.ac, label:"GRADUAL DRIFT DETECTED",
    progressStress:[[0,0,0,0],[1,0,0,0],[1,0,0,1]],
    stressTimes:[0,1400,2800],
    sequence:[
      {t:700,  msg:"PSI index crossing 0.25 threshold at batch 55.",lvl:"warn"},
      {t:1800, msg:"Conformal coverage degrading below 95% target.",lvl:"warn"},
      {t:2900, msg:"Calibration error rising. Model confidence decaying faster than accuracy.",lvl:"alert"},
      {t:4100, msg:"\u25ba OPERATOR ACTION REQUIRED",lvl:"critical"},
    ],
    snap:{auc:"0.927",psi:"0.35",cov:"88.6%",aucC:$.ac,psiC:$.ac,covC:$.ac},
    options:[
      {icon:"",label:"Trigger Recalibration",desc:"Reinitialise the LaSCal pipeline against current data distribution.",outcome:"good",
       consequence:"Calibration error stabilises. Coverage recovers toward 94%. Model remains operationally trustworthy through the drift phase."},
      {icon:"",label:"Hold: Continue Monitoring",desc:"No intervention. Continue observing. Do not act yet.",outcome:"bad",
       consequence:"ECE triples over the next 10 batches. The recalibration window closes. You will need emergency action to recover."},
    ],
    afterStress:{good:[0,0,0,0],bad:[2,0,1,2]},
  },
  {
    id:"adversarial", batch:65, urgency:$.rd, label:"ADVERSARIAL ATTACK",
    progressStress:[[0,0,0,0],[1,0,0,0],[2,0,1,0]],
    stressTimes:[0,1200,2600],
    sequence:[
      {t:600,  msg:"Anomalous gradient pattern detected in telemetry stream.",lvl:"warn"},
      {t:1600, msg:"SVM flip rate rising. RBF boundary under FGSM attack.",lvl:"alert"},
      {t:2700, msg:"GEN node telemetry compromised. Adversarial input confirmed.",lvl:"alert"},
      {t:3800, msg:"\u25ba OPERATOR ACTION REQUIRED",lvl:"critical"},
    ],
    snap:{auc:"0.916",psi:"0.57",cov:"86.5%",aucC:$.ac,psiC:$.rd,covC:$.ac},
    options:[
      {icon:"",label:"Switch to RF Fallback",desc:"Route all predictions through the Random Forest model only.",outcome:"good",
       consequence:"Tree models have zero gradient in leaf regions. FGSM immune. Flip rate drops to 0.04%. Grid confidence fully restored."},
      {icon:"",label:"Trigger Recalibration",desc:"Recalibrate the Hybrid model against recent data.",outcome:"bad",
       consequence:"Recalibration cannot address adversarial vulnerability. Attack continues. SVM flip rate reaches 19.8%. Grid assessments unreliable."},
    ],
    afterStress:{good:[0,0,0,0],bad:[2,1,2,1]},
  },
  {
    id:"collapse", batch:85, urgency:$.rd, label:"REGIME COLLAPSE",
    progressStress:[[0,0,0,0],[1,1,0,0],[2,2,1,0],[2,2,2,1]],
    stressTimes:[0,900,2100,3300],
    sequence:[
      {t:500,  msg:"Page Hinkley detector triggered.",lvl:"warn"},
      {t:1300, msg:"CUSUM threshold breached. Regime shift in progress.",lvl:"alert"},
      {t:2400, msg:"PSI above 1.6. All nodes operating outside training bounds.",lvl:"alert"},
      {t:3400, msg:"Coverage at 83\u0025. One in six predictions untrustworthy.",lvl:"alert"},
      {t:4500, msg:"\u25ba EMERGENCY ACTION REQUIRED",lvl:"critical"},
    ],
    snap:{auc:"0.877",psi:"1.65",cov:"83.0%",aucC:$.rd,psiC:$.rd,covC:$.rd},
    options:[
      {icon:"",label:"Alert Operator: Reduce Load",desc:"Escalate to human oversight. Shed load at nodes 2 and 3.",outcome:"good",
       consequence:"Human oversight takes control during model uncertainty. Load reduction creates stability margin. Grid holds, no cascade."},
      {icon:"",label:"Continue Monitoring",desc:"No action. Observe further before committing.",outcome:"bad",
       consequence:"Cascade risk escalates rapidly. Grid health deteriorates beyond recovery threshold. Emergency shutdown unavoidable."},
    ],
    afterStress:{good:[0,1,0,0],bad:[2,2,2,2]},
  },
  {
    id:"sensor_fail", batch:34, urgency:$.ac, label:"SENSOR CORRUPTION",
    progressStress:[[0,0,0,0],[0,0,1,0],[0,1,1,0]],
    stressTimes:[0,1500,3000],
    sequence:[
      {t:800,  msg:"DIST node telemetry showing intermittent NaN values.",lvl:"warn"},
      {t:2000, msg:"LOAD node readings diverging from physical expectations.",lvl:"warn"},
      {t:3200, msg:"Three sensors reporting values outside calibrated range.",lvl:"alert"},
      {t:4200, msg:"\u25ba OPERATOR ACTION REQUIRED",lvl:"critical"},
    ],
    snap:{auc:"0.944",psi:"0.18",cov:"91.2%",aucC:$.ac,psiC:$.gn,covC:$.ac},
    options:[
      {icon:"",label:"Quarantine Suspect Sensors",desc:"Isolate corrupted inputs. Fall back to validated channels only.",outcome:"good",
       consequence:"Corrupted readings removed from pipeline. Model operates on reduced but clean data. Accuracy holds at 93.8% on verified channels."},
      {icon:"",label:"Trigger Full Recalibration",desc:"Recalibrate against all current data including suspect readings.",outcome:"bad",
       consequence:"Recalibration absorbs corrupted data as ground truth. Model learns wrong patterns. Accuracy degrades to 86% within 5 batches."},
    ],
    afterStress:{good:[0,0,0,0],bad:[1,2,1,0]},
  },
  {
    id:"load_spike", batch:42, urgency:$.rd, label:"DEMAND SURGE",
    progressStress:[[0,0,0,0],[0,2,0,0],[1,2,0,1]],
    stressTimes:[0,1000,2200],
    sequence:[
      {t:600,  msg:"LOAD node demand exceeding 95th percentile of training data.",lvl:"warn"},
      {t:1400, msg:"Prediction latency increasing. Model struggling with out-of-distribution inputs.",lvl:"alert"},
      {t:2600, msg:"STORE node reserves depleting. Grid balance at risk.",lvl:"alert"},
      {t:3600, msg:"\u25ba OPERATOR ACTION REQUIRED",lvl:"critical"},
    ],
    snap:{auc:"0.931",psi:"0.42",cov:"89.1%",aucC:$.ac,psiC:$.ac,covC:$.ac},
    options:[
      {icon:"",label:"Shed Non-Critical Load",desc:"Reduce demand on LOAD node to within training bounds.",outcome:"good",
       consequence:"Demand returns to known operating range. Model predictions stabilise. Coverage recovers to 94%. No cascading impact."},
      {icon:"",label:"Switch to Emergency Model",desc:"Deploy simplified fallback model designed for extreme conditions.",outcome:"bad",
       consequence:"Fallback model lacks feature coverage for this scenario. Predictions worse than primary model. Grid instability increases for 12 batches."},
    ],
    afterStress:{good:[0,0,0,0],bad:[1,2,1,2]},
  },
  {
    id:"false_flood", batch:48, urgency:$.ac, label:"ALERT FLOOD",
    progressStress:[[0,0,0,0],[1,0,0,0],[1,1,1,0]],
    stressTimes:[0,1300,2800],
    sequence:[
      {t:700,  msg:"PSI micro-spikes across all nodes. 14 alerts in 30 seconds.",lvl:"warn"},
      {t:1800, msg:"CUSUM triggering on transient patterns. High false positive rate suspected.",lvl:"warn"},
      {t:2900, msg:"Alert volume overwhelming. Real threats may be masked.",lvl:"alert"},
      {t:4000, msg:"\u25ba OPERATOR ACTION REQUIRED",lvl:"critical"},
    ],
    snap:{auc:"0.952",psi:"0.29",cov:"93.5%",aucC:$.gn,psiC:$.ac,covC:$.ac},
    options:[
      {icon:"",label:"Raise Alert Threshold",desc:"Temporarily increase detection sensitivity to filter noise.",outcome:"good",
       consequence:"Alert volume drops 90%. The three real anomalies remain visible. Operators can focus on genuine threats. Grid monitored effectively."},
      {icon:"",label:"Escalate All Alerts",desc:"Treat every alert as genuine. Escalate everything to human review.",outcome:"bad",
       consequence:"Human operators overwhelmed within minutes. Real threat buried in noise. Critical drift signal missed entirely. Response delayed by 8 batches."},
    ],
    afterStress:{good:[0,0,0,0],bad:[1,1,2,1]},
  },
];

/* Shuffle array utility */
function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = a[i]; a[i] = a[j]; a[j] = temp;
  }
  return a;
}

/* Pick 3 random scenarios and randomize option order */
function pickScenarios() {
  var shuffled = shuffleArray(ALL_DECISION_POINTS);
  var picked = shuffled.slice(0, 3);
  return picked.map(function(dp) {
    if (Math.random() > 0.5) {
      return Object.assign({}, dp, { options: [dp.options[1], dp.options[0]] });
    }
    return dp;
  });
}


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

function SignatureDemo() {
  var _sc = useState("nominal"); var scenario = _sc[0]; var setScenario = _sc[1];
  var _playing = useState(false); var playing = _playing[0]; var setPlaying = _playing[1];
  var _si = useState(0); var sceneIdx = _si[0]; var setSceneIdx = _si[1];
  var _health = useState(98); var dispHealth = _health[0]; var setDispHealth = _health[1];
  var _alerts = useState([]); var alerts = _alerts[0]; var setAlerts = _alerts[1];
  var _done = useState(false); var done = _done[0]; var setDone = _done[1];
  var _started = useState(false); var started = _started[0]; var setStarted = _started[1];
  var timerRef = useRef(null); var healthRef = useRef(null); var wrapRef = useRef(null);
  var sc = SCENARIOS[scenario]; var b = sc.batch;
  var aucData = useMemo(function() { return SH.map(function(v, i) { return { b: i, H: v, S: SV[i] }; }); }, []);

  /* Start playing only when scrolled into view */
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
    setAlerts(function(prev) { if (idx === 0) return []; return prev.concat([{ time: Date.now(), text: target.alert, color: target.color }]); });
    var startHealth = dispHealth; var endHealth = target.health; var steps = 30; var step = 0;
    clearInterval(healthRef.current);
    healthRef.current = setInterval(function() {
      step++; var t = step / steps; var ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setDispHealth(Math.round(startHealth + (endHealth - startHealth) * ease));
      if (step >= steps) clearInterval(healthRef.current);
    }, 30);
    timerRef.current = setTimeout(function() {
      if (idx < SCENE_ORDER.length - 1) { setSceneIdx(idx + 1); } else { setPlaying(false); setDone(true); }
    }, SCENE_TIMING[idx]);
    return function() { clearTimeout(timerRef.current); clearInterval(healthRef.current); };
  }, [playing, sceneIdx]);

  function manualSelect(key) { setPlaying(false); setDone(true); setScenario(key); setDispHealth(SCENARIOS[key].health); setAlerts([{ time: Date.now(), text: SCENARIOS[key].alert, color: SCENARIOS[key].color }]); }
  function replay() { setSceneIdx(0); setDispHealth(98); setAlerts([]); setDone(false); setPlaying(true); }
  var healthColor = dispHealth > 90 ? $.gn : dispHealth > 75 ? $.ac : $.rd;

  return (
    <div ref={wrapRef} style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Scenario strip - minimal */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {SCENE_ORDER.map(function(key, i) {
          var s = SCENARIOS[key]; var isCurrent = scenario === key; var isPast = SCENE_ORDER.indexOf(scenario) > i;
          return (<div key={key} style={{ flex: 1, textAlign: "center" }}><div style={{ height: 2, borderRadius: 1, background: isCurrent ? s.color : isPast ? s.color + "55" : "rgba(255,255,255,.04)", transition: "background .5s", marginBottom: 5 }} /><div style={{ fontFamily: F.m, fontSize: 8, color: isCurrent ? s.color : $.dim, transition: "color .3s", fontWeight: isCurrent ? 600 : 400 }}>{s.label}</div></div>);
        })}
      </div>
      {/* Narration - subtle, not a card */}
      <div style={{ marginBottom: 16, transition: "all .5s" }}>
        <div style={{ fontSize: 12, color: $.tx3, lineHeight: 1.6, fontStyle: "italic", opacity: 0.8 }}>{sc.plain}</div>
      </div>
      {/* Main row: health dominant + status + chart */}
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, marginBottom: 16 }}>
        {/* Health - dominant */}
        <div style={{ background: "rgba(255,255,255,.025)", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1, marginBottom: 10 }}>HEALTH</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: healthColor, fontFamily: F.m, lineHeight: 1, transition: "color .3s" }}>{dispHealth}</div>
          <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,.04)", borderRadius: 2, marginTop: 12, overflow: "hidden" }}><div style={{ width: dispHealth + "%", height: "100%", background: healthColor, borderRadius: 2, transition: "width .8s, background .5s" }} /></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc.color, animation: sc.color !== $.gn ? "wpulse 1.5s ease-in-out infinite" : "none" }} />
            <span style={{ fontFamily: F.m, fontSize: 9, color: sc.color, fontWeight: 600 }}>{sc.status}</span>
          </div>
        </div>
        {/* Chart */}
        <div style={{ background: "rgba(255,255,255,.025)", borderRadius: 12, padding: "14px 14px 6px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: $.tx, marginBottom: 6 }}>Model confidence</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={aucData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,.03)" />
              <XAxis dataKey="b" tick={TK} tickLine={false} />
              <YAxis domain={["auto", "auto"]} tick={TK} tickLine={false} width={32} />
              <Tooltip contentStyle={TT} />
              <ReferenceLine x={b} stroke={$.glow} strokeWidth={1.5} strokeOpacity={0.7} />
              {sc.showDrift && <ReferenceLine x={40} stroke={$.ac} strokeDasharray="4 4" strokeOpacity={0.25} />}
              {sc.showRegime && <ReferenceLine x={80} stroke={$.rd} strokeDasharray="4 4" strokeOpacity={0.25} />}
              <Line type="monotone" dataKey="H" stroke={$.glow} strokeWidth={2} dot={false} name="Hybrid" />
              <Line type="monotone" dataKey="S" stroke="#a78bfa" strokeWidth={1} dot={false} opacity={0.2} name="SVM" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Action row - compact */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, fontSize: 11, color: $.tx3, lineHeight: 1.6 }}>
          {alerts.length === 0 && <span style={{ color: $.dim }}>All systems nominal.</span>}
          {alerts.slice(-2).map(function(a, i) { return (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4, animation: "wup .3s ease both" }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: a.color, marginTop: 5, flexShrink: 0 }} /><span style={{ color: $.tx2, fontSize: 11 }}>{a.text}</span></div>); })}
        </div>
        <div style={{ background: sc.color + "08", borderRadius: 8, padding: "10px 14px", maxWidth: 280, flexShrink: 0 }}>
          <div style={{ fontFamily: F.m, fontSize: 7, color: sc.color, letterSpacing: 1, marginBottom: 3 }}>ACTION</div>
          <div style={{ fontSize: 11, color: $.tx, lineHeight: 1.5 }}>{sc.action}</div>
        </div>
      </div>
      {/* Replay - minimal */}
      <div style={{ textAlign: "center" }}>
        {playing && (<button onClick={function() { setPlaying(false); setDone(true); }} style={{ padding: "6px 16px", borderRadius: 6, background: "rgba(255,255,255,.03)", color: $.dim, fontFamily: F.m, fontSize: 10, cursor: "pointer", border: "none", transition: "color .2s" }} onMouseEnter={function(e){e.target.style.color=$.tx2;}} onMouseLeave={function(e){e.target.style.color=$.dim;}}>Skip →</button>)}
        {done && (<div style={{ animation: "wup .4s ease both" }}><div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>{SCENE_ORDER.map(function(key) { var s = SCENARIOS[key]; var active = scenario === key; return (<button key={key} onClick={function() { manualSelect(key); }} style={{ padding: "6px 14px", borderRadius: 6, fontFamily: F.m, fontSize: 10, fontWeight: active ? 700 : 400, cursor: "pointer", color: active ? $.bg : $.dim, background: active ? s.color : "rgba(255,255,255,.025)", border: "none", transition: "all .2s" }} onMouseEnter={function(e){if(!active)e.target.style.background="rgba(255,255,255,.05)";e.target.style.color=active?$.bg:$.tx2;}} onMouseLeave={function(e){if(!active)e.target.style.background="rgba(255,255,255,.025)";e.target.style.color=active?$.bg:$.dim;}}>{s.label}</button>); })}<button onClick={replay} style={{ padding: "6px 14px", borderRadius: 6, fontFamily: F.m, fontSize: 10, cursor: "pointer", color: $.glow, background: "rgba(251,191,36,.06)", border: "none", transition: "all .2s" }} onMouseEnter={function(e){e.target.style.background="rgba(251,191,36,.12)";}} onMouseLeave={function(e){e.target.style.background="rgba(251,191,36,.06)";}}>Replay</button></div></div>)}
      </div>
    </div>
  );
}

/* ═══ GRID OPERATOR SIMULATION turn-based ═══ */

/* ═══ ANIMATED GRID cinematic node topology ═══ */
function AnimatedGrid({ stressed }) {
  var W = 380, H = 300;
  var pos = [
    { x: W/2, y: 44,     label:"GEN",   sub:"Generator"     },
    { x: W-44, y: H/2,   label:"LOAD",  sub:"Consumer"      },
    { x: W/2, y: H-44,   label:"DIST",  sub:"Distribution"  },
    { x: 44,  y: H/2,    label:"STORE", sub:"Storage"       },
  ];
  var links = [[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]];
  function nc(i){ return stressed[i]===2?$.rd:stressed[i]===1?$.ac:$.gn; }
  function lmax(a,b){ return Math.max(stressed[a],stressed[b]); }
  function lcol(a,b){ var s=lmax(a,b); return s===2?$.rd:s===1?$.ac:"rgba(26,56,90,.35)"; }

  return (
    <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:"auto",display:"block"}}>
      <defs>
        <style>{`
          @keyframes flowDash{0%{stroke-dashoffset:28}100%{stroke-dashoffset:0}}
          @keyframes ringWarn{0%,100%{r:26;opacity:.18}50%{r:32;opacity:.32}}
          @keyframes ringCrit{0%,100%{r:28;opacity:.28}50%{r:38;opacity:.5}}
          @keyframes nodeGlow{0%,100%{opacity:.7}50%{opacity:1}}
        `}</style>
      </defs>
      {/* connections */}
      {links.map(function(pair,i){
        var a=pair[0],b=pair[1],s=lmax(a,b);
        return (
          <line key={i}
            x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
            stroke={lcol(a,b)}
            strokeWidth={s>0?1.8:0.7}
            strokeDasharray={s>0?"9,6":"none"}
            opacity={s===0?0.12:0.8}
            style={s>0?{animation:"flowDash 0.85s linear infinite"}:{}}
          />
        );
      })}
      {/* nodes */}
      {pos.map(function(p,i){
        var col=nc(i), s=stressed[i];
        return (
          <g key={i}>
            {s===1 && <circle cx={p.x} cy={p.y} r="26" fill={col} opacity=".18" style={{animation:"ringWarn 1.4s ease-in-out infinite"}}/>}
            {s===2 && <circle cx={p.x} cy={p.y} r="28" fill={col} opacity=".28" style={{animation:"ringCrit 0.75s ease-in-out infinite"}}/>}
            <circle cx={p.x} cy={p.y} r="21" fill="#080f1c" stroke={col} strokeWidth={s>0?2.2:1} opacity={s>0?1:0.45}
              style={s>0?{animation:"nodeGlow 1.2s ease-in-out infinite"}:{}}/>
            <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle"
              fill={col} fontSize="10" fontFamily={F.m} fontWeight="700" letterSpacing="1">{p.label}</text>
            <text x={p.x} y={p.y+16} textAnchor="middle"
              fill={col} fontSize="7" fontFamily={F.m} opacity=".55">{p.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══ GRID OPERATOR SIMULATION cinematic control room ═══ */
function GridOperatorSim(props) {
  useStyles();
  var _phase    = useState("intro");    var phase    = _phase[0];    var setPhase    = _phase[1];
  var _idx      = useState(0);          var idx      = _idx[0];      var setIdx      = _idx[1];
  var _chosen   = useState(null);       var chosen   = _chosen[0];   var setChosen   = _chosen[1];
  var _decisions= useState([]);         var decisions= _decisions[0]; var setDecisions= _decisions[1];
  var _stress   = useState([0,0,0,0]);  var stress   = _stress[0];   var setStress   = _stress[1];
  var _alerts   = useState([]);         var alerts   = _alerts[0];   var setAlerts   = _alerts[1];
  var _canAct   = useState(false);      var canAct   = _canAct[0];   var setCanAct   = _canAct[1];
  var _resolved = useState(false);      var resolved = _resolved[0]; var setResolved = _resolved[1];
  var _flash    = useState("");         var flash    = _flash[0];    var setFlash    = _flash[1];
  var _shake    = useState(false);      var shake    = _shake[0];    var setShake    = _shake[1];
  var _introStep= useState(0);         var introStep= _introStep[0];var setIntroStep= _introStep[1];
  var _scenarios= useState(pickScenarios); var scenarios= _scenarios[0]; var setScenarios= _scenarios[1];
  var timers    = useRef([]);
  var alertRef  = useRef(null);

  function repick() { setScenarios(pickScenarios()); }

  function clrT(){ timers.current.forEach(clearTimeout); timers.current=[]; }

  function triggerFlash(color) {
    setFlash(color); setTimeout(function(){ setFlash(""); }, 400);
  }
  function triggerShake() {
    setShake(true); setTimeout(function(){ setShake(false); }, 500);
  }

  function beginWatch(dpIdx) {
    var d = scenarios[dpIdx !== undefined ? dpIdx : idx];
    clrT();
    setPhase("watch"); setStress([0,0,0,0]); setAlerts([]); setCanAct(false); setChosen(null); setResolved(false);
    var t = [];
    d.progressStress.forEach(function(s,i){
      t.push(setTimeout(function(){ setStress(s); if(i>0) triggerFlash(d.urgency+"22"); }, d.stressTimes[i]));
    });
    d.sequence.forEach(function(ev){
      t.push(setTimeout(function(){
        setAlerts(function(prev){ return prev.concat([{msg:ev.msg,lvl:ev.lvl}]); });
        if (ev.lvl==="alert") triggerFlash($.rd+"18");
        if (ev.lvl==="critical") { triggerShake(); triggerFlash($.rd+"28"); t.push(setTimeout(function(){ setCanAct(true); }, 800)); }
      }, ev.t));
    });
    timers.current = t;
  }

  function choose(i) {
    clrT();
    var d = scenarios[idx];
    var opt = d.options[i];
    setChosen(i); setCanAct(false);
    setAlerts(function(prev){ return prev.concat([{msg:"Operator: "+opt.label,lvl:"apply"}]); });
    timers.current.push(setTimeout(function(){
      var ak = opt.outcome==="good" ? "good" : "bad";
      setStress(d.afterStress[ak]);
      triggerFlash(opt.outcome==="good"?$.gn+"30":$.rd+"30");
      if(opt.outcome!=="good") triggerShake();
      setAlerts(function(prev){ return prev.concat([{msg:(opt.outcome==="good"?"\u2713 ":"\u2717 ")+opt.consequence,lvl:opt.outcome==="good"?"good":"fail"}]); });
      setDecisions(function(prev){ return prev.concat([{label:opt.label,outcome:opt.outcome,consequence:opt.consequence,batch:d.batch}]); });
    }, 2000));
    timers.current.push(setTimeout(function(){ setResolved(true); }, 3800));
  }

  function advance() {
    var next = idx + 1;
    if (next >= scenarios.length) { setPhase("debrief"); }
    else { setIdx(next); beginWatch(next); }
  }

  useEffect(function(){ return function(){ clrT(); }; }, []);
  useEffect(function(){ if(alertRef.current) alertRef.current.scrollTop=alertRef.current.scrollHeight; }, [alerts]);

  // Staged intro animation
  useEffect(function() {
    if (phase !== "intro") return;
    setIntroStep(0);
    var t1 = setTimeout(function(){ setIntroStep(1); }, 600);
    var t2 = setTimeout(function(){ setIntroStep(2); }, 1800);
    var t3 = setTimeout(function(){ setIntroStep(3); }, 3000);
    return function(){ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  var correct = decisions.filter(function(d){ return d.outcome==="good"; }).length;
  var oc = function(o){ return o==="good"?$.gn:o==="bad"?$.rd:$.ac; };
  var ol = function(o){ return o==="good"?"Correct":o==="bad"?"Wrong":"Partial"; };
  var dp = scenarios[idx];
  var chosenOpt = chosen !== null ? dp.options[chosen] : null;
  var maxStress = Math.max.apply(null, stress);
  var dangerColor = maxStress===2?$.rd:maxStress===1?$.ac:"transparent";

  /* ── INTRO ── */
  if (phase==="intro") {

    return (
      <div style={{position:"fixed",inset:0,background:"#030710",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:F.s,overflow:"hidden"}}>
        {/* Ambient grid in background */}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:introStep>=1?0.15:0,transition:"opacity 2s ease"}}>
          <div style={{width:400,maxWidth:"90vw"}}><AnimatedGrid stressed={[0,0,0,0]}/></div>
        </div>

        {/* Content */}
        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 24px"}}>
          <div style={{marginBottom:24,opacity:introStep>=1?1:0,transform:introStep>=1?"none":"scale(0.8)",transition:"all 1.2s cubic-bezier(0.16,1,0.3,1)"}}>
            <Beacon s={64} glow={introStep>=2?0.6:0.1}/>
          </div>

          <div style={{opacity:introStep>=1?1:0,transform:introStep>=1?"none":"translateY(20px)",transition:"all 1s ease 0.3s"}}>
            <p style={{fontFamily:F.m,fontSize:10,color:$.glow,letterSpacing:6,marginBottom:20}}>OPERATIONS CENTRE</p>
          </div>

          <div style={{opacity:introStep>=2?1:0,transform:introStep>=2?"none":"translateY(20px)",transition:"all 1s ease"}}>
            <h2 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:600,fontFamily:serif,color:$.tx,marginBottom:10,lineHeight:1.5}}>
              The model is deployed.<br/>It is about to start failing.
            </h2>
            <p style={{fontSize:13,color:$.tx3,lineHeight:1.8,maxWidth:400,margin:"0 auto",marginBottom:8}}>
              The AI is live on the grid. Three incidents will degrade its predictions. A.G.N.E.S. will flag what is changing. You decide how to respond.
            </p>
            <p style={{fontSize:11,color:$.dim,fontFamily:F.m,marginBottom:0}}>
              No timer. No score. Only consequence.
            </p>
          </div>

          <div style={{opacity:introStep>=3?1:0,transform:introStep>=3?"none":"translateY(12px)",transition:"all 0.8s ease",marginTop:32}}>
            <button onClick={function(){ setIdx(0); setIntroStep(0); beginWatch(0); }}
              style={{background:$.glow,color:$.bg,border:"none",borderRadius:10,padding:"16px 52px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:F.s,letterSpacing:0.5}}>
              Begin Watch
            </button>
          </div>
        </div>

        {/* Exit */}
        <button onClick={props.onBack} style={{position:"absolute",top:20,right:24,background:"transparent",border:"none",color:$.dim,fontSize:11,fontFamily:F.m,cursor:"pointer",letterSpacing:1}}>EXIT</button>
      </div>
    );
  }

  /* ── DEBRIEF ── */
  if (phase==="debrief") return (
    <div style={{position:"fixed",inset:0,background:"#030710",fontFamily:F.s,overflowY:"auto"}}>
      {/* Background grid reflects outcome */}
      <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:0.08}}>
        <div style={{width:500,maxWidth:"90vw"}}><AnimatedGrid stressed={correct===3?[0,0,0,0]:correct>=2?[1,0,0,1]:[2,2,1,2]}/></div>
      </div>

      <div style={{position:"relative",zIndex:2,maxWidth:580,margin:"0 auto",padding:"60px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
            <Beacon s={56} glow={correct===3?0.95:correct>=2?0.4:0.05}/>
          </div>
          <p style={{fontFamily:F.m,fontSize:9,color:correct===3?$.gn:correct>=2?$.ac:$.rd,letterSpacing:4,marginBottom:14}}>
            {correct===3?"MODEL INTEGRITY MAINTAINED":correct>=2?"PARTIAL RECOVERY":"MODEL FAILURE"}
          </p>
          <h2 style={{fontSize:"clamp(20px,4vw,30px)",fontWeight:600,fontFamily:serif,color:$.tx,lineHeight:1.5,marginBottom:8}}>
            {correct===3?"Three for three. The model held." : correct===2?"Two right. One wrong. The model survived." : correct===1?"One right wasn't enough." : "The model collapsed."}
          </h2>
          <p style={{fontSize:12,color:$.dim,fontStyle:"italic"}}>
            {correct===3?"Every signal read. Every call correct." : correct>=2?"Close. But close isn't safe." : "A.G.N.E.S. warned you."}
          </p>
        </div>

        {/* Incident cards */}
        {decisions.map(function(d,i){
          var c=oc(d.outcome);
          return (
            <div key={i} style={{background:"rgba(255,255,255,.02)",border:"1px solid "+c+"22",borderRadius:12,padding:"20px 22px",marginBottom:12,borderLeft:"3px solid "+c}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:c+"14",border:"2px solid "+c+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:c,fontWeight:700}}>
                    {d.outcome==="good"?"\u2713":"\u2717"}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:$.tx}}>{d.label}</div>
                    <div style={{fontFamily:F.m,fontSize:8,color:$.dim}}>BATCH {d.batch}</div>
                  </div>
                </div>
              </div>
              <div style={{fontSize:12,color:$.tx3,lineHeight:1.8,paddingLeft:38}}>{d.consequence}</div>
            </div>
          );
        })}

        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:32}}>
          <button onClick={function(){ repick(); setIdx(0); setDecisions([]); setIntroStep(0); setPhase("intro"); }}
            style={{background:$.glow,color:$.bg,border:"none",borderRadius:10,padding:"14px 32px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Try Again</button>
          <button onClick={props.onBack}
            style={{background:"transparent",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"14px 28px",fontSize:14,color:$.tx3,cursor:"pointer"}}>Exit</button>
        </div>
      </div>
    </div>
  );

  /* ── WATCH / DECIDE / RESOLVE ── */
  var statusLabel = !canAct && !chosen ? "MONITORING" : canAct && !chosen ? "ACTION REQUIRED" : chosen && !resolved ? "APPLYING..." : "RESOLVED";
  var statusColor = canAct && !chosen ? dp.urgency : resolved && chosenOpt ? oc(chosenOpt.outcome) : $.glow;

  return (
    <div style={{position:"fixed",inset:0,background:"#030710",fontFamily:F.s,color:$.tx,overflow:"hidden",
      animation:shake?"wshake 0.4s ease":"none"}}>

      {/* Edge danger glow */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:20,
        boxShadow:maxStress>=2
          ?"inset 0 0 150px "+$.rd+"20, inset 0 0 60px "+$.rd+"10"
          :maxStress>=1
            ?"inset 0 0 100px "+$.ac+"12"
            :"none",
        transition:"box-shadow 1s ease"}}/>

      {/* Flash overlay */}
      {flash && <div style={{position:"absolute",inset:0,background:flash,zIndex:25,pointerEvents:"none",animation:"wup 0.3s ease both"}}/>}

      {/* FULL SCREEN GRID as hero */}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        opacity:canAct&&!chosen?0.35:0.6,transition:"opacity 0.8s ease",
        filter:canAct&&!chosen?"brightness(0.7)":"none"}}>
        <div style={{width:"min(600px, 85vw)",transform:canAct&&!chosen?"scale(1.02)":"scale(1)",transition:"transform 0.8s ease"}}>
          <AnimatedGrid stressed={stress}/>
        </div>
      </div>

      {/* Top bar */}
      <div style={{position:"relative",zIndex:10,padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Beacon s={22} glow={maxStress===0?0.6:maxStress===1?0.3:0.05}/>
          <span style={{fontFamily:F.m,fontSize:11,color:$.glow,fontWeight:700}}>W.R.E.N.</span>
          <span style={{fontFamily:F.m,fontSize:8,color:$.dim,letterSpacing:1}}>POWERED BY A.G.N.E.S.</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{display:"flex",gap:4}}>
            {scenarios.map(function(_,i){ return (<div key={i} style={{width:28,height:3,borderRadius:2,background:i<idx?$.glow:i===idx?dp.urgency+"cc":"rgba(255,255,255,.06)",transition:"background .3s"}}/>); })}
          </div>
          <button onClick={props.onBack} style={{background:"transparent",border:"none",color:$.dim,fontSize:10,fontFamily:F.m,cursor:"pointer"}}>EXIT</button>
        </div>
      </div>

      {/* Status bar */}
      <div style={{position:"relative",zIndex:10,padding:"0 24px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:statusColor,boxShadow:"0 0 12px "+statusColor,
            animation:canAct&&!chosen?"wpulse 0.7s ease-in-out infinite":"none",transition:"background .3s"}}/>
          <span style={{fontFamily:F.m,fontSize:10,color:statusColor,letterSpacing:".08em",fontWeight:600}}>{statusLabel}</span>
          <span style={{fontFamily:F.m,fontSize:9,color:dp.urgency,opacity:.7}}>{dp.label}</span>
          <span style={{fontFamily:F.m,fontSize:9,color:$.dim}}>BATCH {dp.batch}</span>
        </div>
      </div>

      {/* Bottom panel: alerts + actions */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:15,
        background:"linear-gradient(transparent, rgba(3,7,16,.95) 30%)",
        paddingTop:60}}>

        {/* Metrics strip */}
        <div style={{display:"flex",gap:6,padding:"0 24px",marginBottom:12}}>
          {[
            {l:"AUC",v:dp.snap.auc,c:dp.snap.aucC},
            {l:"PSI",v:dp.snap.psi,c:dp.snap.psiC},
            {l:"COV",v:dp.snap.cov,c:dp.snap.covC},
          ].map(function(m){ return (
            <div key={m.l} style={{background:"rgba(255,255,255,.03)",border:"1px solid "+m.c+"22",borderRadius:6,padding:"6px 14px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:F.m,fontSize:7,color:$.dim,letterSpacing:1}}>{m.l}</span>
              <span style={{fontFamily:F.m,fontSize:14,fontWeight:700,color:m.c}}>{m.v}</span>
            </div>
          ); })}
        </div>

        {/* Alert stream */}
        <div ref={alertRef} style={{maxHeight:140,overflowY:"auto",padding:"0 24px",marginBottom:12}}>
          {alerts.length===0 && (
            <div style={{fontFamily:F.m,fontSize:10,color:$.dim,animation:"wblink 2.5s ease-in-out infinite",padding:"8px 0"}}>
              A.G.N.E.S. scanning telemetry...
            </div>
          )}
          {alerts.map(function(a,i){
            var col = a.lvl==="warn"?$.ac : a.lvl==="alert"?$.rd : a.lvl==="critical"?$.rd : a.lvl==="good"?$.gn : a.lvl==="fail"?$.rd : a.lvl==="apply"?$.glow : $.tx3;
            var isCrit = a.lvl==="critical";
            return (
              <div key={i} style={{animation:"wup .2s ease both",marginBottom:6,display:"flex",alignItems:"flex-start",gap:8}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:col,marginTop:6,flexShrink:0,boxShadow:isCrit?"0 0 6px "+col:"none"}}/>
                <div style={{fontFamily:F.m,fontSize:isCrit?12:10,color:col,lineHeight:1.6,fontWeight:isCrit?700:400}}>
                  {isCrit && <span style={{fontSize:7,color:$.dim,letterSpacing:1,marginRight:6}}>W.R.E.N.</span>}
                  {a.msg}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action zone */}
        <div style={{padding:"0 24px 28px"}}>
          {!canAct && !chosen && (
            <div style={{fontFamily:F.m,fontSize:9,color:$.dim,textAlign:"center",padding:"8px 0",animation:"wblink 2s ease-in-out infinite"}}>
              A.G.N.E.S. is analysing...
            </div>
          )}

          {canAct && !chosen && (
            <div style={{animation:"wup .4s ease both"}}>
              <div style={{fontFamily:F.m,fontSize:9,color:dp.urgency,letterSpacing:2,marginBottom:12,textAlign:"center",animation:"wpulse 1.5s ease-in-out infinite"}}>
                YOUR CALL, OPERATOR
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {dp.options.map(function(opt,i){
                  return (
                    <button key={i} onClick={function(){ choose(i); }}
                      style={{background:"rgba(255,255,255,.03)",border:"1px solid "+dp.urgency+"33",borderRadius:12,padding:"18px 16px",textAlign:"left",cursor:"pointer",fontFamily:F.s,transition:"all .2s"}}
                      onMouseEnter={function(e){ e.currentTarget.style.background=dp.urgency+"12"; e.currentTarget.style.borderColor=dp.urgency; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseLeave={function(e){ e.currentTarget.style.background="rgba(255,255,255,.03)"; e.currentTarget.style.borderColor=dp.urgency+"33"; e.currentTarget.style.transform="none"; }}>
                      <div style={{fontSize:22,marginBottom:8}}>{opt.icon}</div>
                      <div style={{fontSize:14,fontWeight:700,color:$.tx,marginBottom:4}}>{opt.label}</div>
                      <div style={{fontSize:10,color:$.tx3,lineHeight:1.6}}>{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {chosen !== null && !resolved && (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontFamily:F.m,fontSize:11,color:$.glow,animation:"wblink 0.8s ease-in-out infinite",letterSpacing:1}}>
                APPLYING {dp.options[chosen].label.toUpperCase()}...
              </div>
            </div>
          )}

          {chosen !== null && resolved && (
            <div style={{animation:"wup .4s ease both"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:oc(chosenOpt.outcome)+"18",border:"2px solid "+oc(chosenOpt.outcome),display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:oc(chosenOpt.outcome),fontWeight:700}}>
                  {chosenOpt.outcome==="good"?"\u2713":"\u2717"}
                </div>
                <span style={{fontSize:14,color:oc(chosenOpt.outcome),fontWeight:700,fontFamily:F.s}}>{chosenOpt.outcome==="good"?"Model stabilised.":"Model compromised."}</span>
              </div>
              <button onClick={advance}
                style={{background:$.glow,color:$.bg,border:"none",borderRadius:10,padding:"14px 0",fontSize:14,fontWeight:700,cursor:"pointer",width:"100%",letterSpacing:0.5}}>
                {idx===scenarios.length-1?"See the debrief":"Next incident \u2192"}
              </button>
            </div>
          )}
        </div>
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
var THREATS = [
  { label: "Power Surge", color: "#f87171", fix: "shield", desc: "Energy spike heading for the network.", node: "GEN", cost: 2 },
  { label: "Signal Drop", color: "#fbbf24", fix: "stabilise", desc: "Grid signal weakening rapidly.", node: "LOAD", cost: 1 },
  { label: "Noise Spike", color: "#a78bfa", fix: "reroute", desc: "Interference corrupting telemetry.", node: "DIST", cost: 1 },
  { label: "Overload", color: "#f87171", fix: "reroute", desc: "Demand exceeding node capacity.", node: "LOAD", cost: 2 },
  { label: "Drift Alert", color: "#fbbf24", fix: "stabilise", desc: "Operating pattern shifting from baseline.", node: "GEN", cost: 1 },
  { label: "Anomaly", color: "#a78bfa", fix: "shield", desc: "Unidentified pattern. Possible adversarial.", node: "DIST", cost: 2 },
  { label: "Voltage Sag", color: "#34d399", fix: "boost", desc: "Voltage dropping below safe threshold.", node: "STORE", cost: 2 },
  { label: "Cascade Risk", color: "#f87171", fix: "isolate", desc: "Failure spreading between nodes.", node: "LOAD", cost: 3 },
];

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
          <button onClick={function() { setPage("operator"); }}
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
            style={{ width: "100%", accentColor: phaseCol, height: 6, cursor: "pointer" }} />
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
  else if (page === "operator") pageContent = <GridOperatorSim onBack={function() { setPage("landing"); }} />;
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
          <button onClick={function() { setPage("operator"); }} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Ops Centre</button>
        </div>
      </nav>

      <HeroSection go={go} setPage={setPage} />

      {/* ═══ FULL DEMO ═══ */}
      <section id="demo" style={{ padding: "80px 24px 80px", background: $.bg2 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Rv><h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, fontFamily: F.s, marginBottom: 16 }}>Five ways a model fails</h2></Rv>
          <Rv d={0.08}><p style={{ fontSize: 14, color: $.tx3, maxWidth: 380, margin: "0 auto" }}>Real data from a 120-batch deployment simulation</p></Rv>
        </div>
        <Rv d={0.16}><div style={{ maxWidth: 900, margin: "0 auto" }}><SignatureDemo /></div></Rv>
      </section>

      {/* ═══ STRESS TEST ═══ */}
      <section style={{ padding: "80px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Rv><h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, fontFamily: F.s, marginBottom: 16 }}>Break it yourself</h2></Rv>
          <Rv d={0.08}><p style={{ fontSize: 14, color: $.tx3, maxWidth: 360, margin: "0 auto" }}>Drag the slider. Watch four models respond differently to the same threat</p></Rv>
        </div>
        <Rv d={0.16}><StressTestWidget /></Rv>
      </section>

      {/* ═══ EXPLORE ═══ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Rv><h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, fontFamily: F.s, textAlign: "center", marginBottom: 48 }}>Go deeper</h2></Rv>
          <Rv d={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div onClick={function() { setPage("operator"); }}
              style={{ background: $.bg2, borderRadius: 14, padding: "32px 28px", cursor: "pointer", transition: "all .25s" }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,.06)"; }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: 1.5, marginBottom: 12 }}>Interactive</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: $.tx, marginBottom: 10 }}>Operations Centre</div>
              <p style={{ fontSize: 13, color: $.tx3, lineHeight: 1.75, marginBottom: 20 }}>The model is failing. A.G.N.E.S. tells you why. You decide what to do</p>
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
          <Rv><h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, fontFamily: F.s, marginBottom: 40 }}>What we found</h2></Rv>

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
