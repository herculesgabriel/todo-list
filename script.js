const inputText = document.getElementById('texto-tarefa');
const taskList = document.getElementById('lista-tarefas');
const buttonAddTask = document.getElementById('criar-tarefa');
const buttonRemoveSelected = document.getElementById('remover-selecionado');
const buttonClearSelection = document.getElementById('limpar-selecao');
const buttonMoveUp = document.getElementById('mover-cima');
const buttonMoveDown = document.getElementById('mover-baixo');
const buttonSave = document.getElementById('salvar-tarefas');
const buttonClearAll = document.getElementById('apaga-tudo');
const buttonClearDone = document.getElementById('remover-finalizados');

function clearAll() {
  const listItems = document.querySelectorAll('li');
  listItems.forEach((element) => taskList.removeChild(element));
}

function clearDone() {
  const listItems = document.querySelectorAll('.completed');
  if (listItems.length !== 0) listItems.forEach((element) => taskList.removeChild(element));
}

function clearSelection() {
  const item = document.querySelector('.selected');
  if (item !== null) item.classList.remove('selected');
}

function selectItem(event) {
  clearSelection();
  event.target.classList.add('selected');
}

function markItem(event) {
  event.target.classList.toggle('completed');
}

function isEmpty() {
  return inputText.value === '';
}

function clearInput() {
  inputText.value = '';
  inputText.focus();
}

function createItem() {
  const li = document.createElement('li');
  li.textContent = inputText.value;
  li.addEventListener('click', selectItem);
  li.addEventListener('dblclick', markItem);
  taskList.appendChild(li);

  clearInput();
}

function addTask() {
  return (isEmpty()) ? alert('Digite o texto antes de adicionar à lista!') : createItem();
}

function save() {
  localStorage.setItem('task_list', taskList.innerHTML);
}

function moveUp() {
  const item = document.querySelector('.selected');
  if (item !== null) if (item.previousSibling !== null) item.after(item.previousSibling);
}

function moveDown() {
  const item = document.querySelector('.selected');
  if (item !== null) if (item.nextSibling !== null) item.before(item.nextSibling);
}

function removeSelected() {
  const item = document.querySelector('.selected');
  if (item !== null) taskList.removeChild(item);
}

function getList() {
  taskList.innerHTML = localStorage.getItem('task_list');

  document.querySelectorAll('li').forEach((element) => {
    element.addEventListener('click', selectItem);
    element.addEventListener('dblclick', markItem);
  });
}

inputText.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') buttonAddTask.click();
});

buttonAddTask.addEventListener('click', addTask);
buttonClearAll.addEventListener('click', clearAll);
buttonClearDone.addEventListener('click', clearDone);
buttonSave.addEventListener('click', save);
buttonMoveUp.addEventListener('click', moveUp);
buttonMoveDown.addEventListener('click', moveDown);
buttonRemoveSelected.addEventListener('click', removeSelected);
buttonClearSelection.addEventListener('click', clearSelection);

getList();
