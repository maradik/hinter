{extends 'page.tpl'}

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
										<h3>
											<span class="glyphicon glyphicon-off" data-bind="css: ( Active() ? 'text-success' : 'text-muted' )"></span>
											<span data-bind="text: Title"></span>
										</h3>
										<p data-bind="text: Description"></p>
									</div>
									<div class="col-md-3 text-right">
										<a href="#" target="_blank" class="btn btn-info btn-block" data-bind="attr: { href: '/question/' + Id(), title: Title() }">
											<span class="glyphicon glyphicon-play"></span> Просмотр
										</a>
										<button class="btn btn-warning btn-block" data-bind="click: $root.activateMainQuestion, disable: Locked">
											<span class="glyphicon glyphicon-off"></span> <span data-bind="text: Active() ? 'Отключить' : 'Активировать'"></span>
										</button>	
										<button class="btn btn-danger btn-block" data-bind="click: $root.removeMainQuestion, disable: Locked">
											<span class="glyphicon glyphicon-remove"></span> Удалить
										</button>																	
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
					<tr data-bind="visible: !MainQuestionList().length">
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
			MainQuestionListVM.bind();
		});
	</script>
{/block}