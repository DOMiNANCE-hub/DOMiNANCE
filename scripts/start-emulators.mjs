import {spawn} from 'node:child_process';
import {existsSync,readdirSync,mkdirSync} from 'node:fs';
import path from 'node:path';
const env={...process.env,CI:'true',FIREBASE_CLI_DISABLE_USAGE_REPORTING:'true',NO_UPDATE_NOTIFIER:'1',NODE_USE_SYSTEM_CA:'1'};
delete env.FIREBASE_TOKEN;
delete env.GOOGLE_APPLICATION_CREDENTIALS;
const javaTmp=path.join(env.LOCALAPPDATA||'', 'DOMiNANCE','java-tmp');
mkdirSync(javaTmp,{recursive:true});
// Windows' AF_UNIX connect fails in this environment. A missing Unix socket
// directory makes OpenJDK fall back to TCP loopback; normal temp files remain valid.
env.JAVA_TOOL_OPTIONS='-Djdk.net.unixdomain.tmpdir='+path.join(javaTmp,'tcp-loopback-only')+' -Djava.io.tmpdir='+javaTmp;
const runtimeRoot=path.join(env.LOCALAPPDATA||'', 'DOMiNANCE','emulator-java');
if(existsSync(runtimeRoot)){
 const runtime=readdirSync(runtimeRoot).find(name=>existsSync(path.join(runtimeRoot,name,'bin','java.exe')));
 if(runtime){env.JAVA_HOME=path.join(runtimeRoot,runtime);env.PATH=path.join(env.JAVA_HOME,'bin')+path.delimiter+env.PATH;}
}
// No arguments accepted: neither .firebaserc nor caller flags can select production.
const child=spawn(process.execPath,['node_modules/firebase-tools/lib/bin/firebase.js','emulators:start','--project','demo-dominance','--config','firebase.emulator.json','--only','auth,firestore'],{stdio:'inherit',env});
child.on('error',error=>{console.error(error.message);process.exitCode=1});
child.on('exit',code=>{process.exitCode=code??1});
process.on('SIGINT',()=>child.kill('SIGINT'));
