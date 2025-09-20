

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

export const usersSearchUtil = (users, value) => {
    if (value == null || value === "") return users;
    const strValue = String(value).trim().toLowerCase();

    return users.filter(user => {
        const nameOk = user.full_name
            ? user.full_name.toLowerCase().includes(strValue)
            : false;

        const noteOk = user.note
            ? user.note.toLowerCase().includes(strValue)
            : false;

        const ageOk = user.age != null
            ? String(user.age) === strValue
            : false;

        return nameOk || noteOk || ageOk;
    });
};

function findUser(key, value) {
    return teachers.find(u => String(u[key]).toLowerCase() === String(value).toLowerCase());
}
function percentage(predicate) {
    const total = teachers.length;
    const matched = teachers.filter(predicate).length;
    return total === 0 ? 0 : Math.round((matched / total) * 100);
}

















// cd "U:\Papka Daryny\veblab_horiachok"
// node .\lab2tests.js

// ================= TESTING =================
console.log("=== TESTING LAB 2 FUNCTIONS ===");

const sampleUsers = [
    { first: "John", last: "Doe", gender: "Male", country: "USA", age: 25, email: "john@example.com", phone: "+1-202-555-0137" },
    { first: "Maria", last: "Ivanova", gender: "Female", country: "Ukraine", age: 30, email: "maria@example.com", phone: "+380501234567", notes: "Loves math" },
    { first: "Akira", last: "Tanaka", gender: "Male", country: "Japan", age: 40, email: "akira@example.com", phone: "+81-90-1234-5678", notes: "Teaches art" }
];

const formatted = formatUsers(sampleUsers);
console.log("Formatted users:", formatted);
const teachers = formatted;

// 2. validateUser
console.log("\n=== VALIDATION ===");
console.log("Validate good user:", validateUser(formatted[0])); // true
console.log("Validate bad user (wrong email):", validateUser({
    ...formatted[0],
    email: "wrong-email",
    age: "notNumber"
})); // false

// 3. filterUsers
console.log("\n=== FILTERING ===");
console.log("Filter by country=Ukraine:", filterUsers({ country: "Ukraine" }));
console.log("Filter by gender=Male and age=25:", filterUsers({ gender: "Male", age: 25 }));

// 4. sortUsers
console.log("\n=== SORTING ===");
console.log("Sort by age ASC:", sortUsers("age", "asc").map(u => u.full_name + " (" + u.age + ")"));
console.log("Sort by full_name DESC:", sortUsers("full_name", "desc").map(u => u.full_name));

// 5. usersSearchUtil
console.log("\n=== SEARCH ===");
console.log("Search by name 'maria':", usersSearchUtil(teachers, "maria"));
console.log("Search by note 'art':", usersSearchUtil(teachers, "art"));
console.log("Search by age '25':", usersSearchUtil(teachers, "25"));

// 6. findUser
console.log("\n=== FIND ===");
console.log("Find by name:", findUser("full_name", "Maria Ivanova"));
console.log("Find by age:", findUser("age", 25));

// 7. percentage
console.log("\n=== PERCENTAGE ===");
console.log("Percentage older than 30:", percentage(u => u.age > 30) + "%");
console.log("Percentage with country=USA:", percentage(u => u.country === "USA") + "%");
