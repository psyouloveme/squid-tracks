# Notes on stat.ink
API spec.  Should keep an eye on this as there should be additions in the future
https://github.com/fetus-hina/stat.ink/blob/master/doc/api-2/post-battle.md

used parameters
```js
{
  uuid // should be unique to battle, can we use result.start_time?

  // game info
  lobby // standard, squad_2, squad_4, private
  mode // regular, gachi, fest, private
  rule // nawabari, area, yagura, hoko
  stage // see stage-map.js, result.stage.id
  start_at //result.start_time
  end_at // add duration to start_time ? result.elapsed_time (seconds)

  // game results
  result // result.my_team_result.key, 'win' or 'lose'
  knock_out // my_team_result.key, use my_team_count == 100 or their_count == 100, 'yes' or 'no'
  my_team_percent // score in turf result.my_team_percentage
  his_team_percent // score in turf result.other_team_percentage
  my_team_count // score in ranked result.my_team_count
  his_team_count // score in ranked result.other_team_count

  // player results
  weapon // see weapon-map.js, result.player_result.player.weapon.id
  kill // result.player_result.kill_count - result.player_result.assist_count
  death // result.player_result.death_count
  kill_or_assist // result.player_result.kill_count
  special // result.player_result.special_count
  level // result.player_result.player.player_rank
  level_after // result.player_rank
  rank // result.player_result.player.player_rank
  rank_after // result.player_result.udemae.name, needs to be lower case?
  my_point // paint points result.player_result.game_paint_point + add winning bonus

  // team results
  players // this is complicated, see code

  // client info
  automated // automated posting or manual, will be automated
  agent // up to 64 characters, agent name "SplatStats"
  agent_version // client determined, up to 255 characters
  agent_custom // client use, stat.ink doesn't care
  agent_variables // key value of client defnition, shown in addition information.  Should experiment with these
}
```

Stuff I haven't figured out.

* there's a link to agent page on stat.ink.  Not sure how to set

Unused battle api params
```js
// unused by this program
players[].my_kill
rank_in_team  // 1 to 4, seems to be all zeros
note // notes for battle, maybe use for tournaments?
max_kill_combo // don't think this is available in splatnet
max_kill_streak // don't think this is available in splatnet
my_team_point // paint points, doesn't seem to exist in splatnet data
his_team_point // paint points, doesn't seem to exist in splatnet data
private_note // note that is only displayed to user
link_url // link related to battle? there's a link to user agent site is this it?
image_judge // png/jpeg screenshot of judge screen
image_result // screenshot of result screen
image_gear // screenshot of gear config
death_reasons // can't do these, ikalog reads screen notification for thses
events // can't do these, ikalog makes events like when the RM is picked up
```



## Salmon Run Notes
Salmon run API spec (beta as of 11-21-2018)
https://github.com/fetus-hina/stat.ink/blob/master/doc/api-2/post-salmon.md

parameters
```js
{
  uuid // Generate a UUID version 5 with namespace 418fe150-cb33-11e8-8816-d050998473ba. Use splatnet_number @ principal_id. (Example: 42@abc123) uuid_v5("418fe150-cb33-11e8-8816-d050998473ba", sprintf("%d@%s", number, principal_id))
  splatnet_number // job_id
  stage // use schedule.stage.image and map like this
        // shaketoba = Lost Outpost, 
        // donburako = Marooner's Bay,
        // polaris = Ruins of Ark Polaris
        // tokishirazu = Salmonid Smokeyard
        // dam = Spawning Grounds
  clear_waves // job_result.is_clear ? 3 : job_result.failure_wave - 1
  fail_reason // job_result.failure_reason
  title // use grade.id and map like this
        // intern = no grade?
        // apprentice = 1
        // part_timer = 2
        // go_getter = 3
        // overachiever = 4 
        // profreshional = 5
  title_exp // 0-999, job_result.grade_point
  title_after // ??
  title_exp_after // ??
  danger_rate // danger_rate
  boss_appearances // map boss_counts to
                   // boss_apperances: {
                   //  name : count,
                   //  ...
                   // }
                   // bosses - name by id:
                   /*
                      key       id spaltnetkey
                      drizzler  21 sakerocket	
                      flyfish    9 sakelien-cup-twins
                      goldie     3 sakelien-golden
                      griller	  16 sakedozer
                      maws	    15 sakediver
                      scrapper	12 sakelien-shield
                      steel_eel	13 sakelien-snake
                      steelhead	 6 sakelien-bomber
                      stinger	  14 sakelien-tower
                   */
  waves // array of wave data
        /*
        "waves": [
          { // wave 1
            "known_occurrence": "mothership", / wave_details[].event_type.key
            "water_level": "normal",          / wave_details.water_level.key
            "golden_egg_quota": 18,           / wave_details.quota_num
            "golden_egg_appearances": 27,     / wave_details.golden_ikura_pop_num
            "golden_egg_delivered": 23,       / wave_details.golden_ikura_num
            "power_egg_collected": 695        / wave_details.ikura_num
          },
          ...
        ]
        */
  my_data /*
            player: {
              splatnet_id : my_result.pid,
              name: my_result.name,
              special: map 8 => jetpack, 9 => chakuchi, 2 => pitcher, 7 => presser,
              rescue: my_result.help_count,
              death: ,
              golden_egg_delivered: ,
              power_egg_delivered: ,
              species: ,
              gender: ,
              special_uses: ,
              weapons: ,
              boss_kills: ,
            }*/
  teammates /
}
```

