/**
 * Created by giovanniidili on 03/02/2017.
 */
casper.test.begin('Social Lab - Basic Test', 6, function suite(test) {
    casper.options.viewportSize = {
        width: 1340,
        height: 768
    };

    casper.start("http://127.0.0.1:8000/", function() {
      this.waitForSelector('div[id="socialLablogo"]', function() {
        this.echo("I've waited for 10 seconds.");
        test.assertTitle("Social Lab", "Homepage title is the one expected");
        test.assertExists('div[id="socialLablogo"]', "Social lab logo found");
        test.assertExists('a[id="chat-game-link"]', "Chat game button found");
        test.assertExists('a[id="trust-game-link"]', "Trust game button found");
        test.assertExists('a[id="ultimatum-game-link"]', "Ultimatum game button found");
        test.assertExists('a[id="peacewar-game-link"]', "Peace/war game button found");
      }, null, 3000);
    });

    casper.run(function() {
        test.done();
    });
});