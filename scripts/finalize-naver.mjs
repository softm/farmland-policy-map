import {readFile,writeFile} from 'node:fs/promises';
let app=await readFile('src/app.js','utf8');
// Callback replacements preserve literal $$; the lookbehind makes this repair idempotent.
app=app.replace(/(?<!\$)\$\('\[data-map-type\]'\)\.forEach/g,()=>"$$('[data-map-type]').forEach");
if(/(?<!\$)\$\([^)]*\)\.forEach/.test(app))throw Error('Single-element selector cannot use forEach');
if(!app.includes("dataset.recordsReady='true'")){
 const needle="state.parcels.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));render();}";
 if(!app.includes(needle))throw Error('Missing hydration anchor');
 app=app.replace(needle,"state.parcels.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));render();document.body.dataset.recordsReady='true';}");
}
await writeFile('src/app.js',app);
let test=await readFile('tests/browser_smoke.py','utf8');
if(!test.includes('Waiting for restored records')){
 test=test.replace("page.reload(wait_until='networkidle')","page.reload(wait_until='networkidle')\n    print('Waiting for restored records; page errors:',errors)\n    page.wait_for_function(\"document.body.dataset.recordsReady === 'true'\",timeout=15000)\n    print('Restored count:',page.locator('#count-total').inner_text())");
 test=test.replace("page.on('pageerror',lambda e: errors.append(str(e)))","page.on('pageerror',lambda e: (errors.append(str(e)),print('BROWSER ERROR:',str(e))))");
}
if(!test.includes('# Initial data hydration'))test=test.replace("    assert page.title().startswith('농지안심맵')","    # Initial data hydration must finish before taking screenshots or editing.\n    page.wait_for_function(\"document.body.dataset.recordsReady === 'true'\",timeout=15000)\n    assert page.title().startswith('농지안심맵')");
await writeFile('tests/browser_smoke.py',test);
let css=await readFile('assets/naver-ui.css','utf8');if(!css.includes('attribution clearance')){css+='\n/* Naver attribution clearance */\n.map-help{bottom:44px}\n@media(max-width:1000px){.map-help{bottom:44px}}\n';await writeFile('assets/naver-ui.css',css);}
