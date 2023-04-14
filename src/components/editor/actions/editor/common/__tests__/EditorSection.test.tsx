import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorSection } from '../EditorSection';

const mockTitle = 'Title';
const mockChildren = 'Children';
const mockHandleToggleEnabled = jest.fn();

describe('EditorSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title', () => {
    render(<EditorSection title={mockTitle}>{mockChildren}</EditorSection>);
    expect(screen.getByText(mockTitle)).toBeTruthy();
  });

  describe('not toggleable', () => {
    it('renders visible children if open', () => {
      render(<EditorSection title={mockTitle}>{mockChildren}</EditorSection>);
      expect(screen.getByText(mockChildren)).toBeVisible();
    });

    it('does not render visible children if closed', async () => {
      render(<EditorSection title={mockTitle}>{mockChildren}</EditorSection>);

      await userEvent.click(screen.getByText(mockTitle));
      await waitFor(() => {
        expect(screen.getByText(mockChildren)).not.toBeVisible();
      });
    });

    it('renders arrow icons and toggles section on click', async () => {
      render(<EditorSection title={mockTitle}>{mockChildren}</EditorSection>);

      await userEvent.click(screen.getByTestId('editor-section-arrow-up'));
      await waitFor(() => {
        expect(screen.getByText(mockChildren)).not.toBeVisible();
      });

      await userEvent.click(screen.getByTestId('editor-section-arrow-down'));
      expect(screen.getByText(mockChildren)).toBeVisible();
    });
  });

  describe('toggleable and disabled', () => {
    it('does not render visible children', () => {
      render(
        <EditorSection title={mockTitle} isEnabledToggleable isEnabled={false}>
          {mockChildren}
        </EditorSection>
      );
      expect(screen.getByText(mockChildren)).not.toBeVisible();
    });

    it('does not render arrow icons', () => {
      render(
        <EditorSection title={mockTitle} isEnabledToggleable isEnabled={false}>
          {mockChildren}
        </EditorSection>
      );
      expect(screen.getByTestId('editor-section-arrow-down')).not.toBeVisible();
    });

    it('does not toggle children', async () => {
      render(<EditorSection title={mockTitle}>{mockChildren}</EditorSection>);

      await userEvent.click(screen.getByText(mockTitle));
      await waitFor(() => {
        expect(screen.getByText(mockChildren)).not.toBeVisible();
      });
    });

    it('calls onToggleEnabled and renders visible children on switch click', async () => {
      const result = render(
        <EditorSection
          title={mockTitle}
          isEnabledToggleable
          isEnabled={false}
          onToggleEnabled={mockHandleToggleEnabled}
        >
          {mockChildren}
        </EditorSection>
      );

      await userEvent.click(screen.getByRole('checkbox'));
      expect(mockHandleToggleEnabled).toHaveBeenCalledWith(true);

      result.rerender(
        <EditorSection
          title={mockTitle}
          isEnabledToggleable
          isEnabled
          onToggleEnabled={mockHandleToggleEnabled}
        >
          {mockChildren}
        </EditorSection>
      );
      expect(screen.getByText(mockChildren)).toBeVisible();
    });
  });

  describe('toggleable and enabled', () => {
    it('renders visible children if open', () => {
      render(
        <EditorSection title={mockTitle} isEnabledToggleable isEnabled>
          {mockChildren}
        </EditorSection>
      );
      expect(screen.getByText(mockChildren)).toBeVisible();
    });

    it('does not render visible children if closed', async () => {
      render(
        <EditorSection title={mockTitle} isEnabledToggleable isEnabled>
          {mockChildren}
        </EditorSection>
      );

      await userEvent.click(screen.getByText(mockTitle));
      await waitFor(() => {
        expect(screen.getByText(mockChildren)).not.toBeVisible();
      });
    });

    it('renders arrow icons and toggles section on click', async () => {
      render(
        <EditorSection title={mockTitle} isEnabledToggleable isEnabled>
          {mockChildren}
        </EditorSection>
      );

      await userEvent.click(screen.getByTestId('editor-section-arrow-up'));
      await waitFor(() => {
        expect(screen.getByText(mockChildren)).not.toBeVisible();
      });

      await userEvent.click(screen.getByTestId('editor-section-arrow-down'));
      expect(screen.getByText(mockChildren)).toBeVisible();
    });

    it('calls onToggleEnabled and hides visible children on switch click', async () => {
      const result = render(
        <EditorSection
          title={mockTitle}
          isEnabledToggleable
          isEnabled
          onToggleEnabled={mockHandleToggleEnabled}
        >
          {mockChildren}
        </EditorSection>
      );

      await userEvent.click(screen.getByRole('checkbox'));
      expect(mockHandleToggleEnabled).toHaveBeenCalledWith(false);

      result.rerender(
        <EditorSection
          title={mockTitle}
          isEnabledToggleable
          isEnabled={false}
          onToggleEnabled={mockHandleToggleEnabled}
        >
          {mockChildren}
        </EditorSection>
      );
      await waitFor(() => {
        expect(screen.getByText(mockChildren)).not.toBeVisible();
      });
    });
  });
});
