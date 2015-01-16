#!/usr/bin/env node

var Docker = require('dockerode');
var named = require('node-named');
var async = require('async');

var docker = new Docker();
var server = named.createServer();

server.listen(9999, '127.0.0.1', function() {
  console.log('DNS server started on port 9999');
});

server.on('query', function(query) {
  var domain = query.name();
  var type = query.type();

  switch (type) {
  case 'A':
    console.log('DNS Query: (%s) %s', type, domain);

    domainParts = domain.split('.');
    domainParts.pop();

    switch (domainParts.length) {
    case 1:
      dockerPattern = "^\\/" + domainParts[0] + "_web_\\d+$";
      break;
    case 2:
      dockerPattern = "^\\/" + domainParts[1] + "_" + domainParts[0] + "_\\d+$";
      break;
    default:
      server.send(query);
      return;
    }

    docker.listContainers(function (err, containers) {

      matchingContainers = containers.filter(function (container) {
        return container['Names'].some(function (name) { return name.match(dockerPattern) });
      })

      async.each(matchingContainers,
        function (container, callback) {
          docker.getContainer(container['Id']).inspect(function (err, data) {
            var ip = data['NetworkSettings']['IPAddress'];
            record = new named.ARecord(ip);
            query.addAnswer(domain, record, 15);
            callback();
          });
        },
        function (err) {
          server.send(query);
        }
      );
    });
    break;

  default:
    server.send(query);
  }

});
