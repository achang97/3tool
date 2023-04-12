import { screen, render } from '@testing-library/react';
import { FullscreenLoader } from '../FullscreenLoader';

describe('FullscreenLoader', () => {
  it('renders a loader', () => {
    render(<FullscreenLoader />);
    expect(screen.getByTestId('fullscreen-loader')).toBeTruthy();
  });
});
