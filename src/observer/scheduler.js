import { nextTick } from "../util/next-tick";

const has = {};
const queue = [];

let waiting = false;

// 清空
function flushSchedulerQueue() {
  queue.forEach(watcher => {
    has[watcher.id] = null;
    watcher.run()
  });
  queue.length = 0;
}

// 将watcher塞入队列
export function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    has[id] = true;
    if (!waiting) {
      queue.push(watcher);
      nextTick(flushSchedulerQueue)
    }
  }
}