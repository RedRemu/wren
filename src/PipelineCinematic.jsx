/* ═══════════════════════════════════════════════════════════════════
   W.R.E.N.  ·  CINEMATIC PIPELINE TAB  (self-contained)
   ---------------------------------------------------------------------
   Runs standalone with zero props. Can also receive
   PIPELINE / pipeOpen / setPipeOpen / PipeVis to integrate with Wren.
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useMemo } from "react";

/* ═══ PALETTE & FONTS (match Wren) ═══ */
var $ = {
  bg: "#0a0e1a", bg2: "#0f1525", bg3: "#141c2e",
  brd: "rgba(251,191,36,.08)", brdH: "rgba(251,191,36,.18)",
  tx: "#fef3c7", tx2: "#e0b88a", tx3: "#b08d5e", dim: "#8a7350",
  glow: "#fbbf24", glowD: "rgba(251,191,36,.06)",
  ac: "#f59e0b", gn: "#34d399", rd: "#f87171",
  cy: "#67e8f9", vi: "#a78bfa",
};
var F = { s: "'Manrope',system-ui,sans-serif", m: "'IBM Plex Mono',monospace" };
var serif = "'Iowan Old Style','Palatino Linotype',Georgia,serif";

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
    {n:11, name:"Add a safety promise", plain:"Guarantee the AI will be right at least 95 times out of every 100", desc:"We added a mathematical safety net that promises the AI will be right at least 95 times out of every 100. When it is not sure, it says so instead of guessing. When we tested it, it was right 95.3% of the time.", input:"Practice scores", output:"95% promise kept"},
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
  {f:"F_gain_mean", v:9.64, phys:true},
  {f:"tau_std",     v:4.21, phys:true},
  {f:"g_mean",      v:3.87, phys:true},
  {f:"V_weak",      v:2.94, phys:true},
  {f:"F_gain_std",  v:2.41, phys:true},
  {f:"H_net",       v:1.88, phys:true},
  {f:"tau_mean",    v:1.52, phys:false},
];
var CM_TARGET = [[4338, 6], [0, 7656]];
var PSI_STREAM = [.10,.09,.11,.08,.12,.09,.10,.11,.10,.08,.11,.10,.12,.08,.13,.15,.18,.22,.26,.35,.42,.48,.59,.66,.88,1.16,1.22,1.40,1.57,1.76,1.80,1.90,2.11,1.82,2.00,1.79,1.88,2.34,2.32,2.36];
var AUC_STREAM = [.96,.94,.95,.93,.94,.95,.93,.94,.95,.96,.94,.92,.93,.94,.93,.91,.92,.90,.91,.90,.89,.88,.87,.88,.85,.86,.87,.89,.86,.88,.85,.87,.86,.88,.87,.89,.88,.90,.89,.88];
var ADV = [
  {name:"SVM",    rate:19.8, color:"#f87171"},
  {name:"LGBM",   rate:3.7,  color:"#67e8f9"},
  {name:"HYBRID", rate:3.3,  color:"#fbbf24"},
  {name:"RF",     rate:0.04, color:"#34d399"},
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
export default function CinematicPipeline(props) {
  useCineStyles();
  props = props || {};
  // Validate PIPELINE: must be a non-empty array whose every phase has a stages array
  var _pp = props.PIPELINE;
  var _valid = _pp && _pp.length && _pp.every(function(ph){ return ph && ph.stages && ph.stages.length; });
  var PIPELINE = _valid ? _pp : DEFAULT_PIPELINE;

  var _localOpen = useState(null);
  var localOpen = _localOpen[0], setLocalOpen = _localOpen[1];
  var pipeOpen = props.pipeOpen !== undefined ? props.pipeOpen : localOpen;
  var setPipeOpen = props.setPipeOpen || setLocalOpen;
  var PipeVis = props.PipeVis || null;

  var _act = useState(0);         var actIdx = _act[0];   var setActIdx = _act[1];
  var _t   = useState(0);         var t      = _t[0];     var setT      = _t[1];
  var _playing = useState(true);  var playing= _playing[0];var setPlaying= _playing[1];
  var _speed   = useState(1);     var speed  = _speed[0]; var setSpeed  = _speed[1];
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

        <div style={{maxWidth:1200,margin:"0 auto",padding:"26px 24px 0",position:"relative"}}>
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
                    <span style={{fontFamily:F.m,fontSize:8.5,letterSpacing:1.4,
                      color:active?a.color:done?$.tx3:$.dim,fontWeight:active?700:500,
                      transition:"color .3s"}}>
                      {String(i+1).padStart(2,"0")} · {a.phase.toUpperCase()}
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

        <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 24px 44px",position:"relative",minHeight:560}}>
          <div key={"cap"+actIdx} style={{
            position:"absolute",left:24,top:22,maxWidth:320,zIndex:3,
            animation:"cineFade .6s ease both"}}>
            <div style={{fontFamily:F.m,fontSize:9,color:act.color,letterSpacing:2,marginBottom:8}}>
              STEP {actIdx+1} OF 7
            </div>
            <h3 style={{fontFamily:serif,fontSize:"clamp(22px,2.6vw,30px)",color:$.tx,
              fontWeight:500,margin:"0 0 8px",lineHeight:1.2}}>
              {act.title}
            </h3>
            <p style={{fontFamily:F.s,fontSize:13,color:$.tx3,lineHeight:1.6,margin:0}}>
              {act.sub}
            </p>
          </div>

          <div style={{marginLeft:"clamp(0px, 28vw, 360px)",minHeight:460,position:"relative"}}>
            <SceneRenderer act={act} t={t} actIdx={actIdx}/>
          </div>

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
            Tap any step to see what it does in plain English.
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
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {ph.stages.map(function(s){
                  var isOpen = pipeOpen === s.n;
                  return (
                    <div key={s.n}
                      onClick={function(){ setPipeOpen(isOpen?null:s.n); }}
                      style={{background:$.bg2,border:"1px solid "+(isOpen?ph.color+"44":$.brd),
                        borderRadius:9,padding:"12px 14px",cursor:"pointer",transition:"all .25s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:32,height:32,borderRadius:8,background:ph.color+"10",
                          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                          fontFamily:F.m,fontSize:11,fontWeight:700,color:ph.color}}>{s.n}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:$.tx}}>{s.name}</div>
                          {!isOpen && <div style={{fontSize:11,color:$.tx3,marginTop:2}}>{s.plain}</div>}
                        </div>
                      </div>
                      {isOpen && (
                        <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.04)",animation:"cineFade .25s ease both"}}>
                          {PipeVis && <div style={{marginBottom:10}}><PipeVis n={s.n} color={ph.color}/></div>}
                          <div style={{display:"flex",gap:12,marginBottom:10,flexWrap:"wrap"}}>
                            <div style={{flex:1,minWidth:160,background:"rgba(255,255,255,.02)",padding:"8px 10px",borderRadius:6,border:"1px solid rgba(255,255,255,.03)"}}>
                              <div style={{fontFamily:F.m,fontSize:8,color:$.dim,letterSpacing:1,marginBottom:3}}>INPUT</div>
                              <div style={{fontSize:11,color:$.tx2}}>{s.input}</div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",color:ph.color,fontSize:14}}>→</div>
                            <div style={{flex:1,minWidth:160,background:ph.color+"08",padding:"8px 10px",borderRadius:6,border:"1px solid "+ph.color+"22"}}>
                              <div style={{fontFamily:F.m,fontSize:8,color:ph.color,letterSpacing:1,marginBottom:3}}>OUTPUT</div>
                              <div style={{fontSize:11,color:$.tx}}>{s.output}</div>
                            </div>
                          </div>
                          <div style={{fontSize:12,color:$.tx3,lineHeight:1.7}}>{s.desc}</div>
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
  var act = props.act, t = props.t, actIdx = props.actIdx;
  return (
    <div key={actIdx} style={{width:"100%",height:460,position:"relative",animation:"cineFade .55s ease both"}}>
      {act.id==="load"     && <SceneLoad t={t} color={act.color}/>}
      {act.id==="engineer" && <SceneEngineer t={t} color={act.color}/>}
      {act.id==="select"   && <SceneSelect t={t} color={act.color}/>}
      {act.id==="train"    && <SceneTrain t={t} color={act.color}/>}
      {act.id==="evaluate" && <SceneEvaluate t={t} color={act.color}/>}
      {act.id==="stress"   && <SceneStress t={t} color={act.color}/>}
      {act.id==="deploy"   && <SceneDeploy t={t} color={act.color}/>}
    </div>
  );
}

/* ═══ ACT 1: DATA LOADING ═══ */
function SceneLoad(props) {
  var t = props.t, color = props.color;
  var loaded = Math.floor(Math.min(1, t*1.3) * 60000);
  var nan = t < 0.55 ? Math.floor(t*1800) : Math.max(0, Math.floor((1-t)*200));
  var pct = Math.min(1, t*1.3);
  return (
    <div style={{width:"100%",height:"100%",display:"grid",gridTemplateRows:"1fr auto",gap:16}}>
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
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
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
  var t = props.t, color = props.color;
  var raw = ["τ1","τ2","τ3","τ4","p1","p2","p3","p4","g1","g2","g3","g4"];
  var newFeats = [
    "F_gain_1","F_gain_2","F_gain_3","F_gain_4",
    "F_gain_mean","F_gain_std","F_gain_min",
    "H_net","V_weak",
    "tau_mean","tau_std","tau_max",
    "g_mean","g_std","g_max",
    "p_total","p_imbalance"
  ];
  var reveal = Math.min(1, t*1.4);
  var featCount = Math.min(48, Math.floor(reveal * 48));
  var highlight = Math.floor((t*12) % newFeats.length);
  var visibleN = Math.min(featCount, newFeats.length);

  return (
    <div style={{width:"100%",height:"100%",display:"grid",gridTemplateRows:"1fr auto",gap:16}}>
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
                <rect x="10" y={y} width="72" height="15" rx="3" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" strokeWidth=".5"/>
                <text x="46" y={y+10} fill={$.tx3} fontSize="9" fontFamily={F.m} textAnchor="middle">{f}</text>
              </g>
            );
          })}
          <text x="46" y={20+12*20+10} fill={$.dim} fontSize="8" fontFamily={F.m} textAnchor="middle">12 basic readings</text>

          {raw.map(function(_,i){
            var sy = 20 + i*20 + 7;
            var lines = [];
            for (var j=0; j<visibleN; j++) {
              if ((i+j)%3!==0) continue;
              var tj = (i+j*3) % newFeats.length;
              var ey = 15 + tj*13 + 5;
              lines.push(<path key={i+"-"+j} d={"M 82 "+sy+" Q 280 "+((sy+ey)/2)+" 400 "+ey}
                stroke={color} strokeWidth=".4" opacity={.18} fill="none"/>);
            }
            return <g key={"g"+i}>{lines}</g>;
          })}

          {newFeats.slice(0, visibleN).map(function(f,i){
            var y = 15 + i*13;
            var isKey = f.indexOf("F_gain")===0 || f==="H_net" || f==="V_weak";
            var isHi = i===highlight;
            return (
              <g key={f}>
                <rect x="400" y={y} width="120" height="10" rx="2"
                  fill={isHi?color+"55":isKey?color+"22":"rgba(255,255,255,.04)"}
                  stroke={isHi?color:isKey?color+"55":"rgba(255,255,255,.08)"} strokeWidth=".5"
                  style={{animation:"cineDrop .3s ease both", animationDelay:(i*0.018)+"s"}}/>
                <text x="460" y={y+7} fill={isHi?$.tx:isKey?color:$.tx3} fontSize="8" fontFamily={F.m} textAnchor="middle"
                  fontWeight={isKey?700:400}>{f}</text>
              </g>
            );
          })}

          {t > 0.35 && (
            <g style={{animation:"cineFade .5s ease both"}}>
              <rect x="540" y="40" width="90" height="70" rx="6" fill={$.bg3} stroke={color+"44"} strokeWidth="1"/>
              <text x="585" y="60" fill={color} fontSize="9" fontFamily={F.m} textAnchor="middle" fontWeight="700">
                MOST IMPORTANT CLUE
              </text>
              <text x="585" y="82" fill={$.tx} fontSize="14" fontFamily={serif} textAnchor="middle" fontStyle="italic">
                F_gain = τ · g
              </text>
              <text x="585" y="100" fill={$.tx3} fontSize="7" fontFamily={F.m} textAnchor="middle">
                (how much power flows)
              </text>
            </g>
          )}
        </svg>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
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
  var t = props.t, color = props.color;
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
    <div style={{width:"100%",height:"100%",display:"grid",gridTemplateRows:"1fr auto",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:14}}>

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

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
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
  var t = props.t;
  var models = [
    {name:"Helper 1",  color:"#a78bfa", auc:.9999, kind:"boundary"},
    {name:"Helper 2",   color:"#34d399", auc:1.000, kind:"forest"},
    {name:"Helper 3", color:"#67e8f9", auc:1.000, kind:"gradient"},
    {name:"Helper 4",   color:"#fbbf24", auc:.9910, kind:"line"},
  ];
  var lcRows = [{data:LC_HYB,c:"#fbbf24",name:"TEAM"},{data:LC_LGBM,c:"#67e8f9",name:"H3"},{data:LC_RF,c:"#34d399",name:"H2"},{data:LC_LR,c:"#a78bfa",name:"H4"}];

  return (
    <div style={{width:"100%",height:"100%",display:"grid",gridTemplateRows:"auto 1fr",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
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
  var t = props.t, color = props.color;
  var rocRows = [
    {c:"#fbbf24",auc:1.000, name:"TEAM"},
    {c:"#67e8f9",auc:1.000, name:"H3"},
    {c:"#34d399",auc:1.000, name:"H2"},
    {c:"#a78bfa",auc:0.998, name:"H1"}
  ];
  return (
    <div style={{width:"100%",height:"100%",display:"grid",
      gridTemplateColumns:"1fr 1fr",gridTemplateRows:"auto auto",gap:12}}>

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
            {t>0.6 ? "95.3%" : ""}
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
  var t = props.t, color = props.color;
  var noise = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
  var ADV_FRIENDLY = [
    {name:"Helper 1", rate:19.8, color:"#f87171"},
    {name:"Helper 3", rate:3.7,  color:"#67e8f9"},
    {name:"TEAM",     rate:3.3,  color:"#fbbf24"},
    {name:"Helper 2", rate:0.04, color:"#34d399"},
  ];
  return (
    <div style={{width:"100%",height:"100%",display:"grid",
      gridTemplateRows:"1fr 1fr",gap:12}}>

      <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
        borderRadius:12,padding:"14px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5}}>HOW OFTEN EACH HELPER GETS TRICKED</div>
          <div style={{fontFamily:F.m,fontSize:9,color:color}}>lower = better</div>
        </div>
        <svg viewBox="0 0 600 140" style={{width:"100%",height:130}}>
          {ADV_FRIENDLY.map(function(m,i){
            var x = 30 + i*142;
            var h = Math.min(1, t*1.3) * (m.rate/20) * 90;
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

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:12}}>
        <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(255,255,255,.04)",
          borderRadius:12,padding:"12px 16px"}}>
          <div style={{fontFamily:F.m,fontSize:9,color:$.dim,letterSpacing:1.5,marginBottom:8}}>TOP CLUES THE AI USES</div>
          {SHAP_TOP.slice(0,7).map(function(f,i){
            var w = Math.min(1, (t*1.4) - i*0.04) * (f.v/10) * 100;
            if (w <= 0) return null;
            var labels = ["Power flow","Timing wobble","Average power","Weakest node","Flow swing","Health score","Average timing"];
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
              <span style={{color:color,fontWeight:700}}>{((0.998 - noise*0.06)*100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ ACT 7: DEPLOYMENT ═══ */
function SceneDeploy(props) {
  var t = props.t, color = props.color;
  var nBatches = AUC_STREAM.length;
  var upto = Math.floor(Math.min(1, t) * nBatches);
  var aucSlice = AUC_STREAM.slice(0, upto);
  var psiSlice = PSI_STREAM.slice(0, upto);
  var alertFired = upto > 20;
  var lastAucX = upto > 0 ? 20 + ((upto-1)/(nBatches-1))*560 : 20;
  var lastAucY = upto > 0 ? 100 - ((aucSlice[aucSlice.length-1]-.65)/.35)*85 : 100;

  return (
    <div style={{width:"100%",height:"100%",display:"grid",
      gridTemplateRows:"1fr 1fr auto",gap:12}}>

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

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
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
