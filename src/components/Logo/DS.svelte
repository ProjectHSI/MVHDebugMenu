<script lang="ts">
    import "./DS.svelte.scss";
    import MVHDebugMenuLogo from "$lib/images/mvhdebugmenulogo.svg?url";

    let props = $props();
</script>
<img id="logoContainer" src={MVHDebugMenuLogo} alt="logo" style:color="black">
<!--
<div id="logoContainer">

    &lt;!&ndash;<div id="logoCenteredContainer">
        <span id="mvhTitle"><b>MVH</b></span>
        <span id="mvhDebugMenuLower">Debug Menu</span>
    </div>&ndash;&gt;
</div>-->
