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

    getQuestionnaireLabel: function (){
        var label = '';

        if (this.questionnaireId != undefined && this.questionnaires[this.questionnaireId] != undefined) {
            // get questionnaire list of questions
            label = this.questionnaires[this.questionnaireId].label;
        }

        return label;
    },

    getQuestionnaireQuestions: function () {
        var questionnaireQuestions = [];

        if (this.questionnaireId != undefined && this.questionnaires[this.questionnaireId] != undefined) {
            // get questionnaire list of questions
            var questionIds = this.questionnaires[this.questionnaireId].questions;
            for (var i = 0; i < questionIds.length; i++) {
                questionnaireQuestions.push({
                    id: questionIds[i],
                    value: this.questions[questionIds[i]]
                });
            }
        }

        return questionnaireQuestions;
    },

    showQuestionnaire: function () {
        // append label to #questionnaireLabel
        $("#questionnaireLabel").html(this.getQuestionnaireLabel());

        // loop through questions, generate markup and append questions to #questionnaireContent
        var questions = this.getQuestionnaireQuestions();
        for(var i=0; i<questions.length; i++){
            var question = questions[i];

            if(question.value.type == "text"){
                // get text template
                var textFieldTemplate = $("#textQuestionTemplate").html();
                // build data to inject
                var textFieldData = {
                    questionId: question.id + i,
                    label: (i+1) + " - " + question.value.question
                };
                // append
                $.tmpl(textFieldTemplate, textFieldData).appendTo("#questionnaireContent");
            } else if (question.value.type == "range"){
                // get range template
                var rangeFieldTemplate = $("#rangeQuestionTemplate").html();
                // inject id, label, minRange, maxRange
                var rangeFieldData = {
                    questionId: question.id + i,
                    label: (i+1) + " - " + question.value.question,
                    maxLabel: question.value.maxLabel != undefined ? question.value.maxLabel : question.value.max,
                    minLabel: question.value.minLabel != undefined ? question.value.minLabel : question.value.min
                };
                // append
                $.tmpl(rangeFieldTemplate, rangeFieldData).appendTo("#questionnaireContent");
                // make into slider field
                var rangeSelector = rangeFieldData.questionId  + "-range-field";
                $("#" + rangeSelector).slider({min:question.value.min,max:question.value.max});
                // set default center value
                var centerVal = (question.value.max + question.value.min)/2;
                    if(centerVal == undefined || isNaN(centerVal)){
                        centerVal = 0;
                    }
                $("#" + rangeSelector).slider('setValue', centerVal);
            } else if (question.value.type == "choice"){
                // get choice template
                var choiceFieldTemplate = $("#choiceQuestionTemplate").html();
                // inject id, label
                var choiceFieldData = {
                    questionId: question.id + i,
                    label: (i+1) + " - " + question.value.question
                };
                // append
                $.tmpl(choiceFieldTemplate, choiceFieldData).appendTo("#questionnaireContent");
                // add options
                var choiceSelector = choiceFieldData.questionId  + "-choice-field";
                for(var c in question.value.choices){
                    $("#" + choiceSelector).append("<option>"+question.value.choices[c]+"</option>");
                }
                $("#" + choiceSelector).selectpicker();
                $("#" + choiceFieldData.questionId + " .btn").removeClass("btn-default");
            }
        }

        // bring up questionnaire-dialog
        $("#questionnaire-dialog").modal({backdrop: 'static', keyboard: false});
    },

    getQuestionnaireResults: function () {
        // TODO: use generated ids to grab results from DOM based on input type and put together json to return
    }
};
