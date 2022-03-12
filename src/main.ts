import { program } from 'commander';
import { services } from '@services/index.service';

program.option('--input').option('-i, --separator <file-input-path>');

program.parse();

console.log(program);
