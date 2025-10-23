$(document).ready(function() {
	let qs = [];
	let startIndex = 0;

	
	let timer = document.getElementById('timer');
	let seconds = 0;
	let minutes = 0;
	let hours = 0;
	let interval;	
	let chooseCorrect = 0;

	$.getJSON("questions-easy.json?v=1", function(data) {
		initQuiz(data);

		$('.quiz-total-questions').text(qs.length);
	});


	$('.next').click(function() {
		if(!$(this).hasClass('disabled')) {
			$(this).addClass('disabled');
			nextItem();
		}
	});


	$(document).on('click', '.choose', function() {
		if(!$(this).hasClass('disabled')) {
			$('.choose').addClass('disabled');


			if(!$(this).hasClass('correct-option')) {
				$(this).removeClass('animate__fadeInRight');
				$(this).addClass('inCorrect animate__shakeX');
			} else {
				chooseCorrect++;
			}

			setTimeout(function() {
				$('.choose.correct-option').addClass('correct');
					typeExplanation();
					$('.next').removeClass('disabled');
			}, 600);
		}

	});


	$('.reset').click(function() {
		reset();
		initQuiz(qs);
	});

	$('.load').click(function() {
		const src = $(this).attr('data-src');

		getQuiz(src);
	});



	function getQuiz(src) {
		reset();

		$.getJSON(`${src}?v=1`, function(data) {
			initQuiz(data);

			console.log(data.length);

			$('.quiz-total-questions').text(qs.length);
		});
	}


	function reset() {
	  clearInterval(interval);		
	  startIndex = 0;
	  seconds = 0;
	  minutes = 0;
	  hours = 0;	
	  chooseCorrect = 0;		
	  timer.textContent = '00:00:00';
	  $('.quiz-option-list').html('');
	}




	function initQuiz(data) {
		qs = data;
		interval = setInterval(updateTime, 1000);				
		updateTime();
		drawItem(qs[startIndex]);				
	}

    /**
	 *  "question": "Müştəriyə endirim təklif etmək nə vaxt məqsədəuyğundur?",
	 *  "options": ["Satış bağlanmaq üzrədirsə", "Hər gələn müştəriyə dərhal", "Günün əvvəlində", "Endirim təklif etmək olmaz"],
	 *  "correct": 0,
	 *  "explanation": "Endirim yalnız qərar vermək üzrə olan müştərilərə təklif edildikdə effektiv olur."
	*/
	function drawItem(item) {
		$('.questions-text').text(item.question);

		item.options.forEach((row, index) => {
			hasCorrect = '';

			if(index == item.correct) {
				hasCorrect = 'correct-option'
			}

			$('.quiz-option-list').append(`
				<button style="--animate-duration: 1.${index}s" class="animate__animated animate__fadeInRight animate__fast quiz-option-item choose ${hasCorrect}" data-exp="${item.explanation}">
					<span class="quiz-option-text">${row}</span>
				</button>
			`);
		});

		$('.quiz-current-questions').text(startIndex + 1);	
			
		let percent = (startIndex + 1) / qs.length * 100;

		$('.quiz-progress').css('width', percent + '%');	
	}

	function nextItem() {
		startIndex++;
		
		if((qs.length - 1) >= startIndex) {
			resetQuestionsList();
			drawItem(qs[startIndex]);
			console.log(startIndex);
		} else {
			// end
		}
	}


	function resetQuestionsList() {
		$('.quiz-option-list').html('');		
	}

	function updateTime() {
	  seconds++;
	  if (seconds === 60) {
	    minutes++;
	    seconds = 0;
	  }
	  if (minutes === 60) {
	    hours++;
	    minutes = 0;
	  }
	  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}	


	function typeExplanation() {
	    text = $('.choose.correct-option').attr('data-exp');
	    
	    $('.choose.correct-option').closest('.quiz-option-item').after(`
	        <span class="explanation" id="text">
	        	<span>🤓</span>
	        	<span class="explanation-text"></span>
	        </span>
	    `);		
	    
	    // Используем jQuery последовательно
	    el = $('.explanation-text');
	    
	    i = 0;
	    type();
	}

	function type() {
	    if (i < text.length) {
	        el.html(el.text() + text.charAt(i));
	        i++;
	        setTimeout(type, 30);
	    }
	}


});