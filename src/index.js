import { initMixin } from "./instance/init";

function Vue(opts) {
  this._init(opts);
}

// Vue原型添加_init方法
initMixin(Vue);

export default Vue;