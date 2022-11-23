// Button Variables
var closeBtn = document.getElementById('closeBtn');
var minimizeBtn = document.getElementById('minimizeBtn');
var helpBtn = document.getElementById('helpBtn');
var recoveryBtn = document.getElementById('recoveryBtn');
var registerBtn = document.getElementById('registerBtn');
// Button Loading Checkers
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        IPC.send('closeApp');
    });
};
if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
        IPC.send('minimizeApp');
    });
};
if (helpBtn) {
    helpBtn.addEventListener('click', () => {
        IPC.send('helpCenter');
    });
};
if (recoveryBtn) {
    recoveryBtn.addEventListener('click', () => {
        IPC.send('recoverPassword');
    });
};
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        IPC.send('registerNow');
    });
}