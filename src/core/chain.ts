import { JsonRpcProvider } from 'ethers';
export const getProvider = (rpc: string) => new JsonRpcProvider(rpc);
