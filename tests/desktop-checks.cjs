// Called by run-desktop.mjs or an existing Playwright session. No test mocks/routes.
module.exports = async function checkDesktop(page, url) {
  const errors=[],warnings=[],failedRequests=[];
  const onError=e=>errors.push(e.message);
  const onConsole=m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());};
  const onRequest=r=>failedRequests.push(`${r.method()} ${r.url()} ${r.failure()?.errorText}`);
  page.on('pageerror',onError);page.on('console',onConsole);page.on('requestfailed',onRequest);
  const ok=(v,m)=>{if(!v)throw Error(m);};
  const state=()=>page.evaluate(()=>window.crystalDebug.snapshot());
  const checks=[];
  try {
    await page.setViewportSize({width:1280,height:900});
    const response=await page.goto(url,{waitUntil:'networkidle'});
    ok(response.status()===200,'Published page HTTP 200');
    await page.waitForFunction(()=>window.crystalDebug?.snapshot().instances>0);
    checks.push({geometry:await page.evaluate(async()=> (await import(new URL('./tests/geometry-checks.js',location.href).href)).checkGeometry())});
    for(const type of ['sc','bcc','fcc']){
      await page.getByLabel('Crystal structure',{exact:true}).selectOption(type);
      await page.getByRole('slider').focus();await page.keyboard.press('Home');
      for(let n=1;n<=5;n++){
        if(n>1)await page.keyboard.press('ArrowRight');
        const s=await state(), expected=(n+1)**3+(type==='bcc'?n**3:type==='fcc'?3*n*n*(n+1):0);
        ok(s.repeat===n&&s.instances===expected&&s.visibleAtoms===expected,`${type}/${n} render count`);
        ok((await page.locator('#counts').textContent()).includes(`${expected} unique`),`${type}/${n} count label`);
      }
      checks.push(`${type}: repeats 1–5`);
    }
    for(const axis of ['X','Y','Z']){
      const key=axis.toLowerCase(),before=await state();
      await page.getByRole('button',{name:`Rotate ${axis} plus 15 degrees`,exact:true}).click();
      ok(Math.abs((await state())[key]-before[key]-Math.PI/12)<1e-8,`${axis}+`);
      await page.getByRole('button',{name:`Rotate ${axis} minus 15 degrees`,exact:true}).click();
      ok(Math.abs((await state())[key]-before[key])<1e-8,`${axis}-`);
    }
    await page.getByRole('button',{name:'Scale up',exact:true}).click();ok((await state()).scale>1,'Scale up');
    await page.getByRole('button',{name:'Scale down',exact:true}).click();ok(Math.abs((await state()).scale-1)<1e-8,'Scale down');
    const box=await page.locator('canvas').boundingBox();
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
    await page.mouse.move(box.x+box.width/2+70,box.y+box.height/2+30,{steps:5});await page.mouse.up();
    ok((await state()).y!==-0.4,'Mouse drag');await page.mouse.wheel(0,-300);await page.waitForTimeout(150);ok((await state()).scale>1,'Wheel scale');
    await page.mouse.wheel(0,-100000);await page.waitForTimeout(150);ok((await state()).scale===1.8,'Upper scale bound');
    await page.mouse.wheel(0,100000);await page.waitForTimeout(150);ok((await state()).scale===0.4,'Lower scale bound');
    await page.getByRole('button',{name:'Reset view',exact:true}).focus();await page.keyboard.press('Enter');
    const reset=await state();ok(reset.type==='fcc'&&reset.repeat===5&&reset.scale===1&&reset.x===.25&&reset.y===-.4&&reset.z===0,'Keyboard reset preserves structure/repeat');
    checks.push('6 axis buttons; size buttons; drag; wheel; bounds; keyboard reset');
    const vr=await page.evaluate(()=>{
      const b=[...document.querySelectorAll('#vr-menu .vr-button')];
      b[0].emit('click');b[2].emit('click');b[1].emit('click');b[4].emit('click');b[10].emit('click');b[11].emit('click');
      return {buttons:b.length,state:crystalDebug.snapshot(),hands:['left-hand','right-hand'].map(id=>document.getElementById(id).getAttribute('raycaster').objects)};
    });
    ok(vr.buttons===12&&vr.state.type==='sc'&&vr.state.repeat===4&&vr.hands.every(x=>x==='.vr-button'),'VR menu logical wiring');
    checks.push('VR menu events and both raycaster selectors ONLY, no XR hardware simulation');
    for(let i=0;i<40;i++)await page.getByLabel('Crystal structure',{exact:true}).selectOption(['sc','bcc','fcc'][i%3]);
    await page.waitForTimeout(100);
    const memory=await page.evaluate(()=>({geometries:document.querySelector('a-scene').renderer.info.memory.geometries,drawCalls:crystalDebug.snapshot().drawCalls}));
    ok(memory.geometries===2&&memory.drawCalls===2,'Bounded renderer geometry and calls');checks.push({after40Rebuilds:memory});
    await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo(0,0));
    const client=await page.context().newCDPSession(page);
    try {
      await client.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
      const rect=await page.locator('canvas').boundingBox(), x=Math.round(rect.x+rect.width/2), y=Math.round(rect.y+rect.height/2);
      const touch=(type,touchPoints)=>client.send('Input.dispatchTouchEvent',{type,touchPoints});
      const before=await state();
      await touch('touchStart',[{x,y,id:1}]);await touch('touchMove',[{x:x+50,y:y+20,id:1}]);await touch('touchEnd',[]);
      const drag=await state();ok(drag.y!==before.y,'Touch drag');
      await touch('touchStart',[{x:x-40,y,id:1},{x:x+40,y,id:2}]);await touch('touchMove',[{x:x-65,y,id:1},{x:x+65,y,id:2}]);await touch('touchEnd',[]);
      ok((await state()).scale>drag.scale,'Touch pinch');
      ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'No horizontal mobile overflow');
      await page.getByRole('button',{name:'Reset view',exact:true}).click();ok((await state()).scale===1,'Mobile reset');
      checks.push('390×844 Chromium/CDP touch: drag, pinch, reset, no horizontal overflow (not iOS Safari)');
    } finally {await client.send('Emulation.setTouchEmulationEnabled',{enabled:false});await client.detach();}
    await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>window.scrollTo(0,0));
    ok(errors.length===0,'Browser errors: '+errors.join('; '));ok(failedRequests.length===0,'Failed requests: '+failedRequests.join('; '));
    return {url:page.url(),checks,errors,failedRequests,warnings};
  } finally {page.off('pageerror',onError);page.off('console',onConsole);page.off('requestfailed',onRequest);}
};
