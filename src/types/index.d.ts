declare module "uuid";

declare global {
  interface Window {
    ethereum: any;
  }
}

export enum SuperTokens {
  TestMatic = "MATICx",
  TestDAI = "fDAIx",
}

export type CreateInvestmentOptios = {
  streamToken: SuperTokens;
  senderAddress: string;
  receiverAddress: string;
  flowRate?: string;
};
