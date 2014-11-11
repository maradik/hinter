{if !$dev_server}
	<div class="text-center bottom20 visible-lg visible-md">
		<!-- VK Widget -->
		<div id="vk_groups" style="display: inline-block;"></div>
		<script type="text/javascript">
			$(document).ready(function () {	
				if (typeof VK !== 'undefined') {
					VK.Widgets.Group("vk_groups", { mode: 0, width: "200", height: "250", color1: 'FFFFFF', color2: '2B587A', color3: '5B7FA6' }, 72155235);
				}
			});
		</script>		
	</div>
{/if}
