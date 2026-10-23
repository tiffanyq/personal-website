
// constants for intro fade out
const END_FADE_THRESHOLD = 300.0;
const START_FADE_THRESHOLD = 250.0;
const FADE_EXP = 0.3;
const MIN_INTRO_HEIGHT = 430;
const NUM_BACKGROUNDS = 50;

// constants for hearts
const MIN_EMOJI_SIZE = 10;
const EMOJI_MULTIPLIER = 28;
const TRAIL_SPACING = 8;
const TRAIL_FADE_MS = 1200;
let lastTrailX = null;
let lastTrailY = null;

function setRandomBackground() {
	const n = Math.floor(Math.random() * NUM_BACKGROUNDS) + 1;
	const filename = 'water_' + String(n).padStart(2, '0') + '.jpg';
	const url = new URL('backgrounds/' + filename, document.baseURI).href;
	document.documentElement.style.setProperty('--bg-image', 'url("' + url + '")');
}

function stampEmoji(e) {
	const emojiElement = document.createElement("div");
	emojiElement.innerText = "❤️";
	emojiElement.style.position = "fixed";
	emojiElement.style.zIndex = "-1";
	emojiElement.style.opacity = "0.5";
	// center the heart on the click point
	emojiElement.style.transform = "translate(-50%, -50%)";
	emojiElement.style.fontSize = (MIN_EMOJI_SIZE + Math.floor(Math.random() * EMOJI_MULTIPLIER)) + "px";
	emojiElement.style.userSelect = "none";
	emojiElement.style.pointerEvents = "none";
	emojiElement.style.left = e.clientX + "px";
	emojiElement.style.top = e.clientY + "px";
	document.body.appendChild(emojiElement);
}

function addTrailHeart(e) {
	if (lastTrailX !== null &&
		Math.hypot(e.clientX - lastTrailX, e.clientY - lastTrailY) < TRAIL_SPACING) {
		return;
	}
	lastTrailX = e.clientX;
	lastTrailY = e.clientY;

	const heart = document.createElement("div");
	heart.innerText = "❤️";
	heart.className = "trail-heart";
	heart.style.fontSize = (MIN_EMOJI_SIZE + Math.floor(Math.random() * EMOJI_MULTIPLIER / 2)) + "px";
	heart.style.zIndex = "-1";
	heart.style.left = e.clientX + "px";
	heart.style.top = e.clientY + "px";
	heart.style.animationDuration = TRAIL_FADE_MS + "ms";
	document.body.appendChild(heart);
	setTimeout(function() {
		heart.remove();
	}, TRAIL_FADE_MS);
}

function moveCursorHeart(e) {
	const heart = document.getElementById('cursor-heart');
	// mouse only </3
	if (e.pointerType !== 'mouse') {
		return;
	}
	heart.style.left = e.clientX + "px";
	heart.style.top = e.clientY + "px";
	heart.style.display = "block";
}

function hideCursorHeart(e) {
	document.getElementById('cursor-heart').style.display = "none";
}

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

	// Stamp a heart wherever someone clicks/taps
	document.addEventListener('click', stampEmoji);

	// Trail of fading hearts behind the cursor
	document.addEventListener('pointermove', addTrailHeart);

	// Heart that follows the cursor
	const cursorHeart = document.createElement("div");
	cursorHeart.id = "cursor-heart";
	cursorHeart.innerText = "❤️";
	document.body.appendChild(cursorHeart);
	document.addEventListener('pointermove', moveCursorHeart);
	document.documentElement.addEventListener('mouseleave', hideCursorHeart);

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

setRandomBackground(); // before page load

document.addEventListener("DOMContentLoaded", function() {
	console.log("hello thank you for stopping by :)");

	// not in use
	// Lazy load modal content
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