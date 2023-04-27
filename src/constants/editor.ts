import { ethers } from 'ethers';
import moment from 'moment';
import _ from 'lodash';

type Library = {
  label: string;
  importName: string;
  library: unknown;
  isModule: boolean;
};

export const GLOBAL_LIBRARIES: Library[] = [
  {
    label: 'ethers',
    importName: 'ethers',
    library: ethers,
    isModule: true,
  },
  {
    label: 'lodash',
    importName: '_',
    library: _,
    isModule: true,
  },
  {
    label: 'moment',
    importName: 'moment',
    library: moment,
    isModule: true,
  },
  {
    label: 'web3',
    importName: 'Web3',
    // @ts-ignore We import Web3 through the _document page script, due to this error when
    // importing via the NPM package:
    // SyntaxError: Octal escape sequences are not allowed in strict mode.
    library: globalThis.Web3,
    isModule: false,
  },
];

export const ACTION_VIEW_MIN_HEIGHT = 30;
export const ACTION_VIEW_MAX_HEIGHT = 80;
