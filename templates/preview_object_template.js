<script type="text/template" id="previewTemplate">
	<tr>
		<td><%= previewObject.accountId %></td>
		<td><%= previewObject.accountName %></td>
		<td><%= previewObject.objectName %></td>
		<td>
				<%= if (previewObject.isPublished) { %> <i class="icon-ok-sign"></i> %< } 
				else { %> <i class="icon-remove-sign"></i> %< } %>
		</td>
		<td>
			<div id="actionBtnGrp" class="btn-group">
				<a id="previewBtn" target="previewFrame" class="btn btn-mini" title="Preview">
					<i class="icon-edit"></i>
				</a>
				<a id="previewTabBtn" target="_blank" class="btn btn-mini" title="Preview In Tab">
					<i class="icon-share"></i>
				</a>
				<a id="fbLinkBtn" target="_blank" class="btn btn-mini" title="Link To Facebook Page">
					<i class="icon-share-alt"></i>
				</a>
			</div>
		</td>
	</tr>
</script>
