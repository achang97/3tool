import { fireEvent, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const completeContractForm = async (
  result: RenderResult,
  {
    name,
    chainId,
    address,
    abi,
    isProxy,
    logicAddress,
    logicAbi,
  }: {
    name?: string;
    chainId?: number;
    address?: string;
    abi?: string;
    isProxy?: boolean;
    logicAddress?: string;
    logicAbi?: string;
  }
) => {
  if (name) {
    await userEvent.type(result.getByLabelText(/^Name/), name);
  }

  if (address) {
    await userEvent.type(result.getByLabelText(/^Address/), address);
  }

  if (abi) {
    await userEvent.type(
      result.getByLabelText(/^ABI/),
      abi.replace(/[{[]/g, '$&$&')
    );
  }

  if (chainId) {
    userEvent.click(result.getByLabelText(/^Network/));
    const options = await result.findAllByRole('option');
    const option = options.find(
      (currOption) =>
        currOption.getAttribute('data-value') === chainId.toString()
    );
    if (option) {
      userEvent.click(option);
    }
  }

  if (logicAddress) {
    await userEvent.type(result.getByLabelText(/^Logic Address/), logicAddress);
  }

  if (logicAbi) {
    await userEvent.type(
      result.getByLabelText(/^Logic ABI/),
      logicAbi.replace(/[{[]/g, '$&$&')
    );
  }

  if (isProxy) {
    const proxyCheckbox = result.getByTestId(
      'configure-contract-form-proxy-checkbox'
    );
    try {
      await waitFor(() => {
        expect(proxyCheckbox).toBeChecked();
      });
    } catch {
      userEvent.click(proxyCheckbox);
    }
  }
};

export const submitForm = (result: RenderResult, formId: string) => {
  fireEvent.submit(result.container.querySelector(`#${formId}`) as Element);
};
