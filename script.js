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
    // Europe
    "ukraine": "Europe", "denmark": "Europe", "italy": "Europe",
    "germany": "Europe", "norway": "Europe",
    "united kingdom": "Europe", "uk": "Europe",
    // Asia
    "japan": "Asia", "vietnam": "Asia", "pakistan": "Asia",
    // Americas
    "usa": "Americas", "united states": "Americas", "mexico": "Americas",
    // Africa
    "egypt": "Africa",
    // Oceania
    "australia": "Oceania", "new zealand": "Oceania"
};
function countryToRegion(country) {
    const key = (country || "").trim().toLowerCase();
    return COUNTRY_TO_REGION[key] || "Other";
}

// ============ DOM READY ============
document.addEventListener("DOMContentLoaded", () => {
    const teacherPopup = document.getElementById("popupTeacher");
    const addPopup = document.getElementById("popupAddTeacher");

    // ====== CLOSE TEACHER POPUP ======
    const teacherClose = teacherPopup.querySelector(".close");
    if (teacherClose) {
        teacherClose.addEventListener("click", () => {
            teacherPopup.classList.add("hidden");
        });
    }
    // Закриття кліком по фону
    teacherPopup.addEventListener("click", (e) => {
        if (e.target === teacherPopup) {
            teacherPopup.classList.add("hidden");
        }
    });

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

    const favoritesTrack = document.getElementById("favoritesTrack");
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
            const toRemove = favoritesTrack.querySelector(`.slider-card[data-id="${id}"]`);
            if (toRemove) toRemove.remove();
        } else {
            favorites.add(id);
            favoritesTrack.appendChild(makeSliderCard(id, t, photo));
        }
        favToggle.setAttribute("aria-pressed", (!isFav).toString());
    }

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
        { first: "Ihor", last: "Tkachuk", specialty: "Chemistry", country: "Ukraine", age: 35, gender: "Male", email: "ihor.tkachuk@example.com", phone: "+380 67 123 4567", notes: "Lorem ipsum dolor sit amet." },
        { first: "Anna", last: "Muzychuk", specialty: "Mathematics", country: "Ukraine", age: 32, gender: "Female", email: "anna.muzychuk@example.com", phone: "+380 50 765 4321", notes: "Lorem ipsum dolor sit amet." },
        { first: "Floor", last: "Jansen", specialty: "Vocal", country: "Denmark", age: 39, gender: "Female", email: "floor.jansen@example.com", phone: "+45 12 34 56 78", notes: "Lorem ipsum dolor sit amet." },
        { first: "Daisy", last: "Alexander", specialty: "Chemistry", country: "Vietnam", age: 28, gender: "Female", email: "daisy.alexander@example.com", phone: "+84 91 234 5678", notes: "Lorem ipsum dolor sit amet." },
        { first: "Marco", last: "Rossi", specialty: "History", country: "Italy", age: 45, gender: "Male", email: "marco.rossi@example.com", phone: "+39 345 678 9012", notes: "Lorem ipsum dolor sit amet." },
        { first: "Sophia", last: "Schmidt", specialty: "Biology", country: "Germany", age: 38, gender: "Female", email: "sophia.schmidt@example.com", phone: "+49 171 234 5678", notes: "Lorem ipsum dolor sit amet." },
        { first: "James", last: "Smith", specialty: "Physics", country: "UK", age: 50, gender: "Male", email: "james.smith@example.com", phone: "+44 1234 567890", notes: "Lorem ipsum dolor sit amet." },
        { first: "Yuki", last: "Tanaka", specialty: "Art", country: "Japan", age: 29, gender: "Female", email: "yuki.tanaka@example.com", phone: "+81 90 1234 5678", notes: "Lorem ipsum dolor sit amet." },
        { first: "Carlos", last: "Mendez", specialty: "Mathematics", country: "Mexico", age: 41, gender: "Male", email: "carlos.mendez@example.com", phone: "+52 55 1234 5678", notes: "Lorem ipsum dolor sit amet." },
        { first: "Fatima", last: "Hassan", specialty: "English", country: "Egypt", age: 34, gender: "Female", email: "fatima.hassan@example.com", phone: "+20 100 234 5678", notes: "Lorem ipsum dolor sit amet." }
    ];
    
    teachers.forEach((t, i) => t.id = `t${i}`);

    // ================= ЛР2 ФУНКЦІЇ =================
    function formatUsers(users) {
        const courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics"];
        return users.map((u, i) => ({
            id: u.id || `u${i}`,
            full_name: `${u.first} ${u.last}`,
            gender: u.gender,
            country: u.country,
            age: u.age,
            email: u.email,
            phone: u.phone,
            notes: u.notes || "",
            favorite: false,
            course: courses[Math.floor(Math.random() * courses.length)],
            bg_color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
        }));
    }
   function validateUser(u) {
    const startsWithCapital = str => typeof str === "string" && /^[A-ZА-ЯІЇЄ]/.test(str);

    return (
        // 1. uppercase
        startsWithCapital(u.full_name) &&
        startsWithCapital(u.gender) &&
        (u.note == null || startsWithCapital(u.note)) && // if empty
        startsWithCapital(u.state) &&
        startsWithCapital(u.city) &&
        startsWithCapital(u.country) &&

        // 2. Age
        typeof u.age === "number" && u.age > 0 && u.age < 120 &&

        // 3. Email
        /\S+@\S+\.\S+/.test(u.email) &&

        // 4. phone
        /^\+?[0-9\s-]{6,20}$/.test(u.phone || "")
    );
}

    function filterUsers(params = {}) {
        return teachers.filter(u =>
            (!params.country || u.country === params.country) &&
            (!params.age || u.age === params.age) &&
            (!params.gender || u.gender === params.gender) &&
            (params.favorite === undefined || u.favorite === params.favorite)
        );
    }
    function sortUsers(key, order = "asc") {
        return [...teachers].sort((a, b) => {
            let A = a[key], B = b[key];
            if (typeof A === "string") A = A.toLowerCase();
            if (typeof B === "string") B = B.toLowerCase();
            if (A < B) return order === "asc" ? -1 : 1;
            if (A > B) return order === "asc" ? 1 : -1;
            return 0;
        });
    }
    function findUser(key, value) {
        return teachers.find(u => String(u[key]).toLowerCase() === String(value).toLowerCase());
    }
    function percentage(predicate) {
        const total = teachers.length;
        const matched = teachers.filter(predicate).length;
        return total === 0 ? 0 : Math.round((matched / total) * 100);
    }


    
    // ----- RENDER -----
    function renderTeachers(list = teachers) {
        const grid = document.querySelector(".cards-grid");
        const tbody = document.getElementById("statsBody");
        if (!grid || !tbody) return;
        grid.innerHTML = "";
        tbody.innerHTML = "";
        list.forEach(t => {
            const article = document.createElement("article");
            article.className = "teacher-card";
            const photo = getTeacherPhoto(t.first, t.last, t.photo);
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

            const row = document.createElement("tr");
            row.innerHTML = `<td>${t.first} ${t.last}</td><td>${t.specialty || "-"}</td><td>${t.age || "-"}</td><td>${t.gender || "-"}</td><td>${t.country || "-"}</td>`;
            tbody.appendChild(row);
        });
    }

    function openTeacherPopup(t, photo) {
        detailsAvatar.innerHTML = "";
        if (photo) {
            const img = document.createElement("img");
            img.src = photo; img.alt = `${t.first} ${t.last}`;
            detailsAvatar.appendChild(img);
        } else {
            const div = document.createElement("div");
            div.className = "avatar initials";
            div.textContent = `${t.first[0]}.${t.last[0]}`;
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

    // ====== ФІЛЬТРИ ======
    const [ageSelect, regionSelect, sexSelect] = document.querySelectorAll(".filters select");
    const [photoCheckbox, favCheckbox] = document.querySelectorAll(".filters input[type=checkbox]");
    function applyFilters() {
        let filtered = [...teachers];

        // Age
        if (ageSelect.value === "18–31") filtered = filtered.filter(u => u.age >= 18 && u.age <= 31);
        else if (ageSelect.value === "32–50") filtered = filtered.filter(u => u.age >= 32 && u.age <= 50);
        else if (ageSelect.value === "51+") filtered = filtered.filter(u => u.age >= 51);

        // Region (через мапу)
        if (regionSelect.value !== "All") {
            filtered = filtered.filter(u => countryToRegion(u.country) === regionSelect.value);
        }

        // Sex
        if (sexSelect.value !== "All") {
            filtered = filtered.filter(u => u.gender === sexSelect.value);
        }

        // Only with photo
        if (photoCheckbox.checked) {
            filtered = filtered.filter(u => getTeacherPhoto(u.first, u.last, u.photo));
        }

        // Only favorites
        if (favCheckbox.checked) {
            filtered = filtered.filter(u => favorites.has(u.id));
        }

        renderTeachers(filtered);
    }

    [ageSelect, regionSelect, sexSelect, photoCheckbox, favCheckbox].forEach(el => el.addEventListener("change", applyFilters));

    // ====== ПОШУК ======
    const searchForm = document.querySelector(".searchbar");
    if (searchForm) {
        searchForm.addEventListener("submit", e => {
            e.preventDefault();
            const q = searchForm.querySelector("input[type=search]").value.toLowerCase();
            const results = teachers.filter(u =>
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
        headers.forEach((th, index) => {
            th.addEventListener("click", () => {
                const key = th.dataset.key;
                const tbody = document.getElementById("statsBody");
                const rows = Array.from(tbody.querySelectorAll("tr"));
                const isAsc = sortState[key] === "asc";
                sortState = {};
                sortState[key] = isAsc ? "desc" : "asc";
                headers.forEach(h => h.classList.remove("active", "sort-asc", "sort-desc"));
                th.classList.add("active", isAsc ? "sort-desc" : "sort-asc");
                rows.sort((a, b) => {
                    const cellA = a.querySelector(`td:nth-child(${index + 1})`).textContent.trim();
                    const cellB = b.querySelector(`td:nth-child(${index + 1})`).textContent.trim();
                    let res = 0;
                    if (key === "age") {
                        res = (parseInt(cellA) || 0) - (parseInt(cellB) || 0);
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
