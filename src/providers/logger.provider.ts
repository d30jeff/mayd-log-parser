import { Signale } from 'signale';

export const Logger = (scope: string): Signale => {
  return new Signale({
    scope,
  });
};
