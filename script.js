const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const whatsappNumber = "256740019375";

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isExpanded);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("is-open");
    }
  });
}

const checkin = document.querySelector("#checkin");
const checkout = document.querySelector("#checkout");

if (checkin && checkout) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    .toISOString()
    .split("T")[0];
  checkin.min = localToday;
  checkout.min = localToday;

  checkin.addEventListener("change", () => {
    checkout.min = checkin.value || localToday;
    if (checkout.value && checkout.value <= checkin.value) {
      checkout.value = "";
    }
  });
}

const reservationForm = document.querySelector("#reservation-form");
const formMessage = document.querySelector("#form-message");

if (reservationForm && formMessage) {
  const roomSelect = reservationForm.querySelector("#room");
  const requestedRoom = new URLSearchParams(window.location.search).get("room");
  if (requestedRoom && roomSelect) {
    const matchingOption = Array.from(roomSelect.options).find(
      (option) => option.value === requestedRoom,
    );
    if (matchingOption) {
      roomSelect.value = matchingOption.value;
    }
  }

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.hidden = false;
    formMessage.classList.remove("error");

    if (!reservationForm.reportValidity()) {
      formMessage.textContent = "Please check the required fields and try again.";
      formMessage.classList.add("error");
      return;
    }

    if (checkin && checkout && checkout.value <= checkin.value) {
      formMessage.textContent = "Check-out must be later than check-in.";
      formMessage.classList.add("error");
      checkout.focus();
      return;
    }

    const formData = new FormData(reservationForm);
    const guestName = String(formData.get("name")).trim();
    const inquiry = [
      "Hello Asesah Hotel, I'd like to make a reservation inquiry.",
      `Full name: ${guestName}`,
      `Email: ${formData.get("email")}`,
      `Phone: ${formData.get("phone") || "Not provided"}`,
      `Guests: ${formData.get("guests")}`,
      `Check-in: ${formData.get("checkin")}`,
      `Check-out: ${formData.get("checkout")}`,
      `Preferred room: ${formData.get("room") || "No preference"}`,
      `Additional details: ${formData.get("message") || "None"}`,
    ].join("\n");
    const whatsappUrl = new URL(`https://wa.me/${whatsappNumber}`);
    whatsappUrl.searchParams.set("text", inquiry);
    window.open(whatsappUrl.toString(), "_blank", "noopener,noreferrer");

    formMessage.replaceChildren(
      document.createTextNode(
        `Thank you, ${guestName}. WhatsApp has opened with your enquiry. Review the message and tap Send to contact us. `,
      ),
    );
    const fallbackLink = document.createElement("a");
    fallbackLink.href = whatsappUrl.toString();
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.textContent = "Open WhatsApp";
    formMessage.append(fallbackLink);
  });
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

if (lightbox && lightboxImage && lightboxClose) {
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      lightboxImage.src = item.dataset.full || image?.src || "";
      lightboxImage.alt = image?.alt || "";
      lightbox.showModal();
    });
  });

  lightboxClose.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}
