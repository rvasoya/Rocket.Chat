Meteor.startup(function() {
  RocketChat.MessageAction.addButton({
		id: 'go to',
		icon: 'message',
		label: 'annotation`',
		classes: 'annotation-jump',
		context: ['annotation'],
		action(event) {
			console.log(event);
		},
		order: 4,
		group: 'menu'
	});

});
