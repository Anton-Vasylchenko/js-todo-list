(function() {
    
  const objOfTasks = getLocalStorage();

  function saveLocalStorage(obj) {
    localStorage.setItem('all_tasks', JSON.stringify(obj));
  }

  function getLocalStorage() {
    if(localStorage.getItem('all_tasks')) {               
      const arrayOfObject = JSON.parse(localStorage.getItem('all_tasks'));      
      return arrayOfObject;
    }
    const arrayOfObject = {};
    return arrayOfObject;
  }
  
  const themes = {
    default: {
      '--body-bg': 'url("img/default.png")',
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0069d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--completed-btn-bg': '#39c779',
      '--completed-btn-text-color': '#fff',
      '--completed-btn-hover-bg': '#175c06',
      '--completed-btn-border-color': '#2ea573',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    dark: {
      '--body-bg': 'url("img/dark.png")',
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--completed-btn-bg': '#279057',
      '--completed-btn-text-color': '#fff',
      '--completed-btn-hover-bg': '#175c06',
      '--completed-btn-border-color': '#279057',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
    light: {
      '--body-bg': 'url("img/light.png")',
      '--base-text-color': '#212529',
      '--header-bg': '#eee',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--completed-btn-bg': '#8bf7bb',
      '--completed-btn-text-color': '#212529',
      '--completed-btn-hover-bg': '#39c779',
      '--completed-btn-border-color': '#279057',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
  };

  // Elemnts UI
  const listContainer = document.querySelector(
    '.tasks-list-section .list-group',
  );
  const form = document.forms['addTask'];
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  const tabsBtn = document.querySelector('.tabs-btn');  
  const themeSelect = document.getElementById("themeSelect");
  const complCount = document.querySelector('.completed-count');
  const progCount = document.querySelector('.progress-count');
  let lastSelectedTheme = localStorage.getItem('app_theme') || 'default';  
  let activeBtn = 'all';
  
  // Events
  themeSelect.value = lastSelectedTheme;
  setTheme(lastSelectedTheme);
  renderAllTasks(objOfTasks);
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeletehandler);
  listContainer.addEventListener('click', onCompletehandler);
  listContainer.addEventListener('click', onConfirmDeleteHandler);
  tabsBtn.addEventListener('click', onChangeTasksList);
  themeSelect.addEventListener('change', onThemeSelectHandler);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error('Передайте список задач!');
      return;
    }

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);   
    messageEmptyList(); 
  }

  function listItemTemplate({ _id, title, body, completed } = {}) {
    const liClassList = [
      "list-group-item", 
      "d-flex", 
      "align-items-center", 
      "flex-wrap",       
      "mb-2",
      "position-relative",
      "text-break"      
    ]
    const li = createNewElement("li", '', liClassList);
    li.setAttribute('data-task-id', _id);
    li.setAttribute('data-status', completed);
  
    const elementsTasks = [];

    const popup = createNewElement("div", "test", ["modal", "w-100"]);        

    const span = createNewElement("span", title);    
    span.style.fontWeight = "bold";

    const deleteBtnClassList = ["btn", "btn-danger", "ml-auto", "delete-btn"];
    const deleteBtn = createNewElement("button", "Delete task", deleteBtnClassList);    

    const completeBtnClassList = ["btn", "btn-warning", "ml-2", "complete-btn"];
    const completeBtn = createNewElement("button", "In progress", completeBtnClassList);        

    const article = createNewElement("p", body, ["mt-2", "w-100"]);   

    const modalDel = createDelModal(title);
    
    if (completed) {
      li.classList.add("list-group-item-success");
      span.style.textDecoration = "line-through";
      article.style.textDecoration = "line-through";  
      completeBtn.textContent = "Completed";
      completeBtn.classList.remove('btn-warning');
      completeBtn.classList.add('btn-success');
    }

    elementsTasks.push(span, article, deleteBtn, completeBtn, popup, modalDel);

    elementsTasks.forEach(el => {
      li.appendChild(el)
    });
            
    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;
    const errors = checkInput(inputTitle, inputBody);     

    if(errors.length) {
      return;
    }  

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement('afterbegin', listItem);
        
    listContainer.textContent = "";

    saveLocalStorage(objOfTasks);

    const newObj = getLocalStorage();
    const newTasks = filterTaskByStatus(newObj, activeBtn);
    renderAllTasks(newTasks);
    
    totalTaskOfStatus();
    form.reset();
  }

  function checkInput(...inputs) {
    const errors = [];
    inputs.forEach(el => {    
      el.classList.remove("border-danger");       
      if(!el.value) {         
        el.classList.add("border-danger"); 
        errors.push("input is empty");
      }
    })
    return errors;
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    };

    objOfTasks[newTask._id] = newTask;    
    return { ...newTask };
  }

  function createNewElement(nameElement, textContent, classArray = []) 
  {
    let el = document.createElement(nameElement);
    el.textContent = textContent;
    if(!classArray.length) return el;
    classArray.forEach( className => {
      el.classList.add(className);
    });
    return el;
  }

  function createDelModal(title) {
    if(title.length > 50) {
      title =  title.slice(0, 50);
      title += '...';
    }

    wraperModalClassList = ["card", "h-100", "w-100", "position-absolute", "del-modal", "d-none"];        
    const wrapperModalDel = createNewElement("div",'', wraperModalClassList);
    wrapperModalDel.style.background = "rgb(231, 133, 133, .9)";
    wrapperModalDel.style.left = "0";
    const modalDiv = createNewElement("div",'', ["card-body", "text-center"]);   
    const textForTitleModal = `Are you sure you want to delete the task: "${title}" ?`;
    const titleModal = createNewElement("h5", textForTitleModal, ["card-title", "text-white", "mb-3"]);    
    const btnYes = createNewElement("button", "YES", ["btn", "btn-info", "mr-2", "btn-yes", "mt-1"]);        
    btnYes.setAttribute("data-confirm", "true");
    const btnNo = createNewElement("button", "NO", ["btn", "btn-info", "btn-no", "mt-1"]);        
    btnNo.setAttribute("data-confirm", "false");
    modalDiv.appendChild(titleModal);
    modalDiv.appendChild(btnYes);
    modalDiv.appendChild(btnNo);
    wrapperModalDel.appendChild(modalDiv);    

    return wrapperModalDel;
  }

  function deleteTask(id) {  
    const { title } = objOfTasks[id];        
    delete objOfTasks[id];

    saveLocalStorage(objOfTasks);    

    totalTaskOfStatus()
    return true;    
  }

  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  function onConfirmDeleteHandler({ target }) {
    if (target.classList.contains('btn-yes')) { 

      const parent = target.closest('[data-task-id]');      
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent);

    } else if (target.classList.contains('btn-no')) {
      
      const modalDel = target.closest('.del-modal');
      modalDel.classList.toggle("d-none");

      return false;
    }
    messageEmptyList();
  }

  function onDeletehandler({ target }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest("[data-task-id]");        
      const del = parent.querySelector(".del-modal");
    
      del.classList.toggle("d-none");                    
    }
  }

  function onCompletehandler({ target }) {
    if (target.classList.contains('complete-btn')) { 
      const parent = target.closest("[data-task-id]");        
      const id = parent.dataset.taskId;
      const status = objOfTasks[id].completed;
      objOfTasks[id].completed = !status;
      
      totalTaskOfStatus();

      saveLocalStorage(objOfTasks);
      аobjOfTasks = getLocalStorage();

      const newTasks = filterTaskByStatus(аobjOfTasks, activeBtn);

      listContainer.textContent = '';
      renderAllTasks(newTasks);
    }
  }

  function changeActiveBtns(target) {
    const parent = target.closest(".btn-group");    
    for(let i = 0; i < parent.childElementCount; i++) {
      if(parent.children[i].classList.contains("btn-info")) {
        parent.children[i].classList.remove("btn-info");
      }
    }  
    target.classList.add("btn-info");
  }

  function onChangeTasksList({ target }) {
    activeBtn = target.dataset.name;
    changeActiveBtns(target);
    const filterTasks = filterTaskByStatus(objOfTasks, activeBtn);      
    
    listContainer.textContent = '';
    renderAllTasks(filterTasks);     
    messageEmptyList();
  }
  
  function filterTaskByStatus(obj, status) {
    const newObj = {}

    if(status === "all") return { ...obj };

    for (const key in obj) {
      if(String(obj[key].completed) === status) {
        newObj[key] = { ... obj[key] }        
      }
    }
    return newObj    
  }

  function messageEmptyList() {       
    const btnGroup = document.querySelector(".btn-group");
    let name = '';

    for(let i = 0; i < btnGroup.childElementCount; i++) {
      if(btnGroup.children[i].classList.contains("btn-info")) {
        name = btnGroup.children[i].textContent;
      }
    }     
    if(!listContainer.childElementCount) {      
      const li = document.createElement('li');
      const h4 = document.createElement('span');
      h4.textContent = `${name} list empty`;
      li.appendChild(h4);
      li.classList.add(
        "list-group-item",
        "text-center",
        "list-group-item-dark",
        "empty-msg",        
      );
      listContainer.appendChild(li);
    } 
  }

  function totalTaskOfStatus() {

    const objOfResult = {
      inProgress: 0,
      completed: 0
    };
    
    for (const key in objOfTasks) {
      if(objOfTasks[key].completed === true) {
        objOfResult.completed++
      } else {
        objOfResult.inProgress++
      }
    }
    
    complCount.textContent = objOfResult.completed + ';';
    progCount.textContent = objOfResult.inProgress + ';';
    
  }

  totalTaskOfStatus();

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;

    setTheme(selectedTheme);
    lastSelectedTheme = selectedTheme;
    localStorage.setItem('app_theme', selectedTheme);
  } 

  function setTheme(name) {
    const selectedThemeObj = themes[name];
    Object.entries(selectedThemeObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    })
  }
})();
