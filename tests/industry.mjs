import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assess,assessRecords,statusLabels,applicationScope} from '../src/industryResearch.js';
import {top100} from '../src/top100.js';
import market from '../src/marketEvidence.json' with {type:'json'};
for(const s of top100)for(const region of ['cn','global']){
 const a=assess(s.id,region);assert.ok(statusLabels[a.status]);assert.ok(a.records.every(r=>r.marketRegion===region));
 assert.equal(a.groups.length,a.fullGroups.length+a.partialGroups.length);
 assert.ok(applicationScope(s).zh&&applicationScope(s).en);
 if(a.status==='multiple')assert.ok(a.groups.length>=3&&a.groups.length<5);
 if(a.status==='common')assert.ok(a.groups.length>=5);
}
assert.equal(assess('TOP-018','cn').groups.length,6);
assert.equal(assess('TOP-038','cn').status,'common');
assert.equal(assess('TOP-038','global').status,'common');
for(const region of ['cn','global']){const a=assess('TOP-001',region);assert.deepEqual(a.groups.map(g=>g.id),['nio']);assert.equal(a.complete,false);}
assert.equal(assess('TOP-001','global').pendingGroups.length,2);
assert.ok(!assess('TOP-001','global').groups.some(g=>g.id==='tesla'));
const row=(oemId,match='partial',status='provided',marketRegion='cn',extra={})=>({oemId,brand:oemId,match,status,marketRegion,...extra});
// Same group, multiple models/brands, regions and publication stages must not inflate adoption.
const fixture=[row('byd'),row('denza'),row('byd','full'),row('nio'),row('nio','related'),row('hyundai','partial','announced'),row('vw','partial','provided','cn',{researchStage:'prototype'}),row('tesla','partial','provided','global')];
const a=assessRecords(fixture,'cn');assert.equal(a.groups.length,2);assert.equal(a.fullGroups.length,1);assert.equal(a.partialGroups.length,1);assert.equal(a.pendingGroups.length,2);assert.equal(a.status,'few');
assert.equal(assessRecords([1,2,3,4].map(n=>row('oem'+n)),'cn').status,'multiple');
assert.equal(assessRecords([1,2,3,4,5].map(n=>row('oem'+n)),'cn').status,'common');
assert.equal(assessRecords([row('nio','related')],'cn').status,'related');
for(const records of Object.values(market))for(const r of records){assert.ok(['cn','global'].includes(r.marketRegion));assert.ok(r.oemId&&r.boundary&&r.source);}
const main=readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8'),dialog=readFileSync(new URL('../src/Industry.jsx',import.meta.url),'utf8');
assert.ok(!main.includes('编辑我的版本'));assert.ok(!main.includes('marketFor(s.id)'));assert.ok(main.includes('<IndustrySummary'));
assert.ok(!main.includes('行业全景'));assert.ok(!dialog.includes('coverage.groups'));assert.ok(!dialog.includes('主流OEM总体情况'));
console.log('PASS: 100 scene-specific regional assessments; OEM deduplication; full/partial/related/pilot separation; evidence-based stage thresholds; no repeated industry tables');
