import {
  FileReaderProps,
  LogParserService,
} from '@services/log-parser.service';

export const services = {
  logParser: (params: FileReaderProps): LogParserService => {
    return new LogParserService(params);
  },
};
