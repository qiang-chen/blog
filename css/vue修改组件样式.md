---
title: vue修改组件样式
date: 2024-09-30
tags:
  - css
---
  在Vue项目中，尤其是在使用组件化开发时，我们某些时候需要对组件内部的某些样式优化，但Vue的样式封装特性（scoped）会阻止外部样式直接作用于组件内部。为了应对这一挑战，Vue社区引入了深度选择器（也称为穿透选择器或阴影穿透选择器），让我们能够跨越组件的封装边界，对内部元素进行样式定制。

## 1. >>>

是CSS原生中的深度选择器语法，用于穿透样式封装。


**兼容性：** 仅在某些特定环境（如Webpack的css-loader配置中）和原生CSS中有效，Vue单文件组件中通常需要特定配置才能使用。


**注意：** 在Vue单文件组件中，我们通常会搭配css预处理器使用。但Sass之类的预处理器无法正确解析>>>，所以不推荐使用>>>，可以使用/deep/或::v-deep操作符取而代之，两者都是>>>的别名，同样可以正常工作。

```css
<style scoped>
.parent >>> .child {
  /* 样式规则 */
}
</style>
```

## 2. /deep/

/deep/曾经是CSS中实际提出的新增功能，但之后被删除，所以不建议使用。


**兼容性：** 支持CSS预处理器（如Sass、Less）和CSS原生样式。


**注意：** 在Vue3中，/deep/不再被官方直接支持，虽然一些构建工具或库可能仍然兼容，但不推荐使用，使用后编译时控制台会输出警告信息。

> /deep/ usage as a combinator has been deprecated. Use :deep() instead.

表示/deep/是一个废弃的特性，请使用:deep()替代。

```css
<style scoped>
.parent /deep/ .child {
  /* 样式规则 */
}
</style>
```

## 3. ::v-deep

::v-deep是/deep/的别名深度选择器。


**兼容性：** 支持Vue2，但在Vue3中不推荐使用。


**注意：** 在Vue3中，::v-deep也不再被官方直接支持，虽然一些构建工具或库可能仍然兼容，但不推荐使用，使用后编译时控制台会输出警告信息。

> ::v-deep usage as a combinator has been deprecated. Use :deep() instead.

表示::v-deep是一个废弃的特性，请使用:deep()替代。

```css
<style scoped>
.parent::v-deep .child {
  /* 样式规则 */
}
</style>
```

## 4. ::v-deep()

::v-deep()是深度选择器从Vue2向Vue3演化过程中的一个过渡性组合器。

**用法：** 支持Vue3，但在编译时被视为已弃用并会引发警告。

```css
<style scoped>
.parent ::v-deep(.child) {
  /* 样式规则 */
}
</style>
```

## 5. :deep()

:deep()是Vue3官方推荐的深度选择器，不建议使用>>>和/deep/以及::v-deep包括::v-deep()。

**兼容性：** 支持Vue3，但在Vue2中不可使用。

```css
<style scoped>
.parent :deep(.child) {
  /* 样式规则 */
}
</style>
```

## 结论

- 在Vue2中使用::v-deep;
- 在Vue3中使用:deep();
- /deep/需要与特定浏览器版本搭配使用，不推荐使用
- 部分CSS预处理器对>>>支持不佳，在不使用CSS预处理器时可使用，否则不推荐使用