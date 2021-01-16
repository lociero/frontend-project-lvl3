import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import init from '../src/init.js';

beforeEach(() => {
  init();
});

test('form init', () => {
  expect(screen.getByTestId('form_test')).toBeInTheDocument();
});
