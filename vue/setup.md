---
title: setup() 和 <script setup> 的区别
date: 2024-08-30
tags:
  - vue
---

## [使用 setup() 函数的效果：](https://play.vuejs.org/#eNp9Uk1vwjAM/StZLoBAILSdUKn2IQ7bYZu2HXPpitsFQlIlDkOq+O9zEgo9bLu0sd/L87Pjlt81zXTvgS94hrBrVIGQC81Y9ukRjWa3pZLldil4+VXoGgTPx/NslsBEXMt93rYM4YDseMxmIQ4A5SpV1JQTOpv1xCl0pZUNMkWSJI2OZIWWu8ZYZC2zUE3WUEkND4ZyGjQps8qaHRuQ14HQcIhUIhVexX+fPGxDfQfom+GIxYCx0miHydEyVBhWhXIwSqACTA0s2Xw+DxYvV1LjhJDWMu/kWOKPx10YlKf7QvlAvbpECacZpIMlV1ZfVAJx0pc8B6eBd9fj50h+s1maXs4nNDnyWMl6unFG0xtGWXormoRUYF8alNSD4IuuoOCFUub7KebQejiVC+8L5faX/MYdQk7wVwsO7J5W4IxhYWvABK/en8l9D9yZtVfE/gd8A2eUDx4T7d7rNdnu8aLbx7gYUtcfbnVA0K5rKhiNk4l8wWk5whL81frF7vX0ppsoP/4AHwL67A==)

<img src="/public/setup.gif" />

```html
<template>
  <button @click="change">+1</button>
  <div>{{ text }}</div>
  {{ flag }}
</template>

<script lang="ts">
import { ref,defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const flag = ref(false)
    let text = 111

    const change = () => {
      text ++
      flag.value = !flag.value
    }

    return {
      flag,
      text,
      change
    }
  }
})
</script>
```

## [使用 \<script setup> 时的效果：](https://play.vuejs.org/#eNp9kc1uwjAQhF/F9QUQCBS1J5RE/RGH9tBWbY++pGETAo4d2esUKcq7d22LwqHiFs+Mx99uBv7QdcveAV/zFKHtZIGQC8VY+u0QtWL3pWzKQyZ4uStUDYLn8yRdRTMGt02fDwNDOCIbx3Tlz94grZJFTZpQ6eqinI62NE2HzAK6jkkqpgfQUrlQTdtpg2xgBio2ssrolk2IcOIvllpZjLWZD0yrQlqYCSUBI0HGkiQ5RyM1qdMZy3I2eLCQm8/9p29a9oV0PnJzPgkVoCNmzhcER31VUy/3VitaViiipei2aySYtw4bek/wdXzCe4WU+uclaGgcLE56uYPy8I++t0evCf5uwILpadd/HhamBoz25vOVBrgwW711ktJXzA+wWjrPGGOPTm0J+yIXaJ/D7htVf9nNEUHZ01Ae1CfHkBec/sfTldHPuLfLu3CPFsrHXwsZznw=)

<img src="/public/setup1.gif" />

```html
<template>
  <button @click="change">+1</button>
  <div>{{ text }}</div>
  {{ flag }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flag = ref(false)
let text = 111

const change = () => {
  text ++
  flag.value = !flag.value
}
</script>
```

两段代码看上去几乎一模一样，但在运行时却会发现，使用 <b style="color: red">setup()</b> 函数的版本中页面中 <b style="color: red">text</b> 的值不会变化，而 <b style="color: red">\<script setup></b> 版本中页面中 <b style="color: red">text</b> 的值会变化。为了理解这种现象，我决定查看编译后的产物。

## setup()产物

```js
export default {
  setup() {
    const flag = ref(false);
    let text = 111;

    const change = () => {
      text++;
      flag.value = !flag.value;
    };

    return {
      flag,
      text,  // 这里是值传递
      change
    };
  }
}
```
在 <b style="color: red">setup()</b> 函数中，返回的 <b style="color: red">text</b>  是一个普通的局部变量。通过值传递的方式在返回对象中暴露出来。因此，当 <b style="color: red">text</b>  的值变化时，由于它不是响应式的，Vue 无法追踪到这种变化，也就不会触发视图的更新。

## \<script setup>产物

```js
const __sfc__ = /*#__PURE__*/defineComponent({
  setup(__props, { expose }) {
    expose();

    const flag = ref(false);
    let text = 111;

    const change = () => {
      text++;
      flag.value = !flag.value;
    };

    return { flag, get text() { return text }, set text(v) { text = v }, change };
  }
})
```

在 <b style="color: red">\<script setup></b> 中，编译器会为顶层变量自动生成  <b style="color: red">getter 和 setter</b>，即使这些变量本身不是响应式的。这样一来，每次渲染时模板会通过  <b style="color: red">getter</b> 获取最新值，因此表现出类似响应式的效果。