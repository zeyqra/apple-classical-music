# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 开发记录
- 先从最核心的原型开始：
  - 专辑列表
  - 专辑详情
  - 播放器相关（播放控制、列队管理）

- 基础模型
  - 古典乐所有的播放单位都对应到 movement

/albums
id: 1
title: "Beethoven: Symphonies Nos. 5 & 6"

/album/:id
id(以下数据结构省略 id)
title
recordings[]:
  work:
    composer:
      name
    title
    movements[]:
      title
  performers:
    conductor:
      name
    orchestra:
      name
    soloist:
      name
    singer:
      name
    

音频文件（分轨）:
/audio/:movement_id