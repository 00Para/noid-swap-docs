# Local Security & Privacy

Understanding what No1d Swap protects on your computer—and what it *cannot* protect against—helps you keep your setup clean and safe.

---

## How Your Secrets Are Stored

1. **Per-swap isolated wallets:** For every new swap, No1d Swap creates a brand-new temporary Parano1d wallet and a brand-new temporary Ethereum key. You never enter your main wallet's seed phrase or private key into No1d Swap.
2. **OS key store vault:** Swap secrets and temporary keys are sealed with AES-256-GCM using keys protected by your operating system's native key store (macOS Keychain / Windows DPAPI via Electron `safeStorage`).
3. **Dedicated secret window:** Your paper recovery code is shown inside an isolated, hardened window served over a private `no1d://secret/` scheme with strict Content Security Policy and zero external network access.
4. **No secrets on command lines or in logs:** Passphrases and private keys are passed over stdin pipes or memory—never via command-line arguments where other processes could read them.

### What the OS Key Store Protects—and What It Doesn't

| Threat | Protected? | Why |
|---|---|---|
| **Another user account on the same PC** | Yes | Data folders are owner-only (`0700` on macOS, owner/SYSTEM/Administrators ACL on Windows) and key store entries are per-user. |
| **A stolen hard drive or copied run folder** | Yes | Sealed files (`*.swap.json`, `payout-history.sealed`) cannot be opened without your OS key store or paper recovery code. |
| **Clipboard typos / swapped payout addresses** | Mitigated | Addresses are shown in full, read back after copying, and cross-checked against your sealed payout-address history. |
| **Malware running as your own user account** | **No** | Any malicious program running under your login can read your OS key store, modify local files, or forge address history—just as it can attack any desktop wallet. |

{% hint style="warning" %}
**Keep your paper recovery code separate from your run folders.** Anyone who obtains *both* your recovery code and a swap's run folder can derive that swap's passphrase offline.
{% endhint %}

---

## Desktop Hardening Built Into the App

The desktop shell enforces strict Electron security controls on every launch:

* **Electron fuses** enabled at build time; remote debugging, proxy, and host-resolver CLI switches are refused at startup.
* **Runtime manifest integrity check:** On every packaged launch, the app verifies its own runtime manifest; a tampered installation stops with `"This installation is damaged: reinstall it."`
* **Direct proxy & WebRTC hardening:** Every session sets `proxy: direct` and `disable_non_proxied_udp`.
* **Single-instance lock & run locks:** Prevents two windows from racing over the same swap files.
* **Owner-only data folder enforcement:** Verifies folder permissions before opening the vault.

---

## Privacy: What Is Public vs. Private

### What Stays Private on Your Computer
* Your recovery code and vault secret
* Your temporary swap wallet keys
* Your swap secret `s` (private to Alice until the moment she claims ETH on Ethereum)
* Your payout address history (`payout-history.sealed`)

### What Is Public (On-Chain or Shared With Counterparty)
* **Between Alice and Bob:** Amounts, network, contract address, your swap payout addresses, and the hashlock `A = Addr(s)`.
* **On-chain linkability:** Both Ethereum (`HTLCPoseidonV2`) and Parano1d (`htlc.pruv`) record `A = Addr(s)`. Anyone inspecting both blockchains can link the Ethereum lock and the Parano1d lock for the same swap—including swaps that end in a refund.
* **RPC metadata:** Your Ethereum RPC endpoints see your IP address and Ethereum queries/broadcasts. Parano1d queries stay local on `127.0.0.1:9601` (talking to your own synced Parano1d node).
* **Update check:** Fetches `release.json` and `release.json.sig` from GitHub with no cookies, no auth token, and a generic user agent.

---

## Computer Awake & Power Caveats

* No1d Swap holds an OS wake lock while coins are locked in a contract, and relaunches cleanly after unexpected crashes.
* **macOS laptop lid caveat:** Closing a MacBook lid on battery power can still force sleep even with an active wake lock. Keep laptops plugged in with the lid open until the swap reaches **Done**.
* **Windows power cuts:** Swap files are written before any transaction is broadcast (protecting against app crashes), but sudden power loss on Windows can still drop unflushed folder metadata.
