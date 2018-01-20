Package.describe({
	name: 'rocketchat:mannotate',
	version: '0.0.1',
	summary: 'Annotate dot on image'
});

Package.onUse(function(api) {
	api.use([
		'mongo',
		'templating',
		'ecmascript',
		'rocketchat:lib'
	]);

	api.addFiles([
		'client/lib/mannotate.js',
		'client/views/mannotate.html',
		'client/views/mannotate.js',
		'client/views/stylesheets/annotate.css',
	], 'client');

	api.addFiles([
		'server/publications/mannotate.js',
		],'server')

});
