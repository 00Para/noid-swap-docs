# Download & Verify the Installer

No1d Swap is distributed on the GitHub **Releases** page as a native installer for Windows and macOS. Because the project has no company name and no commercial code-signing certificate, **verifying the cryptographic release signature before installing is essential.**

{% hint style="danger" %}
**Never skip verification.** A compromised GitHub account could replace both an installer and the SHA-256 hashes printed in the release notes. Only a valid Ed25519 signature from the project's offline release key proves an installer is authentic.
{% endhint %}

---

## Step 1: Download the Three Release Files

Go to the [No1d Swap Releases page](https://github.com/00Para/noid-swap/releases) and download **three files** from the latest release into the same folder (for example, `Downloads`):

1. **Your installer:**
   * **Windows (x64):** `No1d-Swap-<version>-win-x64.exe`
   * **macOS (Apple Silicon):** `No1d-Swap-<version>-mac-arm64.dmg`
2. **`release.json`** — the manifest listing the version, oldest safe version, and each installer's SHA-256 hash.
3. **`release.json.sig`** — the Ed25519 signature over the exact bytes of `release.json`.

---

## Step 2: Check the Pinned Release Public Key

Every release is signed with one offline Ed25519 key. Its public key is compiled into the app (`desktop/lib/releasekey.js` in the repository):

```text
Thg9nhwwvqoKG4yOqiZM/PBeqT5LcrFFa7cKAHuqYxk=
```

Cross-check this string against `desktop/lib/releasekey.js` in the repository and independent project channels (such as [@No1dSwap on X](https://x.com/No1dSwap)).

---

## Step 3: Verify Signature & Installer SHA-256

You need **Node.js 21 or later** (Node 22 recommended) to run the repository's verification script, or you can use our one-command verifier.

{% tabs %}
{% tab title="macOS (Terminal)" %}
1. **Verify `release.json.sig` against the pinned public key:**

```sh
node /path/to/noid-swap/desktop/scripts/release-key.js verify \
  --pub Thg9nhwwvqoKG4yOqiZM/PBeqT5LcrFFa7cKAHuqYxk= \
  --in ~/Downloads/release.json \
  --sig ~/Downloads/release.json.sig
```

You **must** see `OK`. If you see anything else, stop and delete the download.

2. **Compute the installer's SHA-256:**

```sh
shasum -a 256 ~/Downloads/No1d-Swap-*-mac-arm64.dmg
```

3. **Compare the hash** character-for-character with the matching filename inside `release.json`:

```sh
cat ~/Downloads/release.json
```

4. *(Optional extra check)* **Verify GitHub build provenance:**

```sh
gh attestation verify ~/Downloads/No1d-Swap-*-mac-arm64.dmg --repo 00Para/noid-swap
```
{% endtab %}

{% tab title="Windows (PowerShell)" %}
1. **Verify `release.json.sig` against the pinned public key:**

```powershell
node C:\path\to\noid-swap\desktop\scripts\release-key.js verify `
  --pub Thg9nhwwvqoKG4yOqiZM/PBeqT5LcrFFa7cKAHuqYxk= `
  --in "$HOME\Downloads\release.json" `
  --sig "$HOME\Downloads\release.json.sig"
```

You **must** see `OK`. If you see anything else, stop and delete the download.

2. **Compute the installer's SHA-256:**

```powershell
Get-FileHash "$HOME\Downloads\No1d-Swap-*-win-x64.exe" -Algorithm SHA256
```

3. **Compare the hash** (case-insensitive) with the matching filename inside `release.json`:

```powershell
Get-Content "$HOME\Downloads\release.json"
```

4. *(Optional extra check)* **Verify GitHub build provenance:**

```powershell
gh attestation verify "$HOME\Downloads\No1d-Swap-*-win-x64.exe" --repo 00Para/noid-swap
```
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
**If the signature fails or the SHA-256 does not match `release.json`, do not open the installer.** Report it immediately using the instructions in `SECURITY.md`.
{% endhint %}

---

## Step 4: Install Past OS Warnings

Because the installers are not signed with an Apple Developer or Microsoft Authenticode certificate, your operating system will warn you the first time you open them. **Only proceed after Step 3 passed.**

{% tabs %}
{% tab title="macOS" %}
1. Open the verified `.dmg` and drag **No1d Swap** into **Applications**.
2. Try launching **No1d Swap** once—macOS will block it as an unidentified developer.
3. Open **System Settings → Privacy & Security**, scroll down to the Security section, and click **Open Anyway**.
4. Confirm with your Mac password or Touch ID.
{% endtab %}

{% tab title="Windows" %}
1. Run the verified `.exe` installer.
2. When **Windows protected your PC** (SmartScreen) appears, click **More info**.
3. Click **Run anyway** to complete the per-user installation.
{% endtab %}
{% endtabs %}

---

## How Automatic Update Checks Work

Once installed, No1d Swap checks for new releases by downloading `release.json` and `release.json.sig` from GitHub and verifying the signature against the compiled-in public key:

* **It never auto-downloads or auto-installs executables.** You always verify and install updates yourself.
* **Invalid signatures are rejected.** If a release has a missing or bad signature, the app warns you not to install it.
* **Safety cutoff (`oldest_safe_version`):** If a critical flaw is discovered in an older release, a signed `release.json` can raise `oldest_safe_version`. The app will refuse to start *new* swaps on older versions—while never blocking refunds, claims, or sweeps for swaps already in progress.

---

## Next Step

Continue to [First Launch, Recovery Code & Node Setup](first-launch-and-recovery.md).
