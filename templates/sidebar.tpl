<div>
	{include 'sidebar_categories.tpl'}
	{include 'sidebar_links.tpl'}
	{if !$dev_server && (!empty($categoryCurrent) || !empty($mainQuestion))}
		{include 'sidebar_adv.tpl'}
	{/if}		
</div>
	

