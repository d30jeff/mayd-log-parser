require('source-map-support').install();
import minimist from 'minimist';
import { services } from '@services/index.service';
import { LogType } from '@services/log-parser.service';

const arg = minimist(process.argv.slice(2));

async function main() {
  const parser = services.logParser({
    inputFilePath: arg.input,
    outputFilePath: arg.output,
    logType: LogType.Error,
  });

  await parser.process();
}

try {
  main();
} catch (error) {
  console.error('Something went wrong', error);
}
