/* Creando un objeto y dos variables que seleccionan los elementos del DOM que necesitamos */
const tasks = {};
const container = document.querySelector(".container");
const input = document.querySelector("#task");
const lista = document.querySelector("#thingsToDo");
const form = document.querySelector("#form");

/* Evento de envío en el formulario. 
Cuando se activa el evento, evitará el comportamiento predeterminado del formulario, que es actualizar la página. Luego verificará si la entrada está vacía. Si no está vacío, llamará a la función insertTask y pasará el valor de la entrada. Luego restablecerá el formulario y hace focus
el input del formulario */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim() !== "") {
    insertTask(input.value);
    form.reset();
    input.focus();
  }
});

/* Evento de clic en el elemento lista. Cuando se activa el evento, llama a la función de clic y 
pasa el evento como argumento. */
lista.addEventListener("click", (e) => {
  click(e);
});

/* Crear un nuevo objeto de tarea con una identificación aleatoria, el valor de la entrada y un estado falso. A continuación, inserta el nuevo objeto de tarea en el objeto tasks.Luego crea un nuevo elemento html con la identificación y el valor de la nueva tarea. Luego inserta el nuevo elemento al html */

const insertTask = (value) => {
  let newtask = {
    id: Math.random(32).toString(15).slice(3),
    title: value,
    status: false,
  };
  tasks[newtask.id] = newtask;

  const html = /* html */ `
        <li class="listTasks__task" data-id="${newtask.id}">
            <input data-action="tachar" readonly class="listTasks__p" value="${newtask.title}">
            <div class="listTasks__btns">
                <i data-action="borrar" class="listTasks__borrar fa-solid fa-trash-can"></i>
                <i data-action="editar" class="listTasks__editar fa-solid fa-pencil"></i>
            </div>
        </li>`;

  lista.insertAdjacentHTML("beforeend", html);
  console.log(`task added => id: ${newtask.id}`);
};

/* Comprueba si el elemento clikeado tiene el atributo data-action establecido en "tachar", "editar" o "borrar" y  si es así, realiza la acción correspondiente
 */
const click = (e) => {
  const action = e.target.dataset.action;

  if (action == "tachar") {
    const p = e.target;
    const id = e.target.parentElement.dataset.id;
    if (!tasks[id].status) {
      p.classList.add("tachado");
      tasks[id].status = true;
      console.log(`${tasks[id].status}`);
    } else {
      p.classList.remove("tachado");
      tasks[id].status = false;
      console.log(`${tasks[id].status}`);
    }
  }

  if (action == "borrar") {
    const li = e.target.parentElement.parentElement;
    const id = li.dataset.id;
    console.log(`${tasks[id].id} ${tasks[id].title} deleted`);

    const pop = /* html */ `
        <div class="wrapper">
          <div class="popup">
              <div class="popup__content">
                  <h3>¿Estas para eliminar una tarea?</h3>
                  <p class="popup__p">${tasks[id].title}</p>
                  <div class="popup__btns">
                    <div id= "si">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div id= "no">
                        <i id="no" class="fa-solid fa-x"></i>
                    </div>
                  </div>


                  </div>
              </div>
          </div>
        </div>
    `;

    container.insertAdjacentHTML("afterbegin", pop);

    const wrapper = document.querySelector(".wrapper");
    const si = document.querySelector("#si");
    const no = document.querySelector("#no");

    si.onclick = () => {
      li.style.opacity = 0;
      container.removeChild(wrapper);
      setTimeout(() => {
        li.style.display = "none";
        lista.removeChild(li);
      }, 500);
      delete tasks[id];
    };
    no.onclick = () => {
      container.removeChild(wrapper);
    };
  }

  if (action == "editar") {
    const p = e.target.parentElement.parentElement.firstElementChild;
    const id = e.target.parentElement.parentElement.dataset.id;
    const pInput = e.target.parentElement.parentElement.firstElementChild;

    if (!p.classList.contains("tachado")) {
      p.readOnly = false;
      p.placeholder = p.value;
      p.value = "";
      pInput.classList.add("wrapper", "centrar");
      p.focus();

      p.onkeydown = (e) => {
        if (e.key == "Enter") {
          p.value = p.value;
          p.readOnly = true;
          pInput.classList.remove("wrapper", "centrar");
          tasks[id].title = p.value;
        }
      };
    }
  }
};
