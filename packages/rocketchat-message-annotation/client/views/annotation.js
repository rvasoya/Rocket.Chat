/* globals Annotation */
import _ from 'underscore';
import moment from 'moment';

Meteor.startup(function() {
	RocketChat.MessageAction.addButton({
		id: 'jump-to-annotation',
		icon: 'jump',
		label: "Jump_to_message",
		context: ['annotation'],
		action() {
			console.log('jump to annotation');
			// const message = this._arguments[1];
			// if (window.matchMedia('(max-width: 500px)').matches) {
			// 	Template.instance().tabBar.close();
			// }
			//
			// RoomHistoryManager.getSurroundingMessages(message, 50);
		},
		group: 'menu'
	});

});


Template.annotationTemplate.helpers({
	time(ts) {
		return moment(ts).format(RocketChat.settings.get('Message_TimeFormat'));
	},
	date(ts) {
		return moment(ts).format(RocketChat.settings.get('Message_DateFormat'));
	},
	hasAnnotation() {
		return AnnotationMessage.find({
			rid: this.rid
		}).count() > 0;
	},
	annotation() {
		return AnnotationMessage.find({
			rid:this.rid
		},{
			sort:{at : -1}
		}).fetch();
	},
	hasMore() {
		return Template.instance().hasMore.get();
	}
});

Template.annotationTemplate.onCreated(function() {
	this.hasMore = new ReactiveVar(true);
	this.limit = new ReactiveVar(50);
	return this.autorun(() => {
		const data = Template.currentData();
		return this.subscribe('annotationMessage', data.rid, this.limit.get(), () => {
			if (AnnotationMessage.find({
				rid: data.rid
			}).count() < this.limit.get()) {
				console.log(this.limit.get());
				return this.hasMore.set(false);
			}
			else{
				console.log(this.limit.get());
				return this.hasMore.set(false);
			}
		});
	});
});

Template.annotationTemplate.events({
	'scroll .js-list': _.throttle(function(e, instance) {
		if (e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight && instance.hasMore.get()) {
			console.log('get more annotation...');
			return instance.limit.set(instance.limit.get() + 1);
		}
	}, 200),

	'click .annotation-message'(e,instance){
		RoomHistoryManager.getSurroundingMessages({
			_id: $(e.currentTarget).attr('data-mid'),
			rid:Session.get('openedRoom')
		}, 50)
		let msgElement = $('.annotate[data-id="'+$(e.currentTarget).attr('data-id')+'"]');
		msgElement.addClass('highlight');
		return setTimeout(() => msgElement.removeClass('highlight'), 1500);
	},

	'click .annotation-actions__menu'(e){
		const groups = RocketChat.MessageAction.getButtons(Template.currentData(), 'annotation', 'menu')
		const config = {
			popoverClass: 'annotation-action',
			columns: [
				{
					groups: Object.keys(groups).map(group => {
						const items = [];
						groups.forEach(item => {
							items.push({
								icon: item.icon,
								name: t(item.label),
								type: 'annotation-action',
								id: item.id
							});
						});
						return {
							title: null,
							items
						};
					})
				}
			],
			mousePosition: {
				x: e.clientX,
				y: e.clientY
			}
		};
		popover.open(config);
	}
});
