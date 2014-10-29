<div class="footer">
	<div class="container">
		<div class="row">
			<div class="col-sm-6">
				&copy; Maradik 2014 
				<a href="mailto:{$info_s.admin_email}">{$info_s.admin_email}</a>
			</div>
			<div class="col-sm-1">
				{if !$dev_server}
					{ignore}
						<!-- Yandex.Metrika counter -->
						<script type="text/javascript">
						(function (d, w, c) {
						    (w[c] = w[c] || []).push(function() {
						        try {
						            w.yaCounter24840683 = new Ya.Metrika({id:24840683,
						            		webvisor:true,
						                    clickmap:true,
						                    trackLinks:true,
						                    accurateTrackBounce:true});
						        } catch(e) { }
						    });
						
						    var n = d.getElementsByTagName("script")[0],
						        s = d.createElement("script"),
						        f = function () { n.parentNode.insertBefore(s, n); };
						    s.type = "text/javascript";
						    s.async = true;
						    s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";
						
						    if (w.opera == "[object Opera]") {
						        d.addEventListener("DOMContentLoaded", f, false);
						    } else { f(); }
						})(document, window, "yandex_metrika_callbacks");
						</script>
						<noscript><div><img src="//mc.yandex.ru/watch/24840683" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
						<!-- /Yandex.Metrika counter -->	
						<script>
						  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
						  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
						  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
						  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
						
						  ga('create', 'UA-38197880-3', 'hintok.ru');
						  ga('send', 'pageview');
						
						</script>								
					{/ignore}	
				{/if}
			</div>
			<div class="col-sm-5 text-right">
				Version &alpha;
			</div>
		</div>
	</div>
</div>
