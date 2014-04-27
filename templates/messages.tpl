	
	<div id="message-modal-block" data-bind="visible: MessageList().length">
		<div class="modal fade">
		  <div class="modal-dialog">
		    <div class="modal-content">
		      <div class="modal-header" data-bind="css: maxType() == Hinter.MessageType.ERROR ? 'text-danger' : (maxType() == Hinter.MessageType.WARNING ? 'text-warning' : (maxType() == Hinter.MessageType.SUCCESS ? 'text-success' : 'text-info'))">
		        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		        <h4 class="modal-title" data-bind="text: title"></h4>
		      </div>
		      <div class="modal-body" data-bind="foreach: MessageList">
		        <div class="alert" data-bind="css: Type == Hinter.MessageType.ERROR ? 'alert-danger' : (Type == Hinter.MessageType.WARNING ? 'alert-warning' : (Type == Hinter.MessageType.SUCCESS ? 'alert-success' : 'alert-info'))">
		        	<div class="multiline" data-bind="text: Text"></div>
		        </div>
		      </div> 
		      <div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
		      </div>
		    </div><!-- /.modal-content -->
		  </div><!-- /.modal-dialog -->
		</div><!-- /.modal -->
	</div>
	
	<script type="text/javascript">
		$(document).ready(function() {
			var messagesVM = new Hinter.MessagesVM();
			messagesVM.bind();
		});
	</script>