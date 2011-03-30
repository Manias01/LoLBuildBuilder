/*		Copyright:	Robert Diebels
 * 		Author:		Robert Diebels
 * 		Version:	0.1 beta
 *		Updates:	03-03-2010,	Creation.
 *					20-03-2010, Added full documentation.
 *					23-03-2010, Added itemcost merging for the build list.
 *							  ,	Added application settings tab.
 *					24-03-2010,	Added documentation for item cost merging methods.
 *
 *		To-do:		Rename and restucture _globals object.
 *					Improve item cost merging techniques
 *					Add user inputted item cost merging.
 */

/*
 *	Description: Set's all globally used variables and returns them as an object.
 *	Params: None.
 *	Returns: Object containing all _globals and globals.
 *
 *	User-info: If you change the HTML be sure to alter the refrences to the jQuery objects in the html globals as well.
 */
function setItemBuildEventHandlers(_globals)
{	
	$("input",_globals.html.buildmenu.settings.self).click(function(e){changeInSettings(e,_globals);});
	_globals.html.buildmenu.itemmenu.tabs.buildlist.change(function(e){buildListChanged(e);});
	
	
	_globals.html.buildmenu.itemmenu.tabs.buildlist.droppable({
		 drop: 
			 function(event, ui) 
		 	{
			 	_globals.html.buildmenu.itemmenu.tabs.buildlist.append(createClickableItemImage(ui.draggable.data("item"),ui.draggable.data("itemsList"),_globals));
				_globals.html.buildmenu.itemmenu.tabs.buildlist.data({"_globals": _globals,"item":ui.draggable.data("item"), "itemsList":ui.draggable.data("itemsList")});
			 	_globals.html.buildmenu.itemmenu.tabs.buildlist.change();
		 	}
	});
}

/*
 *	Description: 	Event handler for a change in the settings.
 *	Params:			e,			Event object that got triggered by a change in the settings.
 *					_globals, 	Contains all globals of the application.
 *	Returns: 		Nothing.
 *
 *	User-info: 		Do not alter this method unless you know what you're doing.
 */
function changeInSettings(e,_globals)
{
	var source = $(e.target);
	
	switch(source.attr("id"))
	{
		case _globals.html.buildmenu.settings.itembuild.goldinfo.mergesettings.merge.attr("id"):
			var itemsInBuild = $(".itemImage", _globals.html.buildmenu.itemmenu.tabs.buildlist);
			if(_globals.html.buildmenu.settings.itembuild.goldinfo.mergesettings.merge.attr("checked") == true)
			{	
				_globals.application.settings.goldinfo.merge = true;

				setBuildGoldInfo(_globals);
			}
			else
			{	
				_globals.application.settings.goldinfo.merge = false;
				
				for(var i = 0; i < itemsInBuild.length ; i++)
				{
					$(itemsInBuild[i]).data("GoldInfoMergeInfo",{merged: false, mergedwith: null});
				}
				setBuildGoldInfo(_globals);
			}
		
		break;
	}
}

var maxTier;
/*
 *	Description: 	Set's all globally used variables and returns them as an object.
 *	Params:			_globals, 	Contains all globals of the application.
 *	Returns: 		Object containing all _globals and globals.
 *
 *	User-info: 		If you change the HTML be sure to alter the refrences to the jQuery objects in the html globals as well.
 */
function itemBuild_init(_globals)
{
	setItemBuildEventHandlers(_globals);
	var itemsList = getItemInfo(_globals);
	maxTier = setItemTiers(itemsList);
	createTierDivs(maxTier,_globals);
	createSelectionImages(itemsList, null, _globals);
	_globals.html.buildmenu.itemmenu.tabs.self.tabs({
		selected: -1,
		collapsible: true
	});
}

