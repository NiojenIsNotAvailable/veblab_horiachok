// ============ HELPERS ============
function setupPopup(openers, popupEl) {
    const closeBtn = popupEl.querySelector(".close");
    const hide = () => popupEl.classList.add("hidden");
    const show = () => popupEl.classList.remove("hidden");

    (Array.isArray(openers) ? openers : [openers]).forEach(btn => {
        if (btn) btn.addEventListener("click", show);
    });
    if (closeBtn) closeBtn.addEventListener("click", hide);
    popupEl.addEventListener("click", (e) => { if (e.target === popupEl) hide(); });
}

function createAvatarWrap(photoUrl, altText, initialsText) {
    const wrap = document.createElement("div");
    wrap.className = "avatar-wrap";
    if (photoUrl) {
        const img = document.createElement("img");
        img.src = photoUrl;
        img.alt = altText;
        wrap.appendChild(img);
    } else {
        const div = document.createElement("div");
        div.className = "avatar initials";
        div.textContent = initialsText;
        wrap.appendChild(div);
    }
    return wrap;
}

// ============ DOM READY ============
document.addEventListener("DOMContentLoaded", () => {
    // ----- POPUPS -----
    const teacherPopup = document.getElementById("popupTeacher");
    const addPopup = document.getElementById("popupAddTeacher");

    const detailsAvatar = teacherPopup.querySelector(".details-avatar");
    const detailsName = teacherPopup.querySelector(".details-name");
    const detailsSpecialty = teacherPopup.querySelector(".details-specialty");
    const detailsCountry = teacherPopup.querySelector(".details-country");
    const detailsAge = teacherPopup.querySelector(".details-age");
    const detailsGender = teacherPopup.querySelector(".details-gender");
    const detailsEmail = teacherPopup.querySelector(".details-email");
    const detailsPhone = teacherPopup.querySelector(".details-phone");
    const detailsNotes = teacherPopup.querySelector(".details-notes");
    const favToggle = teacherPopup.querySelector(".fav-toggle");

    // Close button for Teacher popup
    const teacherClose = teacherPopup.querySelector(".close");
    if (teacherClose) teacherClose.addEventListener("click", () => teacherPopup.classList.add("hidden"));

    // ----- SLIDER -----
    const favoritesTrack = document.getElementById("favoritesTrack");
    const sliderViewport = document.querySelector(".slider-viewport");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");

    if (prevBtn && sliderViewport) {
        prevBtn.addEventListener("click", () => sliderViewport.scrollBy({ left: -300, behavior: "smooth" }));
    }
    if (nextBtn && sliderViewport) {
        nextBtn.addEventListener("click", () => sliderViewport.scrollBy({ left: 300, behavior: "smooth" }));
    }

    // ----- FAVORITES -----
    const favorites = new Set();

    function makeSliderCard(id, t, photo) {
        const el = document.createElement("article");
        el.className = "slider-card";
        el.dataset.id = id;

        const wrap = createAvatarWrap(photo, `${t.first} ${t.last}`, `${t.first[0]}.${t.last[0]}`);
        const name = document.createElement("h3");
        name.className = "name";
        name.innerHTML = `<span class="first">${t.first}</span> <span class="last">${t.last}</span>`;

        const meta = document.createElement("div");
        meta.className = "meta";
        meta.innerHTML = `<div class="specialty">${t.specialty || "-"}</div><div class="country">${t.country || "-"}</div>`;

        el.appendChild(wrap);
        el.appendChild(name);
        el.appendChild(meta);
        return el;
    }

    function toggleFavorite(id, t, photo) {
        const isFav = favorites.has(id);
        if (isFav) {
            favorites.delete(id);
            if (favoritesTrack) {
                const toRemove = favoritesTrack.querySelector(`.slider-card[data-id="${id}"]`);
                if (toRemove) toRemove.remove();
            }
        } else {
            favorites.add(id);
            if (favoritesTrack) favoritesTrack.appendChild(makeSliderCard(id, t, photo));
        }
        if (favToggle) favToggle.setAttribute("aria-pressed", (!isFav).toString());
    }

    // ----- PHOTOS -----
    const teacherPhotos = {
        "Ihor Tkachuk": "assets/image1.jpg",
        "Anna Muzychuk": "assets/image2.jpg",
        "Floor Jansen": "assets/image3.jpg",
        "Daisy Alexander": "assets/image4.jpg"
    };
    function getTeacherPhoto(first, last, customUrl) {
        if (customUrl) return customUrl;
        const key = `${first} ${last}`;
        return teacherPhotos[key] || null;
    }

    // ----- DATA -----
    const teachers = [
        {
            first: "Ihor",
            last: "Tkachuk",
            specialty: "Chemistry",
            country: "Ukraine",
            age: 35,
            gender: "Male",
            email: "ihor.tkachuk@example.com",
            phone: "+380 67 123 4567",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor."
        },
        {
            first: "Anna",
            last: "Muzychuk",
            specialty: "Mathematics",
            country: "Ukraine",
            age: 32,
            gender: "Female",
            email: "anna.muzychuk@example.com",
            phone: "+380 50 765 4321",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio."
        },
        {
            first: "Floor",
            last: "Jansen",
            specialty: "Vocal",
            country: "Denmark",
            age: 39,
            gender: "Female",
            email: "floor.jansen@example.com",
            phone: "+45 12 34 56 78",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi."
        },
        {
            first: "Daisy",
            last: "Alexander",
            specialty: "Chemistry",
            country: "Vietnam",
            age: 28,
            gender: "Female",
            email: "daisy.alexander@example.com",
            phone: "+84 91 234 5678",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae."
        },
        {
            first: "Marco",
            last: "Rossi",
            specialty: "History",
            country: "Italy",
            age: 45,
            gender: "Male",
            email: "marco.rossi@example.com",
            phone: "+39 345 678 9012",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus."
        },
        {
            first: "Sophia",
            last: "Schmidt",
            specialty: "Biology",
            country: "Germany",
            age: 38,
            gender: "Female",
            email: "sophia.schmidt@example.com",
            phone: "+49 171 234 5678",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis risus eget urna."
        },
        {
            first: "James",
            last: "Smith",
            specialty: "Physics",
            country: "UK",
            age: 50,
            gender: "Male",
            email: "james.smith@example.com",
            phone: "+44 1234 567890",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere consectetur est."
        },
        {
            first: "Yuki",
            last: "Tanaka",
            specialty: "Art",
            country: "Japan",
            age: 29,
            gender: "Female",
            email: "yuki.tanaka@example.com",
            phone: "+81 90 1234 5678",
            notes: "Modern art specialist. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        },
        {
            first: "Carlos",
            last: "Mendez",
            specialty: "Mathematics",
            country: "Mexico",
            age: 41,
            gender: "Male",
            email: "carlos.mendez@example.com",
            phone: "+52 55 1234 5678",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna."
        },
        {
            first: "Fatima",
            last: "Hassan",
            specialty: "English",
            country: "Egypt",
            age: 34,
            gender: "Female",
            email: "fatima.hassan@example.com",
            phone: "+20 100 234 5678",
            notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus."
        }
    ];



    // add unique id to initial
    teachers.forEach((t, i) => t.id = `t${i}`);

    // ----- RENDER -----
    function renderTeachers() {
        const grid = document.querySelector(".cards-grid");
        const tbody = document.getElementById("statsBody");
        if (!grid || !tbody) return;

        grid.innerHTML = "";
        tbody.innerHTML = "";

        teachers.forEach((t, index) => {
            if (!t.id) t.id = `t${Date.now()}_${index}`;

            // Card
            const article = document.createElement("article");
            article.className = "teacher-card";

            const photo = getTeacherPhoto(t.first, t.last, t.photo);
            article.appendChild(
                createAvatarWrap(photo, `${t.first} ${t.last}`, `${t.first[0]}.${t.last[0]}`)
            );

            const name = document.createElement("h3");
            name.className = "name";
            name.innerHTML = `<span>${t.first}</span> <span>${t.last}</span>`;

            const meta = document.createElement("div");
            meta.className = "meta";
            meta.innerHTML = `<div>${t.specialty || "-"}</div><div>${t.country || "-"}</div>`;

            article.appendChild(name);
            article.appendChild(meta);
            grid.appendChild(article);

            // Click → open popup
            article.addEventListener("click", () => openTeacherPopup(t, photo));

            // Row in statistics table
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${t.first} ${t.last}</td>
        <td>${t.specialty || "-"}</td>
        <td>${t.age || "-"}</td>
        <td>${t.gender || "-"}</td>
        <td>${t.country || "-"}</td>
      `;
            tbody.appendChild(row);
        });
    }

    // ----- OPEN TEACHER POPUP -----
    function openTeacherPopup(t, photo) {
        // Фото
        detailsAvatar.innerHTML = "";
        if (photo) {
            const img = document.createElement("img");
            img.src = photo;
            img.alt = `${t.first} ${t.last}`;
            detailsAvatar.appendChild(img);
        } else {
            const div = document.createElement("div");
            div.className = "avatar initials";
            div.textContent = `${t.first?.[0] || "?"}.${t.last?.[0] || "?"}`;
            detailsAvatar.appendChild(div);
        }

        // Текст
        detailsName.textContent = `${t.first} ${t.last}`;
        detailsSpecialty.textContent = t.specialty || "";
        detailsCountry.textContent = t.country ? `Country: ${t.country}` : "";
        detailsAge.textContent = t.age ? `Age: ${t.age}` : "";
        detailsGender.textContent = t.gender ? `Gender: ${t.gender}` : "";
        detailsEmail.innerHTML = t.email ? `Email: <a href="mailto:${t.email}">${t.email}</a>` : "";
        detailsPhone.textContent = t.phone ? `Phone: ${t.phone}` : "";
        detailsNotes.textContent = t.notes || "";

        favToggle.setAttribute("aria-pressed", favorites.has(t.id) ? "true" : "false");
        favToggle.onclick = () => toggleFavorite(t.id, t, photo);

        teacherPopup.classList.remove("hidden");
    }



    // ----- ADD TEACHER POPUP -----
    const openAddHeader = document.getElementById("openAddTeacher");
    const openAddFooter = document.getElementById("openAddTeacherFooter");
    const addCloseBtn = addPopup ? addPopup.querySelector(".close") : null;
    const addForm = document.getElementById("addTeacherForm");

    if (openAddHeader) openAddHeader.addEventListener("click", () => addPopup.classList.remove("hidden"));
    if (openAddFooter) openAddFooter.addEventListener("click", () => addPopup.classList.remove("hidden"));
    if (addCloseBtn) addCloseBtn.addEventListener("click", () => addPopup.classList.add("hidden"));
    if (addPopup) {
        addPopup.addEventListener("click", (e) => { if (e.target === addPopup) addPopup.classList.add("hidden"); });
    }

    if (addForm) {
        addForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const t = {
                id: `t${Date.now()}`,
                first: (fd.get("first") || "").trim(),
                last: (fd.get("last") || "").trim(),
                specialty: (fd.get("specialty") || "").trim(),
                country: (fd.get("country") || "").trim(),
                city: (fd.get("city") || "").trim(),
                email: (fd.get("email") || "").trim(),
                phone: (fd.get("phone") || "").trim(),
                age: fd.get("age") ? Number(fd.get("age")) : undefined,
                gender: (fd.get("gender") || "").trim(),
                notes: (fd.get("notes") || "").trim(),
                photo: (fd.get("photo") || "").trim()
            };
            teachers.push(t);
            renderTeachers();
            e.target.reset();
            addPopup.classList.add("hidden");
        });
    }

    // ----- SORTING -----
    const statsTable = document.querySelector(".clean-table");
    if (statsTable) {
        const headers = statsTable.querySelectorAll("th");
        let sortState = {};

        headers.forEach((th, index) => {
            th.addEventListener("click", () => {
                const key = th.dataset.key; // читаємо data-key
                const tbody = document.getElementById("statsBody");
                const rows = Array.from(tbody.querySelectorAll("tr"));
                const isAsc = sortState[key] === "asc";
                sortState = {}; // скинути інші
                sortState[key] = isAsc ? "desc" : "asc";

                // очистити класи
                headers.forEach(h => h.classList.remove("active", "sort-asc", "sort-desc"));
                th.classList.add("active", isAsc ? "sort-desc" : "sort-asc");

                rows.sort((a, b) => {
                    const cellA = a.querySelector(`td:nth-child(${index + 1})`).textContent.trim();
                    const cellB = b.querySelector(`td:nth-child(${index + 1})`).textContent.trim();
                    let res = 0;

                    if (key === "age") {
                        const numA = parseInt(cellA) || 0;
                        const numB = parseInt(cellB) || 0;
                        res = numA - numB;
                    } else {
                        res = cellA.localeCompare(cellB);
                    }

                    return isAsc ? -res : res;
                });

                tbody.innerHTML = "";
                rows.forEach(r => tbody.appendChild(r));
            });
        });

    }

    // Initial render
    renderTeachers();
});
