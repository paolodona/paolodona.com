// Tiny vanilla lightbox: click any [data-lightbox] link to open.
// Multiple [data-lightbox] elements inside the same [data-lightbox-group]
// (or the closest .gallery) form a navigable set with prev/next arrows.
(function () {
	const triggers = Array.from(document.querySelectorAll('[data-lightbox]'));
	if (!triggers.length) return;

	const overlay = document.createElement('div');
	overlay.className = 'lightbox';
	overlay.innerHTML = `
		<button class="lightbox__close" aria-label="Close">×</button>
		<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">‹</button>
		<button class="lightbox__nav lightbox__nav--next" aria-label="Next">›</button>
		<img alt="">
		<div class="lightbox__counter"></div>
	`;
	document.body.appendChild(overlay);

	const imgEl = overlay.querySelector('img');
	const counterEl = overlay.querySelector('.lightbox__counter');
	const prevBtn = overlay.querySelector('.lightbox__nav--prev');
	const nextBtn = overlay.querySelector('.lightbox__nav--next');
	const closeBtn = overlay.querySelector('.lightbox__close');

	let group = [];
	let index = 0;

	function show(i) {
		if (!group.length) return;
		index = (i + group.length) % group.length;
		const a = group[index];
		imgEl.src = a.getAttribute('href');
		imgEl.alt = a.querySelector('img')?.alt || '';
		counterEl.textContent = group.length > 1 ? `${index + 1} / ${group.length}` : '';
		const showNav = group.length > 1;
		prevBtn.style.display = showNav ? '' : 'none';
		nextBtn.style.display = showNav ? '' : 'none';
	}

	function open(trigger) {
		const groupEl = trigger.closest('[data-lightbox-group]') || trigger.closest('.gallery') || document;
		group = Array.from(groupEl.querySelectorAll('[data-lightbox]'));
		const i = group.indexOf(trigger);
		show(i >= 0 ? i : 0);
		overlay.classList.add('is-open');
		document.body.classList.add('lightbox-open');
	}

	function close() {
		overlay.classList.remove('is-open');
		document.body.classList.remove('lightbox-open');
		setTimeout(() => { imgEl.src = ''; }, 200);
	}

	triggers.forEach(t => {
		t.addEventListener('click', (e) => {
			e.preventDefault();
			open(t);
		});
	});

	prevBtn.addEventListener('click', () => show(index - 1));
	nextBtn.addEventListener('click', () => show(index + 1));
	closeBtn.addEventListener('click', close);
	overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

	document.addEventListener('keydown', (e) => {
		if (!overlay.classList.contains('is-open')) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowLeft') show(index - 1);
		else if (e.key === 'ArrowRight') show(index + 1);
	});
})();
