/**
 * Created by giovanniidili on 03/02/2017.
 */
casper.test.begin('Social Lab - Peace/War Game test vs Bot', 21, function suite(test) {
    casper.options.viewportSize = {
        width: 1340,
        height: 768
    };

    // show unhandled js errors
    casper.on("page.error", function (msg, trace) {
        this.echo("Error: " + msg, "ERROR");
    });

    // show page level errors
    casper.on('resource.received', function (resource) {
        var status = resource.status;
        if (status >= 400) {
            this.echo('URL: ' + resource.url + ' Status: ' + resource.status);
        }
    });

    casper.start("http://127.0.0.1:8000/", function () {
        this.waitForSelector('div[id="socialLablogo"]', function () {
            test.assertTitle("Social Lab", "Homepage title is the one expected");
            test.assertExists('div[id="socialLablogo"]', "Social lab logo found");
            test.assertExists('a[id="chat-game-link"]', "Chat game button found");
            test.assertExists('a[id="trust-game-link"]', "Trust game button found");
            test.assertExists('a[id="ultimatum-game-link"]', "Ultimatum game button found");
            test.assertExists('a[id="peacewar-game-link"]', "Peace/war game button found");
        }, null, 3000);
    });

    casper.then(function () {
        this.echo("Clicking peace/war play button");
        this.mouseEvent('click', 'a[id="peacewar-game-link"]', "Clicking peace/war play button");
        // wait for page to load
        casper.waitForSelector('button[id="ready-button"]', function () {
            test.assertEquals('http://127.0.0.1:8000/wait/?game=peacewar', casper.getCurrentUrl(), "Wait page url for peace/war game is correct");
        }, null, 3000);
    });

    casper.then(function () {
        this.echo("Clicking ready button to queue up for a game of peace/war");
        this.mouseEvent('click', 'button[id="ready-button"]', "Clicking ready button to queue up for a game of peace/war");
        // wait game to start up to 15 seconds (give time to bot to kick in)
        casper.waitForSelector('button[name="intention"]', function () {
            test.assertEquals(true, casper.getCurrentUrl().endsWith('/peacewar/Intention/1/'), "Casper is correctly on Intention page for peace/war game");
            test.assertExists('button[value="Peace"]', "Peace intention button found");
            test.assertExists('button[value="War"]', "War intention button found");
        }, null, 20000);
    });

    casper.then(function () {
        this.echo("Clicking intend to declare peace button");
        this.mouseEvent('click', 'button[value="Peace"]', "Clicking intend to declare peace button");
        // wait game to start up to 15 seconds (give time to bot to kick in)
        casper.waitForSelector('button[name="decision"]', function () {
            test.assertEquals(true, casper.getCurrentUrl().endsWith('/peacewar/Decision/3/'), "Casper is correctly on Decision page for peace/war game");
            test.assertExists('button[value="Peace"]', "Peace decision button found");
            test.assertExists('button[value="War"]', "War decision button found");
        }, null, 8000);
    });

    casper.then(function () {
        this.echo("Clicking decision to declare war button");
        this.mouseEvent('click', 'button[value="War"]', "Clicking decision to declare war button");
        // wait game to start up to 15 seconds (give time to bot to kick in)
        casper.waitForSelector('input[value="Next"]', function () {
            test.assertEquals(true, casper.getCurrentUrl().endsWith('/peacewar/Results/5/'), "Casper is correctly on peace/war game results screen");
            test.assertExists('input[value="Next"]', "Next button found");
        }, null, 8000);
    });

    casper.then(function () {
        this.echo("Clicking next button");
        this.mouseEvent('click', 'input[value="Next"]', "Clicking next button");
        // wait game to start up to 15 seconds (give time to bot to kick in)
        casper.waitForSelector('button[name="guess"]', function () {
            test.assertEquals(true, casper.getCurrentUrl().endsWith('/humantest/HumanTest/6/'), "Casper is correctly on peace/war game results screen");
            test.assertExists('button[value="Human"]', "Human guess button found");
            test.assertExists('button[value="Robot"]', "Robot guess button found");
        }, null, 8000);
    });

    casper.then(function () {
        this.echo("Clicking Robot guess button");
        this.mouseEvent('click', 'button[value="Robot"]', "Clicking Robot guess button");
        // wait game to start up to 15 seconds (give time to bot to kick in)
        casper.waitForSelector('button[name="leave"]', function () {
            test.assertEquals(true, casper.getCurrentUrl().endsWith('/humantest/TestResult/7/'), "Casper is correctly on thanks/leave screen");
            test.assertExists('button[name="leave"]', "Leave button found");
        }, null, 5000);
    });

    casper.then(function () {
        this.echo("Clicking leave button");
        this.mouseEvent('click', 'button[name="leave"]', "Clicking leave button");
        // wait game to start up to 15 seconds (give time to bot to kick in)
        casper.waitForSelector('a[id="chat-game-link"]', function () {
            test.assertEquals('http://127.0.0.1:8000/', casper.getCurrentUrl(), "Correctly back to home page");
        }, null, 3000);
    });

    casper.run(function () {
        test.done();
    });
});