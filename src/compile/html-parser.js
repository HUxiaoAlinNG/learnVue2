// Regular Expressions for parsing tags and attributes
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);  // 匹配标签开头，捕获标签名
const startTagClose = /^\s*(\/?)>/;  // 匹配标签结尾的>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配标签结尾，捕获标签名

// 元素类型为 1
export const ELEMENT_TYPE = 1;
// const TEXT_EXPRESSTION_TYPE = 2;  // 在code-gen.js实现
// 文本类型为 3
export const TEXT_TYPE = 3;
let root;
let currentParent;
// 用栈的方式构造父子关系
const stack = [];

// 创建ast树
function createASTElement(tag, attrs) {
  return {
    type: ELEMENT_TYPE,
    tag,
    attrsList: attrs,
    parent: null,
    children: []
  }
}

function start(tag, attrs) {
  const element = createASTElement(tag, attrs);
  if (!root) {
    root = element;
  }
  currentParent = element;
  stack.push(element);
}

function end() {
  const element = stack.pop();
  // 获取element的父级element
  currentParent = stack[stack.length - 1];
  if (currentParent) {
    element.parent = currentParent;
    currentParent.children.push(element);
  }
}

// 解析文本为ast
function chars(text) {
  text = text.replace(/\s/g, "");
  if (text) {
    // currentParent由start函数赋值所得
    currentParent.children.push({
      text,
      type: TEXT_TYPE,
    });
  }
}

// 解析dom元素为ast语法树
export function parseHTML(html) {
  console.log("===", html)
  while (html) {
    let textEnd = html.indexOf("<");
    // 标签开头< (可能为开始标签或结束标签)
    if (textEnd === 0) {
      const startMatch = parseStartTag();
      if (startMatch) {
        start(startMatch.tagName, startMatch.attrs);
        continue;
      }
      // 解析结束标签
      const endMatch = html.match(endTag);
      if (endMatch) {
        advance(endMatch[0].length);
        end();
        continue;
      }
    }
    // 解析文本
    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
      advance(text.length);
      chars(text);
    }
  }

  // 解析开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length);

      let end, attr;
      // 匹配标签内属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({ name: attr[1], value: attr[3] });
        advance(attr[0].length);
      }
      // 结束标签 >
      end && advance(end[0].length);
      return match;
    }
  }

  // 删除已匹配到的
  function advance(n) {
    html = html.substring(n)
  }
  return root;
}

