import {rm,mkdir,cp,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of ['index.html','assets','src','sw.js','manifest.webmanifest'])await cp(file,'dist/'+file,{recursive:true});
await writeFile('dist/.nojekyll','');
await writeFile('dist/build.json',JSON.stringify({app:'farmland-policy-map',version:'0.1.0',commit:process.env.GITHUB_SHA||'local',builtAt:new Date().toISOString()}));
console.log('Static site built: dist/');
