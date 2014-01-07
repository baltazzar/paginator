/**
 * Backbone PagedCollection
 * Extende a Backbone.Collection inserindo os parâmetros de paginação.
 */
define(function(require, exports, module){

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
			this.currentPage = res.data.currentPage;
			this.pageCount = res.data.pageCount;
			this.itemCount = res.data.itemCount;
			this.itemOffset = res.data.itemOffset;

			return res.data.itemList;
		}
	});
});