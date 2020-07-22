let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }

  depend() {
    // 让watcher收集dep
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notice() {
    this.subs.forEach(watcher => watcher.update());
  }

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

