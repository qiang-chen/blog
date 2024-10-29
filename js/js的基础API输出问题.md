---
title: js的基础API输出问题
date: 2024-10-29
tags:
  - js
---

## 案例 1

```js
let a = 2;
let o = {
  a: 2,
  f(n) {
    const b = (n) => {
      this.a = n++;
    };
    return b;
  },
};

let x = o.f;
let y = x(3);
let z = y(4);
console.log(x.a); // undefined 
console.log(y.a); // undefined 
console.log(z.a); // 报错
console.log(o.a); // 2
console.log(window.a); // 4
```

### 说明

let x = o.f; 此时 x是 一个函数f 
相当于 这种写法 x = f(n) {
    const b = (n) => {
      this.a = n++;
    };
    return b;
}

<b style="color:red"> 这一步得出结论 x= 函数  函数.a 没有！  输出undefined </b>

let y = x(3); 
这一步 相当于 执行上面的 函数  注意 f函数 是一个 闭包  执行下去后 返回一个b函数 也就是说 这个3 并没有使用, 所以说 y就是里面的b函数 const b = (n) => {
      this.a = n++;
};

<b style="color:red"> 这一步得出结论 y= 函数  函数.a 没有！  输出undefined </b>

继续执行 let z = y(4);

那么执行到了 this 此时的this指向的是window，往下执行会发现 n++； 这里注意 n++ 和 ++n 的区别

- ++n（前增）：在表达式求值之前增加n的值，表达式的值是增加后的n。
- n++（后增）：在表达式求值之后增加n的值，表达式的值是增加前的n。

```js
function getValue() {
  let n = 1;
  return ++n; // 返回 2
}

function getAnotherValue() {
  let n = 1;
  return n++; // 返回 1
}
```

那么 通过上面的例子说明 这一步 给window上面赋值了一个a   然后这个a= 4,z又是这个b函数的返回值，但是b函数没有返回值  那么 z就是undefined

<b style="color:red"> 这一步得出结论 b= z就是undefined  z就是undefined.a 报错 ！</b>

此时所有的步骤执行完毕了 去除了console.log(z.a) 报错这一行继续往下看， console.log(o.a) 看到了o.a 上面的步骤说过了 并没有改过o上面的a 所以原本 输出 2

console.log(window.a) 上面步骤说过了 this.a = 4 那时候的this就是window 也就是说window.a = 4