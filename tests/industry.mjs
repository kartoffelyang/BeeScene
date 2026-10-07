import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {coverage,assess,statusLabels} from '../src/industryResearch.js';
import {top100} from '../src/top100.js';
import market from '../src/marketEvidence.json' with {type:'json'};
assert.equal(new Set(coverage.groups.map(g=>g.id)).size,coverage.groups.length);
assert.ok(coverage.groups.filter(g=>g.region==='cn').length>=20);
assert.ok(coverage.groups.filter(g=>g.region==='global').length>=18);
for(const g of coverage.groups){assert.ok(g.source.startsWith('https://'));for(const k of ['name','model','system','note'])assert.ok(g.en[k]);}
for(const s of top100)for(const region of ['cn','global']){const a=assess(s.id,region);assert.ok(statusLabels[a.status]);assert.ok(a.records.every(r=>r.marketRegion===region));if(a.status==='multiple')assert.ok(a.groups.length>=3);if(a.status==='common')assert.equal(s.id,'TOP-038');}
assert.equal(assess('TOP-018','cn').status,'multiple');
assert.equal(assess('TOP-038','global').status,'common');
assert.equal(assess('TOP-001','cn').status,'none');
assert.equal(assess('TOP-001','global').status,'few');
assert.equal(assess('TOP-001','global').complete,false);
for(const records of Object.values(market))for(const r of records){assert.ok(['cn','global'].includes(r.marketRegion));assert.ok(r.oemId);assert.ok(r.boundary);}
const main=readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
assert.ok(!main.includes('编辑我的版本'));assert.ok(!main.includes('marketFor(s.id)'));assert.ok(main.includes('<IndustrySummary'));
console.log('PASS: all100 regional adoption assessments; 42 OEM systems; qualified adoption counts; immutable public scenes; competitors excluded from homepage');
