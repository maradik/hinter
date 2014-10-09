{extends 'page.tpl'}

{block 'title'}Мои подсказки | HintOk{/block}

{block 'content'}
	<div>
		<div class="row">
			<div class="col-md-12">
				<h2><span class="glyphicon glyphicon-question-sign"></span> Мои подсказки:</h2>
			</div>			
		</div>		
		
		{include 'content_mainquestionlist.tpl'}	
	</div>
{/block}	

{block 'scripts'}
	<script type="text/javascript">
		$(document).ready(function () {			
			MainQuestionListVM = new Hinter.MainQuestionListVM(null, true, CurrentUserVM, true);			
			MainQuestionListVM.bind(null, {if !empty($categoryList)}{json_encode($categoryList)}{else}null{/if});			
		});
	</script>
{/block}