var EsoItemLinkPopup = null;
var EsoItemLinkPopup_Visible = false;
var EsoItemLinkPopup_LastItemId = -1;
var EsoItemLinkPopup_LastLevel = -1;
var EsoItemLinkPopup_LastQuality = -1;
var EsoItemLinkPopup_Cache = { };


function CreateEsoItemLinkPopup()
{
	EsoItemLinkPopup = $('<div />').addClass('eso_item_link_popup').hide();
	$('body').append(EsoItemLinkPopup);
}


function ShowEsoItemLinkPopup(parent, itemId, level, quality)
{
	var linkSrc = "http://esoitem.uesp.net/itemLink.php?itemid=" + itemId + "&embed";
	
	if (level) linkSrc += "&level=" + level;
	if (quality) linkSrc += "&quality=" + quality;
	if (EsoItemLinkPopup == null) CreateEsoItemLinkPopup();
	
	var position = $(parent).offset();
	var width = $(parent).width();
	EsoItemLinkPopup.css({ top: position.top-50, left: position.left + width });
	EsoItemLinkPopup_Visible = true;
	
	cacheId = itemId.toString();
	if (level) cacheId += "-L" + level.toString();
	if (quality) cacheId += "-Q" + quality.toString();
	
	if (EsoItemLinkPopup_LastItemId == itemId && EsoItemLinkPopup_LastLevel == level && EsoItemLinkPopup_LastQuality == quality)
	{
		EsoItemLinkPopup.show();
	}
	else if (EsoItemLinkPopup_Cache[cacheId] != null)
	{
		EsoItemLinkPopup.html(EsoItemLinkPopup_Cache[cacheId]);
		EsoItemLinkPopup.show();
	}
	else
	{
		EsoItemLinkPopup.load(linkSrc, "", function() { 
			EsoItemLinkPopup_LastItemId = itemId; 
			EsoItemLinkPopup_LastLevel = level;
			EsoItemLinkPopup_LastQuality = quality;
			
			EsoItemLinkPopup_Cache[cacheId] = EsoItemLinkPopup.html();
			
			if (EsoItemLinkPopup_Visible) EsoItemLinkPopup.show(); 
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
	ShowEsoItemLinkPopup(this, $(this).attr('itemid'), $(this).attr('level'), $(this).attr('quality'));
}


function OnEsoItemLinkLeave()
{
	HideEsoItemLinkPopup();
}


$( document ).ready(function() {
	$('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
});