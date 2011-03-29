<?php
if(isset($_GET["info"]))
{
    switch($_GET["info"])
    {
        case "items":
            echo file_get_contents("http://www.leagueoflegends.com/items");
        break;
        case "champions":
            echo file_get_contents("http://www.leagueoflegends.com/champions");
        break;
        case "url":
            if(isset($_GET["url"]))
            {
                $url = "http://www.leagueoflegends.com".$_GET["url"];
                echo file_get_contents($url);
            }
        break;
        default:
            echo null;
        break;
    }
}
?>