import path from 'path';
import { build } from '../lib';
import colors from 'colors';

export default program => {
  program
    .command('build')
    .description('Build your source files into cjs, esm or umd formats.')
    .usage('[options] <input>')
    .option('-f, --formats <formats>', 'Output formats to build', (formats = []) => formats.split(','))
    .option('-e, --env <environment>', 'Environment', 'production')
    .action(async (input, cmd = { formats: ['umd', 'cjs', 'esm'], env: 'production' }) => {
      if (!process.argv.slice(3).length) {
        program.outputHelp(colors.red);
        process.exit(1);
      }

      try {
        const outputs = await build(input, { formats: cmd.formats, env: cmd.env });

        console.log(colors.green.bold('\n 🚀 Your bundle is ready! 🚀\n'));

        console.log(colors.underline('Generated files:'));

        const files = [];

        for (const format in outputs) {
          const { output, fileName } = outputs[format];

          if (fileName) {
            files.push([format, fileName]);
            continue;
          }

          for (const file in output) {
            const { fileName } = output[file];
            files.push([format, fileName]);
          }
        }

        for (const [format, fileName] of files) {
          console.log(colors.cyan(`> ${colors.bold(format)}: ${path.join(process.cwd(), 'dist', format, fileName)}`));
        }
        console.log('');
      } catch (error) {
        console.error(colors.red(error));
        program.outputHelp();
        process.exit(1);
      }
    });
};
