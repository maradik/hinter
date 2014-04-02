{extends 'base.tpl'}

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
				<button class="btn btn-primary btn-lg" data-bind="click: nextStep">
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
			<div> 
				<p>Основной вопрос, на который пользователь ищет ответ.</p>
				<form class="form-horizontal" role="form" data-bind="with: MainQuestion">
					<div class="form-group">
						<label for="inputMainQuestionTitle" class="col-sm-2 control-label">Вопрос</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="inputMainQuestionTitle" placeholder="Текст вопроса" data-bind="value: Title, visible: Editing">
							<span data-bind="text: Title, visible: !Editing()"></span>
						</div>
					</div>
					<div class="form-group">
						<label for="inputMainQuestionDescription" class="col-sm-2 control-label">Описание</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="inputMainQuestionDescription" placeholder="Поясняющий комментарий" data-bind="value: Description, visible: Editing">
							<span data-bind="text: Description, visible: !Editing()"></span>
						</div>
					</div>					
					<div class="form-group">
						<label for="selectMainQuestionCategory" class="col-sm-2 control-label">Категория</label>
						<div class="col-sm-10">
							<select class="form-control" id="selectMainQuestionCategory" data-bind="options: $root.CategoryList, value: CategoryId, visible: Editing, optionsText: 'Title', optionsValue: 'Id', optionsCaption: 'Выберите категорию'"></select>
							<span data-bind="text: CategoryId, visible: !Editing()"></span>
						</div>
					</div>	
					<div class="col-sm-offset-2 col-sm-10">
						<button class="btn btn-primary btn-lg" data-bind="click: $root.nextStep, visible: $root.Step() == 1">
							Сохранить
						</button>
					</div>
				</form>																		
			</div>		
		</div>
	</div>	
	<!-- /Основной вопрос -->

{/block}

{block 'scripts'}
<script type="text/javascript">
	CreateTestVM = new Hinter.CreateTestVM();
	CreateTestVM.bind();
</script>
{/block}
