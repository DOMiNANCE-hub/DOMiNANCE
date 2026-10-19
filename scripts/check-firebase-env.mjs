import {loadEnv} from 'vite';
import {firebaseConfiguration, firebaseConfigurationStatus} from '../src/firebase-mode.js';
import {DEVELOPMENT_PROJECT} from './firebase-development-config.mjs';

const env = {...loadEnv('development', process.cwd(), 'VITE_'), ...process.env};
const {config} = firebaseConfiguration({...env, MODE:'development', DEV:true});
const status = firebaseConfigurationStatus(config);
// Diagnostics contain variable names only; never print configuration values.
if (status.missing.length) console.error('Missing: ' + status.missing.join(', '));
if (status.placeholders.length) console.error('Replace examples: ' + status.placeholders.join(', '));
const correctProject = config.projectId === DEVELOPMENT_PROJECT;
if (status.ready && !correctProject) console.error('Project differs from the approved development project.');
if (status.ready && correctProject) console.log('Required Web configuration is present for the approved development project. No network request was made.');
process.exitCode = status.ready && correctProject ? 0 : 1;
