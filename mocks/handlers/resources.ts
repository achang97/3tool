import { rest } from 'msw';
import { Resource, ResourceType } from '@app/types';
import { generateRandomDate } from '../utils';

const mockResources: Resource[] = [
  {
    _id: '1',
    type: ResourceType.SmartContract,
    name: 'stakingPool',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    data: {
      smartContract: {
        chainId: 5,
        address: '0x5059475daFA6Fa3d23AAAc23A5809615FE35a1d3',
        abiId: '3',
      },
    },
  },
  {
    _id: '2',
    type: ResourceType.SmartContract,
    name: 'donations',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    data: {
      smartContract: {
        chainId: 5,
        address: '0xBedBE2B974A3622105236787325229218065cCDE',
        abiId: '4',
      },
    },
  },
  {
    _id: '3',
    type: ResourceType.Abi,
    name: 'stakingPool',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    data: {
      abi: {
        isProxy: true,
        abi: '[{"inputs":[{"internalType":"address","name":"contractLogic","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"}]',
        logicAbi:
          '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newAddress","type":"address"}],"name":"CodeAddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"anotherVariable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLogicAddress","outputs":[{"internalType":"address","name":"logicAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getThisAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_someVariable","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"otherArg","type":"uint256"}],"name":"setOtherVariable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"someArg","type":"uint256"}],"name":"setSomeVariable","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"someVariable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newLogic","type":"address"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
      },
    },
  },
  {
    _id: '4',
    type: ResourceType.Abi,
    name: 'donations',
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate(),
    data: {
      abi: {
        abi: '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"donations","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalDonations","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
        isProxy: false,
      },
    },
  },
];

export const resourcesHandlers = [
  rest.get('*/api/resources/:id', (req, res, ctx) => {
    const resource = mockResources.find((currResource) => currResource._id === req.params.id);

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
        mockResources.filter((resource) => !name || resource.name.toLowerCase().includes(name))
      )
    );
  }),
  rest.post('*/api/resources', async (req, res, ctx) => {
    const body = await req.json<Pick<Resource, 'name' | 'type' | 'data'>>();

    if (mockResources.some((resource) => resource.name === body.name)) {
      return res(
        ctx.status(400),
        ctx.json({
          message: `Resource with name "${body.name}" already exists.`,
        })
      );
    }

    const newResource: Resource = {
      _id: crypto.randomUUID(),
      type: body.type,
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: body.data,
    };
    mockResources.push(newResource);

    return res(ctx.status(201), ctx.json<Resource>(newResource));
  }),
  rest.put('*/api/resources/:id', async (req, res, ctx) => {
    const body = await req.json<Pick<Resource, '_id'> & Partial<Pick<Resource, 'name' | 'data'>>>();

    const resource = mockResources.find((currResource) => currResource._id === req.params.id);

    if (!resource) {
      return res(ctx.status(400));
    }

    if (
      mockResources.some(
        (currResource) => currResource._id !== resource._id && currResource.name === body.name
      )
    ) {
      return res(
        ctx.status(400),
        ctx.json({
          message: `Resource with name "${body.name}" already exists.`,
        })
      );
    }

    if (body.name) resource.name = body.name;
    if (body.data) resource.data = body.data;
    resource.updatedAt = new Date().toISOString();

    return res(ctx.status(200), ctx.json<Resource>(resource));
  }),
];
