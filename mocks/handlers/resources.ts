import { rest } from 'msw';
import { Resource } from '@app/types';
import { generateRandomDate } from '../utils';

const RESOURCES: Resource[] = [
  {
    id: '1',
    type: 'smart_contract',
    name: 'SpaceCoin ICO',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    numLinkedQueries: 5,
    metadata: {
      smartContract: {
        chainId: 5,
        address: '0xf33Cb58287017175CADf990c9e4733823704aA86',
        abi: '[{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"address[]","name":"_seedAllowlist","type":"address[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotAdvancePastPhaseOpen","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"enum ICO.Phase","name":"phase","type":"uint8"}],"name":"CannotRedeemInPhase","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"IcoPaused","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"limit","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"IndividualContributionExceeded","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"NoTokensToRedeem","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"NotInSeedAllowlist","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"limit","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TotalContributionExceeded","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"Unauthorized","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum ICO.Phase","name":"phase","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Contribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"PauseToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"enum ICO.Phase","name":"phase","type":"uint8"}],"name":"PhaseAdvanced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"TokensRedeemed","type":"event"},{"inputs":[],"name":"advancePhase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phase","outputs":[{"internalType":"enum ICO.Phase","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"redeemTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"seedAllowlist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"spc","outputs":[{"internalType":"contract SpaceCoin","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"togglePause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalContribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]',
        isProxy: false,
      },
    },
  },
  {
    id: '2',
    type: 'smart_contract',
    name: 'Staking Pool Contract',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    numLinkedQueries: 3,
    metadata: {
      smartContract: {
        chainId: 5,
        address: '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
        abi: '[{"inputs":[{"internalType":"address","name":"contractLogic","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"}]',
        isProxy: true,
        logicAbi:
          '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newAddress","type":"address"}],"name":"CodeAddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"anotherVariable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLogicAddress","outputs":[{"internalType":"address","name":"logicAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getThisAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_someVariable","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"otherArg","type":"uint256"}],"name":"setOtherVariable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"someArg","type":"uint256"}],"name":"setSomeVariable","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"someVariable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newLogic","type":"address"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
        logicAddress: '0x73F165E0013a1BfA645f7d867E9cA87d03cDb598',
      },
    },
  },
  {
    id: '3',
    type: 'dune',
    name: 'Dune API',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    numLinkedQueries: 4,
    metadata: {
      dune: {
        apiKey: 'api-key',
      },
    },
  },
];

export const resourceHandlers = [
  rest.get('*/api/resources/:id', (req, res, ctx) => {
    const resource = RESOURCES.find(
      (currResource) => currResource.id === req.params.id
    );

    if (!resource) {
      return res(ctx.status(400));
    }

    return res(ctx.status(200), ctx.json<Resource>(resource));
  }),
  rest.get('*/api/resources', (req, res, ctx) => {
    const name = req.url.searchParams.get('name')?.toLowerCase();
    return res(
      ctx.status(200),
      ctx.json<Resource[]>(
        RESOURCES.filter(
          (resource) => !name || resource.name.toLowerCase().includes(name)
        )
      )
    );
  }),
  rest.post('*/api/resources', async (req, res, ctx) => {
    const body = await req.json();

    if (RESOURCES.some((resource) => resource.name === body.name)) {
      return res(
        ctx.status(400),
        ctx.json({
          message: `Resource with name "${body.name}" already exists.`,
        })
      );
    }

    const newResource: Resource = {
      id: crypto.randomUUID(),
      type: body.type,
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: body.metadata,
      numLinkedQueries: 0,
    };
    RESOURCES.push(newResource);

    return res(ctx.status(201), ctx.json<Resource>(newResource));
  }),
  rest.put('*/api/resources/:id', async (req, res, ctx) => {
    const body = await req.json();

    const resource = RESOURCES.find(
      (currResource) => currResource.id === req.params.id
    );

    if (!resource) {
      return res(ctx.status(400));
    }

    if (
      RESOURCES.some(
        (currResource) =>
          currResource.id !== resource.id && currResource.name === body.name
      )
    ) {
      return res(
        ctx.status(400),
        ctx.json({
          message: `Resource with name "${body.name}" already exists.`,
        })
      );
    }

    resource.name = body.name;
    resource.metadata = body.metadata;

    return res(ctx.status(200), ctx.json<Resource>(resource));
  }),
];
