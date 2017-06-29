$(document).ready(function () {
    var MTURK_DESCRIPTION = "mTurk Task Completed!<br/> Please copy-paste the session code below into the survey before closing this page.";
    var PROLIFIC_DESCRIPTION = "Prolific Task Completed!<br/> Please copy-paste the session code below into the survey and click on the link before closing this page.";

    var platform = $('#platform').html();
    var worker_id = $('#worker_id').html();
    var completion_url = $('#completion_url').html();
    var session_id = $('#session_id').html();

    var endScreenCallback = function () {
        if (platform != '') {
            // swap content text with platform dependent text
            var contentText = (platform == 'mturk') ? MTURK_DESCRIPTION : PROLIFIC_DESCRIPTION;
            $('#external-platform-dialog .modal-content').append("<p>" + contentText + "</p>");

            // show session id
            $('#external-platform-dialog .modal-content').append("<p>Session Code: <b style='color:red'>" + session_id + "</b></p>");

            // show completion url if any as clickable
            if (completion_url != '') {
                $('#external-platform-dialog .modal-content').append("<p><a href='" + completion_url + "' target='_blank'>Click here to complete the task</p>");
            }

            // open modal
            $("#external-platform-dialog").modal({backdrop: 'static', keyboard: false});
        }
    };

    window.setTimeout(function () {
        QuestionsController.showQuestions($("#round").html(), 'final', endScreenCallback);
    }, 250);
});