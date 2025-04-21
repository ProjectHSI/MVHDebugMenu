//import type {FSDirectory} from "$lib/publicFs";

import {type Encrypted, FileType, type FSDirectory, type FSFile} from "./publicFs";
import * as crypto from "node:crypto";

import "core-js/actual/typed-array/from-base64.js";
import "core-js/actual/typed-array/to-base64.js";

async function generateEncrypted(data: Uint8Array, keyPhrase: Uint8Array): Promise<Encrypted> {
    //eyPhrase = textEncoder.encode("this is a sample key");

    const generatedKey = await crypto.subtle.importKey("raw", keyPhrase, { name: "PBKDF2" }, false, [ "deriveKey" ]);

    const keySalt = crypto.getRandomValues(new Uint8Array(16));
    const derivedKey = await crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-512", salt: keySalt, iterations: 5000 }, generatedKey, { name: "AES-GCM", length: 256 }, true, [ "encrypt", "decrypt" ]);

    const iv = crypto.getRandomValues(new Uint8Array(12));
    //encodedString = textEncoder.encode("cool string");

    const encryptResult = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        derivedKey,
        data,
    );

    //console.log(new Uint8Array(await crypto.subtle.exportKey("raw", derivedKey)).toBase64({ alphabet: "base64url" }), keySalt);

    return { cipherText: encryptResult, iv: iv, salt: keySalt, sha256: await crypto.subtle.digest("SHA-512", data) };

    /*decryptResult = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        derivedKey,
        encryptResult
    )*/

    //textDecoder.decode(decryptResult);

    //const keySalt = crypto.getRandomValues(new Uint8Array(16));
    //const iv = crypto.getRandomValues(new Uint8Array(12));

    //const generatedKey = crypto.pbkdf2Sync(keyPhrase, keySalt, 5000, 256, "sha512");


    //return { cipherText: encryptResult, iv: iv, salt: keySalt, sha256: await crypto.subtle.digest("SHA-512", data) };
}

const enc = new TextEncoder();

async function generateEncryptedDirectory(inputDirectory: FSDirectory, keyPhrase: Uint8Array): Promise<FSDirectory> {
    const enc = new TextEncoder();

    inputDirectory.contents = await generateEncrypted(
        enc.encode(JSON.stringify(inputDirectory.contents)),
        keyPhrase
    );

    return inputDirectory;
}

function generateEncryptedDirectoryWithStringAsKeyPhrase(inputDirectory: FSDirectory, keyPhrase: string): Promise<FSDirectory> {
    return generateEncryptedDirectory(inputDirectory, enc.encode(keyPhrase));
}

async function generateEncryptedFile(inputFile: FSFile, keyPhrase: Uint8Array): Promise<FSFile> {
    const enc = new TextEncoder();

    inputFile.fileContent = await generateEncrypted(
        enc.encode(JSON.stringify(inputFile.fileContent)),
        keyPhrase
    );

    return inputFile;
}

function generateEncryptedFileWithStringAsKeyPhrase(inputFile: FSFile, keyPhrase: string): Promise<FSFile> {
    return generateEncryptedFile(inputFile, enc.encode(keyPhrase));
}

function encodeStringToBase64(targetString: string) {
    // @ts-ignore
    return new TextEncoder().encode(targetString).toBase64({ alphabet: "base64url" });
}

export const FS: FSDirectory = {
    directory: true,
    contents: {
        "EncryptedDirectory": await generateEncryptedDirectoryWithStringAsKeyPhrase({
            directory: true,
            contents: {
                "NestedFolder": {
                    directory: true,
                    contents: {}
                },
                "file.txt": {
                    file: true,
                    fileContent: {
                        fileContent: "This is a sample text file!",
                        fileMimeType: "text/plain",
                        fileContentType: FileType.RAW
                    }
                },
                "the_seekret.txt": {
                    file: true,
                    fileContent: {
                        fileContent: "the seekret is not in another castle",
                        fileMimeType: "text/plain",
                        fileContentType: FileType.RAW
                    }
                }
            }
        }, "encryptedKeyphrase"),
        "UnencryptedDirectory": {
            directory: true,
            contents: {
                "file.txt": {
                    file: true,
                    fileContent: {
                        fileContent: "This is a sample text file! This should be in an unencrypted directory.",
                        fileMimeType: "text/plain",
                        fileContentType: FileType.RAW
                    }
                },
                "file.base64.txt": {
                    file: true,
                    fileContent: {
                        fileContent: encodeStringToBase64("This is a sample text file! It should be encoded in Base64. This should be in an unencrypted directory."),
                        fileMimeType: "text/plain",
                        fileContentType: FileType.RAW_BASE64
                    }
                }
            }
        }
    }
}