{extends 'page.tpl'}

{block 'title'}Нет доступа | HintOk{/block}

{block 'content'}
	<div class="row">
		<div class="col-md-12">
			<h1><span class="glyphicon glyphicon-ban-circle text-danger"></span> Нет доступа!</h1>			
			<p>
				{if (empty($userData.id))}
					Войдите на сайт под своим именем (Введите Имя пользователя и Пароль вверху).
				{else}
					У вас не хватает прав на данную операцию!
				{/if}
			</p>
		</div>		
	</div>
{/block}
