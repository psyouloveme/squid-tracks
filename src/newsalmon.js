import React from 'react';
import { Subscriber } from 'react-broadcast';
import { FormattedMessage } from 'react-intl';
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap';
import './salmon.css';
import { ipcRenderer } from 'electron';
import SalmonSummaryCard from "./components/salmon-summary-card";
import SalmonResultDetailCard from "./components/salmon-result-detail-card"

class NewSalmon extends React.Component {
  state = {
    currentResultIndex: -1,
    statInk: {},
    initialized: false
  };

  componentDidMount() {
    
    this.getResults();
    const statInkInfo = ipcRenderer.sendSync('getFromStatInkStore', 'info');
    this.setState({
      statInk: statInkInfo,
      initialized: false,
      currentResultIndex: 0
    });
  }

  getResults = () => {
    const { splatnet } = this.props;
    splatnet.comm.updateCoopResults();
  };

  changeResult = arrayIndex => {
    const { splatnet } = this.props;
    const results = splatnet.current.coop_results.results;
    const jobId = results[arrayIndex].job_id;
    splatnet.comm.getSalmon(jobId);
    this.setState({
      currentResultIndex: arrayIndex
    });
  };

  getCurrentSalmon() {
    const { splatnet } = this.props;
    const { currentResultIndex } = this.state;
    const { results } = this.props.splatnet.current.coop_results;
    
    if (
      results[currentResultIndex] == null ||
      results[currentResultIndex].job_id == null
    ) {
      return {};
    }
    const jobId = results[currentResultIndex].job_id;

    if (this.props.splatnet.cache.salmon[jobId] == null) {
      splatnet.comm.getSalmon(jobId);
      return {};
    }

    const job = this.props.splatnet.cache.salmon[jobId];
    return job;
  }



  changeResultByJobId = jobId => {
    const { splatnet } = this.props;
    splatnet.comm.getSalmon(jobId);
    this.setState({
      currentResultIndex: splatnet.current.coop_results.results.findIndex(
        a => a.job_id === jobId
      )
    });
  };

  setStatInkInfo = (jobId, info) => {
    const statInk = this.state.statInk;
    statInk[jobId] = info;
    this.setState({ statInk: statInk });
    ipcRenderer.sendSync('setToSalmonStatInkStore', 'info', statInk);
  };


  render() {
    const { splatnet } = this.props;
    const { coop_results } = splatnet.current;
    const { statInk, currentResultIndex } = this.state;
    const results = this.props.splatnet.current.coop_results.results;
    const currentJob = this.getCurrentSalmon();
    
    //const currentCoop = this.getCurrentSalmon();
    console.log('splatnet: ', splatnet);
    console.log('statInk: ', statInk);
    console.log('results: ', results);
    console.log('coop_results: ', coop_results);
    console.log('currentJob: ', currentJob);
    return (
      <Grid fluid style={{ paddingTop: 65 }}>
        <Row>
          <Col md={12}>
            <h1 style={{ marginTop: 0 }}>
              <FormattedMessage
                id="newsalmon.title"
                defaultMessage="Salmon Run Stats"
              />
            </h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={4} lg={3}>
            <SalmonSummaryCard data={coop_results.summary.card}/>
          </Col>
        </Row>
        <Row>
          <SalmonResultDetailCard
                results={currentJob}
                statInk={statInk}
                changeResult={this.changeResultByBattleNumber}
                summary={results.summary}
              />
        </Row>
      </Grid>
    );
  }
}

const SubscribedSalmonResults = () => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <NewSalmon splatnet={splatnet} />}
    </Subscriber>
  );
};

export default SubscribedSalmonResults;
