const body = document.querySelector('body')
const inputText = document.getElementById('texto-tarefa')
const taskList = document.getElementById('lista-tarefas')
const buttonAddTask = document.getElementById('criar-tarefa')
const buttonClearAll = document.getElementById('apaga-tudo')
const buttonClearDone = document.getElementById('remover-finalizados')
const buttonClearAllDone = document.getElementById('desmarcar-todos')
let currentMoving = document.querySelector('.moving')

function confirmDeleteAction() {
  const firstAnswer = confirm('Tem certeza que deseja apagar todas as tarefas?')
  if (!firstAnswer) return false
  const secondAnswer = confirm('Essa ação não poderá ser desfeita. Continuar?')
  if (!secondAnswer) return false
  return true
}

function clearAll() {
  if (!confirmDeleteAction()) return

  const listItems = document.querySelectorAll('li')
  listItems.forEach(element => taskList.removeChild(element))
  save()
  inputText.focus()
}

function clearDone() {
  const listItems = document.querySelectorAll('.completed')
  if (listItems.length !== 0) listItems.forEach(element => taskList.removeChild(element))
  save()
}

function clearSelection() {
  const item = document.querySelector('.selected')
  if (item !== null) item.classList.remove('selected')
  save()
}

function clearAllDone() {
  const items = document.querySelectorAll('.completed')
  if (items.length) {
    items.forEach(item => item.classList.remove('completed'))
    save()
  }
}

function selectItem(event) {
  clearSelection()
  if (event.target.nodeName === 'LI') {
    event.target.classList.add('selected')
  }
  save()
}

function markItem(event) {
  event.target.classList.toggle('completed')
  save()
}

function isEmpty() {
  return inputText.value === ''
}

function clearInput() {
  inputText.value = ''
  inputText.focus()
}

function addItemListDefaultListeners(item) {
  item.addEventListener('mouseenter', selectItem)
  item.addEventListener('mouseleave', clearSelection)
  item.addEventListener('dblclick', markItem)
}

function addButtonDefaultListeners(button) {
  button.addEventListener('click', editItem)
}

function createItem() {
  const li = document.createElement('li')
  const button = document.createElement('button')

  li.textContent = inputText.value
  li.classList.add('no-select')
  button.textContent = '🖉'
  button.classList.add('edit-button')

  addItemListDefaultListeners(li)
  addButtonDefaultListeners(button)

  li.appendChild(button)
  taskList.appendChild(li)

  save()
  clearInput()
}

function editItem(event) {
  const parentItem = event.target.parentNode
  const parentText = parentItem.textContent
  const taskList = document.getElementById('lista-tarefas')

  const input = document.createElement('input')
  input.value = parentText.slice(0, -2)
  taskList.insertBefore(input, parentItem)
  input.focus()

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      parentItem.textContent = input.value
      input.remove()

      const button = document.createElement('button')
      button.textContent = '🖉'
      button.classList.add('edit-button')
      addButtonDefaultListeners(button)
      parentItem.appendChild(button)

      save()
      inputText.focus()
    }
  })
}

function addTask() {
  return isEmpty() ? alert('Digite o texto antes de adicionar à lista!') : createItem()
}

function save() {
  localStorage.setItem('task_list', taskList.innerHTML)
}

const directions = {
  up: moveUp,
  down: moveDown
}

function move(direction) {
  if (!currentMoving) {
    const item = document.querySelector('.selected')
    item.classList.add('moving')
    currentMoving = document.querySelector('.moving')
  }

  directions[direction](currentMoving)
  save()
}

function moveUp(item) {
  if (item !== null && item.previousSibling !== null) item.after(item.previousSibling)
  save()
}

function moveDown(item) {
  if (item !== null && item.nextSibling !== null) item.before(item.nextSibling)
  save()
}

function removeSelected() {
  const item = document.querySelector('.selected')
  if (item !== null) taskList.removeChild(item)
  clearMoving()
  save()
}

function clearMoving() {
  currentMoving = null
  const item = document.querySelector('.moving')
  if (item !== null) item.classList.remove('moving')
}

function getList() {
  taskList.innerHTML = localStorage.getItem('task_list')

  document.querySelectorAll('li').forEach(addItemListDefaultListeners)
  document.querySelectorAll('.edit-button').forEach(addButtonDefaultListeners)
}

function keyPressedHandler(event) {
  if (event.key === 'Delete') removeSelected()
  if (event.key === 'ArrowUp') move('up')
  if (event.key === 'ArrowDown') move('down')
  if (event.key === 'Escape') clearMoving()
}

inputText.addEventListener('keydown', event => {
  if (event.key === 'Enter') buttonAddTask.click()
})

buttonAddTask.addEventListener('click', addTask)
buttonClearAll.addEventListener('click', clearAll)
buttonClearDone.addEventListener('click', clearDone)
buttonClearAllDone.addEventListener('click', clearAllDone)
body.addEventListener('keydown', keyPressedHandler)

getList()
