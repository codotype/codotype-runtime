const path = require('path');

// TODO - pull inflate from @codotype/util/lib/inflate
const { inflate } = require('./helpers')

// // // //

// TODO - move into constants.js?
const OUTPUT_DIRECTORY = 'build'
const MODULES_ROOT = 'node_modules'
const GENERATOR_META_FILENAME = 'codotype-generator-meta.json'
const GENERATOR_CLASS_PATH = 'generator'

// // // //

// CodotypeRuntime class definition
module.exports = class CodotypeRuntime {

  // constructor
  // Handles options to run a single generator instance
  constructor(options = {}) {

    // Assigns this.options
    this.options = options;

    // Assigns this.options.cwd
    this.options.cwd = process.cwd();

    // Returns the runtime instance
    return this
  }

  // registerGenerator
  // Registers an individual generator by it's node_modules name
  // i.e. 'codotype-generator-nuxt' in `node_modules/codotype-generator-nuxt'`
  // TODO - implement runtime.registerGenerator()
  // TODO - implement runtime.getRegisteredGenerators()
  // TODO - runtime.registerGenerator('codotype-generator-nuxt') <-- THIS
  registerGenerator (module_name) {
    console.log('REGISTER GENERATOR')
    console.log(module_name)

    // Construct the module path
    const generator_path = path.join(MODULES_ROOT, module_name, GENERATOR_CLASS_PATH)
    const generator_meta_path = path.join(MODULES_ROOT, module_name, GENERATOR_META_FILENAME)

    console.log(generator_path)
    console.log(generator_meta_path)

    // Try to load up the generator & associated metadata, catch error
    try {
      // Require the class dynamically
      const GeneratorClass = require(modulePath); // eslint-disable-line import/no-dynamic-require
      const resolved = require.resolve(modulePath);

      // Logging
      console.info(`Executing ${GeneratorClass.name} generators:`)
      // await new GeneratorClass(generator_options).write(this.options)

      // Logs which generator is being run
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        console.log('REGISTRATION ERROR - GENERATOR NOT FOUND')
      } else {
        console.log('REGISTRATION ERROR - OTHER')
        throw err;
      }
    }
  }

  // TODO - integrate into INTERNAL generator
  // async writeBuildManifest ({ build }) {
  //   return new Promise((resolve, reject) => {
  //     // Makes /build/buildId
  //     this.fs.mkdirSync(__dirname + `/build/${buildId}`)
  //     // Writes blazeplate.json file
  //     this.fs.writeFile(__dirname + `/build/${buildId}/blazeplate.json`, JSON.stringify(req.body, null, 2), (err) => {
  //       if (err) throw err;
  //       // console.log(`Build ${buildId} manfiest saved`);
  //       return resolve()
  //     });
  //   });
  // }

  // write
  // Method for write files to the filesystem
  async execute ({ build }) {

    // Pulls attributes out of build object
    let { id, app, stages } = build

    // Inflates application metadata
    // TODO - handle missing app object
    app = inflate({ app });

    // Runs stage of the build array
    // TODO - accept OUTPUT_DIRECTORY override
    // TODO - conflate each stage to its respective generator,
    // skipping / throwing errors on those whos generator is missing
    stages.forEach(async ({ generator_path, project_path, configuration }) => {

      // Sets output_directory default to build ID by default
      const output_directory = id || '';

      // Assigns `dest` option for generator
      // TODO - handle condition of missing app.identifier
      const dest = path.join(this.options.cwd, OUTPUT_DIRECTORY, output_directory, app.identifier, project_path);

      // Defines module path to generator
      // TODO - this approach is brittle and should be re-evaluated
      // Currently relites on ONLY relative paths - need option
      // for absolute paths from a globally intsalled location
      const modulePath = path.join(this.options.cwd, generator_path);

      // Try to load up the generator, catch error
      try {
        const GeneratorClass = require(modulePath); // eslint-disable-line import/no-dynamic-require
        const resolved = require.resolve(modulePath);

        // Defines options for
        const generator_options = {
          app,
          dest,
          resolved,
          configuration
        }

        // Logging
        console.info(`Executing ${GeneratorClass.name} generators:`)
        await new GeneratorClass(generator_options).write(this.options)
        // await generator.write(this.options)


        // Logs which generator is being run
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          console.log('RUNTIME ERROR - GENERATOR NOT FOUND')
        } else {
          console.log('RUNTIME ERROR - OTHER')
          throw err;
        }
      }

      // Thank you message
      console.log('\nBuild complete\nThank you for using Codotype :)\nFollow us on github.com/codotype\n')

    })
  }
}
