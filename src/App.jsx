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
  adversarial: { label: "Adversarial Attack", batch: 65, desc: "FGSM perturbation applied to sensor readings. Simulates deliberate manipulation of grid telemetry.", plain: "Someone is deliberately feeding fake data to trick the AI. Small, crafted changes that fool the model into making wrong predictions.", status: "AT RISK", color: $.rd, health: 74, action: "Switch to RF fallback model immediately. SVM boundary has been compromised by gradient attack.", feature: "SVM flip rate at 16.5%. Hybrid stacking absorbs to 3.3%.", alert: "Adversarial signature detected in gradient pattern", showDrift: true, showRegime: false },
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
      {icon:"\u21BA",label:"Trigger Recalibration",desc:"Reinitialise the LaSCal pipeline against current data distribution.",outcome:"good",
       consequence:"Calibration error stabilises. Coverage recovers toward 94%. Model remains operationally trustworthy through the drift phase."},
      {icon:"\u25CE",label:"Hold: Continue Monitoring",desc:"No intervention. Continue observing. Do not act yet.",outcome:"bad",
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
      {icon:"\u21C4",label:"Switch to RF Fallback",desc:"Route all predictions through the Random Forest model only.",outcome:"good",
       consequence:"Tree models have zero gradient in leaf regions. FGSM immune. Flip rate drops to 0.04%. Grid confidence fully restored."},
      {icon:"\u21BA",label:"Trigger Recalibration",desc:"Recalibrate the Hybrid model against recent data.",outcome:"bad",
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
      {icon:"\u26A0",label:"Alert Operator: Reduce Load",desc:"Escalate to human oversight. Shed load at nodes 2 and 3.",outcome:"good",
       consequence:"Human oversight takes control during model uncertainty. Load reduction creates stability margin. Grid holds, no cascade."},
      {icon:"\u25CE",label:"Continue Monitoring",desc:"No action. Observe further before committing.",outcome:"bad",
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
      {icon:"\u26A0",label:"Quarantine Suspect Sensors",desc:"Isolate corrupted inputs. Fall back to validated channels only.",outcome:"good",
       consequence:"Corrupted readings removed from pipeline. Model operates on reduced but clean data. Accuracy holds at 93.8% on verified channels."},
      {icon:"\u21BA",label:"Trigger Full Recalibration",desc:"Recalibrate against all current data including suspect readings.",outcome:"bad",
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
      {icon:"\u23FC",label:"Shed Non-Critical Load",desc:"Reduce demand on LOAD node to within training bounds.",outcome:"good",
       consequence:"Demand returns to known operating range. Model predictions stabilise. Coverage recovers to 94%. No cascading impact."},
      {icon:"\u21C4",label:"Switch to Emergency Model",desc:"Deploy simplified fallback model designed for extreme conditions.",outcome:"bad",
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
      {icon:"\u25CE",label:"Raise Alert Threshold",desc:"Temporarily increase detection sensitivity to filter noise.",outcome:"good",
       consequence:"Alert volume drops 90%. The three real anomalies remain visible. Operators can focus on genuine threats. Grid monitored effectively."},
      {icon:"\u26A0",label:"Escalate All Alerts",desc:"Treat every alert as genuine. Escalate everything to human review.",outcome:"bad",
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
    if (document.getElementById("wrn")) return;
    var l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
    var s = document.createElement("style"); s.id = "wrn";
    s.textContent = "@keyframes wup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes wpulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes wblink{0%,100%{opacity:.5}50%{opacity:1}}@keyframes wsweep{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes wshake{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-3px)}30%,60%,90%{transform:translateX(3px)}}@keyframes lhSweep{0%,100%{transform:rotate(-35deg)}50%{transform:rotate(35deg)}}@keyframes bIdlePulse{0%,100%{opacity:.55}50%{opacity:.95}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(251,191,36,.1);border-radius:2px}";
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
              Your model is deployed.<br/>It is about to start failing.
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

  /* ── 18 REAL PIPELINE STAGES from nexus_engine_v4.py ── */
  var PIPELINE = [
    {phase:"Data", color:$.gn, stages:[
      {n:1, name:"Data Loading",                   done:true, desc:"60,000 samples loaded from DSGC dataset. 12 raw electrical parameters. Class balance checked 37% unstable. NaN values detected and median imputed."},
      {n:2, name:"Physics Feature Engineering",    done:true, desc:"48 physics informed candidates generated. Key v4 features: F_gain_i = τ·g per node, H_net, V_weak, F_gain_mean/std/min. Raw 12 features expanded to 48."},
      {n:3, name:"Data Splitting",                 done:true, desc:"Stratified train / validation / test split. Class balance preserved across all three partitions. Reproducible seeding applied."},
    ]},
    {phase:"Feature Selection & Optimisation", color:"#a78bfa", stages:[
      {n:4, name:"RFECV Feature Selection",        done:true, desc:"Recursive Feature Elimination with Cross-Validation. Reduced 48 candidates down to 14 optimal features. Eliminates noise and collinear terms. Top retained: F_gain_mean, tau_std, g_mean."},
      {n:5, name:"Bayesian Hyperparameter Search", done:true, desc:"Optuna TPE sampler. 100 trials per model, run in parallel. Tuned SVM (C, gamma), Random Forest (n_estimators, max_depth), LightGBM (n_estimators, learning_rate). Total search time: ~180s."},
    ]},
    {phase:"Model Training", color:$.glow, stages:[
      {n:6, name:"Four Base Learners",             done:true, desc:"SVM (RBF kernel), Random Forest (300 estimators), LightGBM (gradient boosting), Logistic Regression. All trained on the 14 selected features with optimised hyperparameters."},
      {n:7, name:"Probability Calibration",        done:true, desc:"Platt scaling (sigmoid) and Isotonic regression applied post hoc. Aligns confidence scores with empirical accuracy. Reduces ECE on validation set."},
      {n:8, name:"Stacking Hybrid Ensemble",       done:true, desc:"SVM + RF base predictions fed into a LogisticRegression meta learner. Also uses top physics features (F_gain_mean, tau_mean) as meta inputs. Final model outperforms all individual bases."},
    ]},
    {phase:"Evaluation", color:$.ac, stages:[
      {n:9,  name:"Test Set Evaluation",           done:true, desc:"Full metrics: AUC, F1, Accuracy, Brier score, ECE. Hybrid AUC: 0.9999. SVM: 0.9899. RF: 0.9899. LGBM comparable. Clean data performance established as deployment baseline."},
      {n:10, name:"Cost Optimal Threshold",        done:true, desc:"v4: Cost function penalises false negatives 10× more than false positives (grid failure cost >> false alarm cost). Three level risk index: STABLE / BORDERLINE / CRITICAL. Thresholds saved to JSON."},
      {n:11, name:"Conformal Prediction",          done:true, desc:"Split conformal prediction, α=0.05. Mathematical guarantee: at least 95% of prediction intervals contain the true class on exchangeable data. q_hat quantile computed from validation set."},
      {n:12, name:"Paired Bootstrap AUC Test",     done:true, desc:"2,000 bootstrap resamples comparing Hybrid vs LightGBM AUC. Delta AUC and 95% confidence interval computed. p value confirms statistical significance of Hybrid improvement."},
      {n:13, name:"Learning Curve Analysis",       done:true, desc:"AUC vs training set size computed for all models. Shows model is not not data limited performance plateaus before 100% of training data, confirming generalisation."},
      {n:14, name:"Cross Validation (5 fold)",     done:true, desc:"Stratified 5 fold CV on full train and val set. Hybrid requires nested manual CV (calibration inside each fold). Hybrid CV AUC confirms no overfitting to test set."},
      {n:15, name:"Permutation Importance",        done:true, desc:"Each feature permuted 5 times. AUC drop measured. F_gain_mean is the dominant feature across all drift phases. The physics formula holds even when statistical guarantees break down."},
    ]},
    {phase:"Robustness & Deployment", color:$.rd, stages:[
      {n:16, name:"SHAP Explainability",           done:true, desc:"TreeSHAP for RF and LightGBM. KernelSHAP approximation for SVM. Global and local attributions saved. F_gain consistently top ranked model is explainable and physics aligned."},
      {n:17, name:"Stress Testing",                done:true, desc:"Gaussian noise (4 levels), OOD scaling, boundary sensitivity, Monte Carlo (N=50, 3 noise levels). Hybrid degrades most gracefully under all stress conditions tested."},
      {n:18, name:"FGSM Adversarial Robustness",   done:true, desc:"Fast Gradient Sign Method at 6 epsilon levels (0.01 to 0.30). SVM (RBF) flip rate: 19.8% at eps=0.1. RF flip rate: 0.04% tree models are immune to gradient attacks due to discrete leaf structure."},
    ]},
    {phase:"Simulation & Export", color:"#67e8f9", stages:[
      {n:"18b", name:"Streaming Deployment Simulation", done:true, desc:"3 layer, 120 sequential batches. Gradual tau drift from batch 40. FGSM adversarial attack at batch 65. Abrupt regime shift at batch 80. SCADA noise, missing data, quantisation and latency all simulated."},
      {n:"19", name:"Sequential Change Detection",      done:true, desc:"PSI drift index per batch (threshold 0.25). CUSUM sequential test for cumulative drift. Page Hinkley test for abrupt shifts. PSI fires 26 batches before AUC visibly drops."},
      {n:"20", name:"Generalisation Suite",             done:true, desc:"Synthetic DSGC operating points generated with varied τ and g ranges. Cross regime evaluation confirms model holds outside training distribution boundaries."},
      {n:"21", name:"Auto Stabiliser (Adam controller)", done:true, desc:"Gradient based controller adjusts τ and g to push P(unstable) below target threshold. Adam optimiser (lr=0.3, β1=0.9, β2=0.999). Corrective grid control in ≤500 iterations."},
      {n:"22", name:"Browser Export",                   done:true, desc:"JSON model bundle generated for deployment. Contains SVM/RF/LGBM weights, scaler parameters, feature names, thresholds, calibration data, and run metadata. This webapp reads that bundle."},
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
    {metric:"AUC fell from 0.9999 to 0.8834",   color:$.rd,  icon:"→",
     consequence:"The model was near perfect in the lab. Under real deployment drift, 1 in 9 predictions deteriorated. A model that looks production ready on a static benchmark can still fail silently once deployed. This is the gap W.R.E.N. exists to close."},
    {metric:"ECE increased 214×",                color:$.rd,  icon:"→",
     consequence:"Calibration error is how wrong the model's confidence is. 214× baseline means when it said '90% stable', it was right far less often. Decisions made on uncalibrated confidence are decisions made on false certainty. LaSCal recalibration brought this back under control."},
    {metric:"PSI crossed 0.25 at batch 55",      color:$.glow,icon:"→",
     consequence:"26 batches before accuracy dropped, the data started looking different. PSI caught it first. That 26-batch head start is the difference between a controlled recalibration and an emergency shutdown. Early warning is the economic value of deployment monitoring."},
    {metric:"RF adversarial flip rate: 0.04%",   color:$.gn,  icon:"→",
     consequence:"Under FGSM attack (deliberate sensor manipulation), the SVM was flipped 19.8% of the time. The Random Forest: 0.04%. Tree models don't use gradients there's no slope to attack. When adversarial conditions are possible, the fallback model is the RF, not the SVM."},
    {metric:"Conformal coverage dropped to 83%", color:$.ac,  icon:"→",
     consequence:"1 in 6 predictions during regime collapse had no valid uncertainty bound. The conformal guarantee expired. This isn't a model failure it's the model honestly admitting it is out of its depth. A model that tells you when to stop trusting it is more valuable than one that doesn't."},
    {metric:"F_gain_mean dominated all phases",  color:$.glow,icon:"→",
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
  if (tab==="pipe") return (
    <div style={{minHeight:"100vh",background:$.bg,fontFamily:F.s,color:$.tx2}}>
      {nav}
      <div style={{maxWidth:880,margin:"0 auto",padding:"28px 20px 56px"}}>
        <div style={{marginBottom:28}}>
          <p style={{fontFamily:F.m,fontSize:10,color:$.glow,letterSpacing:4,marginBottom:8}}>A.G.N.E.S. PIPELINE v4.2</p>
          <h2 style={{fontSize:"clamp(18px,3vw,26px)",fontWeight:600,fontFamily:serif,color:$.tx,marginBottom:8}}>22 automated stages. End to end. One pipeline.</h2>
          <p style={{fontSize:12,color:$.tx3,lineHeight:1.75}}>From raw DSGC dataset to deployed browser model. Output of each stage feeds directly into the next.</p>
        </div>

        {PIPELINE.map(function(ph){
          return (
            <div key={ph.phase} style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:ph.color,flexShrink:0}}/>
                <span style={{fontFamily:F.m,fontSize:9,color:ph.color,letterSpacing:".06em",fontWeight:600}}>{ph.phase.toUpperCase()}</span>
                <div style={{flex:1,height:1,background:ph.color,opacity:.12}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {ph.stages.map(function(s){
                  return (
                    <div key={s.n} style={{background:$.bg2,border:"1px solid "+$.brd,borderRadius:9,padding:"13px 16px",display:"flex",gap:14,alignItems:"flex-start"}}>
                      <div style={{width:30,height:30,borderRadius:7,background:ph.color+"12",border:"1px solid "+ph.color+"28",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:F.m,fontSize:10,fontWeight:700,color:ph.color}}>
                        {s.n}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                          <div style={{fontSize:13,fontWeight:600,color:$.tx}}>{s.name}</div>
                          <span style={{fontFamily:F.m,fontSize:8,color:ph.color,background:ph.color+"10",padding:"2px 8px",borderRadius:999,marginLeft:10,flexShrink:0}}>Complete</span>
                        </div>
                        <div style={{fontSize:11,color:$.tx3,lineHeight:1.7}}>{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{background:$.acD,border:"1px solid "+$.glow+"22",borderRadius:10,padding:"16px 20px",textAlign:"center"}}>
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
      <div style={{maxWidth:780,margin:"0 auto",padding:"28px 20px 56px"}}>
        <div style={{marginBottom:28}}>
          <p style={{fontFamily:F.m,fontSize:10,color:$.glow,letterSpacing:4,marginBottom:8}}>WHAT WE FOUND</p>
          <h2 style={{fontSize:"clamp(18px,3vw,26px)",fontWeight:600,fontFamily:serif,color:$.tx,marginBottom:8}}>Six numbers. Six things that actually matter.</h2>
          <p style={{fontSize:12,color:$.tx3,lineHeight:1.75}}>Not every metric. Just what the results mean in practice.</p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {FINDINGS.map(function(f,i){
            return (
              <div key={i} style={{background:$.bg2,border:"1px solid "+f.color+"28",borderRadius:12,padding:"20px 22px",display:"flex",gap:20,alignItems:"flex-start"}}>
                <div style={{width:44,height:44,borderRadius:10,background:f.color+"12",border:"1px solid "+f.color+"33",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontFamily:F.m,fontSize:20,fontWeight:700,color:f.color}}>
                    {i+1}
                  </span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:F.m,fontSize:12,fontWeight:700,color:f.color,marginBottom:6,lineHeight:1.4}}>{f.metric}</div>
                  <div style={{fontSize:13,color:$.tx3,lineHeight:1.8}}>{f.consequence}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{marginTop:28,background:"rgba(248,113,113,.04)",border:"1px solid rgba(248,113,113,.16)",borderRadius:12,padding:"20px 22px"}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.rd,letterSpacing:".06em",marginBottom:10}}>THE BOTTOM LINE</div>
          <p style={{fontSize:14,color:$.tx,lineHeight:1.85,fontFamily:serif}}>A model that scores <strong style={{color:$.glow}}>0.9999 AUC</strong> in the lab can still fail silently in the field. The only difference between knowing and not knowing is whether you built the monitoring to detect it.</p>
          <p style={{fontSize:12,color:$.tx3,lineHeight:1.8,marginTop:8}}>W.R.E.N. is that monitoring system. A.G.N.E.S. is the engine underneath it. Together, they answer the question every deployed ML system should be able to answer: <em>can I still be trusted right now?</em></p>
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
  var _prox = useState(0); var prox = _prox[0]; var setProx = _prox[1];
  var secRef = useRef(null);

  useEffect(function() {
    function track(cx, cy) {
      if (!secRef.current) return;
      var rect = secRef.current.getBoundingClientRect();
      var lampX = rect.left + rect.width * 0.5;
      var lampY = rect.top + rect.height * 0.3;
      setProx(Math.max(0, Math.min(1, 1 - Math.sqrt(Math.pow(cx - lampX, 2) + Math.pow(cy - lampY, 2)) / 350)));
    }
    function onM(e) { track(e.clientX, e.clientY); }
    function onT(e) { if (e.touches[0]) track(e.touches[0].clientX, e.touches[0].clientY); }
    window.addEventListener("mousemove", onM);
    window.addEventListener("touchmove", onT, { passive: true });
    return function() { window.removeEventListener("mousemove", onM); window.removeEventListener("touchmove", onT); };
  }, []);

  var lampOp = 0.6 + prox * 0.4;
  var glowR = 20 + prox * 24;
  var glowOp = 0.12 + prox * 0.3;
  var beamA = 0.03 + prox * 0.07;

  return (
    <section id="hero" ref={secRef} style={{ position: "relative", background: "#060b14", overflow: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>

      {/* ── FULL LIGHTHOUSE SCENE ── */}
      <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} aria-hidden="true">
        <defs>
          <style>{`@keyframes lhSweepH{0%,100%{transform:rotate(-38deg)}50%{transform:rotate(38deg)}}@keyframes lhTw0{0%,100%{opacity:.9}60%{opacity:.2}}@keyframes lhTw1{0%,100%{opacity:.5}40%{opacity:1}}@keyframes lhTw2{0%,100%{opacity:.7}70%{opacity:.15}}`}</style>
          <clipPath id="lhClip"><rect x="0" y="0" width="1400" height="700"/></clipPath>
        </defs>
        <rect x="0" y="0" width="1400" height="900" fill="#060b14"/>

        {/* Stars */}
        <g style={{animation:"lhTw0 3.2s ease-in-out infinite"}}>
          <circle cx="150" cy="80" r="1.4" fill="#e8d5a3" opacity=".5"/><circle cx="1250" cy="90" r="1.6" fill="#e8d5a3" opacity=".45"/>
          <circle cx="400" cy="50" r="1.8" fill="#e8d5a3" opacity=".6"/><circle cx="1100" cy="60" r="1.3" fill="#fff" opacity=".4"/>
          <circle cx="800" cy="40" r="2" fill="#e8d5a3" opacity=".5"/><circle cx="250" cy="140" r="1.2" fill="#fff" opacity=".35"/>
        </g>
        <g style={{animation:"lhTw1 4.1s ease-in-out infinite"}}>
          <circle cx="550" cy="65" r="1.5" fill="#e8d5a3" opacity=".45"/><circle cx="950" cy="80" r="1.4" fill="#fff" opacity=".4"/>
          <circle cx="1300" cy="120" r="1.7" fill="#e8d5a3" opacity=".4"/><circle cx="100" cy="110" r="1.3" fill="#fff" opacity=".35"/>
        </g>
        <g style={{animation:"lhTw2 5.3s ease-in-out infinite"}}>
          <circle cx="680" cy="55" r="1.6" fill="#e8d5a3" opacity=".4"/><circle cx="350" cy="100" r="1.2" fill="#fff" opacity=".35"/>
        </g>

        {/* Moon */}
        <circle cx="320" cy="160" r="40" fill="#0d1826"/><circle cx="314" cy="152" r="28" fill="#060b14"/>

        {/* Beam */}
        <g clipPath="url(#lhClip)">
          <g style={{transformOrigin:"700px 440px",animation:"lhSweepH 6s ease-in-out infinite"}}>
            <polygon points="700,440 380,-100 1020,-100" fill="#fbbf24" opacity={beamA * 1.3}/>
            <polygon points="700,440 520,-100 880,-100" fill="#fbbf24" opacity={beamA * 0.7}/>
          </g>
        </g>

        {/* Spinnaker Tower left */}
        <polygon points="475,680 483,680 481,380 478,320 475,380" fill="#0d1a2c" opacity=".85"/>
        <path d="M473,670 L450,666 Q424,652 408,622 Q392,588 396,546 Q400,508 416,480 Q434,452 458,440 Q470,435 473,410 Q458,410 440,422 Q418,438 404,470 Q388,508 392,550 Q396,592 414,626 Q432,656 468,668Z" fill="#0c1828" opacity=".8"/>

        {/* Guildhall right */}
        <rect x="890" y="618" width="168" height="65" fill="#0d1825" opacity=".75" rx="2"/>
        <polygon points="890,618 1058,618 974,585" fill="#0f1d2e" opacity=".75"/>
        <rect x="958" y="560" width="32" height="62" fill="#0d1927" opacity=".8" rx="2"/>
        <path d="M958,560 Q974,538 990,560" fill="#0f1d2e" opacity=".8"/>

        {/* ── LIGHTHOUSE ── */}
        <polygon points="666,680 734,680 718,440 682,440" fill="#1a2640"/>
        <polygon points="668,530 732,530 729,496 671,496" fill="#111c2c" opacity=".75"/>
        <polygon points="669,600 731,600 728,568 672,568" fill="#111c2c" opacity=".7"/>
        <line x1="666" y1="680" x2="682" y2="440" stroke="#253348" strokeWidth="1" opacity=".8"/>
        <line x1="734" y1="680" x2="718" y2="440" stroke="#253348" strokeWidth="1" opacity=".8"/>

        {/* Lamp housing */}
        <rect x="660" y="434" width="80" height="6" rx="1" fill="#1e2f45"/>
        <rect x="676" y="396" width="48" height="40" rx="2" fill="#1e2f45" stroke="#2a3a52" strokeWidth="1"/>
        <rect x="676" y="396" width="48" height="40" rx="2" fill="#fbbf24" opacity={0.05 + prox * 0.1}/>
        <line x1="688" y1="396" x2="688" y2="436" stroke="#fbbf24" strokeWidth=".4" opacity=".25"/>
        <line x1="700" y1="396" x2="700" y2="436" stroke="#fbbf24" strokeWidth=".5" opacity=".35"/>
        <line x1="712" y1="396" x2="712" y2="436" stroke="#fbbf24" strokeWidth=".4" opacity=".25"/>
        <path d="M676,396 Q677,372 700,361 Q723,372 724,396Z" fill="#1a2640" stroke="#253348" strokeWidth="1"/>
        <line x1="700" y1="361" x2="700" y2="344" stroke="#c4a35a" strokeWidth="1.5"/>
        <circle cx="700" cy="342" r="3.5" fill="#fbbf24" opacity=".85"/>

        {/* Windows */}
        <rect x="693" y="508" width="14" height="18" rx="7" fill="#fbbf24" opacity=".22"/>
        <rect x="693" y="578" width="14" height="18" rx="7" fill="#fbbf24" opacity=".16"/>

        {/* Lamp glow */}
        <circle cx="700" cy="416" r={glowR} fill="#fbbf24" opacity={glowOp}/>
        <circle cx="700" cy="416" r="12" fill="#fbbf24" opacity={0.28 + prox * 0.35}/>
        <circle cx="700" cy="416" r="5" fill="#fbbf24" opacity={lampOp}/>
        <circle cx="700" cy="416" r="2.5" fill="#fffde0" opacity=".9"/>

        {/* Ground */}
        <rect x="0" y="680" width="1400" height="220" fill="#08111e"/>
        <line x1="0" y1="681" x2="1400" y2="681" stroke="#152030" strokeWidth="1.5" opacity=".6"/>
        <rect x="0" y="740" width="1400" height="160" fill="#050d17"/>
      </svg>

      {/* ── HEADLINE + BUTTONS ── */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>

        <p style={{ fontFamily: F.m, fontSize: 10, color: $.glow, letterSpacing: 5, marginBottom: 24, opacity: 0, animation: "wup 0.8s ease 0.3s forwards" }}>W.R.E.N.</p>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: $.tx, fontFamily: F.s, marginBottom: 20, opacity: 0, animation: "wup 0.8s ease 0.5s forwards", textShadow: "0 4px 30px #060b14" }}>
          Know when your model<br/>stops being trustworthy.
        </h1>

        <p style={{ fontSize: 16, color: $.tx3, lineHeight: 1.6, maxWidth: 440, margin: "0 auto 32px", opacity: 0, animation: "wup 0.8s ease 0.7s forwards", textShadow: "0 2px 20px #060b14" }}>
          Real-time monitoring for deployed AI under drift, noise, and attack.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", opacity: 0, animation: "wup 0.8s ease 0.9s forwards" }}>
          <button onClick={function() { setPage("operator"); }}
            style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 8, padding: "13px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F.s }}>
            Enter Ops Centre
          </button>
          <button onClick={function() { go("demo"); }}
            style={{ background: "rgba(8,17,30,.65)", color: $.tx3, border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "13px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: F.s, backdropFilter: "blur(8px)" }}>
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
  var _level = useState(0); var level = _level[0]; var setLevel = _level[1];
  var _dragging = useState(false); var dragging = _dragging[0]; var setDragging = _dragging[1];

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

  // Generate sparkline data
  var sparkData = [];
  for (var i = 0; i <= 40; i++) {
    var st = (i / 40) * t;
    var noise = Math.sin(i * 3.7) * 0.008 + Math.cos(i * 7.1) * 0.005;
    var val = mode === "drift" ? 0.9999 - st * st * 0.165 + noise
      : mode === "noise" ? 0.9999 - st * 0.08 - st * st * 0.04 + noise * 2
      : 0.9999 - st * st * st * 0.22 + noise;
    sparkData.push(Math.max(0.75, Math.min(1, val)));
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Mode selector */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
        {[{id:"drift",label:"Drift"},{id:"noise",label:"Noise"},{id:"attack",label:"Attack"}].map(function(md) {
          var active = mode === md.id;
          return (
            <button key={md.id} onClick={function(){ setMode(md.id); setLevel(0); }}
              style={{ padding: "8px 22px", borderRadius: 8, fontFamily: F.m, fontSize: 11, fontWeight: active ? 700 : 400, cursor: "pointer",
                color: active ? $.bg : $.tx3, background: active ? $.glow : "rgba(255,255,255,.03)", border: "1px solid " + (active ? $.glow : $.brd),
                transition: "all .2s", letterSpacing: 0.5 }}>
              {md.label}
            </button>
          );
        })}
      </div>

      {/* Main panel */}
      <div style={{ background: $.bg2, borderRadius: 14, padding: "28px 28px 24px", position: "relative", overflow: "hidden", transition: "all .5s" }}>

        {/* Edge glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
          boxShadow: phase === "critical" ? "inset 0 0 60px " + $.rd + "12" : phase === "degrading" ? "inset 0 0 40px " + $.ac + "08" : "none",
          transition: "box-shadow .8s" }} />

        {/* Status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Beacon s={28} glow={phase === "stable" ? 0.6 : phase === "degrading" ? 0.25 : 0.03} />
            <span style={{ fontFamily: F.m, fontSize: 10, color: phaseCol, letterSpacing: 1, fontWeight: 600 }}>
              {phase === "stable" ? "STABLE" : phase === "degrading" ? "DEGRADING" : "CRITICAL"}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F.m, fontSize: 8, color: $.dim, letterSpacing: 1 }}>{m.label}</div>
            <div style={{ fontSize: 10, color: $.tx3, marginTop: 2 }}>{m.desc}</div>
          </div>
        </div>

        {/* Sparkline */}
        <div style={{ height: 80, marginBottom: 20, position: "relative" }}>
          <svg viewBox="0 0 400 80" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={phaseCol} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={phaseCol} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path d={
              "M0," + ((1 - sparkData[0]) * 70 + 5) + " " +
              sparkData.map(function(v, i) { return (i / 40 * 400) + "," + ((1 - v) * 70 + 5); }).join(" L") +
              " L400,80 L0,80 Z"
            } fill="url(#stressGrad)" />
            {/* Line */}
            <polyline points={sparkData.map(function(v, i) { return (i / 40 * 400) + "," + ((1 - v) * 70 + 5); }).join(" ")}
              fill="none" stroke={phaseCol} strokeWidth="2" />
            {/* End dot */}
            <circle cx="400" cy={(1 - sparkData[sparkData.length - 1]) * 70 + 5} r="4" fill={phaseCol} opacity="0.9" />
          </svg>
          <div style={{ position: "absolute", top: 0, left: 0, fontFamily: F.m, fontSize: 7, color: $.dim }}>AUC</div>
          <div style={{ position: "absolute", bottom: 0, right: 0, fontFamily: F.m, fontSize: 7, color: $.dim }}>
            STRESS {Math.round(level)}%
          </div>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: 22 }}>
          <input type="range" min={0} max={100} value={level}
            onChange={function(e) { setLevel(+e.target.value); }}
            onMouseDown={function() { setDragging(true); }}
            onMouseUp={function() { setDragging(false); }}
            onTouchStart={function() { setDragging(true); }}
            onTouchEnd={function() { setDragging(false); }}
            style={{ width: "100%", accentColor: phaseCol, height: 6, cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontFamily: F.m, fontSize: 8, color: $.gn }}>Clean deployment</span>
            <span style={{ fontFamily: F.m, fontSize: 8, color: $.rd }}>Total failure</span>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { l: "MODEL AUC", v: m.auc, c: m.aucC, sub: "Prediction accuracy" },
            { l: "PSI DRIFT", v: m.psi, c: m.psiC, sub: "Distribution shift" },
            { l: "COVERAGE", v: m.cov + "%", c: m.covC, sub: "Confidence guarantee" },
          ].map(function(met) {
            return (
              <div key={met.l} style={{ background: "rgba(255,255,255,.025)", borderRadius: 10, padding: "14px", textAlign: "center" }}>
                <div style={{ fontFamily: F.m, fontSize: 7, color: $.dim, letterSpacing: 1, marginBottom: 4 }}>{met.l}</div>
                <div style={{ fontFamily: F.m, fontSize: 22, fontWeight: 700, color: met.c, transition: "color .3s" }}>{met.v}</div>
                <div style={{ fontFamily: F.m, fontSize: 8, color: $.dim, marginTop: 2 }}>{met.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Insight text */}
        {t > 0.3 && (
          <div style={{ marginTop: 16, padding: "12px 16px", background: phaseCol + "06", borderRadius: 8, animation: "wup .3s ease both" }}>
            <div style={{ fontFamily: F.m, fontSize: 8, color: phaseCol, letterSpacing: 1, marginBottom: 4 }}>A.G.N.E.S. ASSESSMENT</div>
            <div style={{ fontSize: 11, color: $.tx2, lineHeight: 1.6 }}>
              {phase === "degrading"
                ? "Model predictions are losing reliability. Conformal coverage dropping below guaranteed threshold. Recommend increased monitoring frequency."
                : "Model integrity compromised. Predictions no longer trustworthy. Recommend immediate recalibration or fallback to alternative model."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ APP ═══ */
export default function App() {
  useStyles();
  var _p = useState("landing"); var page = _p[0]; var setPage = _p[1];
  var _s = useState(0); var scrollY = _s[0]; var setScrollY = _s[1];
  useEffect(function() { var h = function() { setScrollY(window.scrollY); }; window.addEventListener("scroll", h, { passive: true }); return function() { window.removeEventListener("scroll", h); }; }, []);

  if (page === "command") return <CommandCentre onBack={function() { setPage("landing"); window.scrollTo(0, 0); }} />;
  if (page === "operator") return <GridOperatorSim onBack={function() { setPage("landing"); window.scrollTo(0, 0); }} />;

  var go = function(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div style={{ background: $.bg, color: $.tx, fontFamily: F.s, overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrollY > 60 ? "rgba(10,14,26,.92)" : "transparent", backdropFilter: scrollY > 60 ? "blur(20px)" : "none", borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,.04)" : "1px solid transparent", transition: "all .5s ease" }}>
        <div onClick={function() { go("hero"); }} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <span style={{ fontSize: 13, letterSpacing: 3, color: $.glow, fontWeight: 700, fontFamily: F.m }}>W.R.E.N.</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span onClick={function() { setPage("command"); }} style={{ fontSize: 11, color: $.dim, cursor: "pointer", letterSpacing: 0.5, transition: "color .3s, opacity .3s", opacity: 0.7 }} onMouseEnter={function(e) { e.target.style.color = $.tx; e.target.style.opacity = "1"; }} onMouseLeave={function(e) { e.target.style.color = $.dim; e.target.style.opacity = "0.7"; }}>Dashboard</span>
          <button onClick={function() { setPage("operator"); }} style={{ background: $.glow, color: $.bg, border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Ops Centre</button>
        </div>
      </nav>

      <HeroSection go={go} setPage={setPage} />

      {/* ═══ VALUE STRIP ═══ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, maxWidth: 820, margin: "0 auto" }}>
          {[
            { title: "Detect drift early", desc: "Three detectors at different timescales. Catches problems 26 batches before accuracy drops." },
            { title: "Quantify trust", desc: "Conformal prediction with mathematical guarantees. Know when predictions stop being reliable." },
            { title: "Recommend action", desc: "Every alert comes with a next step. Recalibrate, switch models, or escalate." },
          ].map(function(c, i) { return (<Rv key={i} d={0.08 * i}><div style={{ padding: "8px 0" }}><div style={{ fontSize: 16, fontWeight: 700, color: $.tx, marginBottom: 12 }}>{c.title}</div><div style={{ fontSize: 13, color: $.tx3, lineHeight: 1.8 }}>{c.desc}</div></div></Rv>); })}
        </div>
      </section>

      {/* ═══ FULL DEMO ═══ */}
      <section id="demo" style={{ padding: "80px 24px 80px", background: $.bg2 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Rv><h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, fontFamily: F.s, marginBottom: 16 }}>Watch the system respond.</h2></Rv>
          <Rv d={0.08}><p style={{ fontSize: 14, color: $.tx3, maxWidth: 380, margin: "0 auto" }}>Five conditions. Real metrics. Real degradation.</p></Rv>
        </div>
        <Rv d={0.16}><div style={{ maxWidth: 900, margin: "0 auto" }}><SignatureDemo /></div></Rv>
      </section>

      {/* ═══ STRESS TEST ═══ */}
      <section style={{ padding: "80px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Rv><h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, fontFamily: F.s, marginBottom: 16 }}>Test model resilience.</h2></Rv>
          <Rv d={0.08}><p style={{ fontSize: 14, color: $.tx3, maxWidth: 360, margin: "0 auto" }}>Drag the slider. See what breaks.</p></Rv>
        </div>
        <Rv d={0.16}><StressTestWidget /></Rv>
      </section>

      {/* ═══ EXPLORE ═══ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Rv><h2 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, fontFamily: F.s, textAlign: "center", marginBottom: 48 }}>Explore deeper.</h2></Rv>
          <Rv d={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div onClick={function() { setPage("operator"); }}
              style={{ background: $.bg2, borderRadius: 14, padding: "32px 28px", cursor: "pointer", transition: "all .25s" }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(251,191,36,.06)"; }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontFamily: F.m, fontSize: 9, color: $.dim, letterSpacing: 1.5, marginBottom: 12 }}>Interactive</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: $.tx, marginBottom: 10 }}>Operations Centre</div>
              <p style={{ fontSize: 13, color: $.tx3, lineHeight: 1.75, marginBottom: 20 }}>Three incidents. Real diagnostics. Your call.</p>
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
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Rv><h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, fontFamily: F.s, marginBottom: 14 }}>Measured. Not claimed.</h2></Rv>
          <Rv d={0.08}><p style={{ fontSize: 14, color: $.dim }}>60,000 samples. Four models. 120 deployment batches.</p></Rv>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 740, margin: "0 auto" }}>
          {[
            { label: "Lab Accuracy", value: "0.9999+", sub: "Near-perfect on clean data" },
            { label: "Deployed Accuracy", value: "0.8834", sub: "After the world changed" },
            { label: "Early Warning", value: "214\u00d7", sub: "Confidence failed before accuracy" },
            { label: "First Signal", value: "Batch 9", sub: "Spotted trouble this early" },
          ].map(function(m, i) { return (<Rv key={i} d={0.06 * i}><div style={{ background: $.bg, borderRadius: 12, padding: "28px 16px", textAlign: "center" }}><div style={{ fontSize: 32, fontWeight: 700, color: $.glow, fontFamily: F.m, marginBottom: 10, lineHeight: 1 }}>{m.value}</div><div style={{ fontSize: 11, fontWeight: 600, color: $.tx, marginBottom: 6 }}>{m.label}</div><div style={{ fontSize: 10, color: $.dim, lineHeight: 1.4, maxWidth: 120, margin: "0 auto" }}>{m.sub}</div></div></Rv>); })}
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
      <footer style={{ padding: "20px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: $.dim, fontFamily: F.m }}>W.R.E.N.</div>
        <div style={{ fontSize: 9, color: $.dim }}>University of Portsmouth | 2025–2026</div>
        <div style={{ fontSize: 9, color: $.dim, opacity: 0.6 }}>Powered by A.G.N.E.S. v4.2</div>
      </footer>
    </div>
  );
}