/*
 *	Description: 		Gets all the items from a certain point and places the information of each item in a universal Item object.
 *						Those Items are than returned in an array.
 *	Params:				_globals, 	Contains all globals of the application.
 *	Returns: 			Array containing Item objects.
 *
 *	User-info: 			Alter this method in to get the information from somewher else. 
 *						However do not change the part where the information is inserted into an Item object and added to the itemsList array. 
 *						That array is used throughout the application and altering either the Item object or that Array will cause the application to stop working.
 */
function getItemInfo(_globals)
{
	var itemsList = new Array();
	$.ajax({
		   type: "GET",
		   url: "php/GetInfo.php?info=items",
		   async: false,
		   success:  
			function(results)
			{
				var HTMLitemsList = $("div#list_view", $(results));
				var allItems = $("table.champion_item", $(HTMLitemsList));

				var filterList = $("ul#filter_list", $(results));
				var filterOrgs = $("div.filter_org",$(filterList));
				
				$(filterOrgs).each(
					function()
					{
						$(this).wrap('<ul class="filter_type_ul" />').contents().unwrap().closest('ul');
					}
				);
				
				var filterTypes = $("ul.filter_type_ul",$(filterList));
				var li = document.createElement("li");
				$(li).attr("id","filter_type_li");
				$(filterTypes).wrapAll($(li));
				
				var ulFilterTypeContainer = document.createElement("ul");
				$(ulFilterTypeContainer).attr("id","filter_type_container");
				$("li#filter_type_li",$(filterList)).wrapAll($(ulFilterTypeContainer));
				
				var ulHeaderContainer = document.createElement("ul");
				$(ulHeaderContainer).attr("id","ul_header_container");
				$("li.filter_list_header",$(filterList)).wrapAll($(ulHeaderContainer));
				
				_globals.html.buildbuilder.itembuild.filterlist.html($(filterList).html());

				var itemDetailTooltips = $("div.item_detail_tooltip",$(results));
	
				for(var i = 0; i< $(allItems).length; i++)
				{
					var item = $(allItems)[i];
					var itemIcon = $("td.item_icon", $(item));
					var imgLoc = $("img", $(itemIcon)).attr("src");
					var itemId = parseInt($("a.lol_item", $(itemIcon)).attr("href").split("#")[1]);
 
							var itemProps = $("td.description", $(item));
					var itemName = $("span.highlight", $(itemProps)).text();
 
							var itemDetail = $(itemDetailTooltips)[i];
							var itemDesc = $("p.item_description", $(itemDetail)).text();
 
							var goldInfo = $("span.big", $(item)).html().split(/<br[^>]*>/gi);
					var itemCost = parseInt(goldInfo[0]);
					var itemTotalCost = parseInt(goldInfo[2]);

					var itemType = $(item).parent().attr("class").split(" ");
					itemType.shift();
					
					var buildLists = $("ul.minilist", $(itemProps));
					var buildsIntoItemIDs = new Array();
					var builtFromItemIDs = new Array();
					
					switch($(buildLists).size())
					{
						case 0: 
							buildsIntoItemIDs = null;
							builtFromItemIDs = null;
							break;
						case 1: 
							$("a.lol_item",$(buildLists)).each(
									function(i)
									{
										if($("div:contains('Built From')", $(itemProps)).length != 0)
										{
											builtFromItemIDs[i] = parseInt($(this).attr("href").split("#")[1]);
											buildsIntoItemIDs = null;
										}
										if($("div:contains('Builds Into')", $(itemProps)).length != 0)
										{
											buildsIntoItemIDs[i] = parseInt($(this).attr("href").split("#")[1]);
											builtFromItemIDs = null;
										}
									});
							break; 
						case 2:
							$("a.lol_item",$(buildLists)[0]).each
							(
									function(i)
									{
										builtFromItemIDs[i] = parseInt($(this).attr("href").split("#")[1]);
									}
							);
							$("a.lol_item",$(buildLists)[1]).each
							(
									function(i)
									{
										buildsIntoItemIDs[i] = parseInt($(this).attr("href").split("#")[1]);
											}
									);
									break;
							}
							itemsList[i] = new Item(itemId, itemName, itemDesc, itemCost, itemTotalCost, imgLoc, buildsIntoItemIDs, builtFromItemIDs, 0, itemType);
						}
					}
				}
		  	);
 
			var checkBoxes = $(".checkbx", _globals.html.buildbuilder.itembuild.filterlist);
	$(checkBoxes).each(
			function()
			{
				$(this).bind("change",{ "itemsList": itemsList, "checkBoxes": checkBoxes, "_globals" : _globals }, function(event){createSelectionImages(event.data.itemsList,event.data.checkBoxes,event.data._globals);});
			}
	);
  	
	return itemsList;
}
 
