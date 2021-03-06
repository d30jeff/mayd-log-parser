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

export interface LogParserServiceProps {
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

  constructor(params: LogParserServiceProps) {
    const { inputFilePath, outputFilePath, logType } = params;
    this.inputFilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
    // Validation for given logType
    this.logType = logType;
  }

  validateInputFilePath = () => {
    return validateFilePath(this.inputFilePath);
  };

  process = async () => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.validateInputFilePath();

        const rl = readline.createInterface({
          input: fs.createReadStream(this.inputFilePath),
          crlfDelay: Infinity,
        });

        let output = [];

        rl.on('line', (line) => {
          const parsedLine = this.lineReader(line);
          if (parsedLine) {
            console.log(parsedLine);
            output = output.concat(parsedLine);
          }

          this.lineNumber += 1;
        });

        rl.on('close', () => {
          if (output.length) {
            const stream = fs.createWriteStream(
              this.outputFilePath || `./output-${new Date().getTime()}`
            );
            stream.write(JSON.stringify(output, null, 2), () => {
              resolve();
            });
          } else {
            resolve();
          }
        });

        await events.once(rl, 'close');
      } catch (error) {
        this.logger.fatal('Something went wrong', error);
        return reject(error);
      }
    });
  };

  lineReader = (line: string): Object | undefined => {
    try {
      const [timestamp, status, ...remainder] = line.split(' - ');
      const log = remainder.join(' - ');

      if (!log) {
        return null;
      }

      const parsedTimestamp = dayjs(timestamp);
      const parsedLog = JSON.parse(log);
      const isValidTimestamp = parsedTimestamp.isValid();
      const isValidStatus = status === this.logType;
      const isValidLogShape =
        log.startsWith('{') && log.endsWith('}') && log.length > 2;

      const isValid =
        parsedLog && isValidTimestamp && isValidStatus && isValidLogShape;

      if (isValid) {
        switch (this.logType) {
          case LogType.Info:
            {
              if (parsedLog.details === 'Service is started') {
                return {
                  timestamp: parsedTimestamp.unix(),
                  transactionId: parsedLog?.transactionId,
                };
              }
            }
            break;

          default:
            {
              return {
                timestamp: parsedTimestamp.unix(),
                loglevel: status,
                transactionId: parsedLog?.transactionId,
                err: parsedLog?.details,
              };
            }
            break;
        }
      }

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}
