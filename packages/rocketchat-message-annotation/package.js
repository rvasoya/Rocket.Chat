Package.describe({
	name: 'rocketchat:message-annotation',
	version: '0.0.1',
	summary: 'Annotation Messages'
});

Package.onUse(function(api) {
	api.use([
		'mongo',
		'templating',
		'ecmascript',
		'rocketchat:lib'
	]);

	api.addFiles([
		'client/lib/annotationMessage.js',
		'client/actionButton.js',
		'client/tabBar.js',
		'client/views/annotation.html',
		'client/views/annotation.js',
		'client/views/stylesheets/annotation.css'
	], 'client');

	api.addFiles([
		'server/publications/annotationMessage.js',
		'server/settings.js',
		'server/annotationMessage.js'
	],'server')

});
