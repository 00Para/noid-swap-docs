# Swap Overview & Two-Person Checklist

A No1d Swap takes **two people sitting at their screens together** for the first few minutes, followed by roughly **50 minutes** of automated waiting while both blockchains finalize each leg.

Before either person sends a single coin, the app guides you through a short **three-part handshake**:

1. **Bob sends an invitation** (amounts + Bob's two public addresses—zero secrets).
2. **Alice prepares the swap and sends back her public swap copy** (`alice.bundle.json`—zero secrets).
3. **Both compare the 16-digit check line** on a separate channel (call, Signal, etc.) and approve once.

Only *after* both sides confirm the check line and approve does anyone deposit coins.

---

## Side-by-Side Flow

| Step | Alice (sells NOID → gets ETH) | Bob (sells ETH → gets NOID) |
|---|---|---|
| **0. Agree on terms** | Agree on exact NOID & ETH amounts and network (Mainnet or Sepolia). | Agree on exact NOID & ETH amounts and network. |
| **1. Invitation** | Wait for Bob's invitation. | Create a **New swap** as Bob → **Save an invitation for Alice…** (`no1d-invitation.json`) *(or **Copy invitation code**, v0.1.8 and later)* and send it to Alice. |
| **2. Prepare** | Open Bob's invitation in **New swap**, double-check every field, enter your payout addresses, and click **Prepare**. *(This starts the ~6-hour NOID clock!)* | Wait for Alice's public swap file. |
| **3. Swap copy** | Save your public swap copy (`alice.bundle.json`) and send it to Bob. | **Choose Alice's file…** (`alice.bundle.json`); the app verifies it automatically. |
| **4. Check line** | Read your **16-digit check line** (`xxxx xxxx xxxx xxxx`) to Bob on another channel and confirm it matches. | Compare your **16-digit check line** with Alice's and confirm it matches. |
| **5. Single approval** | Review rate, fees, and worst-case refund time → approve once. | Review rate, fees, worst-case refund time, and **Parano1d miner share** → approve once. |
| **6. Deposit** | Send NOID (and a tiny ETH gas reserve for reveal) to the swap's own deposit addresses shown on screen. | Send ETH (+ gas buffer) to the swap's own Ethereum key address shown on screen. |
| **7. Automated execution** | App funds NOID contract → waits for Bob's final ETH lock → reveals `s` & takes ETH → sweeps leftovers to your payout address. | App checks Alice's final NOID lock + miner share → locks ETH → reads `s` after reveal → claims NOID → sweeps leftovers to your payout address. |

{% hint style="warning" %}
**Never send your main wallet seed, your recovery code, or `*.swap.json` to anyone.** The only things that ever leave your computer are Bob's public invitation (`no1d-invitation.json` or `no1dinv1:…`) and Alice's public bundle (`alice.bundle.json`), neither of which contains any secret.
{% endhint %}

---

## Why the 16-Digit Check Line Matters

The **check line** is four groups of four digits (16 digits total) computed independently on both computers from the exact agreed swap terms—amounts, addresses, hashlock, contract address, and deadlines.

Comparing the check line over a **second channel** (voice call, video call, or a separate messaging app) guarantees that:
* Neither side has a typo in the amounts or addresses.
* Nobody tampered with the invitation or bundle file in transit.
* Both computers are about to lock against the exact same contract and hashlock.

If the check lines don't match **digit for digit**, stop and do not approve or deposit.

---

## Pre-Swap Quick Check (Both Sides)

* [ ] **Parano1d wallet app** is open and fully synced (`127.0.0.1:9601`).
* [ ] **Paper recovery code** is written down safely.
* [ ] **Both people are at their screens** before Alice presses **Prepare**.
* [ ] **Laptops are plugged in** with lids open (closing a Mac lid on battery can sleep it).
* [ ] **Testnet reminder:** If you're doing a dry run on **Sepolia**, remember that **NOID is still real mainnet NOID** (capped at 20 NOID / 0.01 Sepolia ETH), and Bob's claim window after the reveal is only about **5 minutes** on Sepolia (75 on mainnet): Bob stays at his screen.

---

## Reading the Clock Line on the Swap Card

While a swap is in flight under an active approval, one line under the card's status sentence shows three things:

* **The deadline that matters now:** when your refund opens, when a reveal must start, how long Alice can reveal, or when Bob's claim must be in a block, with a clock time and the time or blocks left.
* **A status chip:** **On track** (normal progress), **Refund path** (the swap is on its refund or recovery path, or the reveal window has passed) or **Under 30 minutes** (30 minutes or less left on your own reveal or claim deadline).
* **Keep it open:** **"Waiting on the chains · keep the program open"**, or **"Sending now · do not close the program"** while a transaction is being sent. The card never says the program may be closed. The keep-open part shows only while your approval is in force.

---

## Detailed Role Guides

* **Selling NOID?** Follow the [Guide for Alice (Selling NOID)](alice-selling-noid.md).
* **Selling ETH?** Follow the [Guide for Bob (Selling ETH)](bob-selling-eth.md).
* **Want exact numbers first?** Check [Caps, Fees & Timelines](caps-fees-and-timelines.md).
