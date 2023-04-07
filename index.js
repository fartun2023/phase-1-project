// get elements from the HTML code
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const transactionsListEl = document.getElementById("transactions-list");
const addTransactionFormEl = document.getElementById("addtransaction");
const categoryInputEl = document.getElementById("category");
const amountInputEl = document.getElementById("amount");

let transactions = []; // initialize an empty array for the transactions

// function to calculate the balance, income, and expenses
function calculateBalance(exchangeRate) {
  let total = 0;
  let income = 0;
  let expenses = 0;
  for (let transaction of transactions) {
    total += transaction.amount * exchangeRate[transaction.currency];
    if (transaction.amount > 0) {
      income += transaction.amount * exchangeRate[transaction.currency];
    } else {
      expenses += transaction.amount * exchangeRate[transaction.currency];
    }
  }
  balanceEl.textContent = `$${(total / exchangeRate.USD).toFixed(2)}`;
  incomeEl.textContent = `$${(income / exchangeRate.USD).toFixed(2)}`;
  expensesEl.textContent = `$${Math.abs(expenses / exchangeRate.USD).toFixed(2)}`;
}

// function to render the transactions list on the page
function renderTransactions() {
  transactionsListEl.innerHTML = ""; // clear the existing transactions list
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    let li = document.createElement("li");
    li.innerHTML = `${transaction.category}: ${transaction.currency} ${transaction.amount.toFixed(2)} <button class="delete" data-index="${i}">Delete</button>`;
    transactionsListEl.appendChild(li);
  }
  calculateBalance(exchangeRate); // recalculate the balance, income, and expenses
}

// function to fetch the exchange rate data from the API
let url = "https://v6.exchangerate-api.com/v6/15cfd02f9c537f84a4c24f5d/latest/USD";
function fetchExchangeRate() {
    fetch(url, { method: "GET" })
    .then(response => response.json())
    .then(data => {
      exchangeRate = data.conversion_rates;
      renderTransactions();
    })
    .catch(error => console.log(error));
}

let exchangeRate = {}; // initialize an empty object for the exchange rate data
fetchExchangeRate(); // fetch the exchange rate data when the page loads

// event listener for the add transaction form submission
addTransactionFormEl.addEventListener("submit", function(event) {
  event.preventDefault(); // prevent the default form submission behavior
  let category = categoryInputEl.value.trim();
  let currency = "USD";
  let amount = parseFloat(amountInputEl.value.trim());
  if (category && amount) {
    transactions.push({category: category, currency: currency, amount: amount}); // add the new transaction to the transactions array
    categoryInputEl.value = "";
    amountInputEl.value = "";
    renderTransactions(); // render the updated transactions list
  }
});

// event listener for the delete transaction button clicks
transactionsListEl.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete")) {
    let index = parseInt(event.target.getAttribute("data-index"));
    transactions.splice(index, 1); // remove the transaction from the transactions array
    renderTransactions(); // render the updated transactions list
  }
});