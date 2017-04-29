var config = require('./config.js');

describe('Hotel room availability', function () {
  before(function () {
    casper.start(config.url);
    casper.on('remote.message', function (message) {
      this.echo(message);
    });
    console.log('Checking: ' + config.url);
  });
  it('should have an element in DOM', function () {
    casper.waitForSelector('#wrapper-outer', function () {
      '#wrapper-outer'.should.be.inDOM;
    });
  });
  it('should load room availability', function () {
    casper.waitFor(function check() {
      return this.evaluate(function () {
        return document.querySelectorAll('.data-loading').length === 0;
      });
    }, function then() {
      // Succeeded
      this.echo('Rooms loaded successfully');
    }, function timeout() {
      this.echo('Failed to load page').exit();
    }, 10000);
  });
  it('should have rooms available', function () {
    casper.thenEvaluate(function () {
      // Succeeded
      var images = document.querySelectorAll('img.group-image');
      this.echo('Rooms found: ' + images.length);
      images.length.should.be.above(0);
    });
  });
  it('should send notification if success', function (done) {
    casper.thenEvaluate(function () {
      $.ajax(config.webhook);
    });
    // Wait to let webhook ajax request finish
    var webhookWaitTime = config.webhookTimeout || 2000;
    casper.wait(webhookWaitTime, function () {
      this.echo("Done!");
    });
  });
});
