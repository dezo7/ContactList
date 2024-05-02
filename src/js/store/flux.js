const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			contacts: []
		},
		actions: {
			loadContacts: () => {
				fetch("https://playground.4geeks.com/contact/agendas/Dezouk/contacts")
					.then(response => response.json())
					.then(data => {
						setStore({ contacts: data.contacts });
					})
					.catch(error => {
						console.error("Error al obtener los contactos:", error);
					});
			},
			addContact: newContact => {
				return new Promise((resolve, reject) => {
					fetch("https://playground.4geeks.com/contact/agendas/Dezouk/contacts", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(newContact)
					})
						.then(response => response.json())
						.then(data => {
							setStore({ contacts: [...getStore().contacts, data] });
							resolve(data);
						})
						.catch(error => {
							console.error("Error al añadir el contacto:", error);
							reject(error);
						});
				});
			},
			modifyContact: (id, modifiedContact) => {
				return new Promise((resolve, reject) => {
					fetch(`https://playground.4geeks.com/contact/agendas/Dezouk/contacts/${id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(modifiedContact)
					})
						.then(response => {
							if (!response.ok) {
								throw new Error('HTTP status ' + response.status);
							}
							return response.json();
						})
						.then(data => {
							const updatedContacts = getStore().contacts.map(contact =>
								contact.id === id ? { ...contact, ...data } : contact
							);
							setStore({ contacts: updatedContacts });
							resolve(data);
						})
						.catch(error => {
							console.error("Error al modificar el contacto:", error);
							reject(error);
						});
				});
			},
			deleteContact: id => {
				return new Promise((resolve, reject) => {
					fetch(`https://playground.4geeks.com/contact/agendas/Dezouk/contacts/${id}`, {
						method: "DELETE"
					})
						.then(response => {
							if (!response.ok) {
								throw new Error('HTTP status ' + response.status);
							}
							const contacts = getStore().contacts.filter(contact => contact.id !== id);
							setStore({ contacts: contacts });
							resolve();
						})
						.catch(error => {
							console.error("Error al eliminar el contacto:", error);
							reject(error);
						});
				});
			}
		}
	};
};

export default getState;