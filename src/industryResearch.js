import coverage from './industryCoverage.json' with {type:'json'};
import evidence from './marketEvidence.json' with {type:'json'};
export {coverage};
export const statusLabels={none:['尚未发现应用','No application identified'],related:['相关功能已应用','Related functions adopted'],few:['少量应用','Limited adoption'],multiple:['多品牌应用','Multi-OEM adoption'],common:['基础功能已普及','Basic functions widespread'],announced:['发布 / 推送中','Announced / rolling out']};
export function assess(id,region){
 const records=(evidence[id]||[]).filter(r=>r.marketRegion===region),provided=records.filter(r=>r.status==='provided'),core=provided.filter(r=>r.match!=='related'),groups=[...new Set(core.map(r=>r.oemId))];
 let status=groups.length>=3?'multiple':groups.length?'few':provided.length?'related':records.some(r=>r.status==='announced')?'announced':'none';
 if(region==='global'&&id==='TOP-038'&&groups.length>=3)status='common';
 return {status,records,groups,complete:provided.filter(r=>r.match==='full').length>0};
}
export const definitions=[
 ['基础功能已普及','多个主流OEM及不同市场已有同类基础产品入口；这是定性判断，不是装车率统计，也不表示本场景全部AI扩展已普及。','Basic functions widespread','Similar basic products appear across mainstream OEMs/markets. A qualitative assessment, not a measured installation rate or proof of the full AI scenario.'],
 ['多品牌应用','在核查资料中，至少3个不同OEM体系提供场景相关核心功能；不将同集团品牌重复作为独立OEM计算。','Multi-OEM adoption','Core-related functions documented in at least three distinct OEM systems; sister brands are not counted separately.'],
 ['少量应用','已找到1—2个OEM体系的部分或完整核心实现，尚不能推定行业普及。','Limited adoption','One or two OEM systems have a partial/full core implementation; widespread adoption is not established.'],
 ['相关功能已应用','有产品提供相关基础能力，但没有证据证明其实现该场景的核心任务。','Related functions adopted','Products offer relevant building blocks, but the core task has not been established.'],
 ['发布 / 推送中','官方已宣布或分批更新；不将符合更新条件的车辆数等同实装数量。','Announced / rolling out','Announced or staged rollout; eligible vehicles are not counted as installed vehicles.'],
 ['尚未发现应用','在本次公开资料核查范围内，尚未找到该场景核心任务的量产应用证据；不等于证明行业没有。','No application identified','No production evidence for the core task was found within this review; this does not prove market absence.']
];
