(function (root) {
  'use strict';
  const dollArt=new Image(),classroomMobileArt=new Image(),classroomArt=new Image(),crabArt=new Image(),beachArt=new Image(),seaFishArt=new Image(),pondArt=new Image(),anglerArt=new Image(),fishArt=new Image(),actionArt=new Image(),duckArt=new Image(),bobberArt=new Image(),buttonArt=new Image();
  dollArt.src='assets/classroom-dolls-v1.png';
  classroomMobileArt.src='assets/classroom-mobile-v1.png';
  classroomArt.src='assets/classroom-v1.png';
  crabArt.src='assets/beach-crab-v1.png';
  beachArt.src='assets/hac-sa-v1.png';seaFishArt.src='assets/sea-fish-atlas-v1.png';
  pondArt.src='assets/pond-v2.png';anglerArt.src='assets/anglers-v1.png';fishArt.src='assets/fish-atlas-v1.png';actionArt.src='assets/angler-actions-v1.png';duckArt.src='assets/swimming-duck-v1.png';bobberArt.src='assets/bobber-v1.png';buttonArt.src='assets/fishing-buttons-v1.png';
  const fishBoxes=[[36,76,364,312],[24,76,370,341],[30,70,359,339],[18,123,386,280],[28,76,363,317],[31,67,371,299],[22,48,367,330],[18,37,365,340],[11,37,374,330],[30,64,367,306]];
  const fishOrder=['bean','worker','puffer','slipper','melon','lantern','galaxy','crown','dragon','cosmic'];
  const seaFishBoxes=[[8,106,396,313],[11,103,397,341],[6,99,382,329],[7,75,397,351],[0,122,394,312],[2,133,397,307],[0,39,389,320],[8,34,397,320],[0,25,380,349],[1,51,396,344]];
  const seaFishOrder=['sand-sardine','flip-flounder','sleepy-mackerel','tart-puffer','cool-mullet','lazy-mackerel','bun-grouper','float-flyingfish','shumai-lionfish','surf-ribbonfish'];
  const dollOrder=['inspiration-doll','pen-doll','glasses-doll'];
  const dollBoxes=[[202,10,631,715],[113,8,593,715],[93,12,561,715]];
  const expansionAtlases=[{"file":"pond-expansion-a-v1.png","cols":5,"rows":2,"ids":["leafcap-carp","riceball-crucian","milktea-carp","nap-silvercarp","backpack-carp","friedegg-bream","rainboot-catfish","edamame-carp","lotusroot-bubble","pudding-puffer"],"boxes":[[27,40,392,333],[26,68,365,333],[11,43,369,340],[15,79,375,330],[11,66,377,337],[17,50,366,324],[10,50,383,346],[11,49,378,316],[16,47,372,343],[16,15,372,341]]},{"file":"pond-expansion-b-v1.png","cols":5,"rows":2,"ids":["scarf-trout","mochi-carp","teapot-catfish","detective-bass","bamboo-eel","sakura-koi","moon-goodnight","wizard-broomfish","cotton-cloudfish","lucky-ingotfish"],"boxes":[[10,68,395,346],[18,68,372,329],[8,56,387,336],[10,51,381,341],[9,47,392,355],[9,40,395,338],[18,52,383,334],[4,47,387,338],[10,52,377,324],[3,47,385,326]]},{"file":"beach-expansion-a-v1.png","cols":3,"rows":3,"ids":["crispy-sardine","sandcastle-bream","sushi-rollfish","lemon-sourfish","pajama-stripefish","corn-cod","goggle-butterflyfish","pizza-stingray","lifeguard-shark"],"boxes":[[27,127,411,343],[15,63,394,379],[10,91,386,397],[27,62,406,347],[15,60,402,350],[3,69,391,343],[25,20,385,346],[0,33,403,371],[0,30,392,335]]},{"file":"beach-expansion-b-v1.png","cols":4,"rows":2,"ids":["coconut-vacationfish","scallop-clownfish","firework-lionfish","pearl-bubblefish","aurora-flyingfish","neon-electric-eel","neptune-tridentfish","wish-sunfish"],"boxes":[[28,33,418,399],[18,86,425,374],[12,23,421,420],[19,52,426,407],[14,35,433,402],[18,64,411,400],[21,17,420,416],[13,13,426,422]]},{"file":"pokemon-collectibles-v1.png","cols":3,"rows":3,"ids":["magikarp","gyarados","seaking","psyduck","poliwag","squirtle","seel","staryu"],"boxes":[[48,36,389,372],[5,0,392,385],[29,37,396,359],[45,-10,337,369],[1,67,407,362],[26,16,399,369],[11,39,404,357],[13,12,363,340],[-15,-15,419,373]]}].map(spec=>{const image=new Image();image.src='assets/'+spec.file;return {...spec,image};});
  for(const atlas of [fishArt,seaFishArt,dollArt,...expansionAtlases.map(a=>a.image)])atlas.addEventListener('load',()=>{document.querySelectorAll('canvas[data-fish-art]').forEach(canvas=>{const f=FishingCore.FISH.find(f=>f.id===canvas.dataset.fishArt);if(f)fish(canvas,f,canvas.dataset.fishShadow==='true');});});
  function setupButtonSkins(){
    const boxes=[[35,88,1500,514],[35,535,1500,961]];
    ['cast-btn','reel-btn'].forEach((id,index)=>{const button=document.getElementById(id);if(!button||button.querySelector('.button-art'))return;const layer=document.createElement('canvas');layer.className='button-art';layer.setAttribute('aria-hidden','true');button.prepend(layer);button.classList.add('with-art');const render=()=>{const w=button.clientWidth,h=button.clientHeight;if(!w||!h)return;const dpr=Math.min(2,window.devicePixelRatio||1);layer.width=Math.round(w*dpr);layer.height=Math.round(h*dpr);const ctx=layer.getContext('2d'),b=boxes[index];ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(buttonArt,b[0],b[1],b[2]-b[0],b[3]-b[1],0,0,layer.width,layer.height);};new ResizeObserver(render).observe(button);render();});
  }
  buttonArt.addEventListener('load',setupButtonSkins);
  function drawDuck(c,t){
    if(!duckArt.complete||!duckArt.naturalWidth)return;
    const compact=c.canvas.clientHeight>c.canvas.clientWidth*1.3,pose=FishingCore.duckPose(quietMotion?0:t,compact),x=pose.x,y=pose.y;
    c.canvas.dataset.duckX=x.toFixed(2);c.canvas.dataset.duckY=y.toFixed(2);
    c.save();c.strokeStyle='#c8f3db';c.lineWidth=.8;
    for(let i=0;i<4;i++){c.globalAlpha=.4-i*.08;const wx=x-pose.heading*(20+i*9);c.beginPath();c.ellipse(wx,y+11+Math.sin(t*2-i)*.8,6+i*2,1.4+i*.35,0,0,Math.PI*2);c.stroke();}
    c.globalAlpha=.35;c.fillStyle='#245e4a';c.beginPath();c.ellipse(x,y+11,18,3.8,0,0,Math.PI*2);c.fill();
    c.globalAlpha=1;c.translate(x,y);c.rotate(pose.rock);c.scale(pose.heading,1);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(duckArt,201,155,886,935,-21,-30,42,44);c.restore();
  }
  function drawCrab(c,t){
    if(!crabArt.complete||!crabArt.naturalWidth)return;
    const compact=c.canvas.clientHeight>c.canvas.clientWidth*1.3,pose=FishingCore.crabPose(quietMotion?0:t,compact);
    const width=compact?31:40,height=width*495/665;
    c.canvas.dataset.crabX=pose.x.toFixed(2);c.canvas.dataset.crabY=pose.y.toFixed(2);c.canvas.dataset.crabState=pose.state;
    c.save();c.translate(pose.x,pose.y);
    c.globalAlpha=.24;c.fillStyle='#272a32';c.beginPath();c.ellipse(0,0,width*.38,2.7,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
    if(pose.burrow>0){c.fillStyle='#a39283';for(let i=0;i<5;i++){const x=Math.sin(t*9+i*2)*(width*.5),y=-Math.abs(Math.cos(t*7+i))*3;c.fillRect(x,y,1.2,1.2);}}
    // Lower the sprite behind a sand-level clip, leaving only its eye stalks above ground.
    c.beginPath();c.rect(-width, -height-4, width*2,height+4);c.clip();
    c.translate(0,pose.burrow*height*.63+pose.bounce);c.scale(pose.heading,1);
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.drawImage(crabArt,pose.frame*724+30,120,665,495,-width/2,-height,width,height);
    c.restore();
  }
  function drawBobber(c,x,y,biting,t){
    if(bobberArt.complete&&bobberArt.naturalWidth){c.save();c.translate(x,y);c.rotate(biting?Math.sin(t*15)*.12:Math.sin(t*1.5)*.025);c.drawImage(bobberArt,375,92,500,1035,-7,-23,14,29);c.restore();}
    else{c.fillStyle='#f79c6a';c.fillRect(x-3,y-5,5,6);c.fillStyle='#fff5c5';c.fillRect(x-3,y+1,5,4);}
  }
  const itemArt=new Map(FishingCore.FISH.filter(f=>f.asset).map(f=>{const image=new Image();image.addEventListener('load',()=>{document.querySelectorAll('canvas[data-fish-art]').forEach(canvas=>{if(canvas.dataset.fishArt===f.id)fish(canvas,f,canvas.dataset.fishShadow==='true');});});image.src='assets/'+f.asset;return [f.id,image];}));
  function generatedFish(canvas,f,silhouette){
    if(f.asset){
      const image=itemArt.get(f.id);if(!image?.complete||!image.naturalWidth)return false;
      const ctx=canvas.getContext('2d'),scale=Math.min((canvas.width-10)/image.naturalWidth,(canvas.height-10)/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;
      ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,0,0,image.naturalWidth,image.naturalHeight,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
      if(silhouette){ctx.globalCompositeOperation='source-in';ctx.fillStyle='#a8b89a';ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.restore();return true;
    }
    const extra=expansionAtlases.find(a=>a.ids.includes(f.id));
    const doll=f.kind==='doll',sea=f.location==='beach',atlas=extra?extra.image:doll?dollArt:sea?seaFishArt:fishArt,index=(extra?extra.ids:doll?dollOrder:sea?seaFishOrder:fishOrder).indexOf(f.id);
    if(index<0||!atlas.complete||!atlas.naturalWidth)return false;
    const columns=extra?extra.cols:doll?3:5,rows=extra?extra.rows:doll?1:2,col=index%columns,row=Math.floor(index/columns),box=extra?extra.boxes[index]:doll?dollBoxes[index]:sea?seaFishBoxes[index]:fishBoxes[index],pad=extra||doll||sea?0:8;
    const cellX=Math.round(col*atlas.naturalWidth/columns),cellY=Math.round(row*atlas.naturalHeight/rows);
    const sx=cellX+box[0]-pad,sy=cellY+box[1]-pad,sw=box[2]-box[0]+pad*2,sh=box[3]-box[1]+pad*2;
    const ctx=canvas.getContext('2d'),scale=Math.min((canvas.width-10)/sw,(canvas.height-10)/sh),w=sw*scale,h=sh*scale;
    ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(atlas,sx,sy,sw,sh,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
    if(silhouette){ctx.globalCompositeOperation='source-in';ctx.fillStyle='#a8b89a';ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.restore();return true;
  }
  function drawPlayer(c,character,frame,alpha,tilt,bob){
    if(alpha<=0)return;const female=character==='female';c.save();c.globalAlpha=alpha;c.translate(240,354);c.rotate(tilt*.5);c.translate(-240,-354);
    if(frame>=0&&actionArt.complete&&actionArt.naturalWidth){const cellW=actionArt.naturalWidth/4,cellH=actionArt.naturalHeight/2,x=Math.round(frame*cellW),y=Math.round((female?1:0)*cellH),w=Math.round((frame+1)*cellW)-x,h=Math.round((female?2:1)*cellH)-y,anchor=[240,214,230,219][frame];c.drawImage(actionArt,x,y,w,h,240-anchor/3,215+bob,w/3,h/3);}
    else c.drawImage(anglerArt,(female?anglerArt.naturalWidth/2:0)+200,65,480,775,197,218+bob,86,139);
    c.restore();
  }
  const quietMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function drawAmbience(c,t,background=pondArt){
    if(quietMotion)return;
    c.save();c.globalAlpha=.48;
    // Refract only the water; the angler and pier are drawn independently and remain still.
    for(let i=0;i<6;i++){const y=163+i*23,shift=Math.sin(t*.7+i*.9)*1.2;c.drawImage(background,50/480*background.naturalWidth,y/420*background.naturalHeight,380/480*background.naturalWidth,7/420*background.naturalHeight,50+shift,y,380,7);}
    for(let i=0;i<19;i++){const x=80+(i*67)%330,y=157+(i*31)%146,p=(Math.sin(t*1.1+i*1.7)+1)/2;c.globalAlpha=.08+p*.3;c.fillStyle=i%3?'#d2f5d5':'#fff2b2';c.fillRect(x+Math.round(Math.sin(t*.5+i)*3),y,3+p*8,1);}
    [[154,214],[349,246],[112,283]].forEach(([x,y],i)=>{const p=(t*.19+i*.33)%1;c.globalAlpha=Math.sin(p*Math.PI)*.25;c.strokeStyle='#dcfae0';c.lineWidth=.8;c.beginPath();c.ellipse(x,y,4+p*19,1+p*4,0,0,Math.PI*2);c.stroke();});
    if(background===pondArt)for(let i=0;i<4;i++){const p=(t*.055+i*.26)%1,x=65+(i*91)%340+Math.sin(t*.4+i)*14,y=25+p*255;c.globalAlpha=Math.sin(p*Math.PI)*.65;c.fillStyle=i%2?'#c5d584':'#e3d58b';c.fillRect(Math.round(x),Math.round(y),4,2);c.fillRect(Math.round(x+1),Math.round(y-1),2,4);c.fillStyle='#839f60';c.fillRect(Math.round(x+2),Math.round(y),1,3);}
    c.restore();
  }
  function drawCoast(c,t){
    if(quietMotion)return;
    c.save();
    // Foamy wavelets drift towards the shore, leaving the seated player untouched.
    for(let row=0;row<3;row++){
      const p=(t*.09+row/3)%1,y=291+p*44;
      c.globalAlpha=Math.sin(p*Math.PI)*.45;c.strokeStyle='#e8f8e9';c.lineWidth=1.2;
      for(const [left,right] of [[0,174],[306,480]]){
        c.beginPath();for(let x=left;x<=right;x+=4){const yy=y+Math.sin(x*.035+t*.65+row)*3; x===left?c.moveTo(x,yy):c.lineTo(x,yy);}c.stroke();
      }
    }
    c.globalAlpha=.75;c.strokeStyle='#fff5dc';c.lineWidth=1.2;
    for(let i=0;i<3;i++){const x=((t*5+i*145)%590)-55,y=54+i*14+Math.sin(t*.4+i)*3,wing=2+Math.sin(t*3+i)*1.4;c.beginPath();c.moveTo(x-5,y-wing);c.quadraticCurveTo(x-2,y-3,x,y);c.quadraticCurveTo(x+2,y-3,x+5,y-wing);c.stroke();}
    c.restore();
  }
  function drawClassroomAmbience(c,t,portrait=false){
    if(quietMotion)return;
    c.save();
    // Reflections stay inside the little classroom pond; students remain asleep.
    for(let i=0;i<12;i++){const x=portrait?190+(i*19)%100:134+(i*47)%213,y=(portrait?163:175)+(i*17)%(portrait?39:55);c.globalAlpha=.12+.12*Math.sin(t*.8+i);c.fillStyle='#e6f2c1';c.fillRect(x+Math.sin(t*.6+i)*2,y,5+(i%3)*3,1);}
    for(const [x,y,offset] of (portrait?[[175,250,0],[303,250,.5]]:[[108,228,0],[370,224,.5]])){const p=(t*.25+offset)%1;c.globalAlpha=Math.sin(p*Math.PI)*.5;c.fillStyle='#fff2b5';c.font='bold 9px monospace';c.fillText('z',x+Math.sin(p*3)*3,y-p*11);}
    c.restore();
  }
  function generatedScene(c,phase,character,tick,motion,location){
    const background=location==='classroom'?classroomArt:location==='beach'?beachArt:pondArt;c.canvas.dataset.location=location;

    if(!background.complete||!background.naturalWidth||!anglerArt.complete||!anglerArt.naturalWidth)return false;
    c.imageSmoothingEnabled=false;c.drawImage(background,0,0,480,420);
    const classroomPortrait=location==='classroom'&&c.canvas.clientHeight>c.canvas.clientWidth*1.3&&classroomMobileArt.complete&&classroomMobileArt.naturalWidth;
    if(classroomPortrait){
      const visibleWidth=420*c.canvas.clientWidth/c.canvas.clientHeight;
      const sourceHeight=classroomMobileArt.naturalWidth/(c.canvas.clientWidth/c.canvas.clientHeight),sy=Math.max(0,(classroomMobileArt.naturalHeight-sourceHeight)/2);
      c.drawImage(classroomMobileArt,0,sy,classroomMobileArt.naturalWidth,Math.min(sourceHeight,classroomMobileArt.naturalHeight),(480-visibleWidth)/2,0,visibleWidth,420);
    }
    if(location==='classroom')drawClassroomAmbience(c,tick,classroomPortrait);else drawAmbience(c,tick,background);
    if(location==='beach'){drawCoast(c,tick);drawCrab(c,tick);}else{delete c.canvas.dataset.crabState;delete c.canvas.dataset.crabX;delete c.canvas.dataset.crabY;if(location==='pond')drawDuck(c,tick);}
    if(location!=='pond'){delete c.canvas.dataset.duckX;delete c.canvas.dataset.duckY;}
    const compact=c.canvas.clientHeight>c.canvas.clientWidth*1.3,[bobberX,bobberY]=FishingCore.fishingTarget(location,compact),age=motion?(performance.now()-motion.started)/motion.duration:2,active=motion&&age<1.5;
    const pose=active?FishingCore.actionPose(motion.type,age,compact,location):null;
    const bob=0;
    c.save();c.globalAlpha=.2;c.fillStyle='#304d39';c.beginPath();c.ellipse(240,354,28,5,0,0,Math.PI*2);c.fill();c.restore();
    const displayFrame=pose?(pose.blend>.5?pose.frame2:pose.frame):-1;drawPlayer(c,character,displayFrame,1,pose?.tilt||0,bob);c.canvas.dataset.motionFrame=String(displayFrame);c.canvas.dataset.motionProgress=pose?age.toFixed(2):'';
    const fishing=['casting','hooking','waiting','bite','question','feedback','reeling'].includes(phase),animated=pose&&age<1;
    const hand=animated&&displayFrame>=0?[[267,261],[290,280],[265,272],[274,289]][displayFrame]:[276,296+bob],rawTip=animated?pose.tip:[fishing?(compact?298:332):(compact?292:316),fishing?209:195],tip=FishingCore.rodTip(hand,rawTip),lure=animated?pose.lure:[fishing||location==='classroom'?bobberX:(compact?300:325),fishing?bobberY:location==='classroom'?bobberY-13:236];
    const flex=animated?(motion.type==='hook'?-10+Math.sin(age*Math.PI*2)*2:Math.sin(age*Math.PI*2)*9):phase==='bite'?Math.sin(tick*12)*3:0;
    c.lineCap='round';c.lineWidth=3;c.strokeStyle='#62452e';c.beginPath();c.moveTo(...hand);c.quadraticCurveTo((hand[0]+tip[0])/2+flex,(hand[1]+tip[1])/2-10,...tip);c.stroke();c.lineWidth=1;c.strokeStyle='#efdeb5';c.stroke();
    c.strokeStyle='#f0e9ca';c.lineWidth=.8;c.beginPath();c.moveTo(...tip);c.quadraticCurveTo((tip[0]+lure[0])/2+(animated?12:2),(tip[1]+lure[1])/2+(animated?6:1),lure[0],lure[1]-(bobberArt.complete&&bobberArt.naturalWidth?22:0));c.stroke();
    if(fishing&&(!animated||motion.type!=='cast'||age>.3)){const y=lure[1]+(phase==='bite'?Math.sin(tick*18)*2:animated?0:Math.sin(tick*2));drawBobber(c,lure[0],y,phase==='bite',tick);if(!animated||motion.type==='hook'){c.strokeStyle='#c5eee0';c.lineWidth=1;c.beginPath();c.ellipse(lure[0],y+7,phase==='bite'?15:10,3,0,0,Math.PI*2);c.stroke();}}
    if(animated&&motion.type==='reel'){const angle=age*Math.PI*10;c.strokeStyle='#c49a52';c.lineWidth=2;c.beginPath();c.arc(hand[0]-7,hand[1]+5,3,0,Math.PI*2);c.moveTo(hand[0]-7,hand[1]+5);c.lineTo(hand[0]-7+Math.cos(angle)*6,hand[1]+5+Math.sin(angle)*6);c.stroke();}
    if(pose&&pose.splash>0){const p=pose.splash;c.save();c.globalAlpha=1-p;c.strokeStyle='#e9fff1';c.lineWidth=1.4;for(let i=0;i<2;i++){c.beginPath();c.ellipse(bobberX,bobberY+7+i*2,6+p*26+i*5,2+p*5,0,0,Math.PI*2);c.stroke();}c.fillStyle='#d9fff2';for(let i=0;i<5;i++){const angle=(i/4)*Math.PI;c.fillRect(bobberX+Math.cos(angle)*(10+22*p),bobberY-Math.sin(angle)*18*(1-p),2,3);}c.restore();}
    return true;
  }
  function fish(canvas, f, silhouette = false) {
    canvas.dataset.fishArt=f.id;canvas.dataset.fishShadow=String(silhouette);if(generatedFish(canvas,f,silhouette))return;
    const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false;
    const w=canvas.width,h=canvas.height; c.clearRect(0,0,w,h); c.save();
    const scale=Math.min(w/40,h/27);c.translate((w-40*scale)/2,(h-27*scale)/2);c.scale(scale,scale);
    const dark='#334c4a', body=f.colors[0], light=f.colors[1];
    function r(x,y,w,h,color){c.fillStyle=silhouette?'#b7c6a8':color;c.fillRect(x,y,w,h);}
    // Stepped silhouette, tail, fins and two-tone body.
    r(3,10,4,9,dark);r(1,8,3,13,dark);r(2,10,4,9,body);r(6,12,4,5,dark);
    r(12,7,17,15,dark);r(9,10,23,10,dark);r(14,5,11,3,dark);r(13,8,15,12,body);r(10,11,20,7,body);r(15,7,10,3,body);
    r(14,17,14,3,light);r(17,20,8,1,light);r(16,3,5,3,dark);r(17,4,3,3,body);r(18,20,5,4,dark);r(19,21,3,2,body);
    if(f.style==='puffer'){r(10,7,18,16,body);r(14,5,10,20,body);r(13,18,12,5,light);[[9,8],[12,4],[20,3],[29,8],[30,17],[11,22]].forEach(([x,y])=>r(x,y,2,2,dark));r(16,12,1,1,dark);r(19,9,1,1,dark);}
    if(f.style==='worker'){r(14,9,9,2,light);r(15,12,2,2,light);r(18,14,2,2,light);r(24,9,6,1,dark);}
    if(f.style==='slipper'){r(8,17,24,5,body);r(10,19,20,3,light);r(13,9,3,9,dark);r(16,8,4,3,dark);r(20,10,3,4,dark);}
    if(f.style==='melon'){[14,19,24].forEach(x=>r(x,8,2,10,'#347b55'));r(12,18,16,3,'#f5a6a3');r(16,19,1,1,dark);r(22,19,1,1,dark);}
    if(f.style==='lantern'){r(22,1,2,7,dark);r(24,1,6,2,dark);r(28,2,2,4,dark);r(27,4,5,4,'#f8d879');r(28,5,3,2,'#fff7ba');r(11,10,4,4,light);}
    if(f.style==='galaxy'){[[14,10],[19,14],[22,8],[15,17],[26,17]].forEach(([x,y])=>{r(x,y,1,3,'#f5e5a9');r(x-1,y+1,3,1,'#f5e5a9');});r(4,10,2,2,light);r(3,17,2,2,light);}
    if(f.style==='crown'){r(14,1,2,6,'#d9ad42');r(19,0,2,7,'#d9ad42');r(24,1,2,6,'#d9ad42');r(14,5,12,3,'#edc850');r(18,5,3,2,'#d26566');r(3,8,3,14,body);}
    if(f.style==='dragon'){r(12,1,3,7,'#d9b56b');r(11,0,2,3,'#d9b56b');r(22,1,3,7,'#d9b56b');r(25,0,2,3,'#d9b56b');r(30,16,5,1,dark);r(34,17,3,1,dark);r(12,20,2,5,body);r(23,20,2,5,body);r(7,9,2,8,light);r(16,12,2,2,light);}
    if(f.style==='cosmic'){r(8,6,24,1,'#a285c1');r(6,8,1,13,'#a285c1');r(33,8,1,13,'#a285c1');r(8,23,24,1,'#a285c1');r(4,20,8,2,'#eccb65');r(28,4,9,2,'#eccb65');r(16,11,3,1,light);r(21,14,2,2,light);}
    if(!silhouette){r(25,11,5,5,'#fffdf2');r(27,12,2,3,dark);r(29,17,2,1,dark);r(23,16,2,1,'#e89591');if(f.style==='worker'||f.style==='cosmic')r(24,11,7,2,body);}
    c.restore();
  }

  function scene(canvas, getPhase, getCharacter=()=> 'male', getMotion=()=>null, getLocation=()=> 'pond') {
    const c=canvas.getContext('2d');let tick=0,last=0,alive=true;
    function fitResolution(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const scale=Math.min(3,Math.max(1,Math.max(w/480,h/420)*Math.min(window.devicePixelRatio||1,2))),pw=Math.round(480*scale),ph=Math.round(420*scale);if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}canvas.dataset.renderScale=scale.toFixed(2);}
    const resolutionObserver=new ResizeObserver(fitResolution);resolutionObserver.observe(canvas);fitResolution();
    function r(x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
    function poly(points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
    function cloud(x,y){r(x+8,y,28,6,'#f6f8dc');r(x,y+6,50,7,'#f6f8dc');r(x+7,y+13,38,3,'#d9e8d6');}
    function tree(x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);r(-3,4,6,43,'#697955');r(-19,0,38,25,'#5d946d');r(-25,8,50,12,'#5d946d');r(-15,-10,30,14,'#76aa78');r(-9,-17,18,10,'#8db57c');r(-21,15,12,8,'#528567');r(5,2,13,7,'#84b57b');c.restore();}
    function draw(t){if(!alive)return;if(!canvas.clientWidth||!canvas.clientHeight){requestAnimationFrame(draw);return;}if(t-last<(getMotion()&&(performance.now()-getMotion().started)<getMotion().duration*1.5?16:(quietMotion?120:50))){requestAnimationFrame(draw);return;}last=t;tick=t/1000;c.setTransform(canvas.width/480,0,0,canvas.height/420,0,0);const phase=getPhase();const fishing=['waiting','bite','question','feedback','reeling'].includes(phase);c.imageSmoothingEnabled=false;if(generatedScene(c,phase,getCharacter(),tick,getMotion(),getLocation())){requestAnimationFrame(draw);return;}
      r(0,0,480,420,'#b8ddcc');r(0,0,480,65,'#d0e8d1');r(0,64,480,40,'#b2d5bd');
      r(354,23,24,24,'#f3e6a0');r(360,17,12,36,'#f3e6a0');r(348,29,36,12,'#f3e6a0');
      cloud(45+Math.floor(tick/12)%10,29);cloud(247,48);cloud(400,70);
      poly([[0,107],[35,80],[73,99],[115,62],[169,106],[205,78],[256,109],[315,73],[370,111],[417,89],[480,113],[480,167],[0,167]],'#93b99b');
      poly([[0,132],[56,109],[95,135],[151,111],[211,143],[282,117],[334,141],[402,114],[480,137],[480,181],[0,181]],'#76a88b');
      r(0,151,480,269,'#86bbae');r(0,152,480,7,'#b4d1a4');r(0,159,480,6,'#639a7e');r(0,166,480,5,'#77ab8d');
      r(0,201,480,219,'#80b5a7');r(0,265,480,155,'#76ad9d');r(0,338,480,82,'#6fa595');
      for(let i=0;i<38;i++){let x=(i*73+17)%480,y=179+(i*37)%230,shift=Math.floor(Math.sin(tick*.7+i)*3);r(x+shift,y,12+(i%4)*5,1,i%3===0?'#bbd5b8':'#96c4ae');if(i%4===0)r(x+shift+8,y+3,9,1,'#88bba5');}
      // Far bank with pixel reeds and a tiny hut.
      r(35,143,74,8,'#9aba80');r(45,136,58,8,'#b5cd8f');tree(56,117,.72);tree(100,124,.57);tree(423,126,.68);tree(458,113,.9);
      r(297,133,42,22,'#c2b486');r(302,134,32,20,'#e6d4a4');poly([[290,134],[312,112],[323,112],[346,134]],'#657f70');r(307,140,8,14,'#83907a');r(324,140,5,6,'#a2b49a');r(313,109,7,7,'#a4a488');
      // Banks frame the player without blocking the water.
      poly([[0,292],[28,306],[35,333],[59,351],[65,420],[0,420]],'#689474');poly([[480,278],[453,288],[445,320],[425,337],[420,420],[480,420]],'#5e8e70');
      poly([[0,306],[18,313],[28,341],[47,363],[48,420],[0,420]],'#a9c782');poly([[480,294],[462,305],[460,330],[442,354],[440,420],[480,420]],'#a0be7b');
      for(let i=0;i<16;i++){let side=i%2===0,x=side?6+(i*13)%28:449+(i*7)%25,y=320+(i*19)%90;r(x,y-8,2,12,'#668e5c');r(x-3,y-4,3,2,'#668e5c');if(i%3===0){r(x-2,y-11,6,4,'#ead58a');r(x,y-12,2,7,'#ead58a');}}
      // Water lilies, fish shadows and one highly unproductive duck.
      [[74,226],[103,238],[388,286],[405,300],[88,312]].forEach(([x,y],i)=>{r(x,y,19,5,'#649979');r(x+4,y-2,12,8,'#649979');r(x+10,y,2,4,'#80b5a7');if(i===2){r(x+5,y-5,6,5,'#efc6be');r(x+7,y-7,2,7,'#f2d9ca');}});
      const dx=137+Math.floor(Math.sin(tick/4)*7),dy=183+Math.floor(Math.sin(tick*1.3));r(dx,dy,18,8,'#f3e7b6');r(dx+12,dy-6,8,10,'#fff1c5');r(dx+20,dy-1,5,3,'#ce9d51');r(dx+17,dy-4,1,2,'#426053');r(dx-3,dy+10,28,1,'#bdd3b5');
      [[120,274],[376,216]].forEach(([x,y],i)=>{x+=Math.floor(Math.sin(tick/3+i)*10);r(x,y,17,4,'#6da894');r(x-3,y-2,3,8,'#6da894');});
      // Wooden dock and the rear-facing pixel angler.
      r(202,319,79,101,'#4d7d67');r(192,308,88,112,'#a78459');r(198,307,76,113,'#d6b17a');
      for(let y=313;y<420;y+=14){r(198,y,76,2,'#ad8757');r(205,y+5,2,2,'#ba9564');r(266,y+5,2,2,'#ba9564');}r(191,312,6,108,'#936f4c');r(275,312,5,108,'#936f4c');
      r(208,339,55,8,'#6b654b');r(211,347,5,17,'#726344');r(255,347,5,17,'#726344');
      const female=getCharacter()==='female';
      const bob=0;
      r(217,326+bob,15,16,'#385b61');r(239,326+bob,15,16,'#385b61');r(215,339+bob,17,5,'#344d51');r(240,339+bob,17,5,'#344d51');
      r(211,287+bob,48,40,'#557b67');r(215,282+bob,40,43,(female?'#c7a5c0':'#a6c277'));r(218,291+bob,34,35,(female?'#dbc3d4':'#b9cf89'));r(221,304+bob,28,22,(female?'#a78b9e':'#8ba56c'));r(225,307+bob,20,14,(female?'#c7afbb':'#a9bd7d'));r(216,289+bob,5,36,(female?'#887383':'#638460'));r(250,289+bob,5,36,(female?'#887383':'#638460'));
      r(203,295+bob,12,19,(female?'#c7a5c0':'#a6c277'));r(256,294+bob,12,17,(female?'#c7a5c0':'#a6c277'));r(259,306+bob,11,6,'#e7bb8c');
      r(218,265+bob,34,20,'#d3a878');r(215,265+bob,40,10,'#4c5b4b');r(219,274+bob,32,6,'#52604c');r(222,278+bob,26,8,'#5b674c');if(female){r(215,274+bob,8,23,'#4c5b4b');r(212,292+bob,10,14,'#4c5b4b');r(253,274+bob,8,23,'#4c5b4b');r(256,292+bob,10,14,'#4c5b4b');r(214,286+bob,9,3,'#d7b465');r(253,286+bob,9,3,'#d7b465');}
      r(211,249+bob,48,21,(female?'#93718c':'#487887'));r(217,242+bob,36,12,(female?'#b28da7':'#64959b'));r(207,261+bob,58,8,(female?'#72536c':'#355b65'));r(213,261+bob,46,4,(female?'#c39db5':'#78a4a1'));r(223,244+bob,23,3,(female?'#d5b4c6':'#87b3a7'));
      c.strokeStyle='#686141';c.lineWidth=3;c.beginPath();c.moveTo(267,306+bob);const fallbackTip=FishingCore.rodTip([267,306+bob],[fishing?326:308,fishing?220:207]);c.lineTo(...fallbackTip);c.stroke();c.strokeStyle='#d9d9b0';c.lineWidth=1;c.beginPath();c.moveTo(...fallbackTip);c.lineTo(fishing?342:318,fishing?262:239);c.stroke();
      if(fishing){const fy=262+(phase==='bite'?Math.round(Math.sin(tick*18)*2):Math.floor(Math.sin(tick*2)));r(339,fy-6,5,6,'#e98467');r(339,fy,5,4,'#f3e9b9');r(332,fy+7,19,1,'#d3dfbd');r(335,fy+9,13,1,'#a7cdb3');if(phase==='bite'){r(325,fy-3,3,3,'#e5eed1');r(354,fy-7,3,3,'#e5eed1');}}
      // A bait bucket and field notebook.
      r(166,359,18,18,'#526c5d');r(164,357,22,4,'#c1c9a0');r(169,361,12,12,'#9ba984');r(283,374,15,19,'#f4deb1');r(286,378,9,1,'#aeab83');r(286,382,9,1,'#aeab83');r(286,386,6,1,'#aeab83');
      requestAnimationFrame(draw);
    }requestAnimationFrame(draw);return()=>{alive=false;resolutionObserver.disconnect();};
  }
  function diagram(kind) {
    if(kind==='axes')return `<svg class="geometry" viewBox="0 0 340 180" role="img" aria-label="三維直角坐標系，原點 O，坐標軸 x、y、z"><defs><marker id="axis-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#72916d"/></marker></defs><g stroke="#72916d" stroke-width="1.5" marker-end="url(#axis-arrow)"><path d="M155 115L65 155"/><path d="M155 115L285 115"/><path d="M155 115L155 20"/></g><g><text x="137" y="132">O</text><text x="49" y="163">x</text><text x="291" y="120">y</text><text x="162" y="25">z</text></g><g fill="#6d9367"><circle cx="155" cy="115" r="3"/></g></svg>`;
    return `<svg class="geometry" viewBox="0 0 340 190" role="img" aria-label="正方體 ABCD–A₁B₁C₁D₁：前面為 ABB₁A₁，後面為 DCC₁D₁，虛線表示隱藏邊"><g fill="none" stroke="#779074" stroke-width="1.6"><path d="M95 153L221 153L221 59L95 59Z"/><path d="M95 59L147 25L273 25L273 119L221 153M221 59L273 25"/><path d="M95 153L147 119L273 119M147 119L147 25" stroke-dasharray="5 4"/></g><g fill="#fbfef3" stroke="#779074"><circle cx="95" cy="153" r="2.5"/><circle cx="221" cy="153" r="2.5"/><circle cx="273" cy="119" r="2.5"/><circle cx="147" cy="119" r="2.5"/></g><g><text x="78" y="173">A</text><text x="224" y="173">B</text><text x="281" y="125">C</text><text x="132" y="116">D</text><text x="72" y="56">A₁</text><text x="220" y="54">B₁</text><text x="279" y="26">C₁</text><text x="132" y="22">D₁</text></g></svg>`;
  }
  root.FishingArt={fish,scene,diagram};
})(window);
