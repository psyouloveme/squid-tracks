import React from 'react';
import { Table, Tooltip, OverlayTrigger } from 'react-bootstrap';

const SalmonEnemyStatTable = ({ wave_details, job_result }) => {
  let wavedata = { 
    one: wave_details[0],
    two: wave_details.length > 0 ? wave_details[1] : null,
    three: wave_details.length > 1 ? wave_details[2] : null,
  };
  const goldenIkaraNumTotal = wave_details.reduce((sum, wave) => sum + wave.golden_ikura_num, 0)
  const goldenIkaraPopNumTotal = wave_details.reduce((sum, wave) => sum + wave.golden_ikura_pop_num, 0)
  const quotaNumTotal = wave_details.reduce((sum, wave) => sum + wave.quota_num, 0)
  const ikuraNumTotal = wave_details.reduce((sum, wave) => sum + wave.ikura_num, 0)
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>Wave 1</th>
          <th>Wave 2</th>
          <th>Wave 3</th>
          <th>Totals</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <OverlayTrigger 
            placement='top' 
            overlay= {
              <Tooltip key={'npq'} id={'tooltip-npq'}>Collected/Total/Quota</Tooltip>
          }>
            <th>Golden Eggs N/P/Q</th>
          </OverlayTrigger>
          <td>
            {wavedata.one.golden_ikura_num}/
            {wavedata.one.golden_ikura_pop_num}/
            {wavedata.one.quota_num}</td>
          <td>
            {wavedata.two != null ? wavedata.two.golden_ikura_num : ''}/
            {wavedata.two != null ? wavedata.two.golden_ikura_pop_num : ''}/
            {wavedata.two != null ? wavedata.two.quota_num : ''}
          </td>
          <td>
            {wavedata.three != null ? wavedata.three.golden_ikura_num : ''}/
            {wavedata.three != null ? wavedata.three.golden_ikura_pop_num : ''}/
            {wavedata.three != null ? wavedata.three.quota_num : ''}
          </td>
          <th>
            {goldenIkaraNumTotal}/{goldenIkaraPopNumTotal}/{quotaNumTotal}
          </th>
        </tr>
        <tr>
          <th>Power Eggs</th>
          <td>{wavedata.one.ikura_num}</td>
          <td>{wavedata.two != null ? wavedata.two.ikura_num : ''}</td>
          <td>{wavedata.three != null ? wavedata.three.ikura_num : ''}</td>
          <th>{ikuraNumTotal}</th>
        </tr>
        <tr>
          <th>Event</th>
          <td>{wave_details[0].event_type.name}</td>
          <td>{wavedata.two != null ? wavedata.two.event_type.name : ''}</td>
          <td>{wavedata.three != null ? wavedata.three.event_type.name : ''}</td>
          <th>&nbsp;</th>
        </tr>
        <tr>
          <th>Water Level</th>
          <td>{wavedata.one.water_level.name}</td>
          <td>{wavedata.two != null ? wavedata.two.water_level.name : ''}</td>
          <td>{wavedata.three != null ? wavedata.three.water_level.name : ''}</td>
          <th>&nbsp;</th>
        </tr>
        <tr>
          <th>&nbsp;</th>
          <td>{job_result.is_clear ? '' : (job_result.failure_wave === 1 ? job_result.failure_reason : '' )}</td>
          <td>{job_result.is_clear ? '' : (job_result.failure_wave === 2 ? job_result.failure_reason : '' )}</td>
          <td>{job_result.is_clear ? '' : (job_result.failure_wave === 3 ? job_result.failure_reason : '' )}</td>
          <th>&nbsp;</th>
        </tr>
      </tbody>
    </Table>
  );
};

export default SalmonEnemyStatTable;
