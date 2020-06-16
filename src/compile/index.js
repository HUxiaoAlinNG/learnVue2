import { parseHTML } from "./html-parser";
import { generate } from "./code-gen";

// 1.将html解析为ast(抽象语法树)
// 2.将ast转换为render函数
export function compileToFunctions(template) {
  const ast = parseHTML(template);
  console.log("ast", ast);
  const code = generate(ast);
  return new Function(`${code}`);
}