/**
 * Created by giovanniidili on 03/02/2017.
 */
casper.test.begin('Social Lab - Basic Test', 2, function suite(test) {
    casper.options.viewportSize = {
        width: 1340,
        height: 768
    };

    casper.start("http://127.0.0.1:8000/", function() {
      this.waitForSelector('div[id="socialLablogo"]', function() {
        this.echo("I've waited for 10 seconds.");
        test.assertTitle("Social Lab", "Homepage title is the one expected");
        test.assertExists('div[id="socialLablogo"]', "Social lab logo found");
      }, null, 30000);
    });

    casper.run(function() {
        test.done();
    });
});