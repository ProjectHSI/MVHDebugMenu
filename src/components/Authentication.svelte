<script lang="ts">
    import {knownAccounts} from "$lib/knownAccounts.compile";
    import { page } from "$app/state";
    import { setContext, getContext } from "svelte";
    import bcrypt from "bcryptjs";
    //import {writable} from "svelte/store";

    let usernameField = $state("");
    let passwordField = $state("");

    function signIn() {
        for (const knownAccount of knownAccounts) {
	        if (usernameField == knownAccount.username && bcrypt.compareSync(passwordField, knownAccount.password)) {
				setContext("currentAccount", knownAccount);
            }
        }
    }
</script>

<!--<div class="inputBox">-->
<div
		class="authenticationBox">
	<div>
		<input class="inputBoxElement" style:margin-bottom="1.5%" type="text"
		       bind:value={usernameField} placeholder="Username"/>
		<br/>
		<input class="inputBoxElement" style:margin-top="1.5%" style:margin-bottom="1.5%" type="password"
		       bind:value={passwordField} placeholder="Password"/>
		<br/>
		<input class="inputBoxElement"
		       style:margin-top="1.5%" style:margin-bottom="1.5%"
		       style:margin-right="2.5%" style:margin-left="0%"
		       style:width="47.5%"
		       type="button" value="Sign In" onclick={signIn}/><!--
	--><input class="inputBoxElement"
		      style:margin-top="1.5%" style:margin-bottom="1.5%"
		      style:margin-left="2.5%" style:margin-right="0%"
		      style:width="47.5%"
		      type="button" value="Sign Up"/>
	</div>
</div>
<!--</div>-->

<style lang="scss">
  /*    .inputBox {
		background-color: rgb(230, 230, 230);
		border-radius: 5%;
		//padding: 2%;
		//margin: 2%;
		//width: 100%;
		width: max-content;
	  }*/

  .authenticationBox {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .inputBoxElement {
    //width: 95%;
  }
</style>