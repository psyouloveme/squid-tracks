import React from 'react';
import {
  ButtonToolbar,
  Button,
  ButtonGroup,
  Glyphicon,
  DropdownButton,
  MenuItem
} from 'react-bootstrap';
import { defineMessages, injectIntl } from 'react-intl';
import { ipcRenderer } from 'electron';
import StatInkManualButton from './results-upload-manual-button';
import ResultsPoller from './results-poller-button';
import { event } from '../analytics';
import ResultsUploadAll from './results-upload-all-battles';

class SalmonResultControl extends React.Component {
  messages = defineMessages({
    refresh: {
      id: 'salmonresults.refreshButton.refresh',
      defaultMessage: 'Refresh'
    },
    refreshed: {
      id: 'salmonresults.refreshButton.refreshed',
      defaultMessage: 'Refreshed'
    }
  });

  state = {
    tokenExists: false,
    refreshing: false
  };

  componentDidMount() {
    const token = ipcRenderer.sendSync('getStatInkApiToken');
    this.setState({ tokenExists: token.length > 0 });
  }

  render() {
    const {
      result,
      resultIndex,
      changeResult,
      getResults,
      results,
      setStatInkInfo,
      statInk,
      intl
    } = this.props;

    const currentBattle = result.job_id ? result.job_id : 0;
    const uploaded = statInk ? statInk[currentBattle] != null : false;

    return (
      <ButtonToolbar style={{ marginBottom: 10 }}>
        <Button
          onClick={() => {
            getResults();
            event('results', 'refresh');
            this.setState({ refreshing: true });
            setTimeout(() => this.setState({ refreshing: false }), 2000);
          }}
          disabled={this.state.refreshing}
        >
          {this.state.refreshing
            ? intl.formatMessage(this.messages.refreshed)
            : intl.formatMessage(this.messages.refresh)}
        </Button>
        <ButtonGroup>
          <Button
            onClick={() => changeResult(resultIndex + 1)}
            disabled={resultIndex === results.length - 1}
          >
            <Glyphicon glyph="triangle-left" />
          </Button>
          <DropdownButton title={currentBattle} id={'battles'}>
            {results.map((result, idx) => (
              <MenuItem
                key={result.job_id}
                onClick={() => changeResult(idx)}
              >
                {result.job_id}
              </MenuItem>
            ))}
          </DropdownButton>
          <Button
            onClick={() => changeResult(resultIndex - 1)}
            disabled={resultIndex === 0}
          >
            <Glyphicon glyph="triangle-right" />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <StatInkManualButton
            result={result}
            currentBattle={currentBattle}
            // disabled={!tokenExists}
            disabled={true}
            uploaded={uploaded}
            setStatInkInfo={setStatInkInfo}
          />
        </ButtonGroup>
        <ResultsPoller
          getResults={getResults}
          result={result}
          // disabled={!tokenExists}
          disabled={true}
          setStatInkInfo={setStatInkInfo}
        />
        <ResultsUploadAll statInk={statInk} disabled={true} setStatInkInfo={setStatInkInfo} />
      </ButtonToolbar>
    );
  }
}

export default injectIntl(SalmonResultControl);
