import { initMixin } from "./instance/init";
import { renderMixin } from "./instance/render";
import { lifecycleMixin } from "./instance/lifecycle";

function Vue(opts) {
  this._init(opts);
}

// Vue原型添加_init方法
initMixin(Vue);
// 添加_render方法
renderMixin(Vue);
lifecycleMixin(Vue);

export default Vue;