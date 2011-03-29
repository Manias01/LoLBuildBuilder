<?php
echo file_get_contents("http://www.leagueoflegends.com/items");

/*
include_once('simple_html_dom.php');
//echo file_get_contents(");

$get = $_GET;
if(isset($get))
{
	$html = file_get_html("http://www.leagueoflegends.com/items");
	switch($get['ri'])
	{
		case "filters":
			echo prepareFilters($html);
		break;
		case "items":
			echo prepareItems($html);
		break;
		default:
			echo 0;
		break;
	}
}

function prepareFilters($html)
{
	$filters = null;
	
	
	
	return $filters;
}

function prepareItems($html)
{
	$jsonItems = null;
	
	foreach ($html->find("table[class=champion_item]") as $item)
	{
		echo gettype($item);
		$itemIcon = $item->find("td[class=item_icon]");
		echo gettype($itemIcon);
		$itemImgLoc = $itemIcon->find("img")->getAttribute("src");
		echo gettype($itemImgLoc);
		//echo itemImgLoc;
	}
	
	return $jsonItems;
}*/
?>