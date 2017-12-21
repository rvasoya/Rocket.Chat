Package.describe({
	name: 'rocketchat:annotate-dots',
	version: '0.0.1',
	summary: 'Displaying Annotation'
});

Package.onUse(function(api) {
	api.use([
		'mongo',
		'templating',
		'ecmascript',
		'rocketchat:lib'
	]);

	api.addFiles([
		'client/lib/annotateDots.js',
		'client/views/annotateDots.html',
		'client/views/annotateDots.js',
	], 'client');

	api.addFiles([
		'server/publications/annotateDots.js'
	],'server');

});
