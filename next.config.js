/*module.exports = {
  webpack(config, { buildId, dev,isServer })  {
    
    const IgnorePlugin=require('webpack').IgnorePlugin
    config.plugins.push(
     new IgnorePlugin(/tedious|redis$/)
    )
    return config
  },

}*/

const withCSS = require('@zeit/next-css');
if (typeof require !== 'undefined') {
  require.extensions['.css'] = (file) => {}
}
module.exports = withCSS();
