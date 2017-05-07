#!/usr/bin/env node

import MQTT from 'mqtt';
import { Observable } from 'rxjs';

import MqttTopics from 'mqtt-topics';
import AtlonaMatrix from 'atlona-matrix';

import config from './config.js';

if (!String.prototype.capitalize) {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}

const STATUS_OPTS = { qos: 2, retain: true };

const client = MQTT.connect(config.url, {
    will: {
        topic:   getTopic('connected'),
        payload: "0",
        ...STATUS_OPTS
    }
});

client.publish(getTopic('connected'), '2', STATUS_OPTS);

const matrix = new AtlonaMatrix(config.matrix);

/*
 * publshed topics:
 *   <name>/status/isOn              <- power status (bool)
 *   <name>/status/hardwareInfo      <- hardware info: { type: "", version: "" }
 *   <name>/status/outputStatus      <- output status as a list
 *
 * subscribed topics:
 *   <name>/get/isOn                 <- refetch power status
 *   <name>/get/hardwareInfo         <- refetch hardware info
 *   <name>/get/outputStatus         <- refetch output status
 *
 *   <name>/set/isOn                 <- turn on/off
 *
 *   <name>/set/output/{n}/input/{m} <- set output n to input m
 *   <name>/set/output/{n}/off       <- turn off output n
 *
 *   <name>/set/safeOff              <- turn off matrix if all outputs are off
 *
 */

['isOn', 'hardwareInfo', 'outputStatus']
    .forEach(
        suffix =>
            getMessages(client, getTopic(`get/${suffix}`))
                .startWith({})
                .flatMap(() => matrix[`get${suffix.capitalize()}`]())
                .map(x => ({ client, topic: getTopic(`status/${suffix}`), message: JSON.stringify(x), retain: true }))
                ::publishMessages()
    )

getMessages(client, getTopic('set/output/+/input'))
    .subscribe(({ topic, message }) => {
        let [,,, output] = topic.split('/');
        let input = parseInt(message, 10);
        output = parseInt(output, 10);
        if (!isNaN(input) && !isNaN(output)) {
            matrix.setOutput(output, input);
        }
    })
    ;

getMessages(client, getTopic('set/output/+/off'))
    .subscribe(({ topic, message }) => {
        let [,,, output] = topic.split('/');
        output = parseInt(output, 10);
        var isOff = message === "true";
        if (isOff && !isNaN(output)) {
            matrix.turnOffOutput();
        }
    })
    ;

getMessages(client, getTopic('set/safeOff'))
    .subscribe(({ topic, message }) => {
        var isOff = message === "true";
        if (isOff) {
            matrix.turnOffIfSafe();
        }
    })
    ;

getMessages(client, getTopic('set/isOn'))
    .subscribe(({ topic, message }) => {
        var isOn = message === "true";
        matrix.setIsOn(isOn);
    })
    ;

function getTopic(suffix) {
    return `${config.name}/${suffix}`;
}

function publishMessage({ topic, message, client, retain }) {
    client.publish(topic, message !== null ? message.toString() : null, { qos: 2, retain });
}

function NOOP() { }
function publishMessages(onError = NOOP, onComplete = NOOP) {
    return this.subscribe(
        publishMessage,
        onError,
        onComplete
    );
}

function getMessages(client, ...topics) {
    return new Observable(
        subscriber => {
            client.subscribe(topics);
            client.on('message', (m_topic, msg) => {
                const isMine =
                    topics
                        .reduce(
                            (acc, x) => acc || MqttTopics.match(x, m_topic),
                            false
                        );

                if (isMine) {
                    subscriber.next({
                        topic: m_topic,
                        message: msg.toString()
                    })
                }
            });

            return () => {
                client.unsubscribe(topics);
            }
        }
    );
}
