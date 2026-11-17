/* Add future questions here. No game-flow changes are needed.
   type: 'choice' (options + answer index) or 'fill' (numeric answer).
   prompt/explanation/answerDisplay accept trusted, locally authored HTML/MathML.
   diagram: 'cube', 'axes', or omit. See 題庫格式.md for details. */
(function (root) {
  const m = body => `<math xmlns="http://www.w3.org/1998/Math/MathML">${body}</math>`;
  const v = name => `<mover accent="true"><mi>${name}</mi><mo>→</mo></mover>`;
  const n = value => `<mn>${value}</mn>`;
  const coord = values => `<mo>(</mo>${values.map(n).join('<mo>,</mo>')}<mo>)</mo>`;
  const a = v('a'), b = v('b');
  const QUESTIONS = [
    {
      id:'vector-cube', section:'1.1 空間向量及其運算', type:'choice', diagram:'cube',
      prompt:`如圖，在正方體 ABCD–A₁B₁C₁D₁ 中，<div class="display-math">${m(`${v('AB')}<mo>+</mo>${v('AD')}<mo>+</mo>${v('AA₁')}<mo>=</mo><mo>？</mo>`)}</div>`,
      options:[m(v('AC')),m(v('AC₁')),m(v('BD₁')),m(v('CA₁'))], answer:1,
      answerDisplay:m(v('AC₁')),
      explanation:`先在底面使用平行四邊形法則：${m(`${v('AB')}<mo>+</mo>${v('AD')}<mo>=</mo>${v('AC')}`)}。再加上與 ${m(v('CC₁'))} 相等的 ${m(v('AA₁'))}，便得到由 A 指向 C₁ 的體對角線向量 ${m(v('AC₁'))}。`
    },
    {
      id:'dot-product', section:'1.3 空間向量的坐標表示', type:'fill',
      prompt:`已知 ${m(`${a}<mo>=</mo>${coord([1,2,'−1'])}`)}，${m(`${b}<mo>=</mo>${coord([2,0,3])}`)}，求<div class="display-math">${m(`${a}<mo>·</mo>${b}<mo>=</mo><mo>？</mo>`)}</div>`,
      answer:-1, answerDisplay:m(n('−1')),
      explanation:`對應坐標相乘後相加：<div class="display-math">${m(`${a}<mo>·</mo>${b}<mo>=</mo><mn>1</mn><mo>×</mo><mn>2</mn><mo>+</mo><mn>2</mn><mo>×</mo><mn>0</mn><mo>+</mo><mo>(</mo><mn>−1</mn><mo>)</mo><mo>×</mo><mn>3</mn><mo>=</mo><mn>−1</mn>`)}</div>`
    },
    {
      id:'vector-modulus', section:'1.3 空間向量的坐標表示', type:'fill',
      prompt:`已知 ${m(`${a}<mo>=</mo>${coord([2,'−1',2])}`)}，求向量的模：<div class="display-math">${m(`<mo>|</mo>${a}<mo>|</mo><mo>=</mo><mo>？</mo>`)}</div>`,
      answer:3, answerDisplay:m(n(3)),
      explanation:`向量的模等於三個坐標的平方和的平方根：<div class="display-math">${m(`<mo>|</mo>${a}<mo>|</mo><mo>=</mo><msqrt><msup><mn>2</mn><mn>2</mn></msup><mo>+</mo><msup><mrow><mo>(</mo><mn>−1</mn><mo>)</mo></mrow><mn>2</mn></msup><mo>+</mo><msup><mn>2</mn><mn>2</mn></msup></msqrt><mo>=</mo><msqrt><mn>9</mn></msqrt><mo>=</mo><mn>3</mn>`)}</div>`
    },
    {
      id:'perpendicular', section:'1.3 空間向量的坐標表示', type:'fill',
      prompt:`已知 ${m(`${a}<mo>=</mo>${coord([1,2,'−1'])}`)}，${m(`${b}<mo>=</mo><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>,</mo><mn>4</mn><mo>)</mo>`)}。若 ${m(`${a}<mo>⊥</mo>${b}`)}，求 ${m('<mi>k</mi>')}。`,
      answer:1, answerDisplay:m('<mi>k</mi><mo>=</mo><mn>1</mn>'),
      explanation:`兩個非零向量垂直時，數量積為 0。因此 ${m('<mn>2</mn><mo>+</mo><mn>2</mn><mi>k</mi><mo>−</mo><mn>4</mn><mo>=</mo><mn>0</mn>')}，解得 ${m('<mi>k</mi><mo>=</mo><mn>1</mn>')}。`
    },
    {
      id:'basis', section:'1.2 空間向量基本定理', type:'choice', diagram:'axes',
      prompt:'下列哪一組向量可以作為空間的一組基底？',
      options:[m(`${coord([1,0,0])}<mo>,</mo>${coord([0,1,0])}<mo>,</mo>${coord([1,1,0])}`),m(`${coord([1,0,0])}<mo>,</mo>${coord([0,1,0])}<mo>,</mo>${coord([0,0,1])}`),m(`${coord([1,0,0])}<mo>,</mo>${coord([2,0,0])}<mo>,</mo>${coord([0,0,1])}`),m(`${coord([0,0,0])}<mo>,</mo>${coord([0,1,0])}<mo>,</mo>${coord([0,0,1])}`)],answer:1,
      answerDisplay:'B：三個坐標軸方向的單位向量',
      explanation:'空間的一組基底須由三個不共面的向量組成。B 中三個向量分別沿 x、y、z 軸，互相垂直且均非零。A 的三個向量在 xy 平面內；C 有兩個共線向量；D 包含零向量。'
    },
    {
      id:'line-plane-angle', section:'1.4 空間向量的應用', type:'choice',
      prompt:`直線的方向向量為 ${m(`${a}<mo>=</mo>${coord([1,0,1])}`)}，平面的法向量為 ${m(`${v('n')}<mo>=</mo>${coord([0,0,1])}`)}。直線與平面所成的角是：`,
      options:['30°','45°','60°','90°'],answer:1,answerDisplay:'45°',
      explanation:`設直線與平面所成的角為 ${m('<mi>θ</mi>')}，則 ${m(`<mi>sin</mi><mi>θ</mi><mo>=</mo><mfrac><mrow><mo>|</mo>${a}<mo>·</mo>${v('n')}<mo>|</mo></mrow><mrow><mo>|</mo>${a}<mo>|</mo><mo>|</mo>${v('n')}<mo>|</mo></mrow></mfrac><mo>=</mo><mfrac><mn>1</mn><msqrt><mn>2</mn></msqrt></mfrac>`)}。所以直線與平面的夾角是 45°。`
    },
    {
      id:'point-plane-distance', section:'1.4 空間向量的應用', type:'fill',
      prompt:`平面 α 的方程為 ${m('<mi>z</mi><mo>=</mo><mn>2</mn>')}。求點 ${m(`<mi>P</mi>${coord([1,'−1',5])}`)} 到平面 α 的距離。`,
      answer:3,answerDisplay:m(n(3)),
      explanation:`平面 ${m('<mi>z</mi><mo>=</mo><mn>2</mn>')} 平行於 xy 平面，垂足是 ${m(`<mi>H</mi>${coord([1,'−1',2])}`)}。所以距離 ${m('<mi>d</mi><mo>=</mo><mo>|</mo><mn>5</mn><mo>−</mo><mn>2</mn><mo>|</mo><mo>=</mo><mn>3</mn>')}。`
    },
    {
      id:'vector-angle', section:'1.1 空間向量及其運算', type:'choice',
      prompt:`已知 ${m(`<mo>|</mo>${a}<mo>|</mo><mo>=</mo><mn>2</mn>`)}，${m(`<mo>|</mo>${b}<mo>|</mo><mo>=</mo><mn>3</mn>`)}，且 ${m(`${a}<mo>·</mo>${b}<mo>=</mo><mn>3</mn>`)}。求兩向量的夾角。`,
      options:['30°','45°','60°','120°'],answer:2,answerDisplay:'60°',
      explanation:`由數量積公式，${m(`<mi>cos</mi><mi>θ</mi><mo>=</mo><mfrac><mrow>${a}<mo>·</mo>${b}</mrow><mrow><mo>|</mo>${a}<mo>|</mo><mo>|</mo>${b}<mo>|</mo></mrow></mfrac><mo>=</mo><mfrac><mn>3</mn><mrow><mn>2</mn><mo>×</mo><mn>3</mn></mrow></mfrac><mo>=</mo><mfrac><mn>1</mn><mn>2</mn></mfrac>`)}，所以夾角為 60°。`
    }
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = QUESTIONS;
  else root.QUESTION_BANK = QUESTIONS;
})(typeof window !== 'undefined' ? window : globalThis);
