---
title: ref & reactive
date: 2024-08-13
tags:
  - vue
---

## reactive

首先，reactive() 的参数必须是一个对象，返回值是一个 Proxy 对象，具有响应性。如果参数不是对象类型，会提示：<strong style='color: red'>Value cannot be made reactive</strong>

我们多次对同一个对象使用 reactive 进行代理，返回的是相同的代理对象，也就是说使用的是缓存的值。而且，取值时直接读取属性就行，不需要加 .value 。

举个例子：

```js
import { reactive } from 'vue'
const state = reactive({ count: 0 })
console.log(state.count) // 0

const name = reactive('hh')
console.log('name', name) // warn: value cannot be made reactive: hh

const raw = {}
const proxy = reactive(raw)
console.log(proxy === raw) // false
// calling reactive() on the same object returns the same proxy
console.log(reactive(raw) === proxy) // true
// calling reactive() on a proxy returns itself
console.log(reactive(proxy) === proxy) // true
```

接下来说下 reactive 的局限性。

首先，参数只支持 object 类型 (比如 objects, arrays, Map, Set)，不支持基础数据类型，比如string, number 或boolean；

其次，对变量重新赋值会丢失响应性，比如：

```js
let state = reactive({ count: 0 })
// the above reference ({ count: 0 }) is no longer being tracked
// (reactivity connection is lost!)
state = reactive({ count: 1 })
```
再者，解构赋值容易丢失响应性：

```js
const state = reactive({ count: 0 })

// count is disconnected from state.count when destructured.
let { count } = state
// does not affect original state
count++
```
这种情况下，我们可以使用 toRefs 函数来将响应式对象转换为 ref 对象。

```js
import { toRefs } from 'vue';

const state = reactive({ count: 0 });
let { count } = toRefs(state);
count++; // count 现在是 1
```

## ref

再来看下 ref() 。reactive 和 ref 都是声明响应式变量的写法，但是，ref 的参数既可以是基本数据类型的值，也可以是对象，很自由！<strong style='color: red'>这就是为什么我们在开发时更推荐使用 vue3 的 ref 的原因了。</strong>

而且，ref 声明的变量在取值时必须加上 .value，而在 template 调用时中不加。

举个例子：

```js
const {ref, effect} = Vue

const name = ref('张三')
console.log('name', name.value) // name 张三

const state = ref({ count: 0 })
console.log('state', state.value.count) // state 0
```

### ref 源码

了解了这两个 API 的用法后，接下来我们深入源码看下为什么。

ref() 中调用的是 createRef(value, false)，在这个函数中，首先判断属性 __v_isRef 是否为 true，为 true 说明是 Ref 类型的值，直接返回；否则，返回的是 RefImpl 类的实例。

#### 类的 get 和 set

再来看 RefImpl 类，重点是类中定义了 get 函数和 set 函数。当我们对类实例的 value 属性取值和赋值时，就会触发这两个函数。

```js
// ref.ts

export function ref(value?: unknown) {
  return createRef(value, false)
}

function createRef(rawValue: unknown, shallow: boolean) {
  // 判断属性 __v_isRef 是否为 true，为 true 说明是 Ref 类型的值，直接返回
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T
  // 依赖项
  public dep?: Dep = undefined
  // 属性 __v_isRef 设置为 true
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    // 依赖收集
    trackRefValue(this)
    // 返回值
    return this._value
  }

  set value(newVal) {
    const useDirectValue =
      this.__v_isShallow || isShallow(newVal) || isReadonly(newVal)
    newVal = useDirectValue ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = useDirectValue ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
```

举个简单的例子理解下类中的 get 和 set 函数：

```js
class RefImpl {
  // ref实例的getter行为
  get value () {
    console.log('get');
    return '111'
  }
  // ref实例的setter行为
  set value (val) {
    console.log('set');
  }
}

const ref = new RefImpl()

ref.value = '123'
ref.value
```

这里我们定义了 RefImpl 类，当我们对 ref.value 赋值时，会打印 set；当我们调用 ref.value 时，会打印 get。因此，我们不难理解为什么 Vue3 的 ref() 要加上 .value 了，因为也是使用了类中的 getter 和 setter 的写法！

此外，ref() 最终的返回值是 this._value，我们再来看下这部分的代码。这里是判断属性 __v_isShallow 是否为 true，为true 则直接返回，否则经过 toReactive() 处理下再返回。

```js
this._value = __v_isShallow ? value : toReactive(value)
```

#### toReactive()

我们看下这个函数发生了什么。可以看到，如果参数是对象类型，则使用 reactive() 处理一下并返回；否则直接返回这个参数。

而 reactive() 中，我们是返回一个对象的 Proxy 对象，这个 Proxy 对象具有响应性，可以监听到我们对对象属性的读取和修改。值得一提的是，这里的 reactive() 正是 上面说到的声明响应性变量的 reactive() ！也就是说，ref 的底层也用到了 reactive() ，二者是相通的，只不过 ref 多包装了一层，支持了基本数据类型的值。

```ts
// reactive.ts

/**
 * Returns a reactive proxy of the given value (if possible).
 *
 * If the given value is not an object, the original value itself is returned.
 *
 * @param value - The value for which a reactive proxy shall be created.
 */
export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value

/**
 * Returns a reactive proxy of the object.
 *
 * The reactive conversion is "deep": it affects all nested properties. A
 * reactive object also deeply unwraps any properties that are refs while
 * maintaining reactivity.
 *
 * @example
 * ```js
 * const obj = reactive({ count: 0 })
 * ```
 *
 * @param target - The source object.
 * @see {@link https://vuejs.org/api/reactivity-core.html#reactive}
 */
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}
```

#### createReactiveObject()

接下来看下响应性是如何实现的。

首先，在 createReactiveObject() 函数中，如果传参 target 是非对象类型的，会提示并直接返回，我们之前的例子中也观察到这种现象了；

其次，判断 target 是否是 Proxy 或者已经存在哈希表 proxyMap 中，如果是直接返回；

最后，如果传参只是一个普通的对象，我们需要使用 new Proxy() 将其转化为一个 Proxy 对象，我们知道在 Vue3 中响应性的实现正是通过 Proxy 去实现的。生成 Proxy 对象后，存入 proxyMap 中，并返回该 Proxy 对象即可。

```ts
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // target already has corresponding Proxy
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only specific value types can be observed.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

## 小结

createReactiveObject 函数，即 reactive 函数，最终是将传参的对象转化为一个 Proxy 对象并返回，而 Vue3 中响应性的实现正是通过 Proxy 去实现的。
