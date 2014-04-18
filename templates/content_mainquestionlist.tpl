<div class="row">
	<div class="col-md-11 col-md-offset-1">
		{if (!empty($mainQuestionList))}
			<table class="table table-striped table-hover">								
				<tbody>
					{foreach $mainQuestionList as $question}						
					<tr class="list-item-static">
						<td>
							<div class="row">
								<div class="col-md-9">
									<h3>{$question->title|e:'HTML'}</h3>
									<p>											
										{$question->description|truncate:100:'...'|e:'HTML'}	
									</p>
								</div>
								<div class="col-md-3 text-right">
									<a href="/question/{$question->id}" title="{$question->title|e:'HTML'}" class="btn btn-primary">
										Узнать ответ!
									</a>
								</div>
							</div>
						</td>
					</tr>
					{/foreach}
					<!-- ko foreach: MainQuestionList -->
						<tr>
							<td>
								<div class="row">
									<div class="col-md-9">
										<h3 data-bind="text: Title"></h3>
										<p data-bind="text: Description"></p>
									</div>
									<div class="col-md-3 text-right">
										<a href="#" title="" class="btn btn-primary" data-bind="attr: { href: '/question/' + Id(), title: Title() }">
											Узнать ответ!
										</a>
									</div>
								</div>
							</td>						
						</tr>
					<!-- /ko -->
					<tr data-bind="visible: Loading() && !IsEndOfList()">
						<td>
							Загрузка...
						</td>
					</tr>
				</tbody>
			</table>
		{else}
			<p><em>Нет вопросов в данной категории</em></p>
		{/if}
	</div>		
</div>

{block 'scripts'}
	<script type="text/javascript">
		$(document).ready(function () {
			MainQuestionListVM = new Hinter.MainQuestionListVM({!empty($categoryCurrent) ? $categoryCurrent->id : null});
			MainQuestionListVM.bind({json_encode($mainQuestionList)});
		});
	</script>
{/block}