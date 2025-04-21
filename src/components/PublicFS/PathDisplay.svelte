<script lang="ts">
	import type {PublicFsPathElement} from "$lib/publicFs.path";

    let { path }: { path: PublicFsPathElement[] } = $props();
</script>

<div id="pathDisplayPath">
	<span class="pathDisplaySlash">/</span>
	{#each path as pathElement, pathElementIndex}
		{@const pathElementColor = pathElement.decryptionInProgress ? "#5C5C00" : "black"}

		<span style:color={pathElementColor}>{pathElement.name}</span>
		{#if pathElementIndex !== path.length - 1}
			<span class="pathDisplaySlash">/</span>
		{/if}
	{/each}
</div>

<style lang="scss">
	#pathDisplayPath {
	  display: flex;
	  //align-content: center;
	  //justify-items: center;
	  align-items: center;
	}

	.pathDisplaySlash {
	  font-size: 200%;
	  margin-left: 0.2em;
	  margin-right: 0.2em;
	}
</style>