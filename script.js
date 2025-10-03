// ============ HELPERS ============
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

// --- Country → Region (continent) ---
const COUNTRY_TO_REGION = {
    "ukraine": "Europe", "denmark": "Europe", "italy": "Europe",
    "germany": "Europe", "norway": "Europe", "united kingdom": "Europe", "uk": "Europe",
    "japan": "Asia", "vietnam": "Asia", "pakistan": "Asia",
    "usa": "Americas", "united states": "Americas", "mexico": "Americas",
    "egypt": "Africa",
    "australia": "Oceania", "new zealand": "Oceania"
};
function countryToRegion(country) {
    const key = (country || "").trim().toLowerCase();
    return COUNTRY_TO_REGION[key] || "Other";
}

// ============ DOM READY ============
document.addEventListener("DOMContentLoaded", () => {
    const teacherPopup = document.getElementById("popupTeacher");
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

    const teacherClose = teacherPopup.querySelector(".close");
    if (teacherClose) teacherClose.addEventListener("click", () => teacherPopup.classList.add("hidden"));
    teacherPopup.addEventListener("click", e => { if (e.target === teacherPopup) teacherPopup.classList.add("hidden"); });

    const favoritesTrack = document.getElementById("favoritesTrack");
    const favorites = new Set();

    let teachers = [];   // список викладачів / юзерів
    let displayed = [];  // відфільтрований/показаний список

    // ----- FAVORITES -----
    function makeSliderCard(id, t, photo) {
        const el = document.createElement("article");
        el.className = "slider-card";
        el.dataset.id = id;
        el.appendChild(createAvatarWrap(photo, `${t.first} ${t.last}`, `${t.first[0]}.${t.last[0]}`));
        const name = document.createElement("h3");
        name.className = "name";
        name.innerHTML = `<span class="first">${t.first}</span> <span class="last">${t.last}</span>`;
        const meta = document.createElement("div");
        meta.className = "meta";
        meta.innerHTML = `<div class="specialty">${t.specialty || "-"}</div><div class="country">${t.country || "-"}</div>`;
        el.appendChild(name);
        el.appendChild(meta);
        return el;
    }
    function toggleFavorite(id, t, photo) {
        const isFav = favorites.has(id);
        if (isFav) {
            favorites.delete(id);
            const toRemove = favoritesTrack.querySelector(`.slider-card[data-id="${id}"]`);
            if (toRemove) toRemove.remove();
        } else {
            favorites.add(id);
            favoritesTrack.appendChild(makeSliderCard(id, t, photo));
        }
        favToggle.setAttribute("aria-pressed", (!isFav).toString());
    }

    // ----- POPUP -----
    function openTeacherPopup(t, photo) {
        detailsAvatar.innerHTML = "";
        if (photo) {
            const img = document.createElement("img");
            img.src = photo; img.alt = `${t.first} ${t.last}`;
            detailsAvatar.appendChild(img);
        } else {
            const div = document.createElement("div");
            div.className = "avatar initials";
            div.textContent = `${t.first?.[0] || "?"}.${t.last?.[0] || "?"}`;
            detailsAvatar.appendChild(div);
        }

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

    // ----- RENDER -----
    function renderTeachers(list = teachers) {
        displayed = list;
        const grid = document.querySelector(".cards-grid");
        const tbody = document.getElementById("statsBody");
        if (!grid || !tbody) return;

        grid.innerHTML = "";
        tbody.innerHTML = "";

        list.forEach((t, index) => {
            if (!t.id) t.id = `t${Date.now()}_${index}`;
            const photo = t.photo;

            // Card
            const article = document.createElement("article");
            article.className = "teacher-card";
            article.appendChild(createAvatarWrap(photo, `${t.first} ${t.last}`, `${t.first[0]}.${t.last[0]}`));
            const name = document.createElement("h3");
            name.className = "name";
            name.innerHTML = `<span>${t.first}</span> <span>${t.last}</span>`;
            const meta = document.createElement("div");
            meta.className = "meta";
            meta.innerHTML = `<div>${t.specialty || "-"}</div><div>${t.country || "-"}</div>`;
            article.appendChild(name);
            article.appendChild(meta);
            grid.appendChild(article);

            article.addEventListener("click", () => openTeacherPopup(t, photo));

            // Row in statistics table
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${t.first} ${t.last}</td>
              <td>${t.specialty || "-"}</td>
              <td>${t.age || "-"}</td>
              <td>${t.gender || "-"}</td>
              <td>${t.country || "-"}</td>`;
            tbody.appendChild(row);
        });
    }

    // ====== ФІЛЬТРИ ======
    const [ageSelect, regionSelect, sexSelect] = document.querySelectorAll(".filters select");
    const [photoCheckbox, favCheckbox] = document.querySelectorAll(".filters input[type=checkbox]");
    function getFilteredList() {
        let list = [...teachers];

        if (ageSelect.value === "18–31") list = list.filter(u => u.age >= 18 && u.age <= 31);
        else if (ageSelect.value === "32–50") list = list.filter(u => u.age >= 32 && u.age <= 50);
        else if (ageSelect.value === "51+") list = list.filter(u => u.age >= 51);

        if (regionSelect.value !== "All") {
            list = list.filter(u => countryToRegion(u.country) === regionSelect.value);
        }
        if (sexSelect.value !== "All") {
            list = list.filter(u => u.gender === sexSelect.value);
        }
        if (photoCheckbox.checked) {
            list = list.filter(u => u.photo);
        }
        if (favCheckbox.checked) {
            list = list.filter(u => favorites.has(u.id));
        }

        return list;
    }
    function applyFilters() { renderTeachers(getFilteredList()); }
    [ageSelect, regionSelect, sexSelect, photoCheckbox, favCheckbox]
        .forEach(el => el && el.addEventListener("change", applyFilters));

    // ====== ПОШУК ======
    const searchForm = document.querySelector(".searchbar");
    if (searchForm) {
        searchForm.addEventListener("submit", e => {
            e.preventDefault();
            const q = searchForm.querySelector("input[type=search]").value.toLowerCase().trim();
            const base = getFilteredList();
            if (!q) { renderTeachers(base); return; }
            const results = base.filter(u =>
                `${u.first} ${u.last}`.toLowerCase().includes(q) ||
                (u.notes || "").toLowerCase().includes(q) ||
                String(u.age).includes(q)
            );
            renderTeachers(results);
        });
    }

    // ====== СОРТУВАННЯ ТАБЛИЦІ ======
    const statsTable = document.querySelector(".clean-table");
    if (statsTable) {
        const headers = statsTable.querySelectorAll("th");
        let sortState = {};
        headers.forEach((th) => {
            th.addEventListener("click", () => {
                const key = th.dataset.key;
                const isAsc = sortState[key] === "asc";
                sortState = { [key]: isAsc ? "desc" : "asc" };

                headers.forEach(h => h.classList.remove("active", "sort-asc", "sort-desc"));
                th.classList.add("active", isAsc ? "sort-desc" : "sort-asc");

                let sorted = [...displayed];
                if (key === "name") {
                    sorted = sorted.sort((a, b) => {
                        const A = `${a.first} ${a.last}`.toLowerCase();
                        const B = `${b.first} ${b.last}`.toLowerCase();
                        return isAsc ? B.localeCompare(A) : A.localeCompare(B);
                    });
                } else {
                    sorted = sorted.sort((a, b) => {
                        let A = a[key], B = b[key];
                        if (typeof A === "string") A = A.toLowerCase();
                        if (typeof B === "string") B = B.toLowerCase();
                        if (A < B) return isAsc ? 1 : -1;
                        if (A > B) return isAsc ? -1 : 1;
                        return 0;
                    });
                }
                renderTeachers(sorted);
            });
        });
    }

    // ====== ЛР4: FETCH USERS ======
    async function fetchUsers(count = 50) {
        try {
            const res = await fetch(`https://randomuser.me/api/?results=${count}`);
            const data = await res.json();
            const users = data.results.map((u, i) => ({
                id: `${u.login.uuid}`,
                first: u.name.first,
                last: u.name.last,
                specialty: "—", // randomuser не дає, можна замінити
                country: u.location.country,
                age: u.dob.age,
                gender: u.gender === "male" ? "Male" : "Female",
                email: u.email,
                phone: u.phone,
                notes: "",
                photo: u.picture.medium
            }));
            teachers = [...teachers, ...users];
            renderTeachers(teachers);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    // Load initial 50
    fetchUsers(50);

    // ====== ПАГІНАЦІЯ (Load More) ======
    const loadMoreBtn = document.getElementById("loadMore");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            fetchUsers(10);
        });
    }
});
