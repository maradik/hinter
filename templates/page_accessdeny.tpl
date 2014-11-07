{extends 'page.tpl'}

{block 'title'}Нет доступа | HintOk{/block}

{block 'content'}
	<div class="row">
		<div class="col-md-12">
			{if (empty($userData.id))}
				{include 'content_fullloginform.tpl'}
			{else}			
				<div>
					<h1><span class="glyphicon glyphicon-ban-circle text-danger"></span> Нет доступа!</h1>			
					<p>				
						У вас недостаточно прав на данную операцию!
					</p>
				</div>
			{/if}
		</div>		
	</div>
{/block}
