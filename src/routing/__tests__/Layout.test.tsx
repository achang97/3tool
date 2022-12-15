import React from 'react';
import { render } from '@testing-library/react';
import { Outlet } from 'react-router-dom';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { Layout } from '../Layout';

jest.mock('components/Toolbar/Toolbar', () => ({
  Toolbar: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Outlet: jest.fn(),
}));

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toolbar', () => {
    const mockToolbar = 'Toolbar';
    (Toolbar as unknown as jest.Mock).mockImplementation(() => mockToolbar);

    const result = render(<Layout />);

    expect(result.getByText(mockToolbar)).toBeDefined();
  });

  it('renders the current outlet', () => {
    const mockOutlet = 'Outlet';
    (Outlet as unknown as jest.Mock).mockImplementation(() => mockOutlet);

    const result = render(<Layout />);

    expect(result.getByText(mockOutlet)).toBeDefined();
  });
});
