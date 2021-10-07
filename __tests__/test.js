import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { promises as fs } from 'fs';
import path from 'path';
import userEvent from '@testing-library/user-event';
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

test('input init', () => {
  expect(screen.getByRole('textbox', { name: 'url' })).toBeInTheDocument();
});

test('validation (unique)', async () => {
  const rssUrl = 'https://ru.hexlet.io/lessons.rss';
  userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  userEvent.click(screen.getByRole('button', { name: 'add' }));

  expect(await screen.findByText(/RSS успешно загружен/i)).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  userEvent.click(screen.getByRole('button', { name: 'add' }));

  expect(await screen.findByText(/RSS уже существует/i)).toBeInTheDocument();
});
