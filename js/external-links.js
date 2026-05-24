(function () {
	var internalHosts = ['paolodona.com', 'www.paolodona.com'];
	if (window.location && window.location.hostname) {
		internalHosts.push(window.location.hostname);
	}

	document.querySelectorAll('a[href]').forEach(function (link) {
		var url;

		try {
			url = new URL(link.getAttribute('href'), window.location.href);
		} catch (error) {
			return;
		}

		if (!/^https?:$/.test(url.protocol)) return;
		if (internalHosts.indexOf(url.hostname) !== -1) return;

		link.setAttribute('target', '_blank');

		var rel = (link.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
		['noopener', 'noreferrer'].forEach(function (value) {
			if (rel.indexOf(value) === -1) rel.push(value);
		});
		link.setAttribute('rel', rel.join(' '));
	});
}());
