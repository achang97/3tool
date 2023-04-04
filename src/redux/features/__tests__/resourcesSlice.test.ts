import { mockSmartContractResource } from '@tests/constants/data';
import resourcesReducer, { setActiveResource } from '../resourcesSlice';

describe('resourcesSlice', () => {
  it('setActiveResource: sets activeResource to given value', () => {
    const initialState = {};
    const state = resourcesReducer(
      initialState,
      setActiveResource(mockSmartContractResource)
    );
    expect(state.activeResource).toEqual(mockSmartContractResource);
  });
});
