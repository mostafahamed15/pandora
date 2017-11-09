'use strict';
const path = require('path');
const PANDORA_LIB_HOME = path.join(__dirname, '../dist');
const {consoleLogger} = require(path.join(PANDORA_LIB_HOME, 'universal/LoggerBroker'));
const {calcAppName, attachEntryParams} = require(path.join(PANDORA_LIB_HOME, 'universal/Helpers'));

exports.command = 'start [targetPath]';
exports.desc = 'Start an application';
exports.builder = (yargs) => {

  yargs.option('name', {
    alias: 'n',
    describe: 'App name, it will get a name from the <targetPath> by default'
  });

  yargs.option('mode', {
    alias: 'm',
    describe: 'The start mode, options: procfile.js or cluster or fork'
  });

  yargs.option('scale', {
    alias: 's',
    describe: 'Only when the start mode be cluster, to specify the worker numbers of cluster'
  });

  yargs.option('inject-monitoring', {
    alias: 'i',
    describe: 'Only when the start mode be fork, inject the monitoring automatically before each child process started',
    boolean: true
  });

};
/**
 * start an app
 * @param argv
 */
exports.handler = function (argv) {
  argv.entry = argv.targetPath;
  const sendParams = attachEntryParams('start', argv, {
    mode: 'procfile.js',
    appName: calcAppName(process.cwd())
  });

  const send = require(path.join(PANDORA_LIB_HOME, 'daemon/DaemonHandler')).send;
  consoleLogger.info('Starting ' + sendParams.appName + ' at ' + sendParams.appDir);

  send('start', sendParams, (err, data) => {
    if (err) {
      consoleLogger.error(data);
      process.exit(1);
      return;
    }
    consoleLogger.info(data);
    process.exit(0);
  });

};