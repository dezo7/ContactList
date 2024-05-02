import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [selectedId, setSelectedId] = useState(null);

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");

	const [contact, setContact] = useState({
		name: "",
		email: "",
		phone: "",
		address: ""
	});
	const [isModified, setIsModified] = useState(false);

	// Efecto para cargar contactos
	useEffect(() => {
		actions.loadContacts();
	}, []);

	// Efecto para manejar cambios de selectedId y actualizar contactos específicos
	useEffect(() => {
		if (selectedId !== null) {
			const currentContact = store.contacts.find(contact => contact.id === parseInt(selectedId));
			if (currentContact) {
				setContact({
					name: currentContact.name,
					email: currentContact.email,
					phone: currentContact.phone,
					address: currentContact.address
				});
			}
			setIsModified(false);  // Restablece el estado cuando el contactId cambia
		}
	}, [selectedId, store.contacts]);

	const closeModal = (modalId) => {
		const modalElement = document.getElementById(modalId);
		const modal = bootstrap.Modal.getInstance(modalElement);
		if (modal) {
			modal.hide();
		}
	};

	const resetForm = () => {
		setFullName("");
		setEmail("");
		setPhone("");
		setAddress("");
	};

	const handleSaveContact = () => {
		const newContact = {
			name: fullName,
			email: email,
			phone: phone,
			address: address
		};
		actions.addContact(newContact)
			.then(() => {
				console.log("Contact added successfully");
				resetForm();  // Resetea los campos después de añadir el contacto
				closeModal('addContactModal');  // Cierra el modal después de añadir el contacto
			})
			.catch(error => {
				console.error("Error al añadir el contacto:", error);
				closeModal('addContactModal');  // Cierra el modal incluso si hay un error
			});
	};

	const handleModifyContact = () => {
		actions.modifyContact(selectedId, contact)
			.then(() => {
				console.log("Contact modified successfully");
				setIsModified(true);
				closeModal('modifyContactModal');  // Cierra el modal después de modificar
			})
			.catch(error => {
				console.error("Error al modificar el contacto:", error);
				setIsModified(false);
				closeModal('modifyContactModal');  // Cierra el modal incluso si hay un error
			});
	};

	const handleDeleteContact = () => {
		actions.deleteContact(selectedId)
			.then(() => {
				console.log("Contact deleted successfully");
				actions.loadContacts();
			})
			.catch(error => {
				console.error("Error al eliminar el contacto:", error);
			})
			.finally(() => {
				closeModal('confirmDeleteModal'); // Cierra el modal después de la operación
			});
	};

	const openConfirmModal = (id) => {
		setSelectedId(id);
		const confirmModal = new window.bootstrap.Modal(document.getElementById('confirmDeleteModal'));
		confirmModal.show(); // Abre el modal de confirmación
	};

	const handleOpenModifyModal = (id) => {
		setSelectedId(id);
		const modifyModal = new window.bootstrap.Modal(document.getElementById('modifyContactModal'));
		modifyModal.show(); // Abre el modal de modificación
	};

	return (
		<div className="container">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h1 className="mb-0">Lista de Contactos</h1>
				<button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addContactModal">
					Añadir Contacto
				</button>
			</div>

			{/* Modal para añadir contacto */}
			<div className="modal fade" id="addContactModal" tabIndex="-1" aria-labelledby="addContactModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="addContactModalLabel">Añadir Contacto</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="form-group">
								<label htmlFor="fullName">Nombre</label>
								<input type="text" className="form-control" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} />
							</div>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />
							</div>
							<div className="form-group">
								<label htmlFor="phone">Teléfono</label>
								<input type="tel" className="form-control" id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
							</div>
							<div className="form-group">
								<label htmlFor="address">Dirección</label>
								<input type="text" className="form-control" id="address" value={address} onChange={e => setAddress(e.target.value)} />
							</div>
						</div>
						<div className="modal-footer">
							<button className="btn btn-primary mr-2" onClick={handleSaveContact}>Guardar</button>
							<button className="btn btn-secondary" onClick={() => closeModal('addContactModal')}>Cancelar</button>
						</div>
					</div>
				</div>
			</div>

			{/* Modal para modificar contacto */}
			<div className="modal fade" id="modifyContactModal" tabIndex="-1" aria-labelledby="modifyContactModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="modifyContactModalLabel">Modificar Contacto</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="form-group">
								<label htmlFor="fullName">Nombre</label>
								<input type="text" className="form-control" id="fullName" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
							</div>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input type="email" className="form-control" id="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
							</div>
							<div className="form-group">
								<label htmlFor="phone">Teléfono</label>
								<input type="tel" className="form-control" id="phone" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} />
							</div>
							<div className="form-group">
								<label htmlFor="address">Dirección</label>
								<input type="text" className="form-control" id="address" value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} />
							</div>
						</div>
						<div className="modal-footer">
							<button className="btn btn-primary mr-2" onClick={handleModifyContact}>Guardar</button>
							<button className="btn btn-secondary" onClick={() => closeModal('modifyContactModal')}>Cancelar</button>
						</div>
					</div>
				</div>
			</div>

			{/* Modal de confirmación para eliminar contacto */}
			<div className="modal fade" id="confirmDeleteModal" tabIndex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="confirmDeleteModalLabel">Confirmar Eliminación</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							¿Estás seguro de que deseas eliminar este contacto?
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" onClick={() => closeModal('confirmDeleteModal')}>Cancelar</button>
							<button type="button" className="btn btn-danger" onClick={handleDeleteContact}>Eliminar</button>
						</div>
					</div>
				</div>
			</div>

			{/* Listado de contactos */}
			<ul className="list-group">
				{store.contacts.map(contact => (
					<li key={contact.id} className="list-group-item">
						<div className="row">
							{/* Espacio para la imagen del contacto */}
							<div className="col-1 d-flex align-items-center justify-content-center">
								<img src={`https://picsum.photos/80?random=${contact.id}`} alt="Contact" className="img-fluid rounded-circle" />
							</div>
							{/* Detalles del contacto */}
							<div className="col-10">
								<div><strong><i className="fas fa-user"></i> Nombre:</strong> {contact.name}</div>
								<div><strong><i className="fas fa-envelope"></i> Email:</strong> {contact.email}</div>
								<div><strong><i className="fas fa-phone"></i> Teléfono:</strong> {contact.phone}</div>
								<div><strong><i className="fas fa-map-marker-alt"></i> Dirección:</strong> {contact.address}</div>
							</div>
							{/* Botones de acción */}
							<div className="col-1 d-flex flex-column align-items-center justify-content-center">
								<button className="btn btn-link text-primary" onClick={() => handleOpenModifyModal(contact.id)} title="Modificar">
									<i className="fas fa-edit"></i>
								</button>
								<button className="btn btn-link text-danger" onClick={() => openConfirmModal(contact.id)} title="Eliminar">
									<i className="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};