/**
 * Created by matteocantarelli on 06/04/2017.
 */
QuestionsController =
    {

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
                var answer = this.showQuestion(questions[questionId]);
                this.submitAnswer(questionId, round, answer);
            }
        },

        showQuestion: function(question){
            //TODO Replace with proper UI
            return prompt(question.question, "type here");
        },

        submitAnswer : function(questionId, round, answer){
            var message = '{"questionId":"' + questionId + '", "round":"' + round  + '", "answer":"' + answer+'"}';
            this.socket.send(message);
        }
    }
