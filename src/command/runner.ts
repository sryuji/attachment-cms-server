function run() {
  const name = process.argv[2]
  const commandFilename = `./${name}.command`
  const Command = require(commandFilename).default
  new Command().run()
}

run()
