<script lang="ts">
    import "core-js/actual/typed-array/from-base64";
    import "core-js/actual/typed-array/to-base64";

    import {type FSDirectory, type FSEntry, pbkdf2Iterations} from "$lib/publicFs"
    //import { FS } from "$lib/publicFsContents.compile"
    import {goto} from "$app/navigation";
    import { page } from '$app/state';
    import type {PageLoad} from "./$types";
    import PathDisplay from "../../../components/PublicFS/PathDisplay.svelte";

    function getUrlPathNameWithoutLastPath(): string {
        let splitPathName = page.url.pathname.split("/");

        splitPathName.pop();

        return splitPathName.join("/");
    }

    async function getKey(keyPhrase: Uint8Array, salt?: Uint8Array): Promise<CryptoKey> {
		console.log(keyPhrase, salt);

        const generatedKey = await crypto.subtle.importKey("raw", keyPhrase, { name: "PBKDF2" }, false, [ "deriveKey" ]);

        console.log(generatedKey);

        const derivedKey = await crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-512", salt: salt !== undefined ? salt : crypto.getRandomValues(new Uint8Array(16)), iterations: pbkdf2Iterations }, generatedKey, { name: "AES-GCM", length: 256 }, true, [ "encrypt", "decrypt" ]);
        //@ts-ignore
        console.log(new Uint8Array(await crypto.subtle.exportKey("raw", derivedKey)).toBase64({ alphabet: "base64url" }), salt)

        //const keySalt = crypto.getRandomValues(new Uint8Array(16));
        return derivedKey;
    }

    async function setPassword() {
        if (decrypting)
            return;

		decrypting = true;

        //@ts-ignore
	    const key = await getKey(new TextEncoder().encode(password), data.salt);

        //console.log(await crypto.subtle.exportKey("raw", key))

	    //  .toBase64({ alphabet: "base64url" })
        goto(`${data.passwordError ? getUrlPathNameWithoutLastPath() : page.url.pathname}/${(new Uint8Array(await crypto.subtle.exportKey("raw", key)).toBase64({ alphabet: "base64url" }))}`);

        decrypting = false;
        password = "";
    }

    function isFsEntryNull(): boolean {
        console.log(data);

        return data.fsEntry === undefined || data.fsEntry === null;
    }

    function bypassTsTypeCheckerForFsEntry(): FSEntry {
        if (data.fsEntry !== undefined) {
            return data.fsEntry;
        } else {
            throw new Error("data.fsEntry is null when bypassing the TS Type Checker.");
        }
    }

    function bypassTsTypeCheckerForFsEntryAsFsDirectory(): { [index: string]: FSEntry } {
        return (bypassTsTypeCheckerForFsEntry() as FSDirectory).contents as { [index: string]: FSEntry };
    }

/*    $effect(() => {
        //console.log(FS);

        if (data.fsEntry !== undefined && getIsFsEntryFile(data.fsEntry)) {
            const fileInfo = data.fsEntry.fileContent as FSFileInfo;

            switch (fileInfo.fileContentType) {
                case FileType.RAW:
                    dataUri = `data:${fileInfo.fileMimeType},${encodeURIComponent(fileInfo.fileContent)}`
                    break;
                case FileType.RAW_BASE64:
                    dataUri = `data:${fileInfo.fileMimeType};base64,${fileInfo.fileContent}`
                    break;
                case FileType.URL:
                    break;
                //case FileType.RAW:
                //break;
            }
        }
    });*/

    //let dataUri = $state("");

    //let _data = $props();
    //@ts-ignore
    let { data }: PageLoad = $props();
    let reactiveData = $state(data);

    let password: string = $state("");

    let decrypting: boolean = $state(false);
</script>

