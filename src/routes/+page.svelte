<script lang="ts">
    import { browser } from "$app/environment";
    import Authentication from "../components/Authentication.svelte"

    import { knownAccounts } from "$lib/knownAccounts.compile";

    import Logo from "../components/Logo/Logo.svelte"
    import DiscoveredAccounts from "../components/DiscoveredAccounts/DiscoveredAccounts.svelte";
    import AccountTypeWarning from "../components/AccountTypeWarning.svelte";
    import Warning from "../components/Warning.svelte";

    let discoveredAccounts = browser ? localStorage.getItem("") : null;
    //let discoveredAccounts = null
</script>

<div id="accountManagementScreen">
    <div id="accountManagementScreenBox">
        <div style="text-align: center;"><Logo logoStyle="DS"/></div>
        <div id="logoContentSeparator"></div>
        <div id="authContainer">
            <!--{#if discoveredAccounts != null}-->
            <div style:flex-shrink="0" style:flex-grow="1"><DiscoveredAccounts></DiscoveredAccounts></div>
            <div id="accountContentSeparator"></div>
            <!--{/if}-->
            <div style:flex-shrink="0"><Authentication></Authentication></div>
        </div>
    </div>
</div>

<!--<Warning>Test</Warning>-->

<style lang="scss">
    #accountManagementScreen {
      background-color: rgb(255, 255, 255);

      display: flex;
      align-items: center;
      justify-content: center;
      width: 100dvw;
      height: 100dvh;
    }

    #accountManagementScreenBox {
      background-color: rgb(255, 255, 255);
      padding: 1%;

      width: 80%;

        //width: max-content;

        display: flex;
        flex-direction: column;

        align-items: center;

      border-radius: 5% 5%;
      border-color: rgb(200, 200, 200);
      border-style: solid;
    }

    #logoContentSeparator {
      background-color: black;
      width: 100%;
      height: 0.5dvh;
      margin-top: 2%;
      margin-bottom: 3%;
    }

    #authContainer {
        display: flex;
        flex-direction: row;

        width: 100%;

        justify-content: center;

        //margin-left: 5%;
        //margin-right: 5%;

        overflow: hidden;
    }

    #accountContentSeparator {
        background-color: black;
        width: calc(0.15dvw);
        margin-left: 2%;
        margin-right: 2%;
        //height: 100%;

        //margin-right: 2%;

        align-self: stretch;
        align-content: center;

        flex-shrink: 0;
        flex-grow: 0;
    }
</style>