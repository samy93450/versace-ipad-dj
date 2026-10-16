(()=>{
function pauseForNotification(){++radioEpoch;++epoch;cancelFade();decks.forEach(audio=>audio.pause());radioWanted=false;radioSwitching=false;clearRadioTimers();radio.pause();indicators();closeDrawer();for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();}
// Keep this visible player awake; browser and system policies remain authoritative.
let screenSentinel=null,screenRequestPending=false,screenPageActive=true,screenRetry;
function screenLockStatus(status){document.documentElement.dataset.screenWakeLock=status;const footer=document.querySelector('#player>footer');if(footer)footer.title=status==='active'?'Écran maintenu allumé':status==='unsupported'?'Maintien de l’écran non disponible sur ce navigateur':'Maintien de l’écran en attente du système'}
async function keepPlayerScreenOn(){
 if(!('wakeLock' in navigator)){screenLockStatus('unsupported');return}
 if(!screenPageActive||document.visibilityState!=='visible'||screenRequestPending||(screenSentinel&&!screenSentinel.released))return;
 screenRequestPending=true;
 try{
 const sentinel=await navigator.wakeLock.request('screen');
 if(!screenPageActive||document.visibilityState!=='visible'){await sentinel.release();return}
 screenSentinel=sentinel;screenLockStatus('active');
 sentinel.addEventListener('release',()=>{if(screenSentinel===sentinel){screenSentinel=null;screenLockStatus('released');clearTimeout(screenRetry);if(screenPageActive&&document.visibilityState==='visible')screenRetry=setTimeout(keepPlayerScreenOn,2000)}},{once:true});
 }catch(error){screenLockStatus('unavailable')}
 finally{screenRequestPending=false}
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')keepPlayerScreenOn();else{clearTimeout(screenRetry);if(screenSentinel)screenSentinel.release().catch(()=>{})}});
window.addEventListener('pageshow',()=>{screenPageActive=true;keepPlayerScreenOn()});
window.addEventListener('pagehide',()=>{screenPageActive=false;clearTimeout(screenRetry);if(screenSentinel)screenSentinel.release().catch(()=>{})});
window.addEventListener('focus',keepPlayerScreenOn);
document.addEventListener('pointerdown',keepPlayerScreenOn,{passive:true});document.addEventListener('keydown',keepPlayerScreenOn);
decks.forEach(audio=>audio.addEventListener('playing',keepPlayerScreenOn));
keepPlayerScreenOn();

// One-shot local alarm with persistent settings and a branded foreground alert.

let notificationAudioContext=null,notificationNodes=[],notificationSoundGeneration=0,nightSpeechTimer=null,alarmIntroTimer=null;
function stopNotificationChime(){++notificationSoundGeneration;for(const oscillator of notificationNodes){try{oscillator.stop()}catch(e){}}notificationNodes=[]}
async function playNotificationChime(){stopNotificationChime();const generation=notificationSoundGeneration;try{if(!notificationAudioContext)notificationAudioContext=new (window.AudioContext||window.webkitAudioContext)();await notificationAudioContext.resume();if(generation!==notificationSoundGeneration)return;const context=notificationAudioContext,start=context.currentTime;[392,523.25,783.99].forEach((frequency,i)=>{[1,2.005].forEach((harmonic,j)=>{const oscillator=context.createOscillator(),envelope=context.createGain(),at=start+i*.2;oscillator.type='sine';oscillator.frequency.value=frequency*harmonic;envelope.gain.setValueAtTime(0,at);envelope.gain.linearRampToValueAtTime(j===0?.32:.065,at+.012);envelope.gain.exponentialRampToValueAtTime(.0001,at+1.25);oscillator.connect(envelope).connect(context.destination);oscillator.start(at);oscillator.stop(at+1.3);notificationNodes.push(oscillator);oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();notificationNodes=notificationNodes.filter(node=>node!==oscillator)}})})}catch(e){}}
const ALARM_STORAGE_KEY='versace-local-alarm-v1';
let savedAlarm=null,alarmNotification=null,ringingMessage='';
try{const stored=JSON.parse(localStorage.getItem(ALARM_STORAGE_KEY)||'null');if(stored&&Number.isFinite(stored.at)&&typeof stored.message==='string')savedAlarm=stored}catch(e){}
function persistAlarm(){try{if(savedAlarm)localStorage.setItem(ALARM_STORAGE_KEY,JSON.stringify(savedAlarm));else localStorage.removeItem(ALARM_STORAGE_KEY)}catch(e){}}
function refreshAlarmUI(){const active=!!savedAlarm;$('alarmScreenStatus').hidden=!active;$('alarmScreenStatus').textContent='RÉVEIL ACTIVÉ';$('alarmScreenStatus').title=active?new Date(savedAlarm.at).toLocaleString('fr-FR'):'';$('alarmButton').classList.toggle('armed',active);$('alarmBadge').textContent=active?new Date(savedAlarm.at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):'';$('alarmButton').setAttribute('aria-label',active?'Réveil activé à '+$('alarmBadge').textContent:'Configurer le réveil');$('alarmSchedule').textContent=active?'Réveil prévu le '+new Date(savedAlarm.at).toLocaleString('fr-FR',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}):'Aucun réveil activé';$('cancelAlarm').disabled=!active}
function stopAlarmSound(){stopSpokenNotification()}
function nextAlarmTimestamp(timeValue,nowValue=Date.now()){if(!/^\d{2}:\d{2}$/.test(timeValue))return null;const [hours,minutes]=timeValue.split(':').map(Number);if(!Number.isInteger(hours)||!Number.isInteger(minutes)||hours<0||hours>23||minutes<0||minutes>59)return null;const due=new Date(nowValue);due.setHours(hours,minutes,0,0);if(due.getTime()<=nowValue)due.setDate(due.getDate()+1);return due.getTime()}
let alarmIsSimulation=false;function ringAlarm(message,simulation=false){alarmIsSimulation=simulation;if(!simulation){savedAlarm=null;persistAlarm();refreshAlarmUI()}$('alarmAlertTitle').textContent=simulation?'RÉVEIL · SIMULATION':'RÉVEIL';$('snoozeAlarm').disabled=simulation;ringingMessage=message;pauseForNotification();if($('alarmSettings').open)$('alarmSettings').close();$('alarmAlertMessage').textContent=message;$('alarmAlertTime').textContent=new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});if(!$('alarmAlert').open)$('alarmAlert').showModal();startSpokenNotification(message,true);if(!simulation&&'Notification' in window&&Notification.permission==='granted'){try{alarmNotification=new Notification('VERSACE · RÉVEIL',{body:message,icon:new URL('assets/medusa-deck.png',location.href).href,tag:'versace-alarm'});alarmNotification.onclick=()=>window.focus()}catch(e){}}}
function checkAlarm(){if(!savedAlarm||Date.now()<savedAlarm.at)return;if(Date.now()-savedAlarm.at>10*60*1000){savedAlarm=null;persistAlarm();refreshAlarmUI();return}ringAlarm(savedAlarm.message)}
$('alarmButton').onclick=()=>{const date=savedAlarm?new Date(savedAlarm.at):new Date(Date.now()+3600000);$('alarmHour').value=String(date.getHours()).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0');$('alarmMessage').value=savedAlarm?savedAlarm.message:'Il est l’heure de se réveiller !';refreshAlarmUI();$('alarmSettings').showModal()};
$('closeAlarmSettings').onclick=()=>{stopAlarmSound();$('alarmSettings').close()};
$('alarmForm').onsubmit=event=>{event.preventDefault();const at=nextAlarmTimestamp($('alarmHour').value);if(at===null)return;savedAlarm={at,message:$('alarmMessage').value.trim()||'Il est l’heure de se réveiller !'};persistAlarm();refreshAlarmUI();stopAlarmSound();keepPlayerScreenOn();if('Notification' in window&&Notification.permission==='default')Notification.requestPermission().catch(()=>{});};
$('cancelAlarm').onclick=()=>{savedAlarm=null;persistAlarm();refreshAlarmUI();stopAlarmSound()};
$('testAlarm').onclick=()=>speakNotification($('alarmMessage').value.trim()||'Il est l’heure de se réveiller !',true);
function dismissAlarm(){stopNotificationChime();alarmIsSimulation=false;$('snoozeAlarm').disabled=false;stopAlarmSound();if(alarmNotification){alarmNotification.close();alarmNotification=null}if($('alarmAlert').open)$('alarmAlert').close()}
$('stopAlarm').onclick=dismissAlarm;
$('snoozeAlarm').onclick=()=>{savedAlarm={at:Date.now()+5*60000,message:ringingMessage};persistAlarm();refreshAlarmUI();dismissAlarm()};
$('alarmAlert').addEventListener('cancel',event=>{event.preventDefault();dismissAlarm()});$('alarmSettings').addEventListener('close',()=>{if(!$('alarmAlert').open)stopAlarmSound()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkAlarm()});window.addEventListener('pageshow',checkAlarm);setInterval(checkAlarm,500);refreshAlarmUI();queueMicrotask(checkAlarm);

const NIGHT_KEY='versace-night-shift-v1',NIGHT_PHRASE='LE MODE NIGHT SHIFT ACTIVER';
let nightConfig={enabled:false,voiceURI:'',lastDate:''},nightUtterance=null;
try{const config=JSON.parse(localStorage.getItem(NIGHT_KEY)||'null');if(config)nightConfig={enabled:config.enabled===true,voiceURI:typeof config.voiceURI==='string'?config.voiceURI:'',lastDate:typeof config.lastDate==='string'?config.lastDate:''}}catch(e){}
function saveNight(){try{localStorage.setItem(NIGHT_KEY,JSON.stringify(nightConfig))}catch(e){}}
function nightVoices(){return 'speechSynthesis' in window?speechSynthesis.getVoices().filter(voice=>/^fr(?:-|_)/i.test(voice.lang)||voice.lang==='fr'):[]}
function defaultNightVoice(voices){return voices.find(v=>/Henri|Thomas|Mathieu|Nicolas|Rémy|Remy|Claude|Paul|Fabrice|Antoine|Alain|Jean|Denis/i.test(v.name)&&/Natural|Neural|Premium|Enhanced|Améliorée/i.test(v.name))||voices.find(v=>/Henri|Thomas|Mathieu|Nicolas|Rémy|Remy|Claude|Paul|Fabrice|Antoine|Alain|Jean|Denis/i.test(v.name))||voices.find(v=>/Natural|Neural|Premium|Enhanced/i.test(v.name))||voices.find(v=>v.lang==='fr-FR')||voices[0]}
function populateNightVoices(){const voices=nightVoices(),select=$('nightVoice');select.replaceChildren();const auto=document.createElement('option');auto.value='';auto.textContent='Voix masculine française · automatique';select.append(auto);voices.forEach(v=>{const option=document.createElement('option');option.value=v.voiceURI;option.textContent=v.name+' · '+v.lang;select.append(option)});select.value=nightConfig.voiceURI;select.disabled=!('speechSynthesis' in window)}
function refreshNight(){const active=nightConfig.enabled;$('nightScreenStatus').hidden=!active;$('nightEnabled').checked=active;$('nightBadge').textContent=active?'ON · 00:00':'OFF';$('nightButton').classList.toggle('armed',active);$('nightButton').setAttribute('aria-label',active?'Night Shift Mode activé':'Night Shift Mode désactivé');$('nightStatus').textContent=active?'Activé : annonce chaque jour à minuit, heure de Paris.':'Annonce de minuit désactivée.'}
let spokenLoopTimer=null,spokenLoopText=null,spokenLoopGeneration=0;
function stopSpokenNotification(){++spokenLoopGeneration;spokenLoopText=null;clearTimeout(spokenLoopTimer);clearTimeout(nightSpeechTimer);stopNotificationChime();if('speechSynthesis' in window)speechSynthesis.cancel()}
function startSpokenNotification(text,withChime=false){stopSpokenNotification();spokenLoopText=text;speakNotification(text,withChime,true)}
function speakNotification(text,withChime=true,loop=false){const generation=spokenLoopGeneration;if(!('speechSynthesis' in window)){$('nightStatus').textContent='La synthèse vocale n’est pas disponible dans ce navigateur.';return}speechSynthesis.cancel();const voices=nightVoices(),voice=voices.find(v=>v.voiceURI===nightConfig.voiceURI)||defaultNightVoice(voices);nightUtterance=new SpeechSynthesisUtterance(text);nightUtterance.lang='fr-FR';nightUtterance.rate=.9;nightUtterance.pitch=.9;nightUtterance.volume=1;if(voice)nightUtterance.voice=voice;nightUtterance.onend=()=>{if(loop&&spokenLoopText===text&&generation===spokenLoopGeneration){clearTimeout(spokenLoopTimer);spokenLoopTimer=setTimeout(()=>{if(generation===spokenLoopGeneration&&spokenLoopText===text)speakNotification(text,false,true)},900)}};nightUtterance.onerror=()=>{$('nightStatus').textContent='La voix n’a pas pu démarrer. Touchez TESTER L’ANNONCE VOCALE.'};clearTimeout(nightSpeechTimer);if(withChime){playNotificationChime();nightSpeechTimer=setTimeout(()=>speechSynthesis.speak(nightUtterance),850)}else speechSynthesis.speak(nightUtterance)}
function speakNight(){speakNotification(NIGHT_PHRASE)}
function parisMidnightParts(timestamp=Date.now()){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(timestamp));const values=Object.fromEntries(parts.map(p=>[p.type,p.value]));return {date:values.year+'-'+values.month+'-'+values.day,hour:values.hour,minute:values.minute}}
function checkNightShift(){if(!nightConfig.enabled||document.visibilityState!=='visible')return;const now=parisMidnightParts();if(now.hour!=='00'||now.minute!=='00'||nightConfig.lastDate===now.date)return;nightConfig.lastDate=now.date;saveNight();document.querySelector('#nightAlert h2').textContent='NIGHT SHIFT';if($('nightSettings').open)$('nightSettings').close();pauseForNotification();if(!$('nightAlert').open)$('nightAlert').showModal();startSpokenNotification(NIGHT_PHRASE,true);if('Notification' in window&&Notification.permission==='granted'){try{new Notification('VERSACE · NIGHT SHIFT',{body:NIGHT_PHRASE,icon:new URL('assets/medusa-deck.png',location.href).href,tag:'versace-night-shift'})}catch(e){}}}
$('nightButton').onclick=()=>{populateNightVoices();refreshNight();$('nightSettings').showModal()};$('closeNightSettings').onclick=()=>$('nightSettings').close();
$('nightEnabled').onchange=()=>{nightConfig.enabled=$('nightEnabled').checked;saveNight();refreshNight();if(nightConfig.enabled){keepPlayerScreenOn();speakNight();if('Notification' in window&&Notification.permission==='default')Notification.requestPermission().catch(()=>{})}else{stopSpokenNotification()}};
$('nightVoice').onchange=()=>{nightConfig.voiceURI=$('nightVoice').value;saveNight()};$('testNightVoice').onclick=speakNight;
function closeNightAlert(){stopSpokenNotification();$('nightAlert').close()};$('closeNightAlert').onclick=closeNightAlert;$('nightAlert').addEventListener('cancel',event=>{event.preventDefault();closeNightAlert()});
if('speechSynthesis' in window)speechSynthesis.addEventListener('voiceschanged',populateNightVoices);
document.addEventListener('visibilitychange',checkNightShift);window.addEventListener('pageshow',checkNightShift);setInterval(checkNightShift,1000);refreshNight();checkNightShift();

function simulateAlarmNotification(){if($('notificationDemo').open)$('notificationDemo').close();const message=$('alarmMessage').value.trim()||(savedAlarm&&savedAlarm.message)||'Il est l’heure de se réveiller !';ringAlarm(message,true)}
function simulateNightNotification(){if($('notificationDemo').open)$('notificationDemo').close();if($('nightSettings').open)$('nightSettings').close();pauseForNotification();document.querySelector('#nightAlert h2').textContent='NIGHT SHIFT · SIMULATION';if(!$('nightAlert').open)$('nightAlert').showModal();startSpokenNotification(NIGHT_PHRASE,true)}
$('simulateAlarm').onclick=simulateAlarmNotification;$('simulateNight').onclick=simulateNightNotification;$('demoAlarm').onclick=simulateAlarmNotification;$('demoNight').onclick=simulateNightNotification;$('closeNotificationDemo').onclick=()=>$('notificationDemo').close();
if(new URLSearchParams(location.search).get('demo')==='notifications')$('notificationDemo').showModal();

})();
