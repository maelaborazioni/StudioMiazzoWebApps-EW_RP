/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B9C9BE9B-4B7E-49E3-938F-EAC9D19CBD5D"}
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
 * @properties={typeid:24,uuid:"8CC7DE5F-C3C2-4952-B101-E97299022312"}
 */
function filterLkpLavoratori(fs)
{
	fs.addFoundSetFilterParam('idditta','=',idditta);
	return fs;
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @private
 *
 * @properties={typeid:24,uuid:"034D0E3B-2EED-4DDA-8FAE-E7B5E664556E"}
 */
function onRecordSelection(event, _form) 
{
	_super.onRecordSelection(event, _form);
	var frm = forms.rp_pannello_richieste;
	if(solutionModel.getForm(frm.controller.getName()))
	{
		if(frm.elements.tab_elenco_richieste.tabIndex == 1)
			forms.rp_pannello_richieste_tbl.filtraDaEvadere();
		else
			forms.rp_gestione_richieste_evase_tbl.filtraEvase();
	}
}
