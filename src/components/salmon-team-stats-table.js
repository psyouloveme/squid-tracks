import React from 'react';
import { Table, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const SalmonTeamHeader = ({ player = { player: {} } }) => (
  <thead>
    <tr>
      <th>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.player"
          defaultMessage="Player"
        />
      </th>
      <th colSpan={3}>
        <FormattedMessage
          id="salmonresultDetails.teamStats.header.weapon"
          defaultMessage="Weapon"
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
          id="salmonresultDetails.teamStats.header.bossKills"
          defaultMessage="Boss Kills"
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
        <OverlayTrigger 
          placement='top' 
          overlay= {
            <Tooltip key={'deaths'} id={'tooltip-deaths'}>Deaths</Tooltip>
        }>
      <th>
          <FormattedMessage id="salmonresultDetails.teamStats.header.deaths" defaultMessage="D"/>
      </th>
        </OverlayTrigger>
      <OverlayTrigger 
          placement='top' 
          overlay= {
            <Tooltip key={'revives'} id={'tooltip-revives'}>Revives</Tooltip>
        }>
      <th>
          <FormattedMessage id="salmonresultDetails.teamStats.header.revives" defaultMessage="R"/>
      </th>
        </OverlayTrigger>
    </tr>
  </thead>
);

const SalmonPlayerRow = ({ player, playerDropped, thumbBase }) => {
  //TODO: figure out how to tell if someone dropped and re-add strikes/styles
  const { boss_kill_counts } = player;

  const bossKillCount = Object.keys(boss_kill_counts).reduce((sum, key) => sum + parseInt(boss_kill_counts[key].count), 0)

  let weaponToolTips = {}
  for (let weapon of player.weapon_list){
    if (!weaponToolTips.hasOwnProperty(weapon.weapon.id)){
      weaponToolTips[weapon.weapon.id] = (<Tooltip id={'weapon-' + weapon.weapon.id}> {weapon.weapon.name}</Tooltip>);
    }
  }

  return ( 
    <tr style={{ color: playerDropped ? 'lightgrey' : undefined }} >
      <td>
        { playerDropped ? (<strike>{ player.name }</strike>) : (player.name) }
      </td>

      <td colSpan={3} style={{ textAlign: 'center', background: 'darkgrey' }}>
        {player.weapon_list.map((weapon, roundNumber) => {
          return (
            <OverlayTrigger key={roundNumber + '-' + weapon.weapon.id} placement='bottom' overlay={weaponToolTips[weapon.weapon.id]}>
            <Image
              src={thumbBase + weapon.weapon.thumbnail}
              style={{ maxHeight: 30 }}
              alt={weapon.name}
              key={roundNumber + '-' + weapon.weapon.id}
            />
            </OverlayTrigger>
        )})}
      </td>
      <td style={{ textAlign: 'center', background: 'darkgrey' }}>
      {
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip key={player.special.id} id={'weapon-' + player.special.id}>{player.special.name}</Tooltip>
        }>
          <Image
            src={thumbBase + player.special.image_a}
            style={{ maxHeight: 30 }}
            alt={player.special.name}
            key={player.special.id}
          />
        </OverlayTrigger>
      }
      </td>
      <td>{bossKillCount}</td>
      <td>{player.golden_ikura_num}</td>
      <td>{player.ikura_num}</td>
      <td>{player.dead_count}</td>
      <td>{player.help_count}</td>
    </tr>
  );
};

const SalmonTeamStatTable = ({ result, team }) => {
  console.log('team', team);

  const boss_kill_total = team.reduce((sum, player) => {
    return sum + Object.keys(player.boss_kill_counts).reduce((previous, key) => {
      return parseInt(previous) + parseInt(player.boss_kill_counts[key].count);
    }, 0);
  }, 0);
  const golden_egg_total = team.reduce((sum, player) => {
    return sum + player.golden_ikura_num;
  }, 0);
  const power_egg_total = team.reduce((sum, player) => {
    return sum + player.ikura_num;
  }, 0);
  const death_total = team.reduce((sum, player) => {
    return sum + player.dead_count;
  }, 0);
  const help_total = team.reduce((sum, player) => {
    return sum + player.help_count;
  }, 0);

  return (
    <Table striped bordered condensed hover>
      <SalmonTeamHeader player={team[0]} />
      <tbody>
        {team.map(player => (
          <SalmonPlayerRow
            key={player.pid}
            player={player}
            playerDropped={false}
            thumbBase={'https://app.splatoon2.nintendo.net'}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th>
            <FormattedMessage
              id="resultDetails.teamStats.header.totals"
              defaultMessage="Totals"
            />
          </th>
          <th colSpan={3}/>
          <th/>
          <td>{boss_kill_total}</td>
          <td>{golden_egg_total}</td>
          <td>{power_egg_total}</td>
          <td>{death_total}</td>
          <td>{help_total}</td>
        </tr>
      </tfoot>
    </Table>
  );
};

export default SalmonTeamStatTable;
