<script lang="ts">
	let { children }: { children: any } = $props();
</script>

<span class="vcrOsd">{@render children?.()}</span>

<style lang="scss">
  .vcrOsd {
    font-family: VCR,monospace;
    background-color: black;
    height: min-content;
  }

  @font-face{
    font-family: "VCR";
    src:url('$lib/fonts/VCR.ttf');
  }
</style>