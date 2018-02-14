Package.describe({
	name: 'rocketchat:message-annotation',
	version: '1.0.0',
	summary: 'Annotation Messages listing in sideBox'
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
		'client/tabBar.js',
		'client/views/annotation.html',
		'client/views/annotation.js',
		'client/views/stylesheets/annotation.css'
	], 'client');

	api.addFiles([
		'server/publications/annotationMessage.js',
		'server/settings.js'
	],'server')

});
