const CodotypeRuntime = require('../index.js');
const LibraryExampleApp = require('@codotype/generator/examples/library.json')

// // // //

// Test runtime.registerGenerator('...')
const runtime = new CodotypeRuntime()
runtime.registerGenerator('codotype-generator-nuxt')
// console.log(runtime.getGenerators())

// Test runtime.execute({ build })
const build = {
  app: LibraryExampleApp,
  stages: [{
    generator_id: 'codotype-generator-nuxt',
    configuration: {}
  }]
}
runtime.execute({ build })

