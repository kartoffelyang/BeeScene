export const dimensions=[['acceptance','用户接受度'],['frequency','使用频率'],['experience','体验增益'],['business','商业贡献'],['ai','AI能力要求'],['cost','实现代价']];
export const evidenceTypes=['用户调研','专家访谈','实车演示','实车测量','重复使用观察','实际交易','其他'];
export const evidenceKey='fengcang-decision-evidence-v1';
export function validEvidence(e){return e&&typeof e.id==='string'&&['TOP-004','TOP-005','TOP-006'].includes(e.sceneId)&&dimensions.some(([k])=>k===e.dimension)&&evidenceTypes.includes(e.type)&&['支持','反驳','混合','尚不能判断'].includes(e.direction)&&['待验证','正向','有限／有条件','负向'].includes(e.judgment)&&['date','scope','finding','source','createdAt'].every(k=>typeof e[k]==='string'&&e[k].trim())&&/^\d{4}-\d{2}-\d{2}$/.test(e.date);}
export function parseEvidence(raw){const a=JSON.parse(raw||'[]');if(!Array.isArray(a)||!a.every(validEvidence))throw new Error('证据记录格式异常');return a;}
export function validateDraft(e){if(!e.date||!e.scope.trim()||!e.finding.trim()||!e.source.trim())return '请填写记录日期、适用条件、来源和观察结果。';if(e.link&&!/^https?:\/\//i.test(e.link))return '资料链接请使用 http:// 或 https:// 地址。';return '';}
export function latestEvidence(records,id,dimension){return records.filter(e=>e.sceneId===id&&e.dimension===dimension).at(-1);}
export const briefCases={
 'TOP-004':{acceptance:'待验证；允许调弱、关闭，分别观察儿童与成人的选择。',frequency:'机会型；充电、等待、露营中是否存在共同娱乐时间。',experience:'比较无联动、固定氛围与内容联动，排除仅有首次惊艳。',business:'购车记忆点可能成立；额外付费未知，需带价格的取舍。',ai:'内容事件理解＋声光映射；规则／事件接口先作基线，多模态模型为候选。参数规模待硬件实测，不预设7B。',cost:'先接灯光与音频，检查同步、版权和维护成本；仅安全停驻。'},
 'TOP-005':{acceptance:'待验证；关注误报、隐私设置和用户是否理解“不确定”。',frequency:'事件偶发、守护可持续开启；启用时长不等于使用价值。',experience:'与普通告警回看比较查找时间和判断正确性。',business:'安心感可能影响购车；是否应标配及订阅付费均未知。',ai:'事件识别＋证据摘要与追问；规则检测配合语言模型，视觉模型为候选。规模、延迟、能耗需驻车硬件实测。',cost:'摄像头接入、驻车唤醒、存储与热管理；先用离线回放验证。'},
 'TOP-006':{acceptance:'待验证；分别观察每位乘员的接受、拒绝与修改。',frequency:'多人同乘且冷暖冲突时使用；按真实冲突机会判断频率。',experience:'比较手动分区空调，看舒适改善是否超过确认与纠错负担。',business:'购车贡献与额外付费均待验证；标配、选装或订阅由项目条件与证据决定。',ai:'语音识别＋意图理解＋工具执行；先用规则协商，小型语言模型为候选。感知增强单独验证，参数规模待测。',cost:'需要可控的分区空调与执行回执；先显式输入，不默认新增摄像头或Box。'}
};
