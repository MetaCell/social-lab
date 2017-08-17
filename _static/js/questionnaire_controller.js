/**
 * Created by giovanniidili on 17/08/2017.
 */
QuestionnaireController = {
    questionnaireId: undefined,
    questions: undefined,
    questionnaires: undefined,

    init: function (questionnaireId) {
        this.questionnaireId = questionnaireId;

        if(questionnaireId != '' && questionnaireId != undefined) {
            var that = this;

            // load questionnaires and questions here
            $.getJSON("/_static/questions/questionnaires.json", function (json) {
                that.questionnaires = json;
            });
            $.getJSON("/_static/questions/questions.json", function (json) {
                that.questions = json;
            });
        }
    },

    showQuestionnaire: function () {
        // TODO: bring up dialog with all the questions in the questionnaire
    },

    getQuestionnaireResult: function () {
        // TODO: grab results from DOM put together json and return
    }
};
