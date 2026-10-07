import english from './locales/en.json' with {type:'json'};
const KEY='beescene-language';
let language='zh';
try{language=localStorage.getItem(KEY)==='en'?'en':'zh';}catch{}
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const phrasePattern=new RegExp(Object.keys(english).filter(s=>/[\u4e00-\u9fff]/.test(s)).sort((a,b)=>b.length-a.length).map(escape).join('|'),'g');
export function getLanguage(){return language;}
export function setLanguage(next){language=next==='en'?'en':'zh';try{localStorage.setItem(KEY,language);}catch{}updateDocument();}
function updateDocument(){if(typeof document==='undefined')return;document.documentElement.lang=language==='en'?'en':'zh-CN';document.title=language==='en'?'BeeScene · Scenario Explorer':'蜂舱 · 场景探索库';}
export function englishText(value){if(typeof value!=='string')return value;if(english[value])return english[value];return value.replace(phrasePattern,match=>english[match]);}
export function t(value){return language==='en'?englishText(value):value;}
updateDocument();
