const { ipcMain } = require('electron');
const Store = require('./store');

const salmonStore = new Store({
  configName: 'salmon',
  defaults: {}
});

ipcMain.on('setSalmonToStore', (event, salmon) => {
  
  salmonStore.set(salmon.job_id, salmon);
  event.returnValue = true;
});

ipcMain.on('getSalmonFromStore', (event, number) => {
  
  const job = salmonStore.get(number);
  if (job == null) {
    event.returnValue = null;
    return;
  }
  event.returnValue = job;
});