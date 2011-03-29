/*		Copyright:	Robert Diebels
 * 		Author:		Robert Diebels
 * 		Version:	0.1 beta
 *		Updates:	03-03-2010,	Creation.
 *					24-03-2010,	Added full documentation.
 *
 *		To-do:		NULL
 */
 
/*
 * 		Description:	Item class, takes an item ID, item Name, item Description, item Goldcost, item total Goldcost, item imagelocation, built into item IDs and build from item IDs as parameters.
 *		Params:			id,		Int containgin the item's ID. Used for comparing the item to other items. MUST BE UNIQUE!
 *						name,	String containing the item's name.
 *						desc,	String conataining the description of the item.
 *						gc,		Int containing the item's cost.
 *						tgc,	Int containing the total cost for the item. So the item's cost and the cost of other items used to create the item.
 *						imgLoc, String containing the location/path of the image related to the item. Depending on where the application is placed you can provide a relative or absolute path.
 *						biii,	Array containing Int's which are ID's of items that build into this item. In other words, ID's of items that require this item in order to be build.
 *						bfii, 	Array containing Int's which are ID's of items that are built from this item. In other words, ID's of items that this item requires in order to be build.
 *						tier,	Int representing the tier the item is in. For example: 
 *								Consumables are Tier 0, they build into nothing and require nothing.
 *								Long Sword is Tier 1, it builds into an item but require no items to be build
 *								Brutalizer is Tier 2, it builds into an item and requires an item to be build (Long Sword).
 *								Youmuu's Ghost Blade is Tier 3, it builds into nothing but requires an item that requires an item (Brutalizer).
 *								Tier 4 and up, tiers are automatically assigned based on each item's bfii Array and it's biii Array. 
 *								If you add an item that requires a Tier 3 item it will automatically become a Tier 4 item. 
 *								Add an item that requires a tier 4 item than it becomes a tier 5 item etc.
 *						type,	Array of Strings that represent the item's types. Attack Damage, Ability Power etc.
 */						
function Item(id, name, desc, gc, tgc, imgloc, biii, bfii, tier, type)
{
	//Class variables.
	this.id = parseInt(id);
	this.name = name;
	this.desc = desc;
	this.gc = parseInt(gc);
	this.tgc = parseInt(tgc);
	this.imgloc = imgloc;
	this.tier = parseInt(tier);
	
	this.biii = biii;
	this.bfii = bfii;
	
	this.type = type;
}

function isItem(obj)
{
	if(obj instanceof Item)
	{
		return true;
	}
	else
	{
		return false;
	}
}