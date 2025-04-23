import {type Encrypted, FileType, type FSDirectory, type FSFile, pbkdf2Iterations} from "./publicFs";
import * as crypto from "node:crypto";

import "core-js/actual/typed-array/from-base64.js";
import "core-js/actual/typed-array/to-base64.js";

export async function generateEncrypted(data: Uint8Array, keyPhrase: Uint8Array): Promise<Encrypted> {
    //eyPhrase = textEncoder.encode("this is a sample key");

    const generatedKey = await crypto.subtle.importKey("raw", keyPhrase, { name: "PBKDF2" }, false, [ "deriveKey" ]);

    //console.log("Generating PBKDF2 Key...");

    const keySalt = crypto.getRandomValues(new Uint8Array(16));
    const derivedKey = await crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-512", salt: keySalt, iterations: pbkdf2Iterations }, generatedKey, { name: "AES-GCM", length: 256 }, true, [ "encrypt", "decrypt" ]);

    //console.log("Generated PBKDF2 Key.");

    const iv = crypto.getRandomValues(new Uint8Array(12));
    //encodedString = textEncoder.encode("cool string");

    //console.log("Encrypting data...")

    const encryptResult = new Uint8Array(await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        derivedKey,
        data,
    ));

    //console.log("Encrypted data.")

    //console.log(new Uint8Array(await crypto.subtle.exportKey("raw", derivedKey)).toBase64({ alphabet: "base64url" }), keySalt);

    return { cipherText: encryptResult, iv: iv, salt: keySalt, sha256: new Uint8Array(await crypto.subtle.digest("SHA-512", data)) };

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

export async function generateEncryptedDirectory(inputDirectory: FSDirectory, keyPhrase: Uint8Array): Promise<FSDirectory> {
    const enc = new TextEncoder();

    inputDirectory.contents = await generateEncrypted(
        enc.encode(JSON.stringify(inputDirectory.contents)),
        keyPhrase
    );

    return inputDirectory;
}

export function generateEncryptedDirectoryWithStringAsKeyPhrase(inputDirectory: FSDirectory, keyPhrase: string): Promise<FSDirectory> {
    return generateEncryptedDirectory(inputDirectory, enc.encode(keyPhrase));
}

export async function generateEncryptedFile(inputFile: FSFile, keyPhrase: Uint8Array): Promise<FSFile> {
    const enc = new TextEncoder();

    inputFile.fileContent = await generateEncrypted(
        enc.encode(JSON.stringify(inputFile.fileContent)),
        keyPhrase
    );

    return inputFile;
}

export function generateEncryptedFileWithStringAsKeyPhrase(inputFile: FSFile, keyPhrase: string): Promise<FSFile> {
    return generateEncryptedFile(inputFile, enc.encode(keyPhrase));
}

export function encodeStringToBase64(targetString: string) {
    // @ts-ignore
    return new TextEncoder().encode(targetString).toBase64({ alphabet: "base64url" });
}