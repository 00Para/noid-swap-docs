# Try a 5-Minute Practice Swap

Before running a swap with real coins, walk through the built-in **Practice Swap**. You'll see the exact cards, check lines, approvals, deposits, and waiting states of a real swap—without touching any network, node, key store, or wallet.

---

## How to Open It

1. Launch **No1d Swap**.
2. Open **Practice swap** from the top menu bar (beside **Help**) or from the main screen.
3. Pick a role—**Alice (selling NOID)** or **Bob (selling ETH)**—and choose one of the guided scenarios.

{% hint style="success" %}
**Completely offline and isolated:** Practice Swap runs against a local script that plays both the other person and both blockchains. It needs **no Parano1d node**, **no Ethereum RPC**, **no internet**, and **no coins**, and it writes nothing to disk.
{% endhint %}

---

## What You Will Experience

Every practice screen displays a clear **Practice banner** at the top so you can never confuse it with a real swap. Every address and amount is intentionally synthetic—nothing looks like a real Parano1d or Ethereum address, and you'll click a **"Pretend"** deposit button instead of sending real funds.

You can practice three key flows:
1. **A full settled swap** — from invitation and check-line match through funding, locking, reveal, claim, and leftover sweep.
2. **An aborted / refunded swap** — seeing how the deadlines protect both sides when the other person stops mid-way.
3. **Safety cards & checks** — seeing how the single approval, check-line comparison, fee summary, and worst-case timers look before you ever click approve on mainnet.

Try running Practice Swap **once as Alice and once as Bob**—it takes about five minutes total and makes your first real swap feel completely familiar.

---

## Safety Rule While Real Swaps Are Active

Practice Swap can never hide a real swap that needs your attention:

* If a real swap currently **Needs you**, the app **refuses to start** a new practice session until you handle it.
* If a real swap needs you *while* you're already inside a practice session, a real alarm (**"A real swap needs you"**) immediately appears above the practice banner with a one-click **"Leave the practice and open it"** button.

---

## Next Step

Ready for a real swap (or a small Sepolia rehearsal)? Head to [Swap Overview & Two-Person Checklist](../swap-guide/overview-and-checklist.md).
