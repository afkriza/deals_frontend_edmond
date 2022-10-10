const path = require('path');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const fs = require('fs');

module.exports = {
  lintOnSave: 'warning',
  filenameHashing: false,
  outputDir: '../../public',
  assetsDir: 'assets',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  },
  css: {
    loaderOptions: {
      css: {
        localsConvention: 'camelCase'
      },
      sass: {
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, 'src/assets', 'stylesheets'),
            path.resolve(__dirname, 'src/assets', 'fonts'),
            path.resolve(__dirname, 'src/assets', 'images')
          ]
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('StringReplacePlugin').use(StringReplacePlugin);

    config.module
      .rule('vue')
      .use('StringReplacePlugin')
      .loader(
        StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /<!-- @svg\("(.*?)"\) -->/gi,
              replacement(_, fileName) {
                const svgPath = path.resolve(
                  __dirname,
                  'src/assets/images/icons',
                  `${fileName}.svg`
                );
                const svgFile = fs.readFileSync(svgPath, 'UTF-8');
                return svgFile || '';
              }
            }
          ]
        })
      );

    config.module
      .rule('svg')
      .use('file-loader')
      .loader('vue-svg-loader');

    config
      .entry('mailer')
      .add('./src/assets/stylesheets/mailer.scss')
      .end();

    config.resolve.alias.set(
      'images',
      path.resolve(__dirname, 'src/assets/images')
    );

    config.resolve.modules
      .prepend(path.resolve(__dirname, 'src/assets', 'images'))
      .prepend(path.resolve(__dirname, 'src/assets', 'stylesheets'))
      .prepend(path.resolve(__dirname, 'src/assets', 'fonts'))
      .prepend(path.resolve(__dirname, 'src'));
  }
};
