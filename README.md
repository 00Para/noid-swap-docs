# Welcome to No1d Swap

**No1d Swap** is a desktop app for Windows and macOS that lets two people swap **NOID** (Parano1d) for **ETH** (Ethereum) directly—with no bridge, no wrapped token, no liquidity pool, and no middleman.

A hash-time-locked contract on each chain holds the coins. Neither contract has an owner, an admin key, a pause button, or a protocol fee. Either both people receive what they agreed on, or both get their own coins back automatically once the deadlines pass.

{% hint style="warning" %}
**Read before swapping real funds:** No1d Swap is early software built for **two people who have a reason to trust each other**, and for **small amounts only**. Start with [Is No1d Swap Right for You Today?](before-you-start/is-this-right-for-you.md) and [Limits & Risks](security/limits-and-risks.md).
{% endhint %}

---

## At a Glance

| Detail | Mainnet | Sepolia (Testnet) |
|---|---|---|
| **Max per swap** | **2,500 NOID** and **0.5 ETH** | **20 NOID** and **0.01 ETH** |
| **Minimum swap** | **5 NOID** | **5 NOID** |
| **Protocol fee** | **0%** (network fees only) | **0%** (network fees only) |
| **Typical time** | **~50 minutes** from funding to settled | **~50 minutes** |
| **Refund time (if stopped)** | ETH: **~2 h 20 min** · NOID: **~6 h 45 min** | ETH: **~1 h 30 min** · NOID: **~3 h 5 min** |
| **Bob's claim window after the reveal** | **at least ~75 min** | **only ~5 min** (stay online) |
| **Supported OS** | Windows (x64) · macOS (Apple Silicon) | Windows (x64) · macOS (Apple Silicon) |

{% hint style="info" %}
**Parano1d has no test network.** Even when you choose Ethereum Sepolia, the NOID side is always real Parano1d mainnet NOID. If you want to test the app with zero coins and zero setup, use the built-in [**Practice Swap**](getting-started/practice-swap.md) first.
{% endhint %}

---

## What No1d Swap Is—and Isn't

* **It is** a self-custodial atomic swap app between two known counterparties.
* **It is not** an exchange, order book, broker, or custodial wallet.
* **It does not set prices.** You and the other person agree on the amounts elsewhere (for example, in chat or on a call), then enter those exact amounts into the app.
* **It has not had an outside audit yet.** Every security review so far was done internally by the project. Keep amounts small.

---

## Where to Start

1. **Decide if it fits your swap:** Read [Is No1d Swap Right for You Today?](before-you-start/is-this-right-for-you.md) (2 minutes).
2. **Understand the mechanics:** Skim [How It Works](before-you-start/how-it-works.md) so the order of steps and deadlines makes sense.
3. **Install safely:** Follow [Download & Verify the Installer](getting-started/install-and-verify.md) to verify the signed release notice and file hash before opening the installer.
4. **Rehearse with fake coins:** Run the 5-minute [Practice Swap](getting-started/practice-swap.md) from the app menu.
5. **Run your first swap:** Follow the [Swap Overview & Two-Person Checklist](swap-guide/overview-and-checklist.md) together with your counterparty.

---

## Official Links & Pinned Identifiers

* **Source repository:** [github.com/00Para/noid-swap](https://github.com/00Para/noid-swap)
* **Updates on X:** [@No1dSwap](https://x.com/No1dSwap)
* **Mainnet Ethereum contract (`HTLCPoseidonV2`):** `0x4e364cC86EdBF307CC6F336F3a72e1a24d284D70`
* **Pinned contract code hash:** `0xf510d2a368c730339fa7cf5e023bcf2429d5732793f043e03025780bb7043ff3`
* **Pinned Ed25519 release public key:** `Thg9nhwwvqoKG4yOqiZM/PBeqT5LcrFFa7cKAHuqYxk=`

Never trust contract addresses or installer hashes from screenshots or chat messages—always cross-check them using [Download & Verify the Installer](getting-started/install-and-verify.md) and [Verify the Smart Contracts](security/verify-the-contracts.md).

---

## Support the Project (Voluntary Donations)

No1d Swap charges **0% protocol fees**. If you find it useful and want to support ongoing development and an independent external security audit, voluntary **NOID** donations are welcome:

```text
o1epu2t45yg2a87xfvtzd3yuha8vejj9k4s762n89dwun3cp67k7nqkt2ued
```

Donations are strictly optional and never required to use the software.
