---
title: switch特效
date: 2024-08-29
tags:
  - css
---
<img src="/public/switch1.gif" />

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 24px;
            margin: 10px;
        }

        .toggle-switch .toggle-input {
            display: none;
        }

        .toggle-switch .toggle-label {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 24px;
            background-color: #2196F3;
            border-radius: 34px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .toggle-switch .toggle-label::before {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            background-color: #fff;
            box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s;
        }

        .toggle-switch .toggle-input:checked+.toggle-label {
            background-color: #4CAF50;
        }

        .toggle-switch .toggle-input:checked+.toggle-label::before {
            transform: translateX(16px);
        }

        .toggle-switch.light .toggle-label {
            background-color: #BEBEBE;
        }

        .toggle-switch.light .toggle-input:checked+.toggle-label {
            background-color: #9B9B9B;
        }

        .toggle-switch.light .toggle-input:checked+.toggle-label::before {
            transform: translateX(6px);
        }

        .toggle-switch.dark .toggle-label {
            background-color: #4B4B4B;
        }

        .toggle-switch.dark .toggle-input:checked+.toggle-label {
            background-color: #717171;
        }

        .toggle-switch.dark .toggle-input:checked+.toggle-label::before {
            transform: translateX(16px);
        }
    </style>
</head>

<body>
    <div class="toggle-switch">
        <input class="toggle-input" id="toggle" type="checkbox">
        <label class="toggle-label" for="toggle"></label>
    </div>
</body>

</html>
```

<img src="/public/switch.gif" />

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .toggle-border {
            width: 65px;
            border: 2px solid #f0ebeb;
            border-radius: 130px;
            margin-bottom: 45px;
            padding: 1px 2px;
            background: linear-gradient(to bottom right, white, rgba(220, 220, 220, .5)), white;
            box-shadow: 0 0 0 2px #fbfbfb;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .toggle-border:last-child {
            margin-bottom: 0;
        }

        .toggle-border input[type="checkbox"] {
            display: none;
        }

        .toggle-border label {
            position: relative;
            display: inline-block;
            width: 65px;
            height: 20px;
            background: #d13613;
            border-radius: 80px;
            cursor: pointer;
            box-shadow: inset 0 0 16px rgba(0, 0, 0, .3);
            transition: background .5s;
        }

        .toggle-border input[type="checkbox"]:checked+label {
            background: #13d162;
        }

        .handle {
            position: absolute;
            top: -8px;
            left: -10px;
            width: 35px;
            height: 35px;
            border: 1px solid #e5e5e5;
            background: repeating-radial-gradient(circle at 50% 50%, rgba(200, 200, 200, .2) 0%, rgba(200, 200, 200, .2) 2%, transparent 2%, transparent 3%, rgba(200, 200, 200, .2) 3%, transparent 3%), conic-gradient(white 0%, silver 10%, white 35%, silver 45%, white 60%, silver 70%, white 80%, silver 95%, white 100%);
            border-radius: 50%;
            box-shadow: 3px 5px 10px 0 rgba(0, 0, 0, .4);
            transition: left .4s;
        }

        .toggle-border input[type="checkbox"]:checked+label>.handle {
            left: calc(100% - 35px + 10px);
        }
    </style>
</head>

<body>
    <div class="toggle-border">
        <input id="one" type="checkbox">
        <label for="one">
            <div class="handle"></div>
        </label>
    </div>
</body>

</html>
```