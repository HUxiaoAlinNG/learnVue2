import { ELEMENT_TYPE, TEXT_TYPE } from "./html-parser";
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;   // 匹配{{}}文本，vue模板语言
// _c 创建element函数，第一个传参为：标签名；第二个传参为 attrs；第三个传参为 子元素
// _v 纯粹文本函数
// _s 取data数据的函数
export function generate(ast) {
  let code = genElement(ast);
  return `with(this){return ${code}}`;
}

// 生成_c函数
function genElement(el) {
  return `_c("${el.tag}",${genProps(el.attrsList)},${genChildren(el)})`;
}

// 解析attrs属性
function genProps(attrsList) {
  if (!attrsList.length) {
    return "undefined";
  }
  let attrsStr = "";
  attrsList.forEach(attr => {
    // style特殊处理,如  style="color: red;height:800px"  => style:{"color":" red","height":"800px"}
    if (attr.name === "style") {
      let obj = {};
      attr.value.split(";").forEach(val => {
        const valSplit = val.split(":");
        if (valSplit.length === 2) {
          obj[valSplit[0]] = valSplit[1];
        }
      });
      attr.value = obj;
    }
    attrsStr += `${attr.name}:${JSON.stringify(attr.value)},`;
  });
  return `{${attrsStr.slice(0, -1)}}`;
}

// 解析children
function genChildren(el) {
  const children = el.children;
  if (children && children.length) {
    return `${children.map(c => gen(c)).join(',')}`
  }
  return "";
}

function gen(node) {
  if (node.type === ELEMENT_TYPE) {
    return genElement(node);
  } else if (node.type === TEXT_TYPE) {
    const text = node.text;
    if (!defaultTagRE.test(node.text)) {
      return `_v(${JSON.stringify(text)})`;
    }
    // 将 "ab {{name}} cd {{text}}" 转换为 "ab +_s(name) +cd +_s(text)"
    const token = [];
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex
    let lastIndex = 0;
    defaultTagRE.lastIndex = 0;
    let match;
    while ((match = defaultTagRE.exec(text))) {
      if (match.index > lastIndex) {
        token.push(JSON.stringify(text.slice(lastIndex, match.index)))
      }
      token.push(`_s(${match[1].trim()})`);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      token.push(JSON.stringify(text.slice(lastIndex)));
    }
    return `_v(${token.join("+")})`;
  }
}