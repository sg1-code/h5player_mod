export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          /* 49 is a dividing line, const output is no longer converted to var*/
          // chrome: '49',
          chrome: '52'
        },
        corejs: '3',
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: [
    // If you use the usage of @babel/preset-env, there is no need to define the @babel/plugin-transform-runtime plug-in.
    // '@babel/plugin-transform-runtime'
  ]
}
