declare module "uuid";

declare global {
  interface Window {
    ethereum: any;
  }
}

export type CreateInvestmentOptios = {
  streamToken: SuperTokens;
  senderAddress: string;
  receiverAddress: string;
  flowRate?: string;
};
