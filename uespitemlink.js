var EsoItemLinkPopup = null;
var EsoItemLinkPopup_Visible = false;
var EsoItemLinkPopup_CacheId = "";
var EsoItemLinkPopup_Cache = { };


function CreateEsoItemLinkPopup()
{
	EsoItemLinkPopup = $('<div />').addClass('eso_item_link_popup').hide();
	$('body').append(EsoItemLinkPopup);
}


function ShowEsoItemLinkPopup(parent, itemId, level, quality, showSummary, intLevel, intType, itemLink)
{
	var linkSrc = "http://esoitem.uesp.net/itemLink.php?&embed";
	
	if (itemId)  linkSrc += "&itemid=" + itemId;
	if (itemLink) linkSrc += "&link=\'" + encodeURIComponent(itemLink) + "\'";
	if (intLevel) linkSrc += "&intlevel=" + intLevel;
	if (intType) linkSrc += "&inttype=" + intType;
	if (level) linkSrc += "&level=" + level;
	if (quality) linkSrc += "&quality=" + quality;
	if (showSummary) linkSrc += "&summary";
	if (EsoItemLinkPopup == null) CreateEsoItemLinkPopup();
	
	var position = $(parent).offset();
	var width = $(parent).width();
	EsoItemLinkPopup.css({ top: position.top-50, left: position.left + width });
	EsoItemLinkPopup_Visible = true;
	
	var cacheId = "";
	
	if (itemId) 
		cacheId = itemId.toString();
	else if (itemLink)
		cacheId = itemLink.toString();
	else if (intLevel && intType)
		cacheId = "INT_" + intLevel.toString() + "_" + intType.toString();
	
	if (level) cacheId += "-L" + level.toString();
	if (quality) cacheId += "-Q" + quality.toString();
	if (showSummary) cacheId += "-S";
	EsoItemLinkPopup_CacheId = cacheId;
	
	if (cacheId != "" && EsoItemLinkPopup_Cache[cacheId] != null)
	{
		EsoItemLinkPopup.html(EsoItemLinkPopup_Cache[cacheId]);
		EsoItemLinkPopup.show();
	}
	else
	{
		EsoItemLinkPopup.load(linkSrc, "", function() {
			if (EsoItemLinkPopup_Visible) EsoItemLinkPopup.show();
			if (cacheId != "" && cacheId == EsoItemLinkPopup_CacheId) EsoItemLinkPopup_Cache[cacheId] = EsoItemLinkPopup.html();
		});
	}
}


function HideEsoItemLinkPopup()
{
	EsoItemLinkPopup_Visible = false;
	if (EsoItemLinkPopup == null) return;
	EsoItemLinkPopup.hide();
}


function OnEsoItemLinkEnter()
{
	ShowEsoItemLinkPopup(this, $(this).attr('itemid'), $(this).attr('level'), $(this).attr('quality'), $(this).attr('summary'), $(this).attr('intlevel'), $(this).attr('inttype'), $(this).attr('itemlink'));
}


function OnEsoItemLinkLeave()
{
	HideEsoItemLinkPopup();
}


$( document ).ready(function() {
	$('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
});