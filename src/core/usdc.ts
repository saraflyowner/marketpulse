import { Contract } from 'ethers';
export const USDC_ABI = ['event Transfer(address indexed from,address indexed to,uint256 value)'];
export const getUSDC = (addr: string, provider: any) => new Contract(addr, USDC_ABI, provider);
