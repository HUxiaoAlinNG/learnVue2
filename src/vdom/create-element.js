import { isObject } from "../util/index";
import { vnode } from "./vnode";

function makeMap(
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

const isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
const isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

// 判断是否为 原始标签
const isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};


export function createElement(vm, tag, data = {}, ...children) {
  const key = data.key;
  if (key) {
    delete data.key;
  }
  // 原始标签，直接创建
  if (isReservedTag(tag)) {
    return vnode(tag, data, key, children);
  }
  // 组件
  let Ctor = vm.$options.components[tag];
  return createComponent(vm, tag, data, key, children, Ctor)
}

export function createComponent(vm, tag, data = {}, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = { // 组件的生命周期钩子
    init(vnode) {
      let child = vnode.componentInstance = new Ctor({});
      child.$mount(); // 组件的挂载
    }
  }
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, [], { Ctor, children })
}

export function createTextVNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}

