/*		Copyright:	Robert Diebels
 * 		Author:		Robert Diebels
 * 		Version:	0.1 beta
 *		Updates:	29-03-2010,	Creation.
 *					30-03-2010,	Added championImage creation method,
 *								championImage click eventhandler
 *								and champion information getter.
 *
 *		To-do:		NULL
 */

function championBuild_init(_globals)
{
	var championsList = getChampionInfo();
	for(var i = 0 ; i < championsList.length; i++)
	{
		_globals.html.buildbuilder.championbuild.champions.append(createClickableChampionImage(championsList[i],championsList,_globals));
	}
	_globals.html.buildbuilder.championbuild.fancyboxhelper.fancybox({
		'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'overlayColor'		: '#000',
		'overlayOpacity'	: 0.7

	});

}


function getChampionInfo()
{
	var championsList = new Array();
	$.ajax({
		   type: "GET",
		   url: "php/GetInfo.php?info=champions",
		   async: false,
		   success:  
			function(results)
			{
			   var DOMchampions = $(".champion", $(results));
			   
			   for(var i = 1; i < DOMchampions.length; i++)
			   {
				   
				   var DOMchamp = $(DOMchampions[i]);
				   var id = null;
				   var name = null;
				   var title = null;
				   var desc = null;
				   var abilities = new Array();
				   var stats = new Array();
				   var imgloc = $("img", DOMchamp).attr("src");
				   
				   if($("a",DOMchamp).attr("href"))
				   {
					   $.ajax({
						   type: "GET",
						   url: "php/GetInfo.php?info=url&url="+$("a",DOMchamp).attr("href"),
						   async: false,
						   success:
							   	function(DOMchampioninfo)
							   	{
							   		var championinfo = $(DOMchampioninfo);
							   		name = $("span.champion_name", championinfo).text();
							   		title = $("span.champion_title", championinfo).text();
							   		desc = $("td.champion_description", championinfo).text();
							   		
							   		var DOMabilities = $("tr", $(".abilities_table"));
							   		
							   		for(var j = 0 ; j < DOMabilities.length; j++)
							   		{
							   			DOMability = DOMablities[j];
							   			var abid = null;
							   			var abname = $(".ability_name", DOMability).text();
							   			var abdesc = $(".ability_description", DOMability).text();
							   			var abstats = $(".ability_stats", DOMability).text();
							   			var abeffect = $(".ability_effect", DOMability).text();
							   			var abimgloc = $("img", DOMability).atrr("src");
							   			
							   			abilities[j] = new Ability(abid, abname, abdesc, abstats, abeffect, abimgloc);
							   		}
							   		
							   	}
						});
				   }
				   championsList[championsList.length] = new Champion(id, name, title, desc, abilities, stats, imgloc);
			   }
			}
	});
	return championsList;
}

function createClickableChampionImage(champion, championsList,_globals)
{
	var championImg = document.createElement("img");
	
	$(championImg).addClass("championImage");
	$(championImg).addClass(champion.id);
	$(championImg).attr("src",champion.imgloc);
	$(championImg).attr("alt",champion.name);
	
	$(championImg).data({"champion":champion,"championsList":championsList, "_globals":_globals});
	
	$(championImg).bind("click", function(e){championImageClicked(e);});
	
	return $(championImg);
}

function championImageClicked(e)
{
	var source = $(e.target);
	var champion = source.data("champion");
	var _globals = source.data("_globals");
	
	_globals.html.buildbuilder.championbuild.championinfo.name.text(champion.name);
	_globals.html.buildbuilder.championbuild.championinfo.title.text(champion.title);
	_globals.html.buildbuilder.championbuild.championinfo.desc.text(champion.desc);
	
	
	_globals.html.buildbuilder.championbuild.fancyboxhelper.trigger("click");
}