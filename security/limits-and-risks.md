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
* **What happens:** If Alice (the NOID seller) also controls **more than 50%** of Parano1d's mining hashrate, she can reveal `s` on Ethereum, collect Bob's ETH, and then censor or reorg Bob's NOID claim until `D` passes—taking both sides. No timeout length protects against a > 50% miner, and the program does not stop Bob from locking in that case.
* **Real-world state:** Readings in late November 2026 showed one producer making about **76% to 82%** of recent blocks (the last 2,880 and the last 720). At that level the attack is **likely, not just possible**, if Alice is that producer. Since 0.2.0 the program only warns (it used to refuse above 65%), so nothing stops Bob from approving: **do not lock ETH against someone you have no reason to trust.** Older history: on 2026-11-08 one address was at 45% to 63% of daily blocks over 20 days.
* **What Bob's app checks:** Before Bob locks ETH, his app reads recent Parano1d block headers across the last **24 hours (2,880 blocks)** and **6 hours (720 blocks)**:
  * **Above 35% in either window:** a warning with the exact measured percentage.
  * **Above 50%:** a loud warning.
  * **Cannot be read:** shown as "unknown".
  * Bob ticks that he read it before he approves. It is a warning, never a block.
  * **Still refused:** a second Parano1d node that disagrees or cannot be read, a missing second node on mainnet, and a remembered disagreement between nodes. These checks catch a lying node, not a large miner.
* **Why the screen is not a defense:** A miner can split blocks across multiple fresh addresses, join a pool, or rent hashrate *after* Bob locks. **Treat the screen as a smoke alarm, not a shield—sell ETH only to someone you have a reason to trust.**

### 3. Unaudited Software & Unreviewed Hashlock Preimage Assumption
* **Who is exposed:** Both Alice and Bob.
* **What happens:** Every code review, design review, formal model check, and chaos test in `00Para/noid-swap` was conducted **internally by the project**—none came from an independent outside auditor or cryptographer.
* In addition, the swap hashlock relies on the preimage resistance of Parano1d's `Addr(s)` function (a single Poseidon2b permutation over GF(2¹²⁸)), which no external cryptographer has formally reviewed for cross-chain HTLC use.
* **How to stay safe:** Keep amounts small and strictly within the launch caps (**1 ETH / 20,000 NOID**).

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

* The in-program Nostr offer board and its automatic handover (test networks only). Bob's opt-in "Post to the offers board" button is allowed: see [Finding a counterparty](../swap-guide/overview-and-checklist.md#finding-a-counterparty)
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
