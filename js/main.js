"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl =
    "https://web-unicen.herokuapp.com/api/groups/016zapata/productos";

  let btnAdd = document.querySelector("#btnadd");
  let btnt = document.querySelector("#btntri");
  let btnConfirm = document.querySelector("#btnConfirm");

  let table = document.querySelector("#tabody");
  let filter = document.querySelector("#sel-price");

  btnAdd.addEventListener("click", insertPrenda);
  btnt.addEventListener("click", addt);

  //ACTUALIZAR TABLA
  setInterval(actualizarTabla, 1000);

  async function actualizarTabla() {
    const response = await apiGet(apiUrl);
    let tableContent = "";

    response.productos
      .filter((prenda) => filterTable(prenda.thing.price, filter.value))
      .sort(function (a, b) {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      })
      .forEach((element) => {
        const prenda = element.thing;
        tableContent +=
          `<tr><td>${prenda.marca}</td>` +
          `<td>${prenda.model}</td>` +
          `<td>${prenda.talle}</td>` +
          `<td>${prenda.price}</td>` +
          `<td><button class="delTr" data-id="${element._id}">X</button></td>` +
          `<td><button class="editPr" data-id="${element._id}">E</button></td></tr>`;
      });
    table.innerHTML = tableContent;

    //Declaracion y evento de los botones Borrar y Editar
    let btnDel = document.querySelectorAll(".delTr");
    btnDel.forEach((element) => {
      element.addEventListener("click", function (e) {
        delRow(e);
      });
    });
    let btnEdit = document.querySelectorAll(".editPr");
    btnEdit.forEach((element) => {
      element.addEventListener("click", function (e) {
        editRow(e);
      });
    });
  }
  actualizarTabla();

  //FILTRO
  function filterTable(precioPrenda, filter) {
    switch (filter) {
      case "A":
        return precioPrenda >= 0 && precioPrenda <= 8000;
      case "B":
        return precioPrenda > 8000 && precioPrenda <= 17000;
      case "C":
        return precioPrenda > 17000;
      default:
        return true;
    }
  }

  //AGREGAR PRENDA MANUAL
  function insertPrenda() {
    let prendauser = {
      marca: document.querySelector("#marca").value,
      model: document.querySelector("#modelo").value,
      talle: document.querySelector("#talle").value,
      price: document.querySelector("#precio").value,
    };
    apiPost(apiUrl, prendauser);
    actualizarTabla();
  }

  //AGREGAR 3 PREFAULT
  function addt() {
    let prendaa = {
      marca: "Nike",
      model: "Supreme",
      talle: "43°",
      price: "26000",
    };
    apiPost(apiUrl, prendaa);
    let prendab = {
      marca: "Nike",
      model: "Jordan",
      talle: "39°",
      price: "7000",
    };
    apiPost(apiUrl, prendab);
    let prendac = {
      marca: "Adidas",
      model: "Superstar",
      talle: "40°",
      price: "17000",
    };
    apiPost(apiUrl, prendac);
    actualizarTabla();
  }

  //ELIMINAR LINEA
  async function delRow(e) {
    const id = e.target.getAttribute("data-id");
    await apiDelete(apiUrl, id);

    actualizarTabla();
  }

  //EDITAR LINEA
  let idedit = 0;
  function editRow(e) {
    idedit = e.target.getAttribute("data-id");
    btnAdd.classList.add("remove");
    btnt.classList.add("remove");
    btnConfirm.classList.remove("remove");
  }
  btnConfirm.addEventListener("click", (event) => {
    event.preventDefault();
    confirmEdit();
  });
  async function confirmEdit() {
    let prendauser = {
      marca: document.querySelector("#marca").value,
      model: document.querySelector("#modelo").value,
      talle: document.querySelector("#talle").value,
      price: document.querySelector("#precio").value,
    };
    await apiPut(apiUrl, idedit, prendauser);
    btnAdd.classList.remove("remove");
    btnt.classList.remove("remove");
    btnConfirm.classList.add("remove");

    actualizarTabla();
  }
});

async function apiPut(url, id, thing) {
  let data = {
    thing,
  };
  try {
    const response = await fetch(url + "/" + id, {
      method: "PUT",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const parsedResponse = await response.json();
  } catch (e) {
    console.log(e);
  }
}

async function apiDelete(url, id) {
  try {
    const response = await fetch(url + "/" + id, {
      method: "DELETE",
    });
  } catch (e) {
    console.log(e);
  }
}

async function apiPost(url, thing) {
  let data = {
    thing,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const parsedResponse = await response.json();
  } catch (e) {
    console.log(e);
  }
}
async function apiGet(url) {
  try {
    const response = await fetch(url);

    const parsedResponse = await response.json();
    return parsedResponse;
  } catch (e) {
    console.log(e);
  }
}
