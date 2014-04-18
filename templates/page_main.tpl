{extends 'page.tpl'}

{block 'content'}
	<div class="row">
		<div class="col-md-12">
			<h1>Hinter подскажет всем!</h1>
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


