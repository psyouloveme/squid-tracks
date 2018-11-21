import React from 'react';
import { Table, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const SalmonEnemyHeader = ({ player = { player: {} } }) => (
  <thead>
    <tr>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.player"
          defaultMessage="Player"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.weapon"
          defaultMessage="Weapon"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.bossKills"
          defaultMessage="Boss Kills"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.deaths"
          defaultMessage="Deaths"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.specials"
          defaultMessage="Special"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.goldenEggs"
          defaultMessage="Golden Eggs"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.powerEggs"
          defaultMessage="Power Eggs"
        />
      </th>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.revives"
          defaultMessage="Revives"
        />
      </th>
    </tr>
  </thead>
);

const SalmonEnemyRow = ({ player, playerDropped, thumbBase }) => {
  //TODO: figure out how to tell if someone dropped and re-add strikes/styles
  const { boss_kill_counts } = player;
  const bossKillCount = Object.keys(boss_kill_counts).reduce(function(previous, key) {
    return parseInt(previous) + parseInt(boss_kill_counts[key].count);
  });

  return ( 
    <tr style={{ color: playerDropped ? 'lightgrey' : undefined }} >
      <td>
        {
          playerDropped ? 
            (<strike>{player.name}</strike>)
          : 
            (player.name)
        }
      </td>

      <td style={{ textAlign: 'center', background: 'darkgrey' }}>
        {player.weapon_list.map((weapon) => {
          return (
            <OverlayTrigger placement='bottom' overlay={
              <Tooltip id={'weapon-' + weapon.weapon.id + '-' + player.pid}>
                          {weapon.weapon.name}
              </Tooltip>}
            >
            <Image
              src={thumbBase + weapon.weapon.thumbnail}
              style={{ maxHeight: 30 }}
              alt={weapon.name}
              title={weapon.name}
            />
            </OverlayTrigger>
        )})}
      </td>
      <td>
        {bossKillCount}        
      </td>
      <td>
        {player.dead_count}
      </td>
      <td>{player.special.name}</td>
      <td>{player.golden_ikura_num}</td>
      <td>{player.ikura_num}</td>
      <td>{player.help_count}</td>
    </tr>
  );
};


const SalmonWaveTable = ({ wave }) => {
  <Table striped bordered condensed hover>
  <tbody>
    <tr>
      <th></th>
      <td></td>
    </tr>
  </tbody>
  </Table>
};

const SalmonEnemyStatTable = ({ wave_details, job_result }) => {
  const lastWave = job_result.is_clear ? 3 : job_result.failure_wave;
  console.log("wave_details", wave_details);
  console.log("job_result", job_result);
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
    // <Table striped bordered condensed hover>
    //   <SalmonTeamHeader player={team[0]} />
    //   <tbody>
    //     {team.map(player => (
    //       <SalmonPlayerRow
    //         key={player.pid}
    //         player={player}
    //         playerDropped={false}
    //         thumbBase={'https://app.splatoon2.nintendo.net'}
    //       />
    //     ))}
    //   </tbody>
    //   {/* <tfoot>
    //     <tr>
    //       <th>
    //         <FormattedMessage
    //           id="resultDetails.teamStats.header.totals"
    //           defaultMessage="Totals"
    //         />
    //       </th>
    //       <th />
    //       {team[0].player.udemae ? <th /> : null}
    //       <td>
    //         {team.reduce((sum, player) => sum + player.game_paint_point, 0)}
    //       </td>
    //       <td>{`${total_k + total_a} (${total_a})`}</td>
    //       <td>{`${total_k} / ${total_d}`}</td>
    //       <td>{`${total_s}`}</td>
    //     </tr>
    //   </tfoot> */}
    // </Table>
  );
};

export default SalmonEnemyStatTable;
