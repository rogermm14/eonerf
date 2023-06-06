/*

IMAGE COMPARISON SLIDER.

Used to compare 2 images by allowing a sliding/swiping action of one image over the second image. 
In addition, this version of the slider comes with buttons that allow one to change the left and right images based on the buttons created from available filenames. 

Last update: 19th January.

*/


var filenames = [
	['LiDAR', '../mesh_gallery/lidar.png'],
	['EO-NeRF', '../mesh_gallery/eonerf.png'],
	['Sat-NeRF', '../mesh_gallery/satnerf.png'],
	['MVS (MGM)', '../mesh_gallery/mgm.png'],
	['MVS (PSM)', '../mesh_gallery/psm.png']
]

// Window onload 
window.onload = function () {
	// Create left and right imagery tab buttons.
	createImageryTabs(filenames, 'img_left', 'img_right');

	// Initialize the slider box for comparison.
	var curr = document.getElementById('sliderbox');
	Array.from(curr.children).forEach(child => {
		var width = curr.offsetWidth + 'px';
		if (child.classList.contains('img-top')) {
			child.querySelector('img').style.width = width;
		}
		// Bind the dragging event to resizing.
		drag(curr.querySelector('.handle'), curr.querySelector('.img-top'), curr);
	});
};


// Window on resize
window.addEventListener('resize', function() {
	var curr = document.getElementById('sliderbox');
	Array.from(curr.children).forEach(child => {
		var width = curr.offsetWidth + 'px';
		if (child.classList.contains('img-top')) {
			child.querySelector('img').style.width = width;
		}
	});

});


function createImageryTabs(fileArray, leftImageId, rightImageId) {
	// Creates imagery tabs on both the left and right side containers.
	let allTabs = fileArray;
	fileArray.forEach((item) => {
		// ------Left Image Tabs-----
		// Create radio element with label.
		let leftElement = createRadioElement('leftSelection', item[0], 'l', false);
		let leftLabel = createInputLabel(item[0], item[0] + '_l', 'tabsSelect');

		// Add event that selects changes the left image.
		leftElement.addEventListener('click', (e) => {
			let leftImage = document.getElementById(leftImageId);
			leftImage.src = item[1];
		});

		// Check if this element is selected and apply the checked attribute to input.
		let currLeft = document.getElementById(leftImageId).src;
		if (currLeft.slice(currLeft.length - item[1].length) == item[1]) {
			leftElement.setAttribute('checked', 'checked');
		}

		// ------ Right Image Tabs -----
		// Create a radio element and label for the right image tab.
		let rightElement = createRadioElement('rightSelection', item[0], 'r', false);
		let rightLabel = createInputLabel(item[0], item[0] + '_r', 'tabsSelect');

		// Add event that changes the right image.
		rightElement.addEventListener('click', (e) => {
			let rightImage = document.getElementById(rightImageId);
			rightImage.src = item[1];
		});

		// Check if this element is selected and apply the checked attribute to input.
		let currRight = document.getElementById(rightImageId).src;
		if (currRight.slice(currRight.length - item[1].length) == item[1]) {
			rightElement.setAttribute('checked', 'checked');
		}
		
		// Add the radio buttons and labels to the dom.
		document.getElementById('leftLayersList').appendChild(leftElement);
		document.getElementById('leftLayersList').appendChild(leftLabel);
		document.getElementById('rightLayersList').appendChild(rightElement);
		document.getElementById('rightLayersList').appendChild(rightLabel);

	});
}


function createRadioElement(name, value, side, checked) {
	// Returns a radio element with a unique id, name, value and checked state set.
	var radioInput;
	try {
		var radioHtml = str(`<input type="radio" name="${name}" id="${value}_${side}"`);
		if (checked) {
			radioHtml += ' checked="checked"';
		}
		radioHtml += '/>';
		radioInput = document.createElement(radioHtml);

	} catch(err) {
		radioInput = document.createElement('input');
		radioInput.setAttribute('type', 'radio');
		radioInput.setAttribute('name', name);
		radioInput.setAttribute('id', value + '_' + side);
		radioInput.setAttribute('value', value);
		if (checked) {
			radioInput.setAttribute('checked', 'checked');
		}
	}
	return radioInput;
}


function createInputLabel(name, id, cssClass) {
	// Returns a label element with a set id and cssClass set.
	var labelValue = document.createElement('label');
	labelValue.setAttribute('for', id);
	labelValue.className += cssClass;
	labelValue.appendChild(document.createTextNode(name));
	return labelValue;
}


// Drag the slider across the window.
function drag(dragHandle, resizeElement, container) {
	// Initialize the drag handle and start of dragging on mousedown or touchstart.
	dragHandle.addEventListener('mousedown', startSliding);
	dragHandle.addEventListener('touchstart', startSliding);

	function startSliding(e) {
		dragHandle.classList.add('draggable');
		resizeElement.classList.add('resizable');

		// Prevent any other action that may occur when moving over the image.
		e.preventDefault();

		// Check if the event is a mouse or touch event and pass the value. - Remember to test with touchscreen as well.
		var startX = (e.pageX) ? e.pageX : e.touchEvent.touches[0].pageX;
		console.log('Event was', startX);

		// Get the initial position
		var dragWidth = dragHandle.getBoundingClientRect().width;
		var posX = dragHandle.getBoundingClientRect().left + dragWidth - startX;
		var containerOffset = container.getBoundingClientRect().left;
		var containerWidth = container.getBoundingClientRect().width;

		// Set limits to drag
		minLeft = containerOffset + 20;
		maxRight = containerOffset + containerWidth - dragWidth - 20;

		// Get the mousemove distance when dragging.
		dragHandle.parentNode.addEventListener('mousemove', slideAcross);
		dragHandle.parentNode.addEventListener('touchmove', slideAcross);

		function slideAcross(e) {
		 	// Check if it is a mouse or touch event.
			var moveX = (e.pageX) ? e.pageX : e.touchEvent.touches[0].pageX;
			leftValue = moveX + posX - dragWidth;

			// Make sure the minimum and maximum are within the container values.
			if (leftValue < minLeft) {
				leftValue = minLeft;
			} else if (leftValue > maxRight) {
				leftValue = maxRight;
			}

			// Calculate the dragHandle's left value and set that as the widthValue for element.
			widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';

			// Set the widthValue to the dragHandle and resizeElement div, depending on whether it is sliding.
			var slideDiv = document.querySelectorAll('.draggable')[0];
			if (slideDiv) {
				slideDiv.style.left = widthValue;
			}

			// Set this new value to the resizeElement div.
			var imgTopDiv = document.querySelectorAll('.resizable')[0];
			if (imgTopDiv) {
				imgTopDiv.style.width = widthValue;
			} 
		}

		// Stop sliding if mouseup event is detected. Invoked from the dragHandle as one event.
		dragHandle.parentNode.addEventListener('mouseup', stopSliding);
		dragHandle.parentNode.addEventListener('touchend', stopSliding);
		dragHandle.parentNode.addEventListener('touchcancel', stopSliding);

		function stopSliding(e) {
			dragHandle.classList.remove('draggable');
			resizeElement.classList.remove('resizable');
		}

	}

}

