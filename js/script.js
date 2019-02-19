VK.init({
	apiId: 6680222
});

function auth () {
	return new Promise ((resolve, reject) => {
		VK.Auth.login((data) => {
			if (data.session) {
				resolve();
			} else {
				reject();
			}
		}, 262144)
	})
}

function callApi (method, params) {
	params.v = '5.84';

	return new Promise ((resolve, reject) => {
		VK.api(method, params, (data) => {
			if (data.error) {
				reject(data.error);
			} else {
				resolve(data.response);
			}
		})
	})
}

const template = document.querySelector('template').content;

function renderGroup (elem, container) {
	const group = template.cloneNode(true);

	group.querySelector('.lists__elem-img').setAttribute('src', elem.photo_100);
	group.querySelector('.lists__elem-title').textContent = elem.name;

	if (container.classList.contains('lists__ul-selected')) {
		group.querySelector('.lists__elem').classList.add('lists__elem--selected');
	}

	return group;
}

function renderData (data, container) {
		const fragment = document.createDocumentFragment();

		data.forEach(elem => {
			fragment.appendChild(renderGroup(elem, container));
		})

		container.appendChild(fragment);
}

(async () => {
	await auth();

	const groupsData = await callApi('groups.get', { extended: 1, fields: 'photo_100' });
	window.startData = groupsData.items;

	window.dataCloneStarted = window.startData.slice();
	window.dataCloneSelected = [];

	renderData(groupsData.items, startedUl);
})();


//  добавление-удаление по кнопке

const lists = document.querySelector('.filter__lists');

const replaceElem = (elem, to) => {
	elem.classList.toggle('lists__elem--selected');
	to.appendChild(elem);
}
const replaceHandler = (e, dragFlag, id) => {
	if (e.target.classList.contains('lists__elem-del') || dragFlag) {

		let elem = e.target.parentElement;

		if (dragFlag) {
			elem = document.getElementById(id);
		}

		const elemName = elem.querySelector('.lists__elem-title').textContent;

		if (elem.parentElement.classList.contains('lists__ul-started')) {
			const toUl = document.querySelector('.lists__ul-selected');
			for (let i = 0; i < window.dataCloneStarted.length; i++) {
				if (window.dataCloneStarted[i].name == elemName) {
					window.dataCloneSelected.push(window.dataCloneStarted[i]);
					window.dataCloneStarted.splice(i, 1);
				}
			}
			if (elemName.toLowerCase().includes(inputSelected.value.toLowerCase())) {
				replaceElem(elem, toUl);
			} else {
				elem.remove();
			}
		} else {
			const toUl = document.querySelector('.lists__ul-started');
			for (let i = 0; i < window.dataCloneSelected.length; i++) {
				if (window.dataCloneSelected[i].name == elemName) {
					window.dataCloneStarted.push(window.dataCloneSelected[i]);
					window.dataCloneSelected.splice(i, 1);
				}
			}
			if (elemName.toLowerCase().includes(inputStarted.value.toLowerCase())) {
				replaceElem(elem, toUl);
			} else {
				elem.remove();
			}
		}	
	}
}

lists.addEventListener('click', replaceHandler);

// drag and drop

lists.addEventListener('dragstart', (e) => {
	console.log(e.target.parentElement);
	e.target.id = Math.random();
	e.dataTransfer.setData("id", e.target.id);
})
const groupLists = document.querySelectorAll('.lists__ul');

const dragoverHandler = (e) => {
	e.preventDefault();
}
const dropHandler = (e) => {
	const id = e.dataTransfer.getData("id");
	replaceHandler(e, true, id);
}

for (var i = 0; i < groupLists.length; i++) {
	groupLists[i].addEventListener('dragover', dragoverHandler);
	groupLists[i].addEventListener('drop', dropHandler);
}

// фильтры

const inputStarted = document.querySelector('#started');
const inputSelected = document.querySelector('#selected');
const startedUl = document.querySelector('.lists__ul-started');
const selectedUl = document.querySelector('.lists__ul-selected');

const onInputKeyUp = (e) => {
	let data = window.dataCloneSelected;
	let ul = selectedUl;

	if (e.target.id == 'started') {
		data = window.dataCloneStarted;
		ul = startedUl;
	}

	const filterArr = [];

	for (let i = 0; i < data.length; i++) {
		if (data[i].name.toLowerCase().includes(e.target.value.toLowerCase())) {
			filterArr.push(data[i]);
		}
	}

	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}

	renderData(filterArr, ul);
}

inputStarted.addEventListener('keyup', onInputKeyUp);
inputSelected.addEventListener('keyup', onInputKeyUp);

// сохранение в localStorage

const saveButton = document.querySelector('.filter__save-button');

saveButton.addEventListener('click', () => {
	localStorage.startGroups = JSON.stringify(window.dataCloneStarted);
	localStorage.selectedGroups = JSON.stringify(window.dataCloneSelected);
})




