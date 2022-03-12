import readline from 'readline';
import fs from 'fs';

export class FileReaderService {
  intputFilePath: string;
  outputFilePath: string;

  constructor(params: any) {}

  validateFilePath(path: string) {
    return new Promise<void>((resolve, reject) => {
      fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  validateInputFilePath(path: string) {
    return this.validateFilePath(path);
  }

  validateOutputFilePath(path: string) {
    return this.validateFilePath(path);
  }

  generateOutput() {}
}
