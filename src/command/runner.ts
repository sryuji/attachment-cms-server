function run() {
  const name = process.argv[2]
  const commandFilename = `./${name}.command`
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Command = require(commandFilename).default
  new Command().run()
}

run()
