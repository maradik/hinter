<div class="row">
	<div class="col-md-12">
			<table class="table table-striped table-hover">								
				<tbody>
					{if (!empty($mainQuestionList))}
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
					{else}
						<tr class="list-item-static">
							<td>					
								<p><em>Нет вопросов в данной категории</em></p>
							</td>
						</tr>
					{/if}					
					<!-- ko foreach: MainQuestionList -->
						<tr>
							<td>
								<div class="row" data-bind="css: { 'text-muted': !Active() }">
									<div class="col-sm-2 hidden-xs">
										<div>
											<a href="#" class="thumbnail top10" data-bind="attr: { href: '/question/' + Id(), title: Title() }, with: Images()[0] || { UrlMiddle: '/uploads/default.png', Title: 'Нет фото' }">
												<img src="#" data-bind="attr: { src: UrlMiddle, title: Title, alt: Title }">
											</a>
										</div>							
									</div>									
									<div class="col-lg-8 col-sm-7 col-xs-12">
										<h3 class="top10">
											<a href="#" class="mqlist-item-head" data-bind="text: Title, attr: { href: '/question/' + Id(), title: Title() }">
											</a>
										</h3>
										<div class="multiline" data-bind="text: Description.truncatedText(300), visible: Description"></div>
										<div class="top10 row">
											<div class="col-lg-2 col-xs-3">
												<span class="label label-default" title="Дата создания">
													<span class="glyphicon glyphicon-file"></span> <span data-bind="text: CreateDate.dateToStr()"></span>
												</span>
											</div>
											<div class="col-lg-10 col-xs-9" data-bind="with: $root.CategoryList.findById(CategoryId()), visible: !$root.CategoryId()">
												<a href="#" class="label label-info" data-bind="attr: { href: '/category/' + Id() }">
													<span class="glyphicon glyphicon-folder-open"></span>&nbsp;&nbsp;<span data-bind="text: Title"></span>
												</a> 
											</div>
										</div>
									</div>									
									<div class="col-lg-2 col-sm-3 col-xs-12 text-right">
										<div data-bind="visible: !$root.EditMode()">
											<a href="#" title="" class="btn btn-primary top10" data-bind="attr: { href: '/question/' + Id(), title: Title() }">
												Узнать ответ!
											</a>
										</div>
										<div data-bind="visible: $root.EditMode()">
											<span class="btn-block-sm">
												<span class="glyphicon glyphicon-time text-warning" title="Проверяется модератором" data-bind="visible: !Active()"></span>
												<span class="glyphicon glyphicon-ok text-success" title="Опубликовано" data-bind="visible: Active()"></span>
											</span>											
											<a href="#" class="btn btn-info btn-sm btn-block-sm" data-bind="attr: { href: '/question/' + Id(), title: Title() }">
												<span class="glyphicon glyphicon-play"></span> Просмотр
											</a>
											<a href="#" title="Изменить подсказку" class="btn btn-success btn-sm btn-block-sm" data-bind="attr: { href: '/question/' + Id() + '/edit' }">
												<span class="glyphicon glyphicon-pencil"></span> Изменить
											</a>
											<button title="Удалить подсказку" class="btn btn-danger btn-sm btn-block-sm" data-bind="click: $root.removeMainQuestion, disable: Locked">
												<span class="glyphicon glyphicon-remove"></span> Удалить
											</button>												
										</div>										
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
					<tr data-bind="visible: !Loading() && IsEndOfList() && !MainQuestionList().length">
						<td>
							<p><em>Нет вопросов в данной категории</em></p>
						</td>
					</tr>									
				</tbody>
			</table>
	</div>		
</div>


