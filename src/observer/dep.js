let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }

  // 让watcher收集dep 
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  // 通知watcher进行更新
  notice() {
    this.subs.forEach(watcher => watcher.update());
  }

  // 添加watcher
  addSub(target) {
    this.subs.push(target);
  }
}
Dep.target = null;

const targetStack = []

export function pushTarget(target) {
  Dep.target = target;
  targetStack.push(target);
}

export function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

export default Dep;

