export const needDimensions={security:'安心',ease:'省心',comfort:'舒适',delight:'愉悦',expression:'连接与表达'};
export const needNotes={security:'减少担忧与不确定，增强理解和掌控感。',ease:'减少操作与协调负担，把事情办好。',comfort:'改善身心状态，获得休息、恢复或陪伴。',delight:'获得乐趣、沉浸、探索与学习体验。',expression:'共同参与、表达个性、创作并留住经历。'};
// 每行对应原TOP编号：恰好一个主需求，最多一个次需求。关联为研究假设。
const rows=`
1 ease security
2 ease comfort
3 delight
4 delight expression
5 security ease
6 comfort ease
7 ease expression
8 ease security
9 comfort expression
10 comfort ease
11 delight expression
12 ease
13 ease expression
14 ease security
15 delight expression
16 ease
17 expression delight
18 comfort ease
19 ease
20 security ease
21 ease security
22 delight expression
23 security ease
24 ease delight
25 ease comfort
26 comfort security
27 ease comfort
28 ease security
29 expression delight
30 comfort expression
31 security ease
32 ease
33 delight expression
34 ease security
35 ease comfort
36 ease security
37 comfort ease
38 ease security
39 ease
40 expression delight
41 ease security
42 ease
43 delight comfort
44 ease security
45 security expression
46 ease security
47 ease comfort
48 comfort security
49 ease
50 security ease
51 delight expression
52 delight
53 expression delight
54 delight expression
55 delight expression
56 ease
57 expression ease
58 ease expression
59 expression ease
60 expression delight
61 ease security
62 ease security
63 ease security
64 expression delight
65 expression delight
66 expression ease
67 ease comfort
68 ease security
69 expression delight
70 security ease
71 security ease
72 ease
73 delight expression
74 ease comfort
75 ease
76 comfort delight
77 expression
78 security ease
79 delight expression
80 ease security
81 expression ease
82 expression delight
83 security ease
84 ease security
85 delight expression
86 ease expression
87 comfort expression
88 expression
89 expression comfort
90 delight ease
91 ease comfort
92 ease security
93 delight ease
94 delight expression
95 ease
96 expression delight
97 expression comfort
98 delight
99 delight
100 ease security
`;
export const sceneNeeds=Object.fromEntries(rows.trim().split('\n').map(row=>{const [rank,primaryNeed,secondaryNeed]=row.trim().split(/\s+/);return [`TOP-${rank.padStart(3,'0')}`,{primaryNeed,secondaryNeed:secondaryNeed||null}];}));
