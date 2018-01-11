module.exports = {
    webpack: (config, { buildId, dev }) => {
        config.plugins = config.plugins.filter(p =>
            p.constructor.name !== 'UglifyJsPlugin'
          )
          
          if(!dev) {
            const Uglify = require('uglifyjs-webpack-plugin')
            config.plugins.push(
              new Uglify({
                parallel: true,
                sourceMap: true
              })
            )
          }
      return config
    },
    
  }
