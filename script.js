// Функция для выполнения запросов к API GitHub
async function fetchRepositories(query) {
	const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
	const data = await response.json();
	return data.items.slice(0, 5);
}
// Функция для создания элемента списка автодополнений
function createAutocompleteItem(repository) {
	const item = document.createElement('div');
	item.textContent = repository.name;
	item.addEventListener('click', () => {
		addRepository(repository);
		clearAutocomplete();
	});
	return item;
}
// Функция для отображения списка автодополнений
function showAutocomplete(repositories) {
	const autocompleteItems = document.querySelector('.autocomplete-items');
	autocompleteItems.innerHTML = '';
	repositories.forEach(repository => {
		autocompleteItems.appendChild(createAutocompleteItem(repository));
	});
	autocompleteItems.style.display = 'block';
}
// Функция для очистки списка автодополнений
function clearAutocomplete() {
	const autocompleteItems = document.querySelector('.autocomplete-items');
	searchInput.value = '';
	autocompleteItems.style.display = 'none';
}
// Функция для добавления репозитория в список
function addRepository(repository) {
	const repositoryList = document.querySelector('.repository-list');
	const listItem = document.createElement('li');
	listItem.innerHTML = `
		 <div class='wrapper-block'>
		 	<div class= 'list-text'>
			 	<div>Name: ${repository.name}</div>
				 <div>Owner: ${repository.owner.login}</div>
				 <div>Stars: ${repository.stargazers_count}</div>
			 </div>
			 <button class = "delete-button">
			 <span class="cross-icon"></span>
			 </button>
		 </div>
	`;
	listItem.querySelector('button').addEventListener('click', () => {
		listItem.remove();
	});
	repositoryList.appendChild(listItem);
}
// Функция debounce для отложенного выполнения запросов к API GitHub
function debounce(func, delay) {
	let timeoutId;
	return function () {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(func, delay);
	};
}
// Основная функция для обработки событий и инициализации приложения
function initApp() {
	const searchInput = document.getElementById('searchInput');
	// Обработчик для поля ввода
	searchInput.addEventListener('input', debounce(async function () {
		const query = searchInput.value.trim();
		if (query === '') {
			clearAutocomplete();
			return;
		}
		const repositories = await fetchRepositories(query);
		showAutocomplete(repositories);
	}, 500));
	// Обработчик для клика вне поля ввода
	document.addEventListener('click', function (event) {
		if (!event.target.matches('#searchInput')) {
			clearAutocomplete();
		}
	});
}
// Инициализация приложения
initApp();
