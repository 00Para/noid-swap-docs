# Guide for Alice (Selling NOID)

Follow this guide if you **hold NOID** and want to **receive ETH**.

Because Parano1d spends coins with zero-knowledge proofs, you always generate the swap secret, lock NOID first, and later reveal the secret on Ethereum to collect Bob's ETH.

---

## Before You Start

Make sure you have:
* The **Parano1d wallet app** open and fully synced on this computer (`127.0.0.1:9601`).
* Your **NOID** to sell (between **5** and **2,500 NOID** on mainnet; **5** to **20 NOID** on Sepolia), plus a tiny extra amount (~0.01 NOID) for the funding fee.
* Your **Ethereum payout address** (must be a standard EOA wallet—**not** a smart-contract wallet).
* A small amount of **ETH** in your regular wallet to fund the swap key's Ethereum gas for the reveal transaction (~689,000 gas).
* **Bob online and ready**—pressing **Prepare** starts the ~6-hour Parano1d deadline clock.

---

## Step 1: Open Bob's Invitation

Bob creates the swap first and sends you his invitation.

1. Click **New swap** in No1d Swap and choose **Alice (selling NOID)**.
2. Load Bob's invitation:
   * **From a file (v0.1.7+):** Click **Open Bob's invitation…** and select the `no1d-invitation.json` file Bob sent you.
   * **From a pasted code *(v0.1.8+, coming soon)*:** Paste Bob's `no1dinv1:…` invitation code into the paste box and click **Use code**.
3. **Double-check every auto-filled field:** network (Mainnet vs. Sepolia), NOID amount, ETH amount, and Bob's addresses. Never trust an auto-fill blindly.
4. Enter **your Ethereum payout address** (where your ETH will be sent) and check the address-history note (*new*, *used before*, or *changed*).
5. Review the **rate, fees, usual time (~50 min), and worst-case refund time (~6 h 45 min)** displayed on the form.

---

## Step 2: Press Prepare & Send Your Swap Copy to Bob

{% hint style="warning" %}
**Prepare starts the clock.** Only click **Prepare** once Bob is at his computer and ready to proceed.
{% endhint %}

1. Click **Prepare**.
   * Behind the scenes, No1d Swap creates a fresh per-swap NOID wallet, a fresh per-swap Ethereum key, a random 32-byte secret `s` (sealed in your vault), and the Parano1d contract opening.
2. Click **Save swap file for Bob…** to save `alice.bundle.json`.
   * This file contains **only public swap terms and hashes**—never your secret or keys.
3. Send `alice.bundle.json` to Bob.

---

## Step 3: Verify the 16-Digit Check Line

Once Bob loads `alice.bundle.json`, both screens show a **check line** (four groups of four digits).

1. Read your check line to Bob over a **separate channel** (phone call, Signal, etc.).
2. Confirm that **all 16 digits match exactly**.
3. Tick the confirmation that Bob's check line matches yours.

---

## Step 4: Approve Once

Review the single approval box carefully. It summarizes:
* Exactly how much NOID you are giving and how much ETH you expect after fees.
* Your payout address (shown in full).
* The fee cap (default **1 gwei** on Ethereum—you can adjust this if mainnet gas is higher).

Type the confirmation amount, tick the boxes, and approve. One approval covers the automated funding, reveal, and leftover sweeps.

---

## Step 5: Deposit Into the Swap's Wallets

After approval, the card displays the **swap's own deposit addresses** (shown in full, with read-back verification when you copy them):

1. **Send the exact NOID amount (+ funding fee buffer)** from your Parano1d wallet app to the swap's NOID deposit address, watching the countdown timer on screen.
2. **Send the small ETH gas deposit** shown on screen to the swap's Ethereum key so it can pay gas to reveal and claim Bob's ETH later.

{% hint style="info" %}
**Short deposit?** If you accidentally send slightly too little, the app flags the exact shortfall so you can top it up cleanly—nothing is lost.
{% endhint %}

---

## Step 6: Let the App Finish Automatically

Keep No1d Swap and your Parano1d wallet app open (and your laptop plugged in with the lid open). From here, every step runs automatically behind a dry run and a safety gate:

1. **NOID funding:** Your app locks your NOID into the Parano1d contract and waits for finality (19 blocks).
2. **Waiting for Bob:** Your app watches Ethereum until Bob locks the exact ETH amount against your hashlock with enough time left, and waits for Ethereum finality (~19 minutes).
3. **Reveal & ETH claim:** Once Bob's ETH lock is final, your app broadcasts the reveal transaction on Ethereum, publishing `s` and sending the ETH to your payout address.
   * **Safety guard:** If Ethereum gas spikes and your reveal gets stuck, the card lets you **re-send at a higher fee cap**.
   * **Cutoff protection:** Your app automatically refuses to reveal inside the **final 30 minutes** before Bob's refund opens, so you can never leak `s` without getting paid.
4. **Leftover sweep:** Any unused dust/gas remaining in your temporary swap wallets is automatically swept back to your payout addresses.

The swap says **Done** only once the ETH has arrived at your own payout address.

---

## What If Bob Never Locks?

If Bob disappears or never locks his ETH:
* Your app waits until the Parano1d deadline `D` (**~6 h 45 min after Prepare**).
* Once `D` passes, your app automatically recovers your NOID back to your payout address (minus network fees).
* Your secret `s` is never revealed.
