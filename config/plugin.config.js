import path from 'path';

function getModulePackageName(module) {
  if (!module.context) return null;
  const nodeModulesPath = path.join(__dirname, '../node_modules/');

  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName; // handle tree shaking

  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    const matchResult = packageName.match(/^_(@?[^@]+)/) || [];

    if (matchResult.length > 0) {
      packageName = packageName.match(/^_(@?[^@]+)/)[1];
    }
  }

  return packageName;
}

const webpackPlugin = (config, { env }) => {
  config.merge({
    mode: 'development',
    optimization: {
      minimize: env === 'production',
      splitChunks: {
        // chunks: 'async',
        // minSize: 1,
        // minChunks: 2,
        // automaticNameDelimiter: '.',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          viz: {
            test: (module) => {
              const packageName = getModulePackageName(module) || '';

              if (packageName) {
                return [
                  'antd',
                  'bizcharts',
                  'gg-editor',
                  'g6',
                  '@antv',
                  'l7',
                  'gg-editor-core',
                  'bizcharts-plugin-slider',
                  'braft-editor',
                  'classnames',
                  'lodash',
                  'numeral',
                ].includes(packageName);
              }

              return false;
            },
          },
          misc: {
            test: (module) => {
              const packageName = getModulePackageName(module) || '';

              if (packageName) {
                return ![
                  'antd',
                  'bizcharts',
                  'gg-editor',
                  'g6',
                  '@antv',
                  'l7',
                  'gg-editor-core',
                  'bizcharts-plugin-slider',
                  'braft-editor',
                  'classnames',
                  'lodash',
                  'numeral',
                ].includes(packageName);
              }

              return false;
            },
          },
        },
      },
    },
  });
};

export default webpackPlugin;
