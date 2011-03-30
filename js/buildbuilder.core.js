/*		Copyright:	Robert Diebels
 * 		Author:		Robert Diebels
 * 		Version:	0.1 beta
 *		Updates:	29-03-2010,	Creation.
 *
 *		To-do:		NULL
 */

function buildBuilder_globals()
{
	var _globals = {
			html : {
				progressbar: {
					self: $("#progressbar"),
					bar: $("#progressbar-bar"),
					status: $("#progressbar-status")
				},
				buildbuilder: {
					self: $("#buildbuilder"),
					header: $("#header"), 
					championbuild:{
						self: $("#championbuild"),
						champions: $("#champions"),
						championinfo: {
							self: $("#championinfo"),
							name: $("#championinfo-name"),
							title: $("#championinfo-title"),
							desc: $("#championinfo-description")
						},
						fancyboxhelper: $("#fancyboxhelper"),
						championimages: $(".championImage")	
					},
					itembuild: {
						self: $("#itembuild"),
						filterlist: $("#item-filterlist"),
						tiers: $("#item-tiers"),
						itemimages: $(".itemImage"),
						selectionview:{
							self:$("#item-selection-view"),
							builtfrom:$("#item-selection-view-builtfrom"),
							buildsinto:$("#item-selection-view-buildsinto")
						},
						itemhover:{
							self:$("#itemhover"),
							name:$("#itemhover-name"),
							desc:$("#itemhover-description"),
							cost:$("#itemhover-cost"),
							totcost:$("#itemhover-totalcost")
						}
					}
				},
				buildmenu:{
					self:$("#buildmenu"),
					championmenu: {
						self: $("#championbuild-menu")
					},
					itemmenu: {
						self: $("#itembuild-menu"),
						tabs: {
							self: $("#itembuild-menu-tabs"),
							buildlist: $("#itembuild-list"),
							goldinfo: {
								self: $("#itembuild-goldinfo"),
								build:{
									self: $("#itembuild-goldinfo-build"),
									cost: $("#itembuild-goldinfo-build-cost"),
									minionwave: $("#itembuild-goldinfo-build-minwavenum"),
									meleeminion: $("#itembuild-goldinfo-build-meleeminnum"),
									casterminion: $("#itembuild-goldinfo-build-castminnum"),
									siegeminion: $("#itembuild-goldinfo-build-siegeminnum"),
									superminion: $("#itembuild-goldinfo-build-supminnum")
								},
								item:{
									self:$("#itembuild-goldinfo-item"),
									name: $("#itembuild-goldinfo-item-name"),
									cost: $("#itembuild-goldinfo-item-cost"),
									minionwave: $("#itembuild-goldinfo-item-minwavenum"),
									meleeminion: $("#itembuild-goldinfo-item-meleeminnum"),
									casterminion: $("#itembuild-goldinfo-item-castminnum"),
									siegeminion: $("#itembuild-goldinfo-item-siegeminnum"),
									superminion: $("#itembuild-goldinfo-item-supminnum")
								}
							}
						}
					},
					settings:{
						self: $("#settings"),
						itembuild: {
							self:$("#settings-itembuild"),
							goldinfo:{
								self:$("#settings-itembuild-goldinfo"),
								mergesettings: {
									self: $("#settings-itembuild-goldinfo-mergesettings"),
									merge:$("#settings-itembuild-goldinfo-mergesettings-merge"),
									inputsettings: {
										self: $("#settings-itembuild-goldinfo-mergesettings-inputsettings"),
										auto: $("#settings-itembuild-goldinfo-mergesettings-inputsettings-auto"),
										user: $("#settings-itembuild-goldinfo-mergesettings-inputsettings-user")
									}
								}
							}
						}
					}
				}
			},
		application :
		{
			globals: {
				maxtier : 0
			},
			settings : {
				goldinfo : {
					merge: true,
					wave : 0
				}
			}
		},
		gameinfo : {
			minions : {
				wave : {
					minionsperwave: {
						melee : 3,
						caster: 4,
						siege: 0.5,
						superminion: 0
					},
					minionspersuperwave: {
						melee : 3,
						caster: 4,
						siege: 0.5,
						superminion: 2
					}
				},
				melee : {
					gold: {
						base: 25,
						addedperwave: 10
					},
					health : {
						base : 100,
						addedperwave: 10
					},
					damage : { 
						base : 30,
						addedperwave: 10
					}
				},
				caster : {
					gold: {
						base: 18,
						addedperwave: 10
					},
					health : {
						base : 100,
						addedperwave: 10
					},
					damage : { 
						base : 30,
						addedperwave: 10
					}
				},
				siege : {
					gold: {
						base: 35,
						addedperwave: 10
					},
					health : {
						base : 100,
						addedperwave: 10
					},
					damage : { 
						base : 30,
						addedperwave: 10
					}
				},
				superminion : {
					gold: {
						base: 45,
						addedperwave: 10
					},
					health : {
						base : 100,
						addedperwave: 10
					},
					damage : { 
						base : 30,
						addedperwave: 10
					}
				}
			},
			towers : {
				gold: {
					base: 10,
					addedperwave: 10
				},
				health : {
					base : 100,
					addedperwave: 10
				},
				damage : { 
					base : 30,
					addedperwave: 10
				}
			},
			inhibs : {
				gold: {
					base: 10,
					addedperwave: 10
				},
				health : {
					base : 100,
					addedperwave: 10
				}
			}
		}
	};
	
	return _globals;
}

function buildBuilder_init(_globals)
{
	_globals.html.buildmenu.self.tabs({
		selected: -1,
		collapsible: true,
		select: function(e,ui){selectedTabInBuildMenu(e,ui,_globals);}
	});
	
	championBuild_init(_globals);
	itemBuild_init(_globals);
}

function selectedTabInBuildMenu(e,ui,_globals)
{
	var source = $(e.target);	
	
	switch($(ui.tab).attr("href").split("#")[1])
	{
		case _globals.html.buildmenu.itemmenu.self.attr("id"):
			_globals.html.buildbuilder.championbuild.self.css("display", "none");
			_globals.html.buildbuilder.itembuild.self.css("display", "block");
		break;
		case _globals.html.buildmenu.championmenu.self.attr("id"): 
			_globals.html.buildbuilder.itembuild.self.css("display", "none");
			_globals.html.buildbuilder.championbuild.self.css("display", "block");
		break;
	}
}