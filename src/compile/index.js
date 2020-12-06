import { parseHTML } from "./html-parser";
import { generate } from "./code-gen";

// 1.将html解析为ast(抽象语法树)
// 2.将ast转换为render函数
export function compileToFunctions(template) {
  const ast = parseHTML(template);
  const code = generate(ast);

  console.log("原始template片段为\n", template, "\n解析出来的ast为\n", ast, "\n生成的render code为\n", code);
  // new Function + with
  return new Function(`${code}`);
}