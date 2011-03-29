/*		Copyright:	Robert Diebels
 * 		Author:		Robert Diebels
 * 		Version:	0.1 beta
 *		Updates:	29-03-2010,	Creation.
 *
 *		To-do:		NULL
 */

function buildBuilder_init()
{
	$("#buildmenu").tabs({
		selected: -1,
		collapsible: true
	});

	championBuild_init();
	
	//itemBuild_init(itemBuild_globals());
}