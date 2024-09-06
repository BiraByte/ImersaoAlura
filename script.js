document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.quiz-container');
    const resultContainer = document.getElementById('resultado');
    const resultadoMsg = document.getElementById('resultado-msg');
    const explicacaoDiv = document.getElementById('explicacao');
    const resultadoBotao = document.getElementById('resultado-botao');
    const verificarBotoes = document.querySelectorAll('.verificar-botao');
    let currentQuestionIndex = 0;
    const respostasCorretas = {
        q1: 'b',
        q2: 'b',
        q3: 'c',
        q4: 'c',
        q5: 'b'
    };

    function showQuestion(index) {
        containers.forEach((container, i) => {
            container.style.display = (i === index) ? 'block' : 'none';
        });

        // Exibir ou ocultar o botão "Próxima Pergunta"
        containers[currentQuestionIndex].querySelector('#proximo-botao').style.display = (index === containers.length - 1) ? 'none' : 'block';

        // Ocultar o botão de resultado até a última pergunta
        resultadoBotao.style.display = (index === containers.length - 1) ? 'block' : 'none';
    }

    function showNextQuestion() {
        if (currentQuestionIndex < containers.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    }

    function showResults() {
        let score = 0;
        let explicacaoHtml = '';

        containers.forEach((container) => {
            const question = container.querySelector('.options-container');
            const selectedOption = question.querySelector('.option-button.selected');
            const questionId = container.id;
            const questionName = questionId.replace('pergunta', 'q');

            if (selectedOption) {
                const selectedValue = selectedOption.getAttribute('data-value');
                const correctAnswer = respostasCorretas[questionName];

                if (selectedValue === correctAnswer) {
                    score++;
                    explicacaoHtml += `<p><strong>${container.querySelector('h2').innerText}</strong>: Você acertou!</p>`;
                } else {
                    explicacaoHtml += `<p><strong>${container.querySelector('h2').innerText}</strong>: Você errou! A resposta correta é "${getAnswerText(correctAnswer, container)}".</p>`;
                }
            } else {
                const correctAnswer = respostasCorretas[questionName];
                explicacaoHtml += `<p><strong>${container.querySelector('h2').innerText}</strong>: Você não respondeu! A resposta correta é "${getAnswerText(correctAnswer, container)}".</p>`;
            }
        });

        resultadoMsg.textContent = `Você acertou ${score} de ${containers.length} perguntas.`;
        explicacaoDiv.innerHTML = explicacaoHtml;
        resultContainer.style.display = 'block';
    }

    function getAnswerText(value, container) {
        return Array.from(container.querySelectorAll('.option-button'))
            .find(button => button.getAttribute('data-value') === value)
            .innerText;
    }

    function verificarResposta(event) {
        const container = event.target.closest('.quiz-container');
        const question = container.querySelector('.options-container');
        const selectedOption = question.querySelector('.option-button.selected');
        const questionId = container.id;
        const questionName = questionId.replace('pergunta', 'q');
        const correctAnswer = respostasCorretas[questionName];
        const feedback = container.querySelector('.feedback');

        if (selectedOption) {
            const selectedValue = selectedOption.getAttribute('data-value');
            const isCorrect = selectedValue === correctAnswer;

            feedback.textContent = isCorrect ? 'Você acertou!' : `Você errou! A resposta correta é ${getAnswerText(correctAnswer, container)}.`;
            feedback.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
        } else {
            feedback.textContent = `Você não respondeu! A resposta correta é ${getAnswerText(correctAnswer, container)}.`;
            feedback.className = 'feedback incorrect';
        }

        // Exibir o botão "Próxima Pergunta" após a verificação da resposta
        container.querySelector('#proximo-botao').style.display = 'block';
    }

    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', function() {
            const options = this.parentNode.querySelectorAll('.option-button');
            options.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    verificarBotoes.forEach(button => {
        button.addEventListener('click', verificarResposta);
    });

    // Adicionar evento de clique para cada botão "Próxima Pergunta" dentro de cada pergunta
    document.querySelectorAll('#proximo-botao').forEach(button => {
        button.addEventListener('click', showNextQuestion);
    });

    resultadoBotao.addEventListener('click', showResults);

    showQuestion(currentQuestionIndex);
});

