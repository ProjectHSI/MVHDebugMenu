import "core-js/actual/typed-array/from-base64";
import "core-js/actual/typed-array/to-base64";

import {FS} from "$lib/publicFsContents.compile";
import {
    type Encrypted, FileType,
    type FSEntry, type FSFile, type FSFileInfo,
    getIsFsDirectoryContentsEncrypted,
    getIsFsEntryDirectory,
    getIsFsEntryFile, getIsFsFileContentsEncrypted
} from "$lib/publicFs";

//declare class Uint8Array impl

// @ts-ignore
//import "es-arraybuffer-base64/Uint8Array.fromBase64/auto";
//import "$lib/base64";
import type {PublicFsPathElement} from "$lib/publicFs.path";
//import crypto from "node:crypto";

//import crypto from "node:crypto";

function compareTwoArrayBuffers(_a: ArrayBuffer, _b: ArrayBuffer): boolean {
    let a = new Uint8Array(_a);
    let b = new Uint8Array(_b);

    if (a.length != b.length)
        return false;

    let equal = true;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            equal = false;
    }

    return equal;
}

async function decrypt(data: Encrypted, key: CryptoKey): Promise<ArrayBuffer | null> {
    //console.log(new TextDecoder());

    //const iv = crypto.getRandomValues(new Uint8Array(12));
    //encodedString = textEncoder.encode("cool string");

    try {
        const decryptResult = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: data.iv },
            key,
            data.cipherText,
        );

        const isDecryptionSuccessful = compareTwoArrayBuffers(data.sha256, await crypto.subtle.digest("SHA-512", decryptResult));

        //console.log("decryptHash", await crypto.subtle.digest("SHA-512", decryptResult))
        //console.log("decryptExpectedHash", data.sha256)

        //console.log("decryptRes", decryptResult)
        //console.log("decryptResText", new TextDecoder().decode(decryptResult));
        //console.log("decrypt", isDecryptionSuccessful)

        return isDecryptionSuccessful ? decryptResult : null; //{ cipherText: encryptResult, iv: iv, salt: keySalt, sha256: await crypto.subtle.digest("SHA-512", data) };
    } catch (e) {
        //console.log("Error in decryption routine\n", e);

        return null;
    }
}

interface FSOutput {
    fsEntry?: FSEntry;
    dataUri?: string;

    filePathToDisplay: PublicFsPathElement[];

    genericError: boolean;
    showPassword: boolean;
    passwordError: boolean;
    salt?: Uint8Array;
}

/*interface FSDirectoryOutput {
    path: string,
    encrypted: boolean
}*/

