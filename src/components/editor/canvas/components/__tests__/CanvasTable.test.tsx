import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { setComponentInput } from '@app/redux/features/activeToolSlice';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasTable } from '../CanvasTable';

const mockName = 'name';
const mockDispatch = jest.fn();
const mockEventHandlerCallbacks = {};

jest.mock('../../../hooks/useComponentEvalData');

jest.mock('@app/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
}));

describe('CanvasTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('props', () => {
    describe('data', () => {
      describe('columns', () => {
        it('aggregates all unique column names', () => {
          const mockEvalDataValues = {
            data: [{ col1: 'row1-col1' }, { col2: 'row2-col2' }],
          };
          (useComponentEvalData as jest.Mock).mockImplementation(() => ({
            evalDataValues: mockEvalDataValues,
          }));

          render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
          expect(screen.getByText('col1')).toBeTruthy();
          expect(screen.getByText('col2')).toBeTruthy();
        });

        it('handles duplicate column names', () => {
          const mockEvalDataValues = {
            data: [{ col1: 'row1-col1' }, { col1: 'row2-col1' }],
          };
          (useComponentEvalData as jest.Mock).mockImplementation(() => ({
            evalDataValues: mockEvalDataValues,
          }));

          render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
          expect(screen.getByText('col1')).toBeTruthy();
        });
      });

      describe('rows', () => {
        it('renders rows', () => {
          const mockEvalDataValues = {
            data: [{ col1: 'row1-col1' }, { col1: 'row2-col1' }],
          };
          (useComponentEvalData as jest.Mock).mockImplementation(() => ({
            evalDataValues: mockEvalDataValues,
          }));

          render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
          expect(screen.getByText(mockEvalDataValues.data[0].col1)).toBeTruthy();
          expect(screen.getByText(mockEvalDataValues.data[1].col1)).toBeTruthy();
        });

        it('renders rows with empty elements', () => {
          const mockEvalDataValues = {
            // eslint-disable-next-line no-sparse-arrays
            data: [, { col1: 'row2-col1' }],
          };
          (useComponentEvalData as jest.Mock).mockImplementation(() => ({
            evalDataValues: mockEvalDataValues,
          }));

          render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
          expect(screen.getByText(mockEvalDataValues.data[1]!.col1)).toBeTruthy();
        });
      });
    });

    describe('multiselect', () => {
      it('does not render checkboxes in each row if false', () => {
        const mockEvalDataValues = {
          data: [{ col1: 'row1-col1' }, { col1: 'row2-col1' }],
          multiselect: false,
        };
        (useComponentEvalData as jest.Mock).mockImplementation(() => ({
          evalDataValues: mockEvalDataValues,
        }));

        render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
        expect(screen.queryAllByRole('checkbox', { name: 'Select row' })).toHaveLength(0);
      });

      it('renders checkboxes in each row if true', () => {
        const mockEvalDataValues = {
          data: [{ col1: 'row1-col1' }, { col1: 'row2-col1' }],
          multiselect: true,
        };
        (useComponentEvalData as jest.Mock).mockImplementation(() => ({
          evalDataValues: mockEvalDataValues,
        }));

        render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
        expect(screen.getAllByRole('checkbox', { name: 'Select row' })).toHaveLength(2);
      });
    });

    it('emptyMessage: renders empty message if there are no data rows', () => {
      const mockEvalDataValues = { emptyMessage: 'Empty message' };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      expect(screen.getByText(mockEvalDataValues.emptyMessage)).toBeTruthy();
    });
  });

  describe('user input', () => {
    it('dispatches action to select single row', async () => {
      const mockEvalDataValues = {
        data: [{ col1: 'row1-col1' }, { col1: 'row2-col1' }],
        multiselect: false,
      };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);

      await userEvent.click(screen.getByText(mockEvalDataValues.data[0].col1));
      expect(mockDispatch).toHaveBeenCalledWith(
        setComponentInput({
          name: mockName,
          input: { selectedRows: [mockEvalDataValues.data[0]] },
        })
      );

      await userEvent.click(screen.getByText(mockEvalDataValues.data[1].col1));
      expect(mockDispatch).toHaveBeenCalledWith(
        setComponentInput({
          name: mockName,
          input: { selectedRows: [mockEvalDataValues.data[1]] },
        })
      );
    });

    it('dispatches action to select multiple rows', async () => {
      const mockEvalDataValues = {
        data: [{ col1: 'row1-col1' }, { col1: 'row2-col1' }],
        multiselect: true,
      };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalDataValues: mockEvalDataValues,
      }));

      render(<CanvasTable name={mockName} eventHandlerCallbacks={mockEventHandlerCallbacks} />);
      const checkboxes = screen.getAllByRole('checkbox', {
        name: 'Select row',
      });

      await userEvent.click(checkboxes[0]);
      expect(mockDispatch).toHaveBeenCalledWith(
        setComponentInput({
          name: mockName,
          input: {
            selectedRows: [mockEvalDataValues.data[0]],
          },
        })
      );

      await userEvent.click(checkboxes[1]);
      expect(mockDispatch).toHaveBeenCalledWith(
        setComponentInput({
          name: mockName,
          input: {
            selectedRows: mockEvalDataValues.data,
          },
        })
      );
    });
  });
});
