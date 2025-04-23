export interface Encrypted {
    cipherText: Uint8Array;
    salt: Uint8Array;
    iv: Uint8Array;
    sha256: Uint8Array
}

export enum FileType {
    RAW,
    RAW_BASE64,
    URL,
    COMPONENT
}

export interface FSFileInfo {
    fileContentType: FileType,
    fileContent: string,
    fileMimeType: string,
}

export interface FSFile {
    file: true; // dummy type used for type-guarding

    fileContent: FSFileInfo | Encrypted;

    corrupted?: string;

    //filePassword: string
}

export interface FSDirectory {
    directory: true; // dummy type used for type-guarding

    //iv: number;
    //sha256: ArrayBuffer;
    contents: { [index: string]: FSEntry } | Encrypted;
}

export const pbkdf2Iterations: number = 2000000;

export type FSEntry = (FSDirectory | FSFile) & { corrupt?: string };

export function convertJsonParsedUint8ArrayToUint8Array(jsonParsedUint8Array: { [index: string]: number }): Uint8Array {
    let uint8Array = new Uint8Array(Object.keys(jsonParsedUint8Array).length);

    for (const jsonParsedUint8ArrayKey of Object.keys(jsonParsedUint8Array)) {
        uint8Array[Number.parseInt(jsonParsedUint8ArrayKey)] = jsonParsedUint8Array[jsonParsedUint8ArrayKey];
    }

    return uint8Array;
}

export function fixEncrypted(toFix: any): Encrypted {
    return {
        cipherText: convertJsonParsedUint8ArrayToUint8Array(toFix.cipherText),
        salt: convertJsonParsedUint8ArrayToUint8Array(toFix.salt),
        iv: convertJsonParsedUint8ArrayToUint8Array(toFix.iv),
        sha256: convertJsonParsedUint8ArrayToUint8Array(toFix.sha256)
    }
}

export function fixDecryptedFsDirectory(toFix: FSDirectory) {
    // Converts JSON representations of Uint8Arrays to Uint8Arrays.
    // JSON.Parse() doesn't do this automatically.

    if (getIsFsDirectoryContentsEncrypted(toFix.contents))
        throw new Error("\"toFix\" must not be encrypted.");

    for (const decryptedFsEntryName of Object.keys(toFix.contents)) {
        let encrypted: Encrypted | null = null;

        if (getIsFsEntryFile(toFix.contents[decryptedFsEntryName])) {
            if (getIsFsFileContentsEncrypted(toFix.contents[decryptedFsEntryName].fileContent)) {
                toFix.contents[decryptedFsEntryName].fileContent = fixEncrypted(toFix.contents[decryptedFsEntryName].fileContent);
            }
        } else {
            if (getIsFsDirectoryContentsEncrypted(toFix.contents[decryptedFsEntryName].contents)) {
                toFix.contents[decryptedFsEntryName].contents = fixEncrypted(toFix.contents[decryptedFsEntryName].contents);
            }
        }
    }

    return toFix;
}

//export enum FSEntryType {
//    FILE,
//    DIRECTORY
//}

export function getIsFsEntryDirectory(fsEntry: FSEntry): fsEntry is FSDirectory {
    return (fsEntry as FSDirectory).directory !== undefined;
}

export function getIsFsEntryFile(fsEntry: FSEntry): fsEntry is FSFile {
    return (fsEntry as FSFile).file !== undefined;
}

export function getIsFsDirectoryContentsEncrypted(fsDirectoryContents: { [index: number]: FSEntry } | Encrypted): fsDirectoryContents is Encrypted {
    return (fsDirectoryContents as Encrypted).cipherText !== undefined && (fsDirectoryContents as Encrypted).iv !== undefined && (fsDirectoryContents as Encrypted).salt !== undefined;
}

export function getIsFsFileContentsEncrypted(fsFileContents: FSFileInfo | Encrypted): fsFileContents is Encrypted {
    return (fsFileContents as Encrypted).cipherText !== undefined && (fsFileContents as Encrypted).iv !== undefined && (fsFileContents as Encrypted).salt !== undefined;
}