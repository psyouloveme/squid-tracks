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


const SalmonLabels = ({ result, colorMap }) => {
  return (
    <React.Fragment>

      {(result.grade_point != null && result.grade != null) ? (
        <Label style={{ background: colorMap.dark, ...labelStyle }}>
          <FormattedMessage
            id="salmonresultDetails.summary.currentGrade"
            defaultMessage="{title} {grade} ({plus}{delta})"
            values={{ 
              title: result.grade.name, 
              grade: result.grade_point,
              plus: result.grade_point_delta > 0 ? '+' : '',
              delta: result.grade_point_delta 
            }}
          />
        </Label>
      ) : null}


      {result.danger_rate != null ? (
        <Label style={{ background: colorMap.dark, ...labelStyle }}>
          <FormattedMessage
            id="salmonresultDetails.summary.hazard"
            defaultMessage="Hazard Level {hazard}%"
            values={{ hazard: result.danger_rate }}
          />
        </Label>
      ) : null}

      {result.danger_rate != null ? (
        <Label style={{ background: colorMap.dark, ...labelStyle }}>
          <FormattedMessage
            id="salmonresultDetails.summary.grizzpoints"
            defaultMessage="{grizzpoints}p"
            values={{ grizzpoints: result.kuma_point }}
          />
        </Label>
      ) : null}
    </React.Fragment>
  );
};

const BattleLabels = ({ result }) => {
  const lobby = 'coop';
  const colorMap = LobbyColors[lobby];
  console.log('battlelabel', result);
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
      <SalmonLabels result={result} colorMap={colorMap} />
    </React.Fragment>
  );
};


const JobSummary = ({ result }) => {
  const { is_clear, failure_reason, failure_wave } = result.job_result
  const last_completed_wave = is_clear ? 3 : failure_wave - 1;
  const incomplete_waves = 3 - last_completed_wave;
  const jobResult = last_completed_wave * (100/3);
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
              label={last_completed_wave > 0 ? (last_completed_wave + (last_completed_wave > 1 ? " Waves" : " Wave")) : '' }
              key={1}
              style={{ fontSize: 16, padding: '.35em 0' }}
            />
            <ProgressBar
              striped
              now={jobFailure}
              bsStyle="warning"
              label={ incomplete_waves > 0 ? (incomplete_waves + (incomplete_waves > 1 ? " Waves" : " Wave")) : ''}
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
