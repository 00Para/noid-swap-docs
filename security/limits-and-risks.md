# Limits & Risks

No1d Swap removes bridges, custodians, and admin keys—but it does **not** remove every risk. This page mirrors the app's **Limits and risks** card in plain English so you know the exact boundaries before putting real funds on the line.

---

## The Three Ways to Lose Funds

### 1. Bob Is Offline After Alice Reveals
* **Who is exposed:** Bob (ETH seller) only.
* **What happens:** Once Alice claims Bob's ETH on Ethereum, the secret `s` is public and Bob's app has **at least ~75 minutes** to submit and finalize the NOID claim before Parano1d deadline `D`. If Bob's computer is turned off, asleep, or disconnected for that entire window, Alice can reclaim the NOID after `D` and keep the ETH.
* **How to stay safe:** Plug your laptop in, leave the lid open, keep the Parano1d wallet app synced, and know how to run a [second-computer close](../troubleshooting/recovery-and-second-computer.md) if your primary machine fails.

### 2. Parano1d Majority-Miner Attack (Mining Concentration)
* **Who is exposed:** Bob (ETH seller) only. Alice is not exposed.
* **What happens:** If Alice (the NOID seller) also controls **more than 50%** of Parano1d's mining hashrate, she can reveal `s` on Ethereum, collect Bob's ETH, and then censor or reorg Bob's NOID claim until `D` passes—taking both sides. No timeout length protects against a > 50% miner.
* **Real-world state:** Chain block-header measurements (2026-11-08) showed one mining address producing **45% to 63%** of daily blocks over 20 days (**52.7%** on the last measured day).
* **What Bob's app checks:** Before Bob locks ETH, his app reads recent Parano1d block headers across the last **24 hours (2,880 blocks)** and **6 hours (720 blocks)**:
  * **35%–65% in either window:** Bob is shown the exact measured percentage and must explicitly accept it in his approval.
  * **Above 65% in either window:** Hard block. Nobody can waive it; the approval screen reopens automatically once both windows fall back to ≤ 65%.
  * **Top two addresses > 50%:** Displays a warning note.
* **Why the screen is not a defense:** A miner can split blocks across multiple fresh addresses, join a pool, or rent hashrate *after* Bob locks. **Treat the gate as a smoke alarm, not a shield—sell ETH only to someone you have a reason to trust.**

### 3. Unaudited Software & Unreviewed Hashlock Preimage Assumption
* **Who is exposed:** Both Alice and Bob.
* **What happens:** Every code review, design review, formal model check, and chaos test in `00Para/noid-swap` was conducted **internally by the project**—none came from an independent outside auditor or cryptographer.
* In addition, the swap hashlock relies on the preimage resistance of Parano1d's `Addr(s)` function (a single Poseidon2b permutation over GF(2¹²⁸)), which no external cryptographer has formally reviewed for cross-chain HTLC use.
* **How to stay safe:** Keep amounts small and strictly within the launch caps (**0.5 ETH / 2,500 NOID**).

---

## Other Known Limitations (Non-Fatal, Built Into HTLCs)

Even when nobody loses their coins, atomic swaps have economic quirks you should expect:

* **Free option:** After Alice locks NOID, Bob can pause briefly before locking ETH; after Bob locks ETH, Alice can wait before revealing `s`. Short windows and small amounts limit this, but it is inherent to HTLCs.
* **Liquidity lock-up (griefing):** If Bob disappears after Alice funds NOID, Alice gets 100% of her NOID back (minus network fees), but her funds are tied up for **~6 h 45 min**.
* **On-chain linkability:** Anyone watching both chains can link Alice's NOID lock and Bob's ETH lock via the shared 32-byte value `A = Addr(s)` (even for swaps that refund).
* **No smart-contract wallets on Ethereum:** Ethereum payout addresses must be standard EOAs. A contract receiver that reverts on ETH transfer would cause `claim()` to revert *with the secret already exposed in calldata*.
* **First-seen mempool on Parano1d (close fee griefing):** Anyone who knows `s` can broadcast the NOID close to Bob at any fee up to the swap's `max_fee` (at least **50,000 μNOID / 0.05 NOID**, more when the network's fee estimate is high, and never above 1% of the swap). The NOID still goes strictly to Bob, but Bob absorbs that fee.

---

## What Is Intentionally Disabled on Mainnet

To keep the mainnet surface small and well-tested, the desktop app **refuses** the following on Ethereum mainnet today:

* The Nostr offer board (test networks only)
* The legacy terminal web console
* Parano1d HTLC contract v2 (fixed-fee close — awaiting live hostile testing)
* The stock-wallet Parano1d variant (`Derive(m, 0)`)
* Legacy SHA-256 + RISC Zero equivalence-proof locks (Ethereum mainnet uses `HTLCPoseidonV2`)
* Bitcoin (`btc/` signet prototype) and ERC-20 (`HTLCERC20.sol`)

---

## Reporting a Vulnerability

If you find a bug that could put funds at risk, **do not post details in a public GitHub issue.**

1. Open an issue on [00Para/noid-swap](https://github.com/00Para/noid-swap/issues) containing only: `"security, please open a private channel"` (or use GitHub's private vulnerability reporting if enabled).
2. Include the commit/version, file and line number, attack scenario, and any reproduction test.

See `SECURITY.md` in the repository for full details.
