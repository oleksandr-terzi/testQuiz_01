import { quizData } from "./quizData.js";

$(document).ready(function () {
  const quizContainer = $("#quiz-container");
  const formContainer = $("#form-container");
  const quizForm = $("#quiz-form");

  let currentQuestion = 0;
  let userAnswers = [];

  $("#phone").mask("(000) 000-0000");

  const phoneInputField = document.querySelector("#phone");
  const phoneInput = window.intlTelInput(phoneInputField, {
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  $("#quiz-form").on("submit", function (event) {
    event.preventDefault();
    const phoneNumber = phoneInput.getNumber();
    console.log("Phone number:", phoneNumber);
  });

  function createQuizBlock(questionData) {
    const blockHTML = `
            <div class="quiz-block d-flex flex-column gap-3">
                <h3>${questionData.question}</h3>
                <img width="512" height="400"src="${
                  questionData.image
                }" alt="Question Image">
                <div class="options">
                    ${questionData.options
                      .map(
                        (option, index) => `
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="answer" value="${index}">
                            ${option}
                        </label>
                    `
                      )
                      .join("")}
                </div>
                <button class="btn btn-primary w-25 next-btn ">Next</button>
                <button class="btn btn-primary w-25 prev-btn ">Prev</button>
            </div>
        `;
    return blockHTML;
  }

  function showQuizBlock(questionIndex) {
    if (questionIndex < quizData.length) {
      quizContainer.empty().append(createQuizBlock(quizData[questionIndex]));
    } else {
      quizContainer.hide();
      formContainer.show();
    }
  }

  function initialize() {
    showQuizBlock(currentQuestion);

    quizContainer.on("click", ".next-btn", function () {
      const selectedOption = $("input[name='answer']:checked").val();
      if (selectedOption !== undefined) {
        userAnswers[currentQuestion] = selectedOption;
        currentQuestion++;
        showQuizBlock(currentQuestion);

        $("#answers").val(JSON.stringify(userAnswers));
        console.log(userAnswers);
      }
    });

    quizContainer.on("click", ".prev-btn", function () {
      if (currentQuestion !== 0) {
        currentQuestion--;
        showQuizBlock(currentQuestion);
        $("#answers").val(JSON.stringify(userAnswers.pop()));
        console.log(userAnswers);
      }
    });

    $.validator.addMethod("regexp", function (value, element, params) {
      const expression = new RegExp(params);
      return this.optional(element) || expression.test(value);
    });

    quizForm.validate({
      rules: {
        fname: {
          required: true,
          minlength: 3,
          regexp: /^[a-zA-Z\s]+$/,
        },
        lname: {
          required: true,
          minlength: 3,
          regexp: /^[a-zA-Z\s]+$/,
        },
        email: {
          required: true,
          email: true,
        },
        phone: {
          minlength: 10,
          required: true,
        },
      },

      messages: {
        fname: {
          required: "Please specify your name",
          minlength: "Name is too short",
          regexp: "Name must contain Latin letters",
        },
        lname: {
          required: "Please specify your last name",
          minlength: "Last name is too short",
          regexp: "Last name must contain Latin letters",
        },
        email: {
          required: "We need your email address to contact you",
          email: "Your email address must be in the format of name@domain.com",
        },
        phone: {
          minlength: "Phone is too short",
          required: "We need your phone to contact you",
        },
      },
      submitHandler: function (form) {
        if ($(quizForm).valid()) {
          $.ajax({
            type: "POST",
            url: "../php/index.php",
            data: $(quizForm).serialize(),
            success: function (response) {
              alert("Form submitted successfully!");
            },
            error: function (xhr, status, error) {
              alert("An error occurred while submitting the form.");
            },
          });
        } else {
          alert("Fill the form, please!");
        }

        return false;
      },
    });
  }

  initialize();
});
