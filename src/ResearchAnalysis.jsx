import React from 'react';
import {L} from './MarketEvidence';
import {countryLabels} from './scenarios';

export function CountryBadge({s}){return s.country&&countryLabels[s.country]?<span className="country-badge">{L('所在国家：','Country: ')}{L(...countryLabels[s.country])}</span>:null;}
const fields=[
 ['localContext','德国市场背景','German market context'],
 ['differentiation','差异化与场景边界','Differentiation and task boundary'],
 ['audience','目标用户','Target users'],
 ['visualTargets','感知对象与必要信息','Perception targets and required information'],
 ['aiContribution','AI的具体增益','Specific AI contribution'],
 ['dependencies','实现条件','Implementation requirements'],
 ['failureBoundary','容易失败的条件','Failure conditions'],
 ['valueHypothesis','接受度、频率与商业假设','Acceptance, frequency and commercial hypotheses'],
 ['deployment','模型与部署思路','Models and deployment'],
 ['costs','实现与维护代价','Implementation and maintenance costs'],
 ['validation','比较实验与验证指标','Comparison experiments and metrics'],
 ['decisionGates','继续、缩小与暂停条件','Continue, narrow or pause'],
 ['patentReview','专利核查边界','Patent-review limits']
];
export default function ResearchAnalysis({s}){
 if(!s.research)return null;
 return <section className="detail-block germany-research"><h3>{L('完整场景分析','Complete scenario analysis')}</h3><CountryBadge s={s}/><dl>{fields.map(([key,zh,en])=><React.Fragment key={key}><dt>{L(zh,en)}</dt><dd>{L(...s.research[key])}</dd></React.Fragment>)}</dl><p className="helper">{L('背景规则与已实现功能分开核查。行业应用现状可从场景卡片打开，查看车型与服务来源。','Context rules and implemented features are reviewed separately. Open industry adoption from the card for models and service references.')}</p>{s.research.sources.map(r=><p key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{L(r.title,r.titleEn)} ↗</a></p>)}</section>;
}
