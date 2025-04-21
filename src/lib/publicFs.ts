export interface Encrypted {
    cipherText: ArrayBuffer;
    salt: Uint8Array;
    iv: Uint8Array;
    sha256: ArrayBuffer
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

    //filePassword: string
}

export interface FSDirectory {
    directory: true; // dummy type used for type-guarding

    //iv: number;
    //sha256: ArrayBuffer;
    contents: { [index: string]: FSEntry } | Encrypted;
}

export type FSEntry = FSDirectory | FSFile;

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