import { render, screen } from '@testing-library/react';
import { EditorAppContainer } from '../EditorAppContainer';

describe('EditorAppContainer', () => {
  it('renders children', () => {
    const mockChildren = 'children';
    render(<EditorAppContainer>{mockChildren}</EditorAppContainer>);
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });
});
