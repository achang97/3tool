import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorSection } from '../InspectorSection';

const mockTitle = 'Title';
const mockChildren = 'Children';

describe('InspectorSection', () => {
  it('renders visible children if open', () => {
    render(<InspectorSection title={mockTitle}>{mockChildren}</InspectorSection>);
    expect(screen.getByText(mockChildren)).toBeVisible();
  });

  it('does not render visible children if closed', async () => {
    render(<InspectorSection title={mockTitle}>{mockChildren}</InspectorSection>);

    await userEvent.click(screen.getByText(mockTitle));
    await waitFor(() => {
      expect(screen.getByText(mockChildren)).not.toBeVisible();
    });
  });

  it('renders title and toggles section on click', async () => {
    render(<InspectorSection title={mockTitle}>{mockChildren}</InspectorSection>);

    const title = screen.getByText(mockTitle);

    await userEvent.click(title);
    await waitFor(() => {
      expect(screen.getByText(mockChildren)).not.toBeVisible();
    });

    await userEvent.click(title);
    expect(screen.getByText(mockChildren)).toBeVisible();
  });

  it('renders arrow icons and toggles section on click', async () => {
    render(<InspectorSection title={mockTitle}>{mockChildren}</InspectorSection>);

    await userEvent.click(screen.getByTestId('inspector-section-arrow-up'));
    await waitFor(() => {
      expect(screen.getByText(mockChildren)).not.toBeVisible();
    });

    await userEvent.click(screen.getByTestId('inspector-section-arrow-down'));
    expect(screen.getByText(mockChildren)).toBeVisible();
  });
});
