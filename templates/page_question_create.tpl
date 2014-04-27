{extends 'page.tpl'}

{block 'content'}
	<!--
	<div class="row">
		<div class="col-md-12">
			<h1>Новое решение</h1>
		</div>		
	</div>
	-->
	<h1>Создание решения</h1>

	<!-- Первый экран -->		
	<div class="panel panel-primary" data-bind="visible: Step() == 0">
		<div class="panel-heading">
			<h3 class="panel-title">Создание решения</h3>
		</div>
		<div class="panel-body">
			<div> 
				<p>Процесс создания нового решения состоит из нескольких шагов:</p>
				<ul>
					<li>Определение основного вопроса</li>
					<li>Определение ответов на основной вопрос</li>
					<li>Определение вспомогательных вопросов</li>
					<li>Определение ответов на вспомогательные вопросы</li>
					<li>Настройка связей между вспомогательными и основными ответами</li>
				</ul>	
				<button class="btn btn-primary" data-bind="click: function() { nextStep(); }">
					Далее <span class="glyphicon glyphicon-chevron-right"></span>
				</button>								
			</div>		
		</div>
	</div>	
	<!-- /Первый экран -->	

	<!-- Основной вопрос -->		
	<div class="panel panel-primary" data-bind="visible: Step() > 0, css: Step() == 1 ? 'panel-primary' : 'panel-default'">
		<div class="panel-heading">
			<h3 class="panel-title">Основной вопрос</h3>
		</div>
		<div class="panel-body">
			<div data-bind="with: MainQuestion"> 
				<div data-bind="visible: Editing()">
					<p>Основной вопрос, на который пользователь ищет ответ.</p>
					<form class="form-horizontal" role="form">
						<fieldset data-bind="disable: Locked">						
							<div class="form-group" data-bind="css: { 'has-error' : Title.hasError, 'has-success' : !Title.hasError() && Title() }">
								<label for="inputMainQuestionTitle" class="col-sm-2 control-label">Вопрос</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="inputMainQuestionTitle" placeholder="Текст вопроса" data-bind="value: Title">
									<span class="small text-danger" data-bind="text: Title.validationMessage(), visible: Title.validationMessage()"></span>
								</div>
							</div>
							<div class="form-group" data-bind="css: { 'has-error' : Description.hasError, 'has-success' : !Description.hasError() && Description() }">
								<label for="inputMainQuestionDescription" class="col-sm-2 control-label">Описание</label>
								<div class="col-sm-10">
									<textarea rows="5" class="form-control" id="inputMainQuestionDescription" placeholder="Поясняющий комментарий" data-bind="value: Description"></textarea>
									<span class="small text-danger" data-bind="text: Description.validationMessage(), visible: Description.validationMessage()"></span>
								</div>
							</div>					
							<div class="form-group" data-bind="css: { 'has-error' : CategoryId.hasError, 'has-success' : !CategoryId.hasError() }">
								<label for="selectMainQuestionCategory" class="col-sm-2 control-label">Категория</label>
								<div class="col-sm-10">
									<select class="form-control" id="selectMainQuestionCategory" data-bind="options: $root.CategoryList, value: CategoryId, optionsText: 'Title', optionsValue: 'Id', optionsCaption: 'Выберите категорию'"></select>
									<span class="small text-danger" data-bind="text: CategoryId.validationMessage(), visible: CategoryId.validationMessage()"></span>									
								</div>
							</div>	
						</fieldset>
					</form>		
					<div>
						<button class="btn btn-primary" data-bind="click: $root.saveMainQuestion, disable: Locked() || Title.hasError() || CategoryId.hasError() || Description.hasError()">
							Далее <span class="glyphicon glyphicon-chevron-right"></span>
						</button>
					</div>					
				</div>		
				<div data-bind="visible: !Editing()">
					<h2 data-bind="text: Title"></h2>
					<p data-bind="text: Description"></p>	
					<p>Категория: <u><em data-bind="text: CategoryId"></em></u></p>				
				</div>														
			</div>		
		</div>
	</div>	
	<!-- /Основной вопрос -->

	<!-- Основные ответы -->		
	<div class="panel panel-primary" data-bind="visible: Step() > 1, css: Step() == 2 ? 'panel-primary' : 'panel-default'">
		<div class="panel-heading">
			<h3 class="panel-title">Возможные варианты ответа</h3>
		</div>
		<div class="panel-body">
			<div> 
				<p data-bind="visible: Step() == 2">Возможные варианты ответа на основной вопрос.</p>
				<table class="table table-striped">								
					<tbody data-bind="foreach: MainAnswerList">
						<tr>
							<td class="col-xs-1">
								<span class="label label-default" data-bind="text: ($index() + 1) + ')'"></span>
							</td>
							<td class="col-xs-11">
								<div class="row">
									<div class="col-md-12">									
										<form class="form-horizontal" role="form" data-bind="visible: Editing()">
											<fieldset data-bind="disable: Locked">											
												<div class="form-group" data-bind="css: { 'has-error' : Title.hasError, 'has-success' : !Title.hasError() && Title() }">
													<label class="col-sm-2 control-label">Ответ</label>
													<div class="col-sm-10">
														<input type="text" class="form-control" placeholder="Ответ кратко" data-bind="value: Title">
														<span class="small text-danger" data-bind="text: Title.validationMessage(), visible: Title.validationMessage()"></span>
													</div>
												</div>
												<div class="form-group" data-bind="css: { 'has-error' : Description.hasError, 'has-success' : !Description.hasError() && Description() }">
													<label class="col-sm-2 control-label">Описание</label>
													<div class="col-sm-10">
														<textarea rows="2" class="form-control" placeholder="Поясняющий комментарий" data-bind="value: Description"></textarea>
														<span class="small text-danger" data-bind="text: Description.validationMessage(), visible: Description.validationMessage()"></span>
													</div>
												</div>		
											</fieldset>			
										</form>	
										<div data-bind="visible: !Editing()">
											<h4 data-bind="text: Title"></h4>
											<p data-bind="text: Description"></p>
										</div>
									</div>	
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div data-bind="visible: Step() == 2">
					<button class="btn btn-default" data-bind="click: addMainAnswer, disable: MainAnswerList.Locked()">
						<span class="glyphicon glyphicon-plus"></span> Добавить ответ  
					</button>		

					<button class="btn btn-primary" data-bind="click: applyMainAnswers, disable: MainAnswerList.Locked() || MainAnswerList().some(function(item){ return item.Title.hasError() || item.Description.hasError(); })">
						Далее <span class="glyphicon glyphicon-chevron-right"></span>
					</button>								
				</div>
			</div>		
		</div>
	</div>	
	<!-- /Основные ответы -->
	
	<!-- Наводящие вопросы -->		
	<div class="panel panel-primary" data-bind="visible: Step() > 2, css: Step() == 3 ? 'panel-primary' : 'panel-default'">
		<div class="panel-heading">
			<h3 class="panel-title">Наводящие вопросы с ответами</h3>
		</div>
		<div class="panel-body">
			<div> 
				<p>Наводящие вопросы, которые помогут человеку найти ответ на основной вопрос.</p>
			</div>
			<div data-bind="foreach: SecondQuestionList">
				<!-- ko if: $root.SecondQuestionIdx() != $index() -->
					<p>					
						<span class="label label-default" data-bind="text: ($index() + 1) + ')'"></span> 
						<span data-bind="text: Title"></span>
					</p>
				<!-- /ko -->
			</div>			
			<div data-bind="foreach: SecondQuestionList, visible: Step() == 3">
				<!-- ko if: $root.SecondQuestionIdx() == $index() -->				
					<div>	
						<div class="row">
							<div class="col-sm-1">
								<span class="label label-primary" data-bind="text: ($index() + 1) + ')'"></span>
							</div>
							<div class="col-sm-11">
								<form class="form-horizontal" role="form" data-bind="visible: Editing()">
									<fieldset data-bind="disable: Locked">
										<div class="form-group" data-bind="css: { 'has-error' : Title.hasError, 'has-success' : !Title.hasError() && Title() }">
											<label class="col-sm-2 control-label">Вопрос</label>
											<div class="col-sm-10">
												<input type="text" class="form-control" placeholder="Наводящий вопрос кратко" data-bind="value: Title">
												<span class="small text-danger" data-bind="text: Title.validationMessage(), visible: Title.validationMessage()"></span>
											</div>
										</div>
										<div class="form-group" data-bind="css: { 'has-error' : Description.hasError, 'has-success' : !Description.hasError() && Description() }">
											<label class="col-sm-2 control-label">Описание</label>
											<div class="col-sm-10">												
												<textarea rows="5" class="form-control" placeholder="Поясняющий комментарий" data-bind="value: Description"></textarea>
												<span class="small text-danger" data-bind="text: Description.validationMessage(), visible: Description.validationMessage()"></span>
											</div>
										</div>	
									</fieldset>							
								</form>									
							
								<table class="table table-striped table-bordered" data-bind="visible: Title()">				
									<thead>
										<tr>
											<th class="col-xs-1 text-center">№</th>
											<th class="col-xs-6 text-center">Ответ на наводящий вопрос</th>
											<th class="col-xs-5 text-center">Приводит к ответу</th>
										</tr>
									</thead>				
									<tbody data-bind="foreach: SecondAnswers">
										<tr>
											<td class="text-center">
												<span data-bind="text: $index() + 1"></span>
											</td>
											<td>
												<form class="form-horizontal" role="form" data-bind="visible: Editing()">
													<fieldset data-bind="disable: Locked">													
														<div class="form-group">
															<div class="col-sm-12" data-bind="css: { 'has-error' : Title.hasError, 'has-success' : !Title.hasError() && Title() }">
																<input type="text" class="form-control" placeholder="Ответ на наводящий вопрос" data-bind="value: Title">
																<span class="small text-danger" data-bind="text: Title.validationMessage(), visible: Title.validationMessage()"></span>
															</div>
														</div>
														<div class="form-group" data-bind="css: { 'has-error' : Description.hasError, 'has-success' : !Description.hasError() && Description() }">
															<div class="col-sm-12">
																<textarea rows="2" class="form-control" placeholder="Поясняющий комментарий" data-bind="value: Description"></textarea>
																<span class="small text-danger" data-bind="text: Description.validationMessage(), visible: Description.validationMessage()"></span>
															</div>
														</div>	
													</fieldset>
												</form>	
												<div data-bind="visible: !Editing()">
													<h4 data-bind="text: Title"></h4>
													<p data-bind="text: Description"></p>
												</div>
											</td>
											<td>
												<form role="form">
													<fieldset data-bind="disable: Locked">		
														<div class="form-group" data-bind="css: { 'has-error' : MainAnswers.hasError, 'has-success' : !MainAnswers.hasError() }">
															<select class="form-control" data-bind="options: $root.MainAnswerList, selectedOptions: MainAnswers, optionsText: 'Title', attr: { size: $root.MainAnswerList().length } " multiple="true"></select>
															<span class="small text-danger" data-bind="text: MainAnswers.validationMessage(), visible: MainAnswers.validationMessage()"></span>
															<p class="text-muted small">Удерживайте <strong>Ctrl</strong> для множественного выделения</p>														
														</div>
													</fieldset>
												</form>					
											</td>
										</tr>						
									</tbody>
									<tfoot>
										<tr>
											<td colspan="3">
												<button class="btn btn-default" data-bind="click: $root.addSecondAnswer">
													<span class="glyphicon glyphicon-plus"></span> Добавить ответ 
												</button>		
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</div>
					<div>
						<p>Всего наводящих вопросов: <span data-bind="text: $root.SecondQuestionList().length"></span></p>
					</div>
					<div data-bind="visible: $root.Step() == 3">
						<button class="btn btn-primary" data-bind="disable: Title.hasError() || SecondAnswers().some(function(item){ return item.Title.hasError() || item.Description.hasError() || item.MainAnswers.hasError(); }), click: function(model) { $root.applySecondQuestion(model, true); }">
							<span class="glyphicon glyphicon-plus"></span> Ещё наводящий вопрос 
						</button>
						<button class="btn btn-success" data-bind="disable: Title.hasError() || SecondAnswers().some(function(item){ return item.Title.hasError() || item.Description.hasError() || item.MainAnswers.hasError(); }), click: function(model) { $root.applySecondQuestion(model); }">
							<span class="glyphicon glyphicon-ok"></span> Готово!
						</button>						
					</div>	
				<!-- /ko -->									
			</div>					
		</div>
	</div>	
	<!-- /Наводящие вопросы -->	

	<!-- Последний экран -->		
	<div class="panel panel-success" data-bind="visible: Step() == 4">
		<div class="panel-heading">
			<h3 class="panel-title">Решение создано</h3>
		</div>
		<div class="panel-body">
			<div> 
				<p>Поздравляем, решение успешно создано!</p>
				<a href="#" class="btn btn-success" data-bind="attr: { href: '/question/' + MainQuestion().Id() }">
					Проверить
				</a>								
			</div>		
		</div>
	</div>	
	<!-- /Последний экран -->	

{/block}

{block 'scripts'}
<script type="text/javascript">
	$(document).ready(function () {
		CreateTestVM = new Hinter.CreateTestVM();
		CreateTestVM.bind();
	});
</script>
{/block}
