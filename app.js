var twitter = require('twitter')
  , Nike = require('node-nike')
  , cronJob = require('cron').CronJob
  , https = require('https')
  , numeral = require('numeral');

var twit = new twitter({
  consumer_key: process.env.TWITTER_FUEL_TWITTER_CONSUMER_KEY || '',
  consumer_secret: process.env.TWITTER_FUEL_TWITTER_CONSUMER_SECRET || '',
  access_token_key: process.env.TWITTER_FUEL_TWITTER_ACCESS_TOKEN_KEY || '',
  access_token_secret: process.env.TWITTER_FUEL_TWITTER_ACCESS_TOKEN_SECRET || ''
});

var nike = new Nike(process.env.TWITTER_FUEL_NIKE_ACCESS_TOKEN);

var cronTab = {
  cronTime: '*/10 * * * *',
  start: false
};
cronTab.onTick = function() {
  twit.showUser('desmondmorris', function(user){
    var description = user.description;
    var params = {description: ''};
    nike.aggregate(function(err, data){
      if ( data && ("summaries" in data) ) {
        var fuel = data.summaries[0].records[0].recordValue;

        var matches = description.match("( :: #NikeFuel: [0-9,]+$)");

        var copy = ' :: #NikeFuel: ' + numeral(fuel).format('0,0');

        params.description = !matches ? params.description + copy : description.replace(matches[0], copy);

        twit.updateProfile(params, function(ret){
          console.log('Description updated: ' + ret.description);
        });
      }
    });
  });
}
var job = new cronJob(cronTab).start();


https.createServer({}).listen(8080);
