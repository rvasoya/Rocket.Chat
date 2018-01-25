Package.describe({
	name: 'rocketchat:ui-video',
	version: '1.0.0',
	summary: 'To render video on ui onclick',
});
//

Package.onUse(function(api) {
	api.use([
		'mongo',
		'session',
		'jquery',
		'tracker',
		'reactive-var',
		'ecmascript',
		'templating',
		'rocketchat:lib',
		'rocketchat:ui-master',
	]);
	api.addFiles([
		'client/lib/VideoAnnotation.js',
		'client/uiVideo.html',
		// 'client/assets/magnificPopup.js',
		'client/uiVideo.js',
	],'client')

	api.addFiles([
		'server/getVideo.js',
		'server/createVideoAnnotation.js',
		'server/publication/getVideoAnnotation.js'
	],'server')
});
