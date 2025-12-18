import { ethers } from "ethers";

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export type VerifyArgs = {
  rpcUrl: string;
  expectedChainId: number;
  usdcAddress: string;
  receiver: string;
  minAmountUsdc: string; // e.g., "5" (USDC has 6 decimals)
  txHash: string;
  confirmationsRequired: number;
};

export type VerifyResult =
  | { ok: true; receivedRaw: bigint; from?: string; to?: string }
  | { ok: false; reason: string };

function toUnitsUsdc(amount: string): bigint {
  // USDC typically has 6 decimals
  return ethers.parseUnits(amount, 6);
}

export async function verifyUsdcPayment(args: VerifyArgs): Promise<VerifyResult> {
  const provider = new ethers.JsonRpcProvider(args.rpcUrl);

  const net = await provider.getNetwork();
  const chainId = Number(net.chainId);
  if (chainId !== args.expectedChainId) {
    return { ok: false, reason: `Wrong chainId: got ${chainId}, expected ${args.expectedChainId}` };
  }

  const tx = await provider.getTransaction(args.txHash);
  if (!tx) return { ok: false, reason: "Transaction not found" };

  const receipt = await provider.getTransactionReceipt(args.txHash);
  if (!receipt) return { ok: false, reason: "Receipt not found yet" };

  // Confirmations check
  const latest = await provider.getBlockNumber();
  const conf = receipt.blockNumber ? latest - receipt.blockNumber + 1 : 0;
  if (conf < args.confirmationsRequired) {
    return { ok: false, reason: `Not enough confirmations (${conf}/${args.confirmationsRequired})` };
  }

  // Must be a successful tx
  if (receipt.status !== 1) return { ok: false, reason: "Transaction failed (status != 1)" };

  // USDC contract must be correct address (native USDC address on Base)
  const usdc = args.usdcAddress.toLowerCase();
  const receiver = args.receiver.toLowerCase();

  // Parse Transfer logs
  const iface = new ethers.Interface(ERC20_ABI);
  let totalReceived: bigint = 0n;

  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== usdc) continue;

    try {
      const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
      if (parsed?.name !== "Transfer") continue;

      const from = String(parsed.args.from).toLowerCase();
      const to = String(parsed.args.to).toLowerCase();
      const value = BigInt(parsed.args.value);

      if (to === receiver) {
        totalReceived += value;
      }
    } catch {
      // ignore non-matching logs
    }
  }

  const min = toUnitsUsdc(args.minAmountUsdc);
  if (totalReceived < min) {
    return { ok: false, reason: `Insufficient USDC received: ${totalReceived} < ${min}` };
  }

  return { ok: true, receivedRaw: totalReceived };
}
