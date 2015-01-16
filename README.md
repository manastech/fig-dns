# fig-dns

This is a simple DNS server that can be used to route user friendly domain names to Docker containers managed by Fig.

Using the Fig's name conventions, if you have a project named *myproject* and a container named *server*, then the DNS server will resolve the host *server.myproject.docker* to the IP address of the container.

## Install

Currently the instalation process is manual (this should change in the future).

### DNS Server

It's a regular npm package, so it can be installed simply doing:

```
$ npm install -g fig-dns
```

Once installed it can be started executing `fig-dns` in the command line.

To let your OS hit this DNS server for the *.docker* domains, add a file at _/etc/resolver/docker_ with the contents:

```
nameserver 127.0.0.1
port 9999
```

### Routing

If you are using [boot2docker](http://boot2docker.io/) you must add a routing rule to redirect the packets to the *boot2docker* VM.

In Mac OS you can do this executing:

```
$ sudo route -n add 172.17.0.0/16 `boot2docker ip`
```

> TODO: add instructions for Linux
