require('source-map-support').install();
import { services } from '@services/index.service';
import minimist from 'minimist';

const arg = minimist(process.argv.slice(2));

async function main() {
  const parser = services.logParser({
    inputFilePath: arg.input,
    outputFilePath: arg.output,
    logType: arg.parser,
  });

  await parser.process();
}

try {
  main();
} catch (error) {
  console.error('Something went wrong', error);
}
