declare module "etherscan-api" {
  export type EtherscanClient = {
    contract: {
      getabi: (address: string) => { result: import("abitype").Abi };
    };
  };

  export function init(
    apiKey: string,
    network: string,
    timeout: number,
    client: import("axios").AxiosInstance
  ): EtherscanClient;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.svg";
