import { services } from '@services/index.service';
import { LogType } from '@services/log-parser.service';
import { validateFilePath } from '@utils/fs.util';
import { join } from 'path';
import fs from 'fs';

describe('Log Parser Service', () => {
  beforeAll(() => {});

  afterAll(() => {});

  describe('Validate File Path', () => {
    it('Should Throw Invalid Input File Path', async () => {
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/xxx-valid-input'),
        outputFilePath: __dirname + 'testing',
        logType: LogType.Debug,
      });
      try {
        await parser.validateInputFilePath();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('Should Validate Valid Input File Path', async () => {
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/valid-input'),
        outputFilePath: __dirname + 'testing',
        logType: LogType.Debug,
      });
      try {
        await parser.validateInputFilePath();
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });

    it('Should Accept And Create The Correct Output File', async () => {
      const outputFilePath = join(__dirname, '../../tests/output-is-created');
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/valid-input'),
        outputFilePath,
        logType: LogType.Debug,
      });

      try {
        await parser.process();
        await validateFilePath(outputFilePath);
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });
  });

  describe('Should Filter The Right Log Type', () => {
    it('Should Filter "Info" Log Type Correctly', async () => {
      const outputFilePath = join(
        __dirname,
        '../../tests/output-valid-info.json'
      );
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/valid-input'),
        outputFilePath,
        logType: LogType.Info,
      });

      try {
        await parser.process();
        fs.readFile(outputFilePath, 'utf-8', (error, data) => {
          if (error) {
            return Promise.reject();
          }
          const json = JSON.parse(data);

          expect(json.length).toEqual(3);
        });
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });

    it('Should Filter "Warn" Log Type Correctly', async () => {
      const outputFilePath = join(
        __dirname,
        '../../tests/output-valid-warn.json'
      );
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/valid-input'),
        outputFilePath,
        logType: LogType.Warn,
      });

      try {
        await parser.process();
        fs.readFile(outputFilePath, 'utf-8', (error, data) => {
          if (error) {
            return Promise.reject();
          }
          const json = JSON.parse(data);

          expect(json.length).toEqual(1);
        });
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });

    it('Should Filter "Debug" Log Type Correctly', async () => {
      const outputFilePath = join(
        __dirname,
        '../../tests/output-valid-debug.json'
      );
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/valid-input'),
        outputFilePath,
        logType: LogType.Debug,
      });

      try {
        await parser.process();
        fs.readFile(outputFilePath, 'utf-8', (error, data) => {
          if (error) {
            return Promise.reject();
          }
          const json = JSON.parse(data);

          expect(json.length).toEqual(7);
        });
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });

    it('Should Filter "Error" Log Type Correctly', async () => {
      const outputFilePath = join(
        __dirname,
        '../../tests/output-valid-error.json'
      );
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/valid-input'),
        outputFilePath,
        logType: LogType.Error,
      });

      try {
        await parser.process();
        fs.readFile(outputFilePath, 'utf-8', (error, data) => {
          if (error) {
            return Promise.reject();
          }
          const json = JSON.parse(data);

          expect(json.length).toEqual(1);
        });
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });
  });

  describe('Should Validate Log', () => {
    it('Exclude Line With Invalid Timestamp', async () => {
      const outputFilePath = join(
        __dirname,
        '../../tests/output-info-some-invalid-timestamp.json'
      );
      const parser = services.logParser({
        inputFilePath: join(
          __dirname,
          '../../tests/info-some-invalid-timestamp'
        ),
        outputFilePath,
        logType: LogType.Info,
      });

      try {
        await parser.process();
        fs.readFile(outputFilePath, 'utf-8', (error, data) => {
          if (error) {
            return Promise.reject();
          }
          const json = JSON.parse(data);

          expect(json.length).toEqual(1);
        });
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });

    it('Exclude Line With Invalid Log Type', async () => {
      const outputFilePath = join(
        __dirname,
        '../../tests/output-info-some-invalid-type.json'
      );
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/info-some-invalid-type'),
        outputFilePath,
        logType: LogType.Info,
      });

      try {
        await parser.process();
        fs.readFile(outputFilePath, 'utf-8', (error, data) => {
          if (error) {
            return Promise.reject();
          }
          const json = JSON.parse(data);

          expect(json.length).toEqual(2);
        });
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });

    it('Exclude Line With Invalid Log Message', async () => {
      const outputFilePath = join(
        __dirname,
        '../../tests/output-info-some-invalid-message.json'
      );
      const parser = services.logParser({
        inputFilePath: join(__dirname, '../../tests/info-some-invalid-message'),
        outputFilePath,
        logType: LogType.Info,
      });

      try {
        await parser.process();
        fs.readFile(outputFilePath, 'utf-8', (error, data) => {
          if (error) {
            return Promise.reject();
          }
          const json = JSON.parse(data);

          expect(json.length).toEqual(2);
        });
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });
  });
});
