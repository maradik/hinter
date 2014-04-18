<div class="panel panel-default">
	<div class="panel-heading">
		<h3 class="panel-title"><span class="glyphicon glyphicon-folder-open"></span>&nbsp;&nbsp;Категории</h3>
	</div>
	<div class="panel-body">
	<ul class="nav nav-pills nav-stacked">
		{foreach $categoryList as $category}
			<li{if $clearUri == "/category/{$category->id}"} class="active"{/if}>
				<a href="/category/{$category->id}" title="{$category->description|truncate:40:'...'|e:'HTML'}">
					{$category->title|e:'HTML'}
				</a>
			</li>
		{/foreach}
	</ul>
	</div>
</div>