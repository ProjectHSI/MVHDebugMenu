<script lang="ts">
    import {onMount} from "svelte";
    import {FileType, type FSDirectory, type FSEntry, type FSFileInfo, getIsFsEntryFile} from "$lib/publicFs"
    import { FS } from "$lib/publicFsContents.compile"
    import {goto} from "$app/navigation";
    import { page } from '$app/state';
    import type {PageLoad} from "./$types";
    import PathDisplay from "../../../components/PublicFS/PathDisplay.svelte";

    //import "es-arraybuffer-base64/Uint8Array.prototype.toBase64";
    //import crypto from "node:crypto";

    //require("es-arraybuffer-base64/Uint8Array.prototype.toBase64/auto")

    function getUrlPathNameWithoutLastPath(): string {
        let splitPathName = page.url.pathname.split("/");

        splitPathName.pop();

        return splitPathName.join("/");
    }

    async function getKey(keyPhrase: Uint8Array, salt?: Uint8Array): Promise<CryptoKey> {


        const generatedKey = await crypto.subtle.importKey("raw", keyPhrase, { name: "PBKDF2" }, false, [ "deriveKey" ]);

        const derivedKey = await crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-512", salt: salt !== undefined ? salt : crypto.getRandomValues(new Uint8Array(16)), iterations: 5000 }, generatedKey, { name: "AES-GCM", length: 256 }, true, [ "encrypt", "decrypt" ]);
        console.log(new Uint8Array(await crypto.subtle.exportKey("raw", derivedKey)).toBase64({ alphabet: "base64url" }), salt)

        //const keySalt = crypto.getRandomValues(new Uint8Array(16));
        return derivedKey;
    }

    async function setPassword() {
        //@ts-ignore
	    const key = await getKey(new TextEncoder().encode(password), data.salt);

        //console.log(await crypto.subtle.exportKey("raw", key))

	    //  .toBase64({ alphabet: "base64url" })
        goto(`${data.passwordError ? getUrlPathNameWithoutLastPath() : page.url.pathname}/${new Uint8Array(await crypto.subtle.exportKey("raw", key)).toBase64({ alphabet: "base64url" })}`);
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

    let password: string = "";
</script>

{#if data.genericError}
	<h1>401 Bad Request</h1>
	<p>The request that was sent to the server was invalid.</p>
{:else}
	<PathDisplay path={data.filePathToDisplay}></PathDisplay>

	<!--<span style="font-size: 2em">/</span>-->
	{#if data.showPassword}
		<input type="text" bind:value={password}/>
		<button onclick={setPassword}>Go</button>
		{#if data.passwordError}
			<span>False...</span>
		{/if}
	{:else if data.fsEntry !== undefined}
		<!--{@const nonNullFsEntry = data.fsEntry}-->


		{#if data.dataUri !== undefined}
			<iframe id="fileContentsIFrame" title="File Contents" src="{data.dataUri}"></iframe>
		{:else}
			{#each Object.keys(bypassTsTypeCheckerForFsEntryAsFsDirectory()) as fsEntryIndex}
				<a href={page.url.pathname + "/" + fsEntryIndex}>{fsEntryIndex}</a><br />
			{/each}
		{/if}
	{:else}
		<h1>401 Bad Request</h1>
		<p>The request that was sent to the server was invalid.</p>
	{/if}
{/if}

<style lang="scss">
	#fileContentsIFrame {
	  border: none;
	  padding: 0;
	  width: 100%;
	  height: 100%;
	}
</style>