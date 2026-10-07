import {sceneNeeds,needDimensions,needNotes} from './sceneNeeds.js';
export {needDimensions,needNotes};
import {getHAIDesign,haiVersion} from './haiDesign.js';
export const aiDimensions={perception:'多模态感知',intent:'语义与意图理解',memory:'记忆与个性化',planning:'推理与规划',creation:'生成与创作',emotion:'情感与人格交互',execution:'工具与任务执行',embodiment:'具身感知与行动'};
export const vehicleDimensions={presence:'多人共享空间',movement:'沿途场景变化',perception:'现场感知条件',space:'座舱设备与空间',continuity:'长期使用关系',motion:'车辆移动能力',external:'车内外交流',integration:'整车系统联动',ecosystem:'出行服务衔接'};
// 排序为蜂舱研究判断；未采集用户价值数据，不使用虚构评分。
const source=`
自主补能管家|planning execution embodiment|motion integration ecosystem|车辆在约定的电量与出行准备目标内发现补能需要，组织找站、泊入和补能，向车主交代完成状态。例如夜间电量不足时，调用移动与自动补能设施，完成后返回待命。|减少无人用车时的补能安排和等待负担。|车主查站、开车补能并人工确认。|是否真的减少照料时间，物理充电连接能否闭环？|前瞻探索
接送与晚餐一并安排|intent planning execution|movement ecosystem|用户交代接人、吃饭再回家，AI统筹到达变化、人数、餐厅约束与路线，并提交关键选择。例如航班延误时，询问是否保留晚餐，再调整餐位与接人时间。|减少跨应用协调和临时重做计划。|航班、导航与餐饮应用分别操作。|总协调时间是否下降，确认负担是否抵消收益？|近期试验
可追问的车窗世界|perception intent|movement perception|乘客可围绕刚才路过的建筑、标识或景物连续追问，车辆利用短时现场线索定位对象并解释。例如问“刚才那座塔”，找到画面并支持追问历史。|把难描述、稍纵即逝的对象变成可探索的知识。|拍照识别或事后地图搜索。|对象定位是否准确，用户是否主动继续探索？|近期试验
内容扩散的沉浸座舱|perception planning execution|space integration|理解电影或游戏的场景与节奏，将内容映射为协调的灯光、声音、触觉和气流体验。例如雨林画面出现时，联动声光与气流，可调低强度。|让座舱提供屏幕以外的沉浸感。|固定灯光效果和独立音响。|是否比简单颜色同步更沉浸，是否出现不适？|条件预研
会解释的车辆守护|perception planning creation|perception external continuity|车辆持续观察约定的车外事件，把发生过程整理成有证据的摘要，并区分值得通知与可忽略事件。例如有人多次靠近车门，推送关键片段供车主判断是否处理。|少翻看长录像，减少无用警报。|传统哨兵录像与事件通知。|漏报、误报和查阅时间能否同时改善？|近期试验
多乘员舒适协商|intent planning execution|presence perception space|不同席位表达冷热、日晒和声音诉求，AI整理分歧并提出可确认的共同舒适方案。例如前排冷、后排热，询问可接受范围后分区调节。|减少反复调节和乘员之间的争执。|逐项操作与口头协调。|满意配置是否更快达成，少数乘员是否被忽略？|近期试验
家庭旅行共同规划|intent planning|presence movement ecosystem|成员各自提出兴趣和限制，AI呈现共同点与取舍，组织一家人认可的路线和活动。例如孩子想看动物、长辈怕走路，共同选择折中方案。|减少一个人包办计划的负担。|群聊讨论后由一人整理路线。|参与是否更均衡，计划返工是否减少？|近期试验
车外诉求与移车协商|perception intent planning embodiment|external motion perception|车外人员提出停放诉求后，车辆核对现场线索与行动权限，组织回应及可接受的挪车安排。例如收到“不能停车”，澄清后在允许范围确认新位置并移车。|减少临停冲突和车主往返处理。|打电话联系车主或现场等待。|能否识别正当诉求与恶意指令，移车结果能否确认？|前瞻探索
稳定人格的车辆伙伴|memory emotion|continuity space|车主选择可修改的人格、表达习惯和声音风格，车辆在不同任务中保持一致，同时根据语境调节语气、节奏和接话方式。例如幽默旅伴遇到紧急或复杂任务时切回清晰简洁，用户可随时打断或换风格。|降低重复设定，建立可辨识的陪伴体验。|通用语音助手与一次性角色扮演。|是否持续选择该人格，风格是否妨碍任务清晰度？|近期试验
驾乘舒适整体编排|perception intent planning execution|integration perception movement|围绕用户明确的平稳与舒适目标，协同考虑路线、座舱内容和车型允许的底盘舒适配置。例如乘客抱怨颠簸，解释可选调整，确认后联动设置。|把分散功能组织为整体驾乘结果。|分别调整模式、空调和导航。|乘员主观舒适是否改善，哪项协同真正有贡献？|条件预研
沿途合作冒险游戏|perception creation intent|presence movement perception|沿途见闻与成员选择成为可暂停的合作剧情，让乘客共同完成观察、推理与故事任务。例如看到桥便生成故事分支，成员口述选择推进剧情。|增加共享参与，减少各自刷屏。|固定故事或手机小游戏。|是否有自发参与和重复选择，途中暂停是否自然？|近期试验
停车与接驳委托|planning execution embodiment|motion ecosystem movement|围绕用户到达与返回目标，统筹允许的停放位置、步行接驳和车辆取回安排。例如商场下车后，在支持场地停放并按时到接回点。|减少找车位和绕行的精力。|驾驶者自己找位、步行和找车。|是否节省门到门时间，设施覆盖不足时如何结束任务？|前瞻探索
预算内的餐饮委托|intent memory planning execution|ecosystem movement continuity|用户给出人数、忌口、预算与到达时间，AI组织菜单和取餐安排，确认后完成订单。例如说“点三人晚饭”，修改菜单后确认费用与取餐。|减少车内多人点餐协调。|分别查看菜单、汇总与下单。|错单是否下降，总操作和确认次数是否减少？|近期试验
车内物品证据回溯|perception memory|perception continuity space|用户问某件物品在哪，AI从允许留存的车内片段找到最后可见位置，并说明线索时间。例如问眼镜在哪，展示最后出现的位置及对应画面。|减少翻找与回家后才发现遗漏。|凭记忆寻找或逐段查看录像。|寻找时间是否下降，过时线索是否误导？|近期试验
方向盘赛车体验|creation execution|space integration presence|安全停驻时，将可隔离的方向盘等设备作为游戏输入，结合声音与舒适触觉形成赛车体验。例如转动方向盘控制虚拟赛车，触觉响应赛道变化。|利用座舱实体设备获得手机没有的参与感。|手柄游戏或专用赛车模拟器。|隔离条件成立时，设备体验是否值得用户重复使用？|条件预研
航班变化接送重排|planning execution|movement ecosystem|航班或接人时间发生变化时，AI说明影响并重新组织出发、等待与后续活动。例如航班提前到达，确认新出发时间后重排接送。|减少无效等待和手动通知。|航班提示加人工调整路线。|是否减少等待与遗漏，信息过期如何被发现？|近期试验
私人旅行记忆伙伴|memory creation|continuity movement perception|将用户选定的地点、留言与素材连接成可回顾的经历，并用于下次旅程建议。例如问上次湖边在哪，找回地点和留言供回顾。|让记忆减少重复说明并产生可留存作品。|相册、笔记与人工总结。|记忆是否比无记忆版本更有用，纠正成本多大？|近期试验
可转换的休息空间|intent planning execution|space integration|用户提出休息目标后，车辆组织环境、内容、时间与结束方式，形成可恢复原状的停驻体验。例如说“休息二十分钟”，调整环境，到时唤醒并恢复。|降低临时休息准备负担。|手动调温、遮阳和闹钟。|是否更容易进入和结束休息，准备时间是否缩短？|近期试验
动态行程任务插入|intent planning execution|movement ecosystem|途中临时加入取件、购物或接人目标，AI比较插入位置与对原计划的影响。例如临时取快递，比较绕行时间，选定后更新路线。|减少重复查路线和检查预约。|手动增加途经点并逐个核对。|计划遗漏和重排耗时能否减少？|近期试验
异常停车事件远程处置|perception planning execution|external perception ecosystem|对碰擦、阻挡或异常接近事件整理证据，辅助车主选择联系、留档或服务处理。例如疑似碰擦，先看片段，再选留档或联系服务。|缩短远程了解与处理事件的时间。|看录像、打电话、人工整理材料。|是否提高证据可用性，是否避免过度反应？|条件预研
家庭共享车辆交接|memory planning execution|continuity ecosystem integration|把借用期限、偏好配置、使用说明和归还事项组织为双方可核对的交接任务。例如借车半天，双方确认时段，并汇总归还待办。|减少追问、错配与授权遗漏。|消息交代与分别设置钥匙。|双方交接耗时和权限错误是否减少？|近期试验
端侧5D互动剧场|perception creation execution|space perception integration|停驻时理解成员动作和内容进展，让灯光、声音、气流与舒适触觉形成可参与的剧情反馈。例如成员举手选故事分支，感知动作后联动声光触觉。|把被动观影变成实体空间中的共同活动。|观影加固定环境特效。|参与感是否超过固定特效，反馈是否造成不适？|条件预研
车辆健康证据解释|perception memory intent|integration perception continuity|把官方可读取状态、异常记录和用户感受连接成可理解的健康线索，辅助服务沟通。例如描述异响，关联记录并整理线索供预约时展示。|减少不明提示带来的困惑与重复描述。|仪表提示和人工描述故障。|解释是否忠于证据，服务人员是否更易理解问题？|近期试验
活动与票务一并安排|intent planning execution|ecosystem movement|用户描述想参加的活动，AI比较场次、票种、同行条件与往返安排，确认后组织购票。例如周末看演出，选定交通与座位后确认费用购票。|减少活动选择和出行安排之间的反复切换。|票务平台与地图分别使用。|遗漏条件是否减少，退改规则是否被正确理解？|近期试验
临停结束自主接回|planning execution embodiment|motion ecosystem external|在允许的服务范围内，根据用户明确的返回安排组织车辆从停放位置接回。例如用户在入口请求接回，车辆在支持场地驶来。|减少雨天、带物或行动不便时的步行负担。|步行找车或另行联系接送。|实际接回时间、失约与现场沟通成本如何？|前瞻探索
乘客晕动反馈闭环|perception memory intent planning execution|perception integration movement|乘客主动反馈不适时，AI连接路段、视觉内容与舒适设置，组织休息和可选择的改善方案。例如看屏幕发晕，询问感受并调整，之后追问是否好转。|形成可学习、可比较的舒适支持。|临时停车与凭感觉调整设置。|主观不适是否降低，提醒是否增加负担？|条件预研
口述目标的整车配方|intent planning execution|space integration|用户表达想要的活动或感受，AI给出跨座舱与车身设置的可检查配方。例如说“凉快又安静”，确认组合设置后执行。|减少寻找分散入口与多次操作。|逐项调节各个设置。|目标达成是否更快，撤回和纠正是否容易？|近期试验
弱网络旅途助手|memory intent|continuity movement|为用户选择的旅程保存可用资料与上下文，在弱网络环境说明哪些信息仍有效。例如进山前保存行程，断网后仍可查询已存资料。|降低旅途中断与重复解释。|手动截图、离线地图和笔记。|离线任务成功率与过时信息风险如何？|近期试验
多人旅程共同导演|creation intent|presence movement continuity|成员挑选照片、声音与故事重点，AI在停驻时组织大家认可的短片草稿。例如出游结束，成员选片段，修改草稿后分享。|减少剪辑工作，保留共同讲述权。|手机剪辑工具与群聊收集素材。|作品是否被编辑保留，相比手机是否确实省力？|近期试验
儿童旅途陪伴世界|memory creation emotion|presence continuity movement|将孩子主动选择的角色与旅行见闻连接成可持续、可暂停的共同故事，角色以适合当前语境的声音与表达回应。例如孩子把今天的桥加入昨天的故事，角色接续讲述并邀请家人参与，可暂停或切换普通讲解。|形成与家庭旅程有关的陪伴与探索。|固定故事播放器。|是否带来共同对话，还是增加独自沉浸？|近期试验
自管理的停驻能源|perception planning execution|integration ecosystem space|在约定能源预算内跟踪停驻设备使用，提出或执行已授权的节能安排。例如露营耗电超预期，说明余量后询问保留哪些设备。|减少露营或长时间停驻的能源照料。|查看电量并手动关闭设备。|是否减少意外耗尽，自动调整是否打断活动？|条件预研
家庭日常出行秘书|memory planning execution|continuity ecosystem movement|围绕家庭主动共享的日程和接送责任组织出行任务，提示冲突并支持临时交接。例如接送时间冲突，提出分工，相关成员确认后调整。|减少重复协调和遗漏接送。|共享日历与群聊。|是否减少协调消息，授权数据是否足够准确？|近期试验
座舱3A游戏伴演|perception creation emotion execution|space presence|理解允许接入的游戏状态，为停驻玩家提供可关闭的解说、共同挑战和空间反馈。例如雨天赛道中，提供可选提示与空间反馈，能关闭。|让车内游戏形成独特的共同体验。|原游戏与普通显示音响。|AI伴演是否增益而非打扰，平台接入能否成立？|条件预研
车外可理解的意图表达|intent creation execution|external perception|将用户允许的停放、等待或接送意图转化为车外可理解的信息与回应。例如临停接人，车外展示等待信息并回应询问。|减少车外人员猜测和沟通冲突。|手势、电话与固定提示牌。|对方是否理解，是否产生新的误解？|条件预研
接送长辈的全程准备|intent planning execution|space ecosystem movement|围绕用户明确的行动需求组织上下车、入口、停靠与随行用品安排。例如接长辈前，确认入口与协助人，再汇总准备事项。|减少长辈出行的准备与交接负担。|人工电话沟通和分别查入口。|关键需要是否被覆盖，实际门到门体验是否改善？|近期试验
持续适应的个人车书|memory intent|continuity integration|围绕用户近期真实困惑，选择有用的解释和小范围练习，保留可纠正的学习记录。例如反复询问除雾，结合现场讲解，可请求操作演示。|减少重复困惑和一次读整本手册的负担。|通用教程与手册搜索。|重复求助是否减少，提示是否过多？|近期试验
跨车连续的个人伙伴|memory emotion|continuity ecosystem|在用户选择的共享范围内，让个人偏好、记忆和互动风格在允许使用的车辆间连续。例如换租用车，先预览迁移内容，再沿用偏好与声音风格；不迁移私人记录，也可以重新选择人格。|减少换车后重复设置与重新建立上下文。|各车独立配置。|跨车收益是否明显，错误迁移是否易发现？|条件预研
自主待命的车辆准备|perception memory planning execution|integration continuity ecosystem|在约定出发目标内检查电量与准备状态，组织允许的补能和环境准备并报告未完成事项。例如约定早上出发，提前检查并报告补能或预热进度。|减少临出门才发现车辆未准备好的情况。|定时设置与人工检查。|准备失败是否更少，不必要动作是否增加？|条件预研
停车后的步行交接|planning execution|movement ecosystem|车辆把停车位置、入口和后续任务交给用户手机，并在计划改变时衔接返回车辆。例如停车看展，手机接续入口与票务，返程找到车辆。|减少车与手机之间的任务断点。|截图、发地址和重新搜索。|交接信息是否被用到，是否减少重复输入？|近期试验
车内即兴音乐合演|creation intent execution|presence space|停驻成员以哼唱、节奏和选择共同续写音乐，并把作品与空间反馈联动。例如一人哼唱、一人打拍，边听AI伴奏边改写。|降低音乐创作门槛并增加共同参与。|音乐生成应用与分开播放。|等待和纠错是否打断合演，是否重复参与？|近期试验
自解释的车外交往|perception intent creation|external perception|车辆以一致、可理解的方式回应车外查询，并明确哪些请求需要车主处理。例如有人问车主何时回来，按可公开范围回答或转交。|减少陌生人员与无人车辆的沟通阻力。|固定语音和车主电话。|是否正确理解请求和拒绝边界？|条件预研
归家准备任务链|memory planning execution|ecosystem movement continuity|按用户选择，在接近家时组织家中设备准备、购物取件与车辆停放衔接。例如说“回家吃饭”，确认取件与家中准备后执行。|减少到家前后的分散操作。|多个应用分别操作。|净操作负担是否下降，状态不一致如何恢复？|近期试验
情境声景旅行|perception creation execution|movement perception space|依据用户选定的景物与主题生成可调整的声景，让音乐与沿途体验相互呼应。例如选择海岸主题，融合海浪与音乐，可随时换风格。|获得与当前旅程相关的氛围。|固定播放列表。|是否比固定音乐更受选择，变化是否过于频繁？|近期试验
老人用车协同伙伴|intent memory emotion|continuity presence|在本人同意的范围内，用可调整的语速、清晰度和耐心表达组织解释、常用目标与家人协助入口。例如去常去的医院，简明确认，允许打断重问；困惑时询问是否联系家人，而非代替本人作决定。|降低学习与重复求助负担。|简化界面与家人电话指导。|是否增加独立完成任务的比例？|近期试验
共享旅程的隐私协商|intent planning|presence continuity perception|多人共同参与拍摄或创作前，AI帮助明确每人的素材与共享范围，并保留不同选择。例如剪旅行短片，逐人确认出镜与分享范围再处理。|减少隐私冲突和事后删改。|口头询问与事后人工处理。|是否让成员理解并表达真实选择？|近期试验
远程用车状态代理|perception intent execution|integration ecosystem|用户远程提出确认或准备目标，AI汇总可获得的车辆证据并报告允许执行的结果。例如问“车准备好了吗”，汇总状态后可继续委托准备。|减少反复打开多个车辆状态页面。|远程车控页面逐项操作。|状态与执行结果是否可靠、可解释？|近期试验
露营共同生活空间|intent planning execution|space presence integration|围绕共同用餐、休息、娱乐与返程需要，组织可切换的停驻生活体验。例如晚餐转观影，确认需要后联动照明与座椅。|降低多种活动切换时的准备负担。|手动切换各种设备和设置。|哪种活动组合有实际复用价值？|条件预研
数字底盘试乘教练|perception memory planning|integration perception movement|将明确的试乘感受与允许的底盘配置关联，帮助比较不同舒适方案并记住依据。例如同路段试乘后，描述软硬和晃动，整理差异比较。|让用户更容易选择适合的驾乘方式。|凭感觉切换模式。|反馈是否可重复，建议是否优于固定模式？|条件预研
车辆移动取送任务|planning execution embodiment|motion ecosystem external|在允许的场地与服务条件下，车辆执行约定的物品取送并确认交接状态。例如营地取物，协调交接方并告知送达位置。|减少人工往返与等待。|人工驾驶取送。|交接与移动能否形成可靠闭环？|前瞻探索
遇到阻挡的协作脱困|perception planning embodiment|motion external perception|发现停放或接回路径受阻时，车辆组织可允许的替代路径、外部沟通或人工协助。例如车前有阻挡，说明情况，尝试允许方案或求助。|减少车主到场处理的负担。|远程查看后联系人工。|何时应停止自主尝试并交接？|前瞻探索
停驻影院共同选片|intent planning execution|presence ecosystem space|成员提交兴趣与时间限制，AI协助选片和观看准备，保留个人不参与的选择。例如仅有半小时，推荐短片，成员选定后准备观看。|减少选片争执与准备步骤。|成员分别搜索后投票。|是否更快选定并共同观看？|近期试验
实时剧情空间反馈|perception planning execution|space integration|理解内容的紧张、舒缓与转场，组织可调强度的空间反馈而非只同步画面颜色。例如追逐转为对话，减弱声光触觉，观众可调强度。|让声光触觉具有内容相关性。|简单颜色或音量同步。|语义反馈是否比简单同步更有价值？|条件预研
把此刻变成漫画|perception creation|perception presence movement|乘客选择现场见闻与角色，AI生成可共同续写的旅途漫画。例如遇见彩虹，口述对白，修改生成的分镜。|把共同经历转化为个人表达。|拍照后用手机生成图片。|是否实际续写或保存，车内共创是否贡献明显？|近期试验
沿途观察任务共创|perception creation|movement perception presence|按成员兴趣生成观察任务，利用用户选定的沿途对象组织讨论与作品。例如孩子爱建筑，用沿途对象出题，口述发现。|增加旅途探索和共同注意。|固定旅行任务卡。|成员是否主动观察，任务是否增加疲劳？|近期试验
多人声音解谜剧场|intent creation execution|presence space|成员共同听取并提交声音线索，AI组织合作解谜与适度环境反馈。例如成员听到不同线索，口述推理共同答题。|形成无需各自看屏的共享游戏。|固定语音谜题。|共同参与是否自然，谜题质量是否稳定？|近期试验
航程式商务准备|memory planning creation|movement continuity ecosystem|结合用户选择的会议材料和到达安排，组织听取摘要、待确认事项与停驻工作准备。例如去见客户，听摘要、补充问题，形成会前清单。|利用旅途时间减少会前准备负担。|手机摘要与手动日程安排。|材料理解与任务准备是否改善？|近期试验
创作专注座舱|intent creation execution|space continuity|用户提出创作目标后，AI组织素材、语音灵感和环境主题，保留随时结束的方式。例如停驻写稿，调出相关素材，口述内容接入草稿。|降低短时进入创作状态的准备成本。|手机笔记与固定专注音乐。|是否产出可继续使用的作品，准备成本多大？|近期试验
旅途即时翻译协作|perception intent creation|external presence ecosystem|为乘员与车外人员的交流提供带现场线索的翻译辅助，并说明不确定内容。例如营地交流，结合入口标识翻译并澄清所指位置。|减少陌生语言场合的信息错配。|手机翻译应用。|现场线索是否实质提高交流成功率？|近期试验
多人餐桌式议事|intent creation planning|presence space|安全停驻时，AI整理成员提出的议题、分歧与下一步，形成可修改的共同记录。例如讨论假期预算，复述分歧，保留未决定事项。|减少讨论遗漏与由一人整理的负担。|录音与人工会议笔记。|是否促进真实协商而非强行形成共识？|近期试验
旅途记忆现场回访|memory perception|movement continuity|再次经过用户选择的地点时，唤起有来源的照片或留言，并允许不打扰。例如重返湖边，询问是否回顾，再播放旧片段。|让回忆与真实地点重新连接。|相册日期回忆。|回顾是否被欢迎，何种时机应保持安静？|近期试验
家庭接送临时交棒|intent planning execution|continuity ecosystem movement|接送责任变化时，AI组织地点、时间、用品与对方确认，保留交接进度。例如临时换人接孩子，汇总待办并由接手人确认。|减少临时换人后的信息遗漏。|群聊逐条交代。|交接追问和错接是否减少？|近期试验
车辆服务沟通包|perception memory creation execution|integration continuity ecosystem|把官方状态、用户描述与相关片段整理为可检查的服务材料，并衔接预约。例如预约查异响，补充发生条件后整理时间线。|减少重复描述和服务前准备。|人工记录问题再预约。|材料是否帮助服务人员定位需要检查的事项？|近期试验
长途变化取舍助手|perception intent planning execution|movement ecosystem|延误、天气或成员要求变化后，AI说明保留、缩短或取消活动的影响。例如暴雨影响景点，比较绕行与取消，决定后重排。|帮助用户理解取舍而非只给新路线。|人工对照行程与路况。|是否降低重排负担，是否保留关键目标？|近期试验
游戏观战与家人参与|perception intent creation|presence space|让非玩家通过提问、角色或轻量任务参与停驻游戏，AI将游戏状态转成可理解的共同内容。例如家人不懂战况，简述进展并提供可选助威任务。|减少同车成员被游戏排除的感觉。|旁观或各自使用手机。|非玩家是否愿意参与，玩家是否被打断？|条件预研
用户自定义车辆角色工坊|intent creation emotion|space continuity|用户创作角色形象、表达习惯与声音风格，预览并持续修改车辆伙伴身份。例如设定幽默旅伴，试听其语调、节奏和接话方式，修改后试用；任务准确性与角色表现分别检验。|形成有参与感的个人表达。|固定助手皮肤与声音。|是否持续使用和修改，是否只是一次新鲜感？|近期试验
多车共同旅途电台|intent creation execution|movement ecosystem presence|车队成员分享允许的见闻与留言，AI组织共同节目、会合信息和趣味任务。例如车队分开，留言加入节目，会合时切换协调信息。|把分散车队连接为共同旅程。|对讲机与群聊。|是否降低协调噪声，娱乐是否影响必要信息？|近期试验
宠物同行协作助手|perception memory planning execution|perception space ecosystem|围绕用户明确的宠物同行需要，组织停靠、用品与允许的舒适状态观察。例如带宠物去营地，确认用品并提示照料事项。|减少宠物出行准备与现场照料负担。|手动查地点与检查环境。|是否覆盖真实照料需要，感知误判如何处理？|条件预研
临时访客友好车辆|intent memory|external ecosystem continuity|对允许的访客提供简明上车、使用与联系说明，按车主约定回应疑问。例如朋友首次借车，解释设置，疑问转交车主。|减少首次使用车辆时的追问。|消息说明与电话指导。|是否减少求助，访客是否理解权限？|近期试验
停驻小型演出空间|creation execution|presence space|成员选择角色、音乐和主题，AI组织表演内容与屏幕灯光反馈，形成共同演出。例如孩子演故事，选角色与台词，灯光配合演出。|让空间支持主动表演而非只消费内容。|手机配乐和自行表演。|是否形成自发参与与可留存作品？|近期试验
持续学习的用车习惯解释|perception memory planning|continuity perception|用户查看自身允许留存的用车记录时，AI解释反复出现的安排与变化，不默认推断永久偏好。例如问最近为何常绕路，对照记录解释，纠正后讨论调整。|帮助用户看懂习惯并选择调整。|简单统计报表。|解释是否准确，是否真正影响下一次选择？|近期试验
长期停放自主照料|perception planning execution|integration continuity ecosystem|在车主约定的范围内观察长期停放状态，组织需要的准备、服务提醒或人工协助。例如多日不用车，汇总变化，再确认服务或准备事项。|减少长期不使用车辆时的检查负担。|定期手动查看状态。|是否减少实际问题，通知是否过度？|条件预研
补能途中临时事务|perception intent planning execution|ecosystem movement|在补能等待时间内组织用户选择的取餐、采购或休息安排，并衔接返回。例如等待半小时，选来回可完成的事务并提醒返回。|把等待时间转为可完成的任务窗口。|分别估时和搜索附近地点。|能否完成事务而不增加补能延误？|近期试验
场馆到车辆连续体验|memory creation execution|ecosystem movement space|将用户授权的展览、演出或活动素材带入返程，组织回顾、讨论和相关主题。例如看展返程，选择作品，延伸提问并切换空间主题。|把一次线下活动延伸为共同体验。|手机查看活动资料。|返程延展是否比独立内容更有意义？|条件预研
雨天到达无缝准备|perception planning execution|movement space ecosystem|结合目的地入口、天气与成员需要，组织下车顺序、步行线索和后续衔接。例如雨天到店，先选入口与遮雨处，再衔接下车。|减少到达时临时处理的不便。|导航加口头讨论。|是否改善实际到达过程，信息是否可获得？|近期试验
车辆与停车场协作|planning execution embodiment|motion ecosystem external|在兼容场地内，车辆与设施协调进出、停放和取回，并报告冲突或未完成事项。例如设施接收停车目标，完成协作后反馈位置与费用。|减少用户处理停车过程的步骤。|人工进出和缴费。|设施协作是否稳定，跨场地收益是否成立？|前瞻探索
个性化沉浸健身体验|perception creation execution|space perception|安全停驻时，根据用户选择的轻量活动与动作反馈组织音乐、节奏和空间互动。例如选肩颈活动，按动作调节奏，反馈后降难度或停止。|增加停驻活动参与感。|手机视频跟练。|反馈是否有用，有限空间是否适合目标活动？|条件预研
可共同编辑的家庭车史|memory intent creation|continuity presence|家庭成员挑选与车辆有关的经历，AI组织可共同修订的长期故事。例如车辆纪念日，补充印象，共同修改回顾。|保留共同记忆和不同人的表达。|零散相册与聊天记录。|是否持续补充，是否认可故事准确性？|近期试验
陌生提示的现场解释|perception intent|perception integration|用户询问此刻的提示或现象，AI结合本车可读取证据与官方说明解释。例如问图标为何亮起，指出状态并说明下一步。|减少用户描述和检索负担。|手册搜索与客服电话。|解释是否有据，无法判断时是否清楚说明？|近期试验
停驻专属逃脱游戏|perception intent creation execution|presence space perception|把可用的座舱空间与成员选择转化为虚构线索，形成可随时结束的合作解谜。例如寻找虚拟钥匙，观察空间线索，口述答案。|提供实体空间参与感。|手机逃脱游戏。|空间线索是否增加乐趣，是否导致不合适的操作？|条件预研
车辆自行组织服务到访|planning execution|ecosystem external integration|发现官方可识别的服务需要后，在车主允许范围内组织预约、准备与人员到访确认。例如保养到期，确认到访时间与准备事项后跟踪安排。|减少车主协调服务的步骤。|查看提示并人工预约。|安排是否适当，服务前提和交接是否齐全？|条件预研
出行中的个人灵感伙伴|memory intent creation|movement continuity space|用户口述想法后，AI关联已允许保存的主题与片段，整理可继续创作的草稿。例如口述新点子，关联旧记录，追问后整理提纲。|降低旅途中留住和发展想法的负担。|语音备忘录。|草稿是否被继续使用，错误关联是否增加编辑成本？|近期试验
聚会座舱共同主持|intent creation emotion execution|presence space|安全停驻聚会中，AI按成员选择组织音乐、话题、小游戏与共享主题。例如朋友聚会选主题，需要时提供接话或游戏。|减少主持负担并增加参与。|固定播放列表与手机游戏。|成员是否自发参与，主持是否过度占据交流？|近期试验
无人车辆交接见证|perception creation execution|external perception ecosystem|在允许的物品或服务交接中，车辆整理可核对的到访、交付和异常证据。例如物品送达，汇总时间和片段，车主核对。|减少远程确认与争议材料缺失。|电话与人工拍照。|证据能否支撑实际交接确认？|前瞻探索
营地多车协作用能|intent planning execution|ecosystem integration presence|多个兼容车辆与设备围绕明确的营地用电目标组织预算、协商与异常处理。例如一车余电不足，协商额度后通过兼容设备共享。|减少多人露营能源协调负担。|人工查看设备与分配电源。|协作是否比人工更有效，兼容前提能否满足？|前瞻探索
按情节变化的声音空间|perception creation execution|space presence|理解故事内容与成员选择，组织空间音效与讲述位置，让共同听故事具有场景感。例如角色走向后排，声位随情节变化，成员可选后续。|形成听觉上的共同沉浸。|普通有声书。|空间反馈是否增加理解或乐趣？|条件预研
车内屏幕个人与共同切换|intent planning execution|presence space|理解成员想独享或共同参与的目标，组织屏幕内容与声音范围的可确认切换。例如一起看短片，确认成员后切换屏幕与声音。|减少共享空间中的内容冲突。|每个屏幕独立设置。|是否更快形成可接受的共享安排？|条件预研
行程中的情绪表达支持|intent emotion creation|continuity space|用户主动表达感受时，车辆先澄清希望聊天、听内容还是安静，再用选择的风格与合适语气回应。例如说“今天很烦”，先询问是否想聊，可打断、拒绝或转为安静；情绪线索不等于已准确读懂用户。|提供不强迫解释的陪伴和表达空间。|通用聊天应用或音乐播放。|回应是否有帮助，是否出现过度迎合？|近期试验
跨代共同讲述空间|memory intent creation|presence continuity|长辈讲述与孩子提问共同成为家庭故事，AI整理原话与作品并允许纠正。例如长辈讲往事，孩子追问，补写部分另行标明。|促进真实交流并留住记忆。|录音或固定儿童故事。|是否引发共同对话，生成内容是否忠于讲述？|近期试验
用户设定的车辆仪式|memory creation execution|space continuity|用户定义出发、到达或纪念时刻的声音和主题，AI在允许的条件下组织可调整的仪式。例如纪念日上车，播放选定留言与主题，可跳过修改。|形成有个人意义的长期体验。|固定欢迎动画。|是否持续保留，重复后是否变成打扰？|近期试验
路上见闻的兴趣延展|perception memory planning execution|movement perception ecosystem|用户选定一个沿途对象后，AI组织收藏、相关地点与后续可参与活动的候选。例如看见陶艺店，保存线索，再按选择安排参观。|把即时兴趣连接为可行动的探索。|拍照后自行搜索。|是否产生真实后续行动，推荐是否偏离原意？|近期试验
灵活用途的移动工作间|intent planning execution|space ecosystem|安全停驻时围绕临时工作目标组织资料、设备展示、环境和结束恢复。例如停驻开会，确认资料设备，结束后恢复。|减少进入短时工作的准备成本。|手机热点和手动设置。|是否形成可完成任务的工作条件？|近期试验
任务失败的接管助手|perception planning execution|ecosystem integration|车内任务因网络、订单或设施问题中断时，AI说明已完成部分并组织可恢复的替代方案。例如下单中断，核对是否付款，再选恢复或人工处理。|避免用户重新开始和重复提交。|错误提示后人工处理。|是否减少恢复时间和重复交易？|近期试验
车外探索问答站|perception intent|external perception|安全停驻时，车外人员可围绕允许展示的现场对象与活动提问，车辆提供明确范围内的回应。例如营地问活动位置，结合公开线索指引并支持追问。|让车辆成为可访问的现场信息节点。|手机搜索与固定说明牌。|是否有人主动使用，回应是否适合现场？|条件预研
感知驱动的合作动作游戏|perception creation execution|perception presence space|安全停驻时理解成员选定的动作，组织可暂停的合作游戏与声光反馈。例如两人挥手接虚拟物品，声光反馈配合得分。|把动作参与转化为共同娱乐。|手机体感小游戏。|识别误差是否影响合作，空间是否足够？|条件预研
服务偏好可解释迁移|memory intent planning execution|continuity ecosystem|用户换目的地或服务提供方时，AI用有来源的偏好组织新选择，并让用户修正。例如换餐厅，说明沿用口味与预算，纠正后筛选。|减少重新填写与重复解释。|手动保存偏好并重新搜索。|偏好迁移是否有效，过时偏好能否被识别？|近期试验
整车体验的试验配方|intent creation planning execution|integration space|用户提出希望的主题或驾乘体验，AI组织可预览、可撤回的允许配置候选。例如试雨夜爵士，预览声光组合，确认后保存。|帮助用户探索本车可能的体验组合。|固定驾驶模式和情景模式。|组合是否比固定模式更有价值，配置冲突如何处理？|条件预研
车辆与家庭共同角色|memory intent emotion|continuity ecosystem|家庭定义车辆伙伴的共同身份、表达风格与各成员边界，在车内外服务中维持可调整的一致互动。例如共同选定温和旅伴，对不同成员沿用其偏好，私人记录各自保留；人格一致不意味着所有人偏好相同。|减少共享助手的身份与偏好冲突。|每人独立助手。|共享角色是否受欢迎，各人的边界是否被尊重？|条件预研
目的地主题空间|perception creation execution|movement space|乘客选择目的地主题后，AI把相关内容组织为声音、视觉和适度环境体验。例如去海洋馆，以主题音乐和问答探索目的地。|让旅途成为目的地体验的前奏。|目的地宣传视频。|是否增加探索兴趣，是否只是一时新鲜？|近期试验
围绕真实场景的模拟训练|perception creation|perception space movement|安全停驻时，利用用户选定的真实场景素材生成观察、判断或语言练习。例如用现场路牌练外语，出题讲解，可换难度。|让练习与亲历情境相关。|通用题库应用。|情境关联是否改善学习与持续参与？|近期试验
自主返位与待命|perception planning embodiment|motion integration external|在允许场所完成临时任务后，车辆返回约定位置并确认待命条件。例如营地取送后，返回指定位置并报告待命。|减少用户安排车辆收尾的负担。|人工移车和检查。|自主收尾是否可靠，未知状态能否及时交接？|前瞻探索
`;
export const top100=source.trim().split('\n').map((line,i)=>{const [name,ai,vehicle,summary,outcome,baseline,question,horizon]=line.split('|');return {...sceneNeeds[`TOP-${String(i+1).padStart(3,'0')}`],autonomyMode:([1,5,12,25,31,38,49,50,71,75,80,84,100].includes(i+1)?'约定范围内持续执行（需有效授权与回执）':'用户发起或确认后推进；主动建议需另行定义'),id:`TOP-${String(i+1).padStart(3,'0')}`,rank:i+1,name,ai:ai.split(' '),vehicle:vehicle.split(' '),summary,outcome,baseline,question,horizon,evidence:'价值待验证'};});
export function filterScenes(items,{needs=[],ai=[],vehicle=[],query='',savedOnly=false,saved=[]}={}){const q=query.trim().toLowerCase();return items.filter(s=>(!needs.length||needs.some(k=>s.primaryNeed===k||s.secondaryNeed===k))&&(!ai.length||ai.some(k=>s.ai.includes(k)))&&(!vehicle.length||vehicle.some(k=>s.vehicle.includes(k)))&&(!savedOnly||saved.includes(s.id))&&(!q||[s.name,s.summary,s.outcome,s.baseline,s.question,needDimensions[s.primaryNeed],needDimensions[s.secondaryNeed]||'',...s.ai.map(k=>aiDimensions[k]),...s.vehicle.map(k=>vehicleDimensions[k])].join(' ').toLowerCase().includes(q)));}
export const rankingPrinciples=['预期用户收益是否清楚，能否减少负担或创造值得重复的体验','车用适配理由是否明确，相比手机或传统功能是否有增益','AI是否改变理解、执行、共创或体验，而非只更换入口','能否形成可比较的研究命题，是否值得优先获得证据'];
export function rankReason(s){return `${s.outcome} ${s.rank<=20?'优先验证：用户结果与车用条件关联较直接，但仍需替代方案比较。':s.rank<=50?'第二批验证：潜在增益明确，先确认参与意愿与协同条件。':'探索储备：想象空间较大，先检验需求与必要条件。'}`;}
export function exportPayload(items,saved=[]){return {schemaVersion:6,haiVersion,framework:'用户需求 × AI改变了什么 × 为什么适合车用场景',needDimensions,needNotes,ranking:'蜂舱研究优先级判断，非已验证的价值排名',aiDimensions,vehicleDimensions,rankingPrinciples,shortlist:saved,scenarios:items.map(s=>({...s,rankingReason:rankReason(s),haiDesign:getHAIDesign(s)}))};}
