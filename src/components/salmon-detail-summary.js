import React from 'react';
import { Row, Col, ProgressBar, Label } from 'react-bootstrap';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import LobbyColors from './lobby-colors';

const labelStyle = {
  fontSize: 16,
  fontWeight: 'normal',
  marginRight: 5,
  float: 'left',
  marginBottom: 5,
  padding: '.35em .6em .35em'
};


const LeagueLabels = ({ result, colorMap }) => {
  return (
    <React.Fragment>
      {result.league_point != null ? (
        <Label style={{ background: colorMap.normal, ...labelStyle }}>
          <FormattedMessage
            id="salmonresultDetails.summary.currentPower"
            defaultMessage="Current Power {power}"
            values={{ power: result.league_point }}
          />
        </Label>
      ) : null}
      {result.max_league_point != null && result.max_league_point > 0 ? (
        <Label style={{ background: colorMap.dark, ...labelStyle }}>
          <FormattedMessage
            id="resultDetails.summary.maxPower"
            defaultMessage="Max Power {power}"
            values={{ power: result.max_league_point }}
          />
        </Label>
      ) : null}
    </React.Fragment>
  );
};

const BattleLabels = ({ result }) => {
  const lobby = 'coop';
  const colorMap = LobbyColors[lobby];
  return (
    <React.Fragment>
      <Label
        bsStyle={result.job_result.is_clear ? 'info' : 'warning'}
        style={labelStyle}
      >
        <FormattedMessage
          id="salmonresultDetails.summary.resultInElapsedTime"
          defaultMessage="{result}{conj}{wave}"
          values={{
            result: result.job_result.is_clear ? 'Victory' : result.job_result.failure_reason,
            conj: result.job_result.is_clear ? '' : ' on wave ',
            wave: result.job_result.is_clear ? '' : result.job_result.failure_wave
          }}
        />
      </Label>
      <Label style={{ background: colorMap.normal, ...labelStyle }}>
        {'coop'}
      </Label>

      {/* <LeagueLabels result={result} colorMap={colorMap} />
      <XRankLabels result={result} colorMap={colorMap} />
      <FestivalLabels result={result} colorMap={colorMap} />
      <RankedLabels result={result} colorMap={colorMap} />
      <TurfLabels result={result} colorMap={colorMap} /> */}
    </React.Fragment>
  );
};


const JobSummary = ({ result }) => {
  // const myScore =
  //   result.my_team_count == null
  //     ? result.my_team_percentage
  //     : result.my_team_count;
  // const otherScore =
  //   result.other_team_count == null
  //     ? result.other_team_percentage
  //     : result.other_team_count;
  // const totalScore = myScore + otherScore;
  // const myNow = myScore * 100 / totalScore;
  // const otherNow = otherScore * 100 / totalScore;
  const { is_clear, failure_reason, failure_wave } = result.job_result
  
  // use simple third here so a loss is at 99%
  const jobResult = is_clear ? 100 : failure_wave * (33);
  const jobFailure = 100 - jobResult;

  return (
    <div>
      <Row>
        <Col md={12}>
          <h2 style={{ marginTop: 0 }}>
            <FormattedMessage
              id="salmonresultDetails.summary.title"
              defaultMessage="{rule} on {map}"
              values={{
                rule: 'Salmon Run',
                map: result.schedule.stage.name
              }}
            />
          </h2>
        </Col>
      </Row>
      <Row>
        <Col md={12} style={{ marginTop: -8, marginBottom: 10 }}>
          <FormattedDate
            value={new Date(result.play_time * 1000)}
            year="numeric"
            month="long"
            day="2-digit"
          />{' '}
          <FormattedTime value={new Date(result.play_time * 1000)} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <BattleLabels result={result} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <ProgressBar style={{ height: 30 }}>
            <ProgressBar
              striped
              now={jobResult}
              bsStyle="info"
              label={jobResult}
              key={1}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
            <ProgressBar
              striped
              now={jobFailure}
              bsStyle="warning"
              label={jobFailure}
              key={2}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
          </ProgressBar>
        </Col>
      </Row>
    </div>
  );
};


export default JobSummary;
