// Basic and loading functions

var app = document.getElementById("list");
var incomes;
var expenses;
var budget;
var allMovements;

window.addEventListener('load', (event) =>{
    setUp();
    loadVars();
    loadTableHTML();
});

function loadVars() {
    incomes = parseFloat(localStorage.getItem("income"));
    expenses = parseFloat(localStorage.getItem("expense"));
    budget = parseFloat(localStorage.getItem("budget"));
    allMovements = JSON.parse(localStorage.getItem("movements"));
    var year = new Date();
    document.querySelector('title').textContent = getCurrentMonth() + " " + year.getFullYear() + " Balance";
}

function loadTableHTML() {
    allMovements.forEach(element => {
        var name = Object.keys(element)[0];
        if (name == "expense") {
            addHTML(element.expense.date, element.expense.description, element.expense.value, element.expense.budget, "expense");
        } if (name == "income") {
            addHTML(element.income.date, element.income.description, element.income.value, element.income.budget, "income");
        }
    });

    document.getElementById("expenses-total").innerHTML = convertToMoney(expenses);
    document.getElementById("income-total").innerHTML = convertToMoney(incomes);
    document.getElementById("budget-total").innerHTML = convertToMoney(budget);
}

// Set-up function

function setUp() {
    if (localStorage.getItem("income") == null || localStorage.getItem("expense") == null || localStorage.getItem('budget') == null || localStorage.getItem("movements") == null) {
        var base = prompt('Enter your base budget');
        if (base == null) {
            localStorage.setItem('budget', "0");
        } else {
            localStorage.setItem('budget', base);
        }
        reset();
    }
}

// Back-up functions

function reset() {
    localStorage.setItem("movements", JSON.stringify([]));
    localStorage.setItem("income", "0");
    localStorage.setItem("expense", "0");
    localStorage.setItem("month", getCurrentMonth());
    location.reload();
}

function backUp() {
    window.print();
    reset();
}

// Adding movements functions

function save(Object) {
    allMovements.push(Object);
    localStorage.setItem("movements", JSON.stringify(allMovements));
}

function addExpense(expense) {
    expenses = expenses + expense;

    localStorage.setItem("expense", expenses);
    localStorage.setItem("budget", budget - expense);
}

function newExpense() {
    var date = document.getElementById("date").value;
    var description = document.getElementById("movement").value;
    var value = document.getElementById("value").value;
    var curr_budget = budget - parseFloat(value);

    if (date == "" || description == "" || value == "") {
        alert("Enter proper values");
        return;
    }

    let movement = {
        "expense": {
            date: date,
            description: description,
            value: value,
            budget: curr_budget
        }
    };

    save(movement);
    addExpense(parseFloat(value));
    location.reload();
}

function addIncome(income) {
    incomes = incomes + income;

    localStorage.setItem("income", incomes);
    localStorage.setItem("budget", budget + income);
}

function newIncome() {
    var date = document.getElementById("date").value;
    var description = document.getElementById("movement").value;
    var value = document.getElementById("value").value;
    var curr_budget = budget + parseFloat(value);

    if (date == "" || description == "" || value == "") {
        alert("Enter proper values");
        return;
    }

    let movement = {
        "income": {
            date: date,
            description: description,
            value: value,
            budget: curr_budget
        }
    };

    save(movement);
    addIncome(parseFloat(value));
    location.reload();
}

function addHTML(date, movement, value, budget, type) {
    var div = document.createElement("div");
    div.className = "sublist-content " + type;

    var p_date = document.createElement("p");
    p_date.className = "date";
    p_date.innerHTML = date;
    div.appendChild(p_date);

    var p_movement = document.createElement("p");
    p_movement.className = "movement";
    p_movement.innerHTML = movement;
    div.appendChild(p_movement);

    var p_value = document.createElement("p");
    p_value.className = "value";
    p_value.innerHTML = convertToMoney(value);
    div.appendChild(p_value);

    var p_budget = document.createElement("p");
    p_budget.className = "budget";
    p_budget.innerHTML = convertToMoney(budget);
    div.appendChild(p_budget);

    app.appendChild(div);
}

// UTILS FUNCTIONS

function convertToMoney(num) {
    num = num.toString();
    num = parseFloat(num.replace(",", ".")).toFixed(2);
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    num = parts.join(".");
    var decimals = num.slice(-2);
    num = num.slice(0, -3) + "," + decimals;
    num = "$" + num;
    return num;
}

function getCurrentMonth() {
    var date = new Date();
    var curr_month = date.getMonth();
    var returnMonth;

    if (curr_month == 0) {
        returnMonth = "January";
    } else if (curr_month == 1) {
        returnMonth = "February";
    } else if (curr_month == 2) {
        returnMonth = "March";
    } else if (curr_month == 3) {
        returnMonth = "April";
    } else if (curr_month == 4) {
        returnMonth = "May";
    } else if (curr_month == 5) {
        returnMonth = "June";
    } else if (curr_month == 6) {
        returnMonth = "July";
    } else if (curr_month == 7) {
        returnMonth = "August";
    } else if (curr_month == 8) {
        returnMonth = "September";
    } else if (curr_month == 9) {
        returnMonth = "October";
    } else if (curr_month == 10) {
        returnMonth = "November";
    } else if (curr_month == 11) {
        returnMonth = "December";
    } 

    return returnMonth;
}

// CSS AND HTML ORIENTED FUNCTIONS

const addNewForm = document.getElementById("add-form-wrapper");
const dateInp = document.getElementById("date");

function enableScroll() {
    window.onscroll = function() {};
}

function disableScroll() {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function() {
        window.scrollTo(scrollLeft, scrollTop);
    };
}

document.getElementById("add-form-btn").addEventListener("mousedown", () => {
    addNewForm.classList.toggle("add-form-wrapper-show")
    dateInp.valueAsDate = new Date();
    window.scrollTo({
        top: 0
    });
    disableScroll();
});
addNewForm.addEventListener("mousedown", (e) => {
    if (!document.getElementById("add-form-container").contains(e.target)){
        addNewForm.classList.toggle("add-form-wrapper-show");
        enableScroll();
    }
});
document.getElementById("back-up-btn").addEventListener("mousedown", () => {
    if (confirm("Are you sure you want to do a back-up?") == true) {
        backUp();
    }
});