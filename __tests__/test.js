import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { promises as fs } from 'fs';
import path from 'path';
import init from '../src/init.js';

beforeEach(async () => {
  const pathToHtml = path.join(__dirname, '__fixtures__/index.html');
  const html = await fs.readFile(pathToHtml, 'utf-8');
  document.body.innerHTML = html;
  await init();
});

test('form init', () => {
  expect(screen.getByTestId('form_test')).toBeInTheDocument();
});
