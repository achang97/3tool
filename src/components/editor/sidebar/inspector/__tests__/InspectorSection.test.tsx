import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorSection } from '../InspectorSection';

const mockTitle = 'Title';
const mockChildren = 'Children';

describe('InspectorSection', () => {
  it('renders visible children if open', () => {
    const result = render(<InspectorSection title={mockTitle}>{mockChildren}</InspectorSection>);
    expect(result.getByText(mockChildren)).toBeVisible();
  });

  it('does not render visible children if closed', async () => {
    const result = render(<InspectorSection title={mockTitle}>{mockChildren}</InspectorSection>);

    await userEvent.click(result.getByText(mockTitle));
    await waitFor(() => {
      expect(result.getByText(mockChildren)).not.toBeVisible();
    });
  });

  it('renders title and toggles section on click', async () => {
    const result = render(<InspectorSection title={mockTitle}>{mockChildren}</InspectorSection>);

    const title = result.getByText(mockTitle);

    await userEvent.click(title);
    await waitFor(() => {
      expect(result.getByText(mockChildren)).not.toBeVisible();
    });

    await userEvent.click(title);
    expect(result.getByText(mockChildren)).toBeVisible();
  });

  it('renders arrow icons and toggles section on click', async () => {
    const result = render(<InspectorSection title={mockTitle}>{mockChildren}</InspectorSection>);

    await userEvent.click(result.getByTestId('inspector-section-arrow-up'));
    await waitFor(() => {
      expect(result.getByText(mockChildren)).not.toBeVisible();
    });

    await userEvent.click(result.getByTestId('inspector-section-arrow-down'));
    expect(result.getByText(mockChildren)).toBeVisible();
  });
});
