Package.describe({
	name: 'rocketchat:ui-image',
	version: '1.0.0',
	summary: 'To render image with annotation on click',
});
//

Package.onUse(function(api) {
	api.use([
		'jquery',
		'tracker',
		'reactive-var',
		'ecmascript',
		'templating',
		'rocketchat:lib',
	]);
	api.addFiles([
		'client/lib/uiImage.html',
		'client/lib/uiImage.js'
	],'client')

	api.addFiles([
		'server/getImage.js',
		'server/createImageAnnotation.js'
	],'server')
});
