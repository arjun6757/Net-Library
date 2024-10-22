$(document).ready(function () {
    const URL = "https://songapi-au07.onrender.com";
    const exit = $('input[type="button"][value="Exit"]');
    const gridContainer = $('.grid-container');
    let id = 0;
    const editDiv = $('#edit-div');
    const editCancel = $('#edit-cancel');
    // const save = $('input[type="submit"][value="Save"]');
    const editForm = $('#edit-form');
    const plusButton = `<a id="add-hyperlink"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></a>`

    exit.on('click', function () {
        resetInput();
        $('#add-hyperlink').toggle();
        toggleCSS();
    });

    editForm.on('submit', function (e) {
        const item = {
            title: $(this).find('input[name="title"]').val(),
            artist: $(this).find('input[name="artist"]').val(),
            image: $(this).find('input[name="image"]').val(),
            stream: $(this).find('input[name="stream"]').val(),
        };

        e.preventDefault();
        postChanges(item);
        toggleCSS();
    });

    $(document).on('click', '.edit-btn', function () {
        editDiv.toggle();
        $('#add-hyperlink').toggle();
        id = $(this).attr('data-id');
        contentOfSelectedItem(id);
        console.log('id of the button you clicked: ', id);
        toggleCSS();
    });

    function toggleCSS() {
      if(gridContainer.hasClass('active-small')){
        gridContainer.removeClass('active-small');
      } else {
        gridContainer.addClass('active-small');
      }
    }

    function resetInput() {
        $('input[name="title"]').val('');
        $('input[name="artist"]').val('');
        $('input[name="image"]').val('');
        $('input[name="stream"]').val('');
    }

    async function contentOfSelectedItem(id) {
        try {
            const response = await axios.get(`${URL}/api/songs/${id}`);
            const result = response.data;
            const itemData = result.rows[0];
            console.log('data from selected item: ', itemData);
            updateEditForm(itemData);
        } catch (error) {
            console.error('failed to fetch data by id!');
        }
    }

    function updateEditForm(data) {
        $('input[name="title"]').val(`${data.title}`);
        $('input[name="artist"]').val(`${data.artist}`);
        $('input[name="image"]').val(`${data.image}`);
        $('input[name="stream"]').val(`${data.stream}`);
    }

    async function postChanges(item) {
        try {
            console.log('updated data: ', item);
            const response = await axios.put(`${URL}/api/songs/edit/${id}`, item);
            console.log(response);
            editDiv.toggle();
            callAllItems();
            resetInput();
        } catch (error) {
            console.error('failed to post changes after editing the data', error);
        }
    }

    editCancel.on('click', function (e) {
        e.preventDefault();
        editDiv.toggle();
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

        gridContainer.append(plusButton);
        console.log("count: ", count);
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
});