<html>
<head>
<#include "/decorator/include/header.ftl">
</head>
<body class="u-index">
<#include "/decorator/include/navmain.ftl">
<div class="viewport">
	<div class="content">

	<div data-spm="1003" id="floor-nav" class="list-icon">
		<h3>热门市场</h3>
	    <div>
		    			<a class="item" href="/channel.html?id=1&amp;leftNav=true" target="_top"><i class="icon icon-woman-clear"></i>女装</a>
	        	    			<a class="item" href="/channel.html?id=2&amp;leftNav=true" target="_top"><i class="icon icon-man-clear"></i>男装</a>
	        	    			<a class="item" href="/channel.html?id=4&amp;leftNav=true" target="_top"><i class="icon icon-shoe-clear"></i>鞋品</a>
	        	    			<a class="item" href="/channel.html?id=3&amp;leftNav=true" target="_top"><i class="icon icon-handbag-clear"></i>箱包</a>
	        	    			<a class="item" href="/channel.html?id=5&amp;leftNav=true" target="_top"><i class="icon icon-infant-clear"></i>母婴</a>
	        	    			<a class="item" href="/channel.html?id=6&amp;leftNav=true" target="_top"><i class="icon icon-home-furnishing-clear"></i>生活</a>
	        	    			<a class="item" href="/channel.html?id=7&amp;leftNav=true" target="_top"><i class="icon icon-beauty-clear"></i>护肤</a>
	        	    			<a class="item" href="/channel.html?id=8&amp;leftNav=true" target="_top"><i class="icon icon-food-clear"></i>美食</a>
	        		</div>
	</div>
	
	<#list obj.goodsclasses as goodsclass>
	
	<div data-spm="${goodsclass.internal}" class="floor">
        <h3><a href="${base}/goods/goods/channel.action?classid=${goodsclass.id}&amp;internal=${goodsclass.internal}" target="_top"><span></span>${goodsclass.cname}<span>${goodsclass.cname}</span></a></h3>
        	<div class="hot-key">
        		<#if goodsclass.subpostgoodsclasses?size &gt; 0>
        		<#assign subpostgoodsclass = goodsclass.subpostgoodsclasses[0]>
			    <a href="${base}/goods/goods/channel.action?cclassid=${subpostgoodsclass.id}" target="_top" class="hot-key-main">
				    <img style="width:92px;height:96px;display:block;" class="" src="${subpostgoodsclass.pic!}">
				    <p>最新单凉鞋</p>
				    <p>最适合这天气的鞋</p>
			    </a>
			    </#if>
			    <div class="hot-key-sub">
				    <a href="/search.html?q=罗马凉鞋&amp;back=true" target="_top">
				    <img style="width:44px;height:44px;display:block;" class="" src="${goodsclass.pic!}">
				    <p>罗马凉鞋</p>
				    </a>
				    <a href="/search.html?q=韩版运动鞋&amp;back=true" target="_top">
				    <img style="width:44px;height:44px;display:block;" class="" src="${goodsclass.pic!}">
				    <p>运动鞋</p>
				    </a>
		    	</div>
			</div>
		    <div data-id="4" data-count="8" data-keys="" style="height:90px" class="list-keys">
		    	<#list goodsclass.subgoodsclasses as subclass>
		    		<#if subclass_index &lt; 8>
			        <a href="${base}/goods/goods/channel.action?classid=${subclass.id}&amp;internal=${subclass.internal}" target="_top" extra="" class="item">${subclass.cname}</a>
		    		</#if>
		    	</#list>
		    </div>
	
	</div>
	</#list>
</div>

</body>
</html>