/*
 *	Description: 		Loops through each item and calls setItemTier() to set that items Tier.
 *	Params:				itemsList,	Array containing Item objects.
 *	Returns: 			maxTier,	Highest tier an item can be in.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function setItemTiers(itemsList)
{
	var maxTier = 0;
	for(var i = 0; i < itemsList.length; i++)
	{
		var item = itemsList[i];
		if(item.biii == null && item.bfii == null)
		{
			item.tier = 0;
		}
		else
		{
			setItemTier(item,itemsList, null);
			if(item.tier > maxTier)
			{
				maxTier = item.tier;
			}
		}		
	}
	return maxTier;
}
 
/*
 *	Description: 		Sets the tier for any provided item.
 *	Params:				item,		Item object for which the tier must be set.
 *						itemsList, 	Array containing Item objects.
 *						child,		Item object which is a child of the supplied item. 
 *									Meaning that this item is necessary to build the item Item object variable.
 *	Returns: 			False if the Item object doesn't build into another item otherwise it returns nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function setItemTier(item,itemsList,child)
{	
	if(child == null)
	{
		if(item.biii == null)
		{
			return false;
		}
		else
		{
			if(item.bfii == null)
			{
				item.tier = 1;
			}
			
			var itemParent;
			for(var i = 0; i< item.biii.length; i++)
			{
				for(var j = 0; j < itemsList.length; j++)
				{
					if(item.biii[i] == itemsList[j].id)
					{
						itemParent = itemsList[j];
						setItemTier(itemParent, itemsList, item);
					}
				}
			}
		}
	}
	else
	{
		if(item.bfii != null)
		{
			if(child.tier+1 > item.tier )
			{
				item.tier = child.tier+1;
			}
					
			if(item.biii == null)
			{
				return false;
			}
			else
			{
				var itemParent;
				for(var i = 0; i< item.biii.length; i++)
				{
					for(var j = 0; j < itemsList.length; j++)
					{
						if(item.biii[i] == itemsList[j].id)
						{
							itemParent = itemsList[j];
							setItemTier(itemParent, itemsList, item);
						}
					}
				}
			}
		}
	}
}

/*
 *	Description: 		Creates the tier divs to place the Item objects in.
 *	Params:				maxTier,	Highest tier an item can be in.
 *						_globals,	Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			If you don't want the items to be visibly placed into a tier don't call this method.
 *						However be sure to remove any references to the tier divs anywhere else in the application.
 */
function createTierDivs(maxTier,_globals)
{
	for(var i = maxTier; i >= 0; i--)
	{
		var divTier = document.createElement("div");
		$(divTier).attr("id","tier"+i);
		$(divTier).addClass("tier");
		_globals.html.buildbuilder.itembuild.tiers.append($(divTier));
	}
}
 
/*
 *	Description: 		Creates the visual representation of the items and appends them to the HTML.
 *						Each time a filter is clicked this this method is called in order to refresh the selectable items.
 *	Params:				itemsList,	Array containing Item objects.
 *						checkBoxes,	Array which contains the checked filters.
 *						_globals,	Contains all globals of the application.
 *	Returns: 			
 *
 *	User-info: 			If you're not calling the createTierDivs alter this method to ensure the items are still appended to the correct HTML element.
 */
