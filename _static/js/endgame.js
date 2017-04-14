$(document).ready(function () {
    var MTURK_DESCRIPTION = "Task Completed! Copy-paste the session code below into the mturk survey.<br/>";
    var PROLIFIC_DESCRIPTION = "Task Completed! Copy-paste the session code below into the prolific survey.<br/>";

    var platform = $('#platform').html();
    var worker_id = $('#worker_id').html();
    var completion_url = $('#completion_url').html();
    var session_id = $('#session_id').html();

    if(platform != ''){
        // swap content text with platform dependent text
        var contentText = (platform == 'mturk') ? MTURK_DESCRIPTION : PROLIFIC_DESCRIPTION;
        $('#content').html(contentText);

        // show session id
        $('#display-items-container').append("<p><b>Session Code:</b>" + session_id + "</p>");

        // show completion url if any as clickable
        if(completion_url!=''){
             $('#display-items-container').append("<p><a href='" + completion_url + "' target='_blank'>Click here to complete the task</p>");
        }

        // hide leave button, no way out if coming from external platform
        $('button[name=leave]').hide();
    }
});