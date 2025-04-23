//import type {FSDirectory} from "$lib/publicFs";

import {
    type Encrypted,
    FileType, fixDecryptedFsDirectory,
    fixEncrypted,
    type FSDirectory,
    type FSEntry,
    type FSFile,
    pbkdf2Iterations
} from "./publicFs";
import * as fs from "fs";
import {
    generateEncryptedDirectoryWithStringAsKeyPhrase,
    encodeStringToBase64,
    generateEncryptedFileWithStringAsKeyPhrase
} from "./publicFsEncryptionRoutines.compile";

let _FS: FSDirectory = {
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
                "the_seekret.txt": await generateEncryptedFileWithStringAsKeyPhrase({
                    file: true,
                    fileContent: {
                        fileContent: "the seekret is not in another castle",
                        fileMimeType: "text/plain",
                        fileContentType: FileType.RAW
                    }
                }, "test")
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
};

let preencryptedJsonParse: { [index: string]: FSEntry } = JSON.parse(fs.readFileSync("./preencrypted.json", { encoding: "utf-8" }));

let fixedPreencryptedJsonParse = fixDecryptedFsDirectory({ directory: true, contents: preencryptedJsonParse });

for (const preencryptedJsonParseElement of Object.keys(fixedPreencryptedJsonParse.contents)) {
    // @ts-ignore
    _FS.contents[preencryptedJsonParseElement] = fixedPreencryptedJsonParse.contents[preencryptedJsonParseElement];
}

export const FS: FSDirectory = _FS;