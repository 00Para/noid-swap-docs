# Frequently Asked Questions

### Why is there no bridge, liquidity pool, or wrapped NOID?
Bridges and pools introduce custodial multisigs, smart-contract liquidity honeypots, and admin keys. No1d Swap locks real NOID on Parano1d and real ETH on Ethereum directly between two people. Neither contract has an owner, admin key, or fee.

---

### Is there a fee to use No1d Swap?
**No.** The project takes **0%**. You pay only standard Ethereum gas and Parano1d network transaction fees.

---

### Is Sepolia NOID fake test money?
**No!** Parano1d has **no test network**. When you select Sepolia in No1d Swap, the Ethereum side uses free Sepolia test ETH, **but the NOID side is always real Parano1d mainnet NOID** (capped at 20 NOID per swap on Sepolia).

If you want to try the app with zero real coins, use the built-in [**Practice Swap**](../getting-started/practice-swap.md) from the app menu.

---

### Why does the NOID seller (Alice) always have to lock first?
Parano1d uses zero-knowledge proofs instead of signatures, so spending NOID never reveals a secret on-chain. The secret can only be revealed on Ethereum—which means the person who creates the secret (Alice, selling NOID) must lock NOID first with the longer deadline and claim ETH to publish the secret for Bob. See [How It Works](../before-you-start/how-it-works.md).

---

### How long does a swap take?
* **Normal swap:** About **50 minutes** from Alice's funding to both sides finalized (most of this is waiting for ~19 minutes of Ethereum finality and ~10 minutes of Parano1d finality).
* **If the swap stops mid-way:** Bob's ETH returns about **2 h 20 min** after his lock; Alice's NOID returns about **6 h 45 min** after Alice presses **Prepare**.

---

### Can I close my laptop or quit the app mid-swap?
* **Keep it open and plugged in.** While coins are locked, No1d Swap keeps your computer awake automatically—**except** on macOS laptops, where closing the lid on battery can still put the Mac to sleep.
* If you accidentally quit the app or your computer restarts, reopen No1d Swap and it will pick up where it left off from your saved run folder.
* **Important for Bob:** Deadlines keep ticking on the blockchains even if your computer is off. After Alice reveals the secret on Ethereum, Bob's computer **must** be online within ~75 minutes to claim his NOID (or use a [second computer](../troubleshooting/recovery-and-second-computer.md)).

---

### Why did Windows or macOS warn me when installing?
No1d Swap is an independent open-source project with no corporate entity and no commercial Apple/Microsoft code-signing certificate. OS warnings are expected—**do not bypass them until you have cryptographically verified `release.json.sig` and the installer's SHA-256** using [Download & Verify the Installer](../getting-started/install-and-verify.md).

---

### Why are swaps capped at 0.5 ETH and 2,500 NOID?
No1d Swap is young software and has **not** had an independent external audit yet. The hard caps protect early users from putting large balances into unaudited code and reflect current Parano1d mining concentration.

---

### Why is Bob's approval blocked with a miner-concentration message?
Before Bob locks ETH, his app reads who mined the last 24 hours and 6 hours of Parano1d blocks. If a single mining address produced **more than 65%** of blocks in either window, No1d Swap hard-blocks new ETH locks until mining decentralizes back to ≤ 65%. See [Limits & Risks](../security/limits-and-risks.md).

---

### Can I use a Safe / Gnosis / smart-contract wallet as my Ethereum payout address?
**No.** Use a standard externally owned account (EOA), such as a normal MetaMask or hardware-wallet address. A smart-contract wallet that reverts on receiving ETH could cause Alice's `claim()` transaction to fail *after* exposing the secret in calldata.

---

### Does No1d Swap support USDC, Bitcoin, or an order book?
Not on mainnet today. The repository contains prototypes for Bitcoin (`btc/`, signet-only), ERC-20 (`HTLCERC20.sol`), and a Nostr offer board (test networks only), all intentionally disabled on mainnet to keep the launch surface minimal and verifiable.

---

### What if I lose my computer—can my recovery code restore everything by itself?
Your paper recovery code unlocks your swap files **when combined with your swap's run folder** (`runs/<swap-id>/`). It is not a BIP-39 seed phrase that scans the blockchain—keep your paper recovery code safe *and* back up any active run folder if you have funds currently locked.
