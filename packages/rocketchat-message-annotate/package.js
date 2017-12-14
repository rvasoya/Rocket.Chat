Package.describe({
	name: 'rocketchat:message-annotate',
	version: '0.0.1',
	summary: 'Annotation message listing'
});

Package.onUse(function(api) {
	api.use([
		'templating',
		'ecmascript',
		'rocketchat:lib'
	]);

	api.addFiles([
		// 'client/actionButton.js',
		'client/views/annotate.html',
		'client/views/annotate.js',
		'client/views/stylesheets/annotate.css'
	], 'client');

});
