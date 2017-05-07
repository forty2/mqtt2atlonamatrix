# mqtt2atlonamatrix
> Bridge from MQTT to Atlona HDMI matrix switches. Attempts to follow mqtt-smarthome pattern.

[![NPM Version][npm-image]][npm-url]
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

`mqtt2atlonamatrix` is a Node.js application that links Atlona HDMI matrix switches to an MQTT broker. It is designed to be used to integrate these devices into a home automation system à la [mqtt-smarthome](http://www.github.com/mqtt-smarthome/mqtt-smarthome/).

## Getting Started

`mqtt2atlonamatrix` is distributed through NPM:

```sh
npm install -g mqtt2atlonamatrix

# or, if you prefer:
yarn global add mqtt2atlonamatrix
```

Running it is likewise easy:

```sh
mqtt2atlonamatrix                      # if your MQTT broker is running on localhost
mqtt2atlonamatrix -b mqtt://<hostname> # if your broker is running elsewhere
mqtt2atlonamatrix --help               # to see the full usage documentation
```

## Topics and Payloads

This app is intended to conform to the [mqtt-smarthome](http://www.github.com/mqtt-smarthome/mqtt-smarthome/) architecture.  These are the topics used by `mqtt2atlonamatrix`:

### Topics Published

| Topic                                  | Purpose                                                                          |
|----------------------------------------|----------------------------------------------------------------------------------|
| `atlonamatrix/connected`               | 0 = not connected to anything<br>1 = connected to MQTT but not DVR<br>2 = connected to both.
| `atlonamatrix/status/isOn`             | Power state of the switch as a boolean
| `atlonamatrix/status/hardwareInfo`     | JSON-encoded hardware info; format: `{ "type": "", "version": "" }`
| `atlonamatrix/status/outputStatus`     | The current status of each output as a lis

### Topics Subscribed
For performance reasons, no argument checking is done: commands are passed diectly to the switch.

| Topic                                    | Purpose                                                                          |
|------------------------------------------|----------------------------------------------------------------------------------|
| `atlonamatrix/get/isOn`                  | Force a refresh of the current power state
| `atlonamatrix/get/hardwareInfo`          | Force a refresh of the hardware info
| `atlonamatrix/get/outputStatus`          | Force a refresh of the current output status
| `atlonamatrix/set/isOn        `          | Set the system to Off.
| `atlonamatrix/set/output/{n}/input/{m}`  | Set output n to display input m
| `atlonamatrix/set/output/{n}/off`        | Turn off output n
| `atlonamatrix/set/safeOff`               | Turn off the switch if all outputs are off

## Contributing

Contributions are of course always welcome.  If you find problems, please report them in the [Issue Tracker](http://www.github.com/forty2/mqtt2atlonamatrix/issues/).  If you've made an improvement, open a [pull request](http://www.github.com/forty2/mqtt2atlonamatrix/pulls).

Getting set up for development is very easy:
```sh
git clone <your fork>
cd mqtt2atlonamatrix
yarn
```

And the development workflow is likewise straightforward:
```sh
# make a change to the src/ file, then...
yarn build
node dist/index.js

# or if you want to clean up all the leftover build products:
yarn run clean
```

## Release History

* 1.0.0
    * The first release.

## Meta

Zach Bean – zb@forty2.com

Distributed under the MIT license. See [LICENSE](LICENSE.md) for more detail.

[npm-image]: https://img.shields.io/npm/v/mqtt2atlonamatrix.svg?style=flat
[npm-url]: https://npmjs.org/package/mqtt2atlonamatrix
