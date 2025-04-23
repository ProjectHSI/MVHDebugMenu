import type {PageLoad} from "./$types";
import {error} from "@sveltejs/kit";

export const load: PageLoad = () => {
    error(500, { message: "test" })
}