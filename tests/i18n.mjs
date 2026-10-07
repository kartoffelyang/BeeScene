import assert from 'node:assert/strict';
import fs from 'node:fs';
import {t,setLanguage,getLanguage} from '../src/i18n.js';
import {top100,needDimensions,needNotes,aiDimensions,vehicleDimensions,rankingPrinciples} from '../src/top100.js';
import {getHAIDesign,haiPatterns,haiRules} from '../src/haiDesign.js';
import {investmentCards} from '../src/investmentCards.js';
import {briefCases,dimensions,evidenceTypes} from '../src/decisionEvidence.js';
setLanguage('en');assert.equal(getLanguage(),'en');
function check(x){if(typeof x==='string')assert.ok(!/[\u4e00-\u9fff]/.test(t(x)),`Missing translation: ${x}`);else if(Array.isArray(x))x.forEach(check);else if(x&&typeof x==='object')Object.values(x).forEach(check);}
check([top100,needDimensions,needNotes,aiDimensions,vehicleDimensions,rankingPrinciples,haiPatterns,haiRules,briefCases,dimensions,evidenceTypes]);
for(const s of top100){const {example,...rest}=getHAIDesign(s);check(rest);}
for(const d of Object.values(investmentCards))check({role:d.role,decision:d.decision,product:d.product,audience:d.audience,baseline:d.baseline,experiment:d.experiment,gates:d.gates,capability:d.capability,costs:d.costs});
assert.notEqual(t(top100[0].name),top100[0].name);setLanguage('zh');assert.equal(t(top100[0].name),top100[0].name);
const source=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');assert.ok(!source.includes('download(top100)'));assert.ok(!source.includes('download()'));assert.ok(source.includes('items.length!==1'));console.log('PASS: bilingual coverage of all 100 scenarios, HAI patterns and flows, decision cards; bulk export entry points removed.');
