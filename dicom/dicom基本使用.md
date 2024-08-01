---
title: dicom基本使用 -  cornerstone Tools
date: 2024-08-01
tags:
  - dicom
---

## 初始化

要使用 cornerstoneTools 需要提前初始化，具体 api 如下：

```js
// 引入 cornerstone.js 相关库
import cornerstone from "cornerstone-core";
import cornerstoneMath from "cornerstone-math";
import cornerstoneTools from "cornerstone-tools";

// cornerstoneTools 指定内部库
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

// 初始化 api
cornerstoneTools.init({
  touchEnabled: false,
  // 显示光标
  showSVGCursors: true
});
```

## 版本号

获取当前 cornerstoneTools 的版本号，使用如下 api：

```js
const version = cornerestoneTools.version;

console.log(`当前 cornerstoneTools 的版本号为：${version}`);
```

## 添加或清除指定工具

### 添加指定工具

```js
// 获取指定启用元素
const element = document.getElementById("enabledElement");
// 获取需要添加的工具
const ApiTool = cornerstoneTools.WwwcTool;
// 配置props，具体配置项需参考具体工具
const props = {
  configuration: {
    orientation: 1
  }
};

// 给指定启用元素添加指定工具
cornerstoneTools.addToolForElement(element, ApiTool, props);
// 或者，直接给全部启用元素添加指定工具
cornerstoneTools.addTool(ApiTool, props);
```

### 清除指定工具

```js
// 获取指定启用元素
const element = doucment.getElementById("enabledElement");
const toolName = "Wwwc";

// 给指定启用元素清除指定工具
cornerstoneTools.removeToolForElement(element, toolName);
// 或者，直接清除全部启用元素的指定工具
cornerstoneTools.removeTool(toolName);
```

### 获取已添加的指定工具

```js
const element = document.getElementById("enabledElement");
const tools = cornerstoneTools.getToolForElement(element, "Wwwc");
```

## 修改工具的模式

目前，工具共有四种模式：激活模式、启用模式、禁用模式和被动模式。工具添加后，默认为禁用模式，如果进行交互，则需要将工具模式调整为激活模式。

### 激活模式

```js
const element = document.getElementById("enabledElement");
const toolName = "Wwwc";

/**
 * options 配置如下：
 * mouseButtonMask 指定鼠标按键：1-鼠标左键、2-鼠标右键、4-鼠标滚轮
 */
const options = {
  mouseButtonMask: 1
};

// 给指定启用元素激活指定工具
cornerstoneTools.setToolActiveForElement(element, toolName, options);
// 或者，直接激活全部启用元素的指定工具
cornerstoneTools.setToolActive(toolName, options);
```
### 启用模式

```js
const element = document.getElementById("enabledElement");
const toolName = "Wwwc";

// 给指定启用元素启用指定工具
cornerstoneTools.setToolEnabledForElement(element, toolName);
// 或者，直接启用全部启用元素的指定工具
cornerstoneTools.setToolEnabled(toolName, options);
```

### 禁用模式

```js
const element = document.getElementById("enabledElement");
const toolName = "Wwwc";

// 给指定启用元素禁用指定工具
cornerstoneTools.setToolDisabledForElement(element, toolName);
// 或者，直接禁用全部启用元素的指定工具
cornerstoneTools.setToolDisabled(toolName, options);
```

### 被动模式

```js
const element = document.getElementById("enabledElement");
const toolName = "Wwwc";

// 给指定启用元素被动指定工具
cornerstoneTools.setToolPassiveForElement(element, toolName);
// 或者，直接被动全部启用元素的指定工具
cornerstoneTools.setToolPassive(toolName, options);
```

### 校验指定启用元素指定工具是否为激活模式

```js
const element = document.getElementById("enabledElement");
const toolName = "Wwwc";
const isActive = cornerstoneTools.isToolActiveForElement(element, toolName);

if (isActive) {
  console.log("工具已激活");
}
```

## 最简单的例子

至此，了解上述 api 后，配合 cornerstoneCore、 cornerstoneMath 与 cornerstoneWADOImageLoader 就可搭建最基本的 dcm 文件预览程序。如下：

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>最简单的例子</title>
    <script src="https://unpkg.com/cornerstone-core@2.6.1/dist/cornerstone.js"></script>
    <script src="https://unpkg.com/cornerstone-tools@6.0.8/dist/cornerstoneTools.js"></script>
    <script src="https://unpkg.com/cornerstone-wado-image-loader@4.1.5/dist/cornerstoneWADOImageLoader.bundle.min.js"></script>
    <script src="https://unpkg.com/dicom-parser@1.8.13/dist/dicomParser.js"></script>
    <script src="https://unpkg.com/cornerstone-math@0.1.10/dist/cornerstoneMath.min.js"></script>
    <style>
      .container {
        width: 100%;
        height: 100%;
        user-select: none;
      }

      .container #enabledElement {
        width: 500px;
        height: 500px;
        margin-bottom: 10px;
      }

      .container #operation button {
        margin-right: 5px;
        font-size: 16px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div id="enabledElement"></div>
      <div id="operation">
        <button data-name="Wwwc">Wwwc</button>
        <button data-name="Zoom">Zoom</button>
        <button data-name="Pan">Pan</button>
        <button data-name="Rotate">Rotate</button>
      </div>
    </div>
    <script>
      cornerstoneTools.init({
        touchEnabled: false,
        showSVGCursors: true
      });
      cornerstoneTools.external.cornerstone = cornerstone;
      cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

      cornerstoneWADOImageLoader.webWorkerManager.initialize({
        maxWebWorkers: navigator.hardwareConcurrency || 1,
        startWebWorkersOnDemand: true,
        taskConfiguration: {
          decodeTask: {
            initializeCodecsOnStartup: false
          }
        },
        webWorkerTaskPaths: [
          "https://unpkg.com/cornerstone-wado-image-loader@4.1.5/dist/610.bundle.min.worker.js"
        ]
      });
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

      const element = document.getElementById("enabledElement");

      cornerstone.enable(element);

      const imageId =
        "dicomweb:https://tools.cornerstonejs.org/examples/assets/dicom/bellona/chest_lung/1.dcm";
      cornerstone.loadImage(imageId).then(function (image) {
        cornerstone.displayImage(element, image);
        toolInit();
        setToolActive("Wwwc");
      });

      function toolInit() {
        const tools = ["Wwwc", "Zoom", "Pan", "Rotate"];

        tools.forEach((toolName) => {
          addTool(toolName);
        });
      }

      function addTool(toolName) {
        const ApiTool = cornerstoneTools[`${toolName}Tool`];

        cornerstoneTools.addTool(ApiTool);
      }

      function setToolActive(toolName, mouseButtonMask) {
        const options = {
          mouseButtonMask: mouseButtonMask || 1
        };

        cornerstoneTools.setToolActive(toolName, options);
      }

      function addEventListener() {
        const element = document.getElementById("operation");

        for (let i = 0; i < element.children.length; i++) {
          const toolName = element.children[i].dataset.name;

          element.children[i].addEventListener("click", () =>
            setToolActive(toolName)
          );
        }
      }
    </script>
  </body>
</html>
```
