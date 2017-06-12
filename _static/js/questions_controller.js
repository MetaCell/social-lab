/**
 * Created by matteocantarelli on 06/04/2017.
 */
QuestionsController = {
    game: undefined,
    questions: undefined,
    gameConfig: undefined,
    socket: undefined,
    currentQuestion:0,
    blockingDialogUp: false,

    getQuestions: function (round, page) {
        var gameQuestions = {};

            for (var i = 0; i < this.gameConfig.length; i++) {
                var addQuestion = false;
                if (this.gameConfig[i].round != undefined) {
                    if(this.gameConfig[i].round == "initial"){
                        addQuestion = (page == "initial");
                    }
                    else if(this.gameConfig[i].round == "final"){
                        addQuestion = (page == "final");
                    }
                    else {
                        addQuestion = (this.gameConfig[i].round == round);
                    }
                }
                else if (this.gameConfig[i].frequency != undefined) {
                    if(!isNaN(parseInt(round))) {
                        addQuestion = ((round % this.gameConfig[i].frequency) == 0);
                    }
                }
                if (addQuestion) {
                    var id = this.gameConfig[i].questionId;
                    gameQuestions[id] = this.questions[id];
                }
        }

        return gameQuestions;
    },

    init: function (game) {
        this.game = game;

        if(game != '' && game != undefined) {
            //connect to the socket
            var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
            var sessionId = $("#sessionId").html();
            var playerIdInSession = $("#playerIdInSession").html();
            var participantCode = $("#participantCode").html();
            this.socket = new WebSocket(ws_scheme + "://" + window.location.host + "/question/" + sessionId + "," + playerIdInSession + "," + participantCode + "/");
            //load the questions
            var that = this;
            $.getJSON("/_static/questions/questions.json", function (json) {
                that.questions = json;
            });
            $.getJSON("/_static/questions/" + game + "Config.json", function (json) {
                that.gameConfig = json;
            });
        }
    },

    showQuestions: function (round, page, callback) {
        if(game != undefined) {
            var questions = QuestionsController.getQuestions(round, page);
            this.currentQuestion=0;

            if(page == "initial" || page == "final"){
                round = page;
            }

            this.showQuestion(round, questions, callback);
        }
    },

    showQuestion: function(round, questions, cb){
        var questionId=Object.keys(questions)[this.currentQuestion];
        if(questionId!=undefined){
            var question=questions[questionId];
            switch(question.type){
                case "text":{
                    $("#question-text-field").val("");
                    $("#textQuestion").show();
                    $("#choiceQuestion").hide();
                    $("#rangeQuestion").hide();
                    break;
                }
                case "range":{
                    $("#question-range-min").html(question.minLabel != undefined ? question.minLabel : question.min);
                    $("#question-range-max").html(question.maxLabel != undefined ? question.maxLabel : question.max);
                    $("#question-range-field").slider({min:question.min,max:question.max});
                    $("#question-range-field").slider('setValue', 0);
                    $("#rangeQuestion").show();
                    $("#choiceQuestion").hide();
                    $("#textQuestion").hide();
                    break;
                }
                case "choice":{
                    //let's clean the choices
                    $("#choiceQuestion").html("");
                    $("#choiceQuestion").append("<select id='question-choice-field' class='selectpicker'></select>");
                    for(var c in question.choices){
                        $("#question-choice-field").append("<option>"+question.choices[c]+"</option>");
                    }
                    $("#question-choice-field").selectpicker();
                    $("#choiceQuestion .btn").removeClass("btn-default");
                    $("#choiceQuestion").show();
                    $("#rangeQuestion").hide();
                    $("#textQuestion").hide();
                    break;
                }
            };

            $("#question-dialog .question").html(question.question);
            $("#question-submit").off('click');

            var that=this;

            $("#question-submit").click(function() {
                var val = "";
                switch (question.type) {
                    case "text": {
                        val = $("#question-text-field").val();
                        break;
                    }
                    case "range": {
                        val = $("#question-range-field").val();
                        break;
                    }
                    case "choice": {
                        val = $("#choiceQuestion span.filter-option").html();
                        break;
                    }
                }

                that.submitAnswer(questionId, round, val);
                $("#question-dialog").modal('hide');
                $(".modal-backdrop").remove();
                that.currentQuestion++;
                //show the next question (the check to evaluate whether there's a next question or not is inside showQuestion)
                setTimeout(function(){ that.showQuestion(round, questions, cb); }, 500);
            });

            $("#question-dialog").modal({backdrop: 'static', keyboard: false});
        }
        else {
            // check that counter exceeds number of questions
            if(cb != undefined && Object.keys(questions).length >= this.currentQuestion){
                // invoke optional callback once rating phase has concluded
                cb();
            }
        }
    },

    showBlockingDialog: function(){
        // show blocking dialog
        $("#question-blocking-dialog").modal({backdrop: 'static', keyboard: false});

        this.blockingDialogUp = true;
    },

    hideBlockingDialog: function(){
        // hide blocking dialog
        $("#question-blocking-dialog").modal('hide');
        $(".modal-backdrop").remove();

        this.blockingDialogUp = false;
    },

    isBlockingDialogUp: function(){
        return this.blockingDialogUp;
    },

    submitAnswer : function(questionId, round, answer){
        var message = '{"questionId":"' + questionId + '", "round":"' + round  + '", "answer":"' + answer+'"}';
        this.socket.send(message);
    }
};
