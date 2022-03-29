import {
  LogParserServiceProps,
  LogParserService,
} from '@services/log-parser.service';

export const services = {
  logParser: (params: LogParserServiceProps): LogParserService => {
    return new LogParserService(params);
  },
};
