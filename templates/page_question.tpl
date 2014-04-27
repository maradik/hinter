{extends 'page.tpl'}

{block 'title'}{$mainQuestion->title|truncate:100:'...'|e:'HTML'} | HintOk{/block}

{block 'content'}
	
	<div>
		<div class="panel" data-bind="css: CurrentSecQuestion() == 0 ? 'panel-primary' : 'panel-default'">
			<div class="panel-heading">
				<h3 class="panel-title"><span class="glyphicon glyphicon-question-sign"></span> Решается вопрос</h3>
			</div>
			<div class="panel-body">
				<div>		
					<h1>{$mainQuestion->title|e:'HTML'}</h1>
					<div class="multiline">{$mainQuestion->description|e:'HTML'}</div>	
				</div>
			</div>
			<div class="panel-footer" data-bind="visible: CurrentSecQuestion() == 0">				
				<div class="row">
					<div class="col-md-12">
						<p><small>Чтобы узнать ответ, придется ответить на несколько наводящих вопросов.</small></p>
						<button class="btn btn-primary" data-bind="click: $root.start, enable: MainAnswerList().length != 0">
							Узнать ответ прямо сейчас!
						</button>							
					</div>
				</div>					
			</div>
		</div>				
		
		<div class="panel panel-success" data-bind="visible: Finish">
			<div class="panel-heading">
				<h3 class="panel-title"><span class="glyphicon glyphicon-ok-sign"></span> Оптимальный вариант</h3>
			</div>
			<div class="panel-body" data-bind="with: MainAnswerList()[0]">	
				<h3 data-bind="text: Title"></h3>
				<div class="multiline" data-bind="text: Description"></div>
			</div>
			<div class="panel-footer">				
				<button class="btn btn-success btn-sm" data-bind="click: $root.start">
					<span class="glyphicon glyphicon-repeat"></span> Повторить
				</button>						
			</div>			
		</div>	

		<div data-bind="visible: CurrentSecQuestion() && !Finish()">
			<div class="progress" data-bind="visible: CurrentSecQuestion() && !Finish()">
				<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="" data-bind="text: getProgress() + '%', style: { width: getProgress() + '%' }">				
				</div>
			</div>		
		</div>	
		
		<div class="alert alert-info" data-bind="visible: CurrentSecQuestion() && !Finish()">
			<div class="row" data-bind="if: SecondQuestion">
				<div class="col-md-7">
					<div data-bind="with: SecondQuestion">
						<h3><span data-bind="text: $parent.CurrentSecQuestion"></span>. <span data-bind="text: Title"></span></h3>
						<div class="multiline" data-bind="text: Description"></div>		
					</div>
				</div>
				<div class="col-md-5">
					<p>Выберите ответ:</p>
					<div class="list-group" data-bind="foreach: SecondAnswerList">
						<a href="#" class="list-group-item" data-bind="click: $root.nextQuestion">
							<h4 class="list-group-item-heading" data-bind="text: Title"></h4>
							<p class="list-group-item-text" data-bind="text: Description"></p>
						</a>
					</div>

					<!--
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
					-->
				</div>				
			</div>		
		</div>					
		
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title"><span class="glyphicon glyphicon-info-sign"></span> Возможные варианты</h3>
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
