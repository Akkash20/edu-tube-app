import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./components/VideoList', () => () => null);

test('navigates between home and profile pages', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
    'aria-current',
    'page'
  );

  fireEvent.click(screen.getByRole('link', { name: /profile/i }));

  expect(screen.getByRole('heading', { name: /your profile/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute(
    'aria-current',
    'page'
  );
});
