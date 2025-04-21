<script lang="ts">
    import DS from "./DS.svelte";

    let { logoStyle } = $props();
</script>

{#if logoStyle === "DS"}
    <DS />
{/if}