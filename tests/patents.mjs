import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scenarios,patentsFor,patentEvidence,domainLabels,sceneExport} from '../src/scenarios.js';
import {top100} from '../src/top100.js';
import {getHAIDesign} from '../src/haiDesign.js';
import {t,setLanguage} from '../src/i18n.js';
import {assess} from '../src/industryResearch.js';
const additions=scenarios.filter(s=>s.sourceType==='patent');
assert.equal(top100.length,100);
assert.ok(additions.length>0);assert.equal(scenarios.length,top100.length+additions.length+scenarios.filter(s=>s.country==='DE').length);
assert.equal(new Set(scenarios.map(s=>s.id)).size,scenarios.length);
assert.deepEqual(scenarios.slice(0,100).map(s=>[s.id,s.rank,s.summary]),top100.map(s=>[s.id,s.rank,s.summary]));
assert.equal(new Set(patentEvidence.map(p=>p.number)).size,patentEvidence.length);
for(const p of patentEvidence){
 assert.match(p.number,/^(CN|US|WO)\d+[AB]\d?$/);
 assert.ok(['application','grant'].includes(p.documentType));
 assert.equal(p.documentType,/B\d?$/.test(p.number)?'grant':'application');
 assert.ok(p.filingDate<=p.publicationDate&&p.publicationDate<='2026-10-07');
 assert.ok(new URL(p.source).protocol==='https:');
 assert.ok(p.title&&p.summary&&p.scope&&p.applicant&&p.en.title&&p.en.summary&&p.en.scope&&p.en.applicant);
 for(const id of p.sceneIds)assert.ok(scenarios.some(s=>s.id===id),`Orphan patent relationship: ${id}`);
}
setLanguage('en');
for(const s of scenarios){
 assert.ok(domainLabels[s.sceneDomain]);assert.ok(s.domainReason);
 for(const k of ['name','summary','outcome','baseline','question','domainReason'])assert.ok(!/[\u4e00-\u9fff]/.test(t(s[k])),`Missing English ${s.id}.${k}`);
 const d=getHAIDesign(s);assert.equal(d.steps.length,5);assert.equal(d.branches.length,3);
 if(s.sourceType==='patent'){
  assert.ok(patentsFor(s.id).length);
  assert.ok(['cn','global'].every(region=>assess(s.id,region).records.every(r=>r.source&&!r.source.includes('patents.google')&&!r.source.includes('patsnap'))),'Patent records must not create production adoption');
  for(const text of [...d.steps,...d.branches].map(x=>x.design))assert.ok(!/[\u4e00-\u9fff]/.test(t(text)),`Missing HAI English ${s.id}: ${t(text)}`);
  const data=sceneExport([s]);assert.equal(data.scenarios.length,1);assert.ok(data.scenarios[0].patents.length);assert.equal(data.scenarios[0].sceneDomain,s.sceneDomain);
 }
}
assert.equal(scenarios.find(s=>s.id==='TOP-010').sceneDomain,'cabinDriving');
assert.equal(scenarios.find(s=>s.id==='TOP-015').sceneDomain,'cabin','Game controls alone are not driving integration');
assert.equal(scenarios.find(s=>s.id==='PAT-007').sceneDomain,'cabinDriving');
assert.equal(scenarios.find(s=>s.id==='PAT-006').sceneDomain,'cabin','A parked cabin robot is not a driving controller');
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
for(let number=101;number<=108;number++){
 assert.ok(fs.statSync(new URL(`../public/scenario-images/scene-${number}-v1.webp`,import.meta.url)).size>20000,`Missing scene artwork ${number}`);
}
assert.ok(main.includes('PatentBadge')&&main.includes('PatentDialog')&&main.includes('setDomains'));
assert.ok(!main.includes('filterScenes(top100'));
setLanguage('zh');
console.log(`PASS: ${scenarios.length} scenarios, ${patentEvidence.length} patent records, ${additions.length} additions; complete bilingual HAI, domain classification, immutable TOP100 and patent/adoption separation.`);
