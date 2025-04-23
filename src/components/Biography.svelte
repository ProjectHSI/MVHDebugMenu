<script lang="ts">
	import {onMount} from "svelte";
    import {error} from "@sveltejs/kit";

    onMount(() => {
       if (errorOut)
           setTimeout(() => {
               error(500,
	                `Module Location:\n` +
                    `\n` +
	                `             MVHDE\n` +
                    `@              MVH\n` +
                    `@ HSIGE Entrypoint\n` +
	                `\n` +
                    `Address space wiped - no further information can be provided.\n` +
                    `**DO NOT INVESTIGATE** Report to Richard/Mike as soon as possible.`);
           }, 2000)
	});

	let { name, image, errorOut }: { name: string, image: string, errorOut: boolean } = $props();
</script>

{#if errorOut}
	Loading...
{/if}

<style lang="scss">

</style>