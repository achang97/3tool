import { render } from '@tests/utils/renderWithContext';
import { screen } from '@testing-library/react';
import { ActionEditorPlaceholder } from '../ActionEditorPlaceholder';

describe('ActionEditorPlaceholder', () => {
  it('renders placeholder text', () => {
    render(<ActionEditorPlaceholder />);
    expect(screen.getByText('Select an action to edit')).toBeTruthy();
  });

  it('renders button to maximize / minimize editor', () => {
    render(<ActionEditorPlaceholder />);
    expect(screen.getByTestId('size-control-button')).toBeTruthy();
  });
});
