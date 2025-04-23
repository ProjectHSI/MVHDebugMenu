<script>
    import TuiText from "../components/TUIText.svelte";
    import { page } from '$app/state';

    export const prerender = true;
</script>
<div id="anomalyScreen">
	<TuiText>
		Exception in MDM
		<br /><br />
		Gracefully handled. Please reload the client.
		Check of MDM integrity should be performed.
		<br /><br />
		If this error occurs under strange or highly specific circumstances, and shows 'Module Location' in place of the stack trace,
		<br />
		do not investigate - report the error w/ module location to Richard or Mike.
		<br /><br />
		Investigating is a felony and will be pursued to the highest extent that the law allows.
		<br /><br /><br /><br />
		INFORMATION:
		<br /><br />
		<span>{page.error.message}</span>
	</TuiText>
</div>

<style lang="scss">
  #anomalyScreen {
    background-color: rgb(0,0,0);

    color: rgb(255, 255, 255);

    width: 100dvw;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    position: sticky;

    overflow-y: scroll;

    user-select: none;
  }
</style>