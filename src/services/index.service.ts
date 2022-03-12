import { FileReaderService } from '@services/file-reader.service';

export const services = {
  fileReader: new FileReaderService({}),
};
