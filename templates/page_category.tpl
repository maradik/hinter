{extends 'page.tpl'}

{block 'content'}
	<div>
		<div class="row">
			<div class="col-md-12">
				<h1><span class="glyphicon glyphicon-folder-open"></span> {$categoryCurrent->title|e:'HTML'}</h1>
				<p>
					{$categoryCurrent->description|e:'HTML'}	
				</p>
			</div>			
		</div>
		
		<div class="row">
			<div class="col-md-12">
				<h2><span class="glyphicon glyphicon-question-sign"></span> Вопросы:</h2>
			</div>			
		</div>	
		{include 'content_mainquestionlist.tpl'}
	</div>
{/block}


