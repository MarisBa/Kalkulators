document.addEventListener('DOMContentLoaded', function() {
    const calcInput = document.getElementById('calc');
    const buttons = document.querySelectorAll('.buttons input');
    const historyList = document.getElementById('historyList');
    const historyBtn = document.getElementById('historyBtn');
    const popup = document.getElementById('historyPopup');
    const closePopup = document.querySelector('.close');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let lastActionWasCalculation = false;

    // Update the history UI based on the saved history
    function updateHistory() {
        historyList.innerHTML = '';
        history.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${entry}</span>`;

            // Create and append delete button for each history entry
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                history.splice(index, 1);  // Remove entry from history array
                localStorage.setItem('history', JSON.stringify(history)); // Save updated history to localStorage
                updateHistory();  // Re-render the history list
            });
            li.appendChild(deleteButton);
            historyList.appendChild(li);
        });
    }

    // Add value to calculator input
    function appendValue(value) {
        if (lastActionWasCalculation) {
            calcInput.value = '';
            lastActionWasCalculation = false;
        }
        calcInput.value += value;
    }

    // Perform calculation and update history
    function calculate() {
        try {
            const result = eval(calcInput.value);
            history.push(`${calcInput.value} = ${result}`);
            localStorage.setItem('history', JSON.stringify(history));  // Save history in localStorage
            calcInput.value = result;
            lastActionWasCalculation = true;
            updateHistory();  // Update the history UI with the new calculation
        } catch (e) {
            calcInput.value = 'Error';  // Handle error in case of invalid input
        }
    }

    // Clear the calculator input
    function clearInput() {
        calcInput.value = '';
    }

    // Clear the last character from the input
    function deleteLastCharacter() {
        calcInput.value = calcInput.value.slice(0, -1);
    }

    // Clear the history
    function clearHistory() {
        history = [];
        localStorage.setItem('history', JSON.stringify(history));
        updateHistory();
    }

    // Event listener for each calculator button
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.value === '=') {
                calculate();
            } else if (this.value === 'AC') {
                clearInput();
            } else if (this.value === 'C') {
                deleteLastCharacter();  // Use the deleteLastCharacter function for "C"
            } else {
                appendValue(this.value);
            }
        });
    });

    // Show history popup when "Show History" button is clicked
    historyBtn.addEventListener('click', function() {
        popup.style.display = 'block';  // Make the popup visible
    });

    // Close the popup when the close button is clicked
    closePopup.addEventListener('click', function() {
        popup.style.display = 'none';  // Hide the popup
    });

    // Close the popup if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';  // Close the popup if clicked outside
        }
    });

    // Clear history when the clear history button is clicked
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initial call to populate the history when the page loads
    updateHistory();
});
