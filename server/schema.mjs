export const needs=['security','ease','comfort','delight','expression'];
export const ai=['perception','intent','memory','planning','creation','emotion','execution','embodiment'];
export const vehicle=['presence','movement','perception','space','continuity','motion','external','integration','ecosystem'];
export const fields=['name','summary','outcome','baseline','question','horizon','autonomyMode'];
const string={type:'string'};
export const schema={type:'object',additionalProperties:false,properties:{...Object.fromEntries(fields.map(k=>[k,string])),primaryNeed:{type:'string',enum:needs},secondaryNeed:{type:['string','null'],enum:[...needs,null]},ai:{type:'array',items:{type:'string',enum:ai}},vehicle:{type:'array',items:{type:'string',enum:vehicle}},tags:{type:'array',items:string},interaction:{type:'array',items:string},en:{type:'object',additionalProperties:false,properties:Object.fromEntries(fields.map(k=>[k,string])),required:fields}},required:[...fields,'primaryNeed','secondaryNeed','ai','vehicle','tags','interaction','en']};
export function validateScene(s){
 if(!s||typeof s!=='object'||Array.isArray(s))throw Error('场景格式无效');
 const out={};for(const k of fields){if(typeof s[k]!=='string'||!s[k].trim()||s[k].length>4000)throw Error(`请填写 ${k}（最多4000字）`);out[k]=s[k].trim();}
 if(!needs.includes(s.primaryNeed))throw Error('主需求无效');out.primaryNeed=s.primaryNeed;
 if(s.secondaryNeed!=null&&!needs.includes(s.secondaryNeed))throw Error('次需求无效');out.secondaryNeed=s.secondaryNeed||null;
 for(const [k,allowed] of [['ai',ai],['vehicle',vehicle]]){if(!Array.isArray(s[k])||!s[k].length||s[k].some(x=>!allowed.includes(x)))throw Error(`${k} 维度无效`);out[k]=[...new Set(s[k])];}
 for(const k of ['tags','interaction']){if(!Array.isArray(s[k])||s[k].length>16||s[k].some(x=>typeof x!=='string'||x.length>2000))throw Error(`${k} 格式无效`);out[k]=s[k];}
 out.en={};for(const k of fields){if(s.en?.[k]!=null&&(typeof s.en[k]!=='string'||s.en[k].length>4000))throw Error('英文格式无效');out.en[k]=s.en?.[k]||'';}
 if(!Array.isArray(s.market)||s.market.length>30)throw Error('市场记录格式无效');
 out.market=s.market.map(c=>{const r={};for(const k of ['brand','model','region','feature','boundary','source','status','match']){if(typeof c[k]!=='string'||c[k].length>2500)throw Error('市场记录字段无效');r[k]=c[k].trim();}if(!r.brand||!r.model)throw Error('请填写品牌和车型');if(r.source){let u;try{u=new URL(r.source);}catch{throw Error('来源链接无效');}if(!['http:','https:'].includes(u.protocol))throw Error('来源链接必须是http或https');}if(!['provided','announced','unverified'].includes(r.status)||!['full','partial','related'].includes(r.match))throw Error('证据状态无效');return {...r,origin:'manual'};});
 return out;
}
