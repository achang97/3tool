import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { Resource, ResourceType } from '@app/types';
import { waitFor, act } from '@testing-library/react';
import { renderHook } from '@tests/utils/renderWithContext';
import { setActiveResource } from '../resourcesSlice';

describe('resourcesSlice', () => {
  const renderHooks = () => {
    const { result } = renderHook(() =>
      useAppSelector((state) => state.resources)
    );
    const {
      result: { current: dispatch },
    } = renderHook(() => useAppDispatch());

    return { result, dispatch };
  };

  describe('initialState', () => {
    it('initially sets activeResource to undefined', () => {
      const { result } = renderHooks();
      expect(result.current.activeResource).toBeUndefined();
    });
  });

  describe('actions', () => {
    it('setActiveResource: sets activeResource to given value', async () => {
      const { result, dispatch } = renderHooks();

      const mockResource: Resource = {
        id: '1',
        type: ResourceType.SmartContract,
        name: 'SpaceCoin ICO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        numLinkedQueries: 5,
        metadata: {
          smartContract: {
            chainId: 5,
            address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
            abi: '[{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"address[]","name":"_seedAllowlist","type":"address[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotAdvancePastPhaseOpen","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"enum ICO.Phase","name":"phase","type":"uint8"}],"name":"CannotRedeemInPhase","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"IcoPaused","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"limit","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"IndividualContributionExceeded","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"NoTokensToRedeem","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"NotInSeedAllowlist","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"limit","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TotalContributionExceeded","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"Unauthorized","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum ICO.Phase","name":"phase","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Contribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"PauseToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"enum ICO.Phase","name":"phase","type":"uint8"}],"name":"PhaseAdvanced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"TokensRedeemed","type":"event"},{"inputs":[],"name":"advancePhase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phase","outputs":[{"internalType":"enum ICO.Phase","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"redeemTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"seedAllowlist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"spc","outputs":[{"internalType":"contract SpaceCoin","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"togglePause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalContribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]',
            isProxy: false,
          },
        },
      };

      act(() => {
        dispatch(setActiveResource(mockResource));
      });
      await waitFor(() => {
        expect(result.current.activeResource).toEqual(mockResource);
      });

      act(() => {
        dispatch(setActiveResource(undefined));
      });
      await waitFor(() => {
        expect(result.current.activeResource).toBeUndefined();
      });
    });
  });
});
