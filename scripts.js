// Fetch six users
var url = 'https://jsonplaceholder.typicode.com/users?_start=0&_limit=6';
const fetchData = async () => {
    fetch(url)
        .then((response) => response.body)
        .then((rb) => {
            const reader = rb.getReader();

            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                // console.log('done', done);
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            // console.log(done, value);
                            push();
                        });
                    }

                    push();
                },
            });
        })
        .then((stream) =>
            // Respond with our stream
            new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text()
        )
        .then((result) => {
            // Do things with result
            // console.log(JSON.parse(result));
            renderCards(JSON.parse(result))
        });
}
fetchData()

//! CREATE CARDS
const renderCards = (data) => {
    var grid = document.getElementById('grid')

    data.forEach(element => {
        // console.log(element);
        const { name, company, email } = element

        let card = document.createElement("div")
        card.classList.add("card");

        let nameCard = document.createElement("h4")
        nameCard.classList.add("card-name");
        nameCard.innerText = name
        card.append(nameCard)


        let companyName = document.createElement("p")
        companyName.classList.add("card-company");
        companyName.innerHTML = `Company: <b>${company.name}</b>`
        card.append(companyName)

        let emailCard = document.createElement("p")
        emailCard.classList.add("card-company");
        emailCard.innerHTML = `Email: <b>${email}</b>`
        card.append(emailCard)

        let lensDiv = document.createElement('div')
        lensDiv.classList.add("card-lens");
        let optic = document.createElement('img')
        optic.src = "/images/icon-supervisor.svg"
        lensDiv.addEventListener('click', (event) => toggleModal(event, element))
        lensDiv.append(optic)
        card.append(lensDiv)

        grid.append(card)
    });
}

//! MODAL EVENT LISTENERS
let modalBackdrop = document.getElementById('modal-backdrop')
let modal = document.getElementById('modal')
let closeX = document.getElementById('close')
modalBackdrop.addEventListener('click', (e) => toggleModal(e, null))
modal.addEventListener('click', (e) => e.stopPropagation())
closeX.addEventListener('click', (e) => toggleModal(e, null))

//! MODAL RENDER FIELDS
const renderModal = (element) => {
    const { name, company, username, address, phone, email, website } = element
    document.getElementById('modal-name').innerHTML = name
    document.getElementById('modal-company').innerHTML = company.name
    document.getElementById('username').innerHTML = `<b>Username: </b><br/>${username}`
    document.getElementById('phone').innerHTML = `<b>Phone: </b><br/>${phone}`
    document.getElementById('email').innerHTML = `<b>Email: </b><br/>${email}`
    document.getElementById('website').innerHTML = `<b>Website:</b><br/>${website}`
    document.getElementById('address').innerHTML = `<div><b>Address:<br/></b>
            <p>${address.city}</p>
            <p>${address.street}</p>
            <p>${address.suite}</p>
            </div>`
}

//! MODAL TOGGLE WINDOW
const toggleModal = (e, element) => {
    e.stopPropagation()

    if (element !== null) {

        renderModal(element)
        modalBackdrop.classList.add('show')
    } else {
        modalBackdrop.classList.remove('show')
    }
}