export const load = async ({ params }): Promise<FSOutput> => {
    //console.log(params.slug);
    let filePathToDisplay: PublicFsPathElement[] = [];

    const dec = new TextDecoder();

    let slugs = params.slug.split("/");
    //console.log(slugs);
    //console.log(`"${params.slug}"`);

    let fsWalkCurrent: FSEntry = FS;

    if (params.slug !== "")
        for (let i = 0; i < slugs.length; i++) {
    /*        if (getIsFsEntryFile(fsWalkCurrent)) {
                // ...
                if (!getIsFsFileContentsEncrypted(fsWalkCurrent.fileContent))
                    return {
                        showPassword: false,
                        passwordError: false
                    }

                const decryptedData = await decrypt(fsWalkCurrent.fileContent, Uint8Array.fromBase64(slugs[i], { alphabet: "base64url" }));

                if (decryptedData !== null)
                    fsWalkCurrent = { file: true, fileContent: JSON.parse(dec.decode(decryptedData)) };
                else
                    if (i == slugs.length - 1)
                        return {
                            showPassword: true,
                            passwordError: true
                        }
            }

            if (getIsFsDirectoryContentsEncrypted(fsWalkCurrent.contents)) {
                const decryptedData = await decrypt(fsWalkCurrent.contents, Uint8Array.fromBase64(slugs[i], { alphabet: "base64url" }));

                if (decryptedData !== null)
                    fsWalkCurrent = { directory: true, contents: JSON.parse(dec.decode(decryptedData)) };
                else
                    return {
                        showPassword: true,
                        passwordError: true
                    }
            } else {
                if (fsWalkCurrent.contents[slugs[i]] !== undefined) {
                    filePathToDisplay.push(slugs[i]);

                    fsWalkCurrent = fsWalkCurrent.contents[slugs[i]];
                }
            }*/

            if (getIsFsEntryDirectory(fsWalkCurrent)) {
                if (getIsFsDirectoryContentsEncrypted(fsWalkCurrent.contents)) {
                    // The slug is a passphrase for a directory.
                    // @ts-ignore
                    //console.log("slug dir key phrase", slugs[i])
                    const decryptedData = await decrypt(fsWalkCurrent.contents, await crypto.subtle.importKey("raw", Uint8Array.fromBase64(slugs[i], { alphabet: "base64url" }), "AES-GCM", true, [ "encrypt", "decrypt" ]));

                    //console.log("test")

                    if (decryptedData !== null)
                        // Successfully decrypted - update the current walk path with our current directory.
                        fsWalkCurrent = { directory: true, contents: JSON.parse(dec.decode(decryptedData)) };
                    else
                        if (i == slugs.length - 1) {
                            // This slug was the last - so we can just show that the decryption failed.
                            filePathToDisplay[filePathToDisplay.length - 1].decryptionInProgress = true;

                            return {
                                filePathToDisplay: filePathToDisplay,

                                genericError: false,

                                showPassword: true,
                                passwordError: true,
                                salt: fsWalkCurrent.contents.salt
                            }
                        } else
                            // Show a generic error page.
                            return {
                                filePathToDisplay: filePathToDisplay,

                                genericError: true,

                                showPassword: false,
                                passwordError: false
                            }
                } else {
                    // This slug is a path.
                    if (fsWalkCurrent.contents[slugs[i]] !== undefined) {
                        // Update the current walk path with our new entry.
                        filePathToDisplay.push({ name: slugs[i], decryptionInProgress: false });
                        fsWalkCurrent = fsWalkCurrent.contents[slugs[i]];
                    } else {
                        // Show a generic error page.
                        return {
                            filePathToDisplay: filePathToDisplay,

                            genericError: true,

                            showPassword: false,
                            passwordError: false
                        }
                    }
                }
            } else {
                if (getIsFsFileContentsEncrypted(fsWalkCurrent.fileContent)) {
                    // The slug is a passphrase for a file.
                    // @ts-ignore
                    const decryptedData = await decrypt(fsWalkCurrent.fileContent, await crypto.subtle.importKey("raw", Uint8Array.fromBase64(slugs[i], { alphabet: "base64url" }), "AES-GCM", true, [ "encrypt", "decrypt" ]));

                    if (decryptedData !== null)
                        // Successfully decrypted - update the current walk path with our current directory.
                        fsWalkCurrent = { file: true, fileContent: JSON.parse(dec.decode(decryptedData)) };
                    else
                        if (i == slugs.length - 1) {
                            // This slug was the last - so we can just show that the decryption failed.
                            filePathToDisplay[filePathToDisplay.length - 1].decryptionInProgress = true;

                            return {
                                filePathToDisplay: filePathToDisplay,

                                genericError: false,

                                showPassword: true,
                                passwordError: true,
                                salt: fsWalkCurrent.fileContent.salt
                            }
                        }
                        else
                            // Show a generic error page.
                            return {
                                filePathToDisplay: filePathToDisplay,

                                genericError: true,

                                showPassword: false,
                                passwordError: false
                            }
                } else {
                    // Show a generic error page.
                    return {
                        filePathToDisplay: filePathToDisplay,

                        genericError: true,

                        showPassword: true,
                        passwordError: true
                    }
                }
            }
        }

    if (getIsFsEntryDirectory(fsWalkCurrent)) {
        if (getIsFsDirectoryContentsEncrypted(fsWalkCurrent.contents)) {
            filePathToDisplay[filePathToDisplay.length - 1].decryptionInProgress = true;

            return {
                filePathToDisplay: filePathToDisplay,

                genericError: false,

                showPassword: true,
                passwordError: false,
                salt: fsWalkCurrent.contents.salt
            }
        } else {
            return {
                fsEntry: fsWalkCurrent,
                filePathToDisplay: filePathToDisplay,

                genericError: false,

                showPassword: false,
                passwordError: false
            }
        }
    } else {
        if (getIsFsFileContentsEncrypted(fsWalkCurrent.fileContent)) {
            filePathToDisplay[filePathToDisplay.length - 1].decryptionInProgress = true;

            return {
                filePathToDisplay: filePathToDisplay,

                genericError: false,

                showPassword: true,
                passwordError: false,
                salt: fsWalkCurrent.fileContent.salt
            }
        } else {
            let dataUri = "";

            switch (fsWalkCurrent.fileContent.fileContentType) {
                case FileType.RAW:
                    dataUri = `data:${fsWalkCurrent.fileContent.fileMimeType},${encodeURIComponent(fsWalkCurrent.fileContent.fileContent)}`
                    break;
                case FileType.RAW_BASE64:
                    dataUri = `data:${fsWalkCurrent.fileContent.fileMimeType};base64,${fsWalkCurrent.fileContent.fileContent}`
                    break;
                case FileType.URL:
                    break;
                //case FileType.RAW:
                //break;
            }

            return {
                fsEntry: fsWalkCurrent,
                filePathToDisplay: filePathToDisplay,

                dataUri: dataUri,

                genericError: false,

                showPassword: false,
                passwordError: false
            }
        }
    }

    //return {
        //slug: params.slug
    //}
}