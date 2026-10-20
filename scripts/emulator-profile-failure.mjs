import {readFileSync} from 'node:fs';
const action=process.argv[2];
if(!['deny','deny-writes','restore'].includes(action))throw new Error('Use deny, deny-writes or restore for the local emulator only.');
const deny="rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if false; } } }";
const writes="rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /users/{uid} { allow read: if request.auth != null && request.auth.uid == uid; allow write: if false; } } }";
const content=action==='deny'?deny:action==='deny-writes'?writes:readFileSync('firestore.rules','utf8');
// In-memory emulator override only. Never edits or deploys firestore.rules.
const response=await fetch('http://127.0.0.1:8080/emulator/v1/projects/demo-dominance:securityRules',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({rules:{files:[{name:'security.rules',content}]}})});
if(!response.ok)throw new Error('Local emulator rule override failed: '+response.status);
const result=await response.json();if(result.issues?.some(issue=>issue.severity==='ERROR'))throw new Error('Emulator rejected test rules');
console.log('demo-dominance only: '+action+' profile access');
