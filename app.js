(() => {
  'use strict';
  const C = FishingCore, A = FishingArt, questions = QUESTION_BANK;
  const $ = id => document.getElementById(id);
  const panel = $('panel-content'), cast = $('cast-btn'), reel = $('reel-btn');
  const storageKey = 'pond-vector-v1';
  const blankSave = () => ({version:1, collectionEdition:4, unlockedLocations:[], collection:{}, retiredCollection:{}, total:0, questionIndex:0});
  let save = blankSave(), persistent = true;
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey));
    if(raw && raw.version===1 && raw.collection && typeof raw.collection==='object') {
      save.questionIndex=Number.isSafeInteger(raw.questionIndex)&&raw.questionIndex>=0?raw.questionIndex:0;
      C.FISH.forEach(f=>{const record=raw.collection[f.id];if(record&&Number.isSafeInteger(record.count)&&record.count>0&&Number.isFinite(record.max)&&record.max>=f.min&&record.max<=f.max){save.collection[f.id]={count:record.count,max:record.max};save.total+=record.count;}});
      // Retired Lapras remains in historical catch totals, outside the active catalogue.
      const retired=raw.retiredCollection?.lapras||raw.collection.lapras;
      if(retired&&Number.isSafeInteger(retired.count)&&retired.count>0&&Number.isFinite(retired.max)&&retired.max>=90&&retired.max<=180){save.retiredCollection.lapras={count:retired.count,max:retired.max};save.total+=retired.count;}
      if(Array.isArray(raw.unlockedLocations))save.unlockedLocations=[...new Set(raw.unlockedLocations.filter(id=>C.LOCATIONS.some(l=>l.id===id&&l.hidden)))];
      // Preserve classroom access earned under the previous 69-entry catalogue.
      if(raw.collectionEdition!==3&&raw.collectionEdition!==4&&Object.entries(raw.collection).filter(([id,r])=>(id==='lapras'||C.FISH.some(f=>f.id===id))&&Number.isSafeInteger(r?.count)&&r.count>0).length>=35&&!save.unlockedLocations.includes('classroom'))save.unlockedLocations.push('classroom');
      // Keep unlocks earned at 36/71 before adding the five SR fish.
      if(raw.collectionEdition===3&&C.FISH.filter(f=>f.introducedEdition!==4&&save.collection[f.id]).length>=36&&!save.unlockedLocations.includes('classroom'))save.unlockedLocations.push('classroom');
      // Existing 23-entry saves retain the classroom they previously earned.
      if(raw.collectionEdition!==2&&raw.collectionEdition!==3&&raw.collectionEdition!==4&&C.FISH.slice(0,23).filter(f=>save.collection[f.id]).length>11&&!save.unlockedLocations.includes('classroom'))save.unlockedLocations.push('classroom');
    }
  } catch { persistent=false; }
  let phase='idle', timing=null, castStart=0, questionStart=0, q=null, selected=null, attempts=0, elapsed=0, rate=0, correct=false;
  let lastAnnounced='', audio=null, musicGain=null, effectsGain=null, musicClock=0, musicStep=0, filter='ALL', screen='notice';
  let speechTimer=null, animationTimer=null, motionTimer=null, motion=null, mathEntry=null, targetFish=null;
  let location='pond';
  try{const stored=localStorage.getItem('pond-location');if(C.isLocationUnlocked(stored,save.collection,save.unlockedLocations))location=stored;}catch{}
  const spot=()=>C.LOCATIONS.find(l=>l.id===location);
  let character='male';
  try {if(localStorage.getItem('pond-character')==='female')character='female';}catch{}
  let volumes={music:25,effects:60};
  try { const prefs=JSON.parse(localStorage.getItem('pond-audio-v1')); if(prefs)for(const key of ['music','effects'])if(Number.isFinite(prefs[key]))volumes[key]=Math.max(0,Math.min(100,prefs[key])); } catch {}
  const badge=r=>{const item=C.RARITIES.find(x=>x.id===r);return `<span class="rarity" style="--r:${item.color}">${r}</span>`;};
  function persist(){
    for(const location of C.LOCATIONS)if(location.hidden&&C.isLocationUnlocked(location.id,save.collection,save.unlockedLocations)&&!save.unlockedLocations.includes(location.id))save.unlockedLocations.push(location.id);
    try{localStorage.setItem(storageKey,JSON.stringify(save));persistent=true;}catch{persistent=false;}$('save-warning').hidden=persistent;updateCounts();}
  function updateCounts(){
    const found=Object.keys(save.collection).length,total=C.FISH.length,percent=total?Math.round(found/total*100):0;
    $('collection-count').textContent=`${found}/${total}`;
    $('collection-total').textContent=save.total;
    $('collection-percent').textContent=percent+'%';
    $('collection-discovered').textContent=`${found} / ${total} 種`;
    $('collection-progress').setAttribute('aria-valuenow',String(percent));
    $('collection-progress').setAttribute('aria-valuetext',`${found} / ${total} 種，${percent}%`);
    $('collection-progress-fill').style.width=percent+'%';
    updateLocation();
  }
  function status(text){if(text!==lastAnnounced){$('fishing-status').textContent=text;lastAnnounced=text;}}
  function setPhase(value){phase=value;$('study-panel').classList.toggle('mobile-idle',['idle','missed'].includes(phase));$('study-panel').classList.toggle('mobile-active',['question','feedback'].includes(phase));cast.disabled=!['idle','missed'].includes(phase)||spot().fishable===false;reel.disabled=phase!=='bite';$('bite-bubble').hidden=phase!=='bite';$('collection-btn').disabled=['casting','hooking','waiting','bite','question','feedback','reeling'].includes(phase);for(const id of ['change-location','idle-collection']){const control=$(id);if(control)control.disabled=!['idle','missed'].includes(phase);}if(phase!=='bite')$('bite-clock').textContent='';const idleTitle=panel.querySelector('.simple-idle h2'),stage={casting:'拋竿中…',waiting:'等待魚訊…',bite:'有魚上鈎！',hooking:'提竿！'}[phase];if(idleTitle&&stage){idleTitle.textContent=stage;panel.querySelector('.simple-idle p').textContent='';}}
  const effectNames=['cast','splash','bite','reel','correct','retry','escape','catch-n','catch-r','catch-sr','catch-ssr','catch-sp','click'];
  const effectBytes=new Map(),effectBuffers=new Map(),effectLoads=new Map(),activeEffects=new Set();
  let effectGeneration=0;
  // Fetch recordings early; decoding and playback wait for the user's audio gesture.
  if(typeof fetch==='function')for(const name of effectNames)effectBytes.set(name,fetch('assets/audio-v4/'+name+'.wav').then(response=>response.ok?response.arrayBuffer():null).catch(()=>null));
  function loadEffect(name){
    if(effectBuffers.has(name))return Promise.resolve(effectBuffers.get(name));
    if(effectLoads.has(name))return effectLoads.get(name);
    if(!audio||!effectBytes.has(name))return Promise.resolve(null);
    const loading=effectBytes.get(name).then(bytes=>bytes?audio.decodeAudioData(bytes.slice(0)):null).then(buffer=>{if(buffer)effectBuffers.set(name,buffer);return buffer;}).catch(()=>null);
    effectLoads.set(name,loading);return loading;
  }
  function stopEffects(){effectGeneration++;for(const source of activeEffects){try{source.stop();}catch{}}activeEffects.clear();}
  function playEffect(name,delay=0){
    if(!effectNames.includes(name)||document.hidden||!volumes.effects||!ensureAudio())return;
    const generation=effectGeneration,requested=performance.now();
    const start=buffer=>{
      if(!buffer||generation!==effectGeneration||document.hidden||!volumes.effects||audio.state!=='running'||performance.now()-requested>450)return;
      if(activeEffects.size>=6){const oldest=activeEffects.values().next().value;try{oldest.stop();}catch{}}
      const source=audio.createBufferSource();source.buffer=buffer;source.connect(effectsGain);activeEffects.add(source);
      source.onended=()=>{activeEffects.delete(source);source.disconnect();};source.start(audio.currentTime+delay);
    };
    if(effectBuffers.has(name))start(effectBuffers.get(name));else loadEffect(name).then(start);
  }

  function ensureAudio(){try{if(!audio){audio=new(window.AudioContext||window.webkitAudioContext)();musicGain=audio.createGain();effectsGain=audio.createGain();musicGain.gain.value=volumes.music/100;effectsGain.gain.value=volumes.effects/100;musicGain.connect(audio.destination);effectsGain.connect(audio.destination);musicClock=audio.currentTime;for(const name of effectNames)loadEffect(name);}if(audio.state==='suspended'){musicClock=audio.currentTime;audio.resume().catch(()=>{});}return audio;}catch{return null;}}
  function tone(frequency,when,duration,destination,type='triangle',level=.06){const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.value=frequency;gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(level,when+.02);gain.gain.exponentialRampToValueAtTime(.0001,when+duration);osc.connect(gain);gain.connect(destination);osc.start(when);osc.stop(when+duration+.03);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
  // Original, gently looping pentatonic melody. Scheduling ahead avoids timer jitter.
  const melody=[76,0,79,81,79,0,76,74,72,0,74,76,79,0,74,0,76,0,79,84,81,79,76,0,74,0,72,74,76,0,72,0];
  const midi=n=>440*Math.pow(2,(n-69)/12);
  setInterval(()=>{if(!audio||audio.state!=='running'||document.hidden)return;if(musicClock<audio.currentTime)musicClock=audio.currentTime;while(musicClock<audio.currentTime+.3){const note=melody[musicStep%melody.length];if(volumes.music){if(note)tone(midi(note),musicClock,.48,musicGain,'triangle',.075);if(musicStep%4===0)tone(midi([48,53,55,48][Math.floor(musicStep/8)%4]),musicClock,1.3,musicGain,'sine',.075);}musicClock+=.34;musicStep++;}},120);
  document.addEventListener('visibilitychange',()=>{if(!audio)return;if(document.hidden){stopEffects();audio.suspend().catch(()=>{});}else ensureAudio();});
  document.addEventListener('pointerdown',()=>ensureAudio(),{once:true});
  document.addEventListener('keydown',()=>ensureAudio(),{once:true});
  function idle(missed=false){stopEffects();if(missed)playEffect('escape');clearTimeout(motionTimer);motion=null;$('scene').dataset.action='idle';clearTimeout(speechTimer);clearTimeout(animationTimer);$('character-speech').hidden=true;$('scene-result').hidden=true;$('catch-animation').hidden=true;$('catch-animation').className='catch-animation';setPhase(missed?'missed':'idle');status(missed?'魚兒游走了，再拋一竿吧。':'池水正好，來拋一竿吧。');panel.innerHTML=`<div class="simple-idle"><canvas id="mystery-fish" width="200" height="140" aria-hidden="true"></canvas><h2>${missed?'再來一竿？':'等一尾魚。'}</h2><p>${missed?'魚兒溜走了，再試一次吧。':'拋竿，開始釣魚。'}</p><button id="change-location" class="change-location" aria-label="更改地點">更改地點 <span aria-hidden="true">⌄</span></button><button id="idle-collection" class="change-location idle-collection" aria-label="查看圖鑑">查看圖鑑 <span aria-hidden="true">▦</span></button><button id="home-btn" class="change-location idle-home" aria-label="返回主界面">返回主界面 <span aria-hidden="true">⌂</span></button></div>`;if(spot().fishable===false){
      panel.querySelector('.simple-idle').classList.add('classroom-idle');
      $('mystery-fish').hidden=true;panel.querySelector('h2').textContent='全班都在摸魚。';
      panel.querySelector('.simple-idle p').textContent='這裡暫時沒有魚，先安靜坐一會。';
      status('氹坊課室暫時沒有魚，可以更改地點繼續釣魚。');
    }else{
      A.fish($('mystery-fish'),C.FISH.find(f=>f.location===location)||C.FISH[0],true);
      if(location==='classroom'){panel.querySelector('h2').textContent=missed?'再試一次？':'等一個驚喜。';panel.querySelector('.simple-idle p').textContent='全魚種開放，開始在堂上釣魚。';status('來課室池塘釣一個驚喜吧。');}
    }$('change-location').addEventListener('click',()=>openLocations());$('idle-collection').addEventListener('click',openCollection);$('home-btn').addEventListener('click',()=>showScreen('home'));}
  function playMotion(type,duration){motion={type,started:performance.now(),duration};$('scene').dataset.action=type;}
  function castLine(){if(screen!=='game'||!['idle','missed'].includes(phase)||spot().fishable===false)return;timing=C.biteTiming();castStart=performance.now();setPhase('casting');playMotion('cast',900);status('主角正在拋竿。');playEffect('cast');motionTimer=setTimeout(()=>{if(phase!=='casting')return;setPhase('waiting');$('scene').dataset.action='waiting';status('魚竿已拋出，留意水面……');playEffect('splash');},900);}
  function tick(){
    const now=performance.now();
    if(['waiting','bite'].includes(phase)){
      const ms=now-castStart, next=C.bitePhase(ms,timing);

      if(next==='bite'){
        if(phase!=='bite'){setPhase('bite');status('有魚上鈎！快按「提竿」！',true);playEffect('bite');}
        $('bite-clock').textContent=`${Math.max(0,(timing.end-ms)/1000).toFixed(1)} 秒`;
      }else if(next==='missed') idle(true);
    }
    if(phase==='question'&&questionStart)updateRateMeter((now-questionStart)/1000);
    // Game timing is independent of canvas rendering, including background tabs.
  }
  function reelLine(){if(phase!=='bite')return;if(C.bitePhase(performance.now()-castStart,timing)!=='bite'){idle(true);return;}setPhase('hooking');playMotion('hook',650);status('主角正在提竿！');playEffect('reel');motionTimer=setTimeout(()=>{if(phase!=='hooking')return;targetFish=C.chooseFish(Math.random,location,save.collection);q=questions[save.questionIndex%questions.length];save.questionIndex++;persist();selected=null;attempts=0;questionStart=0;motion=null;setPhase('question');$('scene').dataset.action='question';status(targetFish.kind==='doll'?'洋娃娃上鈎了！回答題目後收竿。':targetFish.kind==='item'?'神秘道具上鈎了！回答題目後收竿。':'魚咬穩了！回答題目後收竿。');renderQuestion();questionStart=performance.now();},650);}
  function renderQuestion(){
    panel.innerHTML=`<p class="mobile-question-note">${targetFish.kind==='doll'?'洋娃娃':targetFish.kind==='item'?'道具':'魚兒'}已上鈎 · 完成作答後返回釣點</p><div class="question-top"><span class="tag">${q.type==='choice'?'選擇題':'填充題'}</span><div class="catch-meter"><span class="meter-name">釣到率</span><div id="live-rate-bar" class="meter-track" role="progressbar" aria-label="答對時的釣到率" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(C.catchRate(true,0,targetFish,save.collection)*100)}"><span id="live-rate-fill" class="meter-fill" style="width:${Math.round(C.catchRate(true,0,targetFish,save.collection)*100)}%"></span><span class="meter-baseline" aria-hidden="true"></span></div><strong id="live-rate-value">${Math.round(C.catchRate(true,0,targetFish,save.collection)*100)}%</strong><small>基本 ${C.effectiveBaseRate(targetFish,save.collection)}%${C.catchBonus(save.collection)?`（收藏 +${C.catchBonus(save.collection)}%）`:''}</small></div></div><div class="question-prompt">${q.prompt}</div>${q.diagram?A.diagram(q.diagram):''}<form id="answer-form">${q.type==='choice'?`<div class="options" role="group" aria-label="答案選項">${q.options.map((option,i)=>`<button type="button" class="option" data-option="${i}" aria-pressed="false"><span class="letter">${'ABCD'[i]}</span><span class="option-content">${option}</span></button>`).join('')}</div>`:`<div class="entry-heading"><span class="input-label">輸入答案</span></div><div id="answer-entry" class="answer-entry" role="group" aria-label="數學答案"></div><div class="keypad" aria-label="數學數字鍵盤">${['7','8','9','⌫','4','5','6','清空','1','2','3','分數','±','0','.','根號'].map(key=>`<button type="button" data-key="${key}" class="${['⌫','清空','分數','根號'].includes(key)?'utility tool-key':key==='±'?'symbol':''}" aria-label="${{'⌫':'刪除一個字元','清空':'清空答案','分數':'插入分數','根號':'插入根號','±':'切換正負號'}[key]||key}">${key}</button>`).join('')}</div>`}${q.type==='fill'?'<p id="input-error" class="error-text" role="status"></p><button id="submit-answer" class="primary-button" type="submit">確認答案</button>':''}</form>`;
    panel.querySelectorAll('[data-option]').forEach(button=>button.addEventListener('click',()=>{if(phase!=='question')return;selected=Number(button.dataset.option);panel.querySelectorAll('[data-option]').forEach(b=>{const on=b===button;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});submitAnswer();}));
    panel.querySelectorAll('[data-key]').forEach(button=>button.addEventListener('click',()=>keyInput(button.dataset.key)));
    $('answer-form').addEventListener('submit',event=>{event.preventDefault();submitAnswer();});
    if(q.type==='fill'){mathEntry=new MathEntry($('answer-entry'));$('answer-entry').addEventListener('change',()=>{$('input-error').textContent='';});panel.querySelectorAll('[data-template]').forEach(button=>button.addEventListener('click',()=>mathEntry.insert(button.dataset.template)));}
    $('study-panel').scrollTop=0;
  }
  function keyInput(key){if(phase!=='question'||!mathEntry)return;if(key==='分數'||key==='根號')mathEntry.insert(key==='分數'?'fraction':'radical');else mathEntry.key(key==='清空'?'清除':key);}
  function submitAnswer(){if(phase!=='question'||!questionStart)return;let isCorrect;
    if(q.type==='choice'){if(selected===null)return;isCorrect=selected===q.answer;}
    else{const value=C.parseAnswer(mathEntry.value());if(value===null){$('input-error').textContent='請填妥每個空格，分母不能為 0。';return;}isCorrect=Math.abs(value-q.answer)<=Math.max(1,Math.abs(q.answer))*1e-8;}
    attempts++;
    if(!isCorrect&&attempts===1){say('手滑了，再答一次',0);if(q.type==='choice'){const old=panel.querySelector(`[data-option="${selected}"]`);old.disabled=true;old.classList.remove('selected');old.setAttribute('aria-pressed','false');selected=null;}else{mathEntry.clear();}if($('submit-answer'))$('submit-answer').textContent='確認重答';playEffect('retry');return;}
    correct=isCorrect;elapsed=(performance.now()-questionStart)/1000;rate=C.catchRate(correct,elapsed,targetFish,save.collection);showFeedback();playEffect(correct?'correct':'retry');resolveCatch();
  }
  function say(text,duration=3200,kind=''){$('character-speech').dataset.kind=kind;clearTimeout(speechTimer);$('speech-text').textContent=text;$('character-speech').hidden=false;if(duration)speechTimer=setTimeout(()=>$('character-speech').hidden=true,duration);}
  function showFeedback(){panel.innerHTML=`<div class="answer-review"><h2 class="feedback-heading">${correct?'答對了！':targetFish?.kind==='doll'?'娃娃溜走了。':targetFish?.kind==='item'?'道具掉回水中了。':'魚兒跑掉了。'}</h2><div class="explanation"><h3>正確答案</h3><div class="answer-display">${q.type==='choice'?`${'ABCD'[q.answer]}．`:''}${q.answerDisplay}</div><h3>解題說明</h3><div>${q.explanation}</div></div>${correct?'':'<button id="finish-review" class="primary-button">繼續釣魚</button>'}</div>`;if(!correct)$('finish-review').addEventListener('click',()=>{if(phase==='feedback')idle();});$('study-panel').scrollTop=0;}
  function resolveCatch(){
    setPhase('reeling');playMotion('reel',1050);clearTimeout(speechTimer);$('character-speech').hidden=true;
    const success=correct&&C.canCatch(targetFish,save.collection)&&Math.random()<rate;
    const animation=$('catch-animation'),noun=targetFish?.kind==='doll'?'娃娃':targetFish?.kind==='item'?'道具':'魚兒';animation.hidden=false;
    if(!success){
      animation.className='catch-animation fish-escaped';playEffect('escape',correct?.25:.45);$('flying-fish').hidden=true;status(noun+'溜走了。');say(correct?'哎呀，'+noun+'溜走了！':noun+'溜走了……',3200,'catch');
      animationTimer=setTimeout(()=>{animation.hidden=true;if(!correct){setPhase('feedback');return;}setPhase('result');$('scene-result').innerHTML=`<div class="pond-result-card escaped-card"><h2>${noun}溜走了。</h2><button id="pond-next" class="primary-button">繼續釣魚</button></div>`;$('scene-result').hidden=false;$('pond-next').addEventListener('click',nextCast);},1100);
      return;
    }
    const f=targetFish,size=Math.round((f.min+Math.random()*(f.max-f.min))*10)/10,old=save.collection[f.id],isNew=!old;
    save.collection[f.id]={count:(old?.count||0)+1,max:Math.max(old?.max||0,size)};save.total++;persist();
    $('flying-fish').hidden=false;A.fish($('flying-fish'),f);animation.className='catch-animation fish-landed';status(`釣到了${f.name}！已加入圖鑑。`);say('上鈎啦！',3200,'catch');
    animationTimer=setTimeout(()=>{animation.hidden=true;$('character-speech').hidden=true;setPhase('result');$('scene-result').innerHTML=`<div class="pond-result-card" data-rarity="${f.rarity}"><div class="catch-card-ornament" aria-hidden="true"></div><div class="catch-sparkles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="pond-fish-art"><span aria-hidden="true">✧</span><canvas id="pond-fish" width="280" height="180" role="img" aria-label="${f.name}的特寫"></canvas><span aria-hidden="true">✧</span></div><div class="result-meta">${badge(f.rarity)}${isNew?'<span class="new-tag">首次發現</span>':''}</div><h2>${f.name}</h2><p>${size.toFixed(1)} cm · 已收藏 ${save.collection[f.id].count} ${f.kind==='doll'||f.kind==='item'?'個':f.kind==='pokemon'?'隻':'尾'}</p>${f.oneTime?`<p class="doll-reward">永久基本釣到率 +5%<br>收藏加成合計 +${C.catchBonus(save.collection)}%</p>`:''}<button id="pond-next" class="primary-button">繼續釣魚</button></div>`;$('scene-result').hidden=false;A.fish($('pond-fish'),f);$('pond-next').addEventListener('click',nextCast);playEffect('catch-'+f.rarity.toLowerCase());},1050);
  }
  function nextCast(){if(phase!=='result')return;idle();cast.focus({preventScroll:true});}
  function renderCollection(){
    document.querySelector('.collection-footnote').textContent=spot().fishable===false?'目前釣點：氹坊課室。這裡暫時沒有魚。':`目前釣點：${spot().name}。魚訊出現權重：${Object.entries(C.encounterWeights(location,save.collection)).map(([r,w])=>r+' '+w+'%').join(' · ')}。每種魚有自己的基本釣到率。`;
    updateCounts();
    $('rarity-filters').innerHTML=['ALL',...C.RARITIES.map(r=>r.id)].map(id=>`<button type="button" data-filter="${id}" aria-pressed="${id===filter}">${id==='ALL'?'全部':id}</button>`).join('');
    $('rarity-filters').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;renderCollection();$('rarity-filters').querySelector(`[data-filter="${filter}"]`).focus();}));
    const list=C.FISH.filter(f=>filter==='ALL'||f.rarity===filter).sort((a,b)=>C.RARITIES.findIndex(r=>r.id===a.rarity)-C.RARITIES.findIndex(r=>r.id===b.rarity));
    $('fish-grid').innerHTML=list.map(f=>{const record=save.collection[f.id];return `<button type="button" class="fish-card ${record?'':'locked'}" data-fish-id="${f.id}" data-rarity="${f.rarity}" aria-label="查看${record?f.name:'未發現魚種'}詳情">${badge(f.rarity)}<canvas id="fish-${f.id}" width="160" height="100" aria-hidden="true"></canvas><strong class="fish-name">${record?f.name:'尚未發現'}</strong>${f.rarity==='SP'?'':`<span class="fish-count">已釣獲 ${record?.count||0} ${f.kind==='doll'||f.kind==='item'?'個':f.kind==='pokemon'?'隻':'條'}</span>`}</button>`;}).join('');list.forEach(f=>A.fish($('fish-'+f.id),f,!save.collection[f.id]));
    if(!list.length)$('fish-grid').innerHTML='<p class="collection-empty">此分類尚未加入魚種，敬請期待。</p>';
    $('fish-grid').querySelectorAll('[data-fish-id]').forEach(button=>button.addEventListener('click',()=>openFishDetail(button.dataset.fishId)));
  }
  function openFishDetail(id){
    const f=C.FISH.find(f=>f.id===id);if(!f)return;
    const record=save.collection[f.id],special=f.rarity==='SP',showStats=!special||!!record;
    $('fish-detail-dialog').dataset.rarity=f.rarity;
    $('fish-detail-title').textContent=record?f.name:'尚未發現';
    const stats=showStats?[
      special?'':`<div><dt>已釣獲</dt><dd>${record?.count||0} ${f.kind==='pokemon'?'隻':'條'}</dd></div>`,
      `<div><dt>${f.kind==='doll'||f.kind==='item'?'最大尺寸':'最大體長'}</dt><dd>${record?record.max.toFixed(1)+' cm':'—'}</dd></div>`,
      `<div><dt>基本釣到率</dt><dd>${record?C.effectiveBaseRate(f,save.collection)+'%':'—'}</dd></div>`,
      f.oneTime?`<div><dt>收藏效果</dt><dd>${record?'已生效':'收集後生效'}：永久基本釣到率 +5%</dd></div><div><dt>釣獲限制</dt><dd>每款只能釣獲一次</dd></div>`:'',
      C.catchBonus(save.collection)?`<div><dt>收藏加成合計</dt><dd>+${C.catchBonus(save.collection)}%</dd></div>`:'',
      special?'':`<div><dt>出沒地點</dt><dd>${C.LOCATIONS.filter(l=>C.fishPool(l.id).some(item=>item.id===f.id)).map(l=>l.hidden&&!C.isLocationUnlocked(l.id,save.collection,save.unlockedLocations)?'隱藏地點':l.name).join('、')}</dd></div>`
    ].join(''):'';
    $('fish-detail-content').innerHTML=`<div class="detail-fish-art"><canvas id="detail-fish-art" width="300" height="190" role="img" aria-label="${record?f.name+'的插畫':'未發現收藏品的剪影'}"></canvas></div><div class="detail-rarity">${badge(f.rarity)}</div><p class="detail-description">${record?f.description:'釣獲後解鎖詳細資料。'}</p>${showStats?'<dl class="fish-stats">'+stats+'</dl>':''}`;
    A.fish($('detail-fish-art'),f,!record);$('fish-detail-dialog').showModal();
  }

  function openCollection(){if(['casting','hooking','waiting','bite','question','feedback','reeling'].includes(phase))return;filter='ALL';renderCollection();$('collection-dialog').showModal();}
  let fullscreenFallback=false;
  function syncFullscreen(){const active=!!(document.fullscreenElement||document.webkitFullscreenElement||fullscreenFallback);document.querySelectorAll('[data-fullscreen]').forEach(button=>{button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',active?'退出全屏':'全屏');});document.body.classList.toggle('fullscreen-layout',active);}
  document.querySelectorAll('[data-fullscreen]').forEach(button=>button.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.webkitFullscreenElement)await document.webkitExitFullscreen();else if(fullscreenFallback){fullscreenFallback=false;document.querySelector('.app-shell').classList.remove('fullscreen-fallback');}else{const request=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;if(!request)throw Error('fullscreen unavailable');await request.call(document.documentElement);}}catch{fullscreenFallback=true;document.querySelector('.app-shell').classList.add('fullscreen-fallback');}syncFullscreen();}));
  document.addEventListener('fullscreenchange',syncFullscreen);document.addEventListener('webkitfullscreenchange',syncFullscreen);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&fullscreenFallback){fullscreenFallback=false;document.querySelector('.app-shell').classList.remove('fullscreen-fallback');syncFullscreen();}});
  function showScreen(next){idle();screen=next;$('home-screen').hidden=next!=='home';$('game-screen').hidden=next!=='game';document.body.classList.toggle('in-game',next==='game');window.scrollTo(0,0);(next==='game'?cast:$('start-btn')).focus({preventScroll:true});}
  function updateRateMeter(seconds){const percent=Math.round(C.catchRate(true,seconds,targetFish,save.collection)*100),bar=$('live-rate-bar');if(!bar||bar.getAttribute('aria-valuenow')===String(percent))return;bar.setAttribute('aria-valuenow',String(percent));$('live-rate-value').textContent=percent+'%';$('live-rate-fill').style.width=percent+'%';}
  function updateVolumes(){for(const key of ['music','effects']){$(key+'-volume').value=volumes[key];$(key+'-volume-value').textContent=volumes[key]+'%';}if(audio){musicGain.gain.setTargetAtTime(volumes.music/100,audio.currentTime,.04);effectsGain.gain.setTargetAtTime(volumes.effects/100,audio.currentTime,.04);}}
  for(const key of ['music','effects']){$(key+'-volume').addEventListener('input',event=>{volumes[key]=Number(event.target.value);ensureAudio();updateVolumes();try{localStorage.setItem('pond-audio-v1',JSON.stringify(volumes));}catch{}});}
  $('effects-volume').addEventListener('change',()=>playEffect('click'));
  $('start-btn').addEventListener('click',()=>showScreen('game'));
  $('agree-btn').addEventListener('click',()=>{
    const shell=document.querySelector('.app-shell');
    shell.hidden=false;shell.inert=false;$('startup-notice').hidden=true;
    showScreen('home');
  });
  function updateLocation(){
    if(!C.isLocationUnlocked(location,save.collection,save.unlockedLocations)){location='pond';try{localStorage.setItem('pond-location',location);}catch{}}

    $('location-name').textContent=spot().name;$('location-number').textContent='釣點 '+spot().number;
    document.body.dataset.location=location;
    document.querySelectorAll('button[data-location]').forEach(button=>{
      const id=button.dataset.location,item=C.LOCATIONS.find(l=>l.id===id),unlocked=C.isLocationUnlocked(id,save.collection,save.unlockedLocations),current=id===location;
      button.hidden=false;button.disabled=!unlocked;button.setAttribute('aria-pressed',String(current));
      button.querySelector('strong').textContent=unlocked?item.name:'隱藏地點';
      button.querySelector('small').textContent=!unlocked?'圖鑑超過 50% 解鎖':current?'目前地點':id==='classroom'?'前往看看':'前往釣魚';
    });
    document.querySelectorAll('[data-setting-location]').forEach(button=>{button.hidden=!C.isLocationUnlocked(button.dataset.settingLocation,save.collection,save.unlockedLocations);button.setAttribute('aria-pressed',String(button.dataset.settingLocation===location));});
    updateCharacter();
  }
  function openLocations(){updateLocation();$('location-dialog').showModal();}
  function selectLocation(next){
    if(!['idle','missed'].includes(phase)||!C.isLocationUnlocked(next,save.collection,save.unlockedLocations))return false;
    location=next;try{localStorage.setItem('pond-location',location);}catch{}
    updateLocation();idle();return true;
  }
  document.querySelectorAll('button[data-location]').forEach(button=>button.addEventListener('click',()=>{
    if(!selectLocation(button.dataset.location))return;
    $('location-dialog').close();cast.focus({preventScroll:true});
  }));
  document.querySelectorAll('[data-setting-location]').forEach(button=>button.addEventListener('click',()=>selectLocation(button.dataset.settingLocation)));
  function updateCharacter(){document.querySelectorAll('[data-character]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.character===character)));const name=character==='female'?'女主角':'男主角';$('scene').setAttribute('aria-label',spot().name+'：'+name+'背對玩家，面向水面釣魚。');$('home-scene').setAttribute('aria-label',name+'在'+spot().name+'釣魚的背影');document.body.classList.toggle('female-character',character==='female');}
  document.querySelectorAll('[data-character]').forEach(button=>button.addEventListener('click',()=>{character=button.dataset.character;updateCharacter();try{localStorage.setItem('pond-character',character);}catch{}}));
  $('settings-btn').addEventListener('click',()=>$('settings-dialog').showModal());
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('button');
    if(!button||button.disabled||button.matches('#cast-btn,#reel-btn,#submit-answer,[data-option],[data-key]'))return;
    playEffect('click');
  });
  cast.addEventListener('click',castLine);reel.addEventListener('click',reelLine);$('collection-btn').addEventListener('click',openCollection);

  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}}));
  document.addEventListener('keydown',event=>{if(screen!=='game'||event.repeat||document.querySelector('dialog[open]')||['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName))return;if(event.code==='Space'&&['idle','missed','bite'].includes(phase)){event.preventDefault();phase==='bite'?reelLine():castLine();}});
  A.fish($('brand-fish'),C.FISH[0]);A.scene($('home-scene'),()=>screen==='home'?'idle':'paused',()=>character,()=>null,()=>location);A.scene($('scene'),()=>phase,()=>character,()=>motion,()=>location);persist();idle();updateVolumes();updateLocation();setInterval(tick,80);
})();
