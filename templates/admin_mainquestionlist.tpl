{extends 'page.tpl'}

{block 'title'}Администрирование подсказок | HintOk{/block}

{block 'content'}
	
	<div class="row">
		<div class="col-md-12">
			<h2><span class="glyphicon glyphicon-question-sign"></span> Вопросы:</h2>
		</div>			
	</div>		
	
	<div class="row">
		<div class="col-md-11 col-md-offset-1">
			<table class="table table-striped table-hover">								
				<tbody>
					<!-- ko foreach: MainQuestionList -->
						<tr>
							<td>
								<div class="row">
									<div class="col-md-9">
										<h3 class="top10">
											<span class="glyphicon glyphicon-off" data-bind="css: ( Active() ? 'text-success' : 'text-danger' )"></span>
											<span data-bind="text: Title"></span>
										</h3>
										<div class="multiline" data-bind="text: Description.truncatedText(300), visible: Description"></div>
										<div class="top10" data-bind="with: $root.CategoryList.findById(CategoryId()), visible: !$root.CategoryId()">
											<div class="label label-info">
												<span class="glyphicon glyphicon-folder-open"></span> <span data-bind="text: Title"></span>
											</div>
										</div>
									</div>
									<div class="col-md-3 text-right">
										<a href="#" target="_blank" class="btn btn-info btn-sm btn-block-sm" data-bind="attr: { href: '/question/' + Id(), title: Title() }">
											<span class="glyphicon glyphicon-play"></span> Просмотр
										</a>
										<button class="btn btn-warning btn-sm btn-block-sm" data-bind="click: $root.activateMainQuestion, disable: Locked">
											<span class="glyphicon glyphicon-off"></span> <span data-bind="text: Active() ? 'Отключить' : 'Активировать'"></span>
										</button>	
										<a href="#" class="btn btn-success btn-sm btn-block-sm" data-bind="attr: { href: '/question/' + Id() + '/edit' }">
											<span class="glyphicon glyphicon-pencil"></span> Изменить
										</a>										
										<button class="btn btn-danger btn-sm btn-block-sm" data-bind="click: $root.removeMainQuestion, disable: Locked">
											<span class="glyphicon glyphicon-remove"></span> Удалить
										</button>																	
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
					<tr data-bind="visible: !Loading() && IsEndOfList() && !MainQuestionList().length">
						<td>
							<em>Нет записей</em>
						</td>
					</tr>					
				</tbody>
			</table>
		</div>		
	</div>
	
{/block}	

{block 'scripts'}
	<script type="text/javascript">
		$(document).ready(function () {
			MainQuestionListVM = new Hinter.MainQuestionListVM(null, true);
			MainQuestionListVM.bind(null, {if !empty($categoryList)}{json_encode($categoryList)}{/if});
		});
	</script>
{/block}