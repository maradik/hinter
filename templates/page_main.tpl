{extends 'page.tpl'}

{block 'title'}HintOk - Простые ответы на сложные вопросы{/block}

{block 'content'}
	<div class="row">
		<div class="col-md-12">
			<h1>Hint<span class="text-success">Ok</span> подскажет всем!</h1>
			<p>
				Сервис поиска простых ответов на сложные вопросы.
			</p>
		</div>		
	</div>
	
	<div class="row">
		<div class="col-md-12">
			<h2><span class="glyphicon glyphicon-question-sign"></span> Новые вопросы:</h2>
		</div>			
	</div>	
	{include 'content_mainquestionlist.tpl'}	
	
	
{/block}


