document.addEventListener('DOMContentLoaded', () => {

    // --- اختيار عناصر DOM ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const learnScreen = document.getElementById('learn-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultsScreen = document.getElementById('results-screen');

    const childNameInput = document.getElementById('child-name');
    const tableSelect = document.getElementById('table-select');
    const questionCountInput = document.getElementById('question-count-input');
    const childPictureInput = document.getElementById('child-picture');
    const imagePreview = document.getElementById('image-preview');
    const learnBtn = document.getElementById('learn-btn');
    const testBtn = document.getElementById('test-btn');
    const startQuizFromLearnBtn = document.getElementById('start-quiz-from-learn-btn');

    const playerPic = document.getElementById('player-pic');
    const playerPicLearn = document.getElementById('player-pic-learn');
    const playerNameSpan = document.getElementById('player-name');
    const playerNameLearnSpan = document.getElementById('player-name-learn');
    const tableNumberDisplay = document.getElementById('table-number-display');
    const tableDisplay = document.getElementById('table-display');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');

    const scoreSpan = document.getElementById('score');
    const questionCountSpan = document.getElementById('question-count');
    const progressBar = document.getElementById('progress-bar');
    
    const resultTitle = document.getElementById('result-title');
    const finalMessageP = document.getElementById('final-message');
    const restartBtn = document.getElementById('restart-btn');
    const resultsPlayerPic = document.getElementById('results-player-pic');

    // --- متغيرات حالة اللعبة ---
    let childName = '';
    let childPictureUrl = '';
    let selectedTable = 0;
    let totalQuestions = 10;
    let score = 0;
    let currentQuestionIndex = 0;
    let questions = [];

    // --- دوال المساعدة ---
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        screen.classList.remove('hidden');
    }

    function setupPlayerInfo() {
        playerNameSpan.textContent = childName;
        playerNameLearnSpan.textContent = childName;

        if (childPictureUrl) {
            playerPic.src = childPictureUrl;
            playerPic.style.display = 'block';
            playerPicLearn.src = childPictureUrl;
            playerPicLearn.style.display = 'block';
        } else {
            playerPic.style.display = 'none';
            playerPicLearn.style.display = 'none';
        }
    }

    function validateForm() {
        const name = childNameInput.value.trim();
        const table = tableSelect.value;
        const count = questionCountInput.value;

        const isFormValid = name && table && count;

        testBtn.disabled = !isFormValid;
        
        if (table === 'all') {
            learnBtn.disabled = true;
        } else {
            learnBtn.disabled = !isFormValid;
        }
    }

    function displayTable(tableNumber) {
        tableDisplay.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const item = document.createElement('div');
            item.classList.add('table-item');
            item.innerHTML = `<span>${tableNumber} × ${i}</span><span>=</span><strong>${tableNumber * i}</strong>`;
            tableDisplay.appendChild(item);
        }
    }

    function generateQuestions(table, numQuestions) {
        questions = [];
        for (let i = 0; i < numQuestions; i++) {
            let num1, num2, correctAnswer;

            if (table === 'all') {
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
            } else {
                num1 = parseInt(table);
                num2 = Math.floor(Math.random() * 10) + 1;
            }
            
            correctAnswer = num1 * num2;
            
            const options = new Set();
            options.add(correctAnswer);
            
            while (options.size < 4) {
                const distraction = correctAnswer + Math.floor(Math.random() * 10) - 5;
                if (distraction > 0) {
                    options.add(distraction);
                }
            }

            questions.push({
                num1: num1,
                num2: num2,
                correctAnswer: correctAnswer,
                options: Array.from(options).sort(() => Math.random() - 0.5)
            });
        }
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionText.textContent = `${question.num1} × ${question.num2} = ?`;
            questionCountSpan.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
            
            const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;

            answersContainer.innerHTML = '';
            question.options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('answer-option');
                button.textContent = option;
                button.addEventListener('click', () => handleAnswerClick(option, button));
                answersContainer.appendChild(button);
            });

        } else {
            showResults();
        }
    }

    function handleAnswerClick(selectedAnswer, buttonElement) {
        const allButtons = document.querySelectorAll('.answer-option');
        allButtons.forEach(btn => {
            btn.classList.add('disabled');
            btn.style.pointerEvents = 'none';
        });

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        if (isCorrect) {
            score++;
            scoreSpan.textContent = score;
            buttonElement.classList.add('correct');
        } else {
            buttonElement.classList.add('incorrect');
            allButtons.forEach(btn => {
                if (parseInt(btn.textContent) === currentQuestion.correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }
        
        currentQuestionIndex++;

        setTimeout(() => {
            displayQuestion();
        }, 1500);
    }

    function showResults() {
        if (childPictureUrl) {
            resultsPlayerPic.src = childPictureUrl;
            resultsPlayerPic.style.display = 'block';
        } else {
            resultsPlayerPic.style.display = 'none';
        }

        showScreen(resultsScreen);
        const percentage = (score / totalQuestions) * 100;
        let message = `لقد حصلت على ${score} من ${totalQuestions} نقطة. `;
        
        if (percentage === 100) {
            resultTitle.textContent = "🏆 أنت خارق! 🏆";
            message += `ممتاز! لقد أجبت على كل الأسئلة بشكل صحيح!`;
        } else if (percentage >= 80) {
            resultTitle.textContent = "🌟 أداء رائع! 🌟";
            message += `أحسنت! نتائج ممتازة.`;
        } else if (percentage >= 50) {
            resultTitle.textContent = "💪 جيد جداً! 💪";
            message += `أداء جيد! استمر في المحاولة لتتحسن.`;
        } else {
            resultTitle.textContent = "❤️ لا بأس! ❤️";
            message += `الممارسة تجعل المعالي! حاول مرة أخرى.`;
        }
        
        finalMessageP.textContent = message;
    }

    function resetGame() {
        score = 0;
        currentQuestionIndex = 0;
        totalQuestions = 10;
        scoreSpan.textContent = '0';
        progressBar.style.width = '0%';
        childNameInput.value = '';
        tableSelect.value = '';
        questionCountInput.value = 10;
        childPictureInput.value = '';
        imagePreview.src = 'https://via.placeholder.com/100';
        childPictureUrl = '';
        tableDisplay.innerHTML = '';
        resultsPlayerPic.style.display = 'none';
        
        validateForm();
        
        showScreen(welcomeScreen);
    }

    // --- معالجات الأحداث (Event Listeners) ---
    childPictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                childPictureUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = 'https://via.placeholder.com/100';
            childPictureUrl = '';
        }
    });

    childNameInput.addEventListener('input', validateForm);
    tableSelect.addEventListener('change', validateForm);
    questionCountInput.addEventListener('input', validateForm);

    learnBtn.addEventListener('click', () => {
        childName = childNameInput.value.trim();
        selectedTable = tableSelect.value;

        setupPlayerInfo();
        tableNumberDisplay.textContent = selectedTable;
        displayTable(selectedTable);
        showScreen(learnScreen);
    });

    testBtn.addEventListener('click', () => {
        childName = childNameInput.value.trim();
        selectedTable = tableSelect.value;
        totalQuestions = parseInt(questionCountInput.value);

        setupPlayerInfo();
        generateQuestions(selectedTable, totalQuestions);
        score = 0;
        currentQuestionIndex = 0;
        scoreSpan.textContent = score;
        showScreen(gameScreen);
        displayQuestion();
    });
    
    startQuizFromLearnBtn.addEventListener('click', () => {
        totalQuestions = parseInt(questionCountInput.value);
        generateQuestions(selectedTable, totalQuestions);
        score = 0;
        currentQuestionIndex = 0;
        scoreSpan.textContent = score;
        showScreen(gameScreen);
        displayQuestion();
    });

    restartBtn.addEventListener('click', resetGame);

});