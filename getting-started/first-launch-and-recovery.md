# First Launch, Recovery Code & Node Setup

When you open No1d Swap for the first time, it sets up a private vault in your operating system's key store and gives you a **paper recovery code**. Do not rush past this screen.

---

## 1. Save Your Recovery Code (First Launch)

On first start, No1d Swap opens a dedicated, isolated **secret window** showing your recovery code.

{% hint style="danger" %}
**Write your recovery code on paper before you ever deposit coins.**
* **What it protects you from:** If your OS key store is wiped, corrupted, or the desktop app refuses to start mid-swap, your recovery code + the swap's run folder let you unlock and finish the swap by hand with `swap-cli`.
* **Who can use it:** Anyone who has **both** your recovery code and your run folders can access your swap keys. Store it on paper, not in cloud notes or screenshots.
{% endhint %}

### Where Your Run Folders Live

No1d Swap stores each swap's state in a private, owner-only data folder (uninstalling the app never deletes it):

{% tabs %}
{% tab title="macOS" %}
```text
~/Library/Application Support/No1d Swap/runs/<swap-id>/
```
{% endtab %}

{% tab title="Windows" %}
```text
%LOCALAPPDATA%\No1d Swap\runs\<swap-id>\
```
{% endtab %}
{% endtabs %}

---

## 2. Prepare Your Parano1d Node

No1d Swap never trusts a remote server for your Parano1d chain view by default—it connects to the local **Parano1d wallet app** running on your own computer.

1. Open the **Parano1d wallet app** and wait until it is **fully synced** to the chain tip.
2. Confirm its local RPC server is listening on **`127.0.0.1:9601`** (the default).
3. Keep the Parano1d wallet app open for the entire duration of any real swap.

{% hint style="info" %}
**Just want to try the app first?** You do **not** need the Parano1d wallet app, a synced node, or any coins to run the built-in [Practice Swap](practice-swap.md).
{% endhint %}

### Optional: Second Parano1d Node (Recommended for Mainnet)

For Ethereum mainnet swaps—especially if you are **Bob (selling ETH)**—No1d Swap uses a two-node cross-check so a single lying or stalled node cannot trick you about chain tips, lock status, or miner concentration. Configure your node endpoints in **Settings** before starting a mainnet swap.

---

## 3. Prepare Your Ethereum Wallet & Funds

No1d Swap creates a **fresh, temporary swap wallet** (one NOID wallet + one Ethereum key) for every swap so you never paste your main wallet's seed phrase or private key into the app.

Before starting a real swap, have ready:

* **Your regular Ethereum wallet** (e.g., MetaMask or hardware wallet) on **Ethereum mainnet** (or **Sepolia** for a test run) with:
  * **If you are Bob (selling ETH):** Your swap amount + a small buffer for Ethereum gas (lock + optional refund/sweep).
  * **If you are Alice (selling NOID):** Your own Ethereum payout address (an EOA—not a smart-contract wallet), plus a small amount of ETH ready for the swap key to pay the reveal transaction gas (~689,000 gas).
* **Your regular Parano1d wallet** with:
  * **If you are Alice (selling NOID):** Your swap amount + a small buffer for the funding transaction fee (~0.009 NOID).
  * **If you are Bob (selling ETH):** Your own Parano1d payout address (`o1...`) where the claimed NOID will be sent.

{% hint style="warning" %}
**Address-history safety net:** No1d Swap seals a local history of payout addresses you've used before. When you enter a payout address, the form tells you whether it's **new**, **previously used**, or **changed** from your last swap—helping you catch clipboard typos before you deposit.
{% endhint %}

---

## 4. Power & Sleep Settings

While coins are sitting in a contract, No1d Swap asks your OS to keep the computer awake. However:

* **On macOS laptops:** Closing the lid on battery can **still** put the Mac to sleep. Leave your laptop plugged in with the lid open until the swap says **Done**.
* **On Windows:** Power outages can interrupt pending folder writes. Keep your machine plugged in and avoid force-restarting mid-swap.

---

## Next Step

Before touching real coins, take 5 minutes to run a [Practice Swap](practice-swap.md).
