import fs from 'node:fs';
import path from 'node:path';
import { buildArtifacts, loadLessons, root } from './project.mjs';
for(const [file,content] of Object.entries(buildArtifacts())){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),content);}
console.log(`Built ${loadLessons().length} lessons. Static output: index.html, assets/app.js, assets/app.css.`);
