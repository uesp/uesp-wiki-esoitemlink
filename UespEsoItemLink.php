<?php

/*
 * UespEsoItemLink -- by DAve Humphrey, dave@uesp.net, December 2014
 * 
 * Adds the <esoitemlink> tag extension to MediaWiki for displaying ESO item link popup.
 *
 * TODO:
 * 		- Unify JS/CSS files with the EsoLog project (prevent duplicate code)
 * 		- Add parameters:
 * 			- nolink (don't link to the item page)
 * 			- color?
 * 			- itemlink
 * 			- enchant data
 * 		- Feedback/display when loading tooltip
 */

$wgHooks['ParserFirstCallInit'][] = 'uespEsoItemLinkParserInit';
$wgHooks['BeforePageDisplay'][] = 'uesoEsoItemLink_beforePageDisplay';


function uesoEsoItemLink_beforePageDisplay(&$out) {
	global $wgScriptPath, $wgUser;
	
	$out->addHeadItem("uesp-esoitemlink-css", "<link rel='stylesheet' href='//esolog-static.uesp.net/resources/esoitemlink_embed.css?14March2017' />");
	$out->addHeadItem("uesp-esoitemlink-js", "<script src='$wgScriptPath/extensions/UespEsoItemLink/uespitemlink.js?14March2017'></script>");
	
	// ESO-Morrowind Beta Permission Code
	$groups = $wgUser->getGroups();
	
	$_SESSION['uesp_eso_morrowind'] = 123456;
	
	foreach ($groups as $group)
	{
		if ($group == 'esomorrowind')
		{
			$_SESSION['uesp_eso_morrowind'] = 654321;
		}
	} // End ESO-Morrowind Beta Permission

	return true;
}


function uespEsoItemLinkParserInit(Parser $parser)
{
	$parser->setHook('esoitemlink', 'uespRenderEsoItemLink');
	return true;
}


function uespRenderEsoItemLink($input, array $args, Parser $parser, PPFrame $frame)
{
	$output = "";
	$itemId = "";
	$itemLevel = "";
	$itemQuality = "";
	$itemLink = "";
	$itemIntType = "";
	$itemIntLevel = "";
	$showSummary = false;
	$questId = "";
	$collectId = "";
	$enchantFactor = "";
	$version = "";
	$color = "";
	$trait = "";
	
	foreach ($args as $name => $value)
	{
		$name = strtolower($name);
		
		if ($name == "itemid")
			$itemId = $value;
		elseif ($name == "level")
			$itemLevel = $value;
		elseif ($name == "quality")
			$itemQuality = $value;
		elseif ($name == "summary")
			$showSummary = $value;
		elseif ($name == "link" || $name == "itemlink")
			$itemLink = $value;
		elseif ($name == "inttype")
			$itemIntType = $value;
		elseif ($name == "intlevel")
			$itemIntLevel = $value;
		elseif ($name == "questid")
			$questId = $value;
		elseif ($name == "collectid")
			$collectId = $value;
		elseif ($name == "enchantfactor")
			$enchantFactor = $value;
		elseif ($name == "color")
			$color = $value;
		elseif ($name == "version")
			$version = $value;
		elseif ($name == "trait")
			$trait = $value;		
	}
	
	$itemURL = "//esoitem.uesp.net/itemLink.php?";
	if ($questId != "") $itemURL .= "&questid=$questId";
	if ($collectId != "") $itemURL .= "&collectid=$collectId";
	if ($itemId != "") $itemURL .= "&itemid=$itemId";
	if ($itemLink != "") $itemURL .= "&link=\"$itemLink\"";
	if ($itemIntLevel != "") $itemURL .= "&intlevel=$itemIntLevel";
	if ($itemIntType != "") $itemURL .= "&inttype=$itemIntType";
	if ($itemLevel != "") $itemURL .= "&level=$itemLevel";
	if ($itemQuality != "") $itemURL .= "&quality=$itemQuality";
	if ($enchantFactor != "") $itemURL .= "&enchantfactor=$enchantFactor";
	if ($showSummary != "") $itemURL .= "&summary";
	if ($version != "") $itemURL .= "&version=$version";
	if ($trait != "") $itemURL .= "&trait=$trait";
	
	if ($itemQuality == "")
	{
		$qualityClass = "eso_item_link_q0";
		if ($questId != "" || $collectId != "") $qualityClass = "eso_item_link_q1";
	}
	else
	{
		$qualityClass = "eso_item_link_q" . $itemQuality;
	}
	
	if ($questId != "") $attributes .= "questid='$questId' ";
	if ($collectId != "") $attributes .= "collectid='$collectId' ";
	if ($itemId != "") $attributes = "itemid='$itemId' ";
	if ($itemLevel != "") $attributes .= "level='$itemLevel' ";
	if ($itemQuality != "") $attributes .= "quality='$itemQuality' ";
	if ($itemIntLevel != "") $attributes .= "intlevel='$itemIntLevel' ";
	if ($itemIntType != "") $attributes .= "inttype='$itemIntType' ";
	if ($itemLink != "") $attributes .= "itemlink='$itemLink' ";
	if ($enchantFactor != "") $attributes .= "enchantfactor='$enchantFactor' ";
	if ($showSummary != "") $attributes .= "summary='1' ";
	if ($color != "") $attributes .= "style=\"color: $color !important;\" ";
	if ($version != "") $attributes .= "version='$version' ";
	if ($trait != "") $attributes .= "trait='$trait' ";
	
	$output = "<a href='$itemURL' class='eso_item_link $qualityClass' $attributes>$input</a>";
	
	return $output;
}



