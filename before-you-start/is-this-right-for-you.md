# Is No1d Swap Right for You Today?

Before you install anything, take two minutes to check whether No1d Swap fits what you want to do. The app is designed to fail safely—but atomic swaps still have real requirements that an exchange hides from you.

---

## Quick Pre-Flight Checklist

No1d Swap is a good fit **today** if all five of these are true:

1. **You already have a counterparty you have a reason to trust.**
   There is no order book or matching engine. More importantly, Parano1d mining is currently concentrated enough that an ETH seller should only swap with someone they have a reason to trust (see below).
2. **Your swap fits inside the launch caps.**
   On Ethereum mainnet, the app enforces a hard limit of **5 to 2,500 NOID** and at most **0.5 ETH** per swap. Only swap amounts you can afford to lose while the software is young and unaudited.
3. **You have ~1 hour where both computers can stay on and online.**
   A normal swap takes about **50 minutes** from funding to finish. If you are selling ETH (Bob), your computer **must** be online during the ~75-minute claim window after Alice reveals the secret.
4. **You can run the Parano1d wallet app locally.**
   No1d Swap talks to your own synced Parano1d wallet app on `127.0.0.1:9601`—it does not ask a third-party server to handle your NOID wallet.
5. **You are using regular Ethereum accounts (EOAs), not smart-contract wallets.**
   Ethereum payout addresses must be standard externally owned accounts (like a normal hardware wallet or MetaMask account) that accept plain ETH transfers cleanly.

---

## The Two Roles: Alice vs. Bob

In every swap, the roles are fixed by which coin you are selling:

| Role | You sell | You receive | Key responsibility |
|---|---|---|---|
| **Alice** | **NOID** | **ETH** | Locks first (longer deadline ~6 h 45 min if stopped). Must reveal before the cutoff. |
| **Bob** | **ETH** | **NOID** | Sends the invitation first. Exposed to Parano1d miner concentration and must stay online to claim NOID within ~75 min after Alice reveals. |

{% hint style="info" %}
**Asymmetric risk:** If you are selling **NOID (Alice)**, you are not exposed to Parano1d majority-miner attacks—your worst case if Bob disappears is waiting ~6 h 45 min for your NOID to unlock. If you are selling **ETH (Bob)**, you carry both the online-claim requirement and the Parano1d miner-concentration risk.
{% endhint %}

---

## Why Counterparty Trust Still Matters Today

Even though smart contracts remove custody risk, **Parano1d mining is currently concentrated**:

* Measurements from chain block headers (2026-11-08) showed a single mining address producing **45% to 63%** of daily blocks over 20 days.
* If the NOID seller (Alice) also controls more than 50% of Parano1d's hashrate, she could take Bob's ETH and then stall Bob's NOID claim until the deadline expires—taking both sides. No timeout length can defeat a majority miner.
* **What the app does:** Before Bob locks ETH, his app reads recent Parano1d block headers (both 24-hour and 6-hour windows):
  * **Above 35%:** Bob must explicitly acknowledge the measured share in his approval.
  * **Above 65%:** The app **hard-blocks** new locks—nobody can override it until both windows drop back to 65% or lower.

Read the full explanation in [Limits & Risks](../security/limits-and-risks.md).

---

## When You Should Wait Instead

Hold off on a real swap if:

* You want to trade with an anonymous stranger for a large amount.
* You are on a laptop that you need to close and put in a bag mid-swap (closing a Mac lid on battery can still sleep the machine).
* You need an instant swap—chain finality alone takes ~20 minutes on Ethereum and ~10 minutes on Parano1d.
* You want to swap **USDC**, **BTC**, or another asset—those are not enabled in the mainnet desktop app today.

Want to see how the app feels without risking anything? Jump straight to [Try a 5-Minute Practice Swap](../getting-started/practice-swap.md).
