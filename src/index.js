import { initMixin } from "./instance/init";
import { renderMixin } from "./instance/render";
import { lifecycleMixin } from "./instance/lifecycle";
import { initGlobalAPI } from "./global-api/index";

function Vue(opts) {
  this._init(opts);
}

// Vue原型添加_init方法
initMixin(Vue);
// 添加_render方法
renderMixin(Vue);
lifecycleMixin(Vue);

// 初始化全局变量
initGlobalAPI(Vue);

export default Vue;