import {top100,exportPayload} from './top100.js';
import additions from './patentScenes.json' with {type:'json'};
import patents from './patentEvidence.json' with {type:'json'};

export const domainLabels={cabin:['座舱场景','Cabin scenario'],cabinDriving:['舱驾融合场景','Cabin–driving integration']};
export const domainDefinitions={
 cabin:['目标主要通过乘员交互、内容、舱内环境或服务完成。读取位置、路线或停驻状态作为上下文，不自动算舱驾融合。','The goal is achieved through occupant interaction, content, cabin conditions or services. Location, route context or a parked-only gate alone does not make it driving integration.'],
 cabinDriving:['目标需要座舱与驾驶状态、底盘能力或专用车辆移动系统协同；涉及运动的执行由专用系统负责。','The goal needs coordination with driving state, chassis capability or a dedicated vehicle-motion system. Dedicated controllers remain responsible for motion.']
};
const fusion={
 'TOP-001':['补能任务包括车辆泊入、补能后返回与专用移动系统交接。','Replenishment includes parking entry, return and handoff to a dedicated motion system.'],
 'TOP-008':['挪车安排需要座舱理解外部诉求并交接车辆移动执行。','Relocation connects cabin interpretation of external requests with vehicle-motion execution.'],
 'TOP-010':['明确协调路线与车型允许的底盘舒适配置。','Explicitly coordinates routes and supported chassis comfort settings.'],
 'TOP-012':['停放与接回依赖允许场地内的车辆运动能力。','Parking and retrieval require vehicle motion within supported sites.'],
 'TOP-025':['接回任务需要专用系统控制车辆从停放位置驶来。','Retrieval needs a dedicated system to move from the parking position.'],
 'TOP-048':['试乘感受与允许的底盘配置进行对照和调整。','Compares ride feedback with supported chassis configurations.'],
 'TOP-049':['物品取送需要车辆移动、到达与交接执行。','Item delivery requires vehicle movement, arrival and handover.'],
 'TOP-050':['受阻路径的恢复需要车辆移动系统和人工协助协同。','Blocked-path recovery coordinates the vehicle-motion system and human assistance.'],
 'TOP-075':['与停车设施协作完成车辆进出、停放和取回。','Coordinates vehicle entry, parking and retrieval with parking infrastructure.'],
 'TOP-100':['车辆自主返回约定位置，需要专用运动系统及状态回执。','Autonomous return needs a dedicated motion system and state receipts.']
};
const cabinReason=['当前定义以舱内交互、体验或服务协作为主，未要求驾驶域、底盘或自主移动执行；分类随场景定义评审。','The current definition focuses on cabin interaction, experiences or services, without requiring driving, chassis or autonomous-motion execution. Classification follows the scenario definition.'];
export const scenarios=[...top100.map(s=>({...s,sourceType:'original',sceneDomain:fusion[s.id]?'cabinDriving':'cabin',domainReason:(fusion[s.id]||cabinReason)[0],domainReasonEn:(fusion[s.id]||cabinReason)[1]})),...additions];
export const patentEvidence=patents;
export const patentsFor=id=>patents.filter(p=>p.sceneIds.includes(id));
export function sceneExport(items,saved=[]){const payload=exportPayload(items,saved);return {...payload,schemaVersion:7,framework:'用户需求 × AI能力 × 车用理由 × 场景领域',domainLabels,domainDefinitions,scenarios:payload.scenarios.map(s=>({...s,patents:patentsFor(s.id)}))};}
