---
title: Promise的多并发问题
date: 2024-08-16
tags:
  - js
---

假设现在有 6 个并发，我设置最大并发为 2，那么我将会走下面这些步骤：

1、先定好三个坑位
2、让前两个并发进去坑位执行
3、看哪个坑位并发先执行完，就从剩余的并发中拿一个进去补坑
4、一直重复第 3 步，一直到所有并发执行完

在进行多并发的时候，我们通常会使用Promise.all，但是Promise.all并不能控制并发，或者说它本来就没这个能力，我们可以看下面的例子

```js
const fetchFn = (delay, index) => {
  return new Promise(resolve => {
    console.log(index)
    setTimeout(() => {
      resolve(index)
    }, delay);
  })
}


const promises = [
  fetchFn(1000, 1),
  fetchFn(1000, 2),
  fetchFn(1000, 3),
  fetchFn(1000, 4),
  fetchFn(1000, 5),
  fetchFn(1000, 6)
]

Promise.all(promises)
```

最后是同时输出，这说明这几个并发是同时发生的

所以我们需要做一些改造，让Promise.all执行 promises 时支持控制并发，但是我们改造的不应该是Promise.all，而是这一个个的fetchFn

## 期望效果

```js
const limitFn = (limit) => {
  // ...coding
}

// 最大并发数 2
const generator = limitFn(2)


const promises = [
  generator(() => fetchFn(1000, 1)),
  generator(() => fetchFn(1000, 2)),
  generator(() => fetchFn(1000, 3)),
  generator(() => fetchFn(1000, 4)),
  generator(() => fetchFn(1000, 5)),
  generator(() => fetchFn(1000, 6))
]

Promise.all(promises)
```
<img src="/public/dbf.gif" />

## 实现 limitFn
我们需要在函数内部维护两个变量：

- queue：队列，用来存每一个改造过的并发
- activeCount： 用来记录正在执行的并发数

并声明函数 generator ，这个函数返回一个 Promise，因为 Promise.all 最好是接收一个 Promise 数组

```js
const limitFn = (concurrency) => {
  const queue = [];
  let activeCount = 0;

  const generator = (fn, ...args) =>
    new Promise((resolve) => {
      enqueue(fn, resolve, ...args);
    });

  return generator;
};
```

接下来我们来实现 enqueue 这个函数做两件事：

- 将每一个 fetchFn 放进队列里
- 将坑位里的 fetchFn 先执行

```js
const enqueue = (fn, resolve, ...args) => {
  queue.push(run.bind(null, fn, resolve, ...args));

  if (activeCount < limit && queue.length > 0) {
    queue.shift()();
  }
};
```

假如我设置最大并发数为 2，那么这一段代码在一开始的时候只会执行 2 次，因为一开始只会有 2 次符合 if 判断，大家可以思考一下为什么~

```js
  if (activeCount < limit && queue.length > 0) {
    queue.shift()(); // 这段代码
  }
```

一开始执行 2 次，说明这时候两个坑位已经各自有一个 fetchFn 在执行了
接下来我们实现 run 函数，这个函数是用来包装 fetch 的，他完成几件事情：

1. 将 activeCount++ ，这时候执行中的并发数 +1
2. 将 fetchFn 执行，并把结果 resolve 出去，说明这个并发执行完了
3. 将 activeCount--，这时候执行中的并发数 -1
4. 从 queue 中取一个并发，拿来补坑执行

```js
const run = async (fn, resolve, ...args) => {
  activeCount++;

  const result = (async () => fn(...args))();


  try {
    const res = await result;
    resolve(res);
  } catch { }

  next();
};
```

其实第 3、4 步，是在 next 函数里面执行的

```js
const next = () => {
  activeCount--;

  if (queue.length > 0) {
    queue.shift()();
  }
};
```

## 完整代码

```js
const limitFn = (limit) => {
  const queue = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;

    if (queue.length > 0) {
      queue.shift()();
    }
  };

  const run = async (fn, resolve, ...args) => {
    activeCount++;

    const result = (async () => fn(...args))();


    try {
      const res = await result;
      resolve(res);
    } catch { }

    next();
  };

  const enqueue = (fn, resolve, ...args) => {
    queue.push(run.bind(null, fn, resolve, ...args));

    if (activeCount < limit && queue.length > 0) {
      queue.shift()();
    }
  };

  const generator = (fn, ...args) =>
    new Promise((resolve) => {
      enqueue(fn, resolve, ...args);
    });

  return generator;
};
```