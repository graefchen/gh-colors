import json from '../json/languages.json' assert { type: 'json' };

const languageArray = json;

document.getElementById('search').value = "";

// Getting the correct input value
var div = document.getElementById("search-div");
var cardHolder = document.getElementById("cards");
var temporaryHolder = document.getElementById("temp");

/**
 * A function that inverts an Color and returns the inverted hexcode
 * in this case it is special and therefor the returned hexcode
 * is either black(#000000) or white(#FFFFFF)
 * @see https://stackoverflow.com/a/35970186
 * @param {*} hex 
 * @returns 
 */
function invertColor(hex) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);
	// https://stackoverflow.com/a/3943023/112731
	// slightly moddified for better look on some colours
	return (r * 0.299 + g * 0.587 + b * 0.334) > 186
		? '#000000'
		: '#FFFFFF';
}

/**
 * A simple function that swaps two nodes in the DOM in HTML
 * @see https://stackoverflow.com/a/44562952
 * @param {*} n1 
 * @param {*} n2 
 * @returns 
 */
function swapNodes(n1, n2) {

	var p1 = n1.parentNode;
	var p2 = n2.parentNode;
	var i1, i2;

	if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

	for (var i = 0; i < p1.children.length; i++) {
		if (p1.children[i].isEqualNode(n1)) {
			i1 = i;
		}
	}
	for (var i = 0; i < p2.children.length; i++) {
		if (p2.children[i].isEqualNode(n2)) {
			i2 = i;
		}
	}

	if (p1.isEqualNode(p2) && i1 < i2) {
		i2++;
	}
	p1.insertBefore(n2, p1.children[i1]);
	p2.insertBefore(n1, p2.children[i2]);
}

/**
 * An UTF-8 encode algorithm to encode to UTF-8
 * @see http://www.webtoolkit.info/javascript_utf8.html
 * @param {*} string 
 * @returns 
 */
function encode(string) {
	string = string.replace(/\r\n/g,"\n");
	var utftext = "";
	for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		}
		else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		}
		else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}
	return utftext;
}

/**
 * Creating a normal card
 * @param {Object[]} e
 */
const createCard = (e) => {
	var card = document.createElement('div');
	if (e.color != undefined) {
		card.style.color = invertColor(e.color);
		card.style.backgroundColor = e.color;
	} else {
		card.style.backgroundColor = "#CCC";
		card.style.color = "#000";
	}
	var name = document.createElement('div');
	name.className = "name";
	name.innerHTML = e.name
	card.appendChild(name);
	card.className = "card"
	card.id = e.name;
	// card.style.backgroundColor = e.color;
	card.style.display = "flex";
	cardHolder.appendChild(card);
}

/**
 * Creating a detailed card
 * @param {Object[]} e 
 */
const createDetailedCard = (e) => {
	var websites = document.createElement('p');
	websites.innerHTML = `<a target=\"_blank\" href=\"https://github.com/topics/${e.name}l=${e.name}\">Github</a> - <a target=\"_blank\" href=\"https://github.com/trending/${e.name}?since=daily&spoken_language_code=\">Github Trending</a> - <a target=\"_blank\" href=\"https://google.com/search?q=${encode(`${e.name} ${e.type} language`)}\">Google</a>`;

	var hexcode = document.createElement('p');
	if (e.color != undefined) {
		hexcode.innerHTML = "Hexcode: " + e.color.toUpperCase();
	} else {
		hexcode.innerHTML = "No Color. (Using #CCC)";
	}

	var type = document.createElement('p');
	// Capitalise the first char
	const nameStr = e.type;
	const nameStr2 = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
	// Adding the Type
	type.innerHTML = "Type: " + nameStr2;

	var extensionList = document.createElement('p');
	extensionList.innerHTML = "Extensions:"

	var exlist = document.createElement('ul');
	if (e.extensions != undefined) {
		e.extensions.forEach(e => {
			var listChild = document.createElement('li');
			listChild.innerHTML = e;
			exlist.appendChild(listChild);
		});
	} else {
		extensionList.innerHTML = "Extensions: No Extensions"
	}

	var filenameList = document.createElement('p');
	filenameList.innerHTML = "Filenames:";

	var flist = document.createElement('ul');
	if (e.filenames != undefined) {
		e.filenames.forEach(e => {
			var listChild = document.createElement('li');
			listChild.innerHTML = e;
			flist.appendChild(listChild);
		});
	} else {
		filenameList.innerHTML = "Filenames: No Filenames";
	}

	var face2 = document.createElement('div');
	face2.className = "face face2";
	extensionList.appendChild(exlist);
	filenameList.appendChild(flist);
	face2.appendChild(websites);
	face2.appendChild(hexcode);
	face2.appendChild(type);
	face2.appendChild(extensionList);
	face2.appendChild(filenameList);

	var face1 = document.createElement('div');
	face1.className = "face face1";
	face1.innerHTML = "<p>" + e.name; + "</p>";

	var card = document.createElement('div');
	card.appendChild(face1);
	card.appendChild(face2);
	card.className = "card"
	if (e.color != undefined) {
		card.style.color = invertColor(e.color);
		card.style.backgroundColor = e.color;
	} else {
		card.style.backgroundColor = "#CCC";
		card.style.color = "#000";
	}
	card.id = e.name;
	temporaryHolder.appendChild(card);
}

/**
 * Finds the language in the array and returns an array with that language
 * @param {*} languagename 
 * @returns Object/s
 */
const findLanguage = (languagename) => {
	return languageArray.filter(e => e.name == languagename);
}

// Sort the array... Could have done this at a different place...
languageArray.sort((a, b) => a.name.localeCompare(b.name));

languageArray.forEach(e => {
	// creting a card with element e
	createCard(e, cardHolder);
});
addObserver();

// Adding the event listener to the input
div.querySelector("input").addEventListener("input", (e) => {
	// Clearing out the div
	cardHolder.innerHTML = "";
	// Getting the value of what is written in the field
	var st2 = e.target.value.toLowerCase();

	const filteredArray = languageArray.filter(v => v.name.toLowerCase().indexOf(st2) >= 0);
	const mappedArray = filteredArray.map((value, index) => {
		var position = value.name.toLowerCase().indexOf(st2);
		var name = value.name;
		return ({ name, index, position });
	});

	mappedArray.sort((a, b) => a.position - b.position);

	mappedArray.forEach(e => {
		// creting a card with element e
		createCard(filteredArray[e.index], temporaryHolder);
	});
	addObserver();
});

/**
 * Function to add the observer
 */
function addObserver() {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if(entry.target.id == "temp")
				return
			if(entry.isIntersecting) {
				const name = entry.target.id;
				const language = findLanguage(name);
				var t1 = document.getElementById(name);
				t1.id = "temp";
				createDetailedCard(language[0]);
				var t2 = document.getElementById(name);
				swapNodes(t1, t2);
				t1.remove();
			}
		});
	});
	
	const elements = document.querySelectorAll('.card');
	elements.forEach((e) => observer.observe(e));
}
