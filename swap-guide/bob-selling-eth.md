# Guide for Bob (Selling ETH)

Follow this guide if you **hold ETH** and want to **receive NOID**.

As Bob, you start the handshake by sending Alice an invitation, lock your ETH *after* verifying Alice's NOID lock is final, and claim the NOID as soon as Alice reveals the secret on Ethereum.

{% hint style="danger" %}
**Two critical rules for Bob:**
1. **Only swap with someone you have a reason to trust** while Parano1d mining remains concentrated (see [Limits & Risks](../security/limits-and-risks.md)).
2. **Stay online until the swap finishes.** After Alice reveals the secret on Ethereum, your computer has **at least ~75 minutes** to claim your NOID. If your computer is off or offline during that window, Alice can reclaim the NOID after the deadline and keep your ETH.
{% endhint %}

---

## Before You Start

Make sure you have:
* The **Parano1d wallet app** open and fully synced on this computer (`127.0.0.1:9601`).
* Your **ETH** to sell (up to **0.5 ETH** on mainnet; up to **0.01 ETH** on Sepolia), plus extra ETH to cover the lock transaction (~584,000 gas) and a potential refund (~159,000 gas) if Alice stops.
* Your **Parano1d payout address** (`o1...`) where your claimed NOID will be sent.
* Your **Ethereum payout address** (standard EOA) for sweeping back any leftover ETH gas (or refund).
* Your computer plugged in with the lid open so it won't sleep mid-swap.

---

## Step 1: Create the Swap & Send an Invitation to Alice

1. Click **New swap** in No1d Swap and choose **Bob (selling ETH)**.
2. Choose the network (**Ethereum Mainnet** or **Sepolia**).
3. Enter the agreed **NOID amount** (5–2,500 NOID on mainnet) and **ETH amount** (up to 0.5 ETH on mainnet).
4. Enter your **Parano1d payout address** and **Ethereum payout address** (check the address-history indicator).
5. Create the swap—the app generates a fresh per-swap Ethereum key for this swap.
6. Send the invitation to Alice:
   * **As a file:** Click **Save an invitation for Alice…** to save `no1d-invitation.json` and send it to Alice.
   * **As a copyable code (v0.1.8 and later):** Click **Copy invitation code** (`no1dinv1:…`) and paste it into your chat with Alice.

Both formats contain **only public fields** (network, contract, amounts, and your two public addresses)—zero secrets.

{% hint style="info" %}
**Do not deposit ETH yet!** Wait until Alice sends back her swap file, you compare check lines, and you approve.
{% endhint %}

---

## Step 2: Load Alice's Swap Copy & Check the Check Line

1. Alice presses **Prepare** and sends you `alice.bundle.json`.
2. Click **Choose Alice's file…** on your swap card and pick `alice.bundle.json`. Your app verifies the contract code hash, hashlock, amounts, and deadlines automatically.
3. Both screens display a **16-digit check line** (`xxxx xxxx xxxx xxxx`).
4. Compare the check line with Alice over a **second channel** (phone call, Signal, etc.) and confirm all 16 digits match.

---

## Step 3: Check Parano1d Miner Concentration & Approve Once

Before you lock any ETH, No1d Swap reads Parano1d's own block headers across both the **last 24 hours (2,880 blocks)** and **last 6 hours (720 blocks)** to measure the largest single mining address:

| Largest producer share (24 h or 6 h) | What the app does |
|---|---|
| **35% or lower** | Passes normally. |
| **Between 35% and 65%** | Shows the exact measured percentage inside your approval and asks you to explicitly accept it and confirm you have a reason to trust Alice. |
| **Above 65%** | **Hard block.** The approval is disabled and cannot be waived. The screen reopens automatically once both windows fall to 65% or lower. |

Review the rate, fees, worst-case refund time (~2 h 20 min), and miner share, type the confirmation amount, tick the boxes, and approve once.

---

## Step 4: Deposit ETH Into the Swap's Ethereum Key

After approval, the card displays **this swap's Ethereum key address** (in full, with clipboard read-back verification).

1. Send the required ETH amount (swap amount + gas reserve shown on screen) from your regular Ethereum wallet to that address.
2. If your deposit is slightly short, the app flags the exact shortfall within seconds of the block so you can top it up.

---

## Step 5: Stay Online While the App Finishes Automatically

Keep No1d Swap and your Parano1d wallet app open and online:

1. **Waiting for Alice's NOID lock:** Your app verifies Alice's NOID contract is funded and final on Parano1d (19 blocks), re-checks miner concentration, and verifies enough time remains before `D`.
2. **ETH lock:** Your app locks your ETH in `HTLCPoseidonV2` on Ethereum and waits for finality (~19 minutes).
3. **Watching for Alice's reveal:** Once Alice takes your ETH, her transaction publishes the secret `s` in Ethereum's `Claimed` event.
4. **NOID claim:** Your app immediately reads `s`, builds a zero-knowledge proof, and broadcasts the NOID close transaction to Parano1d—sending the NOID (minus the ~0.0058 NOID close fee) straight to your Parano1d payout address.
   * **Late-claim alarm:** If time is getting tight before `D - 19`, the app raises a prominent **late-claim alarm**.
5. **Leftover sweep:** Any unused ETH gas remaining in the temporary swap key is automatically swept back to your Ethereum payout address.

The swap says **Done** only once the NOID has finalized in your own Parano1d address.

---

## What If Alice Disappears After You Lock ETH?

* If Alice never reveals `s`, your app waits until the 2-hour Ethereum reveal window (`T_reveal`) expires (**~2 h 20 min after your lock**, including finality).
* Once `T_reveal` passes, your app automatically refunds your ETH back to your payout address.
* If the refund gets stuck due to rising Ethereum gas, the card lets you **re-send the refund at a higher fee cap**.

## What If Your Computer Dies After Alice Reveals?

Don't panic! Once `s` is public on Ethereum, **you can broadcast the NOID close from a second computer** (and even a friend with only the public swap files can broadcast it—the contract forces 100% of the payout to your Parano1d address). Follow [Emergency Recovery & Second-Computer Close](../troubleshooting/recovery-and-second-computer.md).
