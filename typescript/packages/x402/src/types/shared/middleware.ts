import { CreateHeaders } from "../../verify";
import { Money } from "./money";
import { Network } from "./network";
import { Resource } from "./resource";
import { LocalAccount } from "viem";
import { SignerWallet } from "./evm";
import { HTTPRequestStructure } from "..";

export type FacilitatorConfig = {
  url: Resource;
  createAuthHeaders?: CreateHeaders;
};

export type PaywallConfig = {
  cdpClientKey?: string;
  appName?: string;
  appLogo?: string;
  sessionTokenEndpoint?: string;
};

export type PaymentMiddlewareConfig = {
  description?: string;
  mimeType?: string;
  maxTimeoutSeconds?: number;
  inputSchema?: Omit<HTTPRequestStructure, "type" | "method">;
  outputSchema?: object;
  customPaywallHtml?: string;
  resource?: Resource;
};

export interface ERC20TokenAmount {
  amount: string;
  asset: {
    address: `0x${string}`;
    decimals: number;
    eip712: {
      name: string;
      version: string;
    };
  };
}

export type Price = Money | ERC20TokenAmount;

export interface RouteConfig {
  price: Price;
  network: Network;
  config?: PaymentMiddlewareConfig;
}

export type RoutesConfig = Record<string, Price | RouteConfig>;

export interface RoutePattern {
  verb: string;
  pattern: RegExp;
  config: RouteConfig;
}

export type Wallet = SignerWallet | LocalAccount;
