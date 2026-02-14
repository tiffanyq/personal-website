
// constants for intro fade out
const END_FADE_THRESHOLD = 300.0;
const START_FADE_THRESHOLD = 250.0;
const FADE_EXP = 0.3;
const MIN_INTRO_HEIGHT = 430;

function fadeOut(e) {
	const intro = document.getElementById('intro');
	const st = window.pageYOffset;
	if (st > START_FADE_THRESHOLD) {
		intro.style.opacity =
		Math.max(0, 1 - Math.pow((st-START_FADE_THRESHOLD)/END_FADE_THRESHOLD, FADE_EXP));
	} else {
		intro.style.opacity = 1;
	}
}

function showModal(e) {
	const portfolioItem = _getRightElement(this);
	const modalId = portfolioItem.dataset.modal;
	const modal = document.getElementById(modalId);
	modal.style.display = "block";
	modal.scrollTop = 0;
	document.body.style.overflow = "hidden";
}

function closeModal(e) {
	if (e.target.classList.contains('modal-background')) {
		var currentModal= this;
		currentModal.classList.add('fade-out');
		document.body.style.overflow = "visible";
		setTimeout(function() {
			currentModal.style.display = 'none';
			currentModal.classList.remove('fade-out');
		}, 700);
	}
}

function closeModalUsingButton(e) {
	const currentModal = this.closest('.modal');
	currentModal.classList.add('fade-out');
	document.body.style.overflow = "visible";
	setTimeout(function() {
		currentModal.style.display = 'none';
		currentModal.classList.remove('fade-out');
	}, 700);
}

function _getRightElement(element) {
	return element.closest('.portfolio-elem-wrapper');
}

window.onload = function() {
	
	// Fade out the intro
	window.addEventListener('scroll', fadeOut, false);

	// Event listeners for modals
	const portfolioItems = document.querySelectorAll('.portfolio-elem-wrapper');
	portfolioItems.forEach(function(portfolio) {
		portfolio.addEventListener('click', showModal, true);
	});
	const portfolioTitles = document.querySelectorAll('.portfolio-elem-wrapper div');
	portfolioTitles.forEach(function(portfolio) {
		portfolio.addEventListener('click', showModal, true);
	});
	const modals = document.querySelectorAll('.modal');
	modals.forEach(function(modal) {
		modal.addEventListener('click', closeModal, true);
	});
	const closeButton = document.querySelectorAll('.close-button');
	closeButton.forEach(function(button) {
		button.addEventListener('click', closeModalUsingButton, true);
	});
};

// Lazy load modal content
document.addEventListener("DOMContentLoaded", function() {
	var lazyImages = [].slice.call(document.querySelectorAll(".modal img"));
	if ("IntersectionObserver" in window) {
		let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					let lazyImage = entry.target;
					lazyImage.src = lazyImage.dataset.src;
					lazyImage.classList.remove("lazy");
					lazyImageObserver.unobserve(lazyImage);
				}
			});
		});

		lazyImages.forEach(function(lazyImage) {
			lazyImageObserver.observe(lazyImage);
		});
	} else {
		// Possibly fall back to a more compatible method here
	}
});