<div>
	{include 'sidebar_categories.tpl'}
	{include 'sidebar_links.tpl'}
	{include 'sidebar_vk.tpl'}	
	{if !$dev_server && (!empty($categoryCurrent) || !empty($mainQuestion))}
		{include 'sidebar_adv.tpl'}
	{/if}		
</div>
	

