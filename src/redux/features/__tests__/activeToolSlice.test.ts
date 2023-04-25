import activeToolReducer, {
  renameActionResult,
  renameComponentInput,
  resetActionResult,
  resetActiveTool,
  resetComponentInput,
  setActionResult,
  setComponentInput,
  startActionExecute,
} from '../activeToolSlice';

describe('activeToolSlice', () => {
  describe('component inputs', () => {
    it('setComponentInput: sets input value for given component name', () => {
      const mockName = 'name';
      const mockInput = { value: '1' };

      const initialState = { actionResults: {}, componentInputs: {} };
      const state = activeToolReducer(
        initialState,
        setComponentInput({ name: mockName, input: mockInput })
      );
      expect(state.componentInputs[mockName]).toEqual(mockInput);
    });

    it('resetComponentInput: sets input value for given component name back to undefined', () => {
      const mockName = 'name';

      const initialState = {
        actionResults: {},
        componentInputs: { [mockName]: { value: '1' } },
      };
      const state = activeToolReducer(initialState, resetComponentInput(mockName));
      expect(state.componentInputs[mockName]).toBeUndefined();
    });

    it('renameComponentInput: moves input value from previous name to new name', () => {
      const mockPrevName = 'name';
      const mockNewName = 'new-name';
      const mockInput = { value: '1' };

      const initialState = {
        actionResults: {},
        componentInputs: { [mockPrevName]: { value: '1' } },
      };
      const state = activeToolReducer(
        initialState,
        renameComponentInput({
          prevName: mockPrevName,
          newName: mockNewName,
        })
      );
      expect(state.componentInputs[mockPrevName]).toBeUndefined();
      expect(state.componentInputs[mockNewName]).toEqual(mockInput);
    });
  });

  describe('action results', () => {
    it('startActionExecute: sets isLoading field to true', () => {
      const mockName = 'name';
      const initialState = {
        actionResults: {
          [mockName]: { data: 'data' },
        },
        componentInputs: {},
      };
      const state = activeToolReducer(initialState, startActionExecute(mockName));
      expect(state.actionResults[mockName]).toEqual({
        isLoading: true,
        data: 'data',
      });
    });

    it('setActionResult: sets result value for given action name', () => {
      const mockName = 'name';
      const mockResult = { data: 'data' };

      const initialState = { actionResults: {}, componentInputs: {} };
      const state = activeToolReducer(
        initialState,
        setActionResult({ name: mockName, result: mockResult })
      );
      expect(state.actionResults[mockName]).toEqual(mockResult);
    });

    it('resetActionResult: sets result value for given action name back to undefined', () => {
      const mockName = 'name';

      const initialState = {
        actionResults: { [mockName]: { data: 'data' } },
        componentInputs: {},
      };
      const state = activeToolReducer(initialState, resetActionResult(mockName));
      expect(state.actionResults[mockName]).toBeUndefined();
    });

    it('renameActionResult: moves result value from previous name to new name', () => {
      const mockPrevName = 'name';
      const mockNewName = 'new-name';
      const mockResult = { data: 'data' };

      const initialState = {
        actionResults: { [mockPrevName]: mockResult },
        componentInputs: {},
      };
      const state = activeToolReducer(
        initialState,
        renameActionResult({
          prevName: mockPrevName,
          newName: mockNewName,
        })
      );
      expect(state.actionResults[mockPrevName]).toBeUndefined();
      expect(state.actionResults[mockNewName]).toEqual(mockResult);
    });
  });

  it('resetActiveTool: resets state back to initial state', () => {
    const initialState = {
      actionResults: { test: { data: '1' } },
      componentInputs: { test: '1' },
    };
    const state = activeToolReducer(initialState, resetActiveTool());
    expect(state).toEqual({
      componentInputs: {},
      actionResults: {},
    });
  });
});