function createSelectionImages(itemsList, checkBoxes,_globals)
{
	for(var i = maxTier; i >= 0; i--)
	{
		var divTier = $("#tier"+i, _globals.html.buildbuilder.itembuild.tiers);
		$(divTier).html("");
	}
	if(checkBoxes == null)
	{
		for(var i = 0; i < itemsList.length; i++)
		{
			var item = itemsList[i];
			$("div#tier"+item.tier).append($(createClickableItemImage(item,itemsList,_globals)));
		}
	}
	else
	{
		var checkedCheckboxes = new Array();
		for(var i = 0; i < $(checkBoxes).length; i++)
		{
			var checkbox = $(checkBoxes)[i];
			if($(checkbox).attr('checked'))
			{
				checkedCheckboxes[checkedCheckboxes.length] = checkbox;
			}
		}
		for(var j = 0; j < itemsList.length; j++)
		{
			var amountOfSameTypes = 0;
			var item = itemsList[j];
			
			for(var k = 0; k < checkedCheckboxes.length; k++)
			{
				var checkBox = checkedCheckboxes[k];
				for( var l = 0; l < item.type.length; l++)
				{
					if(item.type[l] == $(checkBox).val())
					{
						amountOfSameTypes++;
					}
				}
			}
			if(amountOfSameTypes ==  checkedCheckboxes.length)
			{
				$("div#tier"+item.tier).append($(createClickableItemImage(item,itemsList,_globals)));
			}
		}
	}
}

/*
 *	Description: 		Creates an Image Element which will represent an Item object.
 *	Params:				item,		Item object which the image Element will visually represent.
 *						itemList,	Array containing Item objects.
 *						_globals,	Contains all globals of the application.
 *	Returns: 			A visual representation of an Item object.
 *
 *	User-info: 			If you've altered the z-index of any element in the CSS files make sure you alter the z-index in this method for the start event of the draggable setting.
 *						Other than that don't alter this method if you don't know what you're doing.
 */
function createClickableItemImage(item,itemsList,_globals)
{
	var itemImg = document.createElement("img");
	
	$(itemImg).addClass("itemImage");
	$(itemImg).addClass(item.id);
	$(itemImg).attr("src",item.imgloc);
	$(itemImg).attr("alt",item.name);

	$(itemImg).data({"item":item,"itemsList":itemsList, "_globals":_globals, "GoldInfoMergeInfo": {merged: false, mergedwith: null}});
	
	$(itemImg).bind("click", function(e){itemImageClicked(e);});
	$(itemImg).bind("dblclick", function(e){itemImageDoubleClicked(e);});
	$(itemImg).hover(function(e){setItemHover(e);},function(e){_globals.html.buildbuilder.itembuild.itemhover.self.css({"display":"none"});});
	$(itemImg).draggable({ revert: true, start:function(event, ui) {$(this).css("z-index","4");}, drag: function(event, ui){_globals.html.buildbuilder.itembuild.itemhover.self.css({"display":"none"});},stop: function(event, ui) { $(this).css("z-index","1");}});
	 
	return itemImg;
}
 
/*
 *	Description: 		Event handler for when a visual representation of an Item Object is clicked once.
 *	Params:				e,	Event Object launched as a result of a visual representation of an Item object being clicked once.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function itemImageClicked(e)
{
	var source = $(e.target);
	var item = source.data("item");
	var itemsList = source.data("itemsList");
	var _globals = source.data("_globals");
	
	setItemGoldInfo(item,_globals);
	createBuiltFromView(item,itemsList,_globals);
	createBuildsIntoView(item,itemsList,_globals);
}

/*
 *	Description: 	Event handler for when a visual representation of an Item Object is double-clicked.
 *	Params:			e,	Event Object launched as a result of a visual representation of an Item object being double-clicked.
 *	Returns: 		Object containing all _globals and globals.
 *
 *	User-info: 		If you change the HTML be sure to alter the refrences to the jQuery objects in the html globals as well.
 */
function itemImageDoubleClicked(e)
{
	addToBuildList(e);
}


