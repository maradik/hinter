{extends 'page.tpl'}

{block 'title'}{$mainQuestion->title|truncate:100:'...'|e:'HTML'} | HintOk{/block}
{block 'meta_title'}{$mainQuestion->title|truncate:100:'...'|e:'HTML'}{/block}
{block 'meta_description'}{$mainQuestion->description|truncate:150:'...'|e:'HTML'}{/block}

{block 'content'}
	<div>
		<div class="panel" data-bind="css: CurrentSecQuestion() == 0 ? 'panel-primary' : 'panel-default'"> 
			<div class="panel-heading">
				<h3 class="panel-title"><span class="glyphicon glyphicon-question-sign"></span> Решается вопрос</h3>
			</div>
			<div class="panel-body" data-bind="with: MainQuestion">
				<h1>{$mainQuestion->title|e:'HTML'}</h1>
				<div class="row">
					<div class="col-sm-12" data-bind="css: Images().length ? 'col-sm-8' : 'col-sm-12'">		
						{if !empty($mainQuestion->description)}
							<div class="multiline">{$mainQuestion->description|e:'HTML'}</div>
						{/if}						
						<div class="row top20">
							<div class="col-xs-6">
								<div class="row">
									<div class="col-lg-4 col-xs-6">
										<span class="label label-default" title="Дата создания">
											<span class="glyphicon glyphicon-file"></span> <span data-bind="text: CreateDate.dateToStr()"></span>
										</span>
									</div>				
									<div class="col-xs-12 hidden-lg">&nbsp;</div>			
									<div class="col-lg-8 col-xs-12" data-bind="with: $root.CategoryList.findById(CategoryId())">
										<a href="#" class="label label-info" data-bind="attr: { href: '/category/' + Id(), title: Description.truncatedText(50) }">
											<span class="glyphicon glyphicon-folder-open"></span>&nbsp;&nbsp;<span data-bind="text: Title"></span>
										</a>
									</div>
								</div>
							</div>
							<!-- ko foreach: Images -->
								<!-- ko if: $index() < 3 -->
									<div class="text-center col-xs-3" data-bind="css: { 'visible-xs': $index() < 2, 'visible-sm visible-md visible-lg': $index() != 0 }">
										<!-- ko template: { name: 'thumbnails' } -->
										<!-- /ko -->
									</div>		
								<!-- /ko -->	
							<!-- /ko -->	
						</div>									
					</div>
					
					<div class="text-center col-xs-3 col-sm-4 hidden-xs" data-bind="visible: Images().length > 0, with: Images()[0]">
						<!-- ko template: { name: 'thumbnails' } -->
						<!-- /ko -->
					</div>			
				</div>			
			</div>
			<!--
			<div class="panel-footer" data-bind="visible: CurrentSecQuestion() == 0">				
				<div class="row">
					<div class="col-md-12">
						<p><small>Узнайте оптимальный вариант ответа, ответив на несколько наводящих вопросов.</small></p>
						<button class="btn btn-primary" data-bind="click: $root.start, enable: MainAnswerList().length != 0">
							Подобрать оптимальный вариант!
						</button>							
					</div>
				</div>					
			</div>
			-->
		</div>				
		
		<div class="panel panel-success" id="q_best_answer" data-bind="visibleAndScroll: { visible: Finish, offset: '-10' }">
			<div class="panel-heading">
				<h3 class="panel-title"><span class="glyphicon glyphicon-ok-sign"></span> Оптимальный вариант</h3>
			</div>
			<div class="panel-body" data-bind="with: MainAnswerList()[0]">	
				<h3>
					<span data-bind="text: Title"></span> 
					<span class="label label-success bottompad0" data-bind="attr: { title: 'Соответствует вашим критериям на ' + Rating() + '%' }">
						<span class="glyphicon glyphicon-ok-sign"></span> <span data-bind="text: Rating() + '%'"></span>
					</span>
				</h3>
				<div class="row">
					<div data-bind="css: Images().length ? 'col-sm-8' : 'col-sm-12'">
						<div class="row">
							<div class="col-xs-12">
								<div class="multiline" data-bind="text: Description, visible: Description"></div>
								<div class="top10" data-bind="visible: LinkUrl">
									<a href="#" class="label label-info" target="_blank" title="Читать подробнее..." data-bind="attr: { href: LinkUrl }">
										<span class="glyphicon glyphicon-share"></span>
										<span data-bind="text: LinkTitle.truncatedText(50)"></span>
									</a>
								</div>
							</div>
							<!-- ko foreach: Images -->
								<!-- ko if: $index() < 3 -->
									<div class="text-center col-xs-4 visible-xs top15" data-bind="css: { 'visible-sm visible-md visible-lg': $index() != 0 }">
										<!-- ko template: { name: 'thumbnails' } -->
										<!-- /ko -->
									</div>		
								<!-- /ko -->	
							<!-- /ko -->
						</div>							
					</div>
					
					<div class="text-center col-xs-3 col-sm-4 hidden-xs" data-bind="visible: Images().length > 0, with: Images()[0]">
						<!-- ko template: { name: 'thumbnails' } -->
						<!-- /ko -->
					</div>						
				</div>
			</div>
			<div class="panel-footer">				
				<p><small>Не понравился тест? Странные вопросы? <a href="/question/create">Создай свою подсказку</a> - ее увидят все!</small></p>
				<button class="btn btn-success btn-sm" data-bind="click: $root.start">
					<span class="glyphicon glyphicon-repeat"></span> Повторить
				</button>	
				<a href="/question/create" class="btn btn-primary btn-sm"><span class="glyphicon glyphicon-plus"></span> Создать свою подсказку!</a> 
				<span data-bind="html: VkShareButton"></span>		
			</div>			
		</div>	

		<div  data-bind="visible: CurrentSecQuestion() && !Finish()">
			<div class="progress" data-bind="visible: CurrentSecQuestion() && !Finish()">
				<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="" data-bind="text: getProgress() ? ('Пройдено ' + getProgress() + '%') : '', style: { width: getProgress() + '%' }">				
				</div>
			</div>		
		</div>	
		
		<div class="alert alert-info" id="q_secondary_question" data-bind="visible: CurrentSecQuestion() && !Finish()">
			<div class="row" data-bind="if: SecondQuestion">
				<div class="col-md-7">
					<div data-bind="with: SecondQuestion">
						<h3><span data-bind="text: $parent.CurrentSecQuestion"></span>. <span data-bind="text: Title"></span></h3>
						<div class="multiline" data-bind="text: Description, visible: Description"></div>		
					</div>
				</div>
				<div class="col-md-5">
					<p>Выберите ответ:</p>
					<div class="list-group">
						<span class="list-group-item" data-bind="visible: !SecondAnswerList().length">
							<span data-bind="template: { name: 'tpl_loading' }"></span>
						</span>					
						<!-- ko foreach: SecondAnswerList -->
						<a href="#" class="list-group-item" data-bind="click: $root.nextQuestion">
							<h4 class="list-group-item-heading" data-bind="text: Title"></h4>
							<p class="list-group-item-text" data-bind="text: Description, visible: Description"></p>
						</a>
						<!-- /ko -->
					</div>
				</div>				
			</div>		
		</div>					
		
		<div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title"><span class="glyphicon glyphicon-info-sign"></span> Возможные варианты</h3>
				</div>
				<div class="panel-body">		
					<div data-bind="if: MainAnswerList().length > 0">
						<!--
						<ol data-bind="foreach: MainAnswerList">
							<li data-bind="text: Title"></li>
						</ol>
						-->
						<!-- ko foreach: { data: MainAnswerList, afterRender: MainAnswerList()[0].Images.afterRender } -->
							<div class="row top10" data-bind="css: { 'well expanded' : Expanded() }">
								<div class="col-sm-1 col-xs-1 text-center toppad5"><div class="label label-default" data-bind="text: $index() + 1"></div></div>
								<div class="col-sm-2 hidden-xs text-center thumbnail-block" data-bind="visible: Images().length, with: Images()[0]">
									<a href="#" class="thumbnail" target="_blank" data-bind="thumbnail: { src: UrlData, title: Title }">
										<img src="#" data-bind="attr: { src: UrlThumbnail, title: Title, alt: Title }">
									</a>
								</div>
								<div class="col-sm-9 col-xs-11" data-bind="css: { 'col-sm-9': Images().length, 'col-sm-11': !Images().length }">
									<div data-bind="visible: !Expanded()">
										<div>
											<strong data-bind="text: Title.truncatedText(50)"></strong> 
											<!-- ko template: 'tpl_rating' --><!-- /ko -->
										</div> 
										<div>
											<em class="text-muted" data-bind="text: Description.truncatedText(100)"></em>
										</div>
										<div class="small">		
											<a href="#" title="Показать полностью" data-bind="click: expand">Показать <span class="glyphicon glyphicon-download"></span></a> 
										</div>							
									</div>
									<div data-bind="visible: Expanded">
										<div>
											<strong data-bind="text: Title"></strong> 
											<!-- ko template: 'tpl_rating' --><!-- /ko -->
										</div>
										<div class="multiline" data-bind="text: Description, visible: Description()">										
										</div>
										<div class="top5" data-bind="visible: LinkUrl">
											<a href="#" class="label label-info" target="_blank" title="Читать подробнее..." data-bind="attr: { href: LinkUrl }">
												<span class="glyphicon glyphicon-share"></span>
												<span data-bind="text: LinkTitle.truncatedText(50)"></span>
											</a>
										</div>
										<div class="small top10">
											<a href="#" title="Скрыть подробности" data-bind="click: expand">Скрыть <span class="glyphicon glyphicon-upload"></span></a>
										</div>																		
									</div>								
								</div>
							</div>
						<!-- /ko -->		
					</div>
					<div data-bind="if: MainAnswerList().length == 0">
						<img src="/uploads/loading2.gif" alt="Загрузка..." title="Загрузка..." />
					</div>					
				</div>
			</div>		
		</div>			
		
		<div data-bind="if: MainQuestionRelList().length > 0">
			<div class="panel panel-info">
				<div class="panel-heading">
					<h3 class="panel-title"><span class="glyphicon glyphicon-question-sign"></span> Узнайте также...</h3>
				</div>
				<div class="panel-body">		
					<div>
						<!-- ko foreach: { data: MainQuestionRelList, afterRender: MainQuestionRelList()[0].Images.afterRender } -->
							<div class="row top10">
								<div class="col-sm-2 hidden-xs text-center thumbnail-block">
									<a href="#" class="thumbnail" data-bind="attr: { href: '/question/' + Id(), title: Title() }, with: Images()[0] || { UrlThumbnail: '/uploads/thumbnail/default_mini.png', Title: 'Нет фото' }">
										<img src="#" data-bind="attr: { src: UrlThumbnail, title: Title, alt: Title }">
									</a>															
								</div>
								<div class="col-sm-10 col-xs-12">									
									<div>
										<strong data-bind="text: Title.truncatedText(50)"></strong>
									</div>
									<div>
										<em class="text-muted" data-bind="visible: Description(), text: Description.truncatedText(100)"></em> 
									</div>						
									<div>
										<a href="#" data-bind="attr: { href: '/question/' + Id(), title: 'Узнать ответ!' }">
											Далее <span class="glyphicon glyphicon-circle-arrow-right"></span>
										</a>										
									</div>
								</div>
							</div>
						<!-- /ko -->		
					</div>			
				</div>
			</div>	
		</div>				
	</div>
	
	<div id="vk_comments"></div>
	
	<script type="text/html" id="thumbnails">
		<a href="#" target="_blank" class="thumbnail" data-bind="thumbnail: { src: UrlData, title: Title }">
			<img src="#" data-bind="attr: { src: UrlMiddle, title: Title, alt: Title }">
		</a>
	</script>
	
	<script type="text/html" id="tpl_loading">
		<img src="/uploads/loading2.gif" alt="Загрузка..." title="Загрузка..." />
	</script>	
	
	<script type="text/html" id="tpl_rating">
		<span class="label label-big bottompad0" data-bind="visible: Rating() !== '', attr: { title: 'Соответствует вашим критериям на ' + Rating() + '%' },css: (Rating() > 74 || ($root.Finish() && $index() == 0)) ? 'label-success' : (Rating() < 50 ? 'label-danger' : 'label-warning')">
			<span class="glyphicon" data-bind="css: (Rating() > 74 || ($root.Finish() && $index() == 0)) ? 'glyphicon-ok-sign' : (Rating() < 50 ? 'glyphicon-remove-circle' : 'glyphicon-question-sign')"></span> <span data-bind="text: Rating() + '%'"></span>
		</span>
	</script>
{/block}

{block 'scripts'}
<script type="text/javascript">
	$(document).ready(function () {	
		PassTestVM = new Hinter.PassTestVM({$mainQuestion->id});
		PassTestVM.bind(
			{json_encode($mainQuestion)}, 
			{if !empty($categoryList)}{json_encode($categoryList)}{else}null{/if}
		);
		
		{if !$dev_server}
			if (typeof VK !== 'undefined') {
				VK.init({
					apiId: 4431858,
					onlyWidgets: true
				});		
				VK.Widgets.Comments('vk_comments', { limit: 10, attach: "*" }, {$mainQuestion->id});
			}
		{/if}		
	});
</script>
{/block}
