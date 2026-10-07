import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scenarios,filterCountries,patentsFor,sceneExport} from '../src/scenarios.js';
import {getHAIDesign} from '../src/haiDesign.js';
import {t,setLanguage} from '../src/i18n.js';
import {assess,assessRecords,industryReview} from '../src/industryResearch.js';
const de=filterCountries(scenarios,['DE']);
assert.equal(scenarios.length,127);assert.equal(de.length,19);
assert.ok(scenarios.slice(0,108).every(s=>!s.country));
assert.equal(de.filter(s=>s.sceneDomain==='cabinDriving').length,7);
assert.equal(de.filter(s=>s.ai.includes('perception')).length,18);
assert.equal(de.filter(s=>patentsFor(s.id).length).length,3);
assert.deepEqual(filterCountries(scenarios),scenarios);
const fields=['localContext','visualTargets','dependencies','failureBoundary','audience','aiContribution','validation','deployment','costs','valueHypothesis','decisionGates','differentiation','patentReview'];
setLanguage('en');
for(const s of de){
 for(const f of fields){assert.equal(s.research[f].length,2);assert.ok(s.research[f].every(v=>typeof v==='string'&&v.length>10));assert.ok(!/[\u4e00-\u9fff]/.test(s.research[f][1]));}
 for(const r of s.research.sources)assert.equal(new URL(r.url).protocol,'https:');
 for(const text of [...getHAIDesign(s).steps,...getHAIDesign(s).branches].map(x=>x.design))assert.ok(!/[\u4e00-\u9fff]/.test(t(text)),`Missing HAI English ${s.id}: ${t(text)}`);
 assert.ok(industryReview(s.id,'de').noteEn);
 if(!process.env.SKIP_IMAGES)assert.ok(fs.statSync(new URL(`../public/scenario-images/${s.id.toLowerCase()}-v1.webp`,import.meta.url)).size>20000);
}
assert.equal(assess('DE-001','de').groups.length,1);
assert.equal(assess('DE-002','de').groups.length,0,'An electronic parking disc is not an adopting OEM');
assert.equal(assess('DE-004','de').groups.length,0,'Charging service is not an adopting OEM');
assert.equal(assess('DE-012','de').status,'related');
assert.equal(assess('DE-016','de').groups.length,1);
assert.equal(assess('DE-006','de').groups.length,0);assert.equal(assess('DE-006','de').historicalGroups.length,1);
assert.equal(assess('DE-018','de').status,'related');
const row={brand:'Test',oemId:'test',marketRegion:'global',match:'partial',status:'provided'};
assert.equal(assessRecords([row,{...row,country:'US'}],'de').groups.length,0);
assert.equal(assessRecords([{...row,country:'DE'},{...row,country:'DE'}],'de').groups.length,1);
assert.equal(sceneExport(de).scenarios.length,19);
setLanguage('zh');
console.log('PASS: 19 Germany-only additions; complete bilingual analyses and HAI; country intersections; German evidence boundaries; patent associations; artwork.');