/*
 *	Description: 	Event handler for when the build list is changed.
 *	Params:			e,	Event object launched when the build list is changed.
 *	Returns: 		Nothing.
 *
 *	User-info: 		Do not alter this method unless you know what you're doing.
 */
function buildListChanged(e)
{	
	var source = $(e.target);
	
	var item = source.data("item");
	var itemsList = source.data("itemsList");
	var _globals = source.data("_globals");
	
	setBuildGoldInfo(_globals);
}

/*
 *	Description: 		Sets the the item gold information in the "Gold info" tab.
 *	Params:				item,		Selected visual representation of an Item object.
 *						_globals,	Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function setItemGoldInfo(item,_globals)
{
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.item.name.text(item.name);
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.item.cost.text(item.tgc);
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.item.minionwave.text(Math.ceil(item.tgc/((_globals.gameinfo.minions.melee.gold.base*_globals.gameinfo.minions.wave.minionsperwave.melee)+
			(_globals.gameinfo.minions.caster.gold.base*_globals.gameinfo.minions.wave.minionsperwave.caster)+
			(_globals.gameinfo.minions.siege.gold.base*_globals.gameinfo.minions.wave.minionsperwave.siege))));
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.item.meleeminion.text(Math.ceil(item.tgc / _globals.gameinfo.minions.melee.gold.base));
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.item.casterminion.text(Math.ceil(item.tgc / _globals.gameinfo.minions.caster.gold.base));
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.item.siegeminion.text(Math.ceil(item.tgc / _globals.gameinfo.minions.siege.gold.base));
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.item.superminion.text(Math.ceil(item.tgc / _globals.gameinfo.minions.superminion.gold.base));
}
	
/*
 *	Description: 		Sets the the build cost information in the "Gold info" tab.
 *	Params:				_globals,	Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function setBuildGoldInfo(_globals)
{
	var itemsInBuild = $(".itemImage", _globals.html.buildmenu.itemmenu.tabs.buildlist);
	
	if(_globals.application.settings.goldinfo.merge == true)
	{	
		for(var i = 0 ; i < itemsInBuild.length; i++)
		{
			var startItemImage = $(itemsInBuild[i]);
			setMergeInfo(startItemImage, itemsInBuild, getBfiiParents(startItemImage.data("item"),startItemImage.data("itemsList")),_globals);
		}
	}
	
	var buildCost = getBuildCost(itemsInBuild, _globals);
	
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.build.cost.text(buildCost);
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.build.minionwave.text(Math.ceil(buildCost/((_globals.gameinfo.minions.melee.gold.base*_globals.gameinfo.minions.wave.minionsperwave.melee)+
			(_globals.gameinfo.minions.caster.gold.base*_globals.gameinfo.minions.wave.minionsperwave.caster)+
			(_globals.gameinfo.minions.siege.gold.base*_globals.gameinfo.minions.wave.minionsperwave.siege))));
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.build.meleeminion.text(Math.ceil(buildCost / _globals.gameinfo.minions.melee.gold.base));
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.build.casterminion.text(Math.ceil(buildCost / _globals.gameinfo.minions.caster.gold.base));
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.build.siegeminion.text(Math.ceil(buildCost/ _globals.gameinfo.minions.siege.gold.base));
	_globals.html.buildmenu.itemmenu.tabs.goldinfo.build.superminion.text(Math.ceil(buildCost / _globals.gameinfo.minions.superminion.gold.base));
}

/*
 *	Description: 		Get's the total build cost depending whether or not an item's cost got merged with another item's cost.
 *	Params:				itemsInBuild,	Array containing visual representations of Item objects.
 *						_globals,		Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function getBuildCost(itemsInBuild, _globals)
{	
	var buildCost = 0;
	if(itemsInBuild.length != 0)
	{	
		for(var i = 0; i < itemsInBuild.length ; i++)
		{
			var currentItemImage = $(itemsInBuild[i]);
			var itemObj = currentItemImage.data("item");
			
			if(currentItemImage.data("GoldInfoMergeInfo").merged == true)
			{
				buildCost += 0;
			}
			else
			{
				buildCost += itemObj.tgc;
			}
		}
	}
	return buildCost;
}

/*
 *	Description: 		Set's the items in the build list their merge information.
 *	Params:				item,			Item object which doesn't need have it's merge information set.
 *						itemsInBuild,	Array containing visual representations of Item objects.
 *						bfiiParents,	Array containing Item objects that the item which needs it's
 *						_globals,		Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function setMergeInfo(itemImage, itemsInBuild, bfiiParents,_globals)
{
	for(var i = 0 ; i < bfiiParents.length; i++)
	{
		if($.isArray(bfiiParents[i]))
		{
			setMergeInfo(itemImage, itemsInBuild, bfiiParents[i],_globals);
		}
		else
		{
			var found = true;
			for(var j = 0; j < itemsInBuild.length; j++)
			{				
				if(bfiiParents[i].id == $(itemsInBuild[j]).data("item").id && bfiiParents[i].id != itemImage.data("item").id)
				{
					$(itemsInBuild[j]).data("GoldInfoMergeInfo", {merged: true, mergedwith: bfiiParents[i].id});
				}
				//Check if an item that the itemImage got merged with is still in the build list.
				if(itemImage.data("GoldInfoMergeInfo").mergedwith == $(itemsInBuild[j]).data("item").id)
				{
					found = false;
				}
			}
			if(found == false)
			{
				itemImage.data("GoldInfoMergeInfo", {merged: false, mergedwith: null});
			}
		}
	}
}

/*
 *	Description: 		Calls the methods to append the visual representations of the Item objects, 
 *						needed to build the selected visual representation of an Item object, 
 *						to the HTML.
 *	Params:				item,		Selected visual representation of an Item object.
 *						itemsList,	Array containing Item objects.
 *						_globals,	Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function createBuiltFromView(item, itemsList,_globals)
{
	var bfiiParents = getBfiiParents(item,itemsList);
	if($.isArray(bfiiParents))
	{
		_globals.html.buildbuilder.itembuild.selectionview.builtfrom.html("");
		appendBfiiChildrenToBuiltFromDiv(bfiiParents, itemsList,_globals);
	}
	else
	{
		_globals.html.buildbuilder.itembuild.selectionview.builtfrom.html(createClickableItemImage(bfiiParents,itemsList,_globals));
	}
}
	
/*
 *	Description: 		Loops through the Item objects needed to build the selected visual representation of an Item object and returns them as a visual representation in an Array.
 *	Params:				item,		Item object of the visual represenation of an Item object that was selected.
 *						itemsList,	Array containing Item objects.
 *						_globals,	Contains all globals of the application.
 *	Returns: 			An Array which contains visual representations of all the Item objects required to build the selected visual representation of an Item object.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function getBfiiParents(item,itemsList)
{
	if(item.bfii == null)
	{	
		return item;
	}
	else
	{
		var parents = new Array();
		
		parents[parents.length] = item;
		for(var j = 0; j < item.bfii.length; j++)
		{
			for(var k = 0 ; k < itemsList.length; k++)
			{
				if(item.bfii[j] == itemsList[k].id)
				{							
					parents[parents.length] = getBfiiParents(itemsList[k], itemsList);
				}
			}
		}
		return parents;
	}
}
 
/*
 *	Description: 		Does the actual appending of the visual representations of the Item objects needed to build the selected visual representation of an Item object.
 *	Params:				bfiiChildren,	Array of visual representations of the Item objects needed to build the selected visual representation of an Item object
 *						_globals,		Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function appendBfiiChildrenToBuiltFromDiv(bfiiChildren,itemsList,_globals)
{
	for(var i = 0; i < bfiiChildren.length; i++)
	{
		if($.isArray(bfiiChildren[i]))
		{
			appendBfiiChildrenToBuiltFromDiv(bfiiChildren[i], itemsList,_globals);
		}
		else
		{
			_globals.html.buildbuilder.itembuild.selectionview.builtfrom.append(createClickableItemImage(bfiiChildren[i],itemsList,_globals));
		}
	}
}
 
/*
 *	Description: 		Calls the methods to append the visual representations of the Item objects, 
 *						which the selected visual representation of an Item object builds into, 
 *						to the HTML.
 *	Params:				item,		Item object of the visual represenation of an Item object that was selected.
 *						itemsList,	Array containing Item objects.
 *						_globals,	Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function createBuildsIntoView(item,itemsList,_globals)
{
	var biiiChildren = getBiiiChildren(item, itemsList);
	if($.isArray(biiiChildren))
	{
		_globals.html.buildbuilder.itembuild.selectionview.buildsinto.html("");
		appendBiiiChildrenToBuildsIntoDiv(biiiChildren,itemsList,_globals);
	}
	else
	{
		_globals.html.buildbuilder.itembuild.selectionview.buildsinto.html("none");
	}
	checkedItems = new Array();	
}
 
var checkedItems = new Array();
/*
 *	Description: 		Calls the methods to append the visual representations of the Item objects, 
 *						the selected visual representation of an Item object builds into, 
 *						to the HTML.
 *	Params:				item,		Item object of the visual represenation of an Item object that was selected.
 *						itemsList,	Array containing Item objects.
 *	Returns: 			An array of Item objects.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function getBiiiChildren(item,itemsList)
{
	if(item.biii == null)
	{	
		checkedItems[checkedItems.length] = item;
		return item;
	}
	else
	{
		var children = new Array();
		for(var j = 0; j < item.biii.length; j++)
		{
			for(var k = 0 ; k < itemsList.length; k++)
			{
				if(item.biii[j] == itemsList[k].id)
				{	
					var inAddedItems = false;
					for(var l = 0 ; l < checkedItems.length; l++)
					{
						if(checkedItems[l].id == itemsList[k].id)
						{
							inAddedItems = true;
						}
					}
					if(inAddedItems == false)
					{
						children[children.length] = getBiiiChildren(itemsList[k], itemsList);	
					}					
				}
			}
		}
		return children;
	}
}
	
/*
 *	Description: 		Appends the visual representation of the Item objects the selected visual representation of Item object builds into, to the HTML.
 *	Params:				biiiChildren,	Array of visual representations of the Item objects which the selected visual representation of an Item object builds into.
 *						itemsList,		Array containing Item objects.
 *						_globals,		Contains all globals of the application.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function appendBiiiChildrenToBuildsIntoDiv(biiiChildren, itemsList,_globals)
{
	for(var i = 0 ; i< biiiChildren.length; i++)
	{
		var obj = biiiChildren[i];
		if($.isArray(obj))
		{
			appendBiiiChildrenToBuildsIntoDiv(obj,itemsList,_globals);
		}
		else
		{
			var item = obj;
			var itemHierarchy = document.createElement("div");
			$(itemHierarchy).addClass("buildsintoitemhierarchy");
			
			appendBiiiChildrensBfiiParentsToItemHierarchy(getBfiiParents(item,itemsList), itemsList,itemHierarchy,_globals);
			
			_globals.html.buildbuilder.itembuild.selectionview.buildsinto.append($(itemHierarchy));
		}
	}
}
 
/*
 *	Description: 		Appends the visual representations of the Item objects that are needed to build the Item objects,
 *						the selected visual representation of an Item object builds into, to the HTML.
 *	Params:				bfiiChildren,	Array of visual representations of Item objects needed to build the selected visual representation of an Item objects.
 *						itemHierachy,	HTML element to which the visual representations of Item objects needed to build the selected visual representation of an Item objects, must be appended.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function appendBiiiChildrensBfiiParentsToItemHierarchy(bfiiParents,itemsList,itemHierarchy,_globals)
{
	for(var i = 0; i< bfiiParents.length; i++)
	{
		if($.isArray(bfiiParents[i]))
		{
			appendBiiiChildrensBfiiParentsToItemHierarchy(bfiiParents[i],itemsList ,itemHierarchy,_globals);
		}
		else
		{
			$(itemHierarchy).append(createClickableItemImage(bfiiParents[i],itemsList,_globals));
		}
	}
}
 
/*
 *	Description: 		Appends a copy of the selected visual representation of an Item object to the item build list.
 *	Params:				e,	Event launched as a result of a visual representation of an Item object being double-clicked.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function addToBuildList(e)
{
	var source = $(e.target);
	var item = source.data("item");
	var itemsList = source.data("itemsList");
	var _globals = source.data("_globals");
	
	if(source.parent().attr("id") == _globals.html.buildmenu.itemmenu.tabs.buildlist.attr("id"))
	{
		_globals.html.buildbuilder.itembuild.itemhover.self.css({"display":"none"});
		source.remove();
	}
	else
	{
		_globals.html.buildmenu.itemmenu.tabs.buildlist.append(createClickableItemImage(item,itemsList,_globals));
	}
	_globals.html.buildmenu.itemmenu.tabs.buildlist.data({"_globals": _globals,"item": item, "itemsList": itemsList});
	_globals.html.buildmenu.itemmenu.tabs.buildlist.change();
}

/*
 *	Description: 		Sets the location, content and css of the item information hover HTML element.
 *	Params:				e,	Event launched as a result of a visual representation of an Item object having the mouse hover over it.
 *	Returns: 			Nothing.
 *
 *	User-info: 			Do not alter this method unless you know what you're doing.
 */
