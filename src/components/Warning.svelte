<script lang="ts">
	import { fade } from "svelte/transition";

    let { children, heading, borderColor }: { children: any, heading: string, borderColor: string } = $props();
</script>

<div class="warning" transition:fade={{ duration: 2000 }}>
	<div class="primaryContainer">
		<div class="heading">

		</div>
		<div class="content">
			{@render children()}
		</div>
	</div>
</div>

<style lang="scss">
	.warning {
	  position: sticky;
	  left: 0;
	  right: 0;
	  top: 0;
	  bottom: 0;

	  width: 100dvw;
	  height: 100dvh;

	  z-index: 2;

	  background-color: rgba(255, 255, 255, 200);
	}
</style>