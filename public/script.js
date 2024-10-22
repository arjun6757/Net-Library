$(document).ready(function () {
  const add = $("#add-hyperlink");
  const URL = "https://songapi-au07.onrender.com";
  const gridContainer = $('.grid-container');
  const addDiv = $('#add-div');
  const cancel = $('input[type="button"][value="Cancel"]');
  const addForm = $('#add-form');
  const plusButton = `<a id="add-hyperlink"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></a>`
  let idOfItem = 0;

  $(document).on('click', '#add-hyperlink', toggleAddForm);
  // add.on('click', toggleAddForm);
  cancel.on('click', toggleAddForm);

  $(document).on('click', '#delete', function() {
    idOfItem = $(this).attr('data-id');
    deleteItem(idOfItem);
    console.log('the item you are trying to deleted: ', idOfItem);
  });

  function toggleCSS() {
    if(gridContainer.hasClass('active-small')){
      gridContainer.removeClass('active-small');
    } else {
      gridContainer.addClass('active-small');
    }
  }

  function toggleAddForm() {
    // add.toggle();
    $('#add-hyperlink').toggle();
    addDiv.toggle();
    toggleCSS();  
  }


  addForm.on('submit', function (e) {
    e.preventDefault();
    const item = {
      title: $('input[name="title"]').val(),
      artist: $('input[name="artist"]').val(),
      image: $('input[name="image"]').val(),
      stream: $('input[name="stream"]').val(),
    };

    console.log('item details: ', item);
    sendToDB(item);

    addDiv.toggle();

    $('#add-form')[0].reset();
    
    add.toggle();
    toggleCSS();
    // callAllItems();
  });


  async function callAllItems() {
    try {
      console.log('calling callAllItems');
      const response = await axios.get(`${URL}/api/songs/all`);
      console.log(response.data);
      const result = response.data;
      updateDisplay(result);
    } catch (error) {
      console.error("error fetching all data from the database");
    }
  }

  function updateDisplay(data) {
    gridContainer.empty(); //clear the existing grid
    let count = 0;
    data.forEach(item => {
      console.log("currently in the updateDisplay: ", item);
      const renderedItem = renderItems(item);
      // console.log('rendered item', renderedItem);
      gridContainer.append(renderedItem);
      count++;
    });

    console.log('count: ', count);

    gridContainer.append(plusButton);
    add.on('click', toggleAddForm);
  }

  function renderItems(item) {
    return `
        <div class="sub-grid-container">
        <div class="img-container">
          <img id="item-image" src="${item.image}" alt="" />
        </div>
        <span>${item.title} by ${item.artist}</span>
        <div class="buttons">
          <button id="edit" class="edit-btn" data-id="${item.id}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
              />
            </svg>
          </button>
          <button id="delete" data-id="${item.id}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
              />
            </svg>
          </button>
          <a draggable="false" href="${item.stream}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M320-120v-80H160q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v480q0 33-23.5 56.5T800-200H640v80H320ZM160-280h640v-480H160v480Zm0 0v-480 480Z"
              />
            </svg>
          </a>
        </div>
      </div>`
  }

  async function sendToDB(item) {
    try {
      const res = await axios.post(`${URL}/api/songs/add`, item);
      console.log('response: ', res);
      //updating display only if response is success
      callAllItems();
    } catch (err) {
      console.error("failed to send the item to the server ", err);
    }
  }

  async function deleteItem(id) {
    const yes = confirm("Are you sure you want to delete this item ? Click on 'Ok' to confirm");
    if(yes) {
      try {
        const response = await axios.delete(`${URL}/api/songs/delete/${id}`);
        console.log(`successfully deleted item at id: ${id}`, response);
        callAllItems();
      } catch (error) {
        console.error(`failed to delete item at id: ${id}`, error);
      }
    } 
  }
});