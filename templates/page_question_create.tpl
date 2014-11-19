{extends 'page.tpl'}

{block 'title'}{if (empty($mainQuestionId))}Создание новой{else}Редактирование{/if} подсказки | HintOk{/block}

{block 'content'}
	<!--
	<div class="row">
		<div class="col-md-12">
			<h1>Новая подсказка</h1>
		</div>		
	</div>
	-->
	<h1>{if (empty($mainQuestionId))}Создание{else}Редактирование{/if} подсказки</h1>

	<!-- Первый экран -->		
	<div class="panel panel-primary" data-bind="visible: Step() == 0 && !EditMode()">
		<div class="panel-heading">
			<h3 class="panel-title">Создание подсказки</h3>
		</div>
		<div class="panel-body">
			<div> 
				<div class="alert alert-success">
					<p>Процесс создания новой подсказки состоит из нескольких шагов:</p>
					<ul>
						<li>Создание основного вопроса</li>
						<li>Создание ответов на основной вопрос</li>
						<li>Создание вспомогательных вопросов</li>
						<li>Создание ответов на вспомогательные вопросы</li>
						<li>Настройка связей между вспомогательными и основными ответами</li>
					</ul>
				</div>
				<div class="alert alert-danger">
					<p>Запрещено публиковать:</p>
					<ul>
						<li>Спам и спамные ссылки</li>
						<li>Бессмысленный тест, не имеющий логики</li>
						<li>Текст с множеством орфографических и пунктуационных ошибок</li>
					</ul>
					<p>Все подсказки перед публикацией проверяются администратором!</p>
				</div>
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
									<select class="form-control" id="selectMainQuestionCategory" data-bind="options: $root.CategoryList, value: CategoryId, optionsText: 'Title', optionsValue: 'Id', optionsCaption: 'Выберите категорию', valueAllowUnset: true"></select>
									<span class="small text-danger" data-bind="text: CategoryId.validationMessage(), visible: CategoryId.validationMessage()"></span>									
								</div>
							</div>	
							<div class="form-group" data-bind="css: { 'has-success' : Images().length }">
								<label class="col-sm-2 control-label">Изображение</label>
								<div class="col-sm-10">
									<div class="row">
										<!-- ko foreach: Images -->
											<div class="col-xs-2">
												<a href="#" target="_blank" class="thumbnail thumbnail-delete top10" data-bind="click: $root.removeImage.bind($data, $parent)">
													<img src="#" title="Удалить изображение" data-bind="attr: { src: UrlMiddle, alt: Title }">
												</a>
											</div>
										<!-- /ko -->
										<div class="col-xs-2">
											<button class="btn btn-default btn-sm top10" title="Загрузить изображение" data-bind="click: function(){ document.getElementById('MainQuestionImage').click(); }, disable: Locked() || ((Title.hasError() || CategoryId.hasError() || Description.hasError()) && !Id()), visible: Images().length < $root.maxImagesMQ()">
												<span class="visible-lg">Загрузить <span class="glyphicon glyphicon-picture"></span></span>
												<span class="hidden-lg">Загр. <span class="glyphicon glyphicon-picture"></span></span>
											</button>	
											<input id="MainQuestionImage" type="file" class="file-upload" data-bind="event: { change: function(m, e){ $root.addMainQuestionImage(m, e, $element.files[0]); } }">
										</div>										
									</div>
								</div>
							</div>										
						</fieldset>
						<fieldset data-bind="disable: Locked()">
							<button class="btn btn-danger btn-sm" data-bind="click: $root.removeMainQuestion, visible: $root.EditMode()">
								<span class="glyphicon glyphicon-remove"></span> Удалить
							</button>								
							<button class="btn btn-primary" data-bind="click: $root.saveMainQuestion, disable: Title.hasError() || CategoryId.hasError() || Description.hasError()">
								Далее <span class="glyphicon glyphicon-chevron-right"></span>
							</button>
							<div class="top10" data-bind="visible: Title.hasError() || CategoryId.hasError() || Description.hasError(), template: { name: 'tpl_haserror' }"></div>
						</fieldset>							
					</form>		
				</div>		
				<div class="row" data-bind="visible: !Editing()">
					<div data-bind="css: Images().length == 1 ? 'col-sm-8' : 'col-sm-12'">
						<h2 data-bind="text: Title" class="top10"></h2>
						<div class="multiline" data-bind="text: Description"></div>
						<div class="top10" data-bind="with: $root.CategoryList.findById(CategoryId())">
							<div class="label label-info">
								<span class="glyphicon glyphicon-folder-open"></span> <span data-bind="text: Title"></span>
							</div>
						</div>	
					</div>		
					<!-- ko foreach: Images -->
						<div class="text-center" data-bind="css: $root.MainQuestion().Images().length == 1 ? 'col-xs-3 col-sm-4' : 'col-xs-3 col-sm-2'">
							<!-- ko template: { name: 'thumbnails' } -->
							<!-- /ko -->
						</div>			
					<!-- /ko -->
				</div>														
			</div>		
		</div>
	</div>	
	<!-- /Основной вопрос -->

	<!-- Основные ответы -->		
	<div class="panel panel-primary" data-bind="visibleAndScroll: { visible: Step() > 1, offset: -10 }, css: Step() == 2 ? 'panel-primary' : 'panel-default'">
		<div class="panel-heading">
			<h3 class="panel-title">Возможные варианты ответа</h3>
		</div>
		<div class="panel-body">
			<div> 
				<p data-bind="visible: Step() == 2">Возможные варианты ответа на основной вопрос.</p>
				<table class="table table-striped">								
					<tbody>
						<tr data-bind="visible: MainAnswerList.Loading()">
							<td colspan="2" data-bind="template: { name: 'tpl_loading' }">
							</td>
						</tr>
						<!-- ko foreach: MainAnswerList -->							
						<tr>
							<td class="col-xs-1">
								<div class="toppad10">
									<span class="label label-default" data-bind="text: ($index() + 1) + ')'"></span>									
								</div>
							</td>
							<td class="col-xs-11">
								<div class="row">
									<div class="col-md-12">									
										<form class="form-horizontal" role="form" data-bind="visible: Editing(), disable: Locked">
											<fieldset>											
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
														<textarea rows="4" class="form-control" placeholder="Поясняющий комментарий" data-bind="value: Description"></textarea>
														<span class="small text-danger" data-bind="text: Description.validationMessage(), visible: Description.validationMessage()"></span>
													</div>
												</div>	
												<div class="form-group" data-bind="css: { 'has-error' : LinkUrl.hasError, 'has-success' : !LinkUrl.hasError() && LinkUrl() }">
													<label class="col-sm-2 control-label">Ссылка на источник</label>
													<div class="col-sm-10">
														<input type="text" class="form-control" placeholder="http://site.com" data-bind="value: LinkUrl">
														<span class="small text-danger" data-bind="text: LinkUrl.validationMessage(), visible: LinkUrl.validationMessage()"></span>
													</div>
												</div>	
												<div class="form-group" data-bind="css: { 'has-error' : LinkTitle.hasError, 'has-success' : !LinkTitle.hasError() && LinkTitle() }">
													<label class="col-sm-2 control-label">Заголовок ссылки</label>
													<div class="col-sm-10">
														<input type="text" class="form-control" placeholder="Кратко текст ссылки" data-bind="value: LinkTitle, disable: !LinkUrl()">
														<span class="small text-danger" data-bind="text: LinkTitle.validationMessage(), visible: LinkUrl() && LinkTitle.validationMessage()"></span>
													</div>
												</div>	
												<div class="form-group" data-bind="css: { 'has-success' : Images().length }">
													<label class="col-sm-2 control-label">Изображение</label>
													<div class="col-sm-10">
														<div class="row">
															<!-- ko foreach: Images -->
																<div class="col-xs-2">
																	<a href="#" target="_blank" class="thumbnail thumbnail-delete top10" data-bind="click: $root.removeImage.bind($data, $parent)">
																		<img src="#" title="Удалить изображение" data-bind="attr: { src: UrlMiddle, alt: Title }">
																	</a>
																</div>
															<!-- /ko -->
															<div class="col-xs-2">
																<button class="btn btn-default btn-sm top10" title="Загрузить изображение" data-bind="click: function(){ document.getElementById('MainAnswerImage' + $index()).click(); }, disable: Locked() || ((Title.hasError() || Description.hasError() || LinkTitle.hasError() || LinkUrl.hasError()) && !Id()), visible: Images().length < $root.maxImagesMA()">
																	<span class="visible-lg">Загрузить <span class="glyphicon glyphicon-picture"></span></span>
																	<span class="hidden-lg">Загр. <span class="glyphicon glyphicon-picture"></span></span>
																</button>	
																<input id="MainAnswerImage" type="file" class="file-upload" data-bind="event: { change: function(m, e){ $root.addMainAnswerImage(m, e, $element.files[0]); } }, attr: { id: 'MainAnswerImage' + $index() }">
															</div>										
														</div>
													</div>
												</div>	
												<div>
													<button class="btn btn-danger btn-sm" data-bind="click: function() { $root.MainAnswerList.removeModel($data, undefined, undefined, true); }, disable: Locked()">
														<span class="glyphicon glyphicon-remove"></span> Удалить ответ
													</button>
												</div>																																				
											</fieldset>
										</form>	
										<div class="row" data-bind="visible: !Editing()">
											<div data-bind="css: Images().length ? 'col-sm-9' : 'col-sm-12'">
												<h4 class="top10">
													<span data-bind="text: Title"></span> 
													<span data-bind="visible: $root.Step() == 2 && !Locked()">
														<span data-bind="template: { name: 'tpl_edit' }"></span>
														<a href="#" class="text-danger" title="Удалить" data-bind="click: function(model){ $root.MainAnswerList.removeModel(model, undefined, undefined, true); }"><span class="glyphicon glyphicon-remove"></span></a>
													</span>
												</h4>
												<div class="multiline" data-bind="text: Description"></div>
											</div>
											<div class="text-center" data-bind="css: Images().length ? 'col-xs-3 col-sm-3' : '', visible: Images().length">
												<div data-bind="with: Images()[0]">
													<!-- ko template: { name: 'thumbnails' } -->
													<!-- /ko -->
												</div>
											</div>											
										</div>
									</div>	
								</div>
							</td>
						</tr>
						<!-- /ko -->
					</tbody>
				</table>
				<div data-bind="visible: Step() == 2">
					<button class="btn btn-default" data-bind="click: addMainAnswer, disable: MainAnswerList.Locked() || MainAnswerList.Loading()">
						<span class="glyphicon glyphicon-plus"></span> Добавить ответ  
					</button>		
					<button class="btn btn-primary" data-bind="click: applyMainAnswers, disable: !MainAnswerList().length || MainAnswerList.Locked() || MainAnswerList.Loading() || MainAnswerList().filter(function(item){ return item.Editing(); }).some(function(item){ return item.Title.hasError() || item.Description.hasError() || item.LinkTitle.hasError() || item.LinkUrl.hasError(); })">
						Далее <span class="glyphicon glyphicon-chevron-right"></span>
					</button>	
					<div class="top10" data-bind="visible: MainAnswerList().filter(function(item){ return item.Editing(); }).some(function(item){ return item.Title.hasError() || item.Description.hasError() || item.LinkTitle.hasError() || item.LinkUrl.hasError(); }), template: { name: 'tpl_haserror' }"></div>			
				</div>
			</div>		
		</div>
	</div>	
	<!-- /Основные ответы -->
	
	<!-- Наводящие вопросы -->		
	<div class="panel panel-primary" data-bind="visibleAndScroll: { visible: Step() > 2, offset: -10 }, css: Step() == 3 ? 'panel-primary' : 'panel-default'">
		<div class="panel-heading">
			<h3 class="panel-title">Наводящие вопросы с ответами</h3>
		</div>
		<div class="panel-body">
			<div> 
				<p>Наводящие вопросы, которые помогут человеку найти ответ на основной вопрос.</p>
			</div>
			<div data-bind="visible: SecondQuestionList.Loading()">
				<span data-bind="template: { name: 'tpl_loading' }"></span>
			</div>
			<div data-bind="foreach: SecondQuestionList, visible: Step() != 3">
				<!-- ko if: $root.SecondQuestionIdx() != $index() -->
					<p>					
						<span class="label label-default" data-bind="text: ($index() + 1) + ')'"></span> 
						<span data-bind="text: Title"></span> 
					</p>
				<!-- /ko -->
			</div>			
			<div data-bind="foreach: SecondQuestionList, visible: Step() == 3">
				<!-- ko if: $root.SecondQuestionIdx() != $index() -->
					<div>
						<p>			
							<span class="label label-default" data-bind="text: ($index() + 1) + ')'"></span> 
							<span data-bind="text: Title"></span> 
							<span data-bind="visible: $root.Step() == 3 && !Locked()">
								<span data-bind="template: { name: 'tpl_edit' }"></span>
								<a href="#" class="text-danger" title="Удалить" data-bind="click: function(model){ $root.SecondQuestionList.removeModel(model, undefined, undefined, true); }"><span class="glyphicon glyphicon-remove"></span></a>
							</span>
						</p>		
					</div>
				<!-- /ko -->				
				<!-- ko if: $root.SecondQuestionIdx() == $index() -->				
					<div class="well well-sm">	
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
							
								<table class="table table-bordered" style="background-color: white;" data-bind="visible: Title()">				
									<thead>
										<tr>
											<th class="col-xs-1 text-center">№</th>
											<th class="col-xs-6 text-center">Ответ на наводящий вопрос</th>
											<th class="col-xs-5 text-center">Приводит к ответу</th>
										</tr>
									</thead>				
									<tbody>
										<tr data-bind="visible: SecondAnswers.Loading()"><td colspan="3" data-bind="template: { name: 'tpl_loading' }"></td></tr>
										<!-- ko foreach: SecondAnswers -->
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
														<div>
															<button class="btn btn-danger btn-sm" data-bind="click: function() { $parent.SecondAnswers.removeModel($data, undefined, undefined, true); }, disable: Locked()">
																<span class="glyphicon glyphicon-remove"></span> Удалить ответ
															</button>
														</div>															
													</fieldset>
												</form>	
												<div data-bind="visible: !Editing()">
													<h4 class="top0">
														<span data-bind="text: Title"></span>
														<span data-bind="visible: $root.Step() == 3 && !Locked()">
															<span data-bind="template: { name: 'tpl_edit' }"></span>
															<a href="#" class="text-danger" title="Удалить" data-bind="click: function(model){ $parent.SecondAnswers.removeModel(model, undefined, undefined, true); }"><span class="glyphicon glyphicon-remove"></span></a>
														</span>
													</h4>
													<div class="multiline" data-bind="text: Description, visible: Description()"></div>
												</div>
											</td>
											<td>
												<form role="form" data-bind="visible: Editing()">
													<fieldset data-bind="disable: Locked">		
														<div class="form-group" data-bind="css: { 'has-error' : MainAnswers.hasError, 'has-success' : !MainAnswers.hasError() }">
															<select class="form-control" data-bind="options: $root.MainAnswerList, selectedOptions: MainAnswers, optionsText: 'Title', attr: { size: $root.MainAnswerList().length }, valueAllowUnset: true " multiple="true"></select>
															<span class="small text-danger" data-bind="text: MainAnswers.validationMessage(), visible: MainAnswers.validationMessage()"></span>
															<p class="text-muted small">Удерживайте <strong>Ctrl</strong> для множественного выделения</p>														
														</div>
													</fieldset>
												</form>		
												<div data-bind="visible: !Editing()">
													<span colspan="3" data-bind="template: { name: 'tpl_loading' }, visible: MainAnswers.Loading()"></span>
													<ul data-bind="foreach: MainAnswers">
														<li data-bind="text: Title()"></li>
													</ul>
												</div>															
											</td>
										</tr>	
										<!-- /ko -->					
									</tbody>
								</table>
								<div data-bind="visible: Editing() && Title()">
									<button class="btn btn-default btn-sm" data-bind="click: $root.addSecondAnswer">
										<span class="glyphicon glyphicon-plus"></span> Добавить ответ 
									</button>	
									<button class="btn btn-danger btn-sm" title="Удалить наводящий вопрос с ответами" data-bind="click: $root.removeSecondQuestion, disable: Locked()">
										<span class="glyphicon glyphicon-remove"></span> Удалить вопрос
									</button>									
									<button class="btn btn-primary btn-sm" title="Сохранить наводящий вопрос с ответами"  data-bind="disable: !SecondAnswers().length || Title.hasError() || SecondAnswers().filter(function(item){ return item.Editing(); }).some(function(item){ return item.Title.hasError() || item.Description.hasError() || item.MainAnswers.hasError(); }), click: function(model) { $root.saveSecondQuestion(model, function() { self.SecondQuestionIdx(-1); } ); }">
										<span class="glyphicon glyphicon-floppy-disk"></span> Сохранить вопрос
									</button>	
								</div>							
							</div>
						</div>
					</div>
				<!-- /ko -->
			</div>
			<div class="top10">
				<p><strong>Всего наводящих вопросов: <span data-bind="text: $root.SecondQuestionList().length"></span></strong></p>
			</div>			
			<div data-bind="visible: $root.Step() == 3">
				<button class="btn btn-primary" data-bind="disable: SecondQuestionList.Locked() || (curSecondQuestion() && (curSecondQuestion().Title.hasError() || curSecondQuestion().Description.hasError() || curSecondQuestion().SecondAnswers().filter(function(item){ return item.Editing(); }).some(function(item){ return item.Title.hasError() || item.Description.hasError() || item.MainAnswers.hasError(); }))), click: function(){ applySecondQuestion(curSecondQuestion(), true); }">
					<span class="glyphicon glyphicon-plus"></span> Добавить наводящий вопрос 
				</button>
				<button class="btn btn-success" data-bind="disable: SecondQuestionList.Locked() || !$root.SecondQuestionList().length || (curSecondQuestion() && (curSecondQuestion().Title.hasError() || curSecondQuestion().Description.hasError() || curSecondQuestion().SecondAnswers().filter(function(item){ return item.Editing(); }).some(function(item){ return item.Title.hasError() || item.Description.hasError() || item.MainAnswers.hasError(); }))), click: function(){ applySecondQuestion(curSecondQuestion()); }">
					<span class="glyphicon glyphicon-ok"></span> Готово!
				</button>			
				<div class="top10" data-bind="visible: !$root.SecondQuestionList.Loading() && (!$root.SecondQuestionList().length || (curSecondQuestion() && (curSecondQuestion().Title.hasError() || curSecondQuestion().Description.hasError() || curSecondQuestion().SecondAnswers().filter(function(item){ return item.Editing(); }).some(function(item){ return item.Title.hasError() || item.Description.hasError() || item.MainAnswers.hasError(); })))), template: { name: 'tpl_haserror' }"></div>			
			</div>								
		</div>
	</div>	
	<!-- /Наводящие вопросы -->	

	<!-- Последний экран -->		
	<div class="panel panel-success" data-bind="visibleAndScroll: { visible: Step() == 4, offset: -10 }">
		<div class="panel-heading">
			<h3 class="panel-title">Подсказка создана</h3>
		</div>
		<div class="panel-body">
			<div> 
				<p>Поздравляем, подсказка успешно создана!</p>
				<p>Она появится в общем списке после проверки администратором.</p>
				<a href="#" class="btn btn-default btn-sm" data-bind="attr: { href: '/question/' + MainQuestion().Id() + '/edit' }">
					<span class="glyphicon glyphicon-pencil"></span> Изменить
				</a>
				<a href="#" class="btn btn-success" data-bind="attr: { href: '/question/' + MainQuestion().Id() }">
					<span class="glyphicon glyphicon-play"></span> Посмотреть!
				</a>								
			</div>		
		</div>
	</div>	
	<!-- /Последний экран -->	

	<script type="text/html" id="thumbnails">
		<a href="#" target="_blank" class="thumbnail top10" data-bind="thumbnail: { src: UrlData, title: Title }">
			<img src="#" data-bind="attr: { src: UrlMiddle, title: Title, alt: Title }">
		</a>
	</script>
	
	<script type="text/html" id="tpl_loading">
		<img src="/uploads/loading2.gif" alt="Загрузка..." title="Загрузка..." />
	</script>
	
	<script type="text/html" id="tpl_edit">
		<a href="#" class="text-default" title="Редактировать" data-bind="click: function(model){ String(model.constructor).match(/^function\ +SecondQuestion/) != null ? $root.editSecondQuestion(model) : model.Editing(true); }"><span class="glyphicon glyphicon-pencil"></span></a>
	</script>
	
	<script type="text/html" id="tpl_haserror">
		<span class="label label-danger"><span class="glyphicon glyphicon-exclamation-sign"></span> Проверьте заполнение полей, есть ошибки!</span>
	</script>	
{/block}

{block 'scripts'}
<script type="text/javascript">
	$(document).ready(function () {
		CreateTestVM = new Hinter.CreateTestVM();	
		CreateTestVM.bind(
			{if (!empty($mainQuestionId))}{$mainQuestionId}{/if}
		);					
	});
</script>
{/block}
