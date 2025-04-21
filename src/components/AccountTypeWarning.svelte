<script lang="ts">
    import {AccountType, type IDiscoveredAccount} from "$lib/accounts";
    import "$lib/fonts/VCR.ttf";
    import {onDestroy, onMount} from "svelte";
    import dayjs from "dayjs";
    import TUIText from "./TUIText.svelte";
    //import Color = types.Color;

    let dateTimeString = $state("XXXX-XX-XX XX:XX:XX.XXX XM #XX:XX");

    let { currentAccount }: { currentAccount: IDiscoveredAccount } = $props();

    // Configuration Table
    enum AccountTypeWarningSeverity {
        INFO,
	    NOTICE,
	    CAUTION = 3
    }

    interface AccountTypeWarningConfiguration {
        listDT: boolean,
        listName: boolean,
	    listPWHash: boolean,
        severity: AccountTypeWarningSeverity,
	    textColour: String,
	    additionalInformation?: String
    }

    const accountTypeWarnings: { [key in AccountType]: AccountTypeWarningConfiguration | null } = {
	    [AccountType.DryRun]: {
            listDT: false,
		    listName: true,
            listPWHash: false,
		    severity: AccountTypeWarningSeverity.INFO,
		    textColour: "orange"
	    },

	    [AccountType.Regular]: null,

	    [AccountType.Administrator]: {
            listDT: true,
            listName: true,
            listPWHash: false,
            severity: AccountTypeWarningSeverity.NOTICE,
		    textColour: "yellow"
	    },

        [AccountType.SuperUser]: {
            listDT: true,
            listName: true,
	        listPWHash: true,
            severity: AccountTypeWarningSeverity.CAUTION,
	        additionalInformation: "ACCOUNT LOCKED (ERC: MVHDE_CFG_ROOT_DISABLED)",
	        textColour: "red"
        }
    };

    let continueUpdatingDateTime = true;

    function updateDateTime() {
		if (continueUpdatingDateTime) {
            dateTimeString = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS A Z");

            requestAnimationFrame(updateDateTime);
        }
    }

    onDestroy(() => {
        continueUpdatingDateTime = false;
    });

    onMount(() => {
        requestAnimationFrame(updateDateTime);
    });
</script>

<!-- ignore ALL typing errors with possibly null objects. those will NEVER occur as we have a null guard here -->
{#if accountTypeWarnings[currentAccount.accountType] != null}
<div id="accountTypeWarning" style:color={accountTypeWarnings[currentAccount.accountType].textColour}>
	<div style="background-color: rgb(0,0,0)">
		<TUIText>
			{"!".repeat(accountTypeWarnings[currentAccount.accountType].severity)} {AccountType[currentAccount.accountType]} Account {"!".repeat(accountTypeWarnings[currentAccount.accountType].severity)}

			{#if accountTypeWarnings[currentAccount.accountType].listDT}
				<br /> {dateTimeString}
			{/if}

			{#if accountTypeWarnings[currentAccount.accountType].listName}
				<br />User: {currentAccount.username}
			{/if}

			{#if accountTypeWarnings[currentAccount.accountType].listPWHash}
				<br />AH: {currentAccount.password}
			{/if}

			{#if accountTypeWarnings[currentAccount.accountType].additionalInformation}
				<br /> {accountTypeWarnings[currentAccount.accountType].additionalInformation}
			{/if}
		</TUIText>
	</div>
	<!--<span class="accountTypeWarningText">{"!".repeat(accountTypeWarnings[currentAccount.accountType].severity)} {AccountType[currentAccount.accountType]} Account {"!".repeat(accountTypeWarnings[currentAccount.accountType].severity)}</span>
	{#if accountTypeWarnings[currentAccount.accountType].listDT}
		<span class="accountTypeWarningText">{dateTimeString}</span>
	{/if}
	{#if accountTypeWarnings[currentAccount.accountType].listName}
		<span class="accountTypeWarningText">User: {currentAccount.username}</span>
	{/if}
	{#if accountTypeWarnings[currentAccount.accountType].listPWHash}
		<span class="accountTypeWarningText">AH: {currentAccount.password}</span>
	{/if}
	{#if accountTypeWarnings[currentAccount.accountType].additionalInformation}
		<span class="accountTypeWarningText">{accountTypeWarnings[currentAccount.accountType].additionalInformation}</span>
	{/if}-->
</div>
{/if}

<style lang="scss">
	#accountTypeWarning {
	  width: 100%;
	  height: 100%;
	  display: flex;
	  flex-direction: column;
	  align-items: flex-end;
	  justify-content: flex-end;
	  position: fixed;
	  text-align: right;

	  overflow: clip;
	}

	.accountTypeWarningText {
      font-family: VCR,monospace;
      background-color: black;
	  height: min-content;
	}

    @font-face{
      font-family: "VCR";
      src:url('$lib/fonts/VCR.ttf');
    }
</style>
