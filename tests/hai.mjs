import assert from 'node:assert/strict';
import {top100,exportPayload} from '../src/top100.js';
import {getHAIDesign,haiPatterns,haiRules,haiVersion} from '../src/haiDesign.js';
const designs=top100.map(getHAIDesign);
assert.equal(designs.length,100);
assert.equal(new Set(designs.map(d=>d.steps[1].design)).size,100,'Each concept needs its own interaction');
assert.equal(new Set(designs.map(d=>d.branches[0].design)).size,100,'Each concept needs its own failure path');
for(const d of designs){
 assert.equal(d.steps.length,5);assert.equal(d.branches.length,3);assert.equal(d.version,haiVersion);
 for(const row of [...d.steps,...d.branches]){
  assert.ok(row.node&&row.design&&row.mechanisms.length);
  for(const m of row.mechanisms){assert.ok(haiPatterns[m.id],m.id);assert.ok(m.why);}
 }
}
for(const p of Object.values(haiPatterns)) for(const rule of p.rules) assert.ok(haiRules[rule],`${p.id} missing ${rule}`);
assert.ok(getHAIDesign(top100[0]).steps[2].mechanisms.some(m=>m.id==='P10'));
assert.ok(getHAIDesign(top100[5]).steps[1].mechanisms.some(m=>m.id==='P06'));
assert.ok(getHAIDesign(top100[16]).steps[2].mechanisms.some(m=>m.id==='P14'));
const exportData=JSON.parse(JSON.stringify(exportPayload(top100)));
assert.equal(exportData.scenarios.length,100);assert.ok(exportData.scenarios.every(s=>s.haiDesign.steps.length===5));
console.log('PASS: 100 specific designs, 800 decision nodes/branches, valid P/R references, physical/multi/memory boundaries, complete export');
