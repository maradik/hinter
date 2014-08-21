<div class="row">
	<div class="col-md-12">
		{if (!empty($mainQuestionList))}
			<table class="table table-striped table-hover">								
				<tbody>
					{foreach $mainQuestionList as $question}						
					<tr class="list-item-static">
						<td>
							<div class="row">
								<div class="col-md-9">
									<h3>{$question->title|e:'HTML'}</h3>
									<div class="multiline">{$question->description|truncate:300:'...'|e:'HTML'}</div>
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
									<div class="col-sm-2 hidden-xs">
										<div>
											<a href="#" class="thumbnail top10" data-bind="attr: { href: '/question/' + Id(), title: Title() }, with: Images()[0] || { UrlMiddle: '/uploads/default.png', Title: 'Нет фото' }">
												<img src="#" data-bind="attr: { src: UrlMiddle, title: Title, alt: Title }">
											</a>
										</div>							
									</div>									
									<div class="col-sm-7 col-xs-12">
										<h3 class="top10" data-bind="text: Title"></h3>
										<div class="multiline" data-bind="text: Description.truncatedText(300), visible: Description"></div>
										<div class="top10" data-bind="with: $root.CategoryList.findById(CategoryId()), visible: !$root.CategoryId()">
											<a href="#" class="label label-info" data-bind="attr: { href: '/category/' + Id() }">
												<span class="glyphicon glyphicon-folder-open"></span>&nbsp;&nbsp;<span data-bind="text: Title"></span>
											</a>
										</div>
									</div>									
									<div class="col-sm-3 col-xs-12 text-right">
										<a href="#" title="" class="btn btn-primary top10" data-bind="attr: { href: '/question/' + Id(), title: Title() }">
											Узнать ответ!
										</a>
									</div>
								</div>
							</td>						
						</tr>
					<!-- /ko -->
					<tr data-bind="visible: Loading() && !IsEndOfList()">
						<td>
							<img src="/uploads/loading2.gif" alt="Загрузка..." title="Загрузка..." />
						</td>
					</tr>			
					<tr data-bind="visible: !Loading() && !IsEndOfList()">
						<td>
							<a href="#" class="btn btn-default" data-bind="click: asyncLoadOlderList">Еще...</a>
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
			MainQuestionListVM.bind(
				{json_encode($mainQuestionList)}, 
				{if !empty($categoryList)}{json_encode($categoryList)}{else}null{/if}
			);
		});
	</script>
{/block}