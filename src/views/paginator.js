define(function(require, exports, module){

	var Marionette = require('marionette');

	require(['../templates']);

	module.exports = Marionette.ItemView.extend({
		template: 'paginator/paginator.tpl',

		events: {
			'submit form'         : function(ev) { return false; },
			'click .btn-first'    : 'goToFirstPage',
			'click .btn-last'     : 'goToLastPage',
			'click .btn-previous' : 'goToPrevPage',
			'click .btn-next'     : 'goToNextPage',
			'change .per-page'    : 'perPage',
			'keyup .current-page' : 'goToPage'
		},

		initialize: function(options) {
			this.listenTo(this.collection, 'all', _.debounce(this.updatePaginatorEls, 300));
			this.render();
			this.updatePaginatorEls();

			if(this.options.logTemplate) {
				this.logTemplate();
			}
		},

		logTemplate: function() {
			var code = this.el.innerHTML;
			code = code.replace(/\n\n/g, '\n');
			console.log('#################### TEMPLATE DO PAGINATOR ####################\n');
			console.log(code);
		},

		goToFirstPage: function(ev) {
			ev.preventDefault();
			this.collection.firstPage();
		},

		goToLastPage: function(ev) {
			ev.preventDefault();
			this.collection.lastPage();
		},

		goToPrevPage: function(ev) {
			ev.preventDefault();
			this.collection.prevPage();
		},

		goToNextPage: function(ev) {
			ev.preventDefault();
			this.collection.nextPage();
		},

		goToPage: function(ev) {
			ev.preventDefault();
			if(ev.keyCode === 13) {
				this.collection.toPage(ev.currentTarget.value);
			}
		},

		perPage: function(ev) {
			ev.preventDefault();
			var itens = this.$('.per-page').val();
			this.collection.perPage(itens);
		},

		updatePaginatorEls: function() {
			/*
			*        Calcula o offset de registros
			*/
			var offsetDe = this.collection.itemOffset,
			offsetA = (this.collection.length + this.collection.itemOffset) - 1;

			if(this.collection.length === 0) {
				offsetA = 0;
			}

			/*
			*        Atualiza os elementos do paginador com os valores recebidos da collection
			*/
			this.$('.current-page').val(this.collection.currentPage);
			this.$('.total-pages').html(this.collection.pageCount);
			this.$('.shown-items-de').html(offsetDe);
			this.$('.shown-items-a').html(offsetA);
			this.$('.total-items').html(this.collection.itemCount);

			/*
			*        Se currentPage for igual a 1 desabilita os botões de voltar e primeira página
			*/
			if(this.collection.currentPage == 1) {
				this.$('.btn-first').prop('disabled', true);
				this.$('.btn-previous').prop('disabled', true);
			} else {
				this.$('.btn-first').prop('disabled', false);
				this.$('.btn-previous').prop('disabled', false);
			}

			/*
			*        Se currentPage for igual a pageCount desabilita os botões de avançar e última página
			*/
			if(this.collection.currentPage == this.collection.pageCount) {
				this.$('.btn-last').prop('disabled', true);
				this.$('.btn-next').prop('disabled', true);
			} else {
				this.$('.btn-last').prop('disabled', false);
				this.$('.btn-next').prop('disabled', false);
			}

			/*
			*        Se pageCount for igual a 1 desabilita todos os elementos
			*/
			if(this.collection.pageCount == 1) {
				this.$('.current-page').prop('disabled', true);
				this.$('.per-page').prop('disabled', true);
			} else {
				this.$('.current-page').prop('disabled', false);
				this.$('.per-page').prop('disabled', false);
			}
		}
	});

});