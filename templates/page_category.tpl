{extends 'base.tpl'}

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
				
		<div class="row">
			<div class="col-md-11 col-md-offset-1">
				{if ($questionList)}
					<table class="table table-striped table-hover">								
						<tbody>
							{foreach $questionList as $question}						
							<tr>
								<td>
									<div>
										<h3>{$question->title|e:'HTML'}</h3>
										<p>											
											{$question->description|truncate:100:'...'|e:'HTML'}	
										</p>
									</div>
									<div>
										<a href="/question/{$question->id}" title="Пройти тест и узнать ответ!" class="btn btn-primary">
											Узнать ответ!
										</a>
									</div>
								</td>
							</tr>
							{/foreach}
						</tbody>
					</table>
				{else}
					<p><em>Нет вопросов в данной категории</em></p>
				{/if}
			</div>		
		</div>
	</div>
{/block}
