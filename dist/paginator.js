/**
 * Baltazzar Paginator
 * Versão: 0.1.1
 * Módulo front-end de paginação de dados.
 * Autor: Victor Bastos
 */
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["paginator/paginator.tpl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"form-inline paginator pull-right\">\r\n	<label style=\"font-weight:normal;\">\r\n		<select class=\"form-control input-sm per-page\">\r\n			<option value=\"10\" selected=\"selected\">10 por página</option>\r\n			<option value=\"20\">20 por página</option>\r\n			<option value=\"30\">30 por página</option>\r\n			<option value=\"40\">40 por página</option>\r\n			<option value=\"50\">50 por página</option>\r\n		</select>\r\n	</label>\r\n\r\n	<button class=\"btn btn-sm btn-default btn-first\"><i class=\"glyphicon glyphicon-fast-backward\"></i></button>\r\n	<button class=\"btn btn-sm btn-default btn-previous\"><i class=\"glyphicon glyphicon-backward\"></i></button>\r\n\r\n	<label style=\"font-weight:normal;\">\r\n		<span>Página <input type=\"text\" class=\"form-control input-sm current-page\" style=\"width:50px;\"></span>\r\n	</label>\r\n\r\n	<label style=\"font-weight:normal;\">\r\n		<span>de <strong class=\"total-pages\"></strong></span>\r\n	</label>\r\n\r\n	<button class=\"btn btn-sm btn-default btn-next\"><i class=\"glyphicon glyphicon-forward\"></i></button>\r\n	<button class=\"btn btn-sm btn-default btn-last\"><i class=\"glyphicon glyphicon-fast-forward\"></i></button>\r\n\r\n	<span>Exibindo <strong class=\"shown-items-de\"></strong> à <strong class=\"shown-items-a\"></strong> de <strong class=\"total-items\"></strong> registros</span>\r\n</div>";
  });
define("templates", function(){});

define('views/paginator',['require','exports','module','marionette'],function(require, exports, module){

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
/**
 * Backbone PagedCollection
 * Extende a Backbone.Collection inserindo os parâmetros de paginação.
 */
define('pagedCollection',['require','exports','module','backbone'],function(require, exports, module){

	var Backbone = require('backbone');

	module.exports = Backbone.Collection.extend({

		queryObj: {itens_per_page: 10},

		initialize: function(options) {
			this.callFetch({page: 1});
		},

		callFetch: function(data) {
			if(data && data.itens_per_page) {
				this.queryObj = _.extend({page: 1}, data);
			}

			this.queryObj = _.extend(this.queryObj, data);

			return this.fetch({
				async: false,
				data: this.queryObj
			});
		},

		perPage: function(itens_per_page) {
			this.queryObj.itens_per_page = itens_per_page;
			this.callFetch({page: 1});
		},

		toPage: function(page) {
			page = page <= this.pageCount ? page : this.pageCount;
			this.callFetch({page: page});
		},

		firstPage: function() {
			this.callFetch({page: 1});
		},

		lastPage: function() {
			this.callFetch({page: this.pageCount});
		},

		nextPage: function() {
			if(this.currentPage < this.pageCount) {
				this.callFetch({page: this.currentPage + 1});
			}
		},

		prevPage: function() {
			if(this.currentPage > 1) {
				this.callFetch({page: this.currentPage - 1});
			}
		},

		parse: function(res) {
			if(res.data) {
				this.currentPage = res.data.currentPage;
				this.pageCount = res.data.pageCount;
				this.itemCount = res.data.itemCount;
				this.itemOffset = res.data.itemOffset;

				return res.data.itemList;
			}
		}
	});
});
define('paginator',['require','exports','module','jquery','./views/paginator','./pagedCollection'],function(require, exports, module){

	var $ = require('jquery'),
		PaginatorView = require('./views/paginator'),
		PagedCollection = require('./pagedCollection');

	$.fn.Paginator = function(options) {
		options.el = this;
		return new PaginatorView(options);
	};

	exports.PagedCollection = PagedCollection;
});