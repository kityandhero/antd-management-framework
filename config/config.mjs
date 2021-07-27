import { defineConfig, utils } from 'umi';

import webpackPlugin from './plugin.config';

const { winPath } = utils;

const corsTargetDomain = 'http://supplierapi.panduolakeji.com';
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

export default defineConfig({
  targets: {
    ie: 11,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  // Fast Refresh 热更新
  fastRefresh: {},
  //禁用umi.js内置的 title 渲染机制 https://github.com/ant-design/ant-design-pro/issues/6360
  title: false,
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    modules: {
      getLocalIdent: (context, _, localName) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map((a) => a.replace(/([A-Z])/g, '-$1'))
            .map((a) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },
  },
  manifest: {
    basePath: '/',
  },
  history: {
    type: 'hash',
  },
  chainWebpack: webpackPlugin,
  ssr: false,
  webpack5: {},
  exportStatic: {},
});
