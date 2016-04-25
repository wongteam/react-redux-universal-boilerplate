import webpack from 'webpack'
import path from 'path'
import _debug from 'debug'

import projectConfig, { paths } from '../config'

const debug = _debug('app:webpack:config:dev')
const srcDir = paths('src')
const nodeModulesDir = paths('nodeModules')
const deps = [
  'redux/dist/redux.min.js',
  'font-awesome/css/font-awesome.min.css'
]

debug('Create configuration.')
const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    paths('entryApp')
  ],
  output: {
    path: paths('dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    alias: {},

    // Resolve the `./src` directory so we can avoid writing
    // ../../styles/base.css but styles/base.css
    root: [srcDir],

    extensions: ['', '.js', '.jsx']
  },
  module: {
    noParse: [],
    // preLoaders: [
    //   {
    //     test: /\.js[x]?$/,
    //     loader: 'eslint',
    //     include: [srcDir]
    //   }
    // ],
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel',
        exclude: [nodeModulesDir],
        // exclude: /node_modules/,
        include: [srcDir],
        query: {
          presets: ['react-hmre']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.(png|jpe?g)$/,
        loader: 'file?name=img/[name].[ext]'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]'
      }
    ]
  },
  postcss: wPack => ([
    require('postcss-import')({ addDependencyTo: wPack }),
    require('postcss-url')(),
    require('postcss-cssnext')()
  ]),
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: projectConfig.__CLIENT__,
      __SERVER__: projectConfig.__SERVER__,
      __DEV__: projectConfig.__DEV__,
      __PROD__: projectConfig.__PROD__,
      __DEBUG__: projectConfig.__DEBUG__
    }),
    new webpack.optimize.DedupePlugin()
  ]
}

// Optimizing rebundling
deps.forEach(dep => {
  const depPath = path.resolve(nodeModulesDir, dep)

  config.resolve.alias[dep.split(path.sep)[0]] = depPath
  config.module.noParse.push(depPath)
})

export default config