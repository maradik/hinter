{extends 'page.tpl'}

{block 'title'}{$categoryCurrent->title|e:'HTML'} | HintOk{/block}

{block 'content'}
	<div>
		<div class="row">
			<div class="col-md-12">
				<h1><span class="glyphicon glyphicon-folder-open"></span> {$categoryCurrent->title|e:'HTML'}</h1>
				{if !empty($categoryCurrent->description)}
					<div class="multiline">{$categoryCurrent->description|e:'HTML'}</div>
				{/if}
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

{block 'scripts'}
	<script type="text/javascript">
		$(document).ready(function () {
			MainQuestionListVM = new Hinter.MainQuestionListVM({!empty($categoryCurrent) ? $categoryCurrent->id : null});
			MainQuestionListVM.bind(
				{json_encode($mainQuestionList)}, 
				{if !empty($categoryList)}{json_encode($categoryList)}{else}null{/if}
			);
		});
	</script>
{/block}
