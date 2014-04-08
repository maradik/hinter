{extends 'base.tpl'}

{block 'content'}
	
	<div>
		<div class="panel" data-bind="css: CurrentSecQuestion() == 0 ? 'panel-primary' : 'panel-default'">
			<div class="panel-heading">
				<h3 class="panel-title">Решается вопрос</h3>
			</div>
			<div class="panel-body">
				<div>		
					<h1>{$mainQuestion->title|e:'HTML'}</h1>
					<p>{$mainQuestion->description|e:'HTML'}</p>	
				</div>
				
				<div data-bind="visible: CurrentSecQuestion() == 0">
					<div class="row">
						<div class="col-md-12">
							<p>Чтобы узнать ответ, придется ответить на несколько наводящих вопросов.</p>
							<button class="btn btn-primary btn-lg" data-bind="click: $root.start, enable: MainAnswerList().length != 0">
								Далее <span class="glyphicon glyphicon-chevron-right"></span>
							</button>							
						</div>
					</div>					
				</div>	
			</div>
		</div>				
		
		<div class="panel panel-success" data-bind="visible: Finish">
			<div class="panel-heading">
				<h3 class="panel-title">Подходящий вариант</h3>
			</div>
			<div class="panel-body" data-bind="with: MainAnswerList()[0]">	
				<h3 data-bind="text: Title"></h3>
				<p data-bind="text: Description"></p>
				<button class="btn btn-success btn-sm" data-bind="click: $root.start">
					<span class="glyphicon glyphicon-repeat"></span> Повторить
				</button>
			</div>
		</div>	
		
		<div class="alert alert-info" data-bind="visible: CurrentSecQuestion() && !Finish()">
			<div class="row" data-bind="if: SecondQuestion">
				<div class="col-md-7">
					<div data-bind="with: SecondQuestion">
						<h3><span data-bind="text: $parent.CurrentSecQuestion"></span>. <span data-bind="text: Title"></span></h3>
						<p data-bind="text: Description"></p>		
					</div>
					<div class="progress" data-bind="visible: CurrentSecQuestion() && !Finish()">
						<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="" data-bind="text: getProgress() + '%', style: { width: getProgress() + '%' }">				
						</div>
					</div>									
				</div>
				<div class="col-md-5">
					<div class="panel panel-primary">
						<div class="panel-heading">
							<h3 class="panel-title">Выберите ответ:</h3>
						</div>
						<div class="panel-body">		
							<div data-bind="visible: SecondAnswerList().length > 0">			
								<ul class="nav nav-pills nav-stacked" data-bind="foreach: SecondAnswerList">
									<li>
										<a href="#" data-bind="text: Title, click: $root.nextQuestion"></a>
									</li>
								</ul>
							</div>
							<div data-bind="visible: SecondAnswerList().length == 0">	
								Загрузка...
							</div>			
						</div>
					</div>	
				</div>				
			</div>		
		</div>					
		
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">Возможные варианты</h3>
			</div>
			<div class="panel-body">		
				<div data-bind="if: MainAnswerList().length > 0">
					<ol data-bind="foreach: MainAnswerList">
						<li data-bind="text: Title"></li>
					</ol>				
				</div>
				<div data-bind="if: MainAnswerList().length == 0">
					Загрузка...
				</div>					
			</div>
		</div>							
	</div>

{/block}

{block 'scripts'}
<script type="text/javascript">
	$(document).ready(function () {
		PassTestVM = new Hinter.PassTestVM({$mainQuestion->id});
		PassTestVM.bind();
	});
</script>
{/block}
