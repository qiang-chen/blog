---
title: react实现keepalive
date: 2024-11-02
tags:
  - react
---

vue有keepalive，堂堂react怎么能没有，话不多说直接上代码

## demo
```jsx
import { useState } from 'react';
import {  Link, useLocation, RouterProvider, createBrowserRouter, Outlet, useOutlet } from 'react-router-dom';
import KeepAliveLayout, { useKeepOutlet } from './keepalive';

const Layout = () => {
    const { pathname } = useLocation();
    const element = useKeepOutlet();

    return (
        <div>
            <div>当前路由: {pathname}</div>
            {element}
        </div>
    )
}

const Aaa = () => {
    const [count, setCount] = useState(0);

    return <div>
      <p>{count}</p>
      <p>
        <button onClick={() => setCount(count => count + 1)}>加一</button>
      </p>
      <Link to='/bbb'>去 Bbb 页面</Link><br/>
      <Link to='/ccc'>去 Ccc 页面</Link>
    </div>
};

const Bbb = () => {
    const [count, setCount] = useState(0);

    return <div>
      <p>{count}</p>
      <p><button onClick={() => setCount(count => count + 1)}>加一</button></p>
      <Link to='/'>去首页</Link>
    </div>
};

const Ccc = () => {
    return <div>
      <p>ccc</p>
      <Link to='/'>去首面</Link>
    </div>
};

const routes = [
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <Aaa></Aaa>,
      },
      {
        path: "/bbb",
        element: <Bbb></Bbb>
      },
      {
        path: "/ccc",
        element: <Ccc></Ccc>
      }
    ]
  }
];

export const router = createBrowserRouter(routes);

const App = () => {
    return <KeepAliveLayout keepPaths={[/bbb/, '/']}>
      <RouterProvider router={router}/>
    </KeepAliveLayout>
}

export default App;
```
## keepalive
```jsx
import React, { createContext, useContext } from 'react';
import { useOutlet, useLocation, matchPath } from 'react-router-dom'
import type { FC, PropsWithChildren, ReactNode } from 'react';

interface KeepAliveLayoutProps extends PropsWithChildren{
    keepPaths: Array<string | RegExp>;
    keepElements?: Record<string, ReactNode>;
    dropByPath?: (path: string) => void;
}

type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, 'children'>;

const keepElements: KeepAliveContextType['keepElements'] = {};

export const KeepAliveContext = createContext<KeepAliveContextType>({
    keepPaths: [],
    keepElements,
    dropByPath(path: string) {
        keepElements[path] = null;
    }
});

const isKeepPath = (keepPaths: Array<string | RegExp>, path: string) => {
    let isKeep = false;
    for(let i = 0; i< keepPaths.length; i++) {
        let item = keepPaths[i];
        if (item === path) {
            isKeep = true;
        }
        if (item instanceof RegExp && item.test(path)) {
            isKeep = true;
        }
        if (typeof item === 'string' && item.toLowerCase() === path) {
            isKeep = true;
        }
    }
    return isKeep;
}

export function useKeepOutlet() {
    const location = useLocation();
    const element = useOutlet();

    const { keepElements, keepPaths } = useContext(KeepAliveContext);
    const isKeep = isKeepPath(keepPaths, location.pathname);

    if (isKeep) {
        keepElements![location.pathname] = element;
    }

    return <>
        {
            Object.entries(keepElements).map(([pathname, element]) => (
                <div 
                    key={pathname}
                    style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden auto' }}
                    className="keep-alive-page"
                    hidden={!matchPath(location.pathname, pathname)}
                >
                    {element}
                </div>
            ))
        }
        {!isKeep && element}
    </>
}

const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
    const { keepPaths, ...other } = props;

    const { keepElements, dropByPath } = useContext(KeepAliveContext);

    return (
        <KeepAliveContext.Provider value={{ keepPaths, keepElements, dropByPath }} {...other} />
    )
}

export default KeepAliveLayout;
```