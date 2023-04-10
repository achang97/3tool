import { ResourceType } from '@app/types';
import resourcesReducer, {
  pushResource,
  popResource,
  updateResource,
  ResourceStackElement,
} from '../resourcesSlice';

describe('resourcesSlice', () => {
  it('pushResource: pushes resource element onto first element of stack', () => {
    const mockResourceElement = {
      type: 'create',
      resource: { type: ResourceType.SmartContract },
    } as ResourceStackElement;

    const initialState = {
      resourceStack: [
        {
          type: 'edit',
          resource: { type: ResourceType.Abi },
        },
      ] as ResourceStackElement[],
    };
    const state = resourcesReducer(initialState, pushResource(mockResourceElement));
    expect(state.resourceStack).toEqual([mockResourceElement, ...initialState.resourceStack]);
  });

  it('popResource: pops first element of stack', () => {
    const initialState = {
      resourceStack: [
        {
          type: 'create',
          resource: { type: ResourceType.SmartContract },
        },
        {
          type: 'edit',
          resource: { type: ResourceType.Abi },
        },
      ] as ResourceStackElement[],
    };
    const state = resourcesReducer(initialState, popResource());
    expect(state.resourceStack).toEqual(initialState.resourceStack.slice(1));
  });

  describe('updateResource', () => {
    const initialState = {
      resourceStack: [
        {
          type: 'edit',
          resource: { type: ResourceType.Abi },
        },
      ] as ResourceStackElement[],
    };
    const mockUpdate = { data: { abi: { abi: '' } } };

    it('does nothing if index is less than 0', () => {
      const state = resourcesReducer(
        initialState,
        updateResource({ index: -1, update: mockUpdate })
      );
      expect(state.resourceStack).toEqual(initialState.resourceStack);
    });

    it('does nothing if index is greater than resource stack length', () => {
      const state = resourcesReducer(
        initialState,
        updateResource({ index: 1, update: mockUpdate })
      );
      expect(state.resourceStack).toEqual(initialState.resourceStack);
    });

    it('updates resource at index', () => {
      const state = resourcesReducer(
        initialState,
        updateResource({ index: 0, update: mockUpdate })
      );
      expect(state.resourceStack).toEqual([
        {
          type: 'edit',
          resource: {
            type: ResourceType.Abi,
            data: { abi: { abi: '' } },
          },
        },
      ]);
    });
  });
});
