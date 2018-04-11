contacts = [];


/* Event Subscriptions ========================================= */
EventManager.subscribe('addNewContact', newContact => {
	addContact(contacts, newContact)
});


EventManager.subscribe('AddedNewContact', contacts => {
	document.querySelector('.contacts__number').innerText = contacts.length
	makeContactList(contacts, '.contact')
});

EventManager.subscribe('DisplayContact', newContact => {
	displayContact(newContact)
});

EventManager.subscribe('OpenEditModal', contact => {
	loadDataOnEditForm(contact)
});


/* //============================================= */


/* Add New Contact=========================================

 * TODO: Add new contact to storage 
 * @param -- Array / Array[Object] | Object  
 * *return -- Array[Object]
*/

var addContact = (contactsArr = [], newContactValue = {}) => {
	contactsArr.push(newContactValue);
	EventManager.publish('AddedNewContact', contactsArr);
	return contactsArr;
}


/* Add New Contact=========================================

 * TODO: Constructs list of contacts
 * @param -- Array | String(a vaild css selector of the list container)  
 * *return -- Array[Object]
*/
const makeContactList = (contactsArr, domSelector) => {

	let contactsDomContainer = document.querySelector(domSelector),
		parser = new DOMParser();
	contactsDomContainer.innerHTML = "";

	contactsArr.forEach(contact => {
		let item = `<a class="contact__item" onclick="viewContact('${contact.id}')">
            <div class="col-2">
                <div class="contact__avatar">
                    <span class="contact__avatar-img">
                        ${contact.name.charAt(0).toUpperCase()}
                    </span>
                </div>
            </div>
            <div class="col-6">
                <div class="contact__details">
                    <h4 class="contact__details-name">${contact.name}</h4>
                    <span class="contact__details-number">${contact.phoneNumber}</span>
                </div>
            </div>
        </a>`;

		item = parser.parseFromString(item, 'text/html');
		item = item.firstChild.querySelector('.contact__item');
		contactsDomContainer.appendChild(item);
	});

	return contactsArr;
};



/* Add New Contact Form =========================================

 * TODO: Listens for submit event on contact form and 
 *       publish form data for adding to contacts
*/

const contact__form = document.getElementById('contact__form');

contact__form.addEventListener('submit', function (evt) {

	evt.preventDefault();
	let newContact = {
		id: Date.now(),
		name: this.querySelector('#name').value,
		phoneNumber: this.querySelector('#phone').value,
		email: this.querySelector('#email').value,
		address: this.querySelector('#address').value
	}

	EventManager.publish('addNewContact', newContact);

	this.querySelector('#name').value = ""
	this.querySelector('#phone').value = ""
	this.querySelector('#email').value = ""
	this.querySelector('#address').value = ""


});


/* Edit contact =========================================

 * TODO: Listens for submit event on edit contact form and 
 *       publish form data for updating to contacts
*/

const contact__form_update = document.getElementById('contact__form-update');
contact__form_update.addEventListener('submit', function (evt) {
	evt.preventDefault();


	const contactId = +this.getAttribute('data-id');


	const test = {
		name: this.querySelector('#name').value,
		phoneNumber: this.querySelector('#phone').value,
		email: this.querySelector('#email').value,
		address: this.querySelector('#address').value
	}




	contacts = contacts.map(contact => {
		if (contactId === contact.id) {
			return Object.assign({}, contact, test)
		}
		return contact;
	});

	EventManager.publish('AddedNewContact', contacts);
	document.getElementById('editContactModal').style.display = 'none';

});


/* Open Modal ============================================

 * TODO: Listens for click event on elements to open modal 
*/
const modalBtn = document.querySelectorAll('[modal]');
modalBtn.forEach(evt => {
	evt.addEventListener('click', function (evt) {
		const modal = evt.target.getAttribute('modal');
		document.querySelector(`#${modal}`).style.display = 'block';
	});
})

/* Delete Contact ============================================

 * TODO: Deletes contact from contact list. 
*/
const deleteBtn = document.getElementById('deleteBtn');
deleteBtn.addEventListener('click', function (evt) {
	const contactId = +this.getAttribute('data-id');

	contacts = contacts.filter(contact => contact.id !== contactId);

	EventManager.publish('AddedNewContact', contacts);
	document.getElementById('viewContactModal').style.display = 'none';


});


/* Edit Contact ============================================

 * TODO: Publish contact to edit to open on edit form. 
*/
const editBtn = document.getElementById('editBtn');
editBtn.addEventListener('click', function (evt) {
	const editId = +this.getAttribute('data-id');
	const contact = contacts.filter(contact => contact.id === editId);
	EventManager.publish('OpenEditModal', contact[0]);
})


/* View Contact ============================================

 * TODO: Publish contact to be viewed to open on view modal. 
*/
const viewContact = contactId => {
	document.getElementById('viewContactModal').style.display = 'block'
	contactId = +contactId;
	const contact = contacts.filter(contact => contact.id === contactId)[0];
	EventManager.publish('DisplayContact', contact);
}

/* Initialize Close Button ============================================

 * TODO: Attach event to close buttons on modals to make them close. 
*/

const modalCloseBtn = document.querySelectorAll('#footer__close-btn');
modalCloseBtn.forEach(btn => {
	btn.addEventListener('click', evt => {
		let modalToClose = evt.target.getAttribute('modal-close-btn');
		document.querySelector(`#${modalToClose}`).style.display = 'none';
	})
});


/* View Contact ============================================

 * TODO: Get contact to display on the contact modal. 
*/
const displayContact = contact => {
	const contact__view = document.querySelector('.contact__view');
	contact__view.querySelector('#name').innerText = contact.name;
	contact__view.querySelector('#phone').innerText = contact.phoneNumber;
	contact__view.querySelector('#email').innerText = contact.email;
	contact__view.querySelector('#address').innerText = contact.address;
	contact__view.querySelector('#editBtn').setAttribute('data-id', `${contact.id}`);
	contact__view.querySelector('#deleteBtn').setAttribute('data-id', `${contact.id}`);
}


/* Load Contact on Edit Form ============================================

 * TODO: Load contact to edit on edit form. 
*/
const loadDataOnEditForm = contact => {
	document.getElementById('viewContactModal').style.display = 'none';

	const editContactModal = document.getElementById('editContactModal');
	editContactModal.querySelector('#contact__form-update').setAttribute('data-id', `${contact.id}`);
	editContactModal.querySelector('#name').value = contact.name;
	editContactModal.querySelector('#phone').value = contact.phoneNumber;
	editContactModal.querySelector('#email').value = contact.email;
	editContactModal.querySelector('#address').value = contact.address;

	editContactModal.style.display = 'block';
}