{#snippet ServerError(title, description)}
	<h1 style="text-align: left; color: black; margin-top: 0; margin-bottom: 0">{title}</h1>
	<p style="color: black; margin-top: 0; margin-bottom: 0;">{description}</p>
{/snippet}

{#if data.genericError}
	{@render ServerError("401 Bad Request", "The request that was sent to the server was invalid.")}
{:else}
	<div id="publicFsDisplayBox">
		<div id="pathDisplayDiv">
			<PathDisplay path={data.filePathToDisplay}></PathDisplay>
		</div>

		<div id="publicFsContentBox">
			{#if data.corruptionMessage !== undefined}
				{@render ServerError("500 Internal Server Error", data.corruptionMessage)}
			{:else if data.showPassword}
				<div id="publicFsPasswordDisplayBox">
					<div id="publicFsPasswordBox">
						<span class="decryptFile">Encrypted File</span>

						<!--<span><br /></span>
	-->
						<input style="width: 80%;" class="passwordInput" type="text" bind:value={password}/>
						<!--<button onclick={setPassword}>Decrypt</button>-->
						<div style="width: 80%;" style:cursor={!decrypting ? "pointer" : ""} id="decryptButton">
							<span id="decryptText" onclick={setPassword}>{decrypting ? "Decrypting..." : "Decrypt"}</span>
							{#if decrypting}
								<div id="decryptSpinner">
									<div id="decryptSpinnerElement"></div>
								</div>
							{/if}
						</div>
						{#if data.passwordError}
							<span>The password was incorrect.</span>
						{/if}
					</div>
				</div>
			{:else if data.fsEntry !== undefined}
				{#if data.dataUri !== undefined}
					<iframe id="fileContentsIFrame" title="File Contents" src="{data.dataUri}"></iframe>
				{:else}
					{#each Object.keys(bypassTsTypeCheckerForFsEntryAsFsDirectory()) as fsEntryIndex}
						<a href={page.url.pathname + "/" + fsEntryIndex}>{fsEntryIndex}</a><br />
					{/each}
				{/if}
			{:else}
				{@render ServerError("401 Bad Request", "The request that was sent to the server was invalid.")}
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
  .decryptFile {
    font-size: 200%;
    color: black;
  }

  .passwordInput {
    margin-top: 4%;
    margin-bottom: 4%;
  }

  #publicFsContentBox {
    display: flex;
    flex-direction: column;
    //align-items: center;
    //justify-content: center;

    width: 100%;
    //height: 100%;

    flex-grow: 1;
  }

  #publicFsPasswordDisplayBox {
    display: flex;
    //flex-grow: 1;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    flex-grow: 1;

    //width: 100%;
    //height: 100%;
  }

  #publicFsDisplayBox {
    display: flex;
    flex-direction: column;

    //width: 100%;
    //height: 100%;

    flex-grow: 1;
  }

  #publicFsPasswordBox {
    //width: 100%;
    //height: 100%;
    //flex-grow: 1;
    //min-height: 100%;
    display: flex;
    flex-direction: column;
    //flex: 1;

    border-width: 2px;
    border-radius: 20px 20px;
    border-color: black;
    border-style: solid;

    padding: 20px;

    //justify-items: center;
    align-items: center;
    justify-content: center;
    //align-content: center;
  }

  #fileContentsIFrame {
    border: none;
    padding: 0;
    width: 100%;
    flex-grow: 1;
  }

  #decryptButton {
    //display: flex;
    height: 1.15em;

    background-color: royalblue;
  }

  #decryptText {
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: 1;
    position: relative;
    display: block;

    color: white;
  }

  #decryptSpinner {
    width: 100%;
    height: 1.15em;
    display: block;
    z-index: 0;
    position: relative;
    top: -1.15em;
    overflow: clip;
    //position: absolute;
	//flex: 1;
  }

  #decryptSpinnerElement {
    height: 200%;
    top: -50%;
    left: -15%;
    //left: 105%;
    //transform: rotate(22.5deg);
    width: 10%;
    display: block;
    position: relative;

    animation-name: indeterminateSpinnerSpin;
    animation-duration: 500ms;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;

    background-color: cornflowerblue;
  }

  @keyframes indeterminateSpinnerSpin {
    from {left: -15%; rotate: z 22.5deg;}
    to {left: 105%; rotate: z 22.5deg;}
  }
</style>