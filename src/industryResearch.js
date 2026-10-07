import evidence from './marketEvidence.json' with {type:'json'};
export const statusLabels={none:['尚未发现应用','No application identified'],related:['仅相关能力','Related capabilities only'],few:['起步应用','Early adoption'],multiple:['逐步扩散','Expanding adoption'],common:['开始普及','Adoption broadening'],announced:['试点 / 发布中','Pilot / announced']};
const scopes={
 'TOP-001':['自动泊入并补能；完整无人找站、补能后返回单独核实，预约充电不计入','Automated docking and replenishment. Unattended travel/return needs separate verification; scheduling alone is excluded.'],
 'TOP-005':['停驻守护、事件检测与取证；AI事件摘要和解释尚未证实普及','Parked monitoring and incident evidence; AI summaries/explanation are not established as widespread.'],
 'TOP-012':['辅助/遥控泊车或限定场地代客泊车；接驳统筹与完整无人委托另核','Assisted/remote parking or site-limited valet parking; transfer coordination/full unattended delegation needs verification.'],
 'TOP-018':['联动座椅与环境的休息模式；任意口述目标与完整恢复流程另核','Rest modes coordinating seats and environment; arbitrary spoken goals/full restoration require verification.'],
 'TOP-020':['异常停车事件通知、录像或远程查看；自动对外处置另核','Parking incident alerts, recording or remote viewing; autonomous external handling requires verification.'],
 'TOP-025':['限定距离/场地的车辆召唤；自主判断临停结束和无人接回另核','Vehicle summon within limited areas/distances; autonomous pickup timing needs verification.'],
 'TOP-027':['用户设置的条件与多动作联动；AI从任意目标自动编排另核','User-defined conditions and multi-action routines; AI composition from arbitrary goals needs verification.'],
 'TOP-031':['预约充电、温控或停驻用电管理；无人能源代理另核','Scheduled charging, climate or parked power management; unattended energy agency needs verification.'],
 'TOP-038':['预约/远程空调与出发前准备；AI自主待命决策另核','Scheduled/remote climate and departure preparation; autonomous readiness decisions need verification.'],
 'TOP-046':['车辆状态查询、远程摄像或通知；AI状态解读与自主处置另核','Status queries, remote cameras or alerts; AI interpretation/autonomous handling needs verification.'],
 'TOP-047':['露营模式的环境、供电或空间联动；多人活动的AI统筹另核','Camp modes coordinating climate, power or space; AI coordination of group activities needs verification.'],
 'TOP-051':['停驻观影与空间/屏幕联动；多人共同选片的AI协商另核','Parked viewing and screen/space coordination; AI group film selection needs verification.'],
 'TOP-067':['宠物温控、留车状态或提醒；完整同行AI协作另核','Pet climate/status/alerts; full AI pet travel coordination needs verification.'],
 'TOP-089':['用户可设置的条件触发与多动作仪式；AI角色表达另核','User-defined conditional multi-action rituals; AI role expression needs verification.'],
 'TOP-100':['限定场地/距离的泊入返位；全过程无人自主待命另核','Parking/return within constrained areas/distances; full unattended standby needs verification.']
};
export function applicationScope(s){const pair=scopes[s.id]||['本场景核心任务的完整或部分实现；仅聊天、一般导航等相关能力不计入','Full/partial implementation of this scenario’s core task; generic chat/navigation is excluded.'];return {zh:pair[0],en:pair[1]};}
const canonical=id=>({kia:'hyundai',volvo:'geely',zeekr:'geely',lynk:'geely',denza:'byd',avatr:'changan',deepal:'changan',voyah:'dongfeng',onvo:'nio'}[id.replace(/-cn$/,'')]||id.replace(/-cn$/,''));
function group(rows){const result=new Map();for(const r of rows){const id=canonical(r.oemId);if(!result.has(id))result.set(id,{id,name:r.brand,en:r.en?.brand||r.brand});}return [...result.values()];}
export function assessRecords(all,region){
 const priority=r=>r.researchStage?3:r.status==='announced'?2:r.match==='related'?1:0;
 const records=all.filter(r=>r.marketRegion===region).sort((a,b)=>priority(a)-priority(b)),provided=records.filter(r=>r.status==='provided'&&!r.researchStage),core=provided.filter(r=>r.match==='full'||r.match==='partial');
 const groups=group(core),fullGroups=group(core.filter(r=>r.match==='full')),partialGroups=group(core.filter(r=>r.match==='partial')).filter(g=>!fullGroups.some(f=>f.id===g.id));
 const relatedGroups=group(provided.filter(r=>r.match==='related')),pendingGroups=group(records.filter(r=>(r.status==='announced'||r.researchStage)&&r.match!=='related'));
 const status=groups.length>=5?'common':groups.length>=3?'multiple':groups.length?'few':pendingGroups.length?'announced':relatedGroups.length?'related':'none';
 return {status,records,groups,fullGroups,partialGroups,relatedGroups,pendingGroups,complete:fullGroups.length>0};
}
export const assess=(id,region)=>assessRecords(evidence[id]||[],region);
export const definitions=[
 ['开始普及','至少5家OEM已有该计数对象的完整或部分量产实现，表示开始跨OEM扩散；不是装车率或完整AI场景普及率。','Adoption broadening','At least five OEM groups have full/partial production implementations of the counted application. This is not an installation rate or full-AI-scenario penetration.'],
 ['逐步扩散','3—4家OEM已应用，超过个别品牌，但尚不能判定行业普遍应用。','Expanding adoption','Three or four adopting OEM groups; broader than isolated brands, without establishing industry-wide adoption.'],
 ['起步应用','1—2家OEM已应用，仍处于少量品牌/车型实现阶段。','Early adoption','One or two adopting OEM groups; implementation remains concentrated.'],
 ['试点 / 发布中','已发现试点、原型或官方发布，分别列出，不计入已量产OEM数。','Pilot / announced','Pilots, prototypes and announcements are listed separately and excluded from production counts.'],
 ['仅相关能力','只有相关基础能力，尚未核实场景核心任务实现，不计入已应用OEM数。','Related capabilities only','Only building blocks are documented; these are excluded from adopting OEM counts.'],
 ['尚未发现应用','核查资料中未找到核心应用证据；数量为证据下限，不代表行业零应用。','No application identified','No core application evidence was found. Counts are verified lower bounds, not proof of zero market adoption.']
];
