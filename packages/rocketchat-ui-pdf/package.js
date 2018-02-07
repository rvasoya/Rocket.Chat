Package.describe({
	name: 'rocketchat:ui-pdf',
	version: '1.0.0',
	summary: 'To render pdf on click',
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
		'client/lib/uiPdf.html',
		'client/lib/uiPdf.js'
	],'client')

	api.addFiles([
		'server/getPdf.js',
		'server/createPdfAnnotation.js'
	],'server')
});
