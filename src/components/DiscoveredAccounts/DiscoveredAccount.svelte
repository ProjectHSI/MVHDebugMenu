<script lang="ts">
    import {AccountType, type IDiscoveredAccount, isDiscoveredAccount} from "$lib/accounts";

	let { username, accountType }: { username: String, accountType: AccountType } = $props();
</script>

<div class="account">
	<div class="accountTypeIcon">{AccountType[accountType].at(0)}</div>
	<div class="accountTypeNameSeparator"></div>
	<div class="accountUserNameAligner">
		<span class="accountUserName">{username}</span>
	</div>
</div>

<style lang="scss">
    .account {
      //width: ;
      width: max-content;
      min-width: 100%;
      //min-width: 100%;
      //flex-basis: 100%;
      //flex-grow: 1;
      //flex-shrink: 0;
      background-color: rgb(230, 230, 230);
      border-radius: 5%;
      //margin: 0%;
      display: flex;
      //overflow: hidden;
    }

    .account:first-of-type {
      margin-bottom: 1.25%;
    }

    .account:last-of-type {
      margin-top: 1.25%;
    }

    .account:only-of-type {
      margin: 0 !important;
    }

	.accountTypeIcon {
	  //width: 10%;
	  aspect-ratio: 1 / 1;
	  height: auto;
	  width: 30%;
	  flex-shrink: 0;
	  background-color: black;
	  color: white;
	}

	.accountTypeNameSeparator {
	  width: 5%;
	  height: 100%;

      //align-self: stretch;
      flex-shrink: 0;
	}

	.accountUserNameAligner {
	  display: flex;
	  align-items: flex-end;
	  flex-shrink: 0;
	}

	.accountUserName {
	  flex-shrink: 0;
	}
</style>