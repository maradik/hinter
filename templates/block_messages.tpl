{if time() < strtotime('07/14/2014')}
	<div class="alert alert-info alert-dismissable">
		<a href="#" class="close" data-dismiss="alert" aria-hidden="true">&times;</a>
		<div>
			<big class="glyphicon glyphicon-exclamation-sign"></big>
			{if time() < strtotime('07/07/2014')}	
			С 07.07.2014 стартует <strong>РОЗЫГРЫШ ПЛАНШЕТА</strong>! 
			{elseif time() > strtotime('07/07/2014') && time() < strtotime('07/08/2014')}
			Сегодня стартовал <strong>РОЗЫГРЫШ ПЛАНШЕТА</strong>!
			{elseif time() > strtotime('07/08/2014')}
			Продолжается <strong>РОЗЫГРЫШ ПЛАНШЕТА</strong>!		
			{/if}
			<a href="http://vk.com/hintok" target="_blank" class="alert-link" rel="nofollow">Вступайте в группу ВКонтакте</a> и участвуйте!
		</div>
		<div class="row">
			<div class="col-sm-4 hidden-xs top10 text-center">
				<a href="https://vk.com/hintok" target="_blank" rel="nofollow">
					<img src="/uploads/tablet_min.JPG" class="img-thumbnail" alt="Фото планшета" />
				</a>
			</div>
			<div class="col-sm-4 hidden-xs top10 text-center">
				<a href="https://vk.com/hintok" target="_blank" rel="nofollow">
					<img src="/uploads/tablet2_min.JPG" class="img-thumbnail" alt="Фото планшета" />
				</a>
			</div>
			<div class="col-sm-4 hidden-xs top10 text-center">
				<a href="https://vk.com/hintok" target="_blank" rel="nofollow">
					<img src="/uploads/tablet3_min.JPG" class="img-thumbnail" alt="Фото планшета" />
				</a>
			</div>				
		</div>
	</div>
{/if}
