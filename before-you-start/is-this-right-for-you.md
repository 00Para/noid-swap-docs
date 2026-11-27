# Is No1d Swap Right for You Today?

Before you install anything, take two minutes to check whether No1d Swap fits what you want to do. The app is designed to fail safely—but atomic swaps still have real requirements that an exchange hides from you.

---

## Quick Pre-Flight Checklist

No1d Swap is a good fit **today** if all five of these are true:

1. **You have a counterparty you have a reason to trust.**
   There is no order book or matching engine. Bob can post his invitation on the public offers board to find someone (see [Finding a counterparty](../swap-guide/overview-and-checklist.md#finding-a-counterparty)), but a stranger from a board is still a stranger. Parano1d mining is currently concentrated enough that an ETH seller should only swap with someone they have a reason to trust (see below).
2. **Your swap fits inside the launch caps.**
   On Ethereum mainnet, the app enforces a hard limit of **5 to 20,000 NOID** and at most **1 ETH** per swap. Only swap amounts you can afford to lose while the software is young and unaudited.
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
| **Alice** | **NOID** | **ETH** | Always the NOID side: makes the secret. Locks first (longer deadline ~6 h 45 min if stopped). Must reveal before the cutoff. |
| **Bob** | **ETH** (today; more coins may come later) | **NOID** | The side with the other coin. Sends the invitation first. Exposed to Parano1d miner concentration and must stay online to claim NOID within ~75 min after Alice reveals. |

{% hint style="info" %}
**Asymmetric risk:** If you are selling **NOID (Alice)**, you are not exposed to Parano1d majority-miner attacks—your worst case if Bob disappears is waiting ~6 h 45 min for your NOID to unlock. If you are selling **ETH (Bob)**, you carry both the online-claim requirement and the Parano1d miner-concentration risk.
{% endhint %}

---

## Why Counterparty Trust Still Matters Today

Even though smart contracts remove custody risk, **Parano1d mining is currently concentrated**:

* Readings in late November 2026 showed one producer making about **76% to 82%** of recent Parano1d blocks (the last 2,880 and the last 720). An older reading (2026-11-08) had one address at 45% to 63% of daily blocks over 20 days.
* **At that level the risk is likely, not just possible.** If the NOID seller (Alice) is that producer, or controls more than 50% of Parano1d's hashrate in any other way, she can take Bob's ETH and then stall Bob's NOID claim until the deadline expires—taking both sides. No timeout length can defeat a majority miner.
* **What the app does:** Before Bob locks ETH, his app reads recent Parano1d block headers (both 24-hour and 6-hour windows). It **warns** and does not block:
  * **Above 35%:** a warning.
  * **Above 50%:** a loud warning.
  * **Cannot be read:** shown as "unknown".
  * In every case Bob must tick that he read it before he approves. The program does not make the risk smaller. **If you are Bob, swap only with someone you have a reason to trust, or do not lock ETH.**

Read the full explanation in [Limits & Risks](../security/limits-and-risks.md).

---

## When You Should Wait Instead

Hold off on a real swap if:

* You want to trade with an anonymous stranger for a large amount.
* You are on a laptop that you need to close and put in a bag mid-swap (closing a Mac lid on battery can still sleep the machine).
* You need an instant swap—chain finality alone takes ~20 minutes on Ethereum and ~10 minutes on Parano1d.
* You want to swap **USDC**, **BTC**, or another asset—those are not enabled in the mainnet desktop app today.

Want to see how the app feels without risking anything? Jump straight to [Try a 5-Minute Practice Swap](../getting-started/practice-swap.md).
