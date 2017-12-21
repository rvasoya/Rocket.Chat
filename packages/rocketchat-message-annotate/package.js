Package.describe({
	name: 'rocketchat:message-annotate',
	version: '0.0.1',
	summary: 'Annotation message listing'
});

Package.onUse(function(api) {
	api.use([
		'mongo',
		'templating',
		'ecmascript',
		'rocketchat:lib'
	]);

	api.addFiles([
		'client/lib/AnnotateDots.js',
		'client/views/annotate.html',
		'client/views/annotate.js',
		'client/views/stylesheets/annotate.css'
	], 'client');

	api.addFiles([
		// 'server/annotate.js',
		'server/publications/annotate.js'
	],'server');

});
