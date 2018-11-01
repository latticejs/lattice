import path from 'path';
import { build } from '../lib';
import colors from 'colors';

export default program => {
  program
    .command('build')
    .description('Build your source files into cjs, esm or umd formats.')
    .usage('[options] <input>')
    .option('-f, --formats <formats>', 'Output formats to build', (formats = ['umd', 'cjs', 'esm']) =>
      formats.split(',')
    )
    .option('-e, --env <environment>', 'Environment', 'development')
    .action(async (input, cmd = { formats: ['umd', 'cjs', 'esm'], env: 'development' }) => {
      if (!process.argv.slice(3).length) {
        program.outputHelp(colors.red);
        process.exit(1);
      }

      try {
        const outputs = await build(input, { formats: cmd.formats, env: cmd.env });

        // console.log({ outputs });

        console.log(colors.green.bold('\n 🚀 Your bundle is ready! 🚀\n'));

        console.log(colors.underline('Generated files:'));

        for (const format in outputs) {
          if (outputs.hasOwnProperty(format)) {
            const { fileName } = outputs[format];
            console.log(colors.cyan(`> ${colors.bold(format)}: ${path.join(process.cwd(), fileName)}`));
          }
        }
      } catch (error) {
        console.error(colors.red(error));
        program.outputHelp();
        process.exit(1);
      }
    });
};
