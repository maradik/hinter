{if ($linkList is array) && !($linkList is empty)}
	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;Информация</h3>
		</div>
		<div class="panel-body">
		<ul class="nav nav-pills nav-stacked">
			{foreach $linkList as $link}
				<li>
					<a href="{$link.url}" title="{$link.description|truncate:40:'...'|e:'HTML'}" target="_blank" rel="nofollow">
						{if !($link.imageUrl is empty)}
							<img src="{$link.imageUrl}" style="vertical-align: top;"/> 
						{/if}
						{$link.title|e:'HTML'}
					</a>
				</li>
			{/foreach}
		</ul>
		</div>
	</div>
{/if}
