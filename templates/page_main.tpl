{extends 'page.tpl'}

{block 'title'}HintOk - Простые ответы на сложные вопросы{/block}

{block 'content'}
	<div class="row">
		<div class="col-md-12">
			<h1>Hint<span class="text-default">Ok</span> подскажет всем!</h1>
			<p>
				Сервис поиска простых ответов на сложные вопросы.
			</p>
			
			<div class="row">
				<div class="col-sm-3 col-xs-12">
					<div class="alert alert-danger bottom0">
			  			<h4>Находите <strong>интересующий</strong> вопрос</h4>
			  		</div>			  		
				</div>
				<div class="col-sm-1 hidden-xs text-danger text-center top10">
					<h4 class="glyphicon glyphicon-arrow-right"></h4>
				</div>			
				<div class="visible-xs col-xs-12 text-danger text-center">
					<h4 class="glyphicon glyphicon-arrow-down"></h4>
				</div>						
				<div class="col-sm-3 col-xs-12">
					<div class="alert alert-warning bottom0">
			  			<h4>Отвечаете на <strong>наводящие</strong> вопросы</h4>		
			  		</div>	  		
				</div>
				<div class="col-sm-1 hidden-xs text-warning text-center top10">
					<h4 class="glyphicon glyphicon-arrow-right"></h4>
				</div>	
				<div class="visible-xs col-xs-12 text-warning text-center">
					<h4 class="glyphicon glyphicon-arrow-down"></h4>
				</div>								
				<div class="col-sm-3 col-xs-12">
					<div class="alert alert-success">					
			  			<h4>Получаете <strong>оптимальный</strong> ответ!</h4>	
			  		</div>		  		
				</div>	
				<div class="col-sm-1 hidden-xs text-success text-center top10">
					<h4 class="glyphicon glyphicon-thumbs-up"></h4>
				</div>												
			</div>				
		</div>						
	</div>
	
	<div class="row">
		<div class="col-md-12">
			<h2><span class="glyphicon glyphicon-question-sign"></span> Новые вопросы:</h2>
		</div>			
	</div>	
	{include 'content_mainquestionlist.tpl'}	

{/block}

{block 'scripts'}
	<script type="text/javascript">
		$(document).ready(function () {
			MainQuestionListVM = new Hinter.MainQuestionListVM();
			MainQuestionListVM.bind(
				{json_encode($mainQuestionList)}, 
				{if !empty($categoryList)}{json_encode($categoryList)}{else}null{/if}
			);
		});
	</script>
{/block}


