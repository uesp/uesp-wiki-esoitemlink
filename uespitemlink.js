var EsoItemLinkPopup = null;
var EsoItemLinkPopup_LastElement = null;
var EsoItemLinkPopup_Visible = false;
var EsoItemLinkPopup_CacheId = "";
var EsoItemLinkPopup_Cache = { };


function CreateEsoItemLinkPopup()
{
	EsoItemLinkPopup = $('<div />').addClass('eso_item_link_popup').hide();
	$('body').append(EsoItemLinkPopup);
}


function ShowEsoItemLinkPopup(parent, itemId, level, quality, showSummary, intLevel, intType, itemLink, setCount, questId, collectId, enchantId, enchantIntLevel, enchantIntType, enchantFactor, potionData)
{
	EsoItemLinkPopup_LastElement = parent;
	
	var linkSrc = "http://esoitem.uesp.net/itemLink.php?&embed";
	var dataOk = false;
	
	if (questId) { linkSrc += "&questid=" + questId; dataOk = true; }
	if (collectId) { linkSrc += "&collectid=" + collectId; dataOk = true; }
	if (itemId) { linkSrc += "&itemid=" + itemId; dataOk = true; }
	if (itemLink) { linkSrc += "&link=\'" + encodeURIComponent(itemLink) + "\'"; dataOk = true; }
	if (intLevel) linkSrc += "&intlevel=" + intLevel;
	if (intType) linkSrc += "&inttype=" + intType;
	if (level) linkSrc += "&level=" + level;
	if (quality) linkSrc += "&quality=" + quality;
	if (enchantId) linkSrc += "&enchantid=" + enchantId;
	if (enchantIntLevel) linkSrc += "&enchantintlevel=" + enchantIntLevel;
	if (enchantIntType) linkSrc += "&enchantinttype=" + enchantIntType;
	if (enchantFactor) linkSrc += "&enchantfactor=" + enchantFactor;
	if (potionData) linkSrc += "&potiondata=" + potionData;
	if (showSummary) linkSrc += "&summary";
	if (setCount != null && setCount >= 0) linkSrc += "&setcount=" + setCount;
	
	if (!dataOk) return false;
	
	if (EsoItemLinkPopup == null) CreateEsoItemLinkPopup();
	
	var position = $(parent).offset();
	var width = $(parent).width();
	EsoItemLinkPopup.css({ top: position.top-50, left: position.left + width });
	EsoItemLinkPopup_Visible = true;
	
	var cacheId = "";
	
	if (itemLink)
	{
		cacheId = itemLink.toString();
	}
	else if (intLevel && intType)
	{
		cacheId = itemId.toString() + "_INT_" + intLevel.toString() + "_" + intType.toString();		
	}
	else if (itemId) 
	{
		cacheId = itemId.toString();
	}
	else if (questId) 
	{
		cacheId = "Q-" + questId.toString();
	}
	else if (collectId) 
	{
		cacheId = "C-" + collectId.toString();
	}
	
	if (level) cacheId += "-L" + level.toString();
	if (quality) cacheId += "-Q" + quality.toString();
	if (showSummary) cacheId += "-S";
	if (setCount) cacheId += "-SC" + setCount.toString();
	if (enchantFactor) cacheId += "-EF" + enchantFactor.toString();
	
	if (enchantId)
	{
		cacheId += "-E" + enchantId.toString() + "-" + enchantIntLevel.toString() + "-" + enchantIntType.toString();
	}
	
	EsoItemLinkPopup_CacheId = cacheId;
	
	if (cacheId != "" && EsoItemLinkPopup_Cache[cacheId] != null)
	{
		EsoItemLinkPopup.html(EsoItemLinkPopup_Cache[cacheId]);
		EsoItemLinkPopup.show();
		AdjustEsoItemLinkTooltipPosition(EsoItemLinkPopup, $(parent));
	}
	else
	{
		$.get(linkSrc, function(data) {
			if (EsoItemLinkPopup_LastElement == null) return;
			if (EsoItemLinkPopup_LastElement !== parent) return;
			EsoItemLinkPopup.html(data);
			if (EsoItemLinkPopup_Visible) EsoItemLinkPopup.show();
			if (cacheId != "" && cacheId == EsoItemLinkPopup_CacheId) EsoItemLinkPopup_Cache[cacheId] = data;
			AdjustEsoItemLinkTooltipPosition(EsoItemLinkPopup, $(parent));
		});
	}
}


function AdjustEsoItemLinkTooltipPosition(tooltip, parent)
{
     var windowWidth = $(window).width();
     var windowHeight = $(window).height();
     var toolTipWidth = tooltip.width();
     var toolTipHeight = tooltip.height();
     var elementHeight = parent.height();
     var elementWidth = parent.width();
     
     var top = parent.offset().top - 150;
     var left = parent.offset().left + parent.outerWidth() + 3;
     
     tooltip.offset({ top: top, left: left });
     
     var viewportTooltip = tooltip[0].getBoundingClientRect();
     
     if (viewportTooltip.bottom > windowHeight) 
     {
    	 var deltaHeight = viewportTooltip.bottom - windowHeight + 10;
         top = top - deltaHeight
     }
     else if (viewportTooltip.top < 0)
     {
    	 var deltaHeight = viewportTooltip.top - 10;
         top = top - deltaHeight
     }
         
     if (viewportTooltip.right > windowWidth) 
     {
         left = left - toolTipWidth - parent.width() - 28;
     }
     
     tooltip.offset({ top: top, left: left });
     viewportTooltip = tooltip[0].getBoundingClientRect();
     
     if (viewportTooltip.left < 0 )
     {
    	 var el = $('<i/>').css('display','inline').insertBefore(parent[0]);
         var realOffset = el.offset();
         el.remove();
         
         left = realOffset.left - toolTipWidth - 3;
         tooltip.offset({ top: top, left: left });
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
	var $this = $(this);
	EsoItemLinkPopup_LastElement = $this;
	
	ShowEsoItemLinkPopup(EsoItemLinkPopup_LastElement, $this.attr('itemid'), $this.attr('level'), $this.attr('quality'), 
			$this.attr('summary'), $this.attr('intlevel'), $this.attr('inttype'), $this.attr('itemlink'), $this.attr('setcount'),
			$this.attr('questid'), $this.attr('collectid'), $this.attr('enchantid'), $this.attr('enchantintlevel'),
			$this.attr('enchantinttype'), $this.attr('enchantfactor'), $this.attr('potiondata'));
}


function OnEsoItemLinkLeave()
{
	EsoItemLinkPopup_LastElement = null;
	HideEsoItemLinkPopup();
}


$( document ).ready(function() {
	$('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
});