/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"43A2916F-B896-402A-A417-2C33966F7E5C"}
 */
function onActionBtnLavoratori(event) {

	var lkpName = 'AG_Lkp_Lavoratori';
//	var lkpName = globals.getTipologiaDitta(idditta) ? 'AG_Lkp_LavoratoriEsterni' : 'AG_Lkp_Lavoratori';
	var pkLavoratore = globals.ma_utl_showLkpWindow({ event: event, lookup: lkpName, methodToAddFoundsetFilter: 'filterLkpLavoratori', allowInBrowse: true });
	if(pkLavoratore)
			globals.lookupFoundset(pkLavoratore, foundset);
	
}

/**
 *
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"58F7FCD6-4CBF-47D7-92C2-BC06D2316F00"}
 */
function filterLkpLavoratori(fs)
{
	fs.addFoundSetFilterParam('idditta','=',idditta);
	return fs;
}