/**
 * Created by matteocantarelli on 06/04/2017.
 */
QuestionsController = {

    questions: undefined,
    gameConfig: undefined,
    socket: undefined,

    getQuestions: function (round) {
        var gameQuestions = {};
        for (var i = 0; i < this.gameConfig.length; i++) {
            var addQuestion = false;
            if (this.gameConfig[i].round != undefined) {
                addQuestion = this.gameConfig[i].round == round;
            }
            else if (this.gameConfig[i].frequency != undefined) {
                addQuestion = round % this.gameConfig[i].frequency == 0;
            }
            if (addQuestion) {
                var id = this.gameConfig[i].questionId;
                gameQuestions[id] = this.questions[id];
            }
        }
        return gameQuestions;
    },

    init: function (game) {
        //connect to the socket
        var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
        var sessionId = $("#sessionId").html();
        var playerIdInSession = $("#playerIdInSession").html();
        this.socket = new WebSocket(ws_scheme + "://" + window.location.host + "/question/" + sessionId + "," + playerIdInSession + "/" );
        //load the questions
        var that = this;
        $.getJSON("/_static/questions/questions.json", function (json) {
            that.questions = json;
        });
        $.getJSON("/_static/questions/"+ game + "Config.json", function (json) {
            that.gameConfig = json;
        });

    },

    showQuestions: function (round) {
        var questions = QuestionsController.getQuestions(round);
        for(var questionId in questions){
            this.showQuestion(round, questionId, questions[questionId]);
        }
    },

    showQuestion: function(round, questionId, question){
        switch(question.type){
            case "text":{
                $("#question-text-field").val("");
                $("#textQuestion").show();
                $("#booleanQuestion").hide();
                $("#rangeQuestion").hide();
                break;
            }
            case "range":{
                $("#question-range-field").slider({min:question.min,max:question.max});
                $("#rangeQuestion").show();
                $("#booleanQuestion").hide();
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
                    val = $("#question-range-field").data().value;

                    break;
                }
                case "choice": {
                    val = $("#choiceQuestion span.filter-option").html()
                    break;
                }
            };
            that.submitAnswer(questionId, round, val);
            $("#question-dialog").modal('hide');
        });

        $("#question-dialog").modal({backdrop: 'static', keyboard: false});
    },

    submitAnswer : function(questionId, round, answer){
        var message = '{"questionId":"' + questionId + '", "round":"' + round  + '", "answer":"' + answer+'"}';
        this.socket.send(message);
    }
};
