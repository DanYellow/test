import { delegateEventHandler } from "./utils";

delegateEventHandler(document, "click", "[data-open-modal]", (e) => {
    const modalId = e.target.dataset.openModal;
    document.querySelector(`[data-modal="${modalId}"]`)?.showModal();
});


delegateEventHandler(document, "click", "[data-close-modal]", (e) => {
    const modalId = e.target.dataset.closeModal;
    document.querySelector(`[data-modal="${modalId}"]`)?.close();
});
