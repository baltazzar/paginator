define(function(require, exports, module){

	var $ = require('jquery'),
		PaginatorView = require('./views/paginator'),
		PagedCollection = require('./pagedCollection');

	require(['./templates']);

	$.fn.Paginator = function(options) {
		options.el = this;
		return new PaginatorView(options);
	};

	exports.PagedCollection = PagedCollection;
});