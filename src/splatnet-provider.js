import React from 'react';
import update from 'immutability-helper';
import { withRouter } from 'react-router-dom';
import { Broadcast } from 'react-broadcast';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { languages } from './components/language-select';

class SplatnetProvider extends React.Component {
  state = {
    current: {
      results: {
        summary: {},
        results: []
      },
      coop_results: {
        summary: {
          stats: [],
          card: {}
        },
        results: []
      },
      coop_schedules: { 
        details: [], 
        schedules: [] 
      },
      annieOriginal: [],
      annie: { merchandises: [] },
      schedule: { gachi: [], league: [], regular: [] },
      records: {
        records: { player: { nickname: '' } }
      }
    },
    cache: {
      battles: {},
      salmon: {},
      league: {
        team: {},
        pair: {}
      }
    },
    lastError: {},
    comm: {
      updateCoop: () => {
        ipcRenderer.send('getApiAsync', 'coop_schedules');
      },
      updateCoopResults: () => {
        
        ipcRenderer.send('getApiAsync', 'coop_results');
      },
      getSalmon: (jobId, sync = false) => {
        
        const cachedSalmon = this.state.cache.salmon[jobId];
        if (cachedSalmon != null)
        {
          
          return cachedSalmon;
        }

        const storedSalmon = ipcRenderer.sendSync('getSalmonFromStore', jobId);
        if (storedSalmon != null) {
          this.setSalmonToCache(storedSalmon);
          
          return storedSalmon;
        }

        if (sync) {
          const freshSalmon = ipcRenderer.sendSync(
            'getApi',
            `coop_results/${jobId}`
          );
          this.setSalmonToCache(freshSalmon);
          this.setSalmonToStore(freshSalmon);
          
          return freshSalmon;
        } else {
          ipcRenderer.send('getApiAsync', `coop_results/${jobId}`);
          
          return;
        }
      },
      updateSchedule: () => {
        ipcRenderer.send('getApiAsync', 'schedules');
      },
      updateRecords: () => {
        ipcRenderer.send('getApiAsync', 'records');
      },
      updateMerchandise: () => {
        ipcRenderer.send('getApiAsync', 'onlineshop/merchandises');
      },
      updateResults: () => {
        ipcRenderer.send('getApiAsync', 'results');
      },
      getBattle: (number, sync = false) => {
        const cachedBattle = this.state.cache.battles[number];
        if (cachedBattle != null) {
          return cachedBattle;
        }

        const storedBattle = ipcRenderer.sendSync('getBattleFromStore', number);
        if (storedBattle != null) {
          this.setBattleToCache(storedBattle);
          return storedBattle;
        }

        if (sync) {
          const freshBattle = ipcRenderer.sendSync(
            'getApi',
            `results/${number}`
          );
          this.setBattleToCache(freshBattle);
          this.setBattleToStore(freshBattle);
          return freshBattle;
        } else {
          ipcRenderer.send('getApiAsync', `results/${number}`);
          return;
        }
      }
    }
  };

  componentDidMount() {
    ipcRenderer.on('apiData', this.handleApiData);
    ipcRenderer.on('apiDataError', this.handleApiError);
    ipcRenderer.on('originalAbility', this.handleOriginalAbility);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('apiData', this.handleApiData);
    ipcRenderer.removeListener('apiDataError', this.handleApiError);
  }

  handleApiData = (e, url, data) => {
    console.log(url);
    console.log(data);
    if (url.includes('coop_results/')) {
      this.handleSalmonResult(data)
      return;
    }
    else if (url.includes('results/')) {
      this.handleBattleResult(data);
      return;
    }

    switch (url) {
      case 'coop_schedules':
        this.setState({
          current: update(this.state.current, {
            $merge: { coop_schedules: data }
          })
        });
        return;
      case 'schedules':
        this.setState({
          current: update(this.state.current, { $merge: { schedule: data } })
        });
        return;
      case 'records':
        this.setState({
          current: update(this.state.current, { $merge: { records: data } })
        });
        return;
      case 'results':
        this.setState({
          current: update(this.state.current, { $merge: { results: data } })
        });
        return;
      case 'coop_results':
        this.setState({
          current: update(this.state.current, { $merge: { coop_results: data } })
        });
        return;
      case 'onlineshop/merchandises':
        this.getOriginalAbilities(data);
        // data.original = [];
        this.setState({
          current: update(this.state.current, {
            $merge: { annie: data },
            annieOriginal: { $set: [] }
          })
        });
        return;
      default:
        return;
    }
  };

  getLocalizationString(locale) {
    const localizationRow = languages.find(l => l.code === locale);

    if (localizationRow == null) {
      throw new Error('locale string not found');
    }

    return localizationRow.statInk;
  }

  getOriginalAbilities(data) {
    const localization = this.getLocalizationString(this.props.locale);
    for (const merchandise of data.merchandises) {
      ipcRenderer.send(
        'getOriginalAbility',
        merchandise.kind,
        merchandise.gear.id,
        localization
      );
    }
  }

  handleOriginalAbility = (e, originalAbility) => {
    this.setState({
      current: update(this.state.current, {
        annieOriginal: { $push: [originalAbility] }
      })
    });
  };

  handleBattleResult = battle => {
    this.setBattleToCache(battle);
    this.setBattleToStore(battle);
  };

  handleSalmonResult = salmon => {
    
    this.setSalmonToCache(salmon);
    this.setSalmonToStore(salmon);
  };


  handleApiError = (e, err) => {
    this.setState({ lastError: err });
    this.props.history.push('/error');
    log.error(err);
  };

  setBattleToCache(freshBattle) {
    const number = freshBattle.battle_number;
    const battles = update(this.state.cache.battles, {
      $merge: { [number]: freshBattle }
    });
    this.setState({
      cache: update(this.state.cache, { $merge: { battles: battles } })
    });
  }

  setSalmonToCache(freshSalmon) {
    const number = freshSalmon.job_id;
    
    const salmon = update(this.state.cache.salmon, {
      $merge: { [number]: freshSalmon }
    });
    
    this.setState({
      cache: update(this.state.cache, { $merge: { salmon: salmon } })
    });
    
  }

  setBattleToStore(battle) {
    ipcRenderer.sendSync('setBattleToStore', battle);
  }

  setSalmonToStore(salmon) {
    ipcRenderer.sendSync('setSalmonToStore', salmon);
  }

  render() {
    const { children } = this.props;
    return (
      <Broadcast channel="splatnet" value={this.state}>
        {children}
      </Broadcast>
    );
  }
}

export default withRouter(SplatnetProvider);
