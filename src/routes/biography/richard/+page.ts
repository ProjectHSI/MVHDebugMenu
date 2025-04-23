import type {PageLoad} from "./$types";
import {error} from "@sveltejs/kit";

export const load: PageLoad = () => {
    //setTimeout(() => {
        error(500,
            `Module Location:\n` +
            `\n` +
            `             MVHDE\n` +
            `@              MVH\n` +
            `@ HSIGE Entrypoint\n` +
            `\n` +
            `Address space wiped - no further information can be provided.\n` +
            `**DO NOT INVESTIGATE** Report to Richard/Mike as soon as possible.`);
    //}, 2000);
}