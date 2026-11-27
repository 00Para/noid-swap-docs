# Frequently Asked Questions

### Why is there no bridge, liquidity pool, or wrapped NOID?
Bridges and pools introduce custodial multisigs, smart-contract liquidity honeypots, and admin keys. No1d Swap locks real NOID on Parano1d and real ETH on Ethereum directly between two people. Neither contract has an owner, admin key, or fee.

---

### Is there a fee to use No1d Swap?
**No.** The project takes **0%**. You pay only standard Ethereum gas and Parano1d network transaction fees.

If you'd like to support development voluntarily, NOID donations go to `o1epu2t45yg2a87xfvtzd3yuha8vejj9k4s762n89dwun3cp67k7nqkt2ued`.

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

### Why are swaps capped at 1 ETH and 20,000 NOID?
No1d Swap is young software and has **not** had an independent external audit yet. The hard caps protect early users from putting large balances into unaudited code and reflect current Parano1d mining concentration.

---

### What is the miner-concentration warning on Bob's approval?
Before Bob locks ETH, his app reads who mined the last 24 hours and 6 hours of Parano1d blocks. Since 0.2.0 it **warns and never blocks**: a warning above 35%, a loud warning above 50%, "unknown" if the share cannot be read, and Bob ticks that he read it. The risk is real: above half of the blocks, a miner who is Alice can take Bob's ETH and no time window protects him. At the late-November readings (about 76% to 82%) that is likely. Lock ETH only against someone you have a reason to trust. See [Limits & Risks](../security/limits-and-risks.md).

---

### How do I find someone to swap with?
Bob can press **Post to the offers board** on his card to publish his invitation to the public offers board. It is opt-in and shows a preview first. See [Finding a counterparty](../swap-guide/overview-and-checklist.md#finding-a-counterparty).

---

### What is the market reference rate on the form?
On mainnet only, the new-swap form and the approval show the swap's rate beside a reference from the site's own snapshot. It is for comparing: it never changes your terms and is hidden when stale or thin. See [Caps, Fees & Timelines](../swap-guide/caps-fees-and-timelines.md).

---

### Can I use a Safe / Gnosis / smart-contract wallet as my Ethereum payout address?
**No.** Use a standard externally owned account (EOA), such as a normal MetaMask or hardware-wallet address. A smart-contract wallet that reverts on receiving ETH could cause Alice's `claim()` transaction to fail *after* exposing the secret in calldata.

---

### Does No1d Swap support USDC, Bitcoin, or an order book?
Not on mainnet today. The repository contains prototypes for Bitcoin (`btc/`, signet-only), ERC-20 (`HTLCERC20.sol`), and the in-program Nostr offer board and its automatic handover (test networks only), all intentionally disabled on mainnet to keep the launch surface minimal and verifiable.

---

### What if I lose my computer—can my recovery code restore everything by itself?
Your paper recovery code unlocks your swap files **when combined with your swap's run folder** (`runs/<swap-id>/`). It is not a BIP-39 seed phrase that scans the blockchain—keep your paper recovery code safe *and* back up any active run folder if you have funds currently locked. Version 0.2.0 adds a sealed backup file per swap and a **Restore a swap…** menu item: see [Back Up & Restore a Swap](../troubleshooting/back-up-and-restore.md).