function setItemHover(e)
{
	var source = $(e.target);
	var item = source.data("item");
	var itemsList = source.data("itemsList");
	var _globals = source.data("_globals");
	
	_globals.html.buildbuilder.itembuild.itemhover.self.css({"display":"block"});
	_globals.html.buildbuilder.itembuild.itemhover.name.text(item.name);
	_globals.html.buildbuilder.itembuild.itemhover.desc.text(item.desc);
	_globals.html.buildbuilder.itembuild.itemhover.cost.text(item.gc);
	_globals.html.buildbuilder.itembuild.itemhover.totcost.text(item.tgc);
	//Possibly remove mousemove to increase performance..
	source.mousemove(
		function(e)
		{
			if(e.pageX + _globals.html.buildbuilder.itembuild.itemhover.self.width() + 30 >= $(window).width())// || e.pageY + _globals.html.buildbuilder.itembuild.itemhover.self.height() + 30 >= $(window).height())
			{
				if( e.pageX + _globals.html.buildbuilder.itembuild.itemhover.self.width() + 30 >= $(window).width())
				{
					_globals.html.buildbuilder.itembuild.itemhover.self.offset({ top: e.pageY + 10, left: e.pageX - 10 - _globals.html.buildbuilder.itembuild.itemhover.self.width()});
				}
				//Reinsert if's if users prefer function over performance
				/*if( e.pageY + _globals.html.buildbuilder.itembuild.itemhover.self.height() + 10 >= $(window).height())
				{
					_globals.html.buildbuilder.itembuild.itemhover.self.offset({ top: e.pageY - 10 - _globals.html.buildbuilder.itembuild.itemhover.self.height(), left: e.pageX + 10});
				}
				if( e.pageX + _globals.html.buildbuilder.itembuild.itemhover.self.width() + 30 >= $(window).width() && e.pageY + _globals.html.buildbuilder.itembuild.itemhover.self.height() >= $(window).height())
				{
					_globals.html.buildbuilder.itembuild.itemhover.self.offset({ top: e.pageY - 10 - _globals.html.buildbuilder.itembuild.itemhover.self.height() - 10, left: e.pageX - 10 - _globals.html.buildbuilder.itembuild.itemhover.self.width()});
				}*/
			}
			else
			{
				_globals.html.buildbuilder.itembuild.itemhover.self.offset({ top: e.pageY+10, left: e.pageX+10 });
			}
		}
	); 
}