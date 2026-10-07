import flows from './haiFlows.json' with {type:'json'};
import library from './haiPatterns.json' with {type:'json'};
export const haiVersion=library.version;
export const haiRules=Object.fromEntries(library.rules.map(r=>[r.id,r]));
export const haiPatterns=Object.fromEntries(library.patterns.map(p=>[p.id,p]));
const m=(id,why)=>({id,why});
export function getHAIDesign(s){
 const f=flows[s.id];if(!f)throw new Error(`Missing HAI design: ${s.id}`);
 const {kind}=f,physical=kind==='physical',persistent=physical||kind==='autonomous',shared=kind==='multi',inspect=kind==='inspect',memory=kind==='memory',creative=kind==='create',experience=kind==='experience';
 const example=s.summary.split('例如')[1];
 const steps=[{node:'01 · 进入与条件确认',design:`${persistent?'先由有权主体设定目标、边界和有效期；已有有效委托时按条件触发，没有委托时只提出建议。':'由用户明确发起；如改为系统主动建议，应先确认事实、能力与介入时机，不因推断兴趣而启动。'} ${f.conditions} 只补齐当前下一步所需的信息，已有可靠信息不重复询问。`,mechanisms:[m(inspect?'P07':'P04',inspect?'当前解释依赖现场证据，先核实对象与来源。':'必要目标或参数缺失时澄清；补齐后重验能力与权限。'),...(persistent?[m('P02','未取得委托时只提出具体候选；已授权任务的继续推进保留P03上下文。')]:[])]},
 {node:'02 · 形成可修改的协作方案',design:f.interaction,mechanisms:[m(inspect?'P07':shared?'P06':'P03',inspect?'核实事实后解释，用户能质疑和纠正对象。':shared?'先解决受影响主体之间的选择权和需求冲突；分区已解决事项可独立推进。':creative?'人在本轮决定创作目标和素材边界，Agent组织范围内的生成步骤；这是限定委托的应用，不是新增的“共创范式”。':experience?'人在本次确定输出通道与上限，Agent持续编排范围内效果，不需逐帧确认。':'人确定目标与边界，Agent组织许可内步骤，用户可局部改方案。')]},
 {node:'03 · 检查动作范围与授权',design:`${inspect?'读取、检索或导出涉及的资料也要核验访问范围；单纯已有资料的解释不额外索取操作确认。':shared?'区分个人、分区与共享动作，由对应有权主体确认，不能把一人的“好”当成所有人同意。':physical?'明确地点、移动任务、费用和交接主体；座舱Agent仅向专用执行系统提交受限任务。':experience?'将本次通道、强度和时长绑定到许可；扩大通道或影响其他乘员时重验。':'把目标细化到拟执行的动作、对象与影响；订单、付款、共享和设备调整分别核验。'} 当前授权已覆盖的动作无需重复询问，缺失或变更时再确认。${memory?'如拟写入长期记忆，另行明确内容、用途、主体和期限；本轮查询不自动产生长期保存。':''}`,mechanisms:[m('P05','仅在域内可补齐的动作权限缺失时取得确认，不能把含糊回应扩展成新授权。'),...(memory?[m('P14','长期记忆范围与写入许可独立于本次任务，修改和删除也需结果核验。')]:[]),...(physical?[m('P10','当前研究R01不覆盖车辆安全控制；专用系统交接契约是待补的扩展条件，接收不明不能视作已接管。')]:[])]},
 {node:'04 · 推进并保持可引导',design:`${inspect?'展示核实后的对象、来源与不确定性，支持用户更换对象或补充事实。':creative?'呈现可修改草稿或当前分支，支持重做、改写、保留与放弃；生成不代表作品被接受。':experience?'运行已约定的效果，持续提供强度、通道和停止入口，用户修改应落到实际输出。':physical?'区分已提交、专用系统已接收、执行中和完成，各阶段以实际交接与状态证据更新。':'按授权推进子任务，显示已完成、处理中和未完成部分，支持查询、局部修改与停止。'} 后续每个新动作重新检查当前权限；等待期间不重复提交已成功动作。`,mechanisms:[m(inspect?'P07':'P03',inspect?'用户纠正事实后重新核实，不能仅凭模型确信程度提供结论。':'委托上下文持续保留，局部步骤可切换澄清、核实或恢复机制。'),...(!inspect?[m('P11','请求已经提交而结果未明时监测；可靠结果已返回时可直接回报，不强制增加等待。')]:[])]},
 {node:'05 · 根据证据回报',design:`${f.evidence} 尚无证据时明确标记处理中或未知；仅有部分成功时分别呈现。完成当前动作不等于用户价值已成立，也不自动继续新的目标。`,mechanisms:[m('P16','可靠结果与动作、对象匹配才回报完成，用户可查看来源并质疑。'),m('P07','结果未知或过期时先核实，不用“请求已发出”或生成草稿代表外部任务成功。')]}
 ];
 const branches=[{node:'分支 · 异常与能力不足',design:f.failure,mechanisms:[m(inspect?'P07':'P12',inspect?'证据缺口先核实，仍无法判断则保留不确定性。':'已有失败先核实已成功部分；按明确重试范围恢复，不足时再协商。'),m('P09','原能力不足时解释替代及差异，只执行用户选择且许可覆盖的替代。')]},
 {node:'分支 · 用户停止、纠正或接管',design:`用户能停止本次安排、修改局部目标或接管。先停止新的提交，检查已提交部分的可取消状态，再回报哪些停下、哪些仍需处理。${experience?'停止效果与停止原内容分开，恢复本体验修改的设置时保留用户另行调整。':creative?'保留用户选定的草稿或进度，丢弃、保存和公开分别决定。':physical?'车辆当前阶段的停止与安全处置由专用系统完成，座舱Agent核验接收和最终状态。':''}`,mechanisms:[m('P13','停止意图不等于取消成功；已不可逆的部分如实说明，不保证回滚。')]},
 {node:'分支 · 主动建议被拒绝或时机不合适',design:'非紧急建议在负荷高或时机未知时暂不打断，时机变化后重新判断价值；用户拒绝按明确的本次、行程或持续范围处理。延后播报不应暂停已提交任务的内部核实与恢复。',mechanisms:[m('P08','延后的是用户可见的非紧急建议，过期建议不补发。'),m('P15','明确拒绝范围内保持安静，不推断永久偏好。')]}
 ];
 return {version:haiVersion,status:'候选交互设计，待场景评审与用户验证',kind,example:example?`例如${example}`:s.summary,conditions:f.conditions,scope:physical?'扩展研究：移动和补能执行需专用系统及交接契约，现有示范R01不直接覆盖。':'当前为文本设计方案，范式编号沿用HAI候选库；具体能力、许可与界面仍需项目核对。',steps,branches,validation:s.question};
}
