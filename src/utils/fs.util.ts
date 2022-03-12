import fs from 'fs';

export function validateFilePath(path: string) {
  return new Promise<void>((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
