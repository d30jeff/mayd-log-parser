import { Logger } from '@providers/logger.provider';
import { dayjs } from '@utils/dayjs.util';
import { validateFilePath } from '@utils/fs.util';
import readline from 'readline';
import events from 'events';
import fs from 'fs';

export enum LogType {
  Error = 'error',
  Info = 'info',
  Debug = 'debug',
  Warn = 'warn',
}

export interface FileReaderProps {
  inputFilePath: string;
  outputFilePath?: string;
  logType?: LogType;
}

export class LogParserService {
  private readonly logger = Logger('FileReaderService');
  inputFilePath: string;
  outputFilePath: string;
  logType: LogType = LogType.Error;
  lineNumber = 0;

  constructor(params: FileReaderProps) {
    const { inputFilePath, outputFilePath, logType } = params;
    this.inputFilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
    this.logType = logType;
  }

  validateInputFilePath = () => {
    return validateFilePath(this.inputFilePath);
  };

  validateOutputFilePath = () => {
    return validateFilePath(this.outputFilePath);
  };

  process = async () => {
    try {
      await this.validateInputFilePath();

      const rl = readline.createInterface({
        input: fs.createReadStream(this.inputFilePath),
        crlfDelay: Infinity,
      });

      const output = [];

      rl.on('line', (line) => {
        const parsedLine = this.lineReader(line);
        if (parsedLine) {
          output.push(parsedLine);
        }

        this.lineNumber += 1;
      });

      rl.on('close', () => {
        const stream = fs.createWriteStream(
          this.outputFilePath || `./output-${new Date().getTime()}`
        );
        stream.write(JSON.stringify(output, null, 2));
      });

      await events.once(rl, 'close');
    } catch (error) {
      this.logger.fatal('Something went wrong', error);
    }
  };

  lineReader = (line: string): Object | undefined => {
    const [timestamp, status, log] = line.split(' - ');
    const parsedTimestamp = dayjs(timestamp);
    const parsedLog = JSON.parse(log);
    const isValidTimestamp = parsedTimestamp.isValid();
    const isValidStatus = status === this.logType;
    const isValidLogShape = log.startsWith('{') && log.endsWith('}');

    const isValid = isValidTimestamp && isValidStatus && isValidLogShape;

    if (isValid) {
      return {
        timestamp: parsedTimestamp.unix(),
        ...parsedLog,
      };
    }

    return null;
  };
}