<script lang="ts">
	import { browser } from "$app/environment";
    import {type AccountType, type IDiscoveredAccount, isDiscoveredAccount} from "$lib/accounts";
    import DiscoveredAccount from "./DiscoveredAccount.svelte"
    import { knownAccounts } from "$lib/knownAccounts.compile";

    let discoveredAccounts: IDiscoveredAccount[] | undefined = undefined;

    {
        if (browser) {
            let discoveredAccountsString = localStorage.getItem("discoveredAccounts");

            if (discoveredAccountsString != null) {
                try {
                    let discoveredAccountsUnvalidated = JSON.parse(discoveredAccountsString);

                    let isDiscoveredAccountsArrayValid = true;

                    for (const discoveredAccountsUnvalidatedElement of discoveredAccountsUnvalidated) {
	                    if (!isDiscoveredAccount(discoveredAccountsUnvalidatedElement)) {
                            isDiscoveredAccountsArrayValid = false;
                            break;
                        }
                    }

                    if (isDiscoveredAccountsArrayValid) {
                        discoveredAccounts = discoveredAccountsUnvalidated;
                    }
                } catch {
                    discoveredAccounts = [];
                }
            } else {
                discoveredAccounts = knownAccounts;
            }
        }
    }
</script>

<div class="discoveredAccounts">
	{#if discoveredAccounts === undefined}
		<span>Please wait...</span>
	{:else if (discoveredAccounts).length === 0}
		<div style:text-align="center"><span><b>You have no known accounts.</b></span></div><span>Sign in or sign up to add an account to this list.</span>
	{:else}
		{#each discoveredAccounts as discoveredAccount}
			<!--<div>-->
				<DiscoveredAccount username={discoveredAccount.username}
			                        accountType={discoveredAccount.accountType}></DiscoveredAccount>
			<!--</div>-->
		{/each}
	{/if}
</div>

<style lang="scss">
	.discoveredAccounts {
	  display: flex;
	  flex-direction: column;
	  width: 100%;
	  //width: max-content;
	}
</style>