const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/Check2Pay/' : '/',
  transpileDependencies: true,
  devServer: {
    port: 8082,
  },
